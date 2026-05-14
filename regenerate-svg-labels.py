#!/usr/bin/env python3
"""
Regenerate SVG text labels with correct state centers.
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

# Correct state centers extracted from SVG paths
state_centers = {
    'AK': (-1.8, 222.0),
    'AL': (351.0, 152.6),
    'AR': (326.7, 156.3),
    'AZ': (169.7, 117.4),
    'CA': (82.2, 139.1),
    'CO': (230.4, 102.1),
    'CT': (461.5, 67.5),
    'DC': (438.3, 113.4),
    'DE': (441.2, 98.5),
    'FL': (402.8, 258.1),
    'GA': (400.2, 167.5),
    'HI': (173.0, 233.0),
    'IA': (306.9, 93.9),
    'ID': (148.9, 13.8),
    'IL': (320.1, 75.2),
    'IN': (367.7, 82.9),
    'KS': (286.6, 135.8),
    'KY': (342.8, 126.9),
    'LA': (319.6, 207.5),
    'MA': (456.9, 71.5),
    'MD': (419.1, 107.6),
    'ME': (445.3, 48.7),
    'MI': (316.0, 25.4),
    'MN': (271.9, 30.2),
    'MO': (316.2, 116.6),
    'MS': (338.1, 175.1),
    'MT': (216.8, 21.2),
    'NC': (400.2, 153.8),
    'ND': (263.6, 24.5),
    'NE': (269.7, 96.2),
    'NH': (454.9, 21.5),
    'NJ': (453.3, 88.8),
    'NM': (211.8, 116.9),
    'NV': (133.7, 116.5),
    'NY': (402.2, 76.0),
    'OH': (403.2, 92.7),
    'OK': (278.4, 148.3),
    'OR': (67.5, 41.5),
    'PA': (435.2, 79.8),
    'RI': (467.9, 72.7),
    'SC': (384.6, 158.4),
    'SD': (262.0, 50.7),
    'TN': (373.4, 146.7),
    'TX': (229.4, 187.0),
    'UT': (163.7, 77.2),
    'VA': (403.7, 130.0),
    'VT': (455.5, 58.5),
    'WA': (84.7, 13.2),
    'WI': (325.0, 56.0),
    'WV': (411.5, 102.6),
    'WY': (214.1, 85.9),
}

# Load SVG
svg_path = Path('src/assets/us.svg')
tree = ET.parse(svg_path)
root = tree.getroot()

ns = {'svg': 'http://www.w3.org/2000/svg'}

# Remove existing text elements with data-state attribute
text_elements = root.findall('.//svg:text[@data-state]', ns)
for text_elem in text_elements:
    root.remove(text_elem)
print(f'Removed {len(text_elements)} existing text labels')

# Add new text elements with correct coordinates
added_count = 0
for state_id, (x, y) in sorted(state_centers.items()):
    text_elem = ET.Element('text')
    text_elem.set('id', f'label-{state_id.lower()}')
    text_elem.set('data-state', state_id.lower())
    text_elem.set('x', str(x))
    text_elem.set('y', str(y))
    text_elem.set('text-anchor', 'middle')
    text_elem.set('dominant-baseline', 'middle')
    text_elem.set('font-size', '14')
    text_elem.set('font-weight', 'bold')
    text_elem.set('fill', '#000000')
    text_elem.set('pointer-events', 'none')
    text_elem.set('visibility', 'hidden')
    text_elem.set('class', 'state-label')
    text_elem.text = state_id
    
    root.append(text_elem)
    added_count += 1

# Save the modified SVG
tree.write(svg_path, encoding='UTF-8', xml_declaration=True)
print(f'✅ Added {added_count} text labels with corrected positions to {svg_path}')
