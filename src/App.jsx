import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import KingdomMap from './components/KingdomMap';
import KingdomScreen from './components/KingdomScreen';
import Flashcard from './components/Flashcard';
import SpeedChallenge from './components/SpeedChallenge';
import MatchGame from './components/MatchGame';
import FlashcardMenu from './components/FlashcardMenu';
import FlashcardGame from './components/FlashcardGame';
import KingdomSiege from './components/KingdomSiege';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomeScreen />} />

        {/* The Kingdom */}
        <Route path="/kingdom" element={<KingdomMap />} />
        <Route path="/kingdom/:id" element={<KingdomScreen />} />
        <Route path="/kingdom/:id/flashcard" element={<Flashcard />} />
        <Route path="/kingdom/:id/speed" element={<SpeedChallenge />} />
        <Route path="/kingdom/:id/match" element={<MatchGame />} />

        {/* Flashcard Challenge */}
        <Route path="/flashcards" element={<FlashcardMenu />} />
        <Route path="/flashcards/play" element={<FlashcardGame />} />

        {/* Kingdom Siege */}
        <Route path="/siege" element={<KingdomSiege />} />
      </Routes>
    </BrowserRouter>
  );
}
