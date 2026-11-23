// Ato 0 · A caixa. Antes de tudo, a dinâmica para conhecer melhor a equipa. Não é um slide: é ambiente.
// O ecrã mostra só a REPRESENTAÇÃO de cada virtude (o ícone, a cor, o brilho); as cartas lê-as o Simon.
// Passo 0: a caixa fechada · passos 1–19: as virtudes, pela ordem das cartas · passo 20: abre-se e divide-se.
// Ao lado, o quadro em aguarela, como num jogo: tudo desfocado; cada carta desbloqueia uma camada da história
// (a cliente, a rua, a receção…, ver quadro.ts) e na última, ao abrir a caixa, o quadro inteiro ganha vida.

import { motion } from 'motion/react';
import type { SlideDef } from '../../types.ts';
import { CORES } from '../config.ts';
import { Explosao } from '../pecas.tsx';
import { VIRTUDES } from './virtudes.tsx';
import { useRegisto } from './registo.ts';
import { CARTAS } from './cartas.ts';
import { QuadroEmCamadas, type ZonaDoQuadro } from '../QuadroEmCamadas.tsx';
import { ALTURA, ATOS, CAMADAS, CENAS, LARGURA, type Ponto } from '../quadro.ts';

// Todas as zonas do quadro numa lista fixa, cada uma a lembrar a carta que a desbloqueia.
const ZONAS: (ZonaDoQuadro & { carta: number })[] = CENAS.flatMap((c, i) =>
  [...c.cena, ...(c.cenario ?? [])].map((z) => ({ ...z, carta: i + 1 })));

/** Para onde a câmara olha em cada carta: o centro da cena dessa virtude, um pouco mais perto. */
function focoDaCarta(step: number) {
  const cena = CENAS[step - 1];
  if (!cena) return { x: 0.5, y: 0.5, zoom: 1 };
  let centro: Ponto;
  if (cena.foco) centro = cena.foco;
  else {
    const pts = cena.cena.flatMap((z) => z.formas[0] ?? []);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    centro = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  }
  return { x: centro[0] / LARGURA, y: centro[1] / ALTURA, zoom: 1.12 };
}

function atoDaCarta(step: number) {
  let i = 0;
  ATOS.forEach((a, k) => { if (step >= a.primeiraCarta) i = k; });
  return i;
}
const N = VIRTUDES.length;

/** Onde está o quadro em cada passo: ao fundo, ténue (0) · grande, ao centro, a revelar-se (1–19) · maior e nítido (20). */
function lugarDoQuadro(step: number) {
  if (step === 0) return { x: 0, y: 0, scale: 1.12, opacity: 0.16 };
  if (step <= N) return { x: 0, y: 352 - 450, scale: 0.78, opacity: 1 };
  return { x: 0, y: -40, scale: 0.9, opacity: 1 };
}

function Quadro({ step }: { step: number }) {
  return (
    <motion.div
      initial={false}
      animate={lugarDoQuadro(step)}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', left: 800 - 720, top: 450 - 405, width: 1440, height: 810, pointerEvents: 'none' }}
    >
      <QuadroEmCamadas
        camadas={CAMADAS} zonas={ZONAS} largura={LARGURA} altura={ALTURA} composicao="/obra/camadas/composicao.webp"
        abertas={ZONAS.map((z) => step >= z.carta)} tudo={step > N}
        foco={step >= 1 && step <= N ? focoDaCarta(step) : { x: 0.5, y: 0.5, zoom: 1 }}
        vida={step > N ? 1 : 0} aceso={step > N ? 1 : 0} acesas={['p2b']} ato={step > N ? 3 : atoDaCarta(step)}
        style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.35))' }}
      />
    </motion.div>
  );
}

/** Debaixo do quadro, tudo numa só coluna: o ato e a cena desbloqueada, a virtude e quem a recebeu, a frase da carta
 *  e o convite «→ passa a quem achas mais …». O quadro é o protagonista; aqui só o texto que a sala precisa. */
