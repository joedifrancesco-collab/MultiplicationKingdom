import { useNavigate } from 'react-router-dom';
import { getUsers, getCurrentUser, totalStars, getGameBests } from '../store/progress';
import './Leaderboard.css';

const MEDAL = ['🥇', '🥈', '🥉'];

function Stars({ n, max = 3 }) {
  return (
    <span className="lb-stars-inline">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < n ? 'lb-star-on' : 'lb-star-off'}>★</span>
      ))}
    </span>
  );
}

function RankBadge({ index }) {
  return index < 3
    ? <span className="lb-medal">{MEDAL[index]}</span>
    : <span className="lb-rank-num">#{index + 1}</span>;
}

function YouBadge() {
  return <span className="lb-you-badge">You</span>;
}

function EmptyRows() {
  return <p className="lb-no-scores">No scores yet — be the first!</p>;
}

function GameSection({ icon, title, color, children }) {
  return (
    <div className="lb-section">
      <div className="lb-section-head" style={{ borderColor: color }}>
        <span className="lb-section-icon">{icon}</span>
        <span className="lb-section-title">{title}</span>
        <span className="lb-section-line" style={{ background: color }} />
      </div>
      {children}
    </div>
  );
}

function SubSection({ icon, title, children }) {
  return (
    <div className="lb-subsection">
      <div className="lb-subsection-title">{icon} {title}</div>
      {children}
    </div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const users = getUsers();
  const userNames = Object.keys(users);

  function rankByGame(gameType, sortFn) {
    return userNames
      .map(name => ({ name, best: getGameBests(name)[gameType] }))
      .filter(p => p.best != null)
      .sort(sortFn);
  }

  const overallRanked = userNames
    .map(name => ({ name, stars: totalStars(name) }))
    .sort((a, b) => b.stars - a.stars);

  const siegeRanked = rankByGame('siege',
    (a, b) => b.best.seconds - a.best.seconds);

  const speedRanked = rankByGame('speed',
    (a, b) => b.best.stars - a.best.stars || (b.best.correct / b.best.total) - (a.best.correct / a.best.total));

  const matchRanked = rankByGame('match',
    (a, b) => b.best.stars - a.best.stars || a.best.moves - b.best.moves);

  const flashcardRanked = rankByGame('flashcard',
    (a, b) => (b.best.correct / b.best.total) - (a.best.correct / a.best.total));

  const timedRanked = rankByGame('fcg_timed',
    (a, b) => b.best.pct - a.best.pct || b.best.correct - a.best.correct);

  const sprintRanked = rankByGame('fcg_countdown',
    (a, b) => b.best.pct - a.best.pct || b.best.correct - a.best.correct);

  if (userNames.length === 0) {
    return (
      <div className="lb-screen">
        <div className="lb-header">
          <button className="lb-back" onClick={() => navigate('/')}>← Back</button>
          <h1 className="lb-title">🏆 High Scores</h1>
        </div>
        <div className="lb-empty">
          <div className="lb-empty-icon">👤</div>
          <p>No saved players yet.</p>
          <p className="lb-empty-hint">Tap <strong>💾 Save Your Progress</strong> on the home screen to create a profile!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lb-screen">
      <div className="lb-header">
        <button className="lb-back" onClick={() => navigate('/')}>← Back</button>
        <h1 className="lb-title">🏆 High Scores</h1>
      </div>

      {/* ── Overall Rankings ── */}
      <GameSection icon="👑" title="Overall Rankings" color="var(--primary)">
        <div className="lb-rows">
          {overallRanked.map(({ name, stars }, i) => (
            <div key={name} className={`lb-row${name === currentUser ? ' lb-row-you' : ''}`}>
              <RankBadge index={i} />
              <span className="lb-row-name">{name}{name === currentUser && <YouBadge />}</span>
              <span className="lb-row-score">⭐ {stars}<span className="lb-row-max">/36</span></span>
              <div className="lb-row-bar">
                <div className="lb-row-bar-fill" style={{ width: `${Math.round((stars / 36) * 100)}%`, background: 'var(--primary)' }} />
              </div>
            </div>
          ))}
        </div>
      </GameSection>

      {/* ── Kingdom Siege ── */}
      {siegeRanked.length > 0 && (
        <GameSection icon="⚔️" title="Kingdom Siege" color="#FF6B6B">
          <div className="lb-rows">
            {siegeRanked.map(({ name, best }, i) => (
              <div key={name} className={`lb-row${name === currentUser ? ' lb-row-you' : ''}`}>
                <RankBadge index={i} />
                <span className="lb-row-name">{name}{name === currentUser && <YouBadge />}</span>
                <span className="lb-row-score">{best.seconds}s</span>
                <Stars n={best.stars} />
              </div>
            ))}
          </div>
        </GameSection>
      )}

      {/* ── Speed Challenge ── */}
      {speedRanked.length > 0 && (
        <GameSection icon="⚡" title="Speed Challenge" color="#FFD93D">
          <div className="lb-rows">
            {speedRanked.map(({ name, best }, i) => (
              <div key={name} className={`lb-row${name === currentUser ? ' lb-row-you' : ''}`}>
                <RankBadge index={i} />
                <span className="lb-row-name">{name}{name === currentUser && <YouBadge />}</span>
                <span className="lb-row-score">{best.correct}/{best.total}</span>
                <Stars n={best.stars} />
              </div>
            ))}
          </div>
          <p className="lb-section-note">Best single kingdom run. Kingdom: {speedRanked[0]?.best.kingdomName}</p>
        </GameSection>
      )}

      {/* ── Match Game ── */}
      {matchRanked.length > 0 && (
        <GameSection icon="🃏" title="Match Game" color="#6BCB77">
          <div className="lb-rows">
            {matchRanked.map(({ name, best }, i) => (
              <div key={name} className={`lb-row${name === currentUser ? ' lb-row-you' : ''}`}>
                <RankBadge index={i} />
                <span className="lb-row-name">{name}{name === currentUser && <YouBadge />}</span>
                <span className="lb-row-score">{best.moves} moves</span>
                <Stars n={best.stars} />
              </div>
            ))}
          </div>
        </GameSection>
      )}

      {/* ── Kingdom Flashcard ── */}
      {flashcardRanked.length > 0 && (
        <GameSection icon="🔖" title="Kingdom Flashcard" color="var(--primary)">
          <div className="lb-rows">
            {flashcardRanked.map(({ name, best }, i) => (
              <div key={name} className={`lb-row${name === currentUser ? ' lb-row-you' : ''}`}>
                <RankBadge index={i} />
                <span className="lb-row-name">{name}{name === currentUser && <YouBadge />}</span>
                <span className="lb-row-score">{best.correct}/{best.total}</span>
                <span className="lb-row-pct">{Math.round((best.correct / best.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </GameSection>
      )}

      {/* ── Flashcard Challenge ── */}
      <GameSection icon="🃏" title="Flashcard Challenge" color="#FF9F43">

        <SubSection icon="⏱️" title="Timed">
          {timedRanked.length > 0 ? (
            <div className="lb-rows">
              {timedRanked.map(({ name, best }, i) => (
                <div key={name} className={`lb-row${name === currentUser ? ' lb-row-you' : ''}`}>
                  <RankBadge index={i} />
                  <span className="lb-row-name">{name}{name === currentUser && <YouBadge />}</span>
                  <span className="lb-row-score">{best.correct}/{best.total}</span>
                  <span className="lb-row-pct">{best.pct}%</span>
                </div>
              ))}
            </div>
          ) : <EmptyRows />}
        </SubSection>

        <SubSection icon="⚡" title="Sprint">
          {sprintRanked.length > 0 ? (
            <div className="lb-rows">
              {sprintRanked.map(({ name, best }, i) => (
                <div key={name} className={`lb-row${name === currentUser ? ' lb-row-you' : ''}`}>
                  <RankBadge index={i} />
                  <span className="lb-row-name">{name}{name === currentUser && <YouBadge />}</span>
                  <span className="lb-row-score">{best.correct}/{best.total}</span>
                  <span className="lb-row-pct">{best.pct}%</span>
                </div>
              ))}
            </div>
          ) : <EmptyRows />}
        </SubSection>

        <SubSection icon="📚" title="Practice">
          <p className="lb-practice-note">Practice is endless and untracked — it&apos;s just for learning! 🌱</p>
        </SubSection>

      </GameSection>
    </div>
  );
}
