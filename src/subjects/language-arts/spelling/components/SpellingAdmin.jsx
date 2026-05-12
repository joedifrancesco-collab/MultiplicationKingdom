import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchSpellingWordGroups,
  createSpellingWordGroup,
  archiveSpellingWordGroup,
  restoreSpellingWordGroup,
  deleteSpellingWordGroup,
} from '../../../../store/progress';
import { parseWordList, generateSentencesForWords } from '../../../../shared/utils/sentenceGenerator';
import { generateSentencesWithAI } from '../../../../shared/utils/geminiSentenceGenerator';
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
  const [wordListInput, setWordListInput] = useState('');
  const [generatedWords, setGeneratedWords] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [generatingWithAI, setGeneratingWithAI] = useState(false);

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

  // Fetch groups on mount (if authenticated)
  useEffect(() => {
    if (authenticated) {
      loadGroups();
    }
  }, [authenticated]);

  const handleGenerateSentences = () => {
    setError('');
    setParseErrors([]);

    const { words, errors } = parseWordList(wordListInput);

    if (errors.length > 0) {
      setParseErrors(errors);
    }

    if (words.length === 0) {
      setError('No valid words found. Please check your input.');
      return;
    }

    // Generate sentences for all words
    const generated = generateSentencesForWords(words);
    setGeneratedWords(generated);
  };

  const handleGenerateWithAI = async () => {
    setError('');
    setParseErrors([]);

    const { words, errors } = parseWordList(wordListInput);

    if (errors.length > 0) {
      setParseErrors(errors);
    }

    if (words.length === 0) {
      setError('No valid words found. Please check your input.');
      return;
    }

    setGeneratingWithAI(true);
    try {
      const generated = await generateSentencesWithAI(words);
      setGeneratedWords(generated);
    } catch (err) {
      setError(`AI generation failed: ${err.message}`);
      // Fallback to template-based generation
      const fallback = generateSentencesForWords(words);
      setGeneratedWords(fallback);
    } finally {
      setGeneratingWithAI(false);
    }
  };

  const handleEditSentence = (index, newSentence) => {
    const updated = [...generatedWords];
    updated[index].sentence = newSentence;
    setGeneratedWords(updated);
  };

  const handleCreateGroup = async () => {
    if (!newGroupTitle.trim()) {
      setError('Please enter a group title');
      return;
    }
    if (generatedWords.length === 0) {
      setError('No words to create. Generate sentences first.');
      return;
    }

    setCreatingGroup(true);
    setError('');
    try {
      const result = await createSpellingWordGroup({
        title: newGroupTitle.trim(),
        words: generatedWords,
      });

      if (result.success) {
        setNewGroupTitle('');
        setWordListInput('');
        setGeneratedWords([]);
        setParseErrors([]);
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
          <label className="sa-label">Word List (paste a numbered list)</label>
          <textarea
            className="sa-textarea"
            placeholder={`1. apple\n2. banana\n3. cat\n4. dog\n5. elephant`}
            value={wordListInput}
            onChange={(e) => setWordListInput(e.target.value)}
            rows={5}
          />
          <p className="sa-hint">Enter each word on a new line (numbered or plain). Example: 1. apple, 2. banana or just "apple, banana"</p>
        </div>

        <div className="sa-button-group">
          <button
            className="sa-btn sa-btn-secondary"
            onClick={handleGenerateSentences}
            disabled={!wordListInput.trim()}
          >
            📝 Generate Sentences
          </button>
          <button
            className="sa-btn sa-btn-primary"
            onClick={handleGenerateWithAI}
            disabled={!wordListInput.trim() || generatingWithAI}
            title="Uses AI to create contextual sentences (requires Google Gemini API key)"
          >
            {generatingWithAI ? '🤖 Generating...' : '🤖 Generate with AI'}
          </button>
        </div>

        {/* Show parse errors */}
        {parseErrors.length > 0 && (
          <div className="sa-parse-warnings">
            {parseErrors.map((err, idx) => (
              <div key={idx} className="sa-warning">{err}</div>
            ))}
          </div>
        )}

        {/* Preview generated words with edit capability */}
        {generatedWords.length > 0 && (
          <div className="sa-preview-section">
            <h3 className="sa-preview-title">✨ Generated Sentences (edit as needed)</h3>
            <div className="sa-preview-list">
              {generatedWords.map((item, idx) => (
                <div key={idx} className="sa-preview-item">
                  <div className="sa-preview-word">{item.word}</div>
                  <input
                    type="text"
                    className="sa-preview-sentence"
                    value={item.sentence}
                    onChange={(e) => handleEditSentence(idx, e.target.value)}
                    placeholder="Edit sentence here..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {generatedWords.length > 0 && (
          <button
            className="sa-btn sa-btn-primary"
            onClick={handleCreateGroup}
            disabled={creatingGroup}
          >
            {creatingGroup ? 'Creating...' : `✅ Create Group (${generatedWords.length} words)`}
          </button>
        )}
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
