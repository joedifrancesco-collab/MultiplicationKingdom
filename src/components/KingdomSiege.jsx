import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ALL_QUESTIONS } from '../data/questions';
import { saveGameScore } from '../store/progress';
import useSound from '../shared/hooks/useSound';
import './KingdomSiege.css';

// ── Config ───────────────────────────────────────────────────────────────────
const PHASES = [
  { spawnInterval: 4000, fallDuration: 8000 },  // 0–20 s  : slow warmup
  { spawnInterval: 3000, fallDuration: 6500 },  // 20–40 s : picking up
  { spawnInterval: 2000, fallDuration: 5000 },  // 40–60 s : intense
  { spawnInterval: 1400, fallDuration: 3500 },  // 60 s+   : frantic
];

const TOWER_COUNT   = 5;
const STUN_MS       = 800;
const EXPLOSION_MS  = 700;
const ENEMY_EMOJIS  = ['🐉', '☄️', '💣', '🔥', '⚡', '🗡️'];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getPhase(seconds) {
  if (seconds < 20) return 0;
  if (seconds < 40) return 1;
  if (seconds < 60) return 2;
  return 3;
}

function randomQuestion() {
  return ALL_QUESTIONS[Math.floor(Math.random() * ALL_QUESTIONS.length)];
}

function calcStars(seconds) {
  if (seconds >= 90) return 3;
  if (seconds >= 45) return 2;
  if (seconds >= 15) return 1;
  return 0;
}

