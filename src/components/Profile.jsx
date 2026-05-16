import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAuthUser, isGuestMode, updateUserDisplayName } from '../store/progress';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const user = getCurrentAuthUser();
  const guest = isGuestMode();
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    // Redirect guest users
    if (guest || !user) {
      navigate('/');
      return;
    }

    setDisplayName(user?.displayName || '');
  }, [guest, user, navigate]);

  const handleSaveDisplayName = async () => {
    if (!displayName.trim()) return;
    setIsSavingName(true);
    try {
      await updateUserDisplayName(displayName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update display name:', error);
    } finally {
      setIsSavingName(false);
    }
  };

  if (guest || !user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.displayName
              ? user.displayName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              : '👤'}
          </div>
          <div className="profile-header-content">
            {isEditingName ? (
              <div className="profile-name-edit">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="profile-name-input"
                  disabled={isSavingName}
                />
                <div className="profile-name-buttons">
                  <button
                    className="profile-name-save-btn"
                    onClick={handleSaveDisplayName}
                    disabled={isSavingName || !displayName.trim()}
                  >
                    {isSavingName ? '💾 Saving...' : '✓ Save'}
                  </button>
                  <button
                    className="profile-name-cancel-btn"
                    onClick={() => {
                      setIsEditingName(false);
                      setDisplayName(user?.displayName || '');
                    }}
                    disabled={isSavingName}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="profile-name">{user?.displayName || 'User'}</h1>
                <button
                  className="profile-name-edit-btn"
                  onClick={() => setIsEditingName(true)}
                >
                  ✏️ Edit Name
                </button>
              </div>
            )}
            <p className="profile-email">{user?.email || 'No email'}</p>
          </div>
        </div>

        {/* Profile Stats Section Removed */}

        {/* Profile Info */}
        <div className="profile-info">
          <h2 className="profile-section-title">Account Information</h2>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email || 'N/A'}</span>
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
