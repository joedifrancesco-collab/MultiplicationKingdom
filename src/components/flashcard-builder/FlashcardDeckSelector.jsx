import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDecks, deleteDeck } from '../../store/flashcards';
import './FlashcardDeckSelector.css';

/**
 * FlashcardDeckSelector Component
 * Displays list of user's flashcard decks
 * Allows user to play, edit, or delete decks
 */
export default function FlashcardDeckSelector() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const userDecks = await getUserDecks();
      setDecks(userDecks);
      setError('');
    } catch (err) {
      setError('Failed to load decks. Please try again.');
      console.error('Error loading decks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayDeck = (deckId) => {
    navigate(`/flashcard-builder/play/${deckId}`);
  };

  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm('Are you sure you want to delete this deck? This cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(deckId);
      await deleteDeck(deckId);
      setDecks(decks.filter(deck => deck.id !== deckId));
    } catch (err) {
      setError('Failed to delete deck. Please try again.');
      console.error('Error deleting deck:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fds-container">
      <div className="fds-header">
        <h1>📇 My Flashcard Decks</h1>
        <p className="fds-subtitle">Select a deck to study or create a new one</p>
      </div>

      <div className="fds-content">
        {/* Create New Deck Button */}
        <button
          className="fds-create-btn"
          onClick={() => navigate('/flashcard-builder/create')}
        >
          <span className="fds-create-icon">➕</span>
          <span>Create New Deck</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="fds-error-message">
            {error}
            <button className="fds-retry-btn" onClick={loadDecks}>
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="fds-loading">
            <div className="fds-spinner"></div>
            <p>Loading your decks...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && decks.length === 0 && !error && (
          <div className="fds-empty">
            <div className="fds-empty-icon">📚</div>
            <h2>No Decks Yet</h2>
            <p>Create your first flashcard deck to get started!</p>
            <button
              className="fds-empty-cta"
              onClick={() => navigate('/flashcard-builder/create')}
            >
              Create First Deck
            </button>
          </div>
        )}

        {/* Decks List */}
        {!loading && decks.length > 0 && (
          <div className="fds-decks-grid">
            {decks.map(deck => (
              <div key={deck.id} className="fds-deck-card">
                <div className="fds-deck-header">
                  <div className="fds-deck-info">
                    <h3 className="fds-deck-title">{deck.title}</h3>
                    {deck.description && (
                      <p className="fds-deck-description">{deck.description}</p>
                    )}
                  </div>
                  <div className="fds-deck-badge">{deck.cards?.length || 0} cards</div>
                </div>

                <div className="fds-deck-metadata">
                  <span className="fds-metadata-item">
                    📅 {new Date(deck.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="fds-metadata-item">
                    🃏 {deck.cards?.length || 0} cards
                  </span>
                </div>

                <div className="fds-deck-actions">
                  <button
                    className="fds-play-btn"
                    onClick={() => handlePlayDeck(deck.id)}
                  >
                    ▶️ Play
                  </button>
                  <button
                    className="fds-delete-btn"
                    onClick={() => handleDeleteDeck(deck.id)}
                    disabled={deletingId === deck.id}
                    aria-label="Delete deck"
                  >
                    {deletingId === deck.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
