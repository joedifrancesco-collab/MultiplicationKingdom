import { useState, useEffect } from 'react';
import { getSpellingAttempts, getCurrentUser, getCurrentAuthUser, fetchSpellingAttemptsFromFirebase } from '../../../../store/progress';
import './SpellingLeaderboard.css';

export default function SpellingLeaderboard() {
  const [spellingData, setSpellingData] = useState({});

  useEffect(() => {
    // Load spelling attempts - try Firebase first, then fall back to local storage
    const loadAttempts = async () => {
      const authUser = getCurrentAuthUser();
      
      if (authUser) {
        // Try to load from Firebase
        try {
          const firebaseData = await fetchSpellingAttemptsFromFirebase();
          if (Object.keys(firebaseData).length > 0) {
            setSpellingData(firebaseData);
            return;
          }
        } catch (error) {
          console.error('Failed to load from Firebase, falling back to local storage:', error);
        }
      }
      
      // Fall back to local storage
      const localData = getSpellingAttempts();
      setSpellingData(localData);
    };

    loadAttempts();
  }, []);

  // Get username from either Firebase or named user system
  const authUser = getCurrentAuthUser();
  const namedUser = getCurrentUser();
  const username = authUser?.displayName || namedUser || 'User';

  const groupIds = Object.keys(spellingData);
  const hasAttempts = groupIds.length > 0;

  return (
    <div className="spelling-leaderboard">
      <header className="sl-header">
        <div className="sl-crown">🏆</div>
        <h1 className="sl-title">Spelling Leaderboard</h1>
        <p className="sl-subtitle">Champion spellers in the Spelling Kingdom!</p>
        {username && <p className="sl-username">👤 {username}</p>}
      </header>

      <div className="sl-content">
        {hasAttempts ? (
          <div className="sl-groups-container">
            {groupIds.map((groupId) => {
              const groupData = spellingData[groupId];
              const dateKeys = Object.keys(groupData.attempts).sort().reverse();

              return (
                <div key={groupId} className="sl-group">
                  <h2 className="sl-group-title">{groupData.groupTitle}</h2>
                  
                  <div className="sl-attempts-list">
                    {dateKeys.map((date) => {
                      const attempt = groupData.attempts[date];
                      return (
                        <div key={date} className="sl-attempt-record">
                          <div className="sl-date">📅 {date}</div>
                          <div className="sl-stats">
                            <div className="sl-stat">
                              <span className="sl-label">First Attempt:</span>
                              <span className="sl-value">{attempt.firstAttemptCorrectCount} correct</span>
                            </div>
                            <div className="sl-stat">
                              <span className="sl-label">Best Attempts:</span>
                              <span className="sl-value">{attempt.totalAttemptsToComplete}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="sl-placeholder-message">
            <p className="sl-placeholder-text">
              No spelling attempts yet!
            </p>
            <p className="sl-placeholder-subtext">
              Complete spelling challenges to see your performance tracked here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
