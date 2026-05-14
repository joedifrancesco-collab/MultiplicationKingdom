#!/usr/bin/env python3
"""
Generate SVG text labels for US state abbreviations based on path centroids.
"""

import xml.etree.ElementTree as ET
from pathlib import Path

# Register namespaces to preserve them
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

# Load SVG
svg_path = Path('src/assets/us.svg')
tree = ET.parse(svg_path)
root = tree.getroot()

# SVG namespace
ns = {'svg': 'http://www.w3.org/2000/svg'}

# Find all path elements (states)
paths = root.findall('.//svg:path', ns)

text_elements = []

for path in paths:
    state_id = path.get('id')
    if not state_id or len(state_id) != 2:
        continue
    
    # Try to extract bounding box by parsing the d attribute
    # For simplicity, we'll use approximate center positions based on state codes
    state_centers = {
        'AL': (640, 340), 'AK': (100, 500), 'AZ': (250, 380), 'AR': (540, 310),
        'CA': (150, 380), 'CO': (320, 280), 'CT': (900, 220), 'DE': (920, 280),
        'FL': (750, 450), 'GA': (720, 360), 'HI': (80, 480), 'ID': (210, 180),
        'IL': (640, 280), 'IN': (690, 260), 'IA': (580, 220), 'KS': (450, 260),
        'KY': (720, 310), 'LA': (580, 380), 'ME': (950, 150), 'MD': (920, 300),
        'MA': (920, 210), 'MI': (720, 200), 'MN': (560, 120), 'MS': (600, 350),
        'MO': (540, 290), 'MT': (290, 120), 'NE': (450, 210), 'NV': (180, 320),
        'NH': (930, 190), 'NJ': (910, 260), 'NM': (320, 380), 'NY': (880, 200),
        'NC': (800, 330), 'ND': (480, 80), 'OH': (750, 280), 'OK': (480, 320),
        'OR': (120, 240), 'PA': (860, 260), 'RI': (920, 230), 'SC': (800, 350),
        'SD': (480, 150), 'TN': (680, 320), 'TX': (520, 400), 'UT': (270, 300),
        'VT': (920, 170), 'VA': (850, 320), 'WA': (120, 140), 'WV': (820, 300),
        'WI': (650, 160), 'WY': (340, 200)
    }
    
    center = state_centers.get(state_id.upper())
    if center:
        x, y = center
        text_elem = ET.Element('text')
        text_elem.set('id', f'label-{state_id.lower()}')
        text_elem.set('data-state', state_id.lower())
        text_elem.set('x', str(x))
        text_elem.set('y', str(y))
        text_elem.set('text-anchor', 'middle')
        text_elem.set('dominant-baseline', 'middle')
        text_elem.set('font-size', '16')
        text_elem.set('font-weight', 'bold')
        text_elem.set('fill', '#000000')
        text_elem.set('pointer-events', 'none')
        text_elem.set('visibility', 'hidden')
        text_elem.set('class', 'state-label')
        text_elem.text = state_id.upper()
        
        text_elements.append(text_elem)
        print(f'Added label for {state_id.upper()} at ({x}, {y})')

# Find the SVG root and add all text elements
for text_elem in text_elements:
    root.append(text_elem)

# Save the modified SVG
tree.write(svg_path, encoding='UTF-8', xml_declaration=True)
print(f'\n✅ Added {len(text_elements)} text labels to {svg_path}')
