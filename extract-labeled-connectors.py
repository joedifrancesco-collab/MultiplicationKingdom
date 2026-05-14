#!/usr/bin/env python3
"""
Extract connector paths with state labels (from inkscape:label) from us_new.svg
and apply them to us.svg with data-state attributes.
"""

import xml.etree.ElementTree as ET
from pathlib import Path
import re
from copy import deepcopy

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

# Load both SVG files
us_new_path = Path('src/assets/us_new.svg')
us_path = Path('src/assets/us.svg')

us_new_tree = ET.parse(us_new_path)
us_new_root = us_new_tree.getroot()

us_tree = ET.parse(us_path)
us_root = us_tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg', 'inkscape': 'http://www.inkscape.org/namespaces/inkscape'}

# Find all paths in us_new.svg and check their inkscape:label for state codes
all_paths = us_new_root.findall('.//svg:path', ns)
state_paths = {}

for path in all_paths:
    path_id = path.get('id', '')
    inkscape_label = path.get('{http://www.inkscape.org/namespaces/inkscape}label', '')
    
    # Match pattern: "#pathXX" where XX is 2-letter state code
    match = re.match(r'^#path([A-Z]{2})$', inkscape_label)
    if match:
        state_code = match.group(1).lower()
        state_paths[path_id] = state_code
        print(f'Found: {path_id} (label: {inkscape_label}) → state: {state_code}')

print(f'\n✅ Total labeled connector paths found: {len(state_paths)}')

# Create copies of these paths with data-state attributes
path_copies = []
for path in all_paths:
    path_id = path.get('id', '')
    if path_id in state_paths:
        path_copy = deepcopy(path)
        state_code = state_paths[path_id]
        path_copy.set('data-state', state_code)
        path_copy.set('visibility', 'hidden')
        path_copies.append(path_copy)
        print(f'Prepared: {path_id} with data-state="{state_code}"')

# Remove old connector paths from us.svg (those with id starting with "path")
old_paths = us_root.findall('.//svg:path', ns)
removed_count = 0
for old_path in old_paths:
    path_id = old_path.get('id', '')
    if path_id.startswith('path'):
        us_root.remove(old_path)
        removed_count += 1

print(f'\nRemoved {removed_count} old connector paths from us.svg')

# Add new paths to us.svg
for path_copy in path_copies:
    us_root.append(path_copy)

print(f'Added {len(path_copies)} new connector paths to us.svg')

# Save updated us.svg
us_tree.write(us_path, encoding='UTF-8', xml_declaration=True)
print(f'\n✅ Successfully updated {us_path}')