function Legenda({ step }: { step: number }) {
  const c = CENAS[step - 1];
  const v = VIRTUDES[step - 1];
  const registo = useRegisto();
  if (!c || !v) return null;
  const quem = registo[v.id];
  const ato = ATOS.find((a) => a.primeiraCarta === step);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 682, textAlign: 'center' }}>
      <motion.div key={`camada-${step}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: CORES.lima }}>
        {ato && <span style={{ color: CORES.violetaClaro }}>{ato.titulo} ·</span>}
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: CORES.lima }} />
        Nível {step} · {c.nome}
        <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 600, fontSize: 18, color: CORES.branco }}>— {c.frase}</span>
      </motion.div>
      <motion.div key={`nome-${v.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
        style={{ marginTop: 6, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16 }}>
        <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: '0.02em', color: v.cor }}>{v.nome}</span>
        {quem && (
          <motion.span key={`quem-${v.id}-${quem}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            style={{ fontSize: 30, fontWeight: 600, color: CORES.branco }}>
            · {quem}
          </motion.span>
        )}
      </motion.div>
      <div style={{ marginTop: 2 }}><Carta indice={step} compacta atraso={1.2} /></div>
    </div>
  );
}

function Caixa({ aberta, tamanho = 300 }: { aberta: boolean; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
      {/* corpo */}
      <rect x="35" y="88" width="130" height="96" rx="10" fill={CORES.violeta} />
      <rect x="92" y="88" width="16" height="96" fill={CORES.lima} />
      {/* tampa */}
      <motion.g
        style={{ originX: '170px', originY: '80px', transformBox: 'view-box' }}
        animate={aberta ? { rotate: 38, y: -46, x: 22 } : { rotate: 0, y: 0, x: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
      >
        <rect x="27" y="64" width="146" height="30" rx="8" fill="#5a2ad6" />
        <rect x="92" y="64" width="16" height="30" fill={CORES.lima} />
        <path d="M100 64 C 82 36, 56 44, 70 60 C 76 66, 92 66, 100 64 Z" fill="none" stroke={CORES.lima} strokeWidth="7" strokeLinejoin="round" />
        <path d="M100 64 C 118 36, 144 44, 130 60 C 124 66, 108 66, 100 64 Z" fill="none" stroke={CORES.lima} strokeWidth="7" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
}

/** Os doces a saltar da caixa aberta, para dividir com todos. */
function Doces({ topo = '46%', esquerda = '50%' }: { topo?: string; esquerda?: string }) {
  const cores = [CORES.lima, CORES.violetaClaro, '#ff8fb1', '#ffd24a', CORES.branco, '#5ee0c8'];
  return (
    <div style={{ position: 'absolute', left: esquerda, top: topo, width: 0, height: 0 }}>
      {Array.from({ length: 26 }).map((_, i) => {
        const angulo = -Math.PI / 2 + ((i / 25) - 0.5) * 2.2;
        const d = 220 + ((i * 53) % 160);
        const forma = i % 3;
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 40, opacity: 0, rotate: 0 }}
            animate={{ x: Math.cos(angulo) * d, y: Math.sin(angulo) * d * 0.9, opacity: 1, rotate: (i % 2 ? 1 : -1) * 220 }}
            transition={{ duration: 1.2, delay: 0.25 + (i % 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', width: forma === 1 ? 34 : 24, height: 24, marginLeft: -12, marginTop: -12,
              borderRadius: forma === 0 ? '50%' : forma === 1 ? 8 : 4, background: cores[i % cores.length],
              boxShadow: forma === 1 ? `inset 0 0 0 4px rgba(0,0,0,0.12)` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

/** A frase curta da carta e o convite «→ passa a quem achas mais …», à vista de toda a sala. */
function Carta({ indice, atraso = 1.4, compacta = false }: { indice: number; atraso?: number; compacta?: boolean }) {
  const carta = CARTAS[indice];
  const letra = compacta ? 22 : 30;
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.p key={`frase-${indice}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: atraso, duration: 0.6 }}
        style={{ margin: '0 auto', maxWidth: compacta ? 1100 : 1100, fontSize: letra, fontStyle: 'italic', color: CORES.cinza, lineHeight: 1.35 }}>
        «{carta.frase}»
      </motion.p>
      <motion.div key={`seguinte-${indice}`} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: atraso + 1.6, type: 'spring', stiffness: 200, damping: 16 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: compacta ? 12 : 26, padding: compacta ? '10px 22px' : '14px 28px', borderRadius: 999, background: CORES.lima, color: CORES.carvao, fontSize: compacta ? 21 : 30, fontWeight: 800 }}>
        {carta.seguinte ? <>→ passa a quem achas mais {carta.seguinte}</> : <>→ abre a caixa e divide com todos</>}
      </motion.div>
    </div>
  );
}

const caixa: SlideDef = {
  id: 'caixa',
  titulo: 'A caixa (dinâmica)',
  steps: N + 2,
  semRodape: true,
  notas:
    'Antes de começar, uma dinâmica para nos conhecermos melhor. Entregar a caixa e ler a carta 1. A cada carta lida, carregar → e o ecrã mostra a virtude seguinte: o ícone, o nome, a frase curta da carta e, no fim, «→ passa a quem achas mais …», para a sala toda saber o que procurar. O texto completo de cada carta está aqui, por baixo, para leres em voz alta. Na janela do apresentador (P) escreve-se o nome de quem ficou com cada virtude — aparece logo debaixo do ícone e volta no fim da apresentação. Ao lado, o quadro em aguarela desbloqueia-se como um jogo: cada carta desbloqueia a cena da sua virtude (a receção arrumada, a aula de grupo, os operários no telhado…), em 4 atos, e a câmara aproxima-se dela; no fim de cada ato abre-se o cenário à volta. Na carta 20, → abre a caixa: o quadro inteiro ganha vida e os doces dividem-se por todos.',
  render: ({ step }) => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* o quadro fica sempre montado (o mesmo canvas): só muda de lugar e de revelação entre passos */}
      <Quadro step={step} />
      {step === 0 && (
        <div className="centro" style={{ position: 'absolute', inset: 0, justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: [0, -16, 0] }} transition={{ opacity: { duration: 0.8 }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}>
            <Caixa aberta={false} tamanho={300} />
          </motion.div>
          <motion.div animate={{ opacity: [0.25, 0.7, 0.25] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ width: 220, height: 24, borderRadius: '50%', background: 'rgba(114,59,250,0.35)', filter: 'blur(10px)', marginTop: -20 }} />
          <div style={{ marginTop: 40 }}><Carta indice={0} atraso={1} /></div>
        </div>
      )}
      {step >= 1 && step <= N && <Legenda step={step} />}
      {step === N + 1 && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Explosao cor={CORES.lima} chave="abrir" raio={400} n={30} />
          <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }}
            style={{ position: 'absolute', left: 300 - 150, top: 600 }}>
            <Caixa aberta tamanho={300} />
          </motion.div>
          <Doces topo="80%" esquerda="19%" />
        </div>
      )}
    </div>
  ),
};

export const acto0: SlideDef[] = [caixa];
