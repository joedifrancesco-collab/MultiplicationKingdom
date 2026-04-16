import React from 'react';
import SubjectCard from '../shared/components/SubjectCard';
import './Home.css';

/**
 * Home Page Component
 * Displays main landing page with subject cards
 * Users choose a subject to explore
 */
export default function Home() {
  const subjects = [
    {
      id: 'math',
      icon: '🔢',
      label: 'Math',
      description: 'Master multiplication, addition, and more!',
      path: '/subjects/math',
      enabled: true,
      enabledCount: 1,
      totalCount: 4,
      badge: null,
    },
    {
      id: 'spelling',
      icon: '📖',
      label: 'Language Arts',
      description: 'Improve spelling, vocabulary, and grammar.',
      path: '/subjects/spelling',
      enabled: true,
      enabledCount: 1,
      totalCount: 3,
      badge: null,
    },
    {
      id: 'lab',
      icon: '🧪',
      label: 'Lab',
      description: 'Explore number theory and experiments.',
      path: '/subjects/lab',
      enabled: true,
      enabledCount: 1,
      totalCount: 1,
      badge: 'NEW',
    },
    {
      id: 'science',
      icon: '🎓',
      label: 'Science',
      description: 'Coming soon with science topics!',
      path: '/subjects/science',
      enabled: false,
      enabledCount: 0,
      totalCount: 0,
      comingSoon: true,
    },
  ];

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-hero">
          <h1 className="home-title">Welcome to Learning Kingdom! 👑</h1>
          <p className="home-subtitle">
            Choose a subject to embark on your learning adventure.
          </p>
        </div>
      </header>

      <main className="home-content">
        <section className="subjects-section">
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                icon={subject.icon}
                label={subject.label}
                description={subject.description}
                path={subject.path}
                enabled={subject.enabled}
                enabledCount={subject.enabledCount}
                totalCount={subject.totalCount}
                badge={subject.badge}
                comingSoon={subject.comingSoon}
              />
            ))}
          </div>
        </section>

        {/* Optional Info Section */}
        <section className="home-info">
          <div className="info-card">
            <h2 className="info-title">💡 Tips</h2>
            <ul className="info-list">
              <li>Start with <strong>Math</strong> to master multiplication!</li>
              <li>Unlock new kingdoms by earning stars.</li>
              <li>Track your progress on the leaderboard.</li>
              <li>Challenge yourself with different game modes.</li>
            </ul>
          </div>

          <div className="info-card">
            <h2 className="info-title">🎮 Game Modes</h2>
            <ul className="info-list">
              <li>
                <strong>Flashcard:</strong> Learn with flashcards
              </li>
              <li>
                <strong>Speed Challenge:</strong> Beat the clock
              </li>
              <li>
                <strong>Match Game:</strong> Pair correct answers
              </li>
              <li>
                <strong>Kingdom Siege:</strong> Complete challenges to win
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
