#!/usr/bin/env python3
"""
Convert AIXM Airspace snapshot XML into a GeoJSON with key German AIP airspaces.

Usage:
  python scripts/convert_aixm_edr_to_geojson.py \
    --input public/assets/aip/ED_Airspace_StrokedBorders_2026-03-19_2026-03-19_snapshot.xml \
    --output public/assets/aip/edr_all_from_snapshot.geojson

Notes:
- The script resolves geometry dependencies (e.g. EDR170 -> EDR170A + EDR170B).
- By default it exports all snapshot airspaces (EDR + non-EDR).
- Categories include:
  - EDR areas (`category=edr_outline`)
  - PROTECT areas (`category=military_protect_outline`)
  - MIL LOW FLYING AREA (`category=mil_low_flying_area_outline`)
  - other airspaces (`category=other_airspace_outline`)
- Use `--core-only` to export only EDR + PROTECT + MIL LOW FLYING AREA.
- Requires shapely: pip install shapely
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

from shapely.geometry import GeometryCollection, MultiPolygon, Polygon, mapping
from shapely.geometry.base import BaseGeometry
from shapely.ops import unary_union


NS = {
    "aixm": "http://www.aixm.aero/schema/5.1.1",
    "gml": "http://www.opengis.net/gml/3.2",
    "xlink": "http://www.w3.org/1999/xlink",
}

TAG_POS = f"{{{NS['gml']}}}pos"
TAG_POSLIST = f"{{{NS['gml']}}}posList"


@dataclass
class GeometryComponent:
    operation: str
    operation_sequence: int
    direct_geometry: Optional[BaseGeometry]
    dependency_uuids: List[str] = field(default_factory=list)
    lower_limit: Optional["VerticalLimit"] = None
    upper_limit: Optional["VerticalLimit"] = None


@dataclass(frozen=True)
class VerticalLimit:
    value: str
    uom: str
    reference: str


@dataclass
class AirspaceRecord:
    uuid: str
    designator: str
    name: str
    local_type: str
    airspace_type: str
    interpretation: str
    components: List[GeometryComponent] = field(default_factory=list)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert AIXM airspace snapshot XML to GeoJSON for aviation overlays."
    )
    parser.add_argument("--input", required=True, help="Path to AIXM XML input file")
    parser.add_argument("--output", required=True, help="Path to GeoJSON output file")
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Write pretty-printed GeoJSON (default is compact)",
    )
    parser.add_argument(
        "--core-only",
        action="store_true",
        help="Export only EDR + PROTECT + MIL LOW FLYING AREA (default exports all snapshot airspaces)",
    )
    parser.add_argument(
        "--include-non-edr",
        action="store_true",
        help=argparse.SUPPRESS,  # legacy flag kept for backwards compatibility
    )
    return parser.parse_args()


def first_text(element: Optional[ET.Element], path: str, default: str = "") -> str:
    if element is None:
        return default
    text = element.findtext(path, default=default, namespaces=NS)
    return (text or default).strip()


def extract_uuid_from_href(href: str) -> Optional[str]:
    if not href:
        return None
    m = re.search(r"urn:uuid:([0-9a-fA-F-]{36})", href)
    if m:
        return m.group(1).lower()
    m = re.search(r"([0-9a-fA-F-]{36})", href)
    return m.group(1).lower() if m else None


def parse_coord_text(text: str, stride: int = 2) -> List[Tuple[float, float]]:
    values = [v for v in text.strip().split() if v]
    if not values:
        return []
    floats = [float(v) for v in values]
    if stride < 2:
        stride = 2
    coords: List[Tuple[float, float]] = []
    for i in range(0, len(floats) - (stride - 1), stride):
        lat = floats[i]
        lon = floats[i + 1]
        coords.append((lon, lat))
    return coords


def parse_pos_element(pos_el: ET.Element) -> List[Tuple[float, float]]:
    text = (pos_el.text or "").strip()
    if not text:
        return []
    return parse_coord_text(text, stride=2)


def parse_poslist_element(poslist_el: ET.Element) -> List[Tuple[float, float]]:
    text = (poslist_el.text or "").strip()
    if not text:
        return []
    stride = 2
    srs_dim = poslist_el.get("srsDimension")
    if srs_dim and srs_dim.isdigit():
        stride = int(srs_dim)
    return parse_coord_text(text, stride=stride)


def parse_angle_value(text: str) -> Optional[float]:
    s = (text or "").strip()
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None


def parse_vertical_limit(volume_el: ET.Element, kind: str) -> Optional[VerticalLimit]:
    limit_el = volume_el.find(f"aixm:{kind}Limit", NS)
    reference = first_text(volume_el, f"aixm:{kind}LimitReference", "")
    value = ""
    uom = ""
    if limit_el is not None:
        value = (limit_el.text or "").strip()
        uom = (limit_el.get("uom", "") or "").strip()

    if not value and not reference:
        return None
    return VerticalLimit(value=value, uom=uom, reference=reference)


def radius_to_meters(radius_text: str, uom: str) -> Optional[float]:
    s = (radius_text or "").strip()
    if not s:
        return None
    try:
        value = float(s)
    except ValueError:
        return None

    unit = (uom or "").strip().upper()
    unit_factor = {
        "M": 1.0,
        "METRE": 1.0,
        "METER": 1.0,
        "KM": 1000.0,
        "FT": 0.3048,
        "[FT_I]": 0.3048,
        "[NMI_I]": 1852.0,
        "NMI": 1852.0,
        "NM": 1852.0,
    }
    factor = unit_factor.get(unit)
    if factor is None:
        return None
    return value * factor


def destination_point(lat_deg: float, lon_deg: float, bearing_deg: float, distance_m: float) -> Tuple[float, float]:
    # Great-circle destination on a sphere.
    radius_earth_m = 6371008.8
    lat1 = math.radians(lat_deg)
    lon1 = math.radians(lon_deg)
    brng = math.radians(bearing_deg)
    ang_dist = distance_m / radius_earth_m

    lat2 = math.asin(
        math.sin(lat1) * math.cos(ang_dist)
        + math.cos(lat1) * math.sin(ang_dist) * math.cos(brng)
    )
    lon2 = lon1 + math.atan2(
        math.sin(brng) * math.sin(ang_dist) * math.cos(lat1),
        math.cos(ang_dist) - math.sin(lat1) * math.sin(lat2),
    )
    lon2 = (lon2 + math.pi) % (2.0 * math.pi) - math.pi
    return (math.degrees(lon2), math.degrees(lat2))


def parse_circle_segment(seg_el: ET.Element, points: int = 72) -> List[Tuple[float, float]]:
    center = seg_el.find("gml:pos", NS)
    radius_el = seg_el.find("gml:radius", NS)
    if center is None or radius_el is None:
        return []
    center_coords = parse_pos_element(center)
    if not center_coords:
        return []
    center_lon, center_lat = center_coords[0]
    radius_m = radius_to_meters((radius_el.text or ""), radius_el.get("uom", ""))
    if radius_m is None or radius_m <= 0:
        return []
    coords: List[Tuple[float, float]] = []
    for i in range(points):
        angle = (360.0 * i) / float(points)
        coords.append(destination_point(center_lat, center_lon, angle, radius_m))
    coords.append(coords[0])
    return coords


def parse_arc_by_center_segment(seg_el: ET.Element, step_deg: float = 5.0) -> List[Tuple[float, float]]:
    center = seg_el.find("gml:pos", NS)
    radius_el = seg_el.find("gml:radius", NS)
    start_angle_el = seg_el.find("gml:startAngle", NS)
    end_angle_el = seg_el.find("gml:endAngle", NS)
    if center is None or radius_el is None or start_angle_el is None or end_angle_el is None:
        return []
    center_coords = parse_pos_element(center)
    if not center_coords:
        return []
    center_lon, center_lat = center_coords[0]
    radius_m = radius_to_meters((radius_el.text or ""), radius_el.get("uom", ""))
    start_angle = parse_angle_value(start_angle_el.text or "")
    end_angle = parse_angle_value(end_angle_el.text or "")
    if radius_m is None or radius_m <= 0 or start_angle is None or end_angle is None:
        return []

    # ArcByCenterPoint in AIXM typically uses clockwise bearings in degrees.
    if end_angle <= start_angle:
        end_angle += 360.0
    span = max(0.1, end_angle - start_angle)
    steps = max(8, int(math.ceil(span / max(0.1, step_deg))))

    coords: List[Tuple[float, float]] = []
    for i in range(steps + 1):
        a = start_angle + (span * i / float(steps))
        coords.append(destination_point(center_lat, center_lon, a, radius_m))
    return coords


def parse_segment_coords(seg_el: ET.Element) -> List[Tuple[float, float]]:
    tag = seg_el.tag.split("}")[-1]
    if tag == "CircleByCenterPoint":
        return parse_circle_segment(seg_el)
    if tag == "ArcByCenterPoint":
        return parse_arc_by_center_segment(seg_el)

    coords: List[Tuple[float, float]] = []
    for node in seg_el.iter():
        if node.tag == TAG_POS:
            coords.extend(parse_pos_element(node))
        elif node.tag == TAG_POSLIST:
            coords.extend(parse_poslist_element(node))
    return dedupe_consecutive(coords)


def append_segment_coords(
    base: List[Tuple[float, float]],
    seg: Sequence[Tuple[float, float]],
) -> List[Tuple[float, float]]:
    if not seg:
        return base
    if not base:
        base.extend(seg)
        return base
    if base[-1] == seg[0]:
        base.extend(seg[1:])
    else:
        base.extend(seg)
    return base


def dedupe_consecutive(coords: Sequence[Tuple[float, float]]) -> List[Tuple[float, float]]:
    out: List[Tuple[float, float]] = []
    for c in coords:
        if not out or c != out[-1]:
            out.append(c)
    return out


def close_ring(coords: Sequence[Tuple[float, float]]) -> List[Tuple[float, float]]:
    if not coords:
        return []
    out = list(coords)
    if out[0] != out[-1]:
        out.append(out[0])
    return out


def collect_ring_coords(ring_el: Optional[ET.Element]) -> List[Tuple[float, float]]:
    if ring_el is None:
        return []

    segments = ring_el.findall(".//gml:segments/*", NS)
    coords: List[Tuple[float, float]] = []
    if segments:
        for seg in segments:
            append_segment_coords(coords, parse_segment_coords(seg))
    else:
        for node in ring_el.iter():
            if node.tag == TAG_POS:
                coords.extend(parse_pos_element(node))
            elif node.tag == TAG_POSLIST:
                coords.extend(parse_poslist_element(node))

    coords = dedupe_consecutive(coords)
    coords = close_ring(coords)
    return coords


def polygon_from_patch(patch_el: ET.Element) -> Optional[Polygon]:
    exterior_ring = patch_el.find(".//gml:exterior", NS)
    exterior_coords = collect_ring_coords(exterior_ring)
    if len(exterior_coords) < 4:
        return None

    holes: List[List[Tuple[float, float]]] = []
    for interior in patch_el.findall(".//gml:interior", NS):
        hole_coords = collect_ring_coords(interior)
        if len(hole_coords) >= 4:
            holes.append(hole_coords)

    try:
        poly = Polygon(exterior_coords, holes)
    except Exception:
        return None

    if not poly.is_valid:
        poly = poly.buffer(0)
    if poly.is_empty:
        return None

    if poly.geom_type == "Polygon":
        return poly
    if poly.geom_type == "MultiPolygon":
        parts = [g for g in poly.geoms if g.geom_type == "Polygon" and not g.is_empty]
        return unary_union(parts) if parts else None
    return None


def clean_polygonal(geom: Optional[BaseGeometry]) -> Optional[BaseGeometry]:
    if geom is None or geom.is_empty:
        return None
    if not geom.is_valid:
        geom = geom.buffer(0)
    if geom.is_empty:
        return None
    if geom.geom_type in ("Polygon", "MultiPolygon"):
        return geom
    if geom.geom_type == "GeometryCollection":
        polys = [g for g in geom.geoms if g.geom_type in ("Polygon", "MultiPolygon") and not g.is_empty]
        if not polys:
            return None
        merged = unary_union(polys)
        return merged if not merged.is_empty else None
    return None


def geometry_from_airspace_volume(volume_el: Optional[ET.Element]) -> Optional[BaseGeometry]:
    if volume_el is None:
        return None

    patches = volume_el.findall(".//gml:PolygonPatch", NS)
    polys: List[BaseGeometry] = []
    for patch in patches:
        poly = polygon_from_patch(patch)
        if poly is not None:
            polys.append(poly)

    if not polys:
        return None
    merged = unary_union(polys)
    return clean_polygonal(merged)


def apply_operation(
    current: Optional[BaseGeometry],
    incoming: Optional[BaseGeometry],
    operation: str,
) -> Optional[BaseGeometry]:
    op = (operation or "UNION").strip().upper()
    if incoming is None or incoming.is_empty:
        return current

    if current is None:
        if op in {"SUBTRACT", "DIFFERENCE"}:
            return None
        return clean_polygonal(incoming)

    if op in {"BASE", "REPLACE"}:
        result = incoming
    elif op in {"UNION", "ADD"}:
        result = current.union(incoming)
    elif op in {"INTERSECT", "INTERSECTION"}:
        result = current.intersection(incoming)
    elif op in {"SUBTRACT", "DIFFERENCE"}:
        result = current.difference(incoming)
    else:
        # Unknown operation -> safest fallback is UNION.
        result = current.union(incoming)
    return clean_polygonal(result)


def choose_snapshot_timeslice(airspace_el: ET.Element) -> Optional[ET.Element]:
    slices = airspace_el.findall("./aixm:timeSlice/aixm:AirspaceTimeSlice", NS)
    if not slices:
        return None
    for ts in slices:
        interpretation = first_text(ts, "aixm:interpretation", "")
        if interpretation.upper() == "SNAPSHOT":
            return ts
    return slices[0]


def parse_airspaces(root: ET.Element) -> Dict[str, AirspaceRecord]:
    records: Dict[str, AirspaceRecord] = {}
    for airspace in root.findall(".//aixm:Airspace", NS):
        uuid = first_text(airspace, "gml:identifier", "").lower()
        if not uuid:
            continue
        ts = choose_snapshot_timeslice(airspace)
        if ts is None:
            continue

        rec = AirspaceRecord(
            uuid=uuid,
            designator=first_text(ts, "aixm:designator", ""),
            name=first_text(ts, "aixm:name", ""),
            local_type=first_text(ts, "aixm:localType", ""),
            airspace_type=first_text(ts, "aixm:type", ""),
            interpretation=first_text(ts, "aixm:interpretation", ""),
            components=[],
        )

        for comp in ts.findall("./aixm:geometryComponent/aixm:AirspaceGeometryComponent", NS):
            op = first_text(comp, "aixm:operation", "UNION")
            seq_text = first_text(comp, "aixm:operationSequence", "999999")
            try:
                seq = int(seq_text)
            except ValueError:
                seq = 999999

            volume = comp.find("./aixm:theAirspaceVolume/aixm:AirspaceVolume", NS)
            direct = geometry_from_airspace_volume(volume)

            deps: List[str] = []
            if volume is not None:
                dep_nodes = volume.findall(
                    ".//aixm:contributorAirspace/aixm:AirspaceVolumeDependency/aixm:theAirspace",
                    NS,
                )
                for dep in dep_nodes:
                    href = dep.get(f"{{{NS['xlink']}}}href", "") or ""
                    dep_uuid = extract_uuid_from_href(href)
                    if dep_uuid:
                        deps.append(dep_uuid)

            lower_limit = parse_vertical_limit(volume, "lower") if volume is not None else None
            upper_limit = parse_vertical_limit(volume, "upper") if volume is not None else None

            rec.components.append(
                GeometryComponent(
                    operation=op,
                    operation_sequence=seq,
                    direct_geometry=direct,
                    dependency_uuids=deps,
                    lower_limit=lower_limit,
                    upper_limit=upper_limit,
                )
            )

        records[uuid] = rec
    return records


def resolve_geometry(
    uuid: str,
    records: Dict[str, AirspaceRecord],
    memo: Dict[str, Optional[BaseGeometry]],
    stack: Optional[set] = None,
) -> Optional[BaseGeometry]:
    if uuid in memo:
        return memo[uuid]
    if stack is None:
        stack = set()
    if uuid in stack:
        memo[uuid] = None
        return None
    stack.add(uuid)

    rec = records.get(uuid)
    if rec is None:
        memo[uuid] = None
        stack.remove(uuid)
        return None

    current: Optional[BaseGeometry] = None
    for comp in sorted(rec.components, key=lambda c: c.operation_sequence):
        part_geoms: List[BaseGeometry] = []
        if comp.direct_geometry is not None and not comp.direct_geometry.is_empty:
            part_geoms.append(comp.direct_geometry)

        for dep_uuid in comp.dependency_uuids:
            dep_geom = resolve_geometry(dep_uuid, records, memo, stack)
            if dep_geom is not None and not dep_geom.is_empty:
                part_geoms.append(dep_geom)

        incoming: Optional[BaseGeometry] = None
        if part_geoms:
            incoming = clean_polygonal(unary_union(part_geoms))

        current = apply_operation(current, incoming, comp.operation)

    stack.remove(uuid)
    memo[uuid] = clean_polygonal(current)
    return memo[uuid]


def format_label(designator: str) -> str:
    d = designator.upper().strip()
    if d.startswith("EDR"):
        return f"ED-R {d[3:]}"
    return d


def major_axis_angle_deg(geom_obj: BaseGeometry) -> float:
    rect = geom_obj.minimum_rotated_rectangle
    if rect.is_empty or rect.geom_type != "Polygon":
        return 0.0
    coords = list(rect.exterior.coords)
    if len(coords) < 5:
        return 0.0
    edges = []
    for i in range(4):
        x1, y1 = coords[i]
        x2, y2 = coords[i + 1]
        dx = x2 - x1
        dy = y2 - y1
        length = math.hypot(dx, dy)
        edges.append((length, dx, dy))
    _, dx, dy = max(edges, key=lambda t: t[0])
    angle = math.degrees(math.atan2(dy, dx))
    while angle > 90:
        angle -= 180
    while angle < -90:
        angle += 180
    return round(angle, 1)


def natural_key(text: str) -> List[object]:
    return [int(part) if part.isdigit() else part for part in re.split(r"(\d+)", text.upper())]


def classify_category(rec: AirspaceRecord) -> Optional[str]:
    designator = rec.designator.upper().strip()
    local_type = rec.local_type.upper().strip()
    airspace_type = rec.airspace_type.upper().strip()
    if designator.startswith("EDR"):
        return "edr_outline"
    if local_type == "MIL LOW FLYING AREA":
        return "mil_low_flying_area_outline"
    if airspace_type == "PROTECT":
        return "military_protect_outline"
    return None


def clean_number_text(text: str) -> str:
    s = (text or "").strip()
    if not s:
        return s
    try:
        value = float(s)
    except ValueError:
        return s
    if value.is_integer():
        return str(int(value))
    return f"{value:.6f}".rstrip("0").rstrip(".")


def normalize_limit_to_ft(limit: VerticalLimit) -> Optional[float]:
    value_text = (limit.value or "").strip()
    ref = (limit.reference or "").strip().upper()
    if not value_text:
        if ref in {"SFC", "GND"}:
            return 0.0
        return None

    try:
        value = float(value_text)
    except ValueError:
        return None

    uom = (limit.uom or "").strip().upper()
    if uom == "FL":
        return value * 100.0
    if uom in {"FT", "[FT_I]"}:
        return value
    if uom in {"M", "METRE", "METER"}:
        return value * 3.280839895
    if uom in {"KM"}:
        return value * 3280.839895
    return None


def format_limit(limit: VerticalLimit) -> str:
    value = (limit.value or "").strip()
    uom = (limit.uom or "").strip().upper()
    reference = (limit.reference or "").strip().upper()

    parts: List[str] = []
    if value:
        value_token = clean_number_text(value)
        if uom == "FL":
            parts.append(f"FL{value_token}")
        elif uom:
            parts.append(f"{value_token} {uom}")
        else:
            parts.append(value_token)
    if reference:
        if not parts or parts[-1] != reference:
            parts.append(reference)
    return " ".join(parts).strip()


def limit_sort_key(limit: VerticalLimit) -> Tuple[int, float, str]:
    ft = normalize_limit_to_ft(limit)
    if ft is None:
        return (1, 0.0, format_limit(limit))
    return (0, ft, format_limit(limit))


def collect_vertical_limits(
    uuid: str,
    records: Dict[str, AirspaceRecord],
    memo: Dict[str, Tuple[List[VerticalLimit], List[VerticalLimit]]],
    stack: Optional[set] = None,
) -> Tuple[List[VerticalLimit], List[VerticalLimit]]:
    if uuid in memo:
        cached_lower, cached_upper = memo[uuid]
        return list(cached_lower), list(cached_upper)

    if stack is None:
        stack = set()
    if uuid in stack:
        return [], []
    stack.add(uuid)

    rec = records.get(uuid)
    if rec is None:
        stack.remove(uuid)
        memo[uuid] = ([], [])
        return [], []

    lower_limits: List[VerticalLimit] = []
    upper_limits: List[VerticalLimit] = []
    for comp in rec.components:
        if comp.lower_limit is not None:
            lower_limits.append(comp.lower_limit)
        if comp.upper_limit is not None:
            upper_limits.append(comp.upper_limit)
        for dep_uuid in comp.dependency_uuids:
            dep_lower, dep_upper = collect_vertical_limits(dep_uuid, records, memo, stack)
            lower_limits.extend(dep_lower)
            upper_limits.extend(dep_upper)

    stack.remove(uuid)

    def unique_limits(items: Sequence[VerticalLimit]) -> List[VerticalLimit]:
        seen = set()
        out: List[VerticalLimit] = []
        for item in items:
            key = (
                (item.value or "").strip(),
                (item.uom or "").strip().upper(),
                (item.reference or "").strip().upper(),
            )
            if key in seen:
                continue
            seen.add(key)
            out.append(item)
        return out

    lower_unique = unique_limits(lower_limits)
    upper_unique = unique_limits(upper_limits)
    memo[uuid] = (lower_unique, upper_unique)
    return list(lower_unique), list(upper_unique)


def summarize_limits(lower_limits: Sequence[VerticalLimit], upper_limits: Sequence[VerticalLimit]) -> dict:
    lower_sorted = sorted(lower_limits, key=limit_sort_key)
    upper_sorted = sorted(upper_limits, key=limit_sort_key)

    lower_labels = [format_limit(l) for l in lower_sorted if format_limit(l)]
    upper_labels = [format_limit(l) for l in upper_sorted if format_limit(l)]

    lower_primary = lower_labels[0] if lower_labels else ""
    upper_primary = upper_labels[-1] if upper_labels else ""

    lower_ft_values = [normalize_limit_to_ft(l) for l in lower_sorted]
    upper_ft_values = [normalize_limit_to_ft(l) for l in upper_sorted]
    lower_ft_numeric = [v for v in lower_ft_values if v is not None]
    upper_ft_numeric = [v for v in upper_ft_values if v is not None]

    return {
        "lower_limit": lower_primary,
        "upper_limit": upper_primary,
        "lower_limits_text": " / ".join(lower_labels),
        "upper_limits_text": " / ".join(upper_labels),
        "lower_limit_count": len(lower_labels),
        "upper_limit_count": len(upper_labels),
        "lower_limit_ft": round(min(lower_ft_numeric), 1) if lower_ft_numeric else None,
        "upper_limit_ft": round(max(upper_ft_numeric), 1) if upper_ft_numeric else None,
    }


def to_feature(
    rec: AirspaceRecord,
    geom: BaseGeometry,
    lower_limits: Sequence[VerticalLimit],
    upper_limits: Sequence[VerticalLimit],
    category: str,
) -> dict:
    rep = geom.representative_point()
    component_refs = sorted({dep for c in rec.components for dep in c.dependency_uuids})
    limit_props = summarize_limits(lower_limits, upper_limits)
    return {
        "type": "Feature",
        "properties": {
            "category": category,
            "designator": rec.designator,
            "label": format_label(rec.designator),
            "name": rec.name,
            "local_type": rec.local_type,
            "airspace_type": rec.airspace_type,
            "interpretation": rec.interpretation,
            "source_uuid": rec.uuid,
            "dependency_count": len(component_refs),
            "component_count": len(rec.components),
            "component_refs": component_refs,
            "label_lon": round(rep.x, 6),
            "label_lat": round(rep.y, 6),
            "label_angle": major_axis_angle_deg(geom),
            **limit_props,
        },
        "geometry": mapping(geom),
    }


def main() -> int:
    args = parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    tree = ET.parse(input_path)
    root = tree.getroot()
    records = parse_airspaces(root)

    memo: Dict[str, Optional[BaseGeometry]] = {}
    limit_memo: Dict[str, Tuple[List[VerticalLimit], List[VerticalLimit]]] = {}
    features: List[dict] = []
    unresolved: List[str] = []
    category_counts: Dict[str, int] = {}

    for rec in records.values():
        category = classify_category(rec)
        if args.core_only and category is None:
            continue
        if category is None:
            category = "other_airspace_outline"
        geom = resolve_geometry(rec.uuid, records, memo, stack=set())
        if geom is None or geom.is_empty:
            unresolved.append(rec.designator or rec.uuid)
            continue
        lower_limits, upper_limits = collect_vertical_limits(rec.uuid, records, limit_memo, stack=set())
        features.append(to_feature(rec, geom, lower_limits, upper_limits, category))
        category_counts[category] = category_counts.get(category, 0) + 1

    features.sort(key=lambda f: natural_key(f["properties"].get("designator", "")))
    fc = {"type": "FeatureCollection", "features": features}

    output_path.parent.mkdir(parents=True, exist_ok=True)
    if args.pretty:
        output_path.write_text(json.dumps(fc, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
    else:
        output_path.write_text(json.dumps(fc, ensure_ascii=True, separators=(",", ":")), encoding="utf-8")

    edr_total = sum(1 for r in records.values() if r.designator.upper().startswith("EDR"))
    protect_total = sum(1 for r in records.values() if r.airspace_type.upper().strip() == "PROTECT")
    mil_lfa_total = sum(1 for r in records.values() if r.local_type.upper().strip() == "MIL LOW FLYING AREA")
    print(f"Parsed airspaces: {len(records)}")
    print(f"EDR records in XML: {edr_total}")
    print(f"PROTECT records in XML: {protect_total}")
    print(f"MIL LOW FLYING AREA records in XML: {mil_lfa_total}")
    print(f"GeoJSON features written: {len(features)}")
    if category_counts:
        parts = ", ".join(f"{k}={v}" for k, v in sorted(category_counts.items()))
        print(f"Written categories: {parts}")
    print(f"Unresolved selected records: {len(unresolved)}")
    if unresolved:
        sample = ", ".join(sorted(unresolved)[:20])
        print(f"Unresolved sample: {sample}")
    print(f"Output: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
