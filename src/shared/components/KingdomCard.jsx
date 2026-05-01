import React from 'react';
import { useNavigate } from 'react-router-dom';
import './KingdomCard.css';

/**
 * KingdomCard Component
 * Displays a kingdom (Multiplication, Addition, etc.) within a subject
 * Shows enabled/disabled status and action button
 */
export default function KingdomCard({
  icon,
  label,
  description,
  path,
  enabled = true,
  disabled = false,
  stars = 0,
  badge = null,
  comingSoon = false,
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (!comingSoon && enabled && !disabled) {
      navigate(path);
    }
  };

  const isDisabledState = disabled || comingSoon || !enabled;

  return (
    <div className={`kingdom-card ${isDisabledState ? 'disabled' : ''} ${comingSoon ? 'coming-soon' : ''}`}>
      {/* Icon */}
      <div className="kingdom-card-icon">{icon}</div>

      {/* Content */}
      <div className="kingdom-card-content">
        <h3 className="kingdom-card-title">{label}</h3>
        {description && <p className="kingdom-card-description">{description}</p>}

        {/* Stars / Progress */}
        {!isDisabledState && stars > 0 && (
          <div className="kingdom-card-progress">
            <span className="star-display">
              {'⭐'.repeat(stars)}
            </span>
            <span className="progress-text">{stars} Star{stars > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Status */}
        <div className="kingdom-card-status">
          {comingSoon ? (
            <span className="status-badge coming-soon">🎯 Coming Soon</span>
          ) : enabled && !disabled ? (
            <span className="status-badge enabled">✅ Ready</span>
          ) : (
            <span className="status-badge disabled">❌ Locked</span>
          )}
        </div>

        {/* Badge */}
        {badge && <span className="kingdom-card-badge">{badge}</span>}

        {/* Unlock Message */}
        {isDisabledState && !comingSoon && (
          <p className="unlock-message">🔓 Unlock by mastering the previous kingdom</p>
        )}
      </div>

      {/* Action Button */}
      <button
        className={`kingdom-card-action ${isDisabledState ? 'disabled' : ''}`}
        onClick={handleAction}
        disabled={isDisabledState}
      >
        {comingSoon ? '?' : isDisabledState ? '🔒' : 'Enter →'}
      </button>
    </div>
  );
}
