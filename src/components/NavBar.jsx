import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOutUser, getCurrentAuthUser } from '../store/progress';
import './NavBar.css';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const user = getCurrentAuthUser();

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when navigation occurs
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Don't show navbar on auth page (moved after hooks)
  if (location.pathname === '/auth') {
    return null;
  }

  async function handleSignOut() {
    setSigningOut(true);
    await signOutUser();
    navigate('/auth', { replace: true });
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

  const navItems = [
    { label: '🏠 Home', path: '/', key: 'home' },
    { label: '🏆 Leaderboard', path: '/leaderboard', key: 'leaderboard' },
    { label: '📊 Times Table', path: '/training/table', key: 'table' },
  ];

  const rightNavItems = [
    { label: '📚 Spelling (beta)', path: '/spelling', key: 'spelling' },
  ];

  const handleNavClick = (path) => {
    if (path === '/training/table') {
      navigate(path, { state: { origin: location.pathname } });
    } else {
      navigate(path);
    }
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
                  {signingOut ? '⏳ Signing Out...' : '🚪 Sign Out'}
                </button>
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
          title="Sign Out"
        >
          {signingOut ? '⏳' : '🚪'} {signingOut ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>
    </nav>
  );
}
