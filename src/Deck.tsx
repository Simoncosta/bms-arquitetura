import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { slides } from './slides/index.ts';
import { canal, enviar, type Mensagem } from './canal.ts';

const LARGURA = 1600;
const ALTURA = 900;

function useEscala() {
  const [escala, setEscala] = useState(1);
  useEffect(() => {
    const ajustar = () => setEscala(Math.min(window.innerWidth / LARGURA, window.innerHeight / ALTURA));
    ajustar();
    window.addEventListener('resize', ajustar);
    return () => window.removeEventListener('resize', ajustar);
  }, []);
  return escala;
}

/** Abre no slide do endereço: #5, ou ?s=5&p=3 para ir direto ao 3.º passo do slide 5. */
function posicaoInicial() {
  const params = new URLSearchParams(window.location.search);
  const n = Number(params.get('s') ?? window.location.hash.replace('#', ''));
  const indice = Number.isInteger(n) && n >= 1 && n <= slides.length ? n - 1 : 0;
  const p = Number(params.get('p'));
  const passo = Number.isInteger(p) && p >= 1 ? Math.min(p, slides[indice].steps) - 1 : 0;
  return { indice, passo };
}

export function Deck() {
  const escala = useEscala();
  const [{ indice, passo }, setPosicao] = useState(posicaoInicial);
  const [notas, setNotas] = useState(false);
  const [preto, setPreto] = useState(false);
  const [laser, setLaser] = useState(false);
  const [rato, setRato] = useState({ x: -100, y: -100 });
  const slide = slides[indice];

  useEffect(() => {
    // Mantém o ?ver=arquitetura do endereço: sem ele, um F5 voltava ao ecrã de entrada.
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${indice + 1}`);
    enviar({ tipo: 'estado', indice, passo });
  }, [indice, passo]);

  const seguinte = useCallback(() => {
    setPosicao(({ indice, passo }) => {
      if (passo < slides[indice].steps - 1) return { indice, passo: passo + 1 };
      if (indice < slides.length - 1) return { indice: indice + 1, passo: 0 };
      return { indice, passo };
    });
  }, []);

  const anterior = useCallback(() => {
    setPosicao(({ indice, passo }) => {
      if (passo > 0) return { indice, passo: passo - 1 };
      if (indice > 0) return { indice: indice - 1, passo: slides[indice - 1].steps - 1 };
      return { indice, passo };
    });
  }, []);

  useEffect(() => {
    const ouvir = (e: MessageEvent<Mensagem>) => {
      if (e.data.tipo === 'ir') (e.data.acao === 'seguinte' ? seguinte : anterior)();
      if (e.data.tipo === 'pedir-estado') enviar({ tipo: 'estado', indice, passo });
    };
    canal.addEventListener('message', ouvir);
    return () => canal.removeEventListener('message', ouvir);
  }, [seguinte, anterior, indice, passo]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowright', 'arrowdown', 'pagedown', ' ', 'enter'].includes(k)) { e.preventDefault(); seguinte(); }
      else if (['arrowleft', 'arrowup', 'pageup', 'backspace'].includes(k)) { e.preventDefault(); anterior(); }
      else if (k === 'home') setPosicao({ indice: 0, passo: 0 });
      else if (k === 'end') setPosicao({ indice: slides.length - 1, passo: 0 });
      else if (k === 'n') setNotas((v) => !v);
      else if (k === 'b' || k === '.') setPreto((v) => !v);
      else if (k === 'l') setLaser((v) => !v);
      else if (k === 'p') window.open(`${window.location.pathname}?apresentador=1`, 'bms-apresentador', 'width=900,height=700');
      else if (k === 'f') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [seguinte, anterior]);

  const progresso = (indice + (passo + 1) / slide.steps) / slides.length;

  return (
    <div
      className="ecra"
      style={{ cursor: laser ? 'none' : undefined }}
      onMouseMove={(e) => laser && setRato({ x: e.clientX, y: e.clientY })}
    >
      <div className="palco" style={{ width: LARGURA, height: ALTURA, transform: `translate(-50%, -50%) scale(${escala})` }}>
        <AnimatePresence mode="wait">
          <motion.section
            key={slide.id}
            className="slide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {slide.render({ step: passo })}
          </motion.section>
        </AnimatePresence>

        <footer className="rodape">
          <img src="/logos/Logotipo_BMS_Branco.svg" alt="BMS" className="rodape-logo" />
          <span className="rodape-numero">{String(indice + 1).padStart(2, '0')} / {slides.length}</span>
          <motion.div className="rodape-progresso" animate={{ scaleX: progresso }} transition={{ duration: 0.4 }} />
        </footer>

        {!slide.interativo && (
          <>
            <button className="zona zona-anterior" aria-label="Anterior" onClick={anterior} />
            <button className="zona zona-seguinte" aria-label="Seguinte" onClick={seguinte} />
          </>
        )}

        <AnimatePresence>
          {notas && (
            <motion.aside className="notas" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
              {slide.notas}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {preto && <motion.div className="preto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreto(false)} />}
      </AnimatePresence>
      {laser && <div className="laser" style={{ left: rato.x, top: rato.y }} />}
    </div>
  );
}
