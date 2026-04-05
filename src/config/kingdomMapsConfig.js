/**
 * Kingdom Maps Game Configuration
 * Customize game parameters here
 */

export const KINGDOM_MAPS_CONFIG = {
  // Grid dimensions
  gridSize: 13, // 0-12 = 13 cells

  // Timed mode penalty (in seconds) for each wrong answer
  timedModePenalty: 3,

  // Sound and visual feedback
  feedbackDuration: 400, // milliseconds to show correct/wrong feedback

  // Game modes
  modes: {
    FREE_PLAY: 'freePlay',
    TIMED: 'timed',
    ROW_COLUMN: 'rowColumn',
  },
};
