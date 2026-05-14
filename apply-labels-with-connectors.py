#!/usr/bin/env python3
"""
Extract corrected text labels and connector paths from us_new.svg and apply to us.svg
"""

import xml.etree.ElementTree as ET
from pathlib import Path
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

ns = {'svg': 'http://www.w3.org/2000/svg'}

# Extract all text elements from us_new.svg
new_text_elements = us_new_root.findall('.//svg:text[@data-state]', ns)
print(f'Found {len(new_text_elements)} text labels in us_new.svg')

# Extract all path elements (connector lines) from us_new.svg
# Paths are those after the text elements with id="path#"
all_paths = us_new_root.findall('.//svg:path', ns)
connector_paths = [p for p in all_paths if p.get('id', '').startswith('path')]
print(f'Found {len(connector_paths)} connector paths in us_new.svg')

# Create copies of text elements with font-weight removed
text_copies = []
for text_elem in new_text_elements:
    text_copy = deepcopy(text_elem)
    # Remove font-weight="bold"
    if 'font-weight' in text_copy.attrib:
        del text_copy.attrib['font-weight']
    text_copies.append(text_copy)

# Create copies of connector paths
path_copies = []
for path_elem in connector_paths:
    path_copy = deepcopy(path_elem)
    path_copies.append(path_copy)

# Remove old text elements from us.svg
old_text_elements = us_root.findall('.//svg:text[@data-state]', ns)
for old_elem in old_text_elements:
    us_root.remove(old_elem)
print(f'Removed {len(old_text_elements)} old text labels from us.svg')

# Remove old connector paths from us.svg (those with id="path#")
old_paths = us_root.findall('.//svg:path', ns)
old_connector_paths = [p for p in old_paths if p.get('id', '').startswith('path')]
for old_path in old_connector_paths:
    us_root.remove(old_path)
print(f'Removed {len(old_connector_paths)} old connector paths from us.svg')

# Add new text elements to us.svg
for text_copy in text_copies:
    us_root.append(text_copy)
print(f'Added {len(text_copies)} new text labels to us.svg')

# Add connector paths to us.svg
for path_copy in path_copies:
    us_root.append(path_copy)
print(f'Added {len(path_copies)} connector paths to us.svg')

# Save updated us.svg
us_tree.write(us_path, encoding='UTF-8', xml_declaration=True)
print(f'\n✅ Successfully updated {us_path}')
