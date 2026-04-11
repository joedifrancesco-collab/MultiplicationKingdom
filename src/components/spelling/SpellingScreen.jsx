import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSpellingWordsFromFirebase } from '../../data/words';
import './SpellingScreen.css';

export default function SpellingScreen() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchSpellingWordsFromFirebase(true); // Include both active and archived
        setGroups(data);
      } catch (err) {
        setError(`Failed to load word groups: ${err.message}`);
        setGroups([]);
      }
      setLoading(false);
    };

    loadGroups();
  }, []);

  return (
    <div className="spelling-screen">
      <header className="spelling-header">
        <div className="spelling-crown">📚</div>
        <h1 className="spelling-title">Spelling Kingdom<br /><span className="spelling-sneak-peak">(beta)</span></h1>
        <p className="spelling-subtitle">Learn to spell words correctly!</p>
      </header>

      {error && (
        <div className="ss-alert ss-alert-error">
          {error}
        </div>
      )}

      <div className="spelling-games">
        {/* Word Groups Section */}
        <div className="ss-section">
          <h2 className="ss-section-title">📝 Choose a Word List</h2>
          
          {loading ? (
            <div className="ss-loading">Loading word lists...</div>
          ) : groups.length === 0 ? (
            <div className="ss-empty">No word groups available yet. Check back soon!</div>
          ) : (
            <div className="ss-groups-container">
              {groups.map((group) => (
                <button
                  key={group.id}
                  className={`ss-group-card ${group.isArchived ? 'archived' : ''}`}
                  onClick={() => navigate(`/spelling/practice/${group.id}`)}
                >
                  <div className="ss-group-content">
                    <h3 className="ss-group-title">{group.title}</h3>
                    <p className="ss-group-meta">
                      📖 {group.words?.length || 0} words
                      {group.isArchived && ' • Archived'}
                    </p>
                  </div>
                  <div className="ss-group-arrow">›</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard Card */}
        <div className="ss-section">
          <button className="spelling-game-card" onClick={() => navigate('/spelling/leaderboard')}>
            <div className="game-card-icon">🏆</div>
            <div className="game-card-body">
              <div className="game-card-title">Leaderboard</div>
              <div className="game-card-desc">
                See how you compare with other students. Track progress and celebrate achievements!
              </div>
            </div>
            <div className="game-card-arrow">›</div>
          </button>
        </div>

        {/* Admin Panel Link */}
        <div className="ss-section">
          <button className="spelling-game-card ss-admin-link" onClick={() => navigate('/spelling-admin')}>
            <div className="game-card-icon">⚙️</div>
            <div className="game-card-body">
              <div className="game-card-title">Teacher Admin</div>
              <div className="game-card-desc">
                Manage spelling word lists (password required)
              </div>
            </div>
            <div className="game-card-arrow">›</div>
          </button>
        </div>
      </div>
    </div>
  );
}
