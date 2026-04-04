import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { subscribeToAuthChanges } from './store/progress';
import ErrorBoundary from './components/ErrorBoundary';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import KingdomMap from './components/KingdomMap';
import KingdomScreen from './components/KingdomScreen';
import Flashcard from './components/Flashcard';
import SpeedChallenge from './components/SpeedChallenge';
import MatchGame from './components/MatchGame';
import FlashcardMenu from './components/FlashcardMenu';
import FlashcardGame from './components/FlashcardGame';
import KingdomSiege from './components/KingdomSiege';
import TrainingMenu from './components/TrainingMenu';
import TrainingTable from './components/TrainingTable';
import Leaderboard from './components/Leaderboard';

// Protected route component
function ProtectedRoute({ element, isAuthenticated, isLoading }) {
  if (isLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>;
  }
  return isAuthenticated ? element : <Navigate to="/auth" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Authentication */}
          <Route path="/auth" element={<AuthScreen />} />

          {/* Protected Routes - require authentication */}
          <Route path="/" element={<ProtectedRoute element={<HomeScreen />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/kingdom" element={<ProtectedRoute element={<KingdomMap />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/kingdom/:id" element={<ProtectedRoute element={<KingdomScreen />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/kingdom/:id/flashcard" element={<ProtectedRoute element={<Flashcard />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/kingdom/:id/speed" element={<ProtectedRoute element={<SpeedChallenge />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/flashcards" element={<ProtectedRoute element={<FlashcardMenu />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/flashcards/play" element={<ProtectedRoute element={<FlashcardGame />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/siege" element={<ProtectedRoute element={<KingdomSiege />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/training" element={<ProtectedRoute element={<TrainingMenu />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/training/table" element={<ProtectedRoute element={<TrainingTable />} isAuthenticated={!!user} isLoading={loading} />} />
          <Route path="/leaderboard" element={<ProtectedRoute element={<Leaderboard />} isAuthenticated={!!user} isLoading={loading} />} />

          {/* Catch-all - redirect to auth or home depending on auth state */}
          <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
