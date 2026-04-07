import { collection, addDoc, query, orderBy, limit, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

const KEY = 'mk_progress';
const USERS_KEY = 'mk_users';
const CURRENT_USER_KEY = 'mk_current_user';
const GUEST_MODE_KEY = 'mk_guest_mode';

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

// ── Guest Mode ──────────────────────────────────────────────────────────────

/**
 * Set guest mode - allows user to play without authentication
 */
export function setGuestMode() {
  localStorage.setItem(GUEST_MODE_KEY, 'true');
}

/**
 * Check if currently in guest mode
 */
export function isGuestMode() {
  return localStorage.getItem(GUEST_MODE_KEY) === 'true';
}

/**
 * Clear guest mode (for logout)
 */
export function clearGuestMode() {
  localStorage.removeItem(GUEST_MODE_KEY);
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
  // Try to save to Firebase if user is authenticated
  const authUser = getCurrentAuthUser();
  if (authUser) {
    // Sync to Firebase (only for authenticated users)
    syncScoreToFirebase(authUser.email, gameType, data);
    return;
  }

  // Fallback: try old localStorage system for backward compatibility
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
}

export function getGameBests(username) {
  const users = getUsers();
  return users[username]?.gameBests || {};
}

// ── Spelling attempt tracking ──────────────────────────────────────────────────

/**
 * Get a unique user identifier (Firebase UID or named username)
 */
function getSpellingUserKey() {
  const authUser = getCurrentAuthUser();
  if (authUser) {
    return authUser.uid; // Firebase UID
  }
  return getCurrentUser(); // Named user system
}

/**
 * Get storage key for spelling attempts
 */
function getSpellingStorageKey(userKey) {
  return `mk_spelling_${userKey}`;
}

/**
 * Save a spelling attempt record (called when user completes a spelling practice)
 * Data shape: { groupId, groupTitle, firstAttemptCorrectCount, totalAttemptsToComplete }
 */
export function saveSpellingAttempt(data) {
  const userKey = getSpellingUserKey();
  if (!userKey) return; // No user logged in
  
  const storageKey = getSpellingStorageKey(userKey);
  
  let attempts = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) attempts = JSON.parse(raw);
  } catch { /* ignore */ }
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const attemptRecord = {
    ...data,
    date: today,
    timestamp: new Date().toISOString(),
  };
  
  attempts.push(attemptRecord);
  localStorage.setItem(storageKey, JSON.stringify(attempts));
  
  // Sync to Firebase in background (don't block game flow)
  const authUser = getCurrentAuthUser();
  if (authUser) {
    syncSpellingAttemptToFirebase(authUser, data);
  }
}

/**
 * Get spelling attempts for current user, organized by group and date
 * Returns a grouped structure showing best performance per date per group
 */
export function getSpellingAttempts() {
  const userKey = getSpellingUserKey();
  if (!userKey) return {}; // No user logged in
  
  const storageKey = getSpellingStorageKey(userKey);
  
  let attempts = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) attempts = JSON.parse(raw);
  } catch { /* ignore */ }
  
  // Group by groupId, then by date, keeping only the best attempt per date
  const grouped = {};
  
  attempts.forEach(attempt => {
    const { groupId, groupTitle, date, totalAttemptsToComplete, firstAttemptCorrectCount } = attempt;
    
    if (!grouped[groupId]) {
      grouped[groupId] = {
        groupTitle,
        attempts: {},
      };
    }
    
    if (!grouped[groupId].attempts[date]) {
      grouped[groupId].attempts[date] = {
        firstAttemptCorrectCount,
        totalAttemptsToComplete,
      };
    } else {
      // Keep the best performance (least attempts)
      const existing = grouped[groupId].attempts[date];
      if (totalAttemptsToComplete < existing.totalAttemptsToComplete) {
        grouped[groupId].attempts[date] = {
          firstAttemptCorrectCount,
          totalAttemptsToComplete,
        };
      }
    }
  });
  
  return grouped;
}

// ── Firebase Firestore sync ─────────────────────────────────────────────────────

/**
 * Save a game score to Firestore for the centralized leaderboard.
 * Called automatically when saveGameScore is invoked.
 * Runs silently in background (doesn't block game flow).
 */
