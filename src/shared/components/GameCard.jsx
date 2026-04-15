import './GameCard.css';

/**
 * GameCard - Reusable card component for game selection
 * 
 * Props:
 *   - icon: emoji or icon string
 *   - title: game name
 *   - description: short description
 *   - onClick: handler when card is clicked
 *   - platforms: "both" | "mobile" | "desktop" | "tablet"
 *   - deviceType: current device type ("mobile" | "tablet" | "desktop")
 *   - disabled: optional boolean to disable the card
 */
export default function GameCard({
  icon = '🎮',
  title = 'Game',
  description = 'Play a game',
  onClick = () => {},
  platforms = 'both',
  deviceType = 'desktop',
  disabled = false,
}) {
  // Check if game is available on current device
  const isAvailable =
    platforms === 'both' ||
    platforms === deviceType;

  if (!isAvailable && !disabled) {
    return null; // Hide card if not available on this device
  }

  const handleClick = () => {
    if (!disabled && isAvailable) {
      onClick();
    }
  };

  return (
    <button
      className={`gc-card ${disabled ? 'gc-disabled' : ''} ${!isAvailable ? 'gc-unavailable' : ''}`}
      onClick={handleClick}
      disabled={disabled || !isAvailable}
      title={!isAvailable ? `Not available on ${deviceType}` : ''}
    >
      <div className="gc-icon">{icon}</div>
      <div className="gc-content">
        <div className="gc-title">{title}</div>
        <div className="gc-description">{description}</div>
      </div>
      <div className="gc-arrow">›</div>
    </button>
  );
}
