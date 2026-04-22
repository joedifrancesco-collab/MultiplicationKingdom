import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';
import './TouchTypingSiege.css';

const LANE_X = [8, 18, 28, 38, 62, 72, 82, 92];
const CASTLE_HEALTH_START = 3;
const TICK_MS = 30;
const FIELD_HEIGHT = 520;

// Left-hand tiers (lanes 0–3), Right-hand tiers (lanes 4–7)
// Progression: home row → top row → bottom row → numbers → special chars → uppercase
const LEFT_TIERS = [
  ['a', 's', 'd', 'f'],   // 1: home row left
  ['q', 'w', 'e', 'r'],   // 2: top row left
  ['z', 'x', 'c', 'v'],   // 3: bottom row left
  ['1', '2', '3', '4'],   // 4: numbers left
  ['!', '@', '#', '$'],   // 5: symbols left
  ['A', 'S', 'D', 'F'],   // 6: uppercase left
];

const RIGHT_TIERS = [
  ['j', 'k', 'l', ';'],   // 1: home row right
  ['u', 'i', 'o', 'p'],   // 2: top row right
  ['m', ',', '.', '/'],   // 3: bottom row right
  ['7', '8', '9', '0'],   // 4: numbers right
  ['&', '*', '(', ')'],   // 5: symbols right
  ['J', 'K', 'L', ':'],   // 6: uppercase right
];

const TIER_COUNT = LEFT_TIERS.length;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clampLevel(level) {
  return Math.max(1, Math.min(level, TIER_COUNT));
}

function getSidePool(tiers, level) {
  const cap = clampLevel(level);
  const pool = [];
  for (let i = 0; i < cap; i += 1) {
    pool.push(...tiers[i]);
  }
  return pool;
}

function buildCastleTriggers(level) {
  const leftPool = getSidePool(LEFT_TIERS, level);
  const rightPool = getSidePool(RIGHT_TIERS, level);

  // Shuffle a copy and pick 4 unique keys per side
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

  const spawnTimerRef = useRef(null);

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

  const spawnDelayMs = Math.max(350, 1250 - (level - 1) * 110);
  const fallSpeedPxPerTick = Math.min(12, 2.4 + (level - 1) * 0.9);

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

    const nextLevel = clampLevel(1 + Math.floor(hits / 12));
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
          <h1>⌨️ Touch Typing</h1>
          <p>This game is desktop-web only for proper touch-typing posture.</p>
          <button className="tts-btn" onClick={() => navigate('/subjects/lab')}>Back to Extra Credit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tts-wrap">
      <header className="tts-topbar">
        <div>
          <h1>⌨️ Touch Typing Siege</h1>
          <p>Type the threatened castle's trigger key to fire and destroy incoming objects.</p>
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
              {mode === 'ready' ? 'Start' : 'Play Again'}
            </button>
          )}
        </div>
      </header>

      <section className="tts-hud">
        <div className="tts-stat">Score: <strong>{score}</strong></div>
        <div className="tts-stat">Level: <strong>{level}</strong></div>
        <div className="tts-stat">Accuracy: <strong>{accuracy}%</strong></div>
        <div className="tts-stat">CPM: <strong>{cpm}</strong></div>
        <div className="tts-stat">Best Streak: <strong>{bestStreak}</strong></div>
      </section>

      <main className="tts-field" role="application" aria-label="Touch typing game field">
        <div className="tts-skyline" />

        {LANE_X.map((x, index) => (
          <div key={`lane-${index}`} className="tts-lane" style={{ left: `${x}%` }}>
            <div className="tts-lane-line" />
            <div className="tts-castle" data-damaged={castleHealth[index] < CASTLE_HEALTH_START}>
              <span className="tts-key">{castleTriggers[index]}</span>
              <span className="tts-health">{castleHealth[index]}/{CASTLE_HEALTH_START}</span>
            </div>
          </div>
        ))}

        {activeTarget && (
          <div
            key={activeTarget.id}
            className="tts-target"
            style={{ left: `${LANE_X[activeTarget.lane]}%`, top: `${activeTarget.y}px` }}
            aria-label="Incoming projectile"
          />
        )}

        {mode !== 'running' && (
          <div className="tts-overlay">
            <div className="tts-panel">
              {mode === 'ready' ? (
                <>
                  <h2>Castle Defense Typing</h2>
                  <p>Left castles use left-hand keys. Right castles use right-hand keys. The difficulty grows as you score hits.</p>
                  <ul>
                    <li><strong>Lv 1:</strong> Home row — <kbd>asdf</kbd> / <kbd>jkl;</kbd></li>
                    <li><strong>Lv 2:</strong> + Top row — <kbd>qwer</kbd> / <kbd>uiop</kbd></li>
                    <li><strong>Lv 3:</strong> + Bottom row — <kbd>zxcv</kbd> / <kbd>m,./</kbd></li>
                    <li><strong>Lv 4:</strong> + Numbers — <kbd>1234</kbd> / <kbd>7890</kbd></li>
                    <li><strong>Lv 5:</strong> + Symbols — <kbd>!@#$</kbd> / <kbd>&amp;*()</kbd></li>
                    <li><strong>Lv 6:</strong> + Uppercase — <kbd>ASDF</kbd> / <kbd>JKL:</kbd></li>
                  </ul>
                  <p>Type the key shown on a castle to fire it when a projectile falls in its lane.</p>
                </>
              ) : (
                <>
                  <h2>Round Complete</h2>
                  <p>You defended for {elapsedSeconds}s with {hits} hits and {missedTargets} misses.</p>
                  <p>
                    Final: <strong>{hits}</strong> right out of <strong>{hits + mistakes}</strong> typed attempts.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
