// A brincadeira com o Rúben (CPO): a meio da apresentação, a «migração obrigatória para React». Tecla R.
// Limpa e segura: nada de fotografias, só o nome. Esc (ou R outra vez) fecha.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Feather } from 'lucide-react';
import { CORES } from './config.ts';

const linhas = [
  'A converter 3 839 commits de Flutter para React…',
  'npm install — a instalar 1 742 pacotes…',
  'A traduzir 446 ecrãs para JSX…',
  'A apagar o pubspec.yaml com muito cuidado…',
  'A pedir aprovação ao revisor: Rúben…',
];

export function PiadaReact({ aberta, fechar }: { aberta: boolean; fechar: () => void }) {
  const [fase, setFase] = useState(0);

  useEffect(() => {
    if (!aberta) { setFase(0); return; }
    const tempos = [600, 1700, 2900, 4100, 5300, 7600, 9800];
    const relogios = tempos.map((t, i) => setTimeout(() => setFase(i + 1), t));
    return () => relogios.forEach(clearTimeout);
  }, [aberta]);

  const progresso = Math.min(fase, 5) / 5 * 99;
  const recusado = fase >= 6;
  const fim = fase >= 7;

  return (
    <AnimatePresence>
      {aberta && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={fechar}
          style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(8,8,10,0.92)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
        >
          {!fim ? (
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0, x: recusado ? [0, -14, 14, -10, 10, 0] : 0 }}
              transition={{ x: { duration: 0.5 } }}
              style={{ width: 980, background: '#f2f2f4', color: '#1b1b1f', borderRadius: 16, overflow: 'hidden', boxShadow: '0 30px 120px rgba(0,0,0,0.6)', fontFamily: 'Poppins' }}
            >
              <div style={{ background: '#d9d9de', padding: '12px 18px', display: 'flex', gap: 8, alignItems: 'center' }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />)}
                <span style={{ marginLeft: 12, fontSize: 15, color: '#55555f' }}>Atualização do sistema</span>
              </div>
              <div style={{ padding: '34px 40px 38px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                  <motion.svg width="78" height="78" viewBox="-11.5 -10.23 23 20.46" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                    <circle r="2.05" fill="#61dafb" />
                    <g stroke="#61dafb" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2" /><ellipse rx="11" ry="4.2" transform="rotate(60)" /><ellipse rx="11" ry="4.2" transform="rotate(120)" /></g>
                  </motion.svg>
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 800 }}>Atualização obrigatória</div>
                    <div style={{ fontSize: 20, color: '#55555f' }}>A migrar a BMS para React. Não desligue a TV.</div>
                  </div>
                </div>
                <div style={{ marginTop: 30, height: 22, borderRadius: 11, background: '#d9d9de', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${progresso}%`, background: recusado ? CORES.vermelho : '#61dafb' }} transition={{ duration: 0.8 }} style={{ height: '100%', borderRadius: 11 }} />
                </div>
                <div style={{ marginTop: 10, textAlign: 'right', fontWeight: 800, fontSize: 20 }}>{Math.round(progresso)}%</div>
                <div style={{ marginTop: 14, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 18, lineHeight: 1.7, minHeight: 160 }}>
                  {linhas.slice(0, Math.min(fase, linhas.length)).map((l) => (
                    <motion.div key={l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>› {l}</motion.div>
                  ))}
                </div>
                {recusado && (
                  <motion.div initial={{ scale: 2, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: -6, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 16 }}
                    style={{ marginTop: 6, display: 'inline-block', border: `4px solid ${CORES.vermelho}`, color: CORES.vermelho, padding: '10px 18px', borderRadius: 12, fontWeight: 800, fontSize: 24 }}>
                    PEDIDO RECUSADO · revisor: Rúben · 47 pedidos de alteração
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <motion.div initial={{ x: -700, y: -200, rotate: -30 }} animate={{ x: 0, y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 60, damping: 12 }}>
                <svg width="200" height="248" viewBox="0 0 166 202">
                  <path fill="#42A5F5" d="M37.7 128.9 9.8 101 100.4 10.4h55.8L37.7 128.9zm118.5-.4h-55.8l-20.9 20.9 27.9 27.9 48.8-48.8z" />
                  <path fill="#0D47A1" d="m79.5 170.7 20.9 20.9h55.8l-48.8-48.8-27.9 27.9z" />
                  <path fill="#42A5F5" d="m100.4 128.5 27.9 27.9-27.9 27.9-27.9-27.9 27.9-27.9z" />
                </svg>
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                style={{ fontSize: 64, fontWeight: 800, margin: '30px 0 8px', color: '#fff' }}>Brincadeira.</motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                style={{ fontSize: 40, fontWeight: 700, margin: 0, color: CORES.lima }}>O Flutter fica. <span style={{ color: CORES.cinza }}>(por agora 👀)</span></motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, -6, 0] }} transition={{ delay: 1.6, y: { duration: 2, repeat: Infinity } }} style={{ marginTop: 26 }}>
                <Feather size={28} color={CORES.cinza} />
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
