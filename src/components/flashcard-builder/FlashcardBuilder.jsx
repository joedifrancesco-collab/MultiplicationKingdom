import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveDeck } from '../../store/flashcards';
import './FlashcardBuilder.css';

const MAX_CARDS = 100;
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

/**
 * FlashcardBuilder Component
 * Allows users to create new flashcard decks with up to 100 cards
 * Each card has a question and answer
 */
export default function FlashcardBuilder() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([{ question: '', answer: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const cardRefs = useRef([]);

  // Auto-focus first question field on mount
  useEffect(() => {
    if (cardRefs.current[0]) {
      cardRefs.current[0].focus();
    }
  }, []);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_TITLE_LENGTH) {
      setTitle(value);
      setError('');
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
    }
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);

    // Auto-add new card when user starts typing in the last empty question field
    if (
      field === 'question' &&
      index === cards.length - 1 &&
      value.trim() &&
      cards.length < MAX_CARDS &&
      (!newCards[index + 1] || newCards[index + 1].question === '')
    ) {
      setCards([...newCards, { question: '', answer: '' }]);
    }
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      const newCards = cards.filter((_, i) => i !== index);
      setCards(newCards);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!title.trim()) {
      errors.push('Deck title is required');
    }

    const filledCards = cards.filter(card => card.question.trim() || card.answer.trim());
    if (filledCards.length === 0) {
      errors.push('Add at least one flashcard with both question and answer');
    }

    const incompleteCards = filledCards.filter(
      card => !card.question.trim() || !card.answer.trim()
    );
    if (incompleteCards.length > 0) {
      errors.push('All flashcards must have both a question and answer');
    }

    if (filledCards.length > MAX_CARDS) {
      errors.push(`Maximum ${MAX_CARDS} flashcards allowed`);
    }

    return errors;
  };

  const handleSaveDeck = async () => {
    setShowValidationErrors(true);
    const errors = validateForm();

    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    setLoading(true);
    try {
      const filledCards = cards.filter(card => card.question.trim() || card.answer.trim());

      const deckData = {
        title: title.trim(),
        description: description.trim(),
        cards: filledCards,
      };

      await saveDeck(deckData);
      
      // Navigate to deck selector or success page
      navigate('/flashcard-builder');
    } catch (err) {
      setError(`Failed to save deck: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || cards.some(card => card.question.trim() || card.answer.trim())) {
      if (window.confirm('Are you sure? Any unsaved changes will be lost.')) {
        navigate('/flashcard-builder');
      }
    } else {
      navigate('/flashcard-builder');
    }
  };

  const filledCards = cards.filter(card => card.question.trim() || card.answer.trim());
  const canAddMore = cards.length < MAX_CARDS;

  return (
    <div className="fb-builder">
      <div className="fb-header">
        <h1>📇 Create Flashcard Deck</h1>
        <p className="fb-subtitle">Build a custom deck for studying anything</p>
      </div>

      <div className="fb-container">
        {/* Deck Info Section */}
        <div className="fb-deck-info">
          <div className="fb-field-group">
            <label htmlFor="deck-title">Deck Title *</label>
            <input
              id="deck-title"
              type="text"
              placeholder="e.g., Biology Terms, Spanish Vocabulary..."
              value={title}
              onChange={handleTitleChange}
              maxLength={MAX_TITLE_LENGTH}
              className={showValidationErrors && !title.trim() ? 'fb-error' : ''}
            />
            <div className="fb-char-count">
              {title.length} / {MAX_TITLE_LENGTH}
            </div>
          </div>

          <div className="fb-field-group">
            <label htmlFor="deck-description">Description (optional)</label>
            <textarea
              id="deck-description"
              placeholder="What is this deck for? Who should use it?"
              value={description}
              onChange={handleDescriptionChange}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows="3"
            />
            <div className="fb-char-count">
              {description.length} / {MAX_DESCRIPTION_LENGTH}
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="fb-cards-section">
          <div className="fb-cards-header">
            <h2>Flashcards ({filledCards.length})</h2>
            <span className="fb-max-indicator">
              {filledCards.length} / {MAX_CARDS}
            </span>
          </div>

          <div className="fb-cards-list">
            {cards.map((card, index) => (
              <div key={index} className="fb-card-input-group">
                <div className="fb-card-number">{index + 1}</div>

                <div className="fb-card-inputs">
                  <div className="fb-card-field">
                    <label htmlFor={`question-${index}`}>Question</label>
                    <input
                      ref={el => (cardRefs.current[index] = el)}
                      id={`question-${index}`}
                      type="text"
                      placeholder="Enter question..."
                      value={card.question}
                      onChange={(e) => handleCardChange(index, 'question', e.target.value)}
                      className={
                        showValidationErrors &&
                        (card.question.trim() || card.answer.trim()) &&
                        !card.question.trim()
                          ? 'fb-error'
                          : ''
                      }
                    />
                  </div>

                  <div className="fb-card-field">
                    <label htmlFor={`answer-${index}`}>Answer</label>
                    <input
                      id={`answer-${index}`}
                      type="text"
                      placeholder="Enter answer..."
                      value={card.answer}
                      onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
                      className={
                        showValidationErrors &&
                        (card.question.trim() || card.answer.trim()) &&
                        !card.answer.trim()
                          ? 'fb-error'
                          : ''
                      }
                    />
                  </div>
                </div>

                {cards.length > 1 && (
                  <button
                    className="fb-remove-card-btn"
                    onClick={() => removeCard(index)}
                    aria-label={`Remove card ${index + 1}`}
                    title="Remove this card"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {canAddMore && (
            <button
              className="fb-add-card-btn"
              onClick={() => setCards([...cards, { question: '', answer: '' }])}
              disabled={loading}
            >
              + Add Card ({cards.length} / {MAX_CARDS})
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && <div className="fb-error-message">{error}</div>}

        {/* Action Buttons */}
        <div className="fb-actions">
          <button
            className="fb-cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="fb-save-btn"
            onClick={handleSaveDeck}
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save Deck'}
          </button>
        </div>
      </div>
    </div>
  );
}
