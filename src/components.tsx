import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { animate, motion } from 'motion/react';

/** Aparece (com um pequeno movimento) quando `show` passa a verdadeiro. */
export function Reveal({ show = true, delay = 0, children, className, style, y = 24 }: {
  show?: boolean; delay?: number; children: ReactNode; className?: string; style?: CSSProperties; y?: number;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.55, delay: show ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Título do slide: curto, grande, com uma palavra opcional a laranja. */
export function Titulo({ kicker, children }: { kicker?: string; children: ReactNode }) {
  return (
    <>
      {kicker && <Reveal><p className="kicker">{kicker}</p></Reveal>}
      <Reveal delay={0.06}><h1 className="titulo">{children}</h1></Reveal>
    </>
  );
}

const euros = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const inteiros = new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 });

/** Um número que conta de 0 até ao valor quando aparece. */
export function Contador({ ate, formato = 'inteiro', show = true }: { ate: number; formato?: 'euro' | 'inteiro' | 'milhoes'; show?: boolean }) {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    if (!show) { setValor(0); return; }
    const controlo = animate(0, ate, { duration: 1.4, ease: 'easeOut', onUpdate: setValor });
    return () => controlo.stop();
  }, [ate, show]);
  if (formato === 'euro') return <>{euros.format(valor)}</>;
  if (formato === 'milhoes') return <>{(valor / 1_000_000).toFixed(2).replace('.', ',')} M€</>;
  return <>{inteiros.format(valor)}</>;
}

/* Ícones simples, em traço, no estilo do símbolo da BMS. */
const traco = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
export const Icone = {
  visto: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
  cruz: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M6 6l12 12M18 6L6 18" /></svg>,
  cadeado: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><rect {...traco} x="5" y="11" width="14" height="10" rx="2" /><path {...traco} d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  olho: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle {...traco} cx="12" cy="12" r="3" /></svg>,
  lua: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>,
  sol: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><circle {...traco} cx="12" cy="12" r="4" /><path {...traco} d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  pausa: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M9 5v14M15 5v14" /></svg>,
  servidor: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><rect {...traco} x="3" y="4" width="18" height="7" rx="2" /><rect {...traco} x="3" y="13" width="18" height="7" rx="2" /><path {...traco} d="M7 7.5h.01M7 16.5h.01" /></svg>,
  torniquete: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M5 21V4M19 21V4M5 9h7l4-3M5 9l4 4" /></svg>,
  porta: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M4 21h16M6 21V4h9v17M15 8l4-1v14M12 13h.01" /></svg>,
  pino: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle {...traco} cx="12" cy="9" r="2.5" /></svg>,
  pessoa: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><circle {...traco} cx="12" cy="8" r="4" /><path {...traco} d="M4 21a8 8 0 0 1 16 0" /></svg>,
  codigo: (s = 28) => <svg width={s} height={s} viewBox="0 0 24 24"><path {...traco} d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" /></svg>,
};
