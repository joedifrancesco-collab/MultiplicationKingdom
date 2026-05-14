#!/usr/bin/env python3
"""
Add data-state attributes to connector paths based on their connections,
and mark them as hidden by default.
"""

import xml.etree.ElementTree as ET
from pathlib import Path

# Register namespaces
namespaces = {
    'dc': 'http://purl.org/dc/elements/1.1/',
    'cc': 'http://creativecommons.org/ns#',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'svg': 'http://www.w3.org/2000/svg',
    'sodipodi': 'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
    'inkscape': 'http://www.inkscape.org/namespaces/inkscape'
}

for prefix, uri in namespaces.items():
    ET.register_namespace(prefix, uri)
ET.register_namespace('', 'http://www.w3.org/2000/svg')

# Load us_new.svg to get connection info
us_new_path = Path('src/assets/us_new.svg')
us_new_tree = ET.parse(us_new_path)
us_new_root = us_new_tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg', 'inkscape': 'http://www.inkscape.org/namespaces/inkscape'}

# Find all connector paths in us_new.svg and extract their state connections
connector_info = {}
all_paths = us_new_root.findall('.//svg:path', ns)
for path in all_paths:
    path_id = path.get('id', '')
    if path_id.startswith('path'):
        # Try to get connection info from inkscape attributes
        connection_start = path.get('{http://www.inkscape.org/namespaces/inkscape}connection-start', '')
        if connection_start:
            # Connection format is "#STATE"
            state_id = connection_start.strip('#').lower()
            connector_info[path_id] = state_id
            print(f'{path_id} connects to state: {state_id}')

# Load us.svg and add data-state to connector paths
us_path = Path('src/assets/us.svg')
us_tree = ET.parse(us_path)
us_root = us_tree.getroot()

# Find all connector paths in us.svg and add data-state attribute
updated_count = 0
all_us_paths = us_root.findall('.//svg:path', ns)
for path in all_us_paths:
    path_id = path.get('id', '')
    if path_id in connector_info:
        state_id = connector_info[path_id]
        path.set('data-state', state_id)
        path.set('visibility', 'hidden')
        updated_count += 1
        print(f'Updated {path_id}: data-state="{state_id}", visibility="hidden"')

# Save updated us.svg
us_tree.write(us_path, encoding='UTF-8', xml_declaration=True)
print(f'\n✅ Updated {updated_count} connector paths with data-state attributes')
