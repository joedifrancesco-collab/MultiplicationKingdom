import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentAuthUser, isGuestMode, signOutUser, clearGuestMode, subscribeToAuthChanges } from '../../store/progress';
import { OverlayContext } from '../../context/OverlayContext.jsx';
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [user, setUser] = useState(() => getCurrentAuthUser());
  const [guest, setGuest] = useState(isGuestMode());
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef(null);
  const { openOverlay } = useContext(OverlayContext);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to guest mode changes
  useEffect(() => {
    const handleGuestModeChange = () => {
      setGuest(isGuestMode());
    };
    window.addEventListener('guestModeChanged', handleGuestModeChange);
    return () => window.removeEventListener('guestModeChanged', handleGuestModeChange);
  }, []);

  // Times Table only shows on Math pages
  const isOnMathPages = location.pathname.startsWith('/subjects/math');

  // Reset signingOut state when user or guest status changes
  useEffect(() => {
    setSigningOut(false);
  }, [user, guest]);

  // Handle sign out
  async function handleSignOut() {
    setSigningOut(true);
    if (guest) {
      clearGuestMode();
      navigate('/auth', { replace: true });
    } else {
      await signOutUser();
      navigate('/auth', { replace: true });
    }
  }

  const getProfileDisplay = () => {
    if (guest) {
      return '👤'; // Guest silhouette
    }
    if (user?.displayName) {
      // Get initials from display name
      const initials = user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
      return initials || '👤';
    }
    return '👤';
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

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
        path: '/subjects/math-kingdom/multiplication-kingdom',
        items: [
          { label: '🏰 Conquest', path: '/subjects/math-kingdom/multiplication-kingdom/grid' },
          { label: '🃏 Flashcard Challenge', path: '/subjects/math-kingdom/multiplication-kingdom/flashcards' },
          { label: '🗺️ Kingdom Maps', path: '/subjects/math-kingdom/multiplication-kingdom/maps' },
          { label: '⚔️ Kingdom Siege', path: '/subjects/math-kingdom/multiplication-kingdom/siege' },
        ],
      },
      {
        icon: '➕',
        label: 'Addition Kingdom',
        path: '/subjects/math-kingdom/addition-kingdom',
        disabled: true,
      },
      {
        icon: '➖',
        label: 'Subtraction Kingdom',
        path: '/subjects/math-kingdom/subtraction-kingdom',
        disabled: true,
      },
      {
        icon: '÷',
        label: 'Division Kingdom',
        path: '/subjects/math-kingdom/division-kingdom',
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
        path: '/subjects/language-arts-kingdom/spelling',
        items: [],
      },
      {
        icon: '📚',
        label: 'Vocabulary',
        path: '/subjects/language-arts-kingdom/vocabulary',
        disabled: true,
      },
      {
        icon: '🔤',
        label: 'Grammar',
        path: '/subjects/language-arts-kingdom/grammar',
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
        path: '/number-cruncher',
      },
    ],
  };

  const subjects = [mathSubject, spellingSubject];
  // Only show Lab on homepage
  const sideBarSubjects = location.pathname === '/' ? [labSubject] : [];

  // Map for hamburger menu
  const hamburgerSubjects = subjects.concat(sideBarSubjects).map((subject) => ({
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
        {/* Left: Home Icon Only */}
        <div className="nav-left">
          <button
            className="nav-logo"
            onClick={() => navigate('/')}
            aria-label="Learning Kingdom Home"
            title="Home"
          >
            <span className="logo-icon">⌂</span>
          </button>
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
              hideIcon={true}
              className={`nav-subject-${subject.key}`}
            />
          ))}
        </div>

        {/* Right: Lab (side) + Quick Links */}
        <div className="nav-right">
          {/* Lab dropdown (right-aligned) */}
          <div className="nav-lab-section">
            {/* Times Table Link (right-aligned) - only show on Math pages */}
            {isOnMathPages && (
              <button
                className="nav-times-table-link"
                onClick={() => openOverlay('times-table')}
                title="Times Table"
                aria-label="Times Table"
              >
                📖 Times Table
              </button>
            )}

          {sideBarSubjects.map((subject) => (
              <NavDropdown
                key={subject.key}
                icon={subject.icon}
                label={subject.label}
                items={subject.items}
                activeSubject={subject.key}
                className={`nav-subject-${subject.key}`}
              />
            ))}
          </div>

          {/* Quick Links removed - Achievements now in profile menu */}

          {/* Profile Button with Dropdown */}
          <div className="profile-dropdown-wrapper" ref={profileDropdownRef}>
            <button
              className="nav-quick-link profile-button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              title="Profile menu"
              aria-expanded={isProfileDropdownOpen}
            >
              {getProfileDisplay()}
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="profile-dropdown-menu">
                {!guest && user?.displayName && (
                  <div className="profile-dropdown-user-name">
                    {user.displayName}
                  </div>
                )}
                <button
                  className="profile-dropdown-item"
                  onClick={() => {
                    navigate('/profile');
                    setIsProfileDropdownOpen(false);
                  }}
                >
                  👤 Profile
                </button>
                <button
                  className="profile-dropdown-item"
                  onClick={() => {
                    navigate('/unified-leaderboard');
                    setIsProfileDropdownOpen(false);
                  }}
                >
                  ⭐ Achievements
                </button>
                <button
                  className="profile-dropdown-item"
                  onClick={() => {
                    handleSignOut();
                    setIsProfileDropdownOpen(false);
                  }}
                  disabled={signingOut}
                >
                  {signingOut ? '⏳ Exiting...' : guest ? '🔓 Log In' : '🔒 Log Out'}
                </button>
              </div>
            )}
          </div>
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

      {/* Desktop Breadcrumb Trail (displays below nav when not on home) */}
      <div className="breadcrumb-desktop">
        <Breadcrumb />
      </div>

      {/* Mobile Breadcrumb */}
      <div className="breadcrumb-mobile">
        <Breadcrumb />
      </div>
    </div>
  );
}
