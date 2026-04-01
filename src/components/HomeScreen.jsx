import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUsers,
  getCurrentUser,
  setCurrentUser,
  createUser,
  totalStars,
} from '../store/progress';
import './HomeScreen.css';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());
  const [users, setUsers] = useState(() => getUsers());
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  function openModal() {
    setNewName('');
    setError('');
    setShowModal(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function closeModal() {
    setShowModal(false);
    setError('');
    setNewName('');
  }

  function handleCreate() {
    const name = newName.trim();
    if (!name) { setError('Please enter a name!'); return; }
    if (name.length > 20) { setError('Name must be 20 characters or less.'); return; }
    const ok = createUser(name);
    if (!ok) { setError('That name is already taken! Try another.'); return; }
    setCurrentUser(name);
    setCurrentUserState(name);
    setUsers(getUsers());
    closeModal();
  }

  function handleSwitch(name) {
    setCurrentUser(name);
    setCurrentUserState(name);
    closeModal();
  }

  const sortedUsers = Object.keys(users).sort(
    (a, b) => totalStars(b) - totalStars(a)
  );

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="home-crown">👑</div>
        <h1 className="home-title">Multiplication<br />Kingdom</h1>
        <p className="home-subtitle">Master your times tables the fun way!</p>
      </header>

      <div className="home-games">
        <button className="home-game-card kingdom-card" onClick={() => navigate('/kingdom')}>
          <div className="game-card-icon">🏰</div>
          <div className="game-card-body">
            <div className="game-card-title">Conquest</div>
            <div className="game-card-desc">
              Conquer 12 Lands — one per times table. Train with flashcards, and then conquer the speed challenge!
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>

        <button className="home-game-card flashcard-card" onClick={() => navigate('/flashcards')}>
          <div className="game-card-icon">🃏</div>
          <div className="game-card-body">
            <div className="game-card-title">Flashcard Challenge</div>
            <div className="game-card-desc">
              All tables 1 to 12! Practice at your own pace, race the clock, or sprint for 30 seconds.
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>

        <button className="home-game-card siege-card" onClick={() => navigate('/siege')}>
          <div className="game-card-icon">⚔️</div>
          <div className="game-card-body">
            <div className="game-card-title">Kingdom Siege</div>
            <div className="game-card-desc">
              Towers under attack! Solve problems to defend — survive as long as you can!
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>
      </div>

      <div className="home-footer">
        <button className="home-footer-btn player-btn" onClick={openModal}>
          {currentUser ? `👤 ${currentUser} ›` : '💾 Save Your Progress'}
        </button>
        <button className="home-footer-btn scores-btn" onClick={() => navigate('/leaderboard')}>
          🏆 Leaderboard
        </button>
      </div>

      {showModal && (
        <div className="hs-modal-overlay" onClick={closeModal}>
          <div className="hs-modal" onClick={e => e.stopPropagation()}>
            <button className="hs-modal-close" onClick={closeModal}>✕</button>
            <h2 className="hs-modal-title">👤 Players</h2>

            <div className="hs-modal-section">
              <label className="hs-modal-label">New player name:</label>
              <div className="hs-modal-input-row">
                <input
                  ref={inputRef}
                  className="hs-modal-input"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="Enter a name…"
                  maxLength={20}
                />
                <button className="hs-modal-save-btn" onClick={handleCreate}>Save</button>
              </div>
              {error && <p className="hs-modal-error">{error}</p>}
            </div>

            {sortedUsers.length > 0 && (
              <div className="hs-modal-section">
                <div className="hs-modal-divider">Existing Players</div>
                <div className="hs-modal-players">
                  {sortedUsers.map(name => (
                    <button
                      key={name}
                      className={`hs-player-row${currentUser === name ? ' active' : ''}`}
                      onClick={() => handleSwitch(name)}
                    >
                      <span className="hs-player-name">{name}</span>
                      <span className="hs-player-stars">⭐ {totalStars(name)}</span>
                      {currentUser === name && (
                        <span className="hs-player-badge">Playing</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
