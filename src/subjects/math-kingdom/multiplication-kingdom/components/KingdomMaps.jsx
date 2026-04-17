import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSetting } from '../../../../config/appSettings';
import { saveGameScore } from '../../../../store/progress';
import useSound from '../../../../shared/hooks/useSound';
import './KingdomMaps.css';

const gridSize = getSetting('games.kingdomMaps.gridSize');
const timedModePenalty = getSetting('games.kingdomMaps.timedModePenalty');
const feedbackDuration = getSetting('games.kingdomMaps.feedbackDuration');
const modes = getSetting('games.kingdomMaps.modes');

export default function KingdomMaps() {
  const navigate = useNavigate();
  const { mode } = useParams();
  const { play, toggleMute, isMuted } = useSound();

  // Grid state: 2D array, null = empty, number = filled
  const [grid, setGrid] = useState(() => {
    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
    // First row
    for (let i = 0; i < gridSize; i++) {
      newGrid[0][i] = i;
    }
    // First column
    for (let i = 0; i < gridSize; i++) {
      newGrid[i][0] = i;
    }
    return newGrid;
  });

  const [editingCell, setEditingCell] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [feedbackCell, setFeedbackCell] = useState(null);
  const [done, setDone] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [time, setTime] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [rowColumnIndex, setRowColumnIndex] = useState(1);
  const [rowColumnMode] = useState('row'); // 'row' or 'column'
  const [soundMuted, setSoundMuted] = useState(isMuted);
  const [checkErrors, setCheckErrors] = useState(null); // For Row & Column mode error highlighting
  const [completedRows, setCompletedRows] = useState(new Set()); // Track completed rows for locking
  const editInputRef = useRef(null);

  // Calculate correct answer for a cell
  function getCorrectAnswer(row, col) {
    return row * col;
  }

  // Timer for timed mode
  useEffect(() => {
    if (done || mode !== modes.TIMED) return;
    const timer = setInterval(() => {
      setTime(Math.floor((Date.now() - startTime) / 1000) + penalty);
    }, 100);
    return () => clearInterval(timer);
  }, [done, mode, startTime, penalty]);

  // Focus on input when cell is selected
  useEffect(() => {
    if (editingCell) {
      setTimeout(() => editInputRef.current?.focus(), 50);
    }
  }, [editingCell]);

  // Keyboard shortcut to fill all cells (Ctrl+Shift+F) for testing
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
        e.preventDefault();
        const newGrid = grid.map(r => [...r]);
        for (let row = 1; row < gridSize; row++) {
          for (let col = 1; col < gridSize; col++) {
            newGrid[row][col] = getCorrectAnswer(row, col);
          }
        }
        setGrid(newGrid);
        setEditingCell(null);
        setFeedback(null);
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid]);

  // Handle cell click
  function handleCellClick(row, col) {
    if (row === 0 || col === 0) return; // Can't edit headers
    if (done) return;
    if (completedRows.has(row)) return; // Can't edit completed rows
    setEditingCell({ row, col });
    setEditInput(grid[row][col] === null ? '' : grid[row][col].toString());
    setFeedback(null);
  }

  // Handle answer submission
  function submitAnswer() {
    if (!editingCell) return;

    const { row, col } = editingCell;
    const userAnswer = parseInt(editInput.trim(), 10);
    
    if (isNaN(userAnswer)) {
      // Allow escape to clear but treat empty as error
      setEditingCell(null);
      setEditInput('');
      return;
    }

    const correctAnswer = getCorrectAnswer(row, col);
    const isCorrect = userAnswer === correctAnswer;

    setFeedbackCell({ row, col });

    // For Row & Column mode, don't show feedback on entry
    const isRowColumnMode = mode === modes.ROW_COLUMN;

    if (isCorrect) {
      if (!isRowColumnMode) {
        play('correct');
        setFeedback('correct');
      }
      setCorrectCount(c => c + 1);

      // Update grid
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = correctAnswer;
      setGrid(newGrid);

      // Auto-advance to next cell in row
      let nextCell = null;
      for (let nextCol = col + 1; nextCol < gridSize; nextCol++) {
        if (newGrid[row][nextCol] === null) {
          nextCell = { row, col: nextCol };
          break;
        }
      }

      // If no empty cell in this row, try next row
      if (!nextCell) {
        for (let nextRow = row + 1; nextRow < gridSize; nextRow++) {
          for (let nextCol = 1; nextCol < gridSize; nextCol++) {
            if (newGrid[nextRow][nextCol] === null) {
              nextCell = { row: nextRow, col: nextCol };
              break;
            }
          }
          if (nextCell) break;
        }
      }

      // Check if game is complete (only for non-Row & Column modes)
      if (!isRowColumnMode && isGameComplete(newGrid)) {
        setTimeout(() => setDone(true), feedbackDuration);
        setTimeout(() => {
          setFeedback(null);
          setEditInput('');
          setEditingCell(null);
          setFeedbackCell(null);
        }, feedbackDuration);
      } else if (nextCell) {
        setTimeout(() => {
          setFeedback(null);
          setEditInput('');
          setEditingCell(nextCell);
          setFeedbackCell(null);
        }, isRowColumnMode ? 100 : feedbackDuration);
      } else {
        setTimeout(() => {
          setFeedback(null);
          setEditInput('');
          setEditingCell(null);
          setFeedbackCell(null);
        }, isRowColumnMode ? 100 : feedbackDuration);
      }
    } else {
      if (!isRowColumnMode) {
        play('wrong');
        setFeedback('wrong');
        setErrorCount(e => e + 1);
        if (mode === modes.TIMED) {
          setPenalty(p => p + timedModePenalty);
        }

        setTimeout(() => {
          setFeedback(null);
          setEditInput('');
          setEditingCell(null);
          setFeedbackCell(null);
        }, feedbackDuration);
      } else {
        // Row & Column mode: save the incorrect answer to grid, advance but don't show feedback
        setErrorCount(e => e + 1);
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = userAnswer; // Save what user entered (incorrect answer)
        setGrid(newGrid);
        
        let nextCell = null;
        for (let nextCol = col + 1; nextCol < gridSize; nextCol++) {
          if (newGrid[row][nextCol] === null) {
            nextCell = { row, col: nextCol };
            break;
          }
        }
        if (!nextCell) {
          for (let nextRow = row + 1; nextRow < gridSize; nextRow++) {
            for (let nextCol = 1; nextCol < gridSize; nextCol++) {
              if (newGrid[nextRow][nextCol] === null) {
                nextCell = { row: nextRow, col: nextCol };
                break;
              }
            }
            if (nextCell) break;
          }
        }
        
        setTimeout(() => {
          setEditInput('');
          if (nextCell) {
            setEditingCell(nextCell);
          } else {
            setEditingCell(null);
          }
        }, 100);
      }
    }
  }

  // Handle keyboard events in the input
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingCell(null);
      setEditInput('');
    }
  }

  // Check if entire grid is filled (excluding headers)
  function isGameComplete(currentGrid) {
    for (let row = 1; row < gridSize; row++) {
      for (let col = 1; col < gridSize; col++) {
        if (currentGrid[row][col] === null) {
          return false;
        }
      }
    }
    return true;
  }

  // Check if row/column is fully filled
  function isRowColumnFilled() {
    const index = rowColumnIndex;
    if (rowColumnMode === 'row') {
      for (let col = 1; col < gridSize; col++) {
        if (grid[index][col] === null) return false;
      }
    } else {
      for (let row = 1; row < gridSize; row++) {
        if (grid[row][index] === null) return false;
      }
    }
    return true;
  }

  // Row/Column mode: check if current row or column is complete
  function handleCheckRowColumn() {
    const index = rowColumnIndex;
    const errors = [];
    let allCorrect = true;

    if (rowColumnMode === 'row') {
      // Check row
      for (let col = 1; col < gridSize; col++) {
        const cell = grid[index][col];
        if (cell !== getCorrectAnswer(index, col)) {
          allCorrect = false;
          errors.push({ row: index, col });
        }
      }
    } else {
      // Check column
      for (let row = 1; row < gridSize; row++) {
        const cell = grid[row][index];
        if (cell !== getCorrectAnswer(row, index)) {
          allCorrect = false;
          errors.push({ row, col: index });
        }
      }
    }

    if (!allCorrect) {
      play('wrong');
      setFeedback('hasErrors');
      const errorCount = errors.length;
      setCheckErrors(errorCount); // Store count instead of array
      setTimeout(() => {
        setFeedback(null);
        setCheckErrors(null);
      }, feedbackDuration * 2);
      return;
    }

    // All correct!
    play('correct');
    setFeedback('correct');
    setCheckErrors(null);
    
    // Mark this row as completed
    const newCompleted = new Set(completedRows);
    newCompleted.add(rowColumnIndex);
    setCompletedRows(newCompleted);

    // Move to next row/column
    const nextIndex = rowColumnIndex + 1;
    if (nextIndex >= gridSize - 1) {
      // Game complete!
      setTimeout(() => setDone(true), feedbackDuration);
      setTimeout(() => setFeedback(null), feedbackDuration);
    } else {
      setRowColumnIndex(nextIndex);
      setTimeout(() => setFeedback(null), feedbackDuration);
    }
  }

  // Handle mute toggle
  function handleMuteToggle() {
    toggleMute();
    setSoundMuted(!soundMuted);
  }

  // Handle game completion
  function handleGameComplete() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000) + penalty;
    const accuracy = correctCount + errorCount > 0 ? Math.round((correctCount / (correctCount + errorCount)) * 100) : 100;

    // Track Timed and Free Play separately in leaderboard
    const scoreKey = mode === modes.TIMED ? 'kingdomMaps-timed' : 'kingdomMaps-free-play';
    saveGameScore(scoreKey, {
      mode,
      time: elapsedTime,
      correctCount,
      errorCount,
      accuracy,
    });

    navigate('/subjects/math-kingdom/multiplication-kingdom/maps');
  }

  // Celebration screen with multiplication table view
  if (done) {
    return (
      <div className="km-celebration">
        <div className="km-celebration-content">
          <div className="km-confetti">🎉</div>
          <h2 className="km-celebration-title">Grid Complete!</h2>
          
          <div className="km-results">
            {mode === modes.TIMED && (
              <>
                <div className="km-result-item">
                  <span className="km-result-label">Time:</span>
                  <span className="km-result-value">{time}s</span>
                </div>
              </>
            )}
            <div className="km-result-item">
              <span className="km-result-label">Correct:</span>
              <span className="km-result-value">{correctCount}</span>
            </div>
            {errorCount > 0 && (
              <div className="km-result-item">
                <span className="km-result-label">Errors:</span>
                <span className="km-result-value">{errorCount}</span>
              </div>
            )}
          </div>

          {/* Multiplication table view */}
          <div className="km-celebration-grid">
            <table className="km-mult-table">
              <tbody>
                {Array.from({ length: 13 }).map((_, row) => (
                  <tr key={row}>
                    {Array.from({ length: 13 }).map((_, col) => {
                      const isHeaderRow = row === 0;
                      const isHeaderCol = col === 0;
                      const isHeader = isHeaderRow || isHeaderCol;

                      return (
                        <td
                          key={`${row}-${col}`}
                          className={`km-mult-cell ${isHeader ? 'km-mult-header' : ''}`}
                        >
                          {isHeaderRow && isHeaderCol ? '' : col === 0 ? row : row === 0 ? col : row * col}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="km-celebration-btn" onClick={handleGameComplete}>
            Back to Modes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="km-container">
      <div className="km-game-header">
        <h1 className="km-game-title">🗺️ Kingdom Maps</h1>
      </div>
      <div className="km-topbar">
        <button className="km-quit-btn" onClick={() => navigate('/subjects/math-kingdom/multiplication-kingdom/maps')}>
          {mode === modes.FREE_PLAY ? '⏹ Quit' : '✕ Quit'}
        </button>
        
        <div className="km-header-center">
          {mode === modes.TIMED && (
            <div className="km-timer">⏱️ {time}s</div>
          )}
          {mode === modes.ROW_COLUMN && (
            <div className="km-progress">
              {rowColumnMode === 'row' ? '📏 Row' : '📊 Col'} {rowColumnIndex} / {gridSize - 1}
            </div>
          )}
          {mode === modes.FREE_PLAY && (
            <div className="km-stats">
              ✓ {correctCount} • ✗ {errorCount}
            </div>
          )}
        </div>

        <button className="km-mute-btn" onClick={handleMuteToggle}>
          {soundMuted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className="km-game">
        <div className="km-grid">
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              const isEditing = editingCell?.row === rowIdx && editingCell?.col === colIdx;
              const isFeedback = feedbackCell?.row === rowIdx && feedbackCell?.col === colIdx;

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`km-cell ${rowIdx === 0 || colIdx === 0 ? 'km-header-cell' : 'km-data-cell'} ${
                    isEditing ? 'km-editing' : ''
                  } ${isFeedback ? `km-feedback-${feedback}` : ''}`}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                >
                  {isEditing ? (
                    <input
                      ref={editInputRef}
                      type="number"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={submitAnswer}
                      className="km-cell-input"
                      autoComplete="off"
                    />
                  ) : (
                    cell !== null && (
                      <span className="km-cell-value">{cell}</span>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>

        {mode === modes.ROW_COLUMN && !done && (
          <button 
            className="km-check-btn" 
            onClick={handleCheckRowColumn}
            disabled={!isRowColumnFilled()}
          >
            Check {rowColumnMode === 'row' ? 'Row' : 'Column'}
          </button>
        )}

        {feedback === 'hasErrors' && (
          <div className="km-message">
            ❌ {checkErrors} {checkErrors === 1 ? 'error' : 'errors'} found — Review and fix each cell
          </div>
        )}
      </div>
    </div>
  );
}
