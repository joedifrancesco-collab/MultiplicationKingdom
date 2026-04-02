import { useNavigate } from 'react-router-dom';
import './TrainingMenu.css';

export default function TrainingMenu() {
  const navigate = useNavigate();

  return (
    <div className="training-menu">
      <header className="tm-header">
        <button className="tm-back-btn" onClick={() => navigate('/')}>
          ‹
        </button>
        <h1 className="tm-title">Training</h1>
        <div style={{ width: '40px' }} />
      </header>

      <div className="tm-body">
        <p className="tm-subtitle">Choose your training mode:</p>

        <button
          className="tm-option-card"
          onClick={() => navigate('/training/table', { state: { origin: '/training' } })}
        >
          <div className="tm-option-icon">📊</div>
          <div className="tm-option-info">
            <h2 className="tm-option-title">Interactive Multiplication Table</h2>
            <p className="tm-option-desc">
              Visualize all multiplication facts from 0-12. Hover to highlight rows and columns and see the relationships between numbers.
            </p>
          </div>
          <div className="tm-option-arrow">›</div>
        </button>
      </div>
    </div>
  );
}
