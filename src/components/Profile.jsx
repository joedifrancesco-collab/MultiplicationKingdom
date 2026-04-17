import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAuthUser, isGuestMode, getProgress } from '../store/progress';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentAuthUser());
  const [guest, setGuest] = useState(isGuestMode());
  const [progress, setProgress] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    // Redirect guest users
    if (guest || !user) {
      navigate('/');
      return;
    }

    // Load progress data
    const userProgress = getProgress();
    setProgress(userProgress);

    // Calculate total stats
    let stars = 0;
    let score = 0;

    if (userProgress.kingdoms) {
      userProgress.kingdoms.forEach((kingdom) => {
        stars += kingdom.stars || 0;
      });
    }

    if (userProgress.scores) {
      Object.values(userProgress.scores).forEach((gameType) => {
        if (typeof gameType === 'object') {
          Object.values(gameType).forEach((gameScore) => {
            if (gameScore && gameScore.score) {
              score += gameScore.score;
            }
          });
        }
      });
    }

    setTotalStars(stars);
    setTotalScore(score);
  }, [guest, user, navigate]);

  if (guest || !user) {
    return null;
  }

  const getInitials = (displayName) => {
    if (!displayName) return '👤';
    return displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {getInitials(user?.displayName || 'User')}
          </div>
          <div className="profile-header-content">
            <h1 className="profile-name">{user?.displayName || 'User'}</h1>
            <p className="profile-email">{user?.email || 'No email'}</p>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-label">Total Stars</div>
            <div className="stat-value">⭐ {totalStars}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Score</div>
            <div className="stat-value">🏆 {totalScore}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Kingdoms Completed</div>
            <div className="stat-value">
              👑 {progress?.kingdoms?.filter((k) => k.stars > 0).length || 0}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          <h2 className="profile-section-title">Account Information</h2>
          <div className="info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{user?.uid || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email Verified:</span>
            <span className="info-value">{user?.emailVerified ? '✅ Yes' : '❌ No'}</span>
          </div>
          {user?.metadata?.creationTime && (
            <div className="info-item">
              <span className="info-label">Account Created:</span>
              <span className="info-value">
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Back Button */}
        <button className="profile-back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}
