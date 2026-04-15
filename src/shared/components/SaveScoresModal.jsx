import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuestScores, clearGuestScores } from '../../store/progress';
import './SaveScoresModal.css';

/**
 * SaveScoresModal Component
 * Shown when guest has unsaved scores and tries to leave/exit
 * Offers: Sign up to save scores OR continue as guest
 */
export default function SaveScoresModal({ isOpen, onClose, onSignUp }) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  
  const scores = getGuestScores();
  const scoreList = scores.map(s => ({ gameType: s.gameType, count: 1 }))
    .reduce((acc, item) => {
      const existing = acc.find(a => a.gameType === item.gameType);
      if (existing) {
        existing.count++;
      } else {
        acc.push(item);
      }
      return acc;
    }, []);

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      navigate('/auth?mode=signup&from=guest-scores');
    }
  };

  const handleContinueAsGuest = () => {
    // Clear scores and close modal
    clearGuestScores();
    if (onClose) onClose();
    // Navigate back home or where they came from
    navigate('/');
  };

  if (!isOpen || scores.length === 0) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="ssm-overlay" />
      
      {/* Modal */}
      <div className="ssm-modal">
        <div className="ssm-header">
          <h2 className="ssm-title">💾 Save Your Scores?</h2>
          <p className="ssm-subtitle">
            You have {scores.length} game score{scores.length !== 1 ? 's' : ''} from this session
          </p>
        </div>

        {/* Score Summary */}
        <div className="ssm-scores-summary">
          <div className="ssm-summary-header">
            <span className="ssm-summary-label">Games Played:</span>
            <button
              className="ssm-toggle-details"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '▼ Hide Details' : '▶ Show Details'}
            </button>
          </div>

          {showDetails && (
            <div className="ssm-scores-list">
              {scoreList.map(item => (
                <div key={item.gameType} className="ssm-score-item">
                  <span className="ssm-score-game">{item.gameType}</span>
                  <span className="ssm-score-count">×{item.count}</span>
                </div>
              ))}
            </div>
          )}

          <div className="ssm-summary-preview">
            {scoreList.slice(0, 3).map(item => (
              <span key={item.gameType} className="ssm-badge">
                {item.gameType}
              </span>
            ))}
            {scoreList.length > 3 && (
              <span className="ssm-badge ssm-badge-more">
                +{scoreList.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Message boxes */}
        <div className="ssm-content">
          <div className="ssm-message-box ssm-box-save">
            <div className="ssm-box-icon">✅</div>
            <div className="ssm-box-text">
              <strong>Sign Up Now</strong>
              <p>Create an account to permanently save your scores and track progress across all games.</p>
            </div>
          </div>

          <div className="ssm-divider">OR</div>

          <div className="ssm-message-box ssm-box-skip">
            <div className="ssm-box-icon">⏭️</div>
            <div className="ssm-box-text">
              <strong>Continue as Guest</strong>
              <p>Your scores will be lost when you close the app. You can play more games without signing up.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="ssm-actions">
          <button
            className="ssm-btn ssm-btn-primary"
            onClick={handleSignUp}
          >
            🎯 Sign Up to Save Scores
          </button>
          <button
            className="ssm-btn ssm-btn-secondary"
            onClick={handleContinueAsGuest}
          >
            Skip for Now
          </button>
        </div>

        {/* Info footer */}
        <div className="ssm-footer">
          <p className="ssm-footer-text">
            ℹ️ Creating an account is free and takes less than a minute!
          </p>
        </div>
      </div>
    </>
  );
}
