import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { subscribeToAuthChanges, isGuestMode } from './store/progress';
import ErrorBoundary from './shared/components/ErrorBoundary';
import NavBar from './shared/components/NavBar';
import AuthScreen from './shared/components/AuthScreen';
import HomeScreen from './shared/components/HomeScreen';
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
import KingdomMapsMode from './subjects/math-kingdom/multiplication-kingdom/components/KingdomMapsMode';
import KingdomMaps from './subjects/math-kingdom/multiplication-kingdom/components/KingdomMaps';
import SpellingScreen from './components/spelling/SpellingScreen';
import SpellingPractice from './components/spelling/SpellingPractice';
import SpellingLeaderboard from './components/spelling/SpellingLeaderboard';
import SpellingAdmin from './components/SpellingAdmin';
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

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Authentication */}
          <Route path="/auth" element={<AuthScreen />} />

          {/* Protected Routes - require authentication or guest mode */}
          <Route path="/" element={<ProtectedRoute element={<HomeScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/kingdom" element={<ProtectedRoute element={<KingdomMap />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/kingdom/:id" element={<ProtectedRoute element={<KingdomScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/kingdom/:id/flashcard" element={<ProtectedRoute element={<Flashcard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/kingdom/:id/speed" element={<ProtectedRoute element={<SpeedChallenge />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/flashcards" element={<ProtectedRoute element={<FlashcardMenu />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/flashcards/play" element={<ProtectedRoute element={<FlashcardGame />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/siege" element={<ProtectedRoute element={<KingdomSiege />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/training" element={<ProtectedRoute element={<TrainingMenu />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/training/table" element={<ProtectedRoute element={<TrainingTable />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/leaderboard" element={<ProtectedRoute element={<Leaderboard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/kingdom-maps" element={<ProtectedRoute element={<KingdomMapsMode />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/kingdom-maps/:mode" element={<ProtectedRoute element={<KingdomMaps />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/spelling" element={<ProtectedRoute element={<SpellingScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/spelling/practice/:groupId" element={<ProtectedRoute element={<SpellingPractice />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/spelling/leaderboard" element={<ProtectedRoute element={<SpellingLeaderboard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/spelling-admin" element={<SpellingAdmin />} />
          <Route path="/number-cruncher" element={<ProtectedRoute element={<NumberCruncherScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/number-cruncher/play" element={<ProtectedRoute element={<NumberCruncherGame />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/number-cruncher/leaderboard" element={<ProtectedRoute element={<NumberCruncherLeaderboard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />

          {/* Catch-all - redirect to auth or home depending on auth state or guest mode */}
          <Route path="*" element={user || isGuest ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
