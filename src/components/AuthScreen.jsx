import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser, signInUser, setGuestMode } from '../store/progress';
import { redactProfanity } from '../utils/contentFilter';
import './AuthScreen.css';

export default function AuthScreen() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuestMode = () => {
    setGuestMode();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        if (!username.trim()) {
          setError('Please enter a username');
          setLoading(false);
          return;
        }
        if (username.length < 3) {
          setError('Username must be at least 3 characters');
          setLoading(false);
          return;
        }
        if (!password || !confirmPassword) {
          setError('Please enter and confirm password');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const result = await signUpUser(email, username, password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      } else {
        // Sign in
        const result = await signInUser(email, password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🏆 Multiplication Kingdom</h1>
          <p>{isSignUp ? 'Create Account' : 'Sign In'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(redactProfanity(e.target.value))}
                placeholder="Your display name"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              disabled={loading}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                required
                disabled={loading}
              />
            </div>
          )}

          {error && <div className="auth-error">❌ {error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '⏳ Loading...' : isSignUp ? '✓ Create Account' : '✓ Sign In'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="toggle-button"
            >
              {isSignUp ? 'Sign In' : 'Create One'}
            </button>
          </p>
        </div>

        <div className="auth-guest-section">
          <button
            type="button"
            onClick={handleGuestMode}
            className="guest-button"
          >
            👤 Play as Guest
          </button>
          <p className="guest-note">Or sign in to save your progress and compete on the leaderboard</p>
        </div>

        {isSignUp && (
          <div className="auth-privacy-notice">
            <p>
              🔒 <strong>We will never sell or share your information.</strong>
              <br />
              <a href="/PRIVACY_POLICY.md" target="_blank" rel="noopener noreferrer" className="auth-privacy-link">
                Read our privacy policy
              </a>
            </p>
          </div>
        )}

        <div className="auth-info">
          <p>📚 Sign in to save your progress and compete on the leaderboard!</p>
        </div>
      </div>
    </div>
  );
}
