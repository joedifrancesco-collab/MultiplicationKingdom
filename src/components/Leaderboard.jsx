import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchAggregatedLeaderboard } from '../store/progress';
import { redactProfanity } from '../utils/contentFilter';
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

  // Cloud leaderboard data
  const [cloudData, setCloudData] = useState({
    siege: [],
    speed: [],
    flashcard: [],
    fcg_timed: [],
    fcg_countdown: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch cloud leaderboard on mount
  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        const [siege, speed, flashcard, timed, sprint] = await Promise.all([
          fetchAggregatedLeaderboard('siege'),
          fetchAggregatedLeaderboard('speed'),
          fetchAggregatedLeaderboard('flashcard'),
          fetchAggregatedLeaderboard('fcg_timed'),
          fetchAggregatedLeaderboard('fcg_countdown'),
        ]);
        setCloudData({ siege, speed, flashcard, fcg_timed: timed, fcg_countdown: sprint });
      } catch (error) {
        console.error('Failed to load cloud leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCloudData();
  }, []);

  function renderCloudScore(score, i, gameType) {
    const displayName = redactProfanity(score.username || score.email || score.playerName || 'Anonymous');
    
    return (
      <div key={score.id} className="lb-row">
        <RankBadge index={i} />
        <span className="lb-row-name">{displayName}</span>
        {gameType === 'siege' && (
          <>
            <span className="lb-row-score">{score.seconds}s</span>
            <Stars n={score.stars} />
          </>
        )}
        {gameType === 'speed' && (
          <>
            <span className="lb-row-score">{score.correct}/{score.total}</span>
            <Stars n={score.stars} />
          </>
        )}
        {gameType === 'flashcard' && (
          <>
            <span className="lb-row-score">{score.correct}/{score.total}</span>
            <span className="lb-row-pct">{Math.round((score.correct / score.total) * 100)}%</span>
          </>
        )}
        {(gameType === 'fcg_timed' || gameType === 'fcg_countdown') && (
          <>
            <span className="lb-row-score">{score.correct}/{score.total}</span>
            <span className="lb-row-pct">{score.pct}%</span>
          </>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="lb-screen">
        <div className="lb-header">
          <button className="back-btn" onClick={() => navigate('/')}>‹</button>
          <h1 className="lb-title">🏆 Leaderboard</h1>
        </div>
        <div className="lb-empty">
          <div className="lb-empty-icon">⏳</div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lb-screen">
      <div className="lb-header">
        <button className="back-btn" onClick={() => navigate('/')}>‹</button>
        <h1 className="lb-title">🏆 Leaderboard</h1>
      </div>

      {/* ── Conquest ── */}
      <GameSection icon="🏰" title="Conquest" color="var(--primary)">
        {cloudData.speed.length > 0 && (
          <SubSection icon="⚡" title="Speed Challenge">
            <div className="lb-rows">
              {cloudData.speed.map((score, i) => renderCloudScore(score, i, 'speed'))}
            </div>
            <p className="lb-section-note">Best single land run. Land: {cloudData.speed[0]?.kingdomName}</p>
          </SubSection>
        )}

        {cloudData.flashcard.length > 0 && (
          <SubSection icon="🔖" title="Kingdom Flashcard">
            <div className="lb-rows">
              {cloudData.flashcard.map((score, i) => renderCloudScore(score, i, 'flashcard'))}
            </div>
          </SubSection>
        )}

        {cloudData.speed.length === 0 && cloudData.flashcard.length === 0 && (
          <p className="lb-no-scores">No cloud scores yet — start playing!</p>
        )}
      </GameSection>

      {/* ── Flashcard Challenge ── */}
      <GameSection icon="🃏" title="Flashcard Challenge" color="#FF9F43">
        <SubSection icon="⏱️" title="Timed">
          {cloudData.fcg_timed.length > 0 ? (
            <div className="lb-rows">
              {cloudData.fcg_timed.map((score, i) => renderCloudScore(score, i, 'fcg_timed'))}
            </div>
          ) : <EmptyRows />}
        </SubSection>

        <SubSection icon="⚡" title="Sprint">
          {cloudData.fcg_countdown.length > 0 ? (
            <div className="lb-rows">
              {cloudData.fcg_countdown.map((score, i) => renderCloudScore(score, i, 'fcg_countdown'))}
            </div>
          ) : <EmptyRows />}
        </SubSection>

        <SubSection icon="📚" title="Practice">
          <p className="lb-practice-note">Practice is endless and untracked — it&apos;s just for learning! 🌱</p>
        </SubSection>
      </GameSection>

      {/* ── Kingdom Siege ── */}
      {cloudData.siege.length > 0 && (
        <GameSection icon="⚔️" title="Kingdom Siege" color="#FF6B6B">
          <div className="lb-rows">
            {cloudData.siege.map((score, i) => renderCloudScore(score, i, 'siege'))}
          </div>
        </GameSection>
      )}
    </div>
  );
}

