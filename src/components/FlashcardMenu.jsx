import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FlashcardMenu.css';

export default function FlashcardMenu() {
  const navigate = useNavigate();
  const [timePicker, setTimePicker] = useState(false);

  function start(mode, duration) {
    navigate('/flashcards/play', { state: { mode, duration } });
  }

  return (
    <div className="fc-menu">
      <button className="back-btn" onClick={() => navigate('/')}>‹</button>

      <header className="fc-menu-header">
        <div className="fc-menu-icon">🃏</div>
        <h1 className="fc-menu-title">Flashcard Challenge</h1>
        <p className="fc-menu-subtitle">All tables 1 × 1 to 12 × 12 — pick your mode!</p>
        <button 
          className="fc-menu-mult-table-btn" 
          onClick={() => navigate('/training/table', { state: { origin: '/flashcards' } })}
          title="Interactive Multiplication Table"
        >
          📊
        </button>
      </header>

      <div className="fc-modes">

        {/* Practice */}
        <button className="fc-mode-card practice-card" onClick={() => start('practice')}>
          <div className="fc-mode-icon">📚</div>
          <div className="fc-mode-body">
            <div className="fc-mode-title">Practice</div>
            <div className="fc-mode-desc">
              Endless and untimed. Get told straight away if you're wrong — with the correct answer. Quit any time to see your score.
            </div>
          </div>
          <div className="fc-mode-arrow">›</div>
        </button>

        {/* Timed */}
        {!timePicker ? (
          <button className="fc-mode-card timed-card" onClick={() => setTimePicker(true)}>
            <div className="fc-mode-icon">⏱️</div>
            <div className="fc-mode-body">
              <div className="fc-mode-title">Timed</div>
              <div className="fc-mode-desc">
                How many can you get right in 1, 3, or 5 minutes? Timer pauses on wrong answers so you can learn.
              </div>
            </div>
            <div className="fc-mode-arrow">›</div>
          </button>
        ) : (
          <div className="fc-time-picker timed-card">
            <div className="fc-mode-icon">⏱️</div>
            <div className="fc-time-picker-body">
              <div className="fc-mode-title">Choose your time</div>
              <div className="fc-time-btns">
                <button onClick={() => start('timed', 60)}>1 min</button>
                <button onClick={() => start('timed', 180)}>3 min</button>
                <button onClick={() => start('timed', 300)}>5 min</button>
              </div>
              <button className="fc-cancel-btn" onClick={() => setTimePicker(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Sprint */}
        <button className="fc-mode-card sprint-card" onClick={() => start('countdown', 30)}>
          <div className="fc-mode-icon">⚡</div>
          <div className="fc-mode-body">
            <div className="fc-mode-title">Sprint</div>
            <div className="fc-mode-desc">
              30 seconds. All tables 1–12. Wrong answers briefly show the answer then move on. How many can you nail?
            </div>
          </div>
          <div className="fc-mode-arrow">›</div>
        </button>

      </div>
    </div>
  );
}
