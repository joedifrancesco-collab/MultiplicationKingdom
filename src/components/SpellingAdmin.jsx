import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchSpellingWordGroups,
  createSpellingWordGroup,
  archiveSpellingWordGroup,
  restoreSpellingWordGroup,
  deleteSpellingWordGroup,
  updateSpellingWordGroup,
} from '../store/progress';
import './SpellingAdmin.css';

const ADMIN_PASSWORD = 'teacher123'; // Change to your preferred password

export default function SpellingAdmin() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  // Form state for new group
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupWords, setNewGroupWords] = useState('');
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Fetch groups on mount (if authenticated)
  useEffect(() => {
    if (authenticated) {
      loadGroups();
    }
  }, [authenticated]);

  const handlePasswordSubmit = () => {
    setPasswordError('');
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordInput('');
    } else {
      setPasswordError('Incorrect password');
      setPasswordInput('');
    }
  };

  const loadGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSpellingWordGroups();
      setGroups(data);
    } catch (err) {
      setError(`Failed to load word groups: ${err.message}`);
    }
    setLoading(false);
  };

  const handleCreateGroup = async () => {
    if (!newGroupTitle.trim()) {
      setError('Please enter a group title');
      return;
    }
    if (!newGroupWords.trim()) {
      setError('Please enter at least one word');
      return;
    }

    setCreatingGroup(true);
    setError('');
    try {
      // Parse words: expect format "word1|word1 sentence, word2|word2 sentence, ..."
      const words = newGroupWords
        .split(',')
        .map(line => {
          const [word, sentence] = line.split('|').map(s => s.trim());
          return { word, sentence: sentence || '' };
        })
        .filter(w => w.word);

      if (words.length === 0) {
        setError('No valid words parsed. Use format: "word|sentence, word|sentence"');
        return;
      }

      const result = await createSpellingWordGroup({
        title: newGroupTitle.trim(),
        words,
      });

      if (result.success) {
        setNewGroupTitle('');
        setNewGroupWords('');
        await loadGroups();
      } else {
        setError(`Failed to create group: ${result.error}`);
      }
    } catch (err) {
      setError(`Error creating group: ${err.message}`);
    }
    setCreatingGroup(false);
  };

  const handleArchive = async (groupId) => {
    setError('');
    try {
      const result = await archiveSpellingWordGroup(groupId);
      if (result.success) {
        await loadGroups();
      } else {
        setError(`Failed to archive: ${result.error}`);
      }
    } catch (err) {
      setError(`Error archiving: ${err.message}`);
    }
  };

  const handleRestore = async (groupId) => {
    setError('');
    try {
      const result = await restoreSpellingWordGroup(groupId);
      if (result.success) {
        await loadGroups();
      } else {
        setError(`Failed to restore: ${result.error}`);
      }
    } catch (err) {
      setError(`Error restoring: ${err.message}`);
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? This cannot be undone.')) {
      return;
    }
    setError('');
    try {
      const result = await deleteSpellingWordGroup(groupId);
      if (result.success) {
        await loadGroups();
      } else {
        setError(`Failed to delete: ${result.error}`);
      }
    } catch (err) {
      setError(`Error deleting: ${err.message}`);
    }
  };

  if (!authenticated) {
    return (
      <div className="spelling-admin">
        <div className="sa-login-card">
          <div className="sa-crown">🔐</div>
          <h1 className="sa-title">Spelling Word Admin</h1>
          <p className="sa-subtitle">Teacher access only</p>

          <input
            type="password"
            className="sa-password-input"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
          />

          {passwordError && <div className="sa-error">{passwordError}</div>}

          <button className="sa-btn sa-btn-primary" onClick={handlePasswordSubmit}>
            Access Admin Panel
          </button>

          <button className="sa-btn sa-btn-secondary" onClick={() => navigate('/spelling')}>
            Back to Spelling
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="spelling-admin">
      <header className="sa-header">
        <div className="sa-crown">⚙️</div>
        <h1 className="sa-title">Spelling Word Manager</h1>
        <p className="sa-subtitle">Create, edit, and archive word groups</p>
        <button className="sa-logout-btn" onClick={() => {
          setAuthenticated(false);
          navigate('/spelling');
        }}>
          Logout
        </button>
      </header>

      {error && <div className="sa-alert sa-alert-error">{error}</div>}

      {/* Create New Group Section */}
      <section className="sa-section">
        <h2 className="sa-section-title">➕ Create New Word Group</h2>
        
        <div className="sa-form-group">
          <label className="sa-label">Group Title</label>
          <input
            type="text"
            className="sa-input"
            placeholder="e.g., Spelling for the week of April 13th"
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
          />
        </div>

        <div className="sa-form-group">
          <label className="sa-label">Words (format: word|sentence, word|sentence, ...)</label>
          <textarea
            className="sa-textarea"
            placeholder={`example|This is an example sentence, picture|I hung a picture on the wall, place|This is my favorite place`}
            value={newGroupWords}
            onChange={(e) => setNewGroupWords(e.target.value)}
            rows={4}
          />
          <p className="sa-hint">Separate each word-sentence pair with a comma. Use pipe (|) to separate word from sentence.</p>
        </div>

        <button
          className="sa-btn sa-btn-primary"
          onClick={handleCreateGroup}
          disabled={creatingGroup}
        >
          {creatingGroup ? 'Creating...' : 'Create Group'}
        </button>
      </section>

      {/* List Groups Section */}
      <section className="sa-section">
        <h2 className="sa-section-title">📚 Existing Word Groups</h2>

        {loading ? (
          <div className="sa-loading">Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="sa-empty">No word groups yet. Create one above!</div>
        ) : (
          <div className="sa-groups-list">
            {groups.map((group) => (
              <div key={group.id} className={`sa-group-card ${group.isArchived ? 'archived' : ''}`}>
                <div className="sa-group-header">
                  <div>
                    <h3 className="sa-group-title">{group.title}</h3>
                    <p className="sa-group-meta">
                      {group.words?.length || 0} words • Created {new Date(group.createdAt?.toDate?.() || group.createdAt).toLocaleDateString()}
                    </p>
                    {group.isArchived && <span className="sa-badge">Archived</span>}
                  </div>
                </div>

                <details className="sa-group-details">
                  <summary className="sa-group-summary">View words ({group.words?.length || 0})</summary>
                  <div className="sa-words-list">
                    {group.words?.map((w, idx) => (
                      <div key={idx} className="sa-word-item">
                        <strong>{w.word}</strong>: <em>{w.sentence}</em>
                      </div>
                    ))}
                  </div>
                </details>

                <div className="sa-group-actions">
                  {group.isArchived ? (
                    <button className="sa-action-btn sa-action-restore" onClick={() => handleRestore(group.id)}>
                      ⚡ Restore
                    </button>
                  ) : (
                    <button className="sa-action-btn sa-action-archive" onClick={() => handleArchive(group.id)}>
                      📦 Archive
                    </button>
                  )}
                  <button
                    className="sa-action-btn sa-action-delete"
                    onClick={() => handleDelete(group.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
