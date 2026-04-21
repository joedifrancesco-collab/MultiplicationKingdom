import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function isMobileBrowser() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 0 && window.innerWidth <= 768);
}

function MobileGate() {
  // Mobile gate disabled - hamburger menu now works on mobile
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isMobileBrowser() ? <MobileGate /> : <App />}
  </StrictMode>,
)