export async function syncScoreToFirebase(emailOrName, gameType, data) {
  try {
    // Get the authenticated user's info
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    
    // Use displayName (username) if available
    const username = user.displayName || user.email;
    
    await addDoc(collection(db, 'leaderboard'), {
      uid: user.uid,
      email: user.email,
      username: username,
      gameType,
      ...data,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(`Failed to sync ${gameType} score to Firebase:`, error.code, error.message);
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
      // Prefer username, fallback to email, then to 'Anonymous'
      const playerKey = score.username || score.email || 'Anonymous';
      if (!bestByPlayer[playerKey]) {
        bestByPlayer[playerKey] = score;
      } else if (isBetter(gameType, score, bestByPlayer[playerKey])) {
        bestByPlayer[playerKey] = score;
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

/**
 * Sync spelling attempt to Firestore.
 * Called automatically when saveSpellingAttempt is invoked.
 * Runs silently in background (doesn't block game flow).
 */
export async function syncSpellingAttemptToFirebase(authUser, data) {
  try {
    const user = authUser || auth.currentUser;
    if (!user) {
      return;
    }
    
    const username = user.displayName || user.email;
    const today = new Date().toISOString().split('T')[0];
    
    await addDoc(collection(db, 'spelling_attempts'), {
      uid: user.uid,
      email: user.email,
      username: username,
      groupId: data.groupId,
      groupTitle: data.groupTitle,
      firstAttemptCorrectCount: data.firstAttemptCorrectCount,
      totalAttemptsToComplete: data.totalAttemptsToComplete,
      date: today,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to sync spelling attempt to Firebase:', error.code, error.message);
    // Fail silently - game still works offline
  }
}

/**
 * Fetch spelling attempts from Firestore for the current user.
 * Returns attempts organized by group and date, keeping best performance per date.
 */
export async function fetchSpellingAttemptsFromFirebase() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {};
    }

    const q = query(
      collection(db, 'spelling_attempts'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const attempts = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(doc => doc.uid === user.uid);

    // Group by groupId, then by date, keeping only the best attempt per date
    const grouped = {};
    
    attempts.forEach(attempt => {
      const { groupId, groupTitle, date, totalAttemptsToComplete, firstAttemptCorrectCount } = attempt;
      
      if (!grouped[groupId]) {
        grouped[groupId] = {
          groupTitle,
          attempts: {},
        };
      }
      
      if (!grouped[groupId].attempts[date]) {
        grouped[groupId].attempts[date] = {
          firstAttemptCorrectCount,
          totalAttemptsToComplete,
        };
      } else {
        // Keep the best performance (least attempts)
        const existing = grouped[groupId].attempts[date];
        if (totalAttemptsToComplete < existing.totalAttemptsToComplete) {
          grouped[groupId].attempts[date] = {
            firstAttemptCorrectCount,
            totalAttemptsToComplete,
          };
        }
      }
    });

    return grouped;
  } catch (error) {
    console.error('Failed to fetch spelling attempts from Firebase:', error);
    return {};
  }
}

// ── Firebase Authentication ─────────────────────────────────────────────────────

/**
 * Sign up a new user with email, username, and password
 */
export async function signUpUser(email, username, password) {
  try {
    // Check if username is already taken
    const usernameDoc = await getDoc(doc(db, 'users', username.toLowerCase()));
    if (usernameDoc.exists()) {
      return { success: false, error: 'Username already taken. Please choose another.' };
    }

    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(userCredential.user, { displayName: username });
    
    // Store username in Firestore users collection
    await setDoc(doc(db, 'users', username.toLowerCase()), {
      uid: userCredential.user.uid,
      username: username,
      email: email,
      createdAt: new Date(),
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    // Check for specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, error: 'Email already in use. Please sign in or use a different email.' };
    }
    return { success: false, error: error.message };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser() {
  try {
    clearGuestMode();
    await signOut(auth);
    return { success: true };
  } catch (error) {
    clearGuestMode();
    return { success: false, error: error.message };
  }
}

/**
 * Get the current authenticated user
 */
export function getCurrentAuthUser() {
  try {
    return auth.currentUser;
  } catch {
    return null;
  }
}

// ── Clear spelling data (for testing) ──────────────────────────────────────

/**
 * Clear all spelling attempts for the current user (for testing/cleanup)
 */
export function clearSpellingAttempts() {
  const userKey = getSpellingUserKey();
  if (!userKey) return false;
  
  const storageKey = getSpellingStorageKey(userKey);
  localStorage.removeItem(storageKey);
  console.log('Cleared spelling attempts for user:', userKey);
  return true;
}

/**
 * Listen to auth state changes
 * Returns an unsubscribe function
 */
export function subscribeToAuthChanges(callback) {
  try {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  } catch (error) {
    console.error('Error subscribing to auth changes:', error);
    // Return a no-op unsubscribe if auth fails
    return () => {};
  }
}
