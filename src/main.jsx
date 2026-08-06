import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { logError } from './utils/logger';

// [REQ-22] In main.jsx register window.onerror and window.addEventListener("unhandledrejection", ...) and route both into logError.
window.onerror = (message, source, lineno, colno, error) => {
  logError('Global window.onerror', { message, source, lineno, colno, error });
};

window.addEventListener("unhandledrejection", (event) => {
  logError('Global unhandledrejection', { reason: event.reason });
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);