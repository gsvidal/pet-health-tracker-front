import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import './i18n/config'; // Inicializar i18n antes de renderizar
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
