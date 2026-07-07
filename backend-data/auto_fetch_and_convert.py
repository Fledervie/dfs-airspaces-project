import json
import urllib.request
import re
from datetime import datetime, timezone
import xml.etree.ElementTree as ET

def find_latest_snapshot_url():
    # Die aktuelle DFS AIXM Seite aufrufen und die .xml URL suchen
    url = "https://aip.dfs.de/datasets/"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        
        # Suchen nach "ED_Airspace_StrokedBorders_YYYY-MM-DD_YYYY-MM-DD_snapshot.xml"
        # Die Seite nutzt oft JS-gesteuerten Download über `getItem.php?amdt=9999&content=...`
        pattern = r"(ED_Airspace_StrokedBorders_\d{4}-\d{2}-\d{2}_\d{4}-\d{2}-\d{2}_snapshot\.xml)"
        match = re.search(pattern, html)
        
        if match:
            filename = match.group(1)
            download_url = f"https://aip.dfs.de/datasets/scripts/getItem.php?amdt=9999&content={filename}"
            print(f"Found latest DFS AIXM snapshot: {filename}")
            return download_url
            
        print("Warning: Could not parse filename directly from index. Try fallback search...")
        
    except Exception as e:
        print(f"Error fetching DFS portal: {e}")
        
    # Fallback-Generierung über heutiges Datum:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    fallback_name = f"ED_Airspace_StrokedBorders_{today}_{today}_snapshot.xml"
    fallback_url = f"https://aip.dfs.de/datasets/scripts/getItem.php?amdt=9999&content={fallback_name}"
    print(f"Using fallback daily URL: {fallback_url}")
    return fallback_url

def download_aixm(url, dest_path):
    print(f"Downloading from {url} ...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
            out_file.write(response.read())
        print("Download successful.")
        return True
    except Exception as e:
        print(f"Download failed: {e}")
        return False

def main():
    import sys
    dest_path = "backend-data/temp_snapshot.xml"
    
    url = find_latest_snapshot_url()
    if download_aixm(url, dest_path):
        import subprocess
        # Führe dein bestehendes Wandlungsscript aus:
        print("Running convert_aixm_edr_to_geojson.py ...")
        cmd = [
            "python", 
            "backend-data/convert_aixm_edr_to_geojson.py", 
            "--input", dest_path, 
            "--output", "backend-data/edr_from_aixm.geojson"
        ]
        result = subprocess.run(cmd)
        sys.exit(result.returncode)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
