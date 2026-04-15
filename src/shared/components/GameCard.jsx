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
 *   - showUnavailable: show unavailable games in greyed-out state (default: false for mobile, true for desktop)
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
  showUnavailable = null, // null = auto (true on desktop, false on mobile)
}) {
  // Check if game is available on current device
  const isAvailable =
    platforms === 'both' ||
    platforms === deviceType;

  // Auto-detect showUnavailable based on device type (show greyed on desktop, hide on mobile)
  const shouldShowUnavailable = showUnavailable === null 
    ? deviceType === 'desktop'
    : showUnavailable;

  if (!isAvailable && !disabled && !shouldShowUnavailable) {
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
