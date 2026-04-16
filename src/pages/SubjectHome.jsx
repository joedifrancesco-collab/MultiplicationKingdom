import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import KingdomCard from '../shared/components/KingdomCard';
import { getProgress } from '../store/progress';
import './SubjectHome.css';

/**
 * SubjectHome Page Component
 * Displays kingdoms for a specific subject (Math, Spelling, Lab, etc.)
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
          path: '/subjects/math/multiplication-kingdom',
          unlockIndex: 0, // First one is always unlocked
        },
        {
          id: 'addition-kingdom',
          icon: '➕',
          label: 'Addition Kingdom',
          description: 'Master addition and number combinations',
          path: '/subjects/math/addition-kingdom',
          unlockIndex: 1,
        },
        {
          id: 'subtraction-kingdom',
          icon: '➖',
          label: 'Subtraction Kingdom',
          description: 'Learn subtraction and differences',
          path: '/subjects/math/subtraction-kingdom',
          unlockIndex: 2,
        },
        {
          id: 'division-kingdom',
          icon: '÷',
          label: 'Division Kingdom',
          description: 'Understand division and fractions',
          path: '/subjects/math/division-kingdom',
          unlockIndex: 3,
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
          path: '/subjects/spelling',
          unlockIndex: 0,
        },
        {
          id: 'vocabulary',
          icon: '📚',
          label: 'Vocabulary',
          description: 'Learn new words and meanings',
          path: '/subjects/spelling/vocabulary',
          unlockIndex: 1,
        },
        {
          id: 'grammar',
          icon: '🔤',
          label: 'Grammar',
          description: 'Master grammar rules and punctuation',
          path: '/subjects/spelling/grammar',
          unlockIndex: 2,
        },
      ],
    },
    lab: {
      icon: '🧪',
      label: '🧪 Lab Kingdom',
      description: 'Explore experiments and challenges!',
      kingdoms: [
        {
          id: 'number-cruncher',
          icon: '🎮',
          label: 'Number Cruncher',
          description: 'Advanced math challenges and puzzles',
          path: '/subjects/lab/number-cruncher',
          unlockIndex: 0,
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
  const isKingdomUnlocked = (unlockIndex) => {
    if (unlockIndex === 0) return true;

    // Get the kingdom from the previous level
    const prevKingdom = data.kingdoms[unlockIndex - 1];
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
                  enabled={isUnlocked}
                  disabled={!isUnlocked}
                  stars={kingdomProgress.stars}
                  progress={kingdomProgress.progress || 0}
                />
              );
            })}
          </div>
        </section>

        {/* Optional: Show unlock requirements */}
        {data.kingdoms.length > 0 && (
          <section className="unlock-guide">
            <div className="guide-card">
              <h2 className="guide-title">🔓 Unlock Requirements</h2>
              <ul className="guide-list">
                <li>
                  <strong>{data.kingdoms[0].label}</strong> - Available now!
                </li>
                {data.kingdoms.slice(1).map((kingdom, index) => (
                  <li key={kingdom.id}>
                    <strong>{kingdom.label}</strong> - Get 1 star in{' '}
                    {data.kingdoms[index].label}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
