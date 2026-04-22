import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';
import './TouchTypingSiege.css';

const LANE_X = [8, 18, 28, 38, 62, 72, 82, 92];
const CASTLE_HEALTH_START = 3;
const TICK_MS = 30;
const FIELD_HEIGHT = 520;
const HITS_PER_LEVEL = 10;
const CASTLE_EMOJI = '🏰';
const EXPLOSION_EMOJI = '💥';

// Cumulative tiers — keys added to left/right pool at each minLevel
const TIERS = [
  { minLevel: 1,  left: ['a','s','d','f'],          right: ['j','k','l',';'],        label: 'Home Row — asdf / jkl;' },
  { minLevel: 3,  left: ['g'],                       right: ['h'],                    label: '+ g and h (full home row)' },
  { minLevel: 5,  left: ['q','w','e','r','t'],       right: ['y','u','i','o','p'],    label: '+ Top Row' },
  { minLevel: 8,  left: ['z','x','c','v','b'],       right: ['n','m',',','.'],        label: '+ Bottom Row' },
  { minLevel: 11, left: ['1','2','3','4','5'],       right: ['6','7','8','9','0'],    label: '+ Numbers' },
  { minLevel: 14, left: ['!','@','#','$'],           right: ['&','*','(',')'],        label: '+ Symbols' },
  { minLevel: 17, left: ['A','S','D','F','G'],       right: ['H','J','K','L'],        label: '+ Capitals' },
];

// Projectile emoji escalates with level (index = level-1, capped)
const PROJECTILE_EMOJIS = ['💣','💣','☄️','☄️','🔥','🔥','⚡','⚡','🗡️','🗡️','🐉','🐉'];

function getProjectileEmoji(level) {
  return PROJECTILE_EMOJIS[Math.min(level - 1, PROJECTILE_EMOJIS.length - 1)];
}

function getCurrentTier(level) {
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (level >= tier.minLevel) current = tier;
  }
  return current;
}

function getPoolForLevel(level) {
  const leftPool = [];
  const rightPool = [];
  for (const tier of TIERS) {
    if (level >= tier.minLevel) {
      leftPool.push(...tier.left);
      rightPool.push(...tier.right);
    }
  }
  return { leftPool, rightPool };
}

function buildCastleTriggers(level) {
  const { leftPool, rightPool } = getPoolForLevel(level);
  function pick4(pool) {
    const unique = [...new Set(pool)];
    const shuffled = unique.sort(() => Math.random() - 0.5);
    const result = [];
    for (let i = 0; i < 4; i += 1) {
      result.push(shuffled[i % shuffled.length]);
    }
    return result;
  }
  return [...pick4(leftPool), ...pick4(rightPool)];
}

