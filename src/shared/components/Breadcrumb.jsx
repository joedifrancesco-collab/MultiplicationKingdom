import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

/**
 * Breadcrumb Component
 * Displays navigation path (Home > Math > Multiplication Kingdom > Game Mode)
 * Each item is clickable to navigate back to that level
 * 
 * @param {Array} breadcrumbs - List of breadcrumb items
 * @param {Boolean} ownLine - If true, displays breadcrumb on its own line with margin
 */
export default function Breadcrumb({ breadcrumbs = [], ownLine = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  // If no breadcrumbs provided, generate from location params
  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : getDefaultBreadcrumbs(location.pathname, location.state);

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  if (displayBreadcrumbs.length === 0) return null;

  return (
    <nav className={`breadcrumb-nav ${ownLine ? 'own-line' : ''}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {displayBreadcrumbs.map((item, index) => (
          <li key={`${item.label}-${index}`} className="breadcrumb-item">
            {index > 0 && <span className="breadcrumb-separator">&gt;</span>}
            
            {index === displayBreadcrumbs.length - 1 ? (
              // Last item - not clickable (current page)
              <span className="breadcrumb-text breadcrumb-current">
                {item.label}
              </span>
            ) : (
              // Clickable breadcrumb items
              <button
                className="breadcrumb-link"
                onClick={() => handleBreadcrumbClick(item.path)}
                aria-current={index === displayBreadcrumbs.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Parse route pathname to generate breadcrumbs
 * Routes follow pattern: /subjects/[subject]/[kingdom]/[game]
 * Homepage (/) returns empty breadcrumbs
 * @param {String} pathname - Current URL path
 * @param {Object} state - React Router location state (contains mode, duration for games)
 */
function getDefaultBreadcrumbs(pathname, state = {}) {
  // Hide breadcrumbs on homepage
  if (pathname === '/') {
    return [];
  }

  const breadcrumbs = [{ label: 'Home', path: '/' }];

  // Match /subjects/[subject]/...
  const subjectsMatch = pathname.match(/\/subjects\/([\w-]+)/);
  if (subjectsMatch) {
    let subject = subjectsMatch[1];
    // Map kingdom-based paths to subject paths (only for subject landing page)
    const subjectMap = {
      'math-kingdom': 'math',
      'language-arts-kingdom': 'spelling',
    };
    const mappedSubject = subjectMap[subject] || subject;
    const subjectLabel = formatSubjectLabel(mappedSubject);
    // Subject breadcrumb uses mapped subject for landing page
    breadcrumbs.push({ label: subjectLabel, path: `/subjects/${mappedSubject}` });

    // Match /subjects/[subject]/[kingdom]
    const kingdomMatch = pathname.match(/\/subjects\/[\w-]+\/([\w-]+)/);
    if (kingdomMatch) {
      const kingdom = kingdomMatch[1];
      const kingdomLabel = formatKingdomLabel(kingdom);
      // Kingdom breadcrumb uses ORIGINAL subject (not mapped) to keep full path
      breadcrumbs.push({
        label: kingdomLabel,
        path: `/subjects/${subject}/${kingdom}`,
      });

      // Match times table number (for individual table screens)
      const tableMatch = pathname.match(/\/subjects\/[\w-]+\/[\w-]+\/(\d+)/);
      if (tableMatch) {
        const times = tableMatch[1];
        // Times table uses ORIGINAL subject
        breadcrumbs.push({
          label: `${times}× Times Table`,
          path: `/subjects/${subject}/${kingdom}/${times}`,
        });

        // Match game types after table number
        const gameMatch = pathname.match(/\/(flashcard|speed|match|siege)$/);
        if (gameMatch) {
          const gameType = gameMatch[1];
          const gameLabel = formatGameLabel(gameType);
          breadcrumbs.push({ label: gameLabel, path: pathname });
        }
      } else {
        // Match game types in root kingdom path (e.g., /subjects/.../flashcards or /subjects/.../maps/mode)
        const gameMatch = pathname.match(/\/(flashcards|siege|maps|grid)($|\/)/);
        if (gameMatch) {
          const gamePath = gameMatch[1];
          // Game paths use ORIGINAL subject to keep full path
          const gameMap = {
            flashcards: { label: 'Flashcard Challenge', path: `/subjects/${subject}/${kingdom}/flashcards` },
            siege: { label: 'Kingdom Siege', path: `/subjects/${subject}/${kingdom}/siege` },
            maps: { label: 'Kingdom Maps', path: `/subjects/${subject}/${kingdom}/maps` },
            grid: { label: 'Times Table Grid', path: `/subjects/${subject}/${kingdom}/grid` },
          };
          if (gameMap[gamePath]) {
            const gameItem = gameMap[gamePath];
            breadcrumbs.push(gameItem);
            
            // Add game mode/variant breadcrumb
            // For flashcards/siege: mode is in state
            if ((gamePath === 'flashcards' || gamePath === 'siege') && state?.mode) {
              const modeLabel = formatGameModeLabel(state.mode, state.duration);
              breadcrumbs.push({ 
                label: modeLabel, 
                path: pathname 
              });
            }
            // For maps/grid: mode is in URL path (e.g., /maps/freePlay or /maps/conquest)
            else if ((gamePath === 'maps' || gamePath === 'grid') && pathname.includes(`/${gamePath}/`)) {
              const modeMatch = pathname.match(new RegExp(`/${gamePath}/([\\w-]+)`));
              if (modeMatch) {
                const mode = modeMatch[1];
                // For URL-based modes, don't pass duration parameter
                let modeLabel;
                if (mode === 'timed') {
                  modeLabel = 'Timed';
                } else if (mode === 'practice') {
                  modeLabel = 'Practice';
                } else if (mode === 'countdown') {
                  modeLabel = 'Sprint';
                } else {
                  // Generic camelCase to Title Case conversion
                  modeLabel = formatGameModeLabel(mode);
                }
                breadcrumbs.push({
                  label: modeLabel,
                  path: pathname,
                });
              }
            }
          }
        }
      }
    }
  }

  // Handle Extra Credit standalone routes
  if (pathname === '/touch-typing') {
    return [
      { label: 'Home', path: '/' },
      { label: 'Extra Credit', path: '/subjects/lab' },
      { label: 'Touch Typing', path: pathname },
    ];
  }

  if (pathname === '/number-cruncher') {
    return [
      { label: 'Home', path: '/' },
      { label: 'Extra Credit', path: '/subjects/lab' },
      { label: 'Number Cruncher', path: pathname },
    ];
  }

  if (pathname.startsWith('/flashcard-builder')) {
    const base = [
      { label: 'Home', path: '/' },
      { label: 'Extra Credit', path: '/subjects/lab' },
      { label: 'Flashcard Builder', path: '/flashcard-builder' },
    ];
    if (pathname === '/flashcard-builder/create') {
      base.push({ label: 'Create Deck', path: pathname });
    } else if (pathname.startsWith('/flashcard-builder/play/')) {
      base.push({ label: 'Play', path: pathname });
    }
    return base;
  }

  if (pathname === '/achievements' || pathname === '/unified-leaderboard') {
    return [{ label: 'Home', path: '/' }, { label: 'Achievements', path: pathname }];
  }

  if (pathname === '/settings') {
    return [{ label: 'Home', path: '/' }, { label: 'Settings', path: pathname }];
  }

  if (pathname === '/profile') {
    return [{ label: 'Home', path: '/' }, { label: 'Profile', path: pathname }];
  }

  return breadcrumbs;
}

function formatSubjectLabel(subject) {
  const labels = {
    math: 'Math',
    spelling: 'Spelling',
    lab: 'Extra Credit',
    'number-cruncher': 'Extra Credit',
    'touch-typing': 'Extra Credit',
    science: 'Science',
  };
  return labels[subject] || subject.charAt(0).toUpperCase() + subject.slice(1);
}

function formatKingdomLabel(kingdom) {
  const labels = {
    'multiplication-kingdom': 'Multiplication Kingdom',
    'addition-kingdom': 'Addition Kingdom',
    'subtraction-kingdom': 'Subtraction Kingdom',
    'division-kingdom': 'Division Kingdom',
    'number-cruncher': 'Number Cruncher',
    'flashcard-builder': 'Flashcard Builder',
    'touch-typing': 'Touch Typing',
  };
  return labels[kingdom] || kingdom.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatGameLabel(gameType) {
  const labels = {
    flashcard: 'Flashcard',
    speed: 'Speed Challenge',
    match: 'Match Game',
    siege: 'Kingdom Siege',
  };
  return labels[gameType] || gameType.charAt(0).toUpperCase() + gameType.slice(1);
}

function formatGameModeLabel(mode, duration) {
  if (mode === 'practice') {
    return 'Practice';
  }
  if (mode === 'timed' && duration !== undefined) {
    if (duration === 60) return '1 Minute';
    if (duration === 180) return '3 Minutes';
    if (duration === 300) return '5 Minutes';
    return `${Math.round(duration / 60)} Minutes`;
  }
  if (mode === 'countdown') {
    return 'Sprint';
  }
  // Convert camelCase to Title Case: "freePlay" → "Free Play"
  const camelCaseRegex = /([a-z])([A-Z])/g;
  const titleCase = mode
    .replace(camelCaseRegex, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return titleCase;
}
