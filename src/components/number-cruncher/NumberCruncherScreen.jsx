import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAuthUser } from '../../store/progress';
import '../number-cruncher/number-cruncher.css';

export default function NumberCruncherScreen() {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState('');
  const [showGuestInput, setShowGuestInput] = useState(false);
  const authUser = getCurrentAuthUser();

  const handlePlayClick = () => {
    if (authUser) {
      // Logged-in user goes directly to game
      navigate('/number-cruncher/play');
    } else {
      // Guest needs to enter 3-char name
      setShowGuestInput(true);
    }
  };

  const handleGuestNameSubmit = (e) => {
    e.preventDefault();
    const name = guestName.trim().toUpperCase();
    
    // Validate: 1-3 characters
    if (name.length === 0 || name.length > 3) {
      alert('Please enter 1-3 characters for your name');
      return;
    }

    // Store guest name in localStorage temporarily
    localStorage.setItem('mk_nc_guest_name', name);
    navigate('/number-cruncher/play');
  };

  return (
    <div className="nc-screen">
      <div className="nc-hub">
        <h1 className="nc-hub-title">
          Number Cruncher
          <span className="nc-hub-beta">(beta)</span>
        </h1>

        <p className="nc-hub-description">
          🎯 Master 10-key entry speed and accuracy! Enter numbers as they appear on screen. 
          5 seconds per number. How many can you get right?
        </p>

        {!showGuestInput ? (
          <div className="nc-hub-buttons">
            <button className="nc-btn" onClick={handlePlayClick}>
              ▶️ Play Game
            </button>
            <button
              className="nc-btn"
              onClick={() => navigate('/unified-leaderboard')}
            >
              🏆 Leaderboard
            </button>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '15px', color: '#666' }}>
              Enter your name (1-3 characters):
            </p>
            <form onSubmit={handleGuestNameSubmit}>
              <input
                className="nc-guest-name-input"
                type="text"
                maxLength="3"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="ABC"
                aria-label="Enter your name (up to 3 characters)"
                autoComplete="off"
                autoFocus
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  className="nc-btn"
                  style={{ flex: 1 }}
                >
                  Start
                </button>
                <button
                  type="button"
                  className="nc-btn"
                  style={{ flex: 1, background: '#e0e0e0', color: '#333' }}
                  onClick={() => {
                    setShowGuestInput(false);
                    setGuestName('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
