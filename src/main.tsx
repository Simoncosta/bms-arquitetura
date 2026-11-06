import { StrictMode, type ReactNode } from 'react';
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
import { Inicio } from './Inicio.tsx';
import { MenuLateral } from './MenuLateral.tsx';
import { Mapa } from './cerebro/Mapa.tsx';
import { ApresentadorDoCerebro } from './cerebro/Apresentador.tsx';

const params = new URLSearchParams(window.location.search);
const ver = params.get('ver');

// ?estatico=1 mostra cada slide já no estado final, sem animações (para rever ou imprimir).
if (params.has('estatico')) MotionGlobalConfig.skipAnimations = true;

// Duas apresentações num só projeto:
//   ?ver=arquitetura → os slides da arquitetura (os endereços antigos, #5 e ?s=5, continuam a abri-los)
//   ?ver=cerebro     → o mapa do cérebro
//   sem nada         → o ecrã de entrada, para escolher
// Com &apresentador=1, a janela do apresentador de cada uma (tecla P).
function escolher(): ReactNode {
  if (ver === 'cerebro') {
    if (params.has('apresentador')) return <ApresentadorDoCerebro />;
    return (
      <>
        <Mapa />
        <MenuLateral atual="cerebro" />
      </>
    );
  }
  const enderecoAntigo = params.has('s') || window.location.hash !== '';
  if (ver === 'arquitetura' || params.has('apresentador') || enderecoAntigo) {
    if (params.has('apresentador')) return <Apresentador />;
    return (
      <>
        <Deck />
        <MenuLateral atual="arquitetura" />
      </>
    );
  }
  return <Inicio />;
}

createRoot(document.getElementById('root')!).render(<StrictMode>{escolher()}</StrictMode>);
