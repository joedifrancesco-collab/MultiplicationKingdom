import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { subscribeToAuthChanges, isGuestMode } from './store/progress';
import { validateSettings } from './config/appSettings';
import { OverlayProvider } from './context/OverlayProvider.jsx';
import ErrorBoundary from './shared/components/ErrorBoundary';
import OverlayWrapper from './shared/components/OverlayWrapper';
import ResponsiveNav from './shared/components/ResponsiveNav';
import AuthScreen from './shared/components/AuthScreen';
import Profile from './components/Profile';
import Home from './pages/Home';
import SubjectHome from './pages/SubjectHome';
import LegacyRedirect from './shared/components/LegacyRedirect';
import MultiplicationKingdomHome from './subjects/math/multiplication-kingdom/components/MultiplicationKingdomHome';
import KingdomMap from './subjects/math/multiplication-kingdom/components/KingdomMap';
import KingdomScreen from './subjects/math/multiplication-kingdom/components/KingdomScreen';
import Flashcard from './subjects/math/multiplication-kingdom/components/Flashcard';
import SpeedChallenge from './subjects/math/multiplication-kingdom/components/SpeedChallenge';
import FlashcardMenu from './subjects/math/multiplication-kingdom/components/FlashcardMenu';
import FlashcardGame from './subjects/math/multiplication-kingdom/components/FlashcardGame';
import KingdomSiege from './subjects/math/multiplication-kingdom/components/KingdomSiege';
import TrainingMenu from './subjects/math/multiplication-kingdom/components/TrainingMenu';
import TrainingTable from './subjects/math/multiplication-kingdom/components/TrainingTable';
import UnifiedLeaderboard from './shared/components/UnifiedLeaderboard';
import TestDeviceViewport from './shared/components/TestDeviceViewport';
import SettingsTest from './shared/components/SettingsTest';
import KingdomMapsMode from './subjects/math/multiplication-kingdom/components/KingdomMapsMode';
import KingdomMaps from './subjects/math/multiplication-kingdom/components/KingdomMaps';
import FractionsKingdomHome from './subjects/math/fractions-kingdom/components/FractionsKingdomHome';
import FractionsBridgeBuilder from './subjects/math/fractions-kingdom/components/FractionsBridgeBuilder';
import SpellingScreen from './subjects/language-arts/spelling/components/SpellingScreen';
import SpellingPractice from './subjects/language-arts/spelling/components/SpellingPractice';
import SpellingAdmin from './subjects/language-arts/spelling/components/SpellingAdmin';
import VocabularyScreen from './subjects/language-arts/vocabulary/components/VocabularyScreen';
import WordMatchLanding from './subjects/language-arts/vocabulary/components/WordMatchLanding';
import NumberCruncherScreen from './components/number-cruncher/NumberCruncherScreen';
import NumberCruncherGame from './components/number-cruncher/NumberCruncherGame';
import FlashcardBuilder from './components/flashcard-builder/FlashcardBuilder';
import FlashcardDeckSelector from './components/flashcard-builder/FlashcardDeckSelector';
import FlashcardGamePlay from './components/flashcard-builder/FlashcardGamePlay';
import TouchTypingSiege from './components/touch-typing/TouchTypingSiege';
import USStatesHome from './subjects/geography/us-states/components/USStatesHome';
import USStatesMap from './subjects/geography/us-states/components/USStatesMap';
import USStatesID from './subjects/geography/us-states/components/USStatesID';

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

  // Validate settings on app boot
  useEffect(() => {
    const validation = validateSettings();
    if (!validation.valid) {
      console.error('⚠️  App may not function correctly due to settings validation errors');
    }
  }, []);

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
      <OverlayProvider>
        <BrowserRouter>
          <ResponsiveNav />
          <OverlayWrapper />
          <Routes>
          {/* Authentication */}
          <Route path="/auth" element={<AuthScreen />} />

          {/* New Navigation Structure - Home & Subject Homes */}
          <Route path="/" element={<ProtectedRoute element={<Home />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/:subject" element={<ProtectedRoute element={<SubjectHome />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* MATH - Multiplication Kingdom */}
          {/* ═════════════════════════════════════════════════════════════ */}
          
          {/* Game mode selection home page */}
          <Route path="/subjects/math/multiplication-kingdom" element={<ProtectedRoute element={<MultiplicationKingdomHome />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* Times tables grid (accessed from Conquest mode) */}
          <Route path="/subjects/math/multiplication-kingdom/grid" element={<ProtectedRoute element={<KingdomMap />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* Individual kingdom/times table screens */}
          <Route path="/subjects/math/multiplication-kingdom/:id" element={<ProtectedRoute element={<KingdomScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/:id/flashcard" element={<ProtectedRoute element={<Flashcard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/:id/speed" element={<ProtectedRoute element={<SpeedChallenge />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/flashcards" element={<ProtectedRoute element={<FlashcardMenu />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/flashcards/play" element={<ProtectedRoute element={<FlashcardGame />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/siege" element={<ProtectedRoute element={<KingdomSiege />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/training" element={<ProtectedRoute element={<TrainingMenu />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/training/table" element={<ProtectedRoute element={<TrainingTable />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/maps" element={<ProtectedRoute element={<KingdomMapsMode />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/multiplication-kingdom/maps/:mode" element={<ProtectedRoute element={<KingdomMaps />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />

          {/* FRACTIONS - Fractions Kingdom */}
          <Route path="/subjects/math/fractions-kingdom" element={<ProtectedRoute element={<FractionsKingdomHome />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/math/fractions-kingdom/bridge-builder" element={<ProtectedRoute element={<FractionsBridgeBuilder />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* Legacy routes for backward compatibility - redirect to new routes */}
          <Route path="/kingdom" element={<Navigate to="/subjects/math/multiplication-kingdom" replace />} />
          <Route path="/kingdom/:id" element={<LegacyRedirect template="/subjects/math/multiplication-kingdom/:id" />} />
          <Route path="/kingdom/:id/flashcard" element={<LegacyRedirect template="/subjects/math/multiplication-kingdom/:id/flashcard" />} />
          <Route path="/kingdom/:id/speed" element={<LegacyRedirect template="/subjects/math/multiplication-kingdom/:id/speed" />} />
          <Route path="/kingdom/:id/match" element={<LegacyRedirect template="/subjects/math/multiplication-kingdom/:id/speed" />} />
          <Route path="/flashcards" element={<Navigate to="/subjects/math/multiplication-kingdom/flashcards" replace />} />
          <Route path="/flashcards/play" element={<Navigate to="/subjects/math/multiplication-kingdom/flashcards/play" replace />} />
          <Route path="/siege" element={<Navigate to="/subjects/math/multiplication-kingdom/siege" replace />} />
          <Route path="/training" element={<Navigate to="/subjects/math/multiplication-kingdom/training" replace />} />
          <Route path="/training/table" element={<Navigate to="/subjects/math/multiplication-kingdom/training/table" replace />} />
          <Route path="/kingdom-maps" element={<Navigate to="/subjects/math/multiplication-kingdom/maps" replace />} />
          <Route path="/kingdom-maps/:mode" element={<LegacyRedirect template="/subjects/math/multiplication-kingdom/maps/:mode" />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* LANGUAGE ARTS - Spelling */}
          {/* ═════════════════════════════════════════════════════════════ */}
          
          {/* New structured routes aligned with folder organization */}
          <Route path="/subjects/language-arts/spelling" element={<ProtectedRoute element={<SpellingScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/language-arts/spelling/practice/:groupId" element={<ProtectedRoute element={<SpellingPractice />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/language-arts/spelling/admin" element={<SpellingAdmin />} />

          {/* LANGUAGE ARTS - Vocabulary */}
          <Route path="/subjects/language-arts/vocabulary" element={<ProtectedRoute element={<VocabularyScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/language-arts/vocabulary/word-match" element={<ProtectedRoute element={<WordMatchLanding />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/subjects/language-arts/vocabulary/word-match/:grade" element={<ProtectedRoute element={<WordMatchLanding />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* Legacy routes for backward compatibility - redirect to new routes */}
          <Route path="/spelling" element={<Navigate to="/subjects/language-arts/spelling" replace />} />
          <Route path="/spelling/practice/:groupId" element={<LegacyRedirect template="/subjects/language-arts/spelling/practice/:groupId" />} />
          <Route path="/subjects/language-arts/spelling/leaderboard" element={<Navigate to="/unified-leaderboard" replace />} />
          <Route path="/spelling/leaderboard" element={<Navigate to="/unified-leaderboard" replace />} />
          <Route path="/spelling-admin" element={<Navigate to="/subjects/language-arts/spelling/admin" replace />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* GEOGRAPHY - US States */}
          {/* ═════════════════════════════════════════════════════════════ */}
          
          {/* Game mode selection home page */}
          <Route path="/subjects/geography/us-states" element={<ProtectedRoute element={<USStatesHome />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* United States Map game */}
          <Route path="/subjects/geography/us-states/map" element={<ProtectedRoute element={<USStatesMap />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* US States ID game */}
          <Route path="/subjects/geography/us-states/us-states-id" element={<ProtectedRoute element={<USStatesID />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* NUMBER CRUNCHER (Temporary location) */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <Route path="/number-cruncher" element={<ProtectedRoute element={<NumberCruncherScreen />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/number-cruncher/play" element={<ProtectedRoute element={<NumberCruncherGame />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/number-cruncher/leaderboard" element={<Navigate to="/unified-leaderboard" replace />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* FLASHCARD BUILDER */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <Route path="/flashcard-builder" element={<ProtectedRoute element={<FlashcardDeckSelector />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/flashcard-builder/create" element={<ProtectedRoute element={<FlashcardBuilder />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          <Route path="/flashcard-builder/play/:deckId" element={<ProtectedRoute element={<FlashcardGamePlay />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* TOUCH TYPING */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <Route path="/touch-typing" element={<ProtectedRoute element={<TouchTypingSiege />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />
          
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* SHARED */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <Route path="/subjects/lab" element={<Navigate to="/" replace />} />
          <Route path="/leaderboard" element={<Navigate to="/unified-leaderboard" replace />} />
          <Route path="/unified-leaderboard" element={<ProtectedRoute element={<UnifiedLeaderboard />} isAuthenticated={!!user} isGuest={isGuest} isLoading={loading} />} />

          {/* Testing Routes (for development) */}
          <Route path="/test-device-viewport" element={<TestDeviceViewport />} />
          <Route path="/test-settings" element={<SettingsTest />} />

          {/* Catch-all - redirect to auth or home depending on auth state or guest mode */}
          <Route path="*" element={user || isGuest ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />} />
        </Routes>
        
      </BrowserRouter>
      </OverlayProvider>
    </ErrorBoundary>
  );
}
