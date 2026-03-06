import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/index';

// Set dark theme immediately before rendering
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
  document.documentElement.style.colorScheme = 'dark';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