export default function TouchTypingSiege() {
  const navigate = useNavigate();
  const deviceType = useDeviceType();
  const [mode, setMode] = useState('ready');
  const [castleHealth, setCastleHealth] = useState(Array(8).fill(CASTLE_HEALTH_START));
  const [castleTriggers, setCastleTriggers] = useState(() => buildCastleTriggers(1));
  const [activeTarget, setActiveTarget] = useState(null);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [missedTargets, setMissedTargets] = useState(0);
  const [level, setLevel] = useState(1);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [startedAt, setStartedAt] = useState(null);

  const [explosion, setExplosion] = useState(null);
  const [missedLane, setMissedLane] = useState(null);

  const spawnTimerRef = useRef(null);
  const explosionTimerRef = useRef(null);
  const missedTimerRef = useRef(null);

  const totalAttempts = hits + mistakes;
  const accuracy = totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 100;

  const elapsedSeconds = startedAt ? Math.max(1, Math.floor((Date.now() - startedAt) / 1000)) : 1;
  const cpm = Math.round((hits / elapsedSeconds) * 60);

  const resetGame = () => {
    setMode('ready');
    setCastleHealth(Array(8).fill(CASTLE_HEALTH_START));
    setCastleTriggers(buildCastleTriggers(1));
    setActiveTarget(null);
    setScore(0);
    setHits(0);
    setMistakes(0);
    setMissedTargets(0);
    setLevel(1);
    setBestStreak(0);
    setCurrentStreak(0);
    setStartedAt(null);
  };

  // Starts slow (1500ms, 1.5px/tick) so beginners can learn home row comfortably.
  // Ramps up significantly each level — by level 17+ it's fast and uses all keys.
  const spawnDelayMs = Math.max(300, 1500 - (level - 1) * 80);
  const fallSpeedPxPerTick = Math.min(16, 1.5 + (level - 1) * 0.7);

  const spawnTarget = () => {
    const lane = Math.floor(Math.random() * 8);

    setActiveTarget({
      lane,
      y: 0,
      speed: fallSpeedPxPerTick,
      id: `${Date.now()}-${Math.random()}`,
    });
  };

  useEffect(() => {
    if (mode !== 'running' || activeTarget) {
      return undefined;
    }

    spawnTimerRef.current = setTimeout(() => {
      spawnTarget();
    }, spawnDelayMs);

    return () => {
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current);
      }
    };
  }, [mode, activeTarget, spawnDelayMs]);

  useEffect(() => {
    if (mode !== 'running') {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveTarget((prev) => {
        if (!prev) return prev;

        const nextY = prev.y + prev.speed;
        if (nextY >= FIELD_HEIGHT - 40) {
          setMissedTargets((v) => v + 1);
          setCurrentStreak(0);
          // Flash the hit castle
          setMissedLane(prev.lane);
          clearTimeout(missedTimerRef.current);
          missedTimerRef.current = setTimeout(() => setMissedLane(null), 500);
          setCastleHealth((existing) => {
            const updated = [...existing];
            updated[prev.lane] = Math.max(0, updated[prev.lane] - 1);
            return updated;
          });
          return null;
        }

        return { ...prev, y: nextY };
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'running') return;
    if (castleHealth.some((value) => value <= 0)) {
      setMode('gameover');
    }
  }, [castleHealth, mode]);

  useEffect(() => {
    if (mode !== 'running') return;
    const nextLevel = 1 + Math.floor(hits / HITS_PER_LEVEL);
    if (nextLevel !== level) {
      setLevel(nextLevel);
    }
  }, [hits, level, mode]);

  useEffect(() => {
    if (mode !== 'running') return;
    setCastleTriggers(buildCastleTriggers(level));
  }, [mode, level]);

  useEffect(() => {
    if (mode !== 'running') {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (!activeTarget) return;
      const input = event.key;
      if (input.length !== 1) return;

      const expected = castleTriggers[activeTarget.lane];
      if (input === expected) {
        // Spawn explosion at the target's current position
        setExplosion({ lane: activeTarget.lane, y: activeTarget.y, id: Date.now() });
        clearTimeout(explosionTimerRef.current);
        explosionTimerRef.current = setTimeout(() => setExplosion(null), 700);
        setHits((v) => v + 1);
        setCurrentStreak((streak) => {
          const updated = streak + 1;
          setBestStreak((prev) => Math.max(prev, updated));
          return updated;
        });
        setScore((v) => v + 10 + Math.min(30, level * 2));
        setActiveTarget(null);
      } else {
        setMistakes((v) => v + 1);
        setCurrentStreak(0);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, activeTarget, level, castleTriggers]);

  if (deviceType !== 'desktop') {
    return (
      <div className="tts-wrap tts-mobile-block">
        <div className="tts-panel">
          <h1>⌨️ Touch Typing Siege</h1>
          <p>This game requires a physical keyboard — please open it on a desktop or laptop.</p>
          <div className="tts-panel-buttons">
            <button className="tts-btn tts-secondary" onClick={() => navigate('/subjects/lab')}>Back to Extra Credit</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tts-wrap">
      <header className="tts-topbar">
        <div>
          <h1>⌨️ Touch Typing Siege</h1>
          <p>Type the key on the threatened castle to fire its cannon and destroy the incoming enemy.</p>
        </div>
        <div className="tts-actions">
          <button className="tts-btn tts-secondary" onClick={() => navigate('/subjects/lab')}>Back</button>
          {mode === 'running' ? (
            <button className="tts-btn" onClick={() => setMode('gameover')}>Quit</button>
          ) : (
            <button
              className="tts-btn"
              onClick={() => {
                resetGame();
                setStartedAt(Date.now());
                setMode('running');
              }}
            >
              {mode === 'ready' ? '⚔️ Start' : '⚔️ Play Again'}
            </button>
          )}
        </div>
      </header>

      <section className="tts-hud">
        <div className="tts-stat"><span>Score</span><strong>{score}</strong></div>
        <div className="tts-stat"><span>Level</span><strong>{level}</strong></div>
        <div className="tts-stat"><span>Accuracy</span><strong>{accuracy}%</strong></div>
        <div className="tts-stat"><span>CPM</span><strong>{cpm}</strong></div>
        <div className="tts-stat"><span>Streak</span><strong>{currentStreak}</strong></div>
        <div className="tts-tier-badge">🎯 {getCurrentTier(level).label}</div>
      </section>

      <main className="tts-field" role="application" aria-label="Touch typing game field">
        <div className="tts-ground" />

        {LANE_X.map((x, index) => (
          <div key={`lane-${index}`} className="tts-lane" style={{ left: `${x}%` }}>
            <div className="tts-lane-line" />
            <div
              className={`tts-castle${missedLane === index ? ' missed' : ''}`}
              data-damaged={castleHealth[index] < CASTLE_HEALTH_START}
            >
              <span className="tts-castle-emoji">{CASTLE_EMOJI}</span>
              <kbd className="tts-key">{castleTriggers[index]}</kbd>
              <div className="tts-health-pips">
                {Array.from({ length: CASTLE_HEALTH_START }, (_, i) => (
                  <span key={i} className={`tts-hp ${i < castleHealth[index] ? 'filled' : 'empty'}`} />
                ))}
              </div>
            </div>
          </div>
        ))}

        {activeTarget && (
          <div
            key={activeTarget.id}
            className="tts-target"
            style={{ left: `${LANE_X[activeTarget.lane]}%`, top: `${activeTarget.y}px` }}
            aria-label="Incoming enemy"
          >
            {getProjectileEmoji(level)}
          </div>
        )}

        {explosion && (
          <div
            key={explosion.id}
            className="tts-explosion"
            style={{ left: `${LANE_X[explosion.lane]}%`, top: `${explosion.y}px` }}
          >
            {EXPLOSION_EMOJI}
          </div>
        )}

        {mode !== 'running' && (
          <div className="tts-overlay">
            <div className="tts-panel">
              {mode === 'ready' ? (
                <>
                  <h2>⚔️ Castle Defense Typing</h2>
                  <p>Defend your 8 castles from waves of enemies. Left 4 castles = left-hand keys. Right 4 castles = right-hand keys. Difficulty grows as you level up.</p>
                  <ul className="tts-tier-list">
                    {TIERS.map((tier) => (
                      <li key={tier.minLevel}>
                        <strong>Lv {tier.minLevel}+</strong> {tier.label}
                      </li>
                    ))}
                  </ul>
                  <div className="tts-panel-buttons">
                    <button
                      className="tts-btn"
                      onClick={() => {
                        resetGame();
                        setStartedAt(Date.now());
                        setMode('running');
                      }}
                    >
                      ⚔️ Start Game
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2>⚔️ Siege Over!</h2>
                  <div className="tts-gameover-stats">
                    <div>
                      <span className="tts-gameover-stat-val">{score}</span>
                      <span className="tts-gameover-stat-lbl">Score</span>
                    </div>
                    <div>
                      <span className="tts-gameover-stat-val">Lv {level}</span>
                      <span className="tts-gameover-stat-lbl">Level Reached</span>
                    </div>
                    <div>
                      <span className="tts-gameover-stat-val">{accuracy}%</span>
                      <span className="tts-gameover-stat-lbl">Accuracy</span>
                    </div>
                    <div>
                      <span className="tts-gameover-stat-val">{cpm}</span>
                      <span className="tts-gameover-stat-lbl">Keys / Min</span>
                    </div>
                    <div>
                      <span className="tts-gameover-stat-val">{bestStreak}</span>
                      <span className="tts-gameover-stat-lbl">Best Streak</span>
                    </div>
                    <div>
                      <span className="tts-gameover-stat-val">{hits}</span>
                      <span className="tts-gameover-stat-lbl">Enemies Slain</span>
                    </div>
                  </div>
                  <p>Tier reached: <strong>{getCurrentTier(level).label}</strong></p>
                  <div className="tts-panel-buttons">
                    <button
                      className="tts-btn"
                      onClick={() => {
                        resetGame();
                        setStartedAt(Date.now());
                        setMode('running');
                      }}
                    >
                      ⚔️ Play Again
                    </button>
                    <button className="tts-btn tts-secondary" onClick={() => navigate('/subjects/lab')}>Back</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
