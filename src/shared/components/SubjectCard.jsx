import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectCard.css';

/**
 * SubjectCard Component
 * Displays a subject (Math, Language Arts, Lab, Science) on home page
 * Shows enabled/disabled status, enabled games count, and action button
 */
export default function SubjectCard({
  icon,
  label,
  description,
  path,
  enabled = true,
  enabledCount = 0,
  totalCount = 1,
  badge = null,
  comingSoon = false,
}) {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (!comingSoon && enabled) {
      navigate(path);
    }
  };

  const statusText = comingSoon
    ? 'Coming Soon'
    : enabled
      ? `${enabledCount}/${totalCount} Enabled`
      : 'Coming Soon';

  return (
    <div
      className={`subject-card ${!enabled || comingSoon ? 'disabled' : ''} ${
        comingSoon ? 'coming-soon' : ''
      }`}
    >
      {/* Icon */}
      <div className="subject-card-icon">{icon}</div>

      {/* Content */}
      <div className="subject-card-content">
        <h3 className="subject-card-title">{label}</h3>
        {description && <p className="subject-card-description">{description}</p>}

        {/* Status */}
        <div className="subject-card-status">
          {enabled && !comingSoon && (
            <span className="status-badge enabled">✅ {statusText}</span>
          )}
          {(!enabled || comingSoon) && (
            <span className="status-badge disabled">⏳ {statusText}</span>
          )}
        </div>

        {/* Badge */}
        {badge && <span className="subject-card-badge">{badge}</span>}
      </div>

      {/* Action Button */}
      <button
        className={`subject-card-action ${!enabled || comingSoon ? 'disabled' : ''}`}
        onClick={handleExplore}
        disabled={!enabled || comingSoon}
      >
        {comingSoon ? '?' : 'Explore →'}
      </button>
    </div>
  );
}
