import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavDropdown from './NavDropdown';
import HamburgerMenu from './HamburgerMenu';
import Breadcrumb from './Breadcrumb';
import './ResponsiveNav.css';

/**
 * ResponsiveNav Component
 * Main navigation wrapper for desktop (top navbar) and mobile (hamburger)
 * Includes breadcrumb trail
 */
export default function ResponsiveNav() {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const navigate = useNavigate();

  // Subject dropdown data
  const mathSubject = {
    key: 'math',
    icon: '🔢',
    label: 'Math',
    path: '/subjects/math',
    items: [
      {
        icon: '✖️',
        label: 'Multiplication Kingdom',
        path: '/subjects/math/multiplication-kingdom',
        items: [
          { label: '1× Times Table', path: '/subjects/math/multiplication-kingdom/1' },
          { label: '2× Times Table', path: '/subjects/math/multiplication-kingdom/2' },
          { label: '3× Times Table', path: '/subjects/math/multiplication-kingdom/3' },
          { label: '4× Times Table', path: '/subjects/math/multiplication-kingdom/4' },
          { label: '5× Times Table', path: '/subjects/math/multiplication-kingdom/5' },
          { label: '6× Times Table', path: '/subjects/math/multiplication-kingdom/6' },
          { label: '7× Times Table', path: '/subjects/math/multiplication-kingdom/7' },
          { label: '8× Times Table', path: '/subjects/math/multiplication-kingdom/8' },
          { label: '9× Times Table', path: '/subjects/math/multiplication-kingdom/9' },
          { label: '10× Times Table', path: '/subjects/math/multiplication-kingdom/10' },
          { label: '11× Times Table', path: '/subjects/math/multiplication-kingdom/11' },
          { label: '12× Times Table', path: '/subjects/math/multiplication-kingdom/12' },
        ],
      },
      {
        icon: '➕',
        label: 'Addition Kingdom',
        path: '/subjects/math/addition-kingdom',
        disabled: true,
      },
      {
        icon: '➖',
        label: 'Subtraction Kingdom',
        path: '/subjects/math/subtraction-kingdom',
        disabled: true,
      },
      {
        icon: '÷',
        label: 'Division Kingdom',
        path: '/subjects/math/division-kingdom',
        disabled: true,
      },
    ],
  };

  const spellingSubject = {
    key: 'spelling',
    icon: '📖',
    label: 'Language Arts',
    path: '/subjects/spelling',
    items: [
      {
        icon: '✍️',
        label: 'Spelling',
        path: '/subjects/spelling',
        items: [
          { label: 'Vowels & Consonants', path: '/subjects/spelling/vowels' },
          { label: 'Common Words', path: '/subjects/spelling/common-words' },
          { label: 'Sight Words', path: '/subjects/spelling/sight-words' },
          { label: 'Advanced Words', path: '/subjects/spelling/advanced-words' },
        ],
      },
      {
        icon: '📚',
        label: 'Vocabulary',
        path: '/subjects/spelling/vocabulary',
        disabled: true,
      },
      {
        icon: '🔤',
        label: 'Grammar',
        path: '/subjects/spelling/grammar',
        disabled: true,
      },
    ],
  };

  const labSubject = {
    key: 'lab',
    icon: '🧪',
    label: 'Lab',
    path: '/subjects/lab',
    items: [
      {
        icon: '🎮',
        label: 'Number Cruncher',
        path: '/subjects/lab/number-cruncher',
      },
    ],
  };

  const subjects = [mathSubject, spellingSubject, labSubject];

  // Map for hamburger menu
  const hamburgerSubjects = subjects.map((subject) => ({
    key: subject.key,
    icon: subject.icon,
    label: subject.label,
    kingdoms: subject.items.map((item) => ({
      key: item.label,
      label: item.label,
      path: item.path,
      disabled: item.disabled || false,
      icon: item.icon,
    })),
  }));

  return (
    <div className="responsive-nav-wrapper">
      {/* Desktop Navbar */}
      <nav className="responsive-nav desktop-nav" role="navigation" aria-label="Main navigation">
        {/* Left: Logo + Breadcrumb */}
        <div className="nav-left">
          <button
            className="nav-logo"
            onClick={() => navigate('/')}
            aria-label="Learning Kingdom Home"
          >
            <span className="logo-icon">🧬</span>
            <span className="logo-text">Learning Kingdom</span>
          </button>
          <div className="nav-breadcrumb-inline">
            <Breadcrumb />
          </div>
        </div>

        {/* Center: Subject Dropdowns */}
        <div className="nav-center">
          {subjects.map((subject) => (
            <NavDropdown
              key={subject.key}
              icon={subject.icon}
              label={subject.label}
              items={subject.items}
              activeSubject={subject.key}
            />
          ))}
        </div>

        {/* Right: Quick Links */}
        <div className="nav-right">
          <button
            className="nav-quick-link"
            onClick={() => navigate('/unified-leaderboard')}
            title="View Leaderboard"
          >
            ⭐ Achievements
          </button>

          <button
            className="nav-quick-link"
            onClick={() => navigate('/settings')}
            title="Settings"
          >
            ⚙️
          </button>

          <button
            className="nav-quick-link"
            onClick={() => navigate('/profile')}
            title="Profile"
          >
            👤
          </button>
        </div>
      </nav>

      {/* Mobile Hamburger Button */}
      <div className="mobile-nav-top">
        <button
          className="hamburger-button"
          onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isHamburgerOpen}
        >
          <span className="hamburger-icon">☰</span>
          <span className="nav-title-mobile">Learning Kingdom</span>
        </button>

        <button
          className="profile-button-mobile"
          onClick={() => navigate('/profile')}
          title="Profile"
        >
          👤
        </button>
      </div>

      {/* Hamburger Menu */}
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        subjects={hamburgerSubjects}
      />

      {/* Mobile Breadcrumb */}
      <div className="breadcrumb-mobile">
        <Breadcrumb />
      </div>
    </div>
  );
}
