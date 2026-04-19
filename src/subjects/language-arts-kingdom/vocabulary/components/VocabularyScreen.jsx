import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VocabularyScreen.css';

export default function VocabularyScreen() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with grades K-12
    const gradeList = [
      { id: 'k', label: 'Kindergarten', short: 'K' },
      { id: '1', label: '1st Grade', short: '1' },
      { id: '2', label: '2nd Grade', short: '2' },
      { id: '3', label: '3rd Grade', short: '3' },
      { id: '4', label: '4th Grade', short: '4' },
      { id: '5', label: '5th Grade', short: '5' },
      { id: '6', label: '6th Grade', short: '6' },
      { id: '7', label: '7th Grade', short: '7' },
      { id: '8', label: '8th Grade', short: '8' },
      { id: '9', label: '9th Grade', short: '9' },
      { id: '10', label: '10th Grade', short: '10' },
      { id: '11', label: '11th Grade', short: '11' },
      { id: '12', label: '12th Grade', short: '12' },
    ];

    setGrades(gradeList);
    setLoading(false);
  }, []);

  const handleGradeSelect = (gradeId) => {
    setSelectedGrade(gradeId);
    navigate(`/subjects/language-arts-kingdom/vocabulary/word-match/${gradeId}`);
  };

  return (
    <div className="vocabulary-screen">
      <header className="vocabulary-header">
        <div className="vocabulary-crown">📚</div>
        <h1 className="vocabulary-title">Vocabulary Kingdom</h1>
        <p className="vocabulary-subtitle">Learn new words and expand your vocabulary!</p>
      </header>

      <div className="vocabulary-games">
        {/* Grade Selection Section */}
        <div className="vs-section">
          <h2 className="vs-section-title">📖 Choose your Grade</h2>
          
          {loading ? (
            <div className="vs-loading">Loading grades...</div>
          ) : grades.length === 0 ? (
            <div className="vs-empty">No grades available yet. Check back soon!</div>
          ) : (
            <div className="vs-select-wrapper">
              <select 
                className="vs-grade-select"
                value={selectedGrade}
                onChange={(e) => handleGradeSelect(e.target.value)}
              >
                <option value="">-- Select a Grade --</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Coming Soon Features */}
        <div className="vs-section">
          <h2 className="vs-section-title">🎮 Games</h2>
          <div className="vs-games-container">
            <button className="vocabulary-game-card" onClick={() => navigate('/subjects/language-arts-kingdom/vocabulary/word-match')}>
              <div className="game-card-icon">✨</div>
              <div className="game-card-body">
                <div className="game-card-title">Word Match</div>
                <div className="game-card-desc">Match words with their definitions</div>
              </div>
              <div className="game-card-arrow">›</div>
            </button>

            <button className="vocabulary-game-card" disabled>
              <div className="game-card-icon">🎯</div>
              <div className="game-card-body">
                <div className="game-card-title">Flashcards</div>
                <div className="game-card-desc">Study words with interactive flashcards</div>
              </div>
              <span className="game-card-badge">Coming Soon</span>
            </button>

            <button className="vocabulary-game-card" disabled>
              <div className="game-card-icon">🏆</div>
              <div className="game-card-body">
                <div className="game-card-title">Vocabulary Quiz</div>
                <div className="game-card-desc">Test your knowledge with challenging quizzes</div>
              </div>
              <span className="game-card-badge">Coming Soon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
