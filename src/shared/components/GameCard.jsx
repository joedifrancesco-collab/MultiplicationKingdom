import './GameCard.css';

/**
 * Get platform badge emoji
 * @param {string} platforms - "both" | "mobile" | "desktop" | "tablet"
 * @returns {string} emoji badge
 */
function getPlatformBadge(platforms) {
  const badges = {
    'both': '🖥️📱',
    'desktop': '🖥️',
    'mobile': '📱',
    'tablet': '📱',
  };
  return badges[platforms] || '🖥️';
}

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
 *   - showBadge: show platform badge (default: true)
 */
export default function GameCard({
  icon = '🎮',
  title = 'Game',
  description = 'Play a game',
  onClick = () => {},
  platforms = 'both',
  deviceType = 'desktop',
  disabled = false,
  showBadge = true,
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

  const platformTooltip = !isAvailable 
    ? `Not available on ${deviceType}. Supported platforms: ${platforms}`
    : `Available on: ${platforms}`;

  return (
    <button
      className={`gc-card ${disabled ? 'gc-disabled' : ''} ${!isAvailable ? 'gc-unavailable' : ''}`}
      onClick={handleClick}
      disabled={disabled || !isAvailable}
      title={platformTooltip}
    >
      <div className="gc-icon">{icon}</div>
      <div className="gc-content">
        <div className="gc-title">{title}</div>
        <div className="gc-description">{description}</div>
      </div>
      {showBadge && (
        <div className="gc-badge">{getPlatformBadge(platforms)}</div>
      )}
      <div className="gc-arrow">›</div>
    </button>
  );
}
