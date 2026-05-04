import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStateById } from '../data/states';
import usMapUrl from '../../../../assets/us.svg';
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
          
          // Add click handlers to all state paths
          const paths = svgRef.current.querySelectorAll('path[id]');
          paths.forEach(path => {
            const stateId = path.getAttribute('id').toLowerCase();
            const stateName = path.getAttribute('data-name');
            
            path.style.cursor = 'pointer';
            path.style.transition = 'all 0.2s ease';
            path.style.fill = '#f9f9f9';
            path.style.stroke = '#000';
            path.style.strokeWidth = '0.97063118';
            
            path.addEventListener('mouseenter', () => {
              path.style.fill = '#6c63ff';
              path.style.stroke = '#ff6b6b';
              path.style.strokeWidth = '1.5';
              path.style.filter = 'drop-shadow(0 2px 8px rgba(108, 99, 255, 0.4))';
            });
            
            path.addEventListener('mouseleave', () => {
              path.style.fill = '#f9f9f9';
              path.style.stroke = '#000';
              path.style.strokeWidth = '0.97063118';
              path.style.filter = 'none';
            });
            
            path.addEventListener('click', () => {
              const state = getStateById(stateId);
              if (state) {
                setSelectedState(state);
              }
            });
            
            // Add title for tooltip
            path.setAttribute('title', stateName);
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
                  <span className="usm-info-label">Capital</span>
                  <span className="usm-info-value">{selectedState.capital}</span>
                </div>
                <div className="usm-info-item">
                  <span className="usm-info-label">Population</span>
                  <span className="usm-info-value">{selectedState.population}</span>
                </div>
                <div className="usm-info-item">
                  <span className="usm-info-label">State Motto</span>
                  <span className="usm-info-value">{selectedState.motto}</span>
                </div>
                <div className="usm-info-item">
                  <span className="usm-info-label">State Bird</span>
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
