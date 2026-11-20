import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initInstall } from './app/install.js';
import './styles/globals.css';
import './styles/tailwind.css';

initInstall();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
