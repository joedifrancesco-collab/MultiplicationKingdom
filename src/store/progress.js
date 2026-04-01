import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const KEY = 'mk_progress';
const USERS_KEY = 'mk_users';
const CURRENT_USER_KEY = 'mk_current_user';

function defaultProgress() {
  return {
    kingdoms: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      stars: 0,
      unlocked: i === 0,
    })),
    siegeBest: 0,
  };
}

// ── User management ──────────────────────────────────────────────────────────

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY) || null;
}

export function setCurrentUser(username) {
  if (username) {
    localStorage.setItem(CURRENT_USER_KEY, username);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

/**
 * Creates a new named user, seeding their profile with any existing anonymous
 * progress. Returns false if the username is already taken (case-insensitive).
 */
export function createUser(username) {
  const users = getUsers();
  const lc = username.toLowerCase();
  if (Object.keys(users).some(u => u.toLowerCase() === lc)) return false;

  // Seed with current anonymous progress so nothing is lost
  let seed = defaultProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) seed = { ...defaultProgress(), ...JSON.parse(raw) };
  } catch { /* ignore */ }

  users[username] = { kingdoms: seed.kingdoms, siegeBest: seed.siegeBest || 0 };
  saveUsers(users);
  return true;
}

export function totalStars(username) {
  const users = getUsers();
  const user = users[username];
  if (!user) return 0;
  return user.kingdoms.reduce((sum, k) => sum + k.stars, 0);
}

// ── Progress read / write (user-aware) ──────────────────────────────────────

export function getProgress() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const users = getUsers();
    return users[currentUser] || defaultProgress();
  }
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultProgress();
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const users = getUsers();
    // Merge so siegeBest and other extra fields are not clobbered
    users[currentUser] = { siegeBest: 0, ...users[currentUser], ...progress };
    saveUsers(users);
    return;
  }
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function awardStars(kingdomId, stars) {
  const progress = getProgress();
  const kp = progress.kingdoms.find(k => k.id === kingdomId);
  if (!kp) return progress;

  if (stars > kp.stars) {
    kp.stars = stars;
  }

  if (stars >= 1 && kingdomId < 12) {
    const next = progress.kingdoms.find(k => k.id === kingdomId + 1);
    if (next) next.unlocked = true;
  }

  saveProgress(progress);
  return progress;
}

// ── Game score tracking ──────────────────────────────────────────────────────
//
// Supported gameTypes and their data shapes:
//   siege     : { seconds, stars }
//   speed     : { stars, correct, total, kingdomId, kingdomName }
//   match     : { stars, moves, kingdomId, kingdomName }
//   flashcard : { correct, total, kingdomId, kingdomName }
//   fcg       : { correct, total, pct, mode }

function isBetter(gameType, next, prev) {
  if (!prev) return true;
  switch (gameType) {
    case 'siege':
      return next.seconds > prev.seconds;
    case 'speed':
      if (next.stars !== prev.stars) return next.stars > prev.stars;
      return (next.correct / next.total) > (prev.correct / prev.total);
    case 'match':
      if (next.stars !== prev.stars) return next.stars > prev.stars;
      return next.moves < prev.moves;
    case 'flashcard':
      return (next.correct / next.total) > (prev.correct / prev.total);
    case 'fcg_timed':
    case 'fcg_countdown':
      if (next.pct !== prev.pct) return next.pct > prev.pct;
      return next.correct > prev.correct;
    default:
      return false;
  }
}

export function saveGameScore(gameType, data) {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const users = getUsers();
    if (!users[currentUser]) return;
    if (!users[currentUser].gameBests) users[currentUser].gameBests = {};
    if (isBetter(gameType, data, users[currentUser].gameBests[gameType])) {
      users[currentUser].gameBests[gameType] = data;
      // Keep top-level siegeBest in sync for backward compat
      if (gameType === 'siege') users[currentUser].siegeBest = data.seconds;
      saveUsers(users);
    }
    // Sync to Firebase in background (don't block game flow)
    syncScoreToFirebase(currentUser, gameType, data);
    return;
  }
  // Anonymous player
  try {
    const raw = localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : defaultProgress();
    if (!p.gameBests) p.gameBests = {};
    if (isBetter(gameType, data, p.gameBests[gameType])) {
      p.gameBests[gameType] = data;
      if (gameType === 'siege') p.siegeBest = data.seconds;
      localStorage.setItem(KEY, JSON.stringify(p));
    }
  } catch { /* ignore */ }
}

export function getGameBests(username) {
  const users = getUsers();
  return users[username]?.gameBests || {};
}

// ── Firebase Firestore sync ─────────────────────────────────────────────────────

/**
 * Save a game score to Firestore for the centralized leaderboard.
 * Called automatically when saveGameScore is invoked.
 * Runs silently in background (doesn't block game flow).
 */
export async function syncScoreToFirebase(playerName, gameType, data) {
  try {
    await addDoc(collection(db, 'leaderboard'), {
      playerName,
      gameType,
      ...data,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(`Failed to sync ${gameType} score to Firebase:`, error);
    // Fail silently - game still works offline
  }
}

/**
 * Fetch leaderboard data from Firestore for a specific game type.
 * Returns top scores sorted by best performance.
 */
export async function fetchLeaderboardFromFirebase(gameType, topN = 50) {
  try {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('timestamp', 'desc'),
      limit(topN * 2) // Fetch more to filter by game type
    );
    const querySnapshot = await getDocs(q);
    
    const scores = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(doc => doc.gameType === gameType)
      .slice(0, topN);

    return scores;
  } catch (error) {
    console.error('Failed to fetch leaderboard from Firebase:', error);
    return [];
  }
}

/**
 * Fetch aggregated leaderboard (best score per player per game type)
 */
export async function fetchAggregatedLeaderboard(gameType) {
  try {
    const allScores = await fetchLeaderboardFromFirebase(gameType, 500);
    const bestByPlayer = {};

    allScores.forEach(score => {
      const playerName = score.playerName;
      if (!bestByPlayer[playerName]) {
        bestByPlayer[playerName] = score;
      } else if (isBetter(gameType, score, bestByPlayer[playerName])) {
        bestByPlayer[playerName] = score;
      }
    });

    return Object.values(bestByPlayer).sort((a, b) => {
      if (gameType === 'siege') return b.seconds - a.seconds;
      if (gameType === 'speed') {
        if (b.stars !== a.stars) return b.stars - a.stars;
        return (b.correct / b.total) - (a.correct / a.total);
      }
      if (gameType === 'flashcard') {
        return (b.correct / b.total) - (a.correct / a.total);
      }
      if (gameType === 'fcg_timed' || gameType === 'fcg_countdown') {
        if (b.pct !== a.pct) return b.pct - a.pct;
        return b.correct - a.correct;
      }
      return 0;
    });
  } catch (error) {
    console.error('Failed to fetch aggregated leaderboard:', error);
    return [];
  }
}
