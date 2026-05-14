#!/usr/bin/env python3
"""
Extract corrected text labels from us_new.svg and apply to us.svg
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

# Create a copy of all text elements from us_new.svg
text_copies = []
for text_elem in new_text_elements:
    # Deep copy the element
    text_copy = ET.Element(text_elem.tag)
    text_copy.text = text_elem.text
    
    # Copy all attributes
    for attr_name, attr_value in text_elem.attrib.items():
        text_copy.set(attr_name, attr_value)
    
    text_copies.append(text_copy)
    
    state = text_elem.get('data-state', '?')
    x = text_elem.get('x', '?')
    y = text_elem.get('y', '?')
    print(f'  {state.upper()}: ({x}, {y})')

# Remove old text elements from us.svg
old_text_elements = us_root.findall('.//svg:text[@data-state]', ns)
for old_elem in old_text_elements:
    us_root.remove(old_elem)
print(f'\nRemoved {len(old_text_elements)} old text labels from us.svg')

# Add new text elements to us.svg
for text_copy in text_copies:
    us_root.append(text_copy)
print(f'Added {len(text_copies)} new text labels to us.svg')

# Save updated us.svg
us_tree.write(us_path, encoding='UTF-8', xml_declaration=True)
print(f'\n✅ Successfully updated {us_path}')
