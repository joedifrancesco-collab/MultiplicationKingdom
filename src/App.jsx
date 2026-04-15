import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { subscribeToAuthChanges, isGuestMode, hasGuestScores } from './store/progress';
import ErrorBoundary from './shared/components/ErrorBoundary';
import NavBar from './shared/components/NavBar';
import AuthScreen from './shared/components/AuthScreen';
import HomeScreen from './shared/components/HomeScreen';
import SaveScoresModal from './shared/components/SaveScoresModal';
import KingdomMap from './subjects/math-kingdom/multiplication-kingdom/components/KingdomMap';
import KingdomScreen from './subjects/math-kingdom/multiplication-kingdom/components/KingdomScreen';
import Flashcard from './subjects/math-kingdom/multiplication-kingdom/components/Flashcard';
import SpeedChallenge from './subjects/math-kingdom/multiplication-kingdom/components/SpeedChallenge';
import MatchGame from './subjects/math-kingdom/multiplication-kingdom/components/MatchGame';
import FlashcardMenu from './subjects/math-kingdom/multiplication-kingdom/components/FlashcardMenu';
import FlashcardGame from './subjects/math-kingdom/multiplication-kingdom/components/FlashcardGame';
import KingdomSiege from './subjects/math-kingdom/multiplication-kingdom/components/KingdomSiege';
import TrainingMenu from './subjects/math-kingdom/multiplication-kingdom/components/TrainingMenu';
import TrainingTable from './subjects/math-kingdom/multiplication-kingdom/components/TrainingTable';
import Leaderboard from './shared/components/Leaderboard';
import UnifiedLeaderboard from './shared/components/UnifiedLeaderboard';
import KingdomMapsMode from './subjects/math-kingdom/multiplication-kingdom/components/KingdomMapsMode';
import KingdomMaps from './subjects/math-kingdom/multiplication-kingdom/components/KingdomMaps';
import SpellingScreen from './subjects/language-arts-kingdom/spelling/components/SpellingScreen';
import SpellingPractice from './subjects/language-arts-kingdom/spelling/components/SpellingPractice';
import SpellingLeaderboard from './subjects/language-arts-kingdom/spelling/components/SpellingLeaderboard';
import SpellingAdmin from './subjects/language-arts-kingdom/spelling/components/SpellingAdmin';
import NumberCruncherScreen from './components/number-cruncher/NumberCruncherScreen';
import NumberCruncherGame from './components/number-cruncher/NumberCruncherGame';
import NumberCruncherLeaderboard from './components/number-cruncher/NumberCruncherLeaderboard';

