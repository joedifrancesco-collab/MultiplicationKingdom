import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../shared/config/firebase';

const DECKS_COLLECTION = 'flashcard_decks';
const LOCAL_STORAGE_KEY = 'mk_flashcard_decks';

/**
 * Flashcard Deck Structure:
 * {
 *   id: string (auto-generated or user-provided)
 *   title: string
 *   description: string
 *   cards: [
 *     { question: string, answer: string },
 *     ...
 *   ]
 *   createdAt: timestamp
 *   updatedAt: timestamp
 *   userId: string (Firestore only)
 *   public: boolean (for future sharing feature)
 * }
 */

// ═══════════════════════════════════════════════════════════════════
// FIRESTORE OPERATIONS (for authenticated users)
// ═══════════════════════════════════════════════════════════════════

/**
 * Save a new flashcard deck to Firestore
 * @param {Object} deck - { title, description, cards: [...] }
 * @returns {Promise<string>} - deck ID
 */
export async function saveDeckToFirebase(deck) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const deckId = `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userDeckRef = doc(db, 'users', user.uid, DECKS_COLLECTION, deckId);

    await setDoc(userDeckRef, {
      ...deck,
      id: deckId,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      public: false,
    });

    return deckId;
  } catch (error) {
    console.error('Failed to save deck to Firebase:', error.message);
    throw error;
  }
}

/**
 * Fetch all decks for the current authenticated user
 * @returns {Promise<Array>} - array of deck objects
 */
export async function getUserDecksFromFirebase() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const decksRef = collection(db, 'users', user.uid, DECKS_COLLECTION);
    const q = query(decksRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Failed to fetch user decks from Firebase:', error.message);
    return [];
  }
}

/**
 * Fetch a single deck by ID
 * @param {string} deckId
 * @returns {Promise<Object|null>} - deck object or null
 */
export async function getDeckFromFirebase(deckId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    const deckRef = doc(db, 'users', user.uid, DECKS_COLLECTION, deckId);
    const docSnap = await getDoc(deckRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch deck from Firebase:', error.message);
    return null;
  }
}

/**
 * Update an existing deck
 * @param {string} deckId
 * @param {Object} updates - partial deck object
 * @returns {Promise<void>}
 */
export async function updateDeckInFirebase(deckId, updates) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const deckRef = doc(db, 'users', user.uid, DECKS_COLLECTION, deckId);
    await updateDoc(deckRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to update deck in Firebase:', error.message);
    throw error;
  }
}

/**
 * Delete a deck
 * @param {string} deckId
 * @returns {Promise<void>}
 */
export async function deleteDeckFromFirebase(deckId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const deckRef = doc(db, 'users', user.uid, DECKS_COLLECTION, deckId);
    await deleteDoc(deckRef);
  } catch (error) {
    console.error('Failed to delete deck from Firebase:', error.message);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════
// LOCAL STORAGE OPERATIONS (for guest users & offline fallback)
// ═══════════════════════════════════════════════════════════════════

/**
 * Get all decks from localStorage
 * @returns {Array} - array of deck objects
 */
export function getLocalDecks() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read local decks:', error.message);
    return [];
  }
}

/**
 * Save a deck to localStorage
 * @param {Object} deck - { title, description, cards: [...] }
 * @returns {string} - deck ID
 */
export function saveDeckLocally(deck) {
  try {
    const decks = getLocalDecks();
    const deckId = `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newDeck = {
      ...deck,
      id: deckId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      public: false,
    };

    decks.push(newDeck);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(decks));

    return deckId;
  } catch (error) {
    console.error('Failed to save deck locally:', error.message);
    throw error;
  }
}

/**
 * Get a single deck from localStorage
 * @param {string} deckId
 * @returns {Object|null}
 */
export function getLocalDeck(deckId) {
  try {
    const decks = getLocalDecks();
    return decks.find(deck => deck.id === deckId) || null;
  } catch (error) {
    console.error('Failed to get local deck:', error.message);
    return null;
  }
}

/**
 * Update a deck in localStorage
 * @param {string} deckId
 * @param {Object} updates
 * @returns {void}
 */
export function updateDeckLocally(deckId, updates) {
  try {
    const decks = getLocalDecks();
    const index = decks.findIndex(deck => deck.id === deckId);

    if (index === -1) {
      throw new Error('Deck not found');
    }

    decks[index] = {
      ...decks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(decks));
  } catch (error) {
    console.error('Failed to update local deck:', error.message);
    throw error;
  }
}

/**
 * Delete a deck from localStorage
 * @param {string} deckId
 * @returns {void}
 */
export function deleteDeckLocally(deckId) {
  try {
    const decks = getLocalDecks();
    const filtered = decks.filter(deck => deck.id !== deckId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete local deck:', error.message);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════
// HYBRID OPERATIONS (auto-selects Firebase or localStorage)
// ═══════════════════════════════════════════════════════════════════

/**
 * Save a deck (to Firebase if authenticated, otherwise localStorage)
 * @param {Object} deck
 * @returns {Promise<string>} - deck ID
 */
export async function saveDeck(deck) {
  const user = auth.currentUser;
  
  if (user) {
    return saveDeckToFirebase(deck);
  } else {
    return saveDeckLocally(deck);
  }
}

/**
 * Fetch all user's decks (from Firebase or localStorage)
 * @returns {Promise<Array>}
 */
export async function getUserDecks() {
  const user = auth.currentUser;

  if (user) {
    return getUserDecksFromFirebase();
  } else {
    return getLocalDecks();
  }
}

/**
 * Get a single deck
 * @param {string} deckId
 * @returns {Promise<Object|null>}
 */
export async function getDeck(deckId) {
  const user = auth.currentUser;

  if (user) {
    return getDeckFromFirebase(deckId);
  } else {
    return getLocalDeck(deckId);
  }
}

/**
 * Update a deck
 * @param {string} deckId
 * @param {Object} updates
 * @returns {Promise<void>}
 */
export async function updateDeck(deckId, updates) {
  const user = auth.currentUser;

  if (user) {
    return updateDeckInFirebase(deckId, updates);
  } else {
    return updateDeckLocally(deckId, updates);
  }
}

/**
 * Delete a deck
 * @param {string} deckId
 * @returns {Promise<void>}
 */
export async function deleteDeck(deckId) {
  const user = auth.currentUser;

  if (user) {
    return deleteDeckFromFirebase(deckId);
  } else {
    return deleteDeckLocally(deckId);
  }
}
