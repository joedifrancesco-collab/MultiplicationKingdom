import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.emoji}>⚠️</h1>
            <h2 style={styles.title}>Oops! Something went wrong</h2>
            <p style={styles.message}>
              The game encountered an unexpected error. Don't worry, your progress is safe!
            </p>
            {import.meta.env.MODE === 'development' && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details (Development Only)</summary>
                <pre style={styles.errorText}>{this.state.error?.toString()}</pre>
              </details>
            )}
            <button style={styles.button} onClick={this.handleReset}>
              Try Again
            </button>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => (window.location.href = '/')}
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F0F4FF',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  emoji: {
    fontSize: '64px',
    margin: '0 0 20px 0',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 15px 0',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
  },
  details: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  summary: {
    cursor: 'pointer',
    color: '#6C63FF',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorText: {
    backgroundColor: '#F5F5F5',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    overflow: 'auto',
    maxHeight: '200px',
    color: '#D32F2F',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    backgroundColor: '#6C63FF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    backgroundColor: '#FF6B6B',
  },
};
