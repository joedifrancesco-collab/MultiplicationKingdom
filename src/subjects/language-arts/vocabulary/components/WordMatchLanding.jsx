import { useNavigate } from 'react-router-dom';
import './WordMatchLanding.css';

export default function WordMatchLanding() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/subjects/language-arts-kingdom/vocabulary');
  };

  return (
    <div className="word-match-landing">
      <header className="wm-header">
        <div className="wm-icon">✨</div>
        <h1 className="wm-title">Word Match</h1>
        <p className="wm-subtitle">Match words with their definitions</p>
      </header>

      <main className="wm-content">
        <div className="wm-description">
          <h2>How to Play</h2>
          <ul className="wm-rules">
            <li>📖 Read the words and their definitions carefully</li>
            <li>🎯 Match each word with the correct definition</li>
            <li>⏱️ Complete the challenges to earn stars</li>
            <li>🏆 Build your vocabulary skills</li>
          </ul>
        </div>

        <div className="wm-cta-section">
          <button className="wm-start-button" onClick={handleStart}>
            Get Started →
          </button>
          <button className="wm-back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
}
