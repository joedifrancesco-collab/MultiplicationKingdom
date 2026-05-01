/**
 * useGameLoop Hook
 * 
 * Abstracts the common game flow pattern used by multiple game components:
 * - Question presentation
 * - User input/interaction
 * - Answer validation
 * - Score tracking
 * - Progression to next question or completion
 * - Star calculation and award
 * 
 * Used by: SpeedChallenge, Flashcard, MatchGame, SpellingPractice, FlashcardGame
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { awardStars, saveGameScore } from '../../store/progress';
import useSound from './useSound';

/**
 * Core game loop hook
 * @param {Object} config Configuration object
 * @param {Array} config.questions Array of question objects
 * @param {Function} config.validateAnswer (question, userAnswer) => boolean
 * @param {Function} config.onGameEnd (stats) => void - Called when game ends
 * @param {Function} config.calcStars (score, total) => 0-3 stars - Star calculation
 * @param {string} config.gameType 'speed', 'flashcard', 'match', 'spelling', etc.
 * @param {Object} config.metadata { kingdomId, kingdomName, groupId, etc. } - For scoring
 * @param {boolean} config.autoAdvance Auto-advance after validation (default: false)
 * @param {number} config.advanceDelay Delay before auto-advance (ms, default: 400)
 * @returns {Object} Game state and handlers
 */
export default function useGameLoop({
  questions,
  validateAnswer,
  onGameEnd,
  calcStars,
  gameType,
  metadata = {},
  autoAdvance = false,
  advanceDelay = 400,
}) {
  const { play } = useSound();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [done, setDone] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);
  const advanceTimeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  // End game: calculate stars, award, and trigger callback
  useEffect(() => {
    if (!done) return;

    const stars = calcStars(score, questions.length);
    setEarnedStars(stars);

    if (metadata.kingdomId) {
      awardStars(metadata.kingdomId, stars);
    }

    saveGameScore(gameType, {
      ...metadata,
      correct: score,
      total: questions.length,
      stars,
    });

    if (onGameEnd) {
      onGameEnd({ score, stars, total: questions.length });
    }
  }, [done, score, questions.length, calcStars, gameType, metadata, onGameEnd]);

  /**
   * Manually advance to next question or end game
   */
  const advanceToNext = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    setFeedback(null);

    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
    }
  }, [index, questions.length]);

  /**
   * Handle answer submission
   * Validates, plays sound, updates score, and either auto-advances or returns control
   * @param {*} userAnswer User's answer (string, number, object, etc.)
   * @param {Function} onCorrect Optional: called if answer is correct
   * @param {Function} onWrong Optional: called if answer is wrong
   */
  const submitAnswer = useCallback(
    (userAnswer, onCorrect, onWrong) => {
      const currentQuestion = questions[index];
      const isCorrect = validateAnswer(currentQuestion, userAnswer);

      // Play feedback sound
      if (isCorrect) {
        play('correct');
        if (onCorrect) onCorrect();
      } else {
        play('wrong');
        if (onWrong) onWrong();
      }

      // Update score and show feedback
      setFeedback(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        setScore(s => s + 1);
      }

      // Auto-advance or wait for manual advance
      if (autoAdvance) {
        advanceTimeoutRef.current = setTimeout(() => {
          advanceToNext();
        }, advanceDelay);
      }
    },
    [index, questions, validateAnswer, autoAdvance, advanceDelay, play, advanceToNext]
  );

  /**
   * End game immediately (used by timer or user abort)
   */
  const endGameNow = useCallback(() => {
    setDone(true);
  }, []);

  /**
   * Toggle sound mute
   */
  const toggleMute = useCallback(() => {
    setSoundMuted(m => !m);
  }, []);

  /**
   * Get current question
   */
  const currentQuestion = questions[index] || null;

  /**
   * Get progress as percentage
   */
  const progress = (index / questions.length) * 100;

  return {
    // State
    index,
    currentQuestion,
    score,
    feedback,
    done,
    earnedStars,
    soundMuted,
    progress,
    total: questions.length,

    // Actions
    submitAnswer,
    advanceToNext,
    endGameNow,
    toggleMute,

    // Status
    isComplete: done,
    isLastQuestion: index === questions.length - 1,
  };
}
