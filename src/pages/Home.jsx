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
      badge: null,
    },
    {
      id: 'spelling',
      icon: '📖',
      label: 'Language Arts',
      description: 'Improve spelling, vocabulary, and grammar.',
      path: '/subjects/spelling',
      enabled: true,
      badge: null,
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
                badge={subject.badge}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
