import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from '@context/data';
import { EpisodiosFiltradosContext } from '@context/episodios_filtrados';
import { HelmetProvider } from 'react-helmet-async';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <DataContext>
          <EpisodiosFiltradosContext>
            <App />
          </EpisodiosFiltradosContext>
        </DataContext>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