// Protected route component
function ProtectedRoute({ element, isAuthenticated, isGuest, isLoading }) {
  const location = useLocation();
  if (isLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>;
  }
  return isAuthenticated || isGuest ? element : <Navigate to="/auth" state={{ from: location }} replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(isGuestMode());
  const [loading, setLoading] = useState(true);
  const [showSaveScoresModal, setShowSaveScoresModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Monitor guest mode changes
  useEffect(() => {
    // Listen for guest mode changes (immediate notification via custom event)
    const handleGuestModeChange = () => {
      setIsGuest(isGuestMode());
    };
    
    window.addEventListener('guestModeChanged', handleGuestModeChange);
    
    return () => {
      window.removeEventListener('guestModeChanged', handleGuestModeChange);
    };
  }, []);

  // Show modal on app exit if guest has scores
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isGuest && hasGuestScores()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isGuest]);

  // Handle route changes - show modal if navigating away from game routes with unsaved scores
  useEffect(() => {
    if (isGuest && hasGuestScores()) {
      // Don't show modal on auth or home routes
      const currentPath = window.location.pathname;
      const gameRoutes = [
        '/subjects/math-kingdom/multiplication-kingdom',
        '/subjects/language-arts-kingdom/spelling',
        '/number-cruncher',
      ];
      
      const isOnGameRoute = gameRoutes.some(route => currentPath.startsWith(route));
      
      if (isOnGameRoute && pendingNavigation) {
        console.log('Detected navigation from game route with unsaved scores');
        setShowSaveScoresModal(true);
      }
    }
  }, [isGuest, pendingNavigation]);

  const handleSignUpFromModal = () => {
    setShowSaveScoresModal(false);
    // Navigate to auth with mode=signup parameter
    window.location.href = '/auth?mode=signup&from=guest-scores';
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Authentication */}
          <Route path="/auth" element={<AuthScreen />} />

          {/* Protected Routes - require authentication or guest mode */}
          <Route path="/" element={<ProtectedRoute element={<HomeScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* MATH KINGDOM - Multiplication Kingdom */}
          {/* ═════════════════════════════════════════════════════════════ */}
          
          {/* New structured routes aligned with folder organization */}
          <Route path="/subjects/math-kingdom/multiplication-kingdom" element={<ProtectedRoute element={<KingdomMap />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/:id" element={<ProtectedRoute element={<KingdomScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/:id/flashcard" element={<ProtectedRoute element={<Flashcard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/:id/speed" element={<ProtectedRoute element={<SpeedChallenge />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/:id/match" element={<ProtectedRoute element={<MatchGame />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/flashcards" element={<ProtectedRoute element={<FlashcardMenu />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/flashcards/play" element={<ProtectedRoute element={<FlashcardGame />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/siege" element={<ProtectedRoute element={<KingdomSiege />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/training" element={<ProtectedRoute element={<TrainingMenu />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/training/table" element={<ProtectedRoute element={<TrainingTable />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/maps" element={<ProtectedRoute element={<KingdomMapsMode />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math-kingdom/multiplication-kingdom/maps/:mode" element={<ProtectedRoute element={<KingdomMaps />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* Legacy routes for backward compatibility - redirect to new routes */}
          <Route path="/kingdom" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom" replace />} />
          <Route path="/kingdom/:id" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/:id" replace />} />
          <Route path="/kingdom/:id/flashcard" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/:id/flashcard" replace />} />
          <Route path="/kingdom/:id/speed" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/:id/speed" replace />} />
          <Route path="/kingdom/:id/match" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/:id/match" replace />} />
          <Route path="/flashcards" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/flashcards" replace />} />
          <Route path="/flashcards/play" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/flashcards/play" replace />} />
          <Route path="/siege" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/siege" replace />} />
          <Route path="/training" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/training" replace />} />
          <Route path="/training/table" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/training/table" replace />} />
          <Route path="/kingdom-maps" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/maps" replace />} />
          <Route path="/kingdom-maps/:mode" element={<Navigate to="/subjects/math-kingdom/multiplication-kingdom/maps/:mode" replace />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* LANGUAGE ARTS KINGDOM - Spelling */}
          {/* ═════════════════════════════════════════════════════════════ */}
          
          {/* New structured routes aligned with folder organization */}
          <Route path="/subjects/language-arts-kingdom/spelling" element={<ProtectedRoute element={<SpellingScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/language-arts-kingdom/spelling/practice/:groupId" element={<ProtectedRoute element={<SpellingPractice />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/language-arts-kingdom/spelling/leaderboard" element={<ProtectedRoute element={<SpellingLeaderboard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/language-arts-kingdom/spelling/admin" element={<SpellingAdmin />} />
          
          {/* Legacy routes for backward compatibility - redirect to new routes */}
          <Route path="/spelling" element={<Navigate to="/subjects/language-arts-kingdom/spelling" replace />} />
          <Route path="/spelling/practice/:groupId" element={<Navigate to="/subjects/language-arts-kingdom/spelling/practice/:groupId" replace />} />
          <Route path="/spelling/leaderboard" element={<Navigate to="/subjects/language-arts-kingdom/spelling/leaderboard" replace />} />
          <Route path="/spelling-admin" element={<Navigate to="/subjects/language-arts-kingdom/spelling/admin" replace />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* NUMBER CRUNCHER (Temporary location) */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <Route path="/number-cruncher" element={<ProtectedRoute element={<NumberCruncherScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/number-cruncher/play" element={<ProtectedRoute element={<NumberCruncherGame />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/number-cruncher/leaderboard" element={<ProtectedRoute element={<NumberCruncherLeaderboard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* SHARED */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <Route path="/leaderboard" element={<ProtectedRoute element={<Leaderboard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/unified-leaderboard" element={<ProtectedRoute element={<UnifiedLeaderboard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />

          {/* Catch-all - redirect to auth or home depending on auth state or guest mode */}
          <Route path="*" element={user || isGuest ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />} />
        </Routes>
        
        {/* Guest Score Save Modal */}
        <SaveScoresModal
          isOpen={showSaveScoresModal}
          onClose={() => setShowSaveScoresModal(false)}
          onSignUp={handleSignUpFromModal}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
