import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

/**
 * Breadcrumb Component
 * Displays navigation path (Home > Math > Multiplication Kingdom)
 * Each item is clickable to navigate back to that level
 */
export default function Breadcrumb({ breadcrumbs = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  // If no breadcrumbs provided, generate from location params
  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : getDefaultBreadcrumbs(location.pathname);

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  if (displayBreadcrumbs.length === 0) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
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
 */
function getDefaultBreadcrumbs(pathname) {
  const breadcrumbs = [{ label: '🏠 Home', path: '/' }];

  // Match /subjects/[subject]/...
  const subjectsMatch = pathname.match(/\/subjects\/(\w+)/);
  if (subjectsMatch) {
    const subject = subjectsMatch[1];
    const subjectLabel = formatSubjectLabel(subject);
    breadcrumbs.push({ label: subjectLabel, path: `/subjects/${subject}` });

    // Match /subjects/[subject]/[kingdom]
    const kingdomMatch = pathname.match(/\/subjects\/[\w]+\/([\w-]+)/);
    if (kingdomMatch) {
      const kingdom = kingdomMatch[1];
      const kingdomLabel = formatKingdomLabel(kingdom);
      breadcrumbs.push({
        label: kingdomLabel,
        path: `/subjects/${subject}/${kingdom}`,
      });

      // Match times table number or sub-section
      const tableMatch = pathname.match(/\/subjects\/[\w]+\/[\w-]+\/(\d+)/);
      if (tableMatch) {
        const times = tableMatch[1];
        breadcrumbs.push({
          label: `${times}× Times Table`,
          path: `/subjects/${subject}/${kingdom}/${times}`,
        });
      }

      // Match game types
      const gameMatch = pathname.match(/\/(flashcard|speed|match|siege)$/);
      if (gameMatch) {
        const gameType = gameMatch[1];
        const gameLabel = formatGameLabel(gameType);
        breadcrumbs.push({ label: gameLabel, path: pathname });
      }
    }
  }

  // Handle other routes
  if (pathname === '/achievements' || pathname === '/unified-leaderboard') {
    return [{ label: '🏠 Home', path: '/' }, { label: '🏆 Achievements', path: pathname }];
  }

  if (pathname === '/settings') {
    return [{ label: '🏠 Home', path: '/' }, { label: '⚙️ Settings', path: pathname }];
  }

  if (pathname === '/profile') {
    return [{ label: '🏠 Home', path: '/' }, { label: '👤 Profile', path: pathname }];
  }

  return breadcrumbs;
}

function formatSubjectLabel(subject) {
  const labels = {
    math: '🔢 Math',
    spelling: '📖 Spelling',
    lab: '🧪 Lab',
    'number-cruncher': '🧪 Lab',
    science: '🎓 Science',
  };
  return labels[subject] || subject.charAt(0).toUpperCase() + subject.slice(1);
}

function formatKingdomLabel(kingdom) {
  const labels = {
    'multiplication-kingdom': '✖️ Multiplication Kingdom',
    'addition-kingdom': '➕ Addition Kingdom',
    'subtraction-kingdom': '➖ Subtraction Kingdom',
    'division-kingdom': '÷ Division Kingdom',
    'number-cruncher': '🎮 Number Cruncher',
  };
  return labels[kingdom] || kingdom.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatGameLabel(gameType) {
  const labels = {
    flashcard: '🃏 Flashcard',
    speed: '⚡ Speed Challenge',
    match: '🎮 Match Game',
    siege: '⚔️ Kingdom Siege',
  };
  return labels[gameType] || gameType.charAt(0).toUpperCase() + gameType.slice(1);
}
