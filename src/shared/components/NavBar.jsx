import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOutUser, getCurrentAuthUser, isGuestMode, clearGuestMode } from "../../store/progress";
import './NavBar.css';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const hamburgerRef = useState(null)[1]; // Store ref for focus restoration
  const menuRef = useState(null)[1]; // Store menu ref for focus trap
  const user = getCurrentAuthUser();
  const guest = isGuestMode();

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when navigation occurs
  // This intentional state reset is appropriate as a side effect of navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Focus management for mobile menu accessibility
  useEffect(() => {
    if (menuOpen) {
      // Trap focus inside menu - find first focusable element
      const menu = document.querySelector('.mobile-menu');
      if (menu) {
        const focusableElements = menu.querySelectorAll('button, [href], [tabindex="0"]');
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }
  }, [menuOpen]);

  // Reset signingOut state when user or guest status changes
  // This intentional state reset is appropriate as a side effect of auth state changes
  useEffect(() => {
    setSigningOut(false);
  }, [user, guest]);

  // Don't show navbar on auth page (moved after hooks)
  if (location.pathname === '/auth') {
    return null;
  }

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

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Determine current game context (excluding spelling for beta)
  const gameContext = (() => {
    if (location.pathname.startsWith('/spelling')) {
      return null; // Don't show game context for spelling games
    }
    if (location.pathname.startsWith('/kingdom') && !location.pathname.startsWith('/kingdom-maps')) {
      return { name: 'Conquest', homePath: '/kingdom' };
    }
    if (location.pathname.startsWith('/flashcards')) {
      return { name: 'Flashcard Challenge', homePath: '/flashcards' };
    }
    if (location.pathname.startsWith('/kingdom-maps')) {
      return { name: 'Kingdom Maps', homePath: '/kingdom-maps' };
    }
    if (location.pathname === '/siege' || location.pathname.startsWith('/siege/')) {
      return { name: 'Kingdom Siege', homePath: '/siege' };
    }
    return null;
  })();

  // Times Table only shows on Math pages and descendants
  const isOnMathPages = location.pathname.startsWith('/subjects/math');

  const navItems = [
    { label: '🏠 Home', path: '/', key: 'home' },
    { label: '🏆 Leaderboard', path: '/unified-leaderboard', key: 'leaderboard' },
    ...(isOnMathPages ? [{ label: '📊 Times Table', path: '/subjects/math-kingdom/multiplication-kingdom/training/table', key: 'table' }] : []),
  ];

  const rightNavItems = [
    { label: '📚 Spelling (beta)', path: '/spelling', key: 'spelling' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  if (isMobile) {
    return (
      <>
        <nav className="navbar-mobile">
          <button 
            className="hamburger-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            title="Menu"
          >
            ☰
          </button>
        </nav>

        {menuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <button 
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>

              <div className="mobile-nav-items">
                {navItems.map((item) => (
                  <button 
                    key={item.key}
                    className={`mobile-nav-btn ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    {item.label}
                  </button>
                ))}

                {gameContext && <div className="mobile-nav-separator"></div>}

                {gameContext && (
                  <button 
                    className="mobile-nav-btn game-context-mobile-btn"
                    onClick={() => navigate(gameContext.homePath)}
                  >
                    🎮 {gameContext.name}
                  </button>
                )}

                {rightNavItems.map((item) => (
                  <button 
                    key={item.key}
                    className={`mobile-nav-btn spelling-mobile-btn ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    {item.label}
                  </button>
                ))}

                <button 
                  className="mobile-nav-btn signout-mobile-btn" 
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  {signingOut ? '⏳ Exiting...' : guest ? '👤 Exit Guest' : '🚪 Sign Out'}
                </button>

                {guest && (
                  <div className="mobile-nav-guest-indicator">
                    👤 Playing as Guest
                  </div>
                )}

                {/* Profile Section - Only for authenticated users */}
                {!guest && user && (
                  <>
                    <div className="mobile-nav-separator"></div>
                    <button 
                      className="mobile-nav-btn mobile-profile-btn" 
                      onClick={() => navigate('/profile')}
                    >
                      <div className="mobile-profile-content">
                        <div className="mobile-profile-avatar">
                          {user?.displayName
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase() || '👤'}
                        </div>
                        <div className="mobile-profile-info">
                          <div className="mobile-profile-name">{user?.displayName || 'User'}</div>
                          <div className="mobile-profile-email">{user?.email || 'No email'}</div>
                        </div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {navItems.map((item) => (
          <button 
            key={item.key}
            className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
            title={item.label}
          >
            {item.label}
          </button>
        ))}

        {gameContext && <div className="nav-separator"></div>}

        {gameContext && (
          <button 
            className="nav-btn game-context-btn"
            onClick={() => navigate(gameContext.homePath)}
            title={gameContext.name}
          >
            🎮 {gameContext.name}
          </button>
        )}
      </div>

      <div className="navbar-right">
        {rightNavItems.map((item) => (
          <button 
            key={item.key}
            className={`nav-btn spelling-nav-btn ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
            title={item.label}
          >
            {item.label}
          </button>
        ))}

        <button 
          className="nav-btn signout-nav-btn" 
          onClick={handleSignOut}
          disabled={signingOut}
          title={guest ? 'Exit Guest Mode' : 'Sign Out'}
        >
          {signingOut ? '⏳' : guest ? '👤' : '🚪'} {signingOut ? 'Exiting...' : guest ? 'Exit Guest' : 'Sign Out'}
        </button>
      </div>
    </nav>
  );
}
