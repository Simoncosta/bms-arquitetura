// O menu do lado, para trocar de apresentação sem sair da sala. Aparece ao encostar o rato à
// margem esquerda ou com a tecla M; não ocupa nada do ecrã enquanto está fechado.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { House } from 'lucide-react';
import { APRESENTACOES, abrirApresentacao } from './Inicio.tsx';
import './inicio.css';

export function MenuLateral({ atual }: { atual: 'arquitetura' | 'cerebro' }) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === 'm') setAberto((v) => !v);
      if (e.key === 'Escape') setAberto(false);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, []);

  return (
    <>
      <div className="menu-gatilho" onMouseEnter={() => setAberto(true)} aria-hidden />
      <AnimatePresence>
        {aberto && (
          <motion.nav
            className="menu-lateral"
            aria-label="Apresentações"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onMouseLeave={() => setAberto(false)}
          >
            <img src="/logos/Logotipo_BMS_Branco.svg" alt="BMS" className="menu-logo" />
            <span className="menu-rotulo">Apresentações</span>
            {APRESENTACOES.map(({ id, titulo, cor, Icone }) => (
              <button
                key={id}
                className={`menu-item ${atual === id ? 'atual' : ''}`}
                style={{ '--cor': cor } as React.CSSProperties}
                onClick={() => (atual === id ? setAberto(false) : abrirApresentacao(id))}
              >
                <Icone size={22} strokeWidth={1.8} />
                <span>{titulo}</span>
              </button>
            ))}
            <button className="menu-item" onClick={() => (window.location.href = window.location.pathname)}>
              <House size={22} strokeWidth={1.8} />
              <span>Início</span>
            </button>
            <span className="menu-dica">M abre e fecha</span>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
