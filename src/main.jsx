import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function isMobileBrowser() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 0 && window.innerWidth <= 768);
}

function MobileGate() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '32px',
      textAlign: 'center',
      backgroundColor: '#F0F4FF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏗️</div>
      <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '16px' }}>
        Mobile Version Under Construction
      </h1>
      <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', maxWidth: '400px' }}>
        Our mobile web experience is currently being improved. Please visit us from a desktop browser while we work on making things great for mobile!
      </p>
      <div style={{ fontSize: '48px', marginTop: '24px' }}>👑</div>
      <p style={{ fontSize: '14px', color: '#999', marginTop: '16px' }}>
        Learning Kingdom
      </p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isMobileBrowser() ? <MobileGate /> : <App />}
  </StrictMode>,
)
