import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';
import './TouchTypingSiege.css';

const LANE_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
const LANE_X = [8, 18, 28, 38, 62, 72, 82, 92];
const CASTLE_HEALTH_START = 3;
const TICK_MS = 30;
const FIELD_HEIGHT = 520;

const DIFFICULTY_POOLS = [
  ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
  ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'],
  ['z', 'x', 'c', 'v', 'm', ',', '.', '/'],
  ['1', '2', '3', '4', '7', '8', '9', '0'],
  ['!', '@', '#', '$', '&', '*', '(', ')'],
  ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clampLevel(level) {
  return Math.max(1, Math.min(level, DIFFICULTY_POOLS.length));
}

function getPoolForLevel(level) {
  const cap = clampLevel(level);
  const pool = [];
  for (let i = 0; i < cap; i += 1) {
    pool.push(...DIFFICULTY_POOLS[i]);
  }
  return pool;
}

export default function TouchTypingSiege() {
  const navigate = useNavigate();
  const deviceType = useDeviceType();
  const [mode, setMode] = useState('ready');
  const [castleHealth, setCastleHealth] = useState(Array(8).fill(CASTLE_HEALTH_START));
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
  const pool = useMemo(() => getPoolForLevel(level), [level]);

  const totalAttempts = hits + mistakes;
  const accuracy = totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 100;

  const elapsedSeconds = startedAt ? Math.max(1, Math.floor((Date.now() - startedAt) / 1000)) : 1;
  const cpm = Math.round((hits / elapsedSeconds) * 60);

  const resetGame = () => {
    setMode('ready');
    setCastleHealth(Array(8).fill(CASTLE_HEALTH_START));
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
    const character = pickRandom(pool);

    setActiveTarget({
      lane,
      key: character,
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
  }, [mode, activeTarget, spawnDelayMs, pool]);

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
    if (mode !== 'running') {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (!activeTarget) return;
      const input = event.key;
      if (input.length !== 1) return;

      const expected = activeTarget.key;
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
  }, [mode, activeTarget, level]);

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
          <p>Defend all 8 castles by typing the falling target key.</p>
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
              <span className="tts-key">{LANE_KEYS[index]}</span>
              <span className="tts-health">{castleHealth[index]}/{CASTLE_HEALTH_START}</span>
            </div>
          </div>
        ))}

        {activeTarget && (
          <div
            key={activeTarget.id}
            className="tts-target"
            style={{ left: `${LANE_X[activeTarget.lane]}%`, top: `${activeTarget.y}px` }}
            aria-label={`Type ${activeTarget.key}`}
          >
            <span>{activeTarget.key}</span>
          </div>
        )}

        {mode !== 'running' && (
          <div className="tts-overlay">
            <div className="tts-panel">
              {mode === 'ready' ? (
                <>
                  <h2>Castle Defense Typing</h2>
                  <p>Starts with home-row keys, then expands to top row, bottom row, numbers, symbols, and case-sensitive keys.</p>
                  <ul>
                    <li>Type the exact falling character before it hits a castle.</li>
                    <li>One target at a time, with faster speed each level.</li>
                    <li>Lose when any castle reaches 0 health.</li>
                  </ul>
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
