import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { US_STATES } from '../data/states';
import usMapUrl from '../../../../assets/us.svg';
import './USStatesID.css';

export default function USStatesID() {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  
  // Game state
  const [matched, setMatched] = useState(new Set());
  const [selectedMapState, setSelectedMapState] = useState(null);
  const [selectedGridState, setSelectedGridState] = useState(null);
  const [mismatch, setMismatch] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const stateLabelsRef = useRef(new Map());
  const pathElementsRef = useRef(new Map());
  const matchedRef = useRef(matched);
  const selectedMapStateRef = useRef(selectedMapState);
  
  // Keep refs in sync
  useEffect(() => {
    matchedRef.current = matched;
  }, [matched]);
  
  useEffect(() => {
    selectedMapStateRef.current = selectedMapState;
  }, [selectedMapState]);

  // Timer effect
  useEffect(() => {
    if (matched.size === 49) {
      // Game completed, don't increment timer
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [matched.size]);

  // Create alphabetically sorted state list for grid
  const sortedStates = [...US_STATES].sort((a, b) => a.name.localeCompare(b.name));
  const remainingCount = 49 - matched.size;

  // Load and setup SVG map
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(usMapUrl);
        const svgText = await response.text();
        
        if (svgRef.current) {
          svgRef.current.innerHTML = svgText;
          
          // Store path elements and add click handlers
          const paths = svgRef.current.querySelectorAll('path[id]');
          const newPathElements = new Map();
          
          paths.forEach(path => {
            const stateId = path.getAttribute('id')?.toLowerCase();
            if (stateId && US_STATES.some(s => s.id === stateId)) {
              newPathElements.set(stateId, path);
              path.style.cursor = 'pointer';
              path.style.transition = 'all 0.2s ease';
              path.style.fill = '#E8E8FF';
              path.style.stroke = '#999';
              path.style.strokeWidth = '1';
              
              path.addEventListener('mouseover', () => {
                if (selectedMapStateRef.current !== stateId && !matchedRef.current.has(stateId)) {
                  path.style.fill = '#D0C8FF';
                }
              });
              
              path.addEventListener('mouseout', () => {
                if (selectedMapStateRef.current !== stateId && !matchedRef.current.has(stateId)) {
                  path.style.fill = '#E8E8FF';
                }
              });
              
              path.addEventListener('click', () => {
                console.log('Map click:', stateId);
                // Toggle: if clicking same state, deselect it; otherwise select it
                setSelectedMapState(prev => prev === stateId ? null : stateId);
                setMismatch(false); // Clear error when user selects new state
              });
            }
          });
          
          pathElementsRef.current = newPathElements;
          
          // Store label elements
          const textElements = svgRef.current.querySelectorAll('text');
          const newStateLabels = new Map();
          
          textElements.forEach(text => {
            const stateAbbr = text.textContent.trim().toUpperCase();
            const stateId = stateAbbr.toLowerCase();
            if (US_STATES.some(s => s.id === stateId)) {
              newStateLabels.set(stateId, text);
              text.style.userSelect = 'none';
              text.style.pointerEvents = 'none';
              text.style.display = 'none';
            }
          });
          
          stateLabelsRef.current = newStateLabels;
        }
      } catch (error) {
        console.error('Failed to load SVG:', error);
      }
    };
    
    loadSvg();
  }, []);

  // Update matched states visually
  useEffect(() => {
    matched.forEach(stateId => {
      const path = pathElementsRef.current.get(stateId);
      if (path) {
        path.style.fill = '#6BCB77';
        path.style.cursor = 'default';
      }
      
      const label = stateLabelsRef.current.get(stateId);
      if (label) {
        const state = US_STATES.find(s => s.id === stateId);
        label.textContent = state.id.toUpperCase();
        label.style.fill = '#000';
        label.style.fontWeight = 'bold';
        label.style.display = 'block';
      }
    });
  }, [matched]);

  // Update selected state visual highlighting
  useEffect(() => {
    pathElementsRef.current.forEach((path, stateId) => {
      if (matched.has(stateId)) {
        // Already matched - keep green
        path.style.fill = '#6BCB77';
      } else if (selectedMapState === stateId) {
        // Currently selected - highlight blue
        path.style.fill = '#9D94FF';
      } else {
        // Not selected and not matched - default
        path.style.fill = '#E8E8FF';
      }
    });
  }, [selectedMapState, matched]);

  // Check for match when both are selected
  useEffect(() => {
    if (selectedMapState && selectedGridState && !matched.has(selectedMapState)) {
      if (selectedMapState === selectedGridState) {
        // Correct match - add to matched set first
        setMatched(prev => new Set([...prev, selectedMapState]));
        setMismatch(false);
        // Clear selections immediately
        setSelectedMapState(null);
        setSelectedGridState(null);
      } else {
        // Wrong match - show error but keep selections visible for retry
        console.log('Mismatch:', selectedMapState, 'vs', selectedGridState);
        setMismatch(true);
        setIncorrectCount(prev => prev + 1);
        // Don't clear selections - keep them so user can try again
      }
    }
  }, [selectedMapState, selectedGridState, matched]);

  const handleGridStateClick = (stateId) => {
    // Allow grid button clicks anytime (can choose name first or map first)
    // But prevent clicking if this state has already been matched
    if (matched.has(stateId)) {
      return;
    }
    
    console.log('Grid click:', stateId);
    // Toggle: if clicking same state, deselect it; otherwise select it
    setSelectedGridState(prev => prev === stateId ? null : stateId);
    setMismatch(false); // Clear error when user selects new button
  };

  const handleReset = () => {
    setMatched(new Set());
    setSelectedMapState(null);
    setSelectedGridState(null);
    setIncorrectCount(0);
    setElapsedSeconds(0);
    
    pathElementsRef.current.forEach((path) => {
      path.style.fill = '#E8E8FF';
      path.style.cursor = 'pointer';
    });
    
    stateLabelsRef.current.forEach((label, stateId) => {
      label.textContent = stateId.toUpperCase();
      label.style.fill = '#000000';
      label.style.fontWeight = 'normal';
      label.style.display = 'none';
    });
  };

  return (
    <div className="usid-container">
      <div className="usid-header">
        <div className="usid-header-left">
          <button className="usid-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          {mismatch && (
            <div className="usid-error-message">Incorrect, try again.</div>
          )}
          {selectedMapState && !selectedGridState && !mismatch && !matched.has(selectedMapState) && (
            <div className="usid-guidance-message">Choose the state name from the list.</div>
          )}
          {selectedGridState && !selectedMapState && !mismatch && !matched.has(selectedGridState) && (
            <div className="usid-guidance-message">Choose the state on the map.</div>
          )}
        </div>

        <div className="usid-title-section">
          <h1 className="usid-title">US States ID</h1>
          <p className="usid-subtitle">Can you identify all 49 states?</p>
        </div>

        <div className="usid-header-right">
          <div className="usid-counter">
            <span className="usid-counter-label">States Remaining:</span>
            <span className="usid-counter-value">{remainingCount}</span>
          </div>
          <div className="usid-counter">
            <span className="usid-counter-label">Incorrect:</span>
            <span className="usid-counter-value">{incorrectCount}</span>
          </div>
          <div className="usid-counter">
            <span className="usid-counter-label">Time:</span>
            <span className="usid-counter-value">{elapsedSeconds}s</span>
          </div>
          <button className="usid-reset-btn" onClick={handleReset}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="usid-content">
        <div className="usid-map-section">
          <div 
            ref={svgRef} 
            className="usid-map"
            role="region"
            aria-label="Interactive US map"
          />
        </div>

        <div className="usid-grid-section">
          <div className="usid-grid">
            {sortedStates.map(state => {
              const isMatched = matched.has(state.id);
              const isSelected = selectedGridState === state.id;
              
              return (
                <button
                  key={state.id}
                  className={`usid-state-btn ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleGridStateClick(state.id)}
                  disabled={isMatched}
                  aria-label={state.name}
                  aria-pressed={isSelected}
                >
                  {state.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {matched.size === 49 && (
        <div className="usid-completion-overlay">
          <div className="usid-completion-modal">
            <div className="usid-celebration">🎉</div>
            <h2>Congratulations!</h2>
            <p>You've identified all 49 states!</p>
            <button className="usid-completion-btn" onClick={() => navigate(-1)}>
              ← Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
