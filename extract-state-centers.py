#!/usr/bin/env python3
"""
Extract actual state centers from SVG path bounding boxes.
"""

import xml.etree.ElementTree as ET
import re
from pathlib import Path

def parse_path_bbox(path_d):
    """Extract approximate bounding box from path d attribute by parsing coords."""
    # Find all coordinate pairs in the path
    coords = re.findall(r'[-\d.]+', path_d)
    if len(coords) < 2:
        return None
    
    # Convert to floats and split into x, y pairs
    nums = [float(c) for c in coords]
    xs = nums[0::2]
    ys = nums[1::2]
    
    if not xs or not ys:
        return None
    
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    
    center_x = (min_x + max_x) / 2
    center_y = (min_y + max_y) / 2
    
    return (round(center_x, 1), round(center_y, 1))

# Load SVG (original without text elements)
svg_path = Path('src/assets/us.svg')

# First, load the original to get path data
tree = ET.parse(svg_path)
root = tree.getroot()
ns = {'svg': 'http://www.w3.org/2000/svg'}

paths = root.findall('.//svg:path', ns)

state_centers = {}
for path in paths:
    state_id = path.get('id')
    if not state_id or len(state_id) != 2:
        continue
    
    path_d = path.get('d', '')
    if not path_d:
        continue
    
    bbox = parse_path_bbox(path_d)
    if bbox:
        state_centers[state_id.upper()] = bbox
        print(f'{state_id.upper()}: {bbox}')

print(f'\n✅ Extracted centers for {len(state_centers)} states')

# Print as Python dict for copy-paste
print('\n--- Copy this dict into the Python script ---')
print('state_centers = {')
for state, (x, y) in sorted(state_centers.items()):
    print(f"    '{state}': ({x}, {y}),")
print('}')
