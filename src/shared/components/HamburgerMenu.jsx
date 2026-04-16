import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HamburgerMenu.css';

/**
 * HamburgerMenu Component
 * Full-screen mobile navigation menu
 * Slides from left, includes expandable subject lists
 */
export default function HamburgerMenu({ isOpen, onClose, subjects = [] }) {
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when location changes
  useEffect(() => {
    onClose();
  }, [location, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const toggleSubject = (subjectKey) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectKey]: !prev[subjectKey],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="hamburger-backdrop" onClick={onClose} />}

      {/* Menu */}
      <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="hamburger-header">
          <div className="hamburger-title">🧬 Learning Kingdom</div>
          <button
            className="hamburger-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Menu Content */}
        <nav className="hamburger-nav">
          {/* Home */}
          <button
            className="hamburger-nav-item home-item"
            onClick={() => handleNavigate('/')}
          >
            🏠 Home
          </button>

          {/* Subjects Section */}
          <div className="hamburger-section">
            <div className="hamburger-section-title">📚 Subjects</div>

            {subjects.map((subject) => (
              <div key={subject.key} className="hamburger-subject">
                {/* Subject Toggle */}
                <button
                  className="hamburger-nav-item subject-item"
                  onClick={() => toggleSubject(subject.key)}
                >
                  <span className="subject-label">
                    {subject.icon} {subject.label}
                  </span>
                  <span className={`toggle-arrow ${expandedSubjects[subject.key] ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Kingdoms (expanded) */}
                {expandedSubjects[subject.key] && subject.kingdoms && (
                  <div className="hamburger-kingdoms">
                    {subject.kingdoms.map((kingdom) => (
                      <button
                        key={kingdom.key}
                        className={`hamburger-kingdom ${kingdom.disabled ? 'disabled' : ''}`}
                        onClick={() => !kingdom.disabled && handleNavigate(kingdom.path)}
                        disabled={kingdom.disabled}
                      >
                        <span className="kingdom-checkmark">
                          {!kingdom.disabled ? '✅' : '❌'}
                        </span>
                        <span className="kingdom-label">{kingdom.label}</span>
                        {kingdom.disabled && <span className="lock-icon">🔒</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="hamburger-section">
            <button
              className="hamburger-nav-item"
              onClick={() => handleNavigate('/unified-leaderboard')}
            >
              ⭐ Achievements
            </button>

            <button
              className="hamburger-nav-item"
              onClick={() => handleNavigate('/settings')}
            >
              ⚙️ Settings
            </button>

            <button
              className="hamburger-nav-item"
              onClick={() => handleNavigate('/help')}
            >
              ❓ Help
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="hamburger-footer">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-label" id="user-name">Guest</span>
          </div>
          <button
            className="hamburger-nav-item logout-button"
            onClick={() => {
              handleNavigate('/');
              // TODO: Implement sign-out logic
            }}
          >
            🔓 Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
