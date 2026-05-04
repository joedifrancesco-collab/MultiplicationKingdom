import { useNavigate } from 'react-router-dom';
import './USStatesHome.css';

/**
 * USStatesHome Component
 * Shows game mode selection for US States subject
 * (United States Map, US States ID, State Capitals)
 */
export default function USStatesHome() {
  const navigate = useNavigate();

  const gameModes = [
    {
      id: 'us-map',
      icon: '🗺️',
      title: 'United States Map',
      description: 'Identify states on an interactive US map. Click to see state capitals and facts.',
      path: '/subjects/geography-kingdom/us-states/map',
      className: 'map-card',
      enabled: true,
    },
    {
      id: 'us-states-id',
      icon: '🏛️',
      title: 'US States ID',
      description: 'Guess which state matches the description. Learn facts about each state.',
      path: '#',
      className: 'states-id-card',
      enabled: false,
      comingSoon: true,
    },
    {
      id: 'state-capitals',
      icon: '🏪',
      title: 'State Capitals',
      description: 'Match state capitals with their states. Master capital cities across America.',
      path: '#',
      className: 'capitals-card',
      enabled: false,
      comingSoon: true,
    },
  ];

  return (
    <div className="ush-container">
      <header className="ush-header">
        <div className="ush-icon">🗺️</div>
        <h1 className="ush-title">US States</h1>
        <p className="ush-subtitle">Explore America's geography and learn about each state!</p>
      </header>

      <div className="ush-modes">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            className={`ush-mode-card ${mode.className} ${!mode.enabled ? 'disabled' : ''}`}
            onClick={() => mode.enabled && navigate(mode.path)}
            disabled={!mode.enabled}
            aria-label={mode.title}
          >
            <div className="ush-mode-icon">{mode.icon}</div>
            <div className="ush-mode-body">
              <div className="ush-mode-title">{mode.title}</div>
              <div className="ush-mode-desc">{mode.description}</div>
            </div>
            {mode.comingSoon && <div className="ush-coming-soon">Coming Soon</div>}
            {!mode.comingSoon && <div className="ush-mode-arrow">›</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
