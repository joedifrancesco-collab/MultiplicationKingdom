import './StateInfoPanel.css';

export default function StateInfoPanel({ state, isOpen, onClose }) {
  if (!state) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="sip-backdrop" onClick={onClose} />}

      {/* Panel */}
      <div className={`sip-panel ${isOpen ? 'sip-open' : ''}`}>
        <button className="sip-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="sip-header">
          <h2 className="sip-state-name">{state.name}</h2>
          <p className="sip-capital">🏛️ {state.capital}</p>
        </div>

        <div className="sip-content">
          <div className="sip-section">
            <h3 className="sip-label">📍 Elevation</h3>
            <div className="sip-elevation">
              <p>
                <strong>Highest:</strong> {state.elevation.highest}
              </p>
              <p>
                <strong>Lowest:</strong> {state.elevation.lowest}
              </p>
            </div>
          </div>

          <div className="sip-section">
            <h3 className="sip-label">📅 Date Established</h3>
            <p className="sip-fact">{state.dateEstablished}</p>
          </div>

          <div className="sip-section">
            <h3 className="sip-label">🇺🇸 Entered the Union</h3>
            <p className="sip-fact">State #{state.unionOrder}</p>
          </div>

          <div className="sip-section">
            <h3 className="sip-label">📏 Total Land Area</h3>
            <p className="sip-fact">{state.landArea}</p>
          </div>

          <div className="sip-section">
            <h3 className="sip-label">👥 Population</h3>
            <p className="sip-fact">{state.population}</p>
          </div>

          <div className="sip-section">
            <h3 className="sip-label">🐦 State Bird</h3>
            <p className="sip-fact">{state.bird}</p>
          </div>

          <div className="sip-section">
            <h3 className="sip-label">📜 State Motto</h3>
            <p className="sip-fact sip-motto">{state.motto}</p>
          </div>
        </div>
      </div>
    </>
  );
}
