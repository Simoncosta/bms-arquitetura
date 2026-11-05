import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@xyflow/react/dist/style.css';
import './styles.css';
import { Deck } from './Deck.tsx';
import { Apresentador } from './Apresentador.tsx';

const params = new URLSearchParams(window.location.search);

// ?estatico=1 mostra cada slide já no estado final, sem animações (para rever ou imprimir).
if (params.has('estatico')) MotionGlobalConfig.skipAnimations = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>{params.has('apresentador') ? <Apresentador /> : <Deck />}</StrictMode>,
);
