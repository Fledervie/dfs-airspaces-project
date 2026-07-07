<script lang="ts">
    import { map } from "@windy/map";
    import { onMount, onDestroy } from "svelte";

    const L = (window as any).L;

    // Wir lagern allData und layers in globale Variablen aus,
    // damit sie das Schließen und Öffnen der Svelte-Komponente überleben.
    let allData: any = (window as any).__dfsAirspacesAllData || null;
    let layers: Record<string, any> = (window as any).__dfsAirspacesLayers || {};
    let highlightLayer: any = (window as any).__dfsAirspacesHighlight || null;

    let updateMessage = "";
    let foundAirspaces: any[] = [];
    let selectedFeature: any = null;

    let searchText = "";
    let searchResults: any[] = [];

    // UI State auch global persistieren, sonst springen die Regler auf default zurück!
    let uiState = (window as any).__dfsAirspacesUI || {};

    let showRestricted = uiState.showRestricted ?? true;
    let showDanger = uiState.showDanger ?? true;
    let showProtect = uiState.showProtect ?? true;
    let showCtr = uiState.showCtr ?? false;
    let showCtaUta = uiState.showCtaUta ?? false;
    let showRmz = uiState.showRmz ?? false;
    let showTmz = uiState.showTmz ?? false;
    let showAtz = uiState.showAtz ?? false;
    let showFis = uiState.showFis ?? false;
    let showSectors = uiState.showSectors ?? false;
    let showGlider = uiState.showGlider ?? false;
    let showUav = uiState.showUav ?? false;
    let showOther = uiState.showOther ?? false;
    let showProhibited = uiState.showProhibited ?? false;
    let showTemporary = uiState.showTemporary ?? false;
    let showNavRadio = uiState.showNavRadio ?? false;
    let showMilitary = uiState.showMilitary ?? false;

    let showSpecialZones = uiState.showSpecialZones ?? false;
    let showInfoAreas = uiState.showInfoAreas ?? false;
    let showSportUas = uiState.showSportUas ?? false;
    let showMilitaryAll = uiState.showMilitaryAll ?? false;
    let showFavoritesOnly = uiState.showFavoritesOnly ?? false;

    function saveUIState() {
        (window as any).__dfsAirspacesUI = {
            showRestricted, showDanger, showProtect, showCtr, showCtaUta,
            showRmz, showTmz, showAtz, showFis, showSectors,
            showGlider, showUav, showOther, showProhibited, showTemporary,
            showNavRadio, showMilitary, showSpecialZones, showInfoAreas,
            showSportUas, showMilitaryAll, showFavoritesOnly
        };
    }

    function handleToggleChange() {
        saveUIState();
        updateLayers();
    }

    function handleFavoritesChange() {
        if (showFavoritesOnly) {
            // Check which favorite categories are actually active
            const favFeatures = favoriteFeatures(favoriteIds);
            let activeGroups = new Set(favFeatures.flatMap((f: any) => {
                let groupsForFeature = groups.filter(g => belongsToGroup(f, g));
                return groupsForFeature;
            }));

            showRestricted = activeGroups.has("restricted");
            showDanger = activeGroups.has("danger");
            showProtect = activeGroups.has("protect");
            showCtr = activeGroups.has("ctr");
            showCtaUta = activeGroups.has("cta_uta");
            showRmz = activeGroups.has("rmz");
            showTmz = activeGroups.has("tmz");
            showAtz = activeGroups.has("atz");
            showFis = activeGroups.has("fis");
            showSectors = activeGroups.has("sectors");
            showGlider = activeGroups.has("glider");
            showUav = activeGroups.has("uav");
            showProhibited = activeGroups.has("prohibited");
            showTemporary = activeGroups.has("temporary");
            showNavRadio = activeGroups.has("nav_radio");
            showMilitary = activeGroups.has("military");
            showOther = activeGroups.has("other");

            // Turn off aggregate toggles as they might mask what's really going on
            showSpecialZones = false;
            showInfoAreas = false;
            showSportUas = false;
            showMilitaryAll = false;
        }
        handleToggleChange();
        updateSearch();
    }


    let favoriteIds: string[] = [];
    let favoriteIdSet = new Set<string>();
    let isToggling = false;

    function setFavoriteIds(ids: string[]) {
        favoriteIds = [...new Set(ids.map(String))];
        favoriteIdSet = new Set(favoriteIds);
        favoriteCount = favoriteIds.length;
    }

    const groups = [
        "restricted", "danger", "protect", "ctr", "cta_uta",
        "rmz", "tmz", "atz", "fis", "sectors",
        "glider", "uav",
        "prohibited", "temporary", "nav_radio", "military",
        "other"
    ];

    function airspaceType(feature: any): string {
        return feature.properties.local_type || feature.properties.airspace_type || "";
    }

    function belongsToGroup(feature: any, group: string): boolean {
        const p = feature.properties;
        const type = airspaceType(feature);

        if (group === "restricted") return p.category === "edr_outline" || ["OTHER:R_AMC", "R"].includes(type);
        if (group === "danger") return ["OTHER:D_AMC", "D_OTHER"].includes(type);
        if (group === "protect") return p.category === "military_protect_outline" || ["PROTECT", "MIL LOW FLYING AREA"].includes(type);
        if (group === "ctr") return ["CTR", "CTR_P"].includes(type);
        if (group === "cta_uta") return ["CTA", "UTA"].includes(type);
        if (group === "rmz") return type === "RMZ";
        if (group === "tmz") return type === "TMZ";
        if (group === "atz") return type === "ATZ";
        if (group === "fis") return type === "FLIGHT INFORMATION SECTOR";
        if (group === "sectors") return type === "SECTOR";
        if (group === "glider") return type === "GLD";
        if (group === "uav") return type === "UAV";
        if (group === "prohibited") return ["P", "PROHIBITED"].includes(type) || /PROHIBITED/i.test(p.name || "");
        if (group === "temporary") return ["TEMPORARY", "NOTAM"].includes(type) || /TEMP|NOTAM/i.test(`${p.name || ""} ${p.designator || ""}`);
        if (group === "nav_radio") return ["MTRA", "RADIO MANDATORY ZONE", "RMZ_TMZ_COMBINED"].includes(type) || /RADIO|NAV|VOR|NDB/i.test(p.name || "");
        if (group === "military") return /MIL|MILITARY|EXERCISE/i.test(`${type} ${p.name || ""}`);

        if (group === "other") {
            return !groups
                .filter(g => g !== "other")
                .some(g => belongsToGroup(feature, g));
        }

        return false;
    }

    function isGroupVisible(group: string): boolean {
        // Wenn "Nur Favoriten" aktiv ist, müssen wir alle Layer-Gruppen für die Karte aktivieren,
        // da das Filter-System dann nur noch nach Favoriten-Status filtert, unabhängig von der Gruppe.
        if (showFavoritesOnly) return true;

        // Sammelschalter zuerst prüfen
        if (showSpecialZones && (group === "rmz" || group === "tmz" || group === "atz")) return true;
        if (showInfoAreas && (group === "fis" || group === "sectors")) return true;
        if (showSportUas && (group === "glider" || group === "uav")) return true;
        if (showMilitaryAll && ["restricted", "danger", "protect", "military"].includes(group)) return true;

        // Einzel-Schalter
        if (group === "restricted") return showRestricted;
        if (group === "danger") return showDanger;
        if (group === "protect") return showProtect;
        if (group === "ctr") return showCtr;
        if (group === "cta_uta") return showCtaUta;
        if (group === "rmz") return showRmz;
        if (group === "tmz") return showTmz;
        if (group === "atz") return showAtz;
        if (group === "fis") return showFis;
        if (group === "sectors") return showSectors;
        if (group === "glider") return showGlider;
        if (group === "uav") return showUav;
        if (group === "prohibited") return showProhibited;
        if (group === "temporary") return showTemporary;
        if (group === "nav_radio") return showNavRadio;
        if (group === "military") return showMilitary;
        if (group === "other") return showOther;
        return false;
    }

    function pointInRing(lon: number, lat: number, ring: any[]): boolean {
        let inside = false;

        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const xi = ring[i][0], yi = ring[i][1];
            const xj = ring[j][0], yj = ring[j][1];

            const intersect =
                ((yi > lat) !== (yj > lat)) &&
                (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

    function pointInPolygon(lon: number, lat: number, polygon: any[]): boolean {
        if (!polygon || polygon.length === 0) return false;
        if (!pointInRing(lon, lat, polygon[0])) return false;

        for (let i = 1; i < polygon.length; i++) {
            if (pointInRing(lon, lat, polygon[i])) return false;
        }

        return true;
    }

    function featureContainsPoint(feature: any, lon: number, lat: number): boolean {
        const geom = feature.geometry;
        if (!geom) return false;

        if (geom.type === "Polygon") {
            return pointInPolygon(lon, lat, geom.coordinates);
        }

        if (geom.type === "MultiPolygon") {
            return geom.coordinates.some((polygon: any[]) =>
                pointInPolygon(lon, lat, polygon)
            );
        }

        return false;
    }

    function labelFor(feature: any): string {
        const p = feature.properties;
        return p.label || p.designator || "Airspace";
    }

    function geometrySignature(feature: any): string {
        try {
            const g = feature?.geometry;
            if (!g) return "no-geom";
            return `${g.type}:${JSON.stringify(g.coordinates).slice(0, 180)}`;
        } catch {
            return "geom-error";
        }
    }

    function featureId(feature: any): string {
        const p = feature?.properties || {};
        const fid = feature?.id ?? p.id ?? p.source_uuid ?? p.uuid ?? p.gml_id ?? p.identifier;
        if (fid) return String(fid);

        // stronger fallback to avoid collisions in Favorites
        return [
            p.designator || "",
            p.label || "",
            p.name || "",
            airspaceType(feature),
            p.lower_limit || "",
            p.upper_limit || "",
            geometrySignature(feature)
        ].join("|");
    }

    // manually update specific derived states inside setters logic
    // ...


    function isFavorite(feature: any): boolean {
        return favoriteIdSet.has(featureId(feature));
    }

    function isFavoriteById(id: string): boolean {
        return favoriteIdSet.has(id);
    }

    // Beziehe allData explizit in das reaktive Statement mit ein,
    // damit Svelte die Liste nach dem asynchronen Fetch-Laden neu zeichnet!
    $: currentFavorites = allData ? favoriteFeatures(favoriteIds) : [];

    function favoriteFeatures(trackedIds: string[]): any[] {
        if (!allData) return [];
        const used = new Set<string>();
        const idSet = new Set(trackedIds);
        const result: any[] = [];

        for (const f of allData.features) {
            const id = String(featureId(f));
            if (idSet.has(id) && !used.has(id)) {
                used.add(id);
                result.push(f);
            }
        }

        return result.slice(0, 200);
    }

    // favorite count is handled inside setFavoriteIds
    let favoriteCount = 0;

    function loadFavorites() {
        try {
            const parsed = JSON.parse(localStorage.getItem("airspace-favorites") || "[]");
            setFavoriteIds(Array.isArray(parsed) ? parsed : []);
            // remove stale ids not present in dataset (when data already loaded)
            if (allData) {
                const valid = new Set(allData.features.map((f: any) => featureId(f)));
                setFavoriteIds(favoriteIds.filter(id => valid.has(id)));
            }
        } catch {
            setFavoriteIds([]);
        }
    }

    function saveFavorites() {
        localStorage.setItem("airspace-favorites", JSON.stringify(favoriteIds));
    }

    function refreshFavoriteViews() {
        updateSearch();

        if (allData) {
            foundAirspaces = foundAirspaces.filter((f: any) => isFeatureVisibleByFilters(f));
            if (selectedFeature && !isFeatureVisibleByFilters(selectedFeature)) {
                selectedFeature = null;
                removeHighlight();
            } else if (selectedFeature) {
                selectedFeature = { ...selectedFeature };
            }
        }

        if (showFavoritesOnly) {
            updateLayers();
        } else {
            // Also update layers if we need to apply star highlighting, etc,
            // but primarily we must ensure that turning a feature into a favorite 
            // shows it if "showFavoritesOnly" is active.
            updateLayers();
        }
    }

    function toggleFavorite(feature: any, e?: Event) {
        e?.preventDefault();
        e?.stopPropagation();

        if (isToggling) return;
        isToggling = true;

        const id = String(featureId(feature));
        if (favoriteIds.includes(id)) {
            setFavoriteIds(favoriteIds.filter(x => x !== id));
        } else {
            setFavoriteIds([...favoriteIds, id]);
            ensureGroupIsVisible(feature);
        }

        saveFavorites();
        refreshFavoriteViews();

        setTimeout(() => {
            isToggling = false;
        }, 100);
    }

    function isFeatureVisibleByFilters(feature: any): boolean {
        if (showFavoritesOnly) {
            return isFavorite(feature);
        }
        const byGroup = groups.some(group => isGroupVisible(group) && belongsToGroup(feature, group));
        if (!byGroup) return false;
        return true;
    }

    function updateSearch() {
        if (!allData) return;
        const text = searchText.trim().toLowerCase();

        if (!text) {
            searchResults = [];
            return;
        }

        searchResults = allData.features
            .filter((feature: any) => {
                const p = feature.properties;
                const combined = `${p.label || ""} ${p.designator || ""} ${p.name || ""} ${p.local_type || ""} ${p.airspace_type || ""}`;
                const byText = combined.toLowerCase().includes(text);
                
                // Allow search to find ALL results, ignoring the favorite toggle, 
                // so users can always discover and add new favorites from the DB.
                return byText;
            })
            .slice(0, 40);
    }

    function removeHighlight() {
        if (highlightLayer) {
            try {
                map.removeLayer(highlightLayer);
            } catch (e) {}
            highlightLayer = null;
            (window as any).__dfsAirspacesHighlight = null;
        }
    }

    function ensureGroupIsVisible(feature: any) {
        if (!showFavoritesOnly) {
            for (const group of groups) {
                if (belongsToGroup(feature, group)) {
                    if (group === "restricted") showRestricted = true;
                    if (group === "danger") showDanger = true;
                    if (group === "protect") showProtect = true;
                    if (group === "ctr") showCtr = true;
                    if (group === "cta_uta") showCtaUta = true;
                    if (group === "rmz") showRmz = true;
                    if (group === "tmz") showTmz = true;
                    if (group === "atz") showAtz = true;
                    if (group === "fis") showFis = true;
                    if (group === "sectors") showSectors = true;
                    if (group === "glider") showGlider = true;
                    if (group === "uav") showUav = true;
                    if (group === "prohibited") showProhibited = true;
                    if (group === "temporary") showTemporary = true;
                    if (group === "nav_radio") showNavRadio = true;
                    if (group === "military") showMilitary = true;
                    if (group === "other") showOther = true;
                }
            }
            saveUIState();
        }
    }

    function highlightFeature(feature: any) {
        removeHighlight();

        ensureGroupIsVisible(feature);

        selectedFeature = feature;

        highlightLayer = L.geoJSON(feature, {
            style: {
                color: "#ffff00",
                weight: 5,
                opacity: 1,
                fillColor: "#ffff00",
                fillOpacity: 0.28
            }
        });

        highlightLayer.addTo(map);
        (window as any).__dfsAirspacesHighlight = highlightLayer;
    }

    function openInfoPopup(lat: number, lon: number, feature: any) {
        const p = feature.properties || {};
        const html = `
            <div style="font-size:12px;line-height:1.35;">
                <b>${labelFor(feature)}</b><br/>
                ${p.name || "-"}<br/><br/>
                <b>Type:</b> ${p.local_type || p.airspace_type || "-"}<br/>
                <b>Category:</b> ${p.category || "-"}<br/>
                <b>Lower limit:</b> ${p.lower_limit || "-"}<br/>
                <b>Upper limit:</b> ${p.upper_limit || "-"}
            </div>
        `;

        if (infoPopup) {
            try { map.closePopup(infoPopup); } catch (e) {}
            infoPopup = null;
        }

        infoPopup = L.popup({ closeButton: true, autoPan: true })
            .setLatLng([lat, lon])
            .setContent(html)
            .openOn(map);
    }

    function handleMapClick(e: any) {
        if (!allData) return;

        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        foundAirspaces = allData.features.filter((feature: any) =>
            isFeatureVisibleByFilters(feature) && featureContainsPoint(feature, lon, lat)
        );

        selectedFeature = null;
        removeHighlight();
    }

    function handleMapContextMenu(e: any) {
        if (!allData) return;
        if (e?.originalEvent?.preventDefault) e.originalEvent.preventDefault();

        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        foundAirspaces = allData.features.filter((feature: any) =>
            isFeatureVisibleByFilters(feature) && featureContainsPoint(feature, lon, lat)
        );

        if (foundAirspaces.length > 0) {
            selectedFeature = foundAirspaces[0];
            highlightFeature(selectedFeature);
            openInfoPopup(lat, lon, selectedFeature);
        } else {
            selectedFeature = null;
            removeHighlight();
            if (infoPopup) {
                try { map.closePopup(infoPopup); } catch (e) {}
                infoPopup = null;
            }
        }
    }

    function makeLayer(group: string, color: string, fillOpacity: number) {
        const filtered = {
            type: "FeatureCollection",
            features: allData.features.filter((f: any) => belongsToGroup(f, group))
        };

        return L.geoJSON(filtered, {
            style: {
                color,
                weight: 2,
                opacity: 0.95,
                fillOpacity
            }
        });
    }

    function removeAllLayers() {
        for (const key in layers) {
            try {
                map.removeLayer(layers[key]);
            } catch (e) {}
        }
        removeHighlight();
    }

    function updateLayers() {
        if (!allData) return;
        removeAllLayers();

        for (const group of groups) {
            if (!isGroupVisible(group) || !layers[group]) continue;

            if (!showFavoritesOnly) {
                layers[group].addTo(map);
                continue;
            }

            const filtered = {
                type: "FeatureCollection",
                features: allData.features.filter((f: any) => belongsToGroup(f, group) && isFavorite(f))
            };
            const favLayer = L.geoJSON(filtered, {
                style: (layers[group] as any).options?.style || { color: "#000", weight: 2, opacity: 0.95, fillOpacity: 0.08 }
            });
            layers[`__fav_${group}`] = favLayer;
            favLayer.addTo(map);
        }

        // keep stacked/overlapping result list stable after favorite toggle
        // selectedFeature should stay unless it is filtered out
        if (selectedFeature && !isFeatureVisibleByFilters(selectedFeature)) {
            selectedFeature = null;
            removeHighlight();
        }
        // do NOT reset foundAirspaces here
        // foundAirspaces = [];
    }

    let isRuntimeActive = false;
    let hasDataLoaded = !!allData;
    let infoPopup: any = null;

    async function checkForUpdates() {
        try {
            const response = await fetch("https://raw.githubusercontent.com/Fledervie/dfs-airspaces-project/main/backend-data/edr_from_aixm.geojson", { cache: "no-store" });
            if (!response.ok) return;

            const text = await response.text();
            // Compare string lengths or a specific property to detect changes quickly without deep parsing 
            // In a real scenario, you'd compare an ETag or Last-Modified header, but GitHub raw doesn't always provide reliable ETags
            if (allData && (window as any).__dfsAirspacesRawData) {
                if (text !== (window as any).__dfsAirspacesRawData) {
                    // Update detected
                    console.log("DFS Airspaces Update detected!");
                    updateMessage = "DFS Airspaces wurden aktualisiert! Neue Daten wurden nahtlos geladen.";
                    
                    const newData = JSON.parse(text);
                    allData = newData;
                    (window as any).__dfsAirspacesAllData = allData;
                    (window as any).__dfsAirspacesRawData = text;

                    // Clean up favorites against new data
                    const valid = new Set(allData.features.map((f: any) => featureId(f)));
                    setFavoriteIds(favoriteIds.filter(id => valid.has(id)));

                    // Rebuild layers with new data
                    layers.restricted = makeLayer("restricted", "#000000", 0.10);
                    layers.danger = makeLayer("danger", "#000000", 0.08);
                    layers.protect = makeLayer("protect", "#000000", 0.08);
                    layers.ctr = makeLayer("ctr", "#000000", 0.06);
                    layers.cta_uta = makeLayer("cta_uta", "#000000", 0.04);
                    layers.rmz = makeLayer("rmz", "#000000", 0.05);
                    layers.tmz = makeLayer("tmz", "#000000", 0.05);
                    layers.atz = makeLayer("atz", "#000000", 0.06);
                    layers.fis = makeLayer("fis", "#000000", 0.03);
                    layers.sectors = makeLayer("sectors", "#000000", 0.03);
                    layers.glider = makeLayer("glider", "#000000", 0.05);
                    layers.uav = makeLayer("uav", "#000000", 0.05);
                    layers.prohibited = makeLayer("prohibited", "#8b0000", 0.07);
                    layers.temporary = makeLayer("temporary", "#ff8c00", 0.05);
                    layers.nav_radio = makeLayer("nav_radio", "#1e90ff", 0.05);
                    layers.military = makeLayer("military", "#556b2f", 0.05);
                    layers.other = makeLayer("other", "#555555", 0.02);
                    (window as any).__dfsAirspacesLayers = layers;

                    updateLayers();
                    updateSearch();
                    
                    setTimeout(() => { updateMessage = ""; }, 8000);
                }
            }
        } catch (e) {
            console.error("Failed to check for airspace updates:", e);
        }
    }

    let updateInterval: any;

    function ensureRuntimeAttached() {
        if (!isRuntimeActive) {
            map.on("click", handleMapClick);
            map.on("contextmenu", handleMapContextMenu);
            isRuntimeActive = true;
            
            // Check for updates every 4 hours while running
            updateInterval = setInterval(checkForUpdates, 1000 * 60 * 60 * 4);
        }
    }

    function destroyRuntime() {
        if (isRuntimeActive) {
            map.off("click", handleMapClick);
            map.off("contextmenu", handleMapContextMenu);
            isRuntimeActive = false;
            if (updateInterval) clearInterval(updateInterval);
        }
        removeAllLayers();
        if (infoPopup) {
            try { map.closePopup(infoPopup); } catch (e) {}
            infoPopup = null;
        }
    }

    onMount(async () => {
        // State immer beim Öffnen sicherheitshalber laden, falls sich die Daten geändert haben
        loadFavorites();

        if (!hasDataLoaded) {
            // Da das Repo nun Public ist, laden wir superschnell über die Raw-URL.
            const response = await fetch("https://raw.githubusercontent.com/Fledervie/dfs-airspaces-project/main/backend-data/edr_from_aixm.geojson");
            if (!response.ok) {
                alert("Load error: " + response.status);
                return;
            }

            const text = await response.text();
            (window as any).__dfsAirspacesRawData = text;
            allData = JSON.parse(text);
            layers.restricted = makeLayer("restricted", "#000000", 0.10);
            layers.danger = makeLayer("danger", "#000000", 0.08);
            layers.protect = makeLayer("protect", "#000000", 0.08);
            layers.ctr = makeLayer("ctr", "#000000", 0.06);
            layers.cta_uta = makeLayer("cta_uta", "#000000", 0.04);
            layers.rmz = makeLayer("rmz", "#000000", 0.05);
            layers.tmz = makeLayer("tmz", "#000000", 0.05);
            layers.atz = makeLayer("atz", "#000000", 0.06);
            layers.fis = makeLayer("fis", "#000000", 0.03);
            layers.sectors = makeLayer("sectors", "#000000", 0.03);
            layers.glider = makeLayer("glider", "#000000", 0.05);
            layers.uav = makeLayer("uav", "#000000", 0.05);
            layers.prohibited = makeLayer("prohibited", "#8b0000", 0.07);
            layers.temporary = makeLayer("temporary", "#ff8c00", 0.05);
            layers.nav_radio = makeLayer("nav_radio", "#1e90ff", 0.05);
            layers.military = makeLayer("military", "#556b2f", 0.05);
            layers.other = makeLayer("other", "#555555", 0.02);
            
            (window as any).__dfsAirspacesLayers = layers;
            hasDataLoaded = true;
            
            // Initial favorite cleanup against loaded data
            const valid = new Set(allData.features.map((f: any) => featureId(f)));
            setFavoriteIds(favoriteIds.filter(id => valid.has(id)));
        } else {
            // Wenn das Plugin einfach nur geschlossen und wieder geöffnet wurde (hasDataLoaded = true),
            // prüfen wir trotzdem einmal im Hintergrund sofort ob es ein Update gibt.
            checkForUpdates();
        }

        ensureRuntimeAttached();
        updateLayers();

        const bounds = layers.restricted?.getBounds?.();
        if (bounds && bounds.isValid()) map.fitBounds(bounds);

        window.addEventListener("beforeunload", destroyRuntime);
    });

    onDestroy(() => {
        // Die Karte NICHT komplett zerstören und Ebenen NICHT entfernen,
        // wenn das Plugin temporär in den Hintergrund rückt.
        // So bleiben die gesetzten Layer auf der Karte aktiv.
        // window.removeEventListener("beforeunload", destroyRuntime);
    });

    function selectFeature(feature: any, e?: Event) {
        e?.preventDefault();
        e?.stopPropagation();
        selectedFeature = feature;
        highlightFeature(feature);

        if (infoPopup) {
            try { map.closePopup(infoPopup); } catch (e) {}
            infoPopup = null;
        }
    }
</script>

<div class="plugin__content">
    <h2>DFS Airspaces</h2>
    
    {#if updateMessage}
        <div class="update-banner">
            <strong>✓ UPDATE</strong><br/>
            {updateMessage}
        </div>
    {/if}

    <div class="warning-banner">
        <strong>⚠️ WARNING - NOT FOR REAL NAVIGATION!</strong><br/>
        Mit freundlicher Genehmigung der DFS Deutsche Flugsicherung GmbH.<br/>
        Nicht für navigatorische Zwecke nutzen. Keine Garantie für Richtigkeit, Vollständigkeit oder Aktualität.
    </div>

    <div class="credits-text">
        <em>Plugin UI by Fledervie | GeoJSON Parser by Lucas Wankerl</em>
    </div>

    <input
    class="search-box"
    type="text"
    placeholder="Suche: EDR201, TRA Friesland, RMZ..."
    bind:value={searchText}
    on:input={(e) => {
        e.stopPropagation();
        updateSearch();
    }}
    on:click={(e) => e.stopPropagation()}
    on:mousedown={(e) => e.stopPropagation()}
    on:keydown={(e) => e.stopPropagation()}
    on:keypress={(e) => e.stopPropagation()}
    on:keyup={(e) => e.stopPropagation()}
/>

    <details class="cat-panel">
        <summary class="cat-header">Favorites</summary>
        <div class="cat-body">
            <label>
                <input type="checkbox" bind:checked={showFavoritesOnly} on:change={handleFavoritesChange} />
                Show Favorites Only
            </label>
            <div style="font-size:11px; opacity:0.8;">Saved: {favoriteCount}</div>

            {#if favoriteCount > 0}
                <div class="favorites-list">
                    {#each currentFavorites as feature (featureId(feature))}
                        <div class="favorite-row">
                            <button
                                class:selected={selectedFeature && featureId(selectedFeature) === featureId(feature)}
                                class="airspace-button"
                                on:click={(e) => selectFeature(feature, e)}
                            >
                                {labelFor(feature)}<br />
                                <span>{feature.properties.name || "-"}</span>
                            </button>
                            <button
                                class="fav-btn fav-inline"
                                class:active={isFavorite(feature)}
                                aria-pressed={isFavorite(feature)}
                                on:click|preventDefault|stopPropagation={(e) => toggleFavorite(feature, e)}
                            >
                                <span class="fav-icon">{isFavorite(feature) ? "★" : "☆"}</span>
                                {isFavorite(feature) ? "Favorited (Click to remove)" : "Add to Favorites"}
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </details>

    {#if searchResults.length > 0}
        <div class="search-results">
            {#each searchResults as feature}
                {@const favId = featureId(feature)}
                <div class="result-row">
                    <button class:selected={selectedFeature === feature} class="airspace-button" on:click={() => highlightFeature(feature)}>
                        {labelFor(feature)}<br /><span>{feature.properties.name || "-"}</span>
                    </button>
                    <button
                        class="fav-btn fav-inline"
                        class:active={isFavoriteById(favId)}
                        aria-pressed={isFavoriteById(favId)}
                        on:click={(e) => toggleFavorite(feature, e)}
                    >
                        <span class="fav-icon">{isFavoriteById(favId) ? "★" : "☆"}</span>
                        {isFavoriteById(favId) ? "Favorited" : "Add to Favorites"}
                    </button>
                </div>
            {/each}
        </div>
    {/if}

    <div class="info-box">
        {#if foundAirspaces.length === 0}
            <p>Klicke auf die Karte, um Lufträume an dieser Position anzuzeigen.</p>
        {:else}
            <p><b>Gefundene Lufträume: {foundAirspaces.length}</b></p>

            {#each foundAirspaces.slice(0, 30) as feature, index (featureId(feature))}
                <div class="result-row">
                    <button class:selected={selectedFeature === feature} class="airspace-button" on:click={() => highlightFeature(feature)}>
                        {index + 1}. {labelFor(feature)}<br /><span>{feature.properties.name || "-"}</span>
                    </button>
                    <button
                        class="fav-btn fav-inline"
                        class:active={isFavorite(feature)}
                        aria-pressed={isFavorite(feature)}
                        on:click|preventDefault|stopPropagation={(e) => toggleFavorite(feature, e)}
                    >
                        <span class="fav-icon">{isFavorite(feature) ? "★" : "☆"}</span>
                        {isFavorite(feature) ? "Favorited" : "Add to Favorites"}
                    </button>
                </div>
            {/each}
        {/if}
    </div>

    {#if selectedFeature}
        <div class="detail-box">
            <b>{labelFor(selectedFeature)}</b><br />
            {selectedFeature.properties.name || "-"}<br /><br />

            Typ: {selectedFeature.properties.local_type || selectedFeature.properties.airspace_type || "-"}<br />
            Kategorie: {selectedFeature.properties.category || "-"}<br />
            Untergrenze: {selectedFeature.properties.lower_limit || "-"}<br />
            Obergrenze: {selectedFeature.properties.upper_limit || "-"}<br />
            <button
                class="fav-btn"
                class:active={isFavorite(selectedFeature)}
                aria-pressed={isFavorite(selectedFeature)}
                on:click={(e) => toggleFavorite(selectedFeature, e)}
            >
                {isFavorite(selectedFeature) ? "★ Remove Favorite" : "☆ Add Favorite"}
            </button>
        </div>
    {/if}

    <details class="cat-panel" open>
        <summary class="cat-header">Core Airspace Restrictions</summary>
        <div class="cat-body">
            <label><input type="checkbox" bind:checked={showRestricted} on:change={handleToggleChange} /> Restricted / TRA / ED-R</label>
            <label><input type="checkbox" bind:checked={showDanger} on:change={handleToggleChange} /> Danger Areas</label>
            <label><input type="checkbox" bind:checked={showProtect} on:change={handleToggleChange} /> Protective Areas</label>
            <label><input type="checkbox" bind:checked={showProhibited} on:change={handleToggleChange} /> Prohibited Areas</label>
            <label><input type="checkbox" bind:checked={showTemporary} on:change={handleToggleChange} /> Temporary / NOTAM-based Airspace</label>
        </div>
    </details>

    <details class="cat-panel">
        <summary class="cat-header">Controlled Airspace</summary>
        <div class="cat-body">
            <label><input type="checkbox" bind:checked={showCtr} on:change={handleToggleChange} /> CTR (Control Zone)</label>
            <label><input type="checkbox" bind:checked={showCtaUta} on:change={handleToggleChange} /> CTA / UTA</label>
        </div>
    </details>

    <details class="cat-panel">
        <summary class="cat-header">Special Use Airspace</summary>
        <div class="cat-body">
            <label><input type="checkbox" bind:checked={showRmz} on:change={handleToggleChange} /> RMZ</label>
            <label><input type="checkbox" bind:checked={showTmz} on:change={handleToggleChange} /> TMZ</label>
            <label><input type="checkbox" bind:checked={showAtz} on:change={handleToggleChange} /> ATZ</label>
            <label><input type="checkbox" bind:checked={showNavRadio} on:change={handleToggleChange} /> Navigation / Radio-related Airspace</label>
        </div>
    </details>

    <details class="cat-panel">
        <summary class="cat-header">Operational Structure & Use</summary>
        <div class="cat-body">
            <label><input type="checkbox" bind:checked={showFis} on:change={handleToggleChange} /> Flight Information Sectors (FIS)</label>
            <label><input type="checkbox" bind:checked={showSectors} on:change={handleToggleChange} /> Airspace Sectors</label>
            <label><input type="checkbox" bind:checked={showGlider} on:change={handleToggleChange} /> Glider Operating Areas</label>
            <label><input type="checkbox" bind:checked={showUav} on:change={handleToggleChange} /> UAS / UAV Operating Areas</label>
            <label><input type="checkbox" bind:checked={showMilitary} on:change={handleToggleChange} /> Military Activity Areas</label>
        </div>
    </details>

    <details class="cat-panel">
        <summary class="cat-header">Residual Classification</summary>
        <div class="cat-body">
            <label><input type="checkbox" bind:checked={showOther} on:change={handleToggleChange} /> Other / Unclassified</label>
        </div>
    </details>

    <details class="cat-panel">
        <summary class="cat-header">Aggregate Toggles</summary>
        <div class="cat-body">
            <label><input type="checkbox" bind:checked={showMilitaryAll} on:change={handleToggleChange} /> Military Aggregate (Restricted/Danger/Protect/Military)</label>
            <label><input type="checkbox" bind:checked={showSpecialZones} on:change={handleToggleChange} /> Special Zone Aggregate (RMZ/TMZ/ATZ)</label>
            <label><input type="checkbox" bind:checked={showInfoAreas} on:change={handleToggleChange} /> Information Aggregate (FIS/Sector)</label>
            <label><input type="checkbox" bind:checked={showSportUas} on:change={handleToggleChange} /> Recreational/Unmanned Aggregate (Glider/UAV)</label>
        </div>
    </details>
</div>

<style>
    .plugin__content {
        padding: 10px;
        overflow-x: hidden;
    }

    label {
        display: block;
        margin: 7px 0;
    }

    .update-banner {
        background-color: rgba(60, 255, 60, 0.15);
        border-left: 4px solid #3cff3c;
        border-radius: 4px;
        padding: 8px 10px;
        margin-bottom: 12px;
        font-size: 11px;
        line-height: 1.4;
        color: #ccffcc;
        animation: fadein 0.5s;
    }

    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    .warning-banner {
        background-color: rgba(255, 60, 60, 0.15);
        border-left: 4px solid #ff3c3c;
        border-radius: 4px;
        padding: 8px 10px;
        margin-bottom: 12px;
        font-size: 11px;
        line-height: 1.4;
        color: #ffcccc;
    }

    .credits-text {
        font-size: 11px;
        opacity: 0.7;
        margin-bottom: 12px;
        padding: 0 4px;
        text-align: center;
    }

    .search-box {
        width: 100%;
        padding: 7px;
        margin-bottom: 8px;
        box-sizing: border-box;
        border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(255,255,255,0.08);
        color: inherit;
    }

    .search-results {
        max-height: 180px;
        overflow-y: auto;
        margin-bottom: 10px;
        background: rgba(255,255,255,0.06);
        border-radius: 6px;
        padding: 5px;
    }

    .info-box {
        background: rgba(255,255,255,0.1);
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 10px;
        min-height: 160px;
        max-height: 300px;
        overflow-y: auto;
    }

    .detail-box {
        background: rgba(255,255,0,0.15);
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 10px;
        font-size: 12px;
    }

    .airspace-button {
        width: 100%;
        text-align: left;
        margin: 4px 0;
        padding: 6px;
        border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(255,255,255,0.08);
        color: inherit;
        cursor: pointer;
        font-size: 12px;
    }

    .airspace-button span {
        font-size: 11px;
        opacity: 0.8;
    }

    .airspace-button.selected {
        background: rgba(255,255,0,0.28);
        border-color: rgba(255,255,0,0.8);
    }

    hr {
        border: none;
        border-top: 1px solid rgba(255,255,255,0.2);
        margin: 10px 0;
    }

    .cat-panel {
        margin: 8px 0;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 6px;
        background: rgba(255,255,255,0.04);
        overflow: hidden; /* prevents visual overlap */
    }

    .cat-header {
        list-style: none;
        cursor: pointer;
        padding: 8px 10px;
        font-weight: 600;
        background: rgba(255,255,255,0.10);
        user-select: none;
    }

    .cat-header::-webkit-details-marker {
        display: none;
    }

    .cat-body {
        padding: 6px 10px 8px 10px;
        border-top: 1px solid rgba(255,255,255,0.12);
        position: relative;
        z-index: 0;
    }

    .fav-btn {
        width: 100%;
        margin-top: 4px;
        margin-bottom: 6px;
        padding: 5px 6px;
        border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(255,215,0,0.15);
        color: inherit;
        cursor: pointer;
        font-size: 11px;
        text-align: left;
    }

    .fav-btn.active {
        background: rgba(255, 215, 0, 0.45);
        border-color: rgba(255, 215, 0, 0.95);
        box-shadow: inset 0 0 0 1px rgba(255, 215, 0, 0.35);
        font-weight: 700;
    }

    .result-row {
        display: block;
    }

    .fav-btn.fav-inline {
        display: flex;
        align-items: center;
        gap: 6px;
        justify-content: flex-start;
    }

    .fav-icon {
        font-size: 14px;
        line-height: 1;
        width: 14px;
        text-align: center;
    }

    .fav-btn.fav-inline.active,
    .fav-btn.fav-inline[aria-pressed="true"] {
        background: rgba(255, 215, 0, 0.55) !important;
        border-color: rgba(255, 215, 0, 1) !important;
        color: #111 !important;
        font-weight: 700;
    }

    .fav-btn.fav-inline.active .fav-icon,
    .fav-btn.fav-inline[aria-pressed="true"] .fav-icon {
        color: #8a5a00;
    }

    .favorites-list {
        margin-top: 8px;
        max-height: 220px;
        overflow-y: auto;
    }

    .favorite-row {
        margin-bottom: 6px;
    }
</style>