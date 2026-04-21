import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import KingdomCard from '../shared/components/KingdomCard';
import { getProgress } from '../store/progress';
import './SubjectHome.css';

/**
 * SubjectHome Page Component
 * Displays kingdoms for a specific subject (Math, Spelling, Extra Credit, etc.)
 * Shows enabled/disabled status based on star progress
 */
export default function SubjectHome() {
  const { subject } = useParams();
  const progress = useMemo(() => getProgress(), []);

  // Define kingdoms by subject
  const subjectData = {
    math: {
      icon: '🔢',
      label: '🔢 Math Kingdom',
      description: 'Master the fundamentals of mathematics!',
      kingdoms: [
        {
          id: 'multiplication-kingdom',
          icon: '✖️',
          label: 'Multiplication Kingdom',
          description: '12 times tables with engaging games',
          path: '/subjects/math-kingdom/multiplication-kingdom',
          unlockIndex: 0, // First one is always unlocked
        },
        {
          id: 'addition-kingdom',
          icon: '➕',
          label: 'Addition Kingdom',
          description: 'Master addition and number combinations',
          path: '/subjects/math-kingdom/addition-kingdom',
          unlockIndex: 1,
          comingSoon: true,
        },
        {
          id: 'subtraction-kingdom',
          icon: '➖',
          label: 'Subtraction Kingdom',
          description: 'Learn subtraction and differences',
          path: '/subjects/math-kingdom/subtraction-kingdom',
          unlockIndex: 2,
          comingSoon: true,
        },
        {
          id: 'division-kingdom',
          icon: '÷',
          label: 'Division Kingdom',
          description: 'Understand division and fractions',
          path: '/subjects/math-kingdom/division-kingdom',
          unlockIndex: 3,
          comingSoon: true,
        },
      ],
    },
    spelling: {
      icon: '📖',
      label: '📖 Language Arts Kingdom',
      description: 'Improve your language and spelling skills!',
      kingdoms: [
        {
          id: 'spelling',
          icon: '✍️',
          label: 'Spelling',
          description: 'Vowels, consonants, and word patterns',
          path: '/subjects/language-arts-kingdom/spelling',
          unlockIndex: 0,
        },
        {
          id: 'vocabulary',
          icon: '📚',
          label: 'Vocabulary',
          description: 'Learn new words and meanings',
          path: '/subjects/language-arts-kingdom/vocabulary',
          unlockIndex: 1,
          comingSoon: true,
        },
        {
          id: 'grammar',
          icon: '🔤',
          label: 'Grammar',
          description: 'Master grammar rules and punctuation',
          path: '/subjects/language-arts-kingdom/grammar',
          unlockIndex: 2,
          comingSoon: true,
        },
      ],
    },
    lab: {
      icon: '',
      label: 'Extra Credit',
      description: 'Explore experiments and challenges!',
      kingdoms: [
        {
          id: 'number-cruncher',
          icon: '🎮',
          label: 'Number Cruncher',
          description: 'Advanced math challenges and puzzles',
          path: '/number-cruncher',
          unlockIndex: 0,
        },
        {
          id: 'flashcard-builder',
          icon: '🃏',
          label: 'Flashcard Builder',
          description: 'Build and study custom flashcard decks',
          path: '/flashcard-builder',
          unlockIndex: 1,
        },
      ],
    },
  };

  const data = subjectData[subject] || {
    icon: '❓',
    label: 'Unknown Subject',
    description: 'Subject not found',
    kingdoms: [],
  };

  // Check if kingdom is unlocked based on progress
  const isKingdomUnlocked = (index) => {
    const kingdom = data.kingdoms[index];
    
    // If alwaysUnlocked flag is set, always return true
    if (kingdom?.alwaysUnlocked) return true;

    // First kingdom is always unlocked
    if (index === 0) return true;

    // Get the kingdom from the previous level
    const prevKingdom = data.kingdoms[index - 1];
    if (!prevKingdom) return false;

    // Check if previous kingdom has at least 1 star
    const kingdomProgress = progress.kingdoms?.[prevKingdom.id];
    return kingdomProgress && kingdomProgress.stars >= 1;
  };

  return (
    <div className="subject-home">
      <header className="subject-header">
        <div className="subject-hero">
          <h1 className="subject-title">{data.label}</h1>
          <p className="subject-description">{data.description}</p>
        </div>
      </header>

      <main className="subject-content">
        <section className="kingdoms-section">
          <div className="kingdoms-grid">
            {data.kingdoms.map((kingdom, index) => {
              const isUnlocked = isKingdomUnlocked(index);
              const kingdomProgress = progress.kingdoms?.[kingdom.id] || {
                stars: 0,
                completed: false,
              };

              return (
                <KingdomCard
                  key={kingdom.id}
                  icon={kingdom.icon}
                  label={kingdom.label}
                  description={kingdom.description}
                  path={kingdom.path}
                  enabled={isUnlocked && !kingdom.comingSoon}
                  disabled={!isUnlocked}
                  stars={kingdomProgress.stars}
                  progress={kingdomProgress.progress || 0}
                  comingSoon={kingdom.comingSoon}
                />
              );
            })}
          </div>
        </section>


      </main>
    </div>
  );
}
