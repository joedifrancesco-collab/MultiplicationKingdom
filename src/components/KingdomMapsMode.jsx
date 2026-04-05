import { useNavigate } from 'react-router-dom';
import './KingdomMapsMode.css';

export default function KingdomMapsMode() {
  const navigate = useNavigate();

  return (
    <div className="kmm-container">
      <button className="back-btn" onClick={() => navigate('/')}>‹</button>

      <header className="kmm-header">
        <div className="kmm-icon">🗺️</div>
        <h1 className="kmm-title">Kingdom Maps</h1>
        <p className="kmm-subtitle">Fill the grid with the right products — pick your challenge!</p>
      </header>

      <div className="kmm-modes">
        <button
          className="kmm-mode-card free-play-card"
          onClick={() => navigate('/kingdom-maps/freePlay')}
        >
          <div className="kmm-mode-icon">🌳</div>
          <div className="kmm-mode-body">
            <div className="kmm-mode-title">Free Play</div>
            <div className="kmm-mode-desc">Untimed practice. Take your time and learn at your own pace.</div>
          </div>
          <div className="kmm-mode-arrow">›</div>
        </button>

        <button
          className="kmm-mode-card timed-card"
          onClick={() => navigate('/kingdom-maps/timed')}
        >
          <div className="kmm-mode-icon">⏱️</div>
          <div className="kmm-mode-body">
            <div className="kmm-mode-title">Timed Challenge</div>
            <div className="kmm-mode-desc">Complete the grid as fast as you can. Errors add 3 seconds.</div>
          </div>
          <div className="kmm-mode-arrow">›</div>
        </button>

        <button
          className="kmm-mode-card row-column-card"
          onClick={() => navigate('/kingdom-maps/rowColumn')}
        >
          <div className="kmm-mode-icon">📊</div>
          <div className="kmm-mode-body">
            <div className="kmm-mode-title">Row & Column</div>
            <div className="kmm-mode-desc">Fill rows or columns and check. Find and fix your errors!</div>
          </div>
          <div className="kmm-mode-arrow">›</div>
        </button>
      </div>
    </div>
  );
}