function makeChoices(correct) {
  const offsets = [-12,-10,-8,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,8,10,12];
  const candidates = offsets
    .map(o => correct + o)
    .filter(v => v > 0 && v !== correct);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  const wrong = [];
  for (const c of shuffled) {
    if (wrong.length >= 2) break;
    wrong.push(c);
  }
  return [...wrong, correct].sort(() => Math.random() - 0.5);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function KingdomSiege() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const origin = state?.origin || '/';
  const { play, toggleMute, isMuted } = useSound();

  // 'intro' | 'play' | 'done'
  const [screen, setScreen] = useState('intro');
  const [soundMuted, setSoundMuted] = useState(isMuted);

  // ── Render-driven state ──────────────────────────────────────────────────
  const [renderEnemies, setRenderEnemies] = useState([]);
  const [towers,        setTowers]        = useState(Array(TOWER_COUNT).fill(true));
  const [score,         setScore]         = useState(0);
  const [curQ,          setCurQ]          = useState(null);
  const [isStunned,     setIsStunned]     = useState(false);
  const [feedback,      setFeedback]      = useState(null); // 'correct' | 'wrong'
  const [explosions,    setExplosions]    = useState([]);
  const [choices,       setChoices]       = useState([]);

  // ── Refs (mutation-safe, no re-render needed) ────────────────────────────
  const curQRef  = useRef(null);   // always-fresh for handleChoice
  const gRef     = useRef(null);   // mutable game state  (updated in loop)
  const rafRef   = useRef(null);   // requestAnimationFrame handle

  // ── Game Loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'play') return;

    // Reset mutable state for a fresh game
    const initPhase = PHASES[0];
    gRef.current = {
      enemies:      [],
      nextId:       0,
      spawnTimer:   initPhase.spawnInterval, // spawn first enemy immediately
      time:         0,       // ms
      towers:       Array(TOWER_COUNT).fill(true),
      stunned:      false,
      stunnedTimer: 0,
    };
    curQRef.current = null;

    let running = true;
    let last    = null;
    const g     = gRef.current;

    function loop(now) {
      if (!running) return;
      if (last === null) last = now;
      const dt = Math.min(now - last, 100); // cap so pausing tab doesn't cause huge jumps
      last = now;

      g.time += dt;
      const seconds = g.time / 1000;
      const phase = getPhase(seconds);
      const { spawnInterval, fallDuration } = PHASES[phase];

      // ── Stun countdown
      if (g.stunned) {
        g.stunnedTimer -= dt;
        if (g.stunnedTimer <= 0) {
          g.stunned = false;
          setIsStunned(false);
        }
      }

      // ── Spawn a new enemy
      g.spawnTimer += dt;
      if (g.spawnTimer >= spawnInterval) {
        g.spawnTimer = 0;
        const aliveTowers = g.towers
          .map((a, i) => (a ? i : -1))
          .filter(i => i >= 0);
        if (aliveTowers.length > 0) {
          const targetTower = aliveTowers[Math.floor(Math.random() * aliveTowers.length)];
          const emoji = ENEMY_EMOJIS[Math.floor(Math.random() * ENEMY_EMOJIS.length)];
          const q     = randomQuestion();
          g.enemies.push({
            id:           g.nextId++,
            x:            5 + Math.random() * 82, // 5–87 % horizontal
            spawnTime:    now,
            fallDuration,
            targetTower,
            emoji,
            question:     q.question,
            answer:       q.answer,
          });
        }
      }

      // ── Check if any enemy has reached the bottom
      let towerHit = false;
      g.enemies = g.enemies.filter(e => {
        const progress = (now - e.spawnTime) / e.fallDuration;
        if (progress >= 1) {
          if (g.towers[e.targetTower]) {
            g.towers[e.targetTower] = false;
            towerHit = true;
          }
          return false;
        }
        return true;
      });

      // ── Auto-target: most dangerous = furthest down (highest progress)
      let dangerous = null;
      if (g.enemies.length > 0) {
        dangerous = g.enemies.reduce((m, e) => {
          const ep = (now - e.spawnTime) / e.fallDuration;
          const mp = (now - m.spawnTime) / m.fallDuration;
          return ep > mp ? e : m;
        });
      }

      const prevQId = curQRef.current?.id ?? null;
      const newQ = dangerous
        ? { id: dangerous.id, text: dangerous.question, answer: dangerous.answer }
        : null;
      curQRef.current = newQ;
      const qChanged = (newQ?.id ?? null) !== prevQId;

      // ── Build render snapshot (positions computed fresh each frame)
      const re = g.enemies.map(e => ({
        id:       e.id,
        x:        e.x,
        y:        Math.min(((now - e.spawnTime) / e.fallDuration) * 100, 99),
        emoji:    e.emoji,
        targeted: dangerous ? e.id === dangerous.id : false,
      }));

      // ── Push all render updates (React 18 batches these)
      setRenderEnemies(re);
      setScore(Math.floor(seconds));
      if (qChanged) setCurQ(newQ);
      if (towerHit) setTowers([...g.towers]);

      // ── Game-over check
      if (g.towers.every(t => !t)) {
        const finalSecs = Math.floor(seconds);
        saveGameScore('siege', { seconds: finalSecs, stars: calcStars(finalSecs) });
        setScreen('done');
        return; // stops the loop
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [screen]); // re-runs when screen becomes 'play'

  // Regenerate choices whenever the targeted enemy changes
  useEffect(() => {
    if (curQ) {
      setChoices(makeChoices(curQ.answer));
    } else {
      setChoices([]);
    }
  }, [curQ]);

  // ── Answer Selection ──────────────────────────────────────────────────────
  function handleChoice(val) {
    const g = gRef.current;
    if (!g || g.stunned) return;
    const q = curQRef.current;
    if (!q) return;

    if (val === q.answer) {
      // ✓ Correct – intercept the targeted enemy
      play('correct');
      // eslint-disable-next-line react-hooks/purity
      const now = performance.now();
      const idx = g.enemies.findIndex(e => e.id === q.id);
      if (idx !== -1) {
        const enemy  = g.enemies[idx];
        const yPct   = Math.min(((now - enemy.spawnTime) / enemy.fallDuration) * 100, 99);
        const expId  = g.nextId++;
        setExplosions(prev => [...prev, { id: expId, x: enemy.x, y: yPct }]);
        setTimeout(
          () => setExplosions(prev => prev.filter(ex => ex.id !== expId)),
          EXPLOSION_MS,
        );
        g.enemies.splice(idx, 1);
      }
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 350);
    } else {
      // ✗ Wrong – brief stun
      play('wrong');
      g.stunned      = true;
      g.stunnedTimer = STUN_MS;
      setIsStunned(true);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  }

  // ── Shared reset helper ──────────────────────────────────────────────────
  function resetAndPlay() {
    setRenderEnemies([]);
    setTowers(Array(TOWER_COUNT).fill(true));
    setScore(0);
    setCurQ(null);
    setIsStunned(false);
    setFeedback(null);
    setExplosions([]);
    setChoices([]);
    setScreen('play');
  }

  // ── Mute toggle handler ──────────────────────────────────────────────────
  function handleMuteToggle() {
    toggleMute();
    setSoundMuted(!soundMuted);
  }

  // ── Screens ──────────────────────────────────────────────────────────────

  if (screen === 'intro') {
    return (
      <div className="siege-container">
        <div className="siege-intro-header">
          <button className="back-btn" onClick={() => navigate(origin)}>‹</button>
          <button 
            className="siege-mult-table-btn-intro" 
            onClick={() => navigate('/training/table', { state: { origin: '/siege' } })}
            title="Interactive Multiplication Table"
          >
            📊
          </button>
        </div>
        <div className="siege-intro">
          <div className="siege-intro-icon">🏰</div>
          <h1 className="siege-title">Kingdom Siege</h1>
          <p className="siege-subtitle">Your towers are under attack!</p>
          <ul className="siege-rules">
            <li>🎯 Tap the correct answer to <strong>fire</strong> at the closest threat</li>
            <li>❌ Wrong answer = brief stun</li>
            <li>🏰 Protect all 5 towers</li>
            <li>⚡ Enemies get faster over time</li>
            <li>⏱️ Survive as long as you can!</li>
          </ul>
          <button className="siege-start-btn" onClick={resetAndPlay}>
            ⚔️ Start Siege
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'done') {
    const stars = calcStars(score);
    const doneIcon  = score >= 90 ? '🏆' : score >= 45 ? '🎉' : '💀';
    const doneTitle = score >= 90 ? 'Kingdom Defended!' : score >= 45 ? 'Well Fought!' : 'Kingdom Fallen!';
    return (
      <div className="siege-container">
        <div className="siege-done">
          <div className="siege-done-icon">{doneIcon}</div>
          <h2 className="siege-done-title">{doneTitle}</h2>
          <p className="siege-time">You survived <strong>{score}s</strong></p>
          <div className="stars-earned">
            {[1, 2, 3].map(s => (
              <span key={s} className={s <= stars ? 'star filled' : 'star empty'}>★</span>
            ))}
          </div>
          <div className="siege-star-labels">
            <span>15s ⭐</span>
            <span>45s ⭐⭐</span>
            <span>90s ⭐⭐⭐</span>
          </div>
          <div className="done-buttons">
            <button onClick={resetAndPlay}>Play Again</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>Home</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Play screen ──────────────────────────────────────────────────────────
  return (
    <div className="siege-container siege-playing">
      {/* Header */}
      <div className="siege-header">
        <button className="fcg-quit-btn" onClick={() => setScreen('intro')}>✕ Quit</button>
        <div className="siege-score">⏱ {score}s</div>
        <div className="siege-phase-badge">Phase {getPhase(score) + 1}</div>
        <button 
          className="siege-mult-table-btn" 
          onClick={() => navigate('/training/table', { state: { origin: '/siege' } })}
          title="Interactive Multiplication Table"
        >
          📊
        </button>
        <button className="fcg-mute-btn" onClick={handleMuteToggle} title={soundMuted ? 'Unmute' : 'Mute'}>
          {soundMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Battle field */}
      <div className="siege-field">
        {renderEnemies.map(e => (
          <div
            key={e.id}
            className={`siege-enemy${e.targeted ? ' targeted' : ''}`}
            style={{ left: `${e.x}%`, top: `${e.y}%` }}
          >
            {e.emoji}
          </div>
        ))}
        {explosions.map(ex => (
          <div
            key={ex.id}
            className="siege-explosion"
            style={{ left: `${ex.x}%`, top: `${ex.y}%` }}
          >
            💥
          </div>
        ))}
      </div>

      {/* Question + choices */}
      <div className="siege-question-area">
        <div className={[
          'siege-question',
          feedback   || '',
          isStunned  ? 'stunned' : '',
        ].join(' ').trim()}>
          {curQ ? `${curQ.text} = ?` : '⚡ Incoming…'}
        </div>

        <div className="siege-choices">
          {choices.map((val, i) => (
            <button
              key={i}
              className={`siege-choice-btn${isStunned ? ' stunned' : ''}`}
              disabled={isStunned || !curQ}
              onClick={() => handleChoice(val)}
            >
              {val}
            </button>
          ))}
          {choices.length === 0 && (
            <button className="siege-choice-btn" disabled>…</button>
          )}
        </div>

        {isStunned && <p className="siege-stun-msg">❌ Stunned — wait a moment…</p>}
      </div>

      {/* Tower row */}
      <div className="siege-towers">
        {towers.map((alive, i) => (
          <div key={i} className={`siege-tower${alive ? '' : ' destroyed'}`}>
            {alive ? '🏰' : '🪨'}
          </div>
        ))}
      </div>
    </div>
  );
}
