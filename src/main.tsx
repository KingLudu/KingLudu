import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initAlwaysFullscreen } from './utils/fullscreen';

// Initialize always-fullscreen behavior on any user interaction across all screens & modals
if (typeof window !== 'undefined') {
  initAlwaysFullscreen();
}

// Prevent unwanted browser zoom gestures on mobile webview / touch screens
if (typeof window !== 'undefined') {
  // Prevent iOS / mobile webview gesture-based pinch zoom
  document.addEventListener(
    'gesturestart',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );
  document.addEventListener(
    'gesturechange',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  // Prevent double-tap zoom on rapid taps during gameplay
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        // Prevent default zoom if touching non-input elements
        const target = event.target as HTMLElement | null;
        if (target && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
        }
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

