import { useEffect, useState } from 'react';
import useDeviceType from '../../hooks/useDeviceType';
import GameCard from './GameCard';
import './TestDeviceViewport.css';

/**
 * TestDeviceViewport - Component for testing device detection and responsive behavior
 * Shows current device type, viewport size, and example GameCards across different states
 */
export default function TestDeviceViewport() {
  const deviceType = useDeviceType();
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine device classification for testing
  const deviceClass = () => {
    if (viewport.width < 768) return 'Mobile (< 768px)';
    if (viewport.width < 1024) return 'Tablet (768px - 1024px)';
    return 'Desktop (≥ 1024px)';
  };

  return (
    <div className="test-device-viewport">
      <header className="tdv-header">
        <h1>🧪 Device Detection & Responsive Test</h1>
        <p className="tdv-subtitle">Resize your browser window to test different viewports</p>
      </header>

      <section className="tdv-section tdv-stats">
        <h2>Current Device Metrics</h2>
        <div className="tdv-metrics">
          <div className="metric">
            <label>Detected Device Type:</label>
            <strong className="metric-value">{deviceType.toUpperCase()}</strong>
          </div>
          <div className="metric">
            <label>Device Classification:</label>
            <strong className="metric-value">{deviceClass()}</strong>
          </div>
          <div className="metric">
            <label>Viewport Size:</label>
            <strong className="metric-value">{viewport.width} × {viewport.height}px</strong>
          </div>
        </div>
      </section>

      <section className="tdv-section tdv-test-sizes">
        <h2>Test These Common Viewports</h2>
        <div className="tdv-viewport-guide">
          <div className="viewport-item">
            <span className="📱">📱</span>
            <span className="viewport-name">Mobile Phone</span>
            <span className="viewport-size">375x667px</span>
          </div>
          <div className="viewport-item">
            <span className="💻">💻</span>
            <span className="viewport-name">Tablet Portrait</span>
            <span className="viewport-size">768x1024px</span>
          </div>
          <div className="viewport-item">
            <span className="🖥️">🖥️</span>
            <span className="viewport-name">Desktop (macbook)</span>
            <span className="viewport-size">1440x900px</span>
          </div>
          <div className="viewport-item">
            <span className="🖥️">🖥️</span>
            <span className="viewport-name">Desktop (large)</span>
            <span className="viewport-size">1920x1080px</span>
          </div>
        </div>
      </section>

      <section className="tdv-section tdv-cards-demo">
        <h2>GameCard Responsive Examples</h2>
        <p className="tdv-note">
          Watch how GameCard adapts to viewport size (descriptions hidden on mobile, full layout on desktop)
        </p>

        <div className="tdv-cards-container">
          <h3 className="tdv-subsection">Available Games (Both Platforms)</h3>
          <GameCard
            icon="⚡"
            title="Speed Challenge"
            description="Complete problems as fast as you can!"
            onClick={() => console.log('Speed Challenge clicked')}
            platforms="both"
            deviceType={deviceType}
            showBadge={true}
          />

          <GameCard
            icon="🔀"
            title="Match Game"
            description="Find the matching pairs and test your memory"
            onClick={() => console.log('Match Game clicked')}
            platforms="both"
            deviceType={deviceType}
            showBadge={true}
          />

          <GameCard
            icon="⚔️"
            title="Kingdom Siege"
            description="Defend the kingdom from incoming questions"
            onClick={() => console.log('Kingdom Siege clicked')}
            platforms="both"
            deviceType={deviceType}
            showBadge={true}
          />

          <h3 className="tdv-subsection">Desktop-Only Game (simulated)</h3>
          <GameCard
            icon="🎮"
            title="[Desktop Only] Complex Strategy"
            description="This game requires mouse precision and is only available on desktop"
            onClick={() => console.log('Desktop Only clicked')}
            platforms="desktop"
            deviceType={deviceType}
            showBadge={true}
            showUnavailable={true}
          />

          <h3 className="tdv-subsection">Mobile-Only Game (simulated)</h3>
          <GameCard
            icon="📱"
            title="[Mobile Only] Touch Tapper"
            description="Tap the screen as fast as you can"
            onClick={() => console.log('Mobile Only clicked')}
            platforms="mobile"
            deviceType={deviceType}
            showBadge={true}
            showUnavailable={true}
          />
        </div>
      </section>

      <section className="tdv-section tdv-checklist">
        <h2>✅ Testing Checklist</h2>
        <div className="tdv-checklist-items">
          <div className="checklist-item">
            <input type="checkbox" id="mobile-test" />
            <label htmlFor="mobile-test">Mobile view (375x667): Descriptions hidden, responsive layout working</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="tablet-test" />
            <label htmlFor="tablet-test">Tablet view (768x1024): Compact layout, icon sizes appropriate</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="desktop-test" />
            <label htmlFor="desktop-test">Desktop view (1920x1080): Full layout with descriptions, platform badges visible</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="unavailable-test" />
            <label htmlFor="unavailable-test">Desktop: Device-restricted games appear greyed out</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="unavailable-mobile" />
            <label htmlFor="unavailable-mobile">Mobile: Device-restricted games are hidden (not shown)</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="badge-test" />
            <label htmlFor="badge-test">Platform badges visible on hover, fade in/out smoothly</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="interaction-test" />
            <label htmlFor="interaction-test">GameCard buttons clickable, hover effects working, no console errors</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="device-type-test" />
            <label htmlFor="device-type-test">Device type detection updates correctly on window resize</label>
          </div>
        </div>
      </section>

      <section className="tdv-section tdv-devtools">
        <h2>🛠️ Using Browser DevTools to Test</h2>
        <div className="devtools-instructions">
          <h4>Chrome / Firefox / Edge:</h4>
          <ol>
            <li>Press <kbd>F12</kbd> to open DevTools</li>
            <li>Press <kbd>Ctrl+Shift+M</kbd> (Windows) or <kbd>Cmd+Shift+M</kbd> (Mac) to toggle device toolbar</li>
            <li>Select different presets: iPhone 12, iPad, Macbook Air, etc.</li>
            <li>Or manually set custom viewport sizes (375, 768, 1440, 1920)</li>
            <li>Watch the device type change in the metrics section above</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
