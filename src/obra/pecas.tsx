// As peças animadas da Obra, partilhadas pelos atos.

import { useEffect, useState, type ComponentType, CSSProperties, ReactNode } from 'react';
import type { LucideProps } from 'lucide-react';
import { motion } from 'motion/react';
import { CORES } from './config.ts';

const ease = [0.22, 1, 0.36, 1] as const;

/** Um carimbo que cai sobre um cartão (✓ feito, ↻ em curso, → a seguir, ↺ mudámos de ideia). */
export function Selo({ show, tipo, texto, style }: { show: boolean; tipo: 'feito' | 'curso' | 'seguir' | 'virou'; texto: string; style?: CSSProperties }) {
  const cor = tipo === 'feito' ? CORES.lima : tipo === 'virou' ? CORES.lima : CORES.violetaClaro;
  const simbolo = { feito: '✓', curso: '↻', seguir: '→', virou: '↺' }[tipo];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 2.4, rotate: -24 }}
      animate={show ? { opacity: 1, scale: 1, rotate: -9 } : { opacity: 0, scale: 2.4, rotate: -24 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      style={{
        position: 'absolute', right: 18, top: 14, display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', border: `3px solid ${cor}`, color: cor, borderRadius: 10, fontWeight: 800,
        fontSize: 17, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(24,24,28,0.85)', ...style,
      }}
    >
      <span style={{ fontSize: 22 }}>{simbolo}</span>
      {texto}
    </motion.div>
  );
}

/** Uma explosão de partículas a partir do centro. */
export function Explosao({ cor, n = 18, raio = 260, chave }: { cor: string; n?: number; raio?: number; chave: string | number }) {
  return (
    <div key={chave} style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      {Array.from({ length: n }).map((_, i) => {
        const angulo = (i / n) * Math.PI * 2;
        const distancia = raio * (0.7 + ((i * 37) % 10) / 22);
        const tamanho = 6 + ((i * 13) % 9);
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: Math.cos(angulo) * distancia, y: Math.sin(angulo) * distancia, opacity: [0, 1, 0], scale: [0, 1, 0.4] }}
            transition={{ duration: 1.3, delay: 0.15, ease: 'easeOut' }}
            style={{ position: 'absolute', width: tamanho, height: tamanho, marginLeft: -tamanho / 2, marginTop: -tamanho / 2, borderRadius: i % 3 === 0 ? 2 : '50%', background: i % 4 === 0 ? CORES.branco : cor }}
          />
        );
      })}
    </div>
  );
}

/** Aparece por baixo, com atraso (o Reveal da arquitetura, com mais escolha). */
export function Entra({ show = true, delay = 0, x = 0, y = 24, children, style, className }: {
  show?: boolean; delay?: number; x?: number; y?: number; children: ReactNode; style?: CSSProperties; className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      animate={show ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration: 0.6, delay: show ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Um anel a rodar devagar à volta de uma coisa importante. */
export function Anel({ tamanho, cor, duracao = 18, tracejado = '6 14' }: { tamanho: number; cor: string; duracao?: number; tracejado?: string }) {
  return (
    <motion.svg
      width={tamanho} height={tamanho} viewBox="0 0 100 100"
      style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -tamanho / 2, marginTop: -tamanho / 2, pointerEvents: 'none' }}
      animate={{ rotate: 360 }} transition={{ duration: duracao, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke={cor} strokeWidth="0.6" strokeDasharray={tracejado} opacity={0.7} />
    </motion.svg>
  );
}

/** O kicker e o título da Obra (o kicker a lima ou a violeta). */
export function Cabeca({ kicker, children, cor = 'lima' }: { kicker?: string; children: ReactNode; cor?: 'lima' | 'violeta' }) {
  return (
    <>
      {kicker && (
        <Entra>
          <p className="kicker" style={{ color: cor === 'violeta' ? CORES.violetaClaro : CORES.lima }}>{kicker}</p>
        </Entra>
      )}
      <Entra delay={0.06}><h1 className="titulo">{children}</h1></Entra>
    </>
  );
}

/**
 * «No centro, isto quer dizer…»: a faixa em baixo de um ecrã técnico — a figura de quem sente a mudança e a frase.
 * O número fica como prova; a frase é a mensagem.
 */
export function NoCentro({ show, Icone, quem, frase }: { show: boolean; Icone: ComponentType<LucideProps>; quem: string; frase: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease }}
      style={{
        position: 'absolute', left: 96, right: 96, bottom: 18, display: 'flex', alignItems: 'center', gap: 20,
        padding: '16px 24px', borderRadius: 18, background: '#1f2512', border: `1.5px solid ${CORES.lima}`,
      }}
    >
      <span style={{ width: 56, height: 56, borderRadius: '50%', background: CORES.lima, display: 'grid', placeItems: 'center', flex: 'none' }}>
        <Icone size={30} color={CORES.carvao} strokeWidth={1.9} />
      </span>
      <div>
        <div className="rotulo" style={{ color: CORES.lima, fontSize: 13 }}>No centro, isto quer dizer · {quem}</div>
        <div style={{ fontSize: 26, fontWeight: 700, marginTop: 2 }}>{frase}</div>
      </div>
    </motion.div>
  );
}

export const EASE = ease;

const ESTATICO = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('estatico');

/** Para os ecrãs que se contam sozinhos, sem setas: devolve a fase em que vamos (0, 1, 2…), que avança aos tempos
 *  dados (em ms desde que o ecrã aparece). Em ?estatico=1 salta logo para a última fase. */
export function useSequencia(tempos: number[]) {
  const [fase, setFase] = useState(ESTATICO ? tempos.length - 1 : 0);
  useEffect(() => {
    if (ESTATICO) return;
    const ids = tempos.slice(1).map((t, i) => setTimeout(() => setFase(i + 1), t));
    return () => ids.forEach(clearTimeout);
    // os tempos de cada ecrã são fixos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return fase;
}
