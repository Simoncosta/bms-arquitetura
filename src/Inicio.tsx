// O ecrã de entrada: escolher a apresentação. Teclas 1 e 2, ou clique.

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Boxes, BrainCircuit } from 'lucide-react';
import './inicio.css';

export const APRESENTACOES = [
  {
    id: 'arquitetura',
    numero: 1,
    titulo: 'Evoluir sobre o que já construímos',
    subtitulo: 'A arquitetura: o monólito modular, slide a slide',
    cor: '#ff6b00',
    Icone: Boxes,
  },
  {
    id: 'cerebro',
    numero: 2,
    titulo: 'O Cérebro BMS',
    subtitulo: 'Experiência · Fundação · Inteligência — um mapa para explorar',
    cor: '#cdf22b',
    Icone: BrainCircuit,
  },
] as const;

export function abrirApresentacao(id: string) {
  window.location.href = `${window.location.pathname}?ver=${id}`;
}

export function Inicio() {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const escolhida = APRESENTACOES.find((a) => String(a.numero) === e.key);
      if (escolhida) abrirApresentacao(escolhida.id);
      if (e.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, []);

  return (
    <div className="inicio">
      <header className="inicio-topo">
        <img src="/logos/Logotipo_BMS_Branco.svg" alt="BMS" />
      </header>
      <main>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          Onde estamos e para onde vamos
        </motion.h1>
        <div className="inicio-cartoes">
          {APRESENTACOES.map(({ id, numero, titulo, subtitulo, cor, Icone }, i) => (
            <motion.button
              key={id}
              className="inicio-cartao"
              style={{ '--cor': cor } as React.CSSProperties}
              onClick={() => abrirApresentacao(id)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inicio-numero">{numero}</span>
              <Icone size={56} strokeWidth={1.6} className="inicio-icone" />
              <strong>{titulo}</strong>
              <span>{subtitulo}</span>
            </motion.button>
          ))}
        </div>
        <p className="inicio-dica">1 ou 2 para escolher · M abre o menu dentro de cada apresentação · F ecrã inteiro</p>
      </main>
    </div>
  );
}
