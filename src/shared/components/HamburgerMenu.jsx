import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HamburgerMenu.css';

/**
 * HamburgerMenu Component
 * Full-screen mobile navigation menu
 * Slides from left, includes expandable subject lists
 */
export default function HamburgerMenu({ isOpen, onClose, subjects = [], user = null, guest = false, onSignOut = null, signingOut = false }) {
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);



  // Close menu only when pathname actually changes (not on every render)
  useEffect(() => {
    if (location.pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = location.pathname;
      onClose();
    }
  }, [location.pathname, onClose]);

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
      {isOpen && (
        <div
          className="hamburger-backdrop"
          onClick={onClose}
          style={{ display: 'block', position: 'fixed', inset: 0, zIndex: 998 }}
        />
      )}

      {/* Menu - Using inline style for position to ensure it works */}
      <div
        className="hamburger-menu"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '80%',
          maxWidth: '320px',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
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

        {/* Separator */}
        <div className="hamburger-divider"></div>

        {/* Footer - Profile Section */}
        <div className="hamburger-footer">
          {/* Profile Info (only for authenticated users) */}
          {!guest && user && (
            <button
              className="hamburger-profile-section"
              onClick={() => {
                handleNavigate('/profile');
              }}
            >
              <div className="hamburger-profile-avatar">
                {user?.displayName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase() || '👤'}
              </div>
              <div className="hamburger-profile-info">
                <div className="hamburger-profile-name">{user?.displayName || 'User'}</div>
                <div className="hamburger-profile-email">{user?.email || 'No email'}</div>
              </div>
            </button>
          )}

          {/* Sign Out Button */}
          <button
            className="hamburger-nav-item logout-button"
            onClick={() => {
              if (onSignOut) onSignOut();
            }}
            disabled={signingOut}
          >
            {signingOut ? '⏳ Exiting...' : guest ? '👤 Enter Guest' : '🚪 Sign Out'}
          </button>
        </div>
      </div>
    </>
  );
}
