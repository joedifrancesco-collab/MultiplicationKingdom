import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStateById } from '../data/states';
import usMapUrl from '../../../../assets/map.svg';
import './USStatesMap.css';

export default function USStatesMap() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    // Fetch and embed the SVG
    const loadSvg = async () => {
      try {
        const response = await fetch(usMapUrl);
        const svgText = await response.text();
        
        if (svgRef.current) {
          svgRef.current.innerHTML = svgText;
          
          // Debug: log all paths in the SVG
          const allPaths = svgRef.current.querySelectorAll('path');
          console.log('Total paths found:', allPaths.length);
          allPaths.forEach((p, idx) => {
            console.log(`Path ${idx}:`, {
              id: p.getAttribute('id'),
              'data-name': p.getAttribute('data-name'),
              'data-id': p.getAttribute('data-id'),
              class: p.getAttribute('class'),
              d: p.getAttribute('d')?.substring(0, 50) + '...'
            });
          });
          
          // Add click handlers to all state paths
          const paths = svgRef.current.querySelectorAll('path[id]');
          console.log('Paths with id attribute:', paths.length);
          paths.forEach(path => {
            // Disable pointer events on paths so only text labels are interactive
            path.style.pointerEvents = 'none';
          });
          
          // Make text labels clickable
          const textElements = svgRef.current.querySelectorAll('text');
          console.log('Text elements found:', textElements.length);
          
          textElements.forEach(text => {
            const stateAbbr = text.textContent.trim().toUpperCase();
            console.log('State abbreviation:', stateAbbr);
            
            text.style.cursor = 'pointer';
            text.style.userSelect = 'none';
            text.style.transition = 'all 0.2s ease';
            
            // Hover effect
            text.addEventListener('mouseover', () => {
              text.style.fill = '#6C63FF';
              text.style.fontSize = '32px';
              text.style.fontWeight = 'bold';
            });
            
            text.addEventListener('mouseout', () => {
              text.style.fill = '#000000';
              text.style.fontSize = '29.3333px';
              text.style.fontWeight = 'normal';
            });
            
            // Click handler
            text.addEventListener('click', () => {
              const stateId = stateAbbr.toLowerCase();
              const state = getStateById(stateId);
              console.log('Clicked state:', stateId, state);
              if (state) {
                setSelectedState(state);
              }
            });
          });
        }
      } catch (error) {
        console.error('Failed to load SVG:', error);
      }
    };
    
    loadSvg();
  }, []);

  const closePanel = () => {
    setSelectedState(null);
  };

  return (
    <div className="usm-reference-container">
      <div className="usm-reference-header">
        <button className="usm-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="usm-reference-title">United States Map</h1>
        <p className="usm-reference-subtitle">Click on a state to learn more</p>
      </div>

      <div className="usm-reference-content">
        <div className="usm-map-wrapper" ref={svgRef} />
      </div>

      {/* Info Panel */}
      {selectedState && (
        <>
          <div className="usm-overlay" onClick={closePanel} />
          <div className="usm-info-panel">
            <button className="usm-close-btn" onClick={closePanel}>✕</button>
            <div className="usm-info-content">
              <h2 className="usm-info-title">{selectedState.name}</h2>
              <div className="usm-info-grid">
                <div className="usm-info-item">
                  <span className="usm-info-label">🏛️ Capital</span>
                  <span className="usm-info-value">{selectedState.capital}</span>
                </div>
                <div className="usm-info-item">
                  <span className="usm-info-label">👥 Population</span>
                  <span className="usm-info-value">{selectedState.population}</span>
                </div>
                <div className="usm-info-item">
                  <span className="usm-info-label">📜 State Motto</span>
                  <span className="usm-info-value">{selectedState.motto}</span>
                </div>
                <div className="usm-info-item">
                  <span className="usm-info-label">🦅 State Bird</span>
                  <span className="usm-info-value">{selectedState.bird}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
