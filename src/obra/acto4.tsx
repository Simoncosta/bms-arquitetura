// Ato 4 · As melhorias, para todos ao mesmo tempo. Não há um ato por perfil: cada melhoria aparece uma vez e
// cada um reconhece-se nela.

import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { Bug, CircleCheck, Flame, Headset, Rocket, Timer } from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { Contador } from '../components.tsx';
import { CORES } from './config.ts';
import { Cabeca, Entra, useSequencia } from './pecas.tsx';
import { marketing } from './marketing.tsx';

/* ───────────── Mais organizado ───────────── */
const salas = ['Agenda', 'Financeiro', 'Clientes', 'Planos'];
const pecasSoltas = Array.from({ length: 24 }, (_, i) => ({
  i,
  sala: i % 4,
  x: ((i * 397) % 1180) + 40,
  y: ((i * 211) % 330) + 20,
  r: ((i * 53) % 60) - 30,
}));

/** Conta-se sozinho, sem setas. */
function Organizado() {
  const step = useSequencia([0, 1800]);
  return (
    <>
      <Cabeca kicker="Uma melhoria para todos">Mais organizado</Cabeca>
      <div style={{ position: 'relative', flex: 1 }}>
        {step >= 1 && salas.map((s, k) => (
          <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ position: 'absolute', left: k * 350 + 10, top: 40, width: 320, height: 340, borderRadius: 22, border: `2px solid ${CORES.lima}`, background: 'rgba(185,245,0,0.06)' }}>
            <div style={{ position: 'absolute', bottom: -48, left: 0, right: 0, textAlign: 'center', fontSize: 26, fontWeight: 700, color: CORES.lima }}>{s}</div>
          </motion.div>
        ))}
        {pecasSoltas.map((p) => {
          const col = Math.floor(p.i / 4) % 3;
          const lin = Math.floor(p.i / 12);
          const nx = p.sala * 350 + 40 + col * 92;
          const ny = 80 + lin * 120 + (p.i % 4 === p.sala ? 0 : 0);
          return (
            <motion.div key={p.i}
              animate={step >= 1 ? { x: nx, y: ny + ((p.i >> 2) % 2) * 0, rotate: 0 } : { x: p.x, y: p.y, rotate: [p.r, p.r + 8, p.r] }}
              transition={step >= 1 ? { type: 'spring', stiffness: 90, damping: 14, delay: (p.i % 8) * 0.04 } : { rotate: { duration: 2, repeat: Infinity }, default: { duration: 0.6 } }}
              style={{ position: 'absolute', left: 0, top: 0, width: 78, height: 96, borderRadius: 10, background: '#2a2a32', border: `2px solid ${step >= 1 ? CORES.lima : '#55555f'}`, padding: 10 }}>
              {[0, 1, 2].map((l) => <div key={l} style={{ height: 6, borderRadius: 3, background: '#55555f', marginBottom: 8, width: `${90 - l * 22}%` }} />)}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

const organizado: SlideDef = {
  id: 'organizado', titulo: 'Mais organizado', steps: 1,
  notas:
    'Primeira melhoria: organização. Antes, cada peça estava onde calhava — para mudar uma coisa era preciso conhecer o sistema inteiro. Agora cada coisa está na sua sala. Quem chega ao código sabe onde procurar; quem dá suporte sabe a quem perguntar; e uma mudança numa sala não parte as outras.',
  render: () => <Organizado />,
};

/* ───────────── Menos incêndios ───────────── */
/** Conta-se sozinho, sem setas. */
function Incendios() {
  const step = useSequencia([0, 2200, 3800]);
  return (
    <>
      <Cabeca kicker="Uma melhoria para todos">Menos incêndios</Cabeca>
      <div style={{ display: 'flex', alignItems: 'center', gap: 70, flex: 1, paddingBottom: 30 }}>
        <div style={{ position: 'relative', width: 280, textAlign: 'center' }}>
          <motion.div animate={{ rotate: step === 0 ? [0, -6, 6, 0] : 0 }} transition={{ duration: 0.5, repeat: step === 0 ? Infinity : 0 }}>
            <Headset size={200} strokeWidth={1.2} color={step >= 1 ? CORES.lima : CORES.branco} />
          </motion.div>
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 10, color: CORES.lima, fontWeight: 800, fontSize: 30 }}>
              <Timer size={36} /> segundos
            </motion.div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, flex: 1 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="cartao" style={{ height: 150, display: 'grid', placeItems: 'center', borderColor: step >= 1 ? 'rgba(185,245,0,0.4)' : 'rgba(239,68,68,0.4)' }}>
              {step >= 1 ? (
                <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: i * 0.12 }}>
                  <CircleCheck size={64} color={CORES.lima} strokeWidth={1.8} />
                </motion.div>
              ) : (
                <motion.div animate={{ scale: [1, 1.18, 0.95, 1], y: [0, -4, 0] }} transition={{ duration: 0.7 + (i % 3) * 0.2, repeat: Infinity }}>
                  <Flame size={64} color={CORES.vermelho} strokeWidth={1.8} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Entra show={step >= 2} style={{ textAlign: 'center', marginBottom: 30 }}>
        <p className="frase" style={{ fontSize: 30 }}>Mais tempo para o que importa: <b className="lima">conhecer o produto e ajudar o cliente.</b></p>
      </Entra>
    </>
  );
}

const incendios: SlideDef = {
  id: 'incendios', titulo: 'Menos incêndios', steps: 1,
  notas:
    'Para o suporte: hoje passa-se muito tempo a apagar incêndios. Com a nova base, cada problema resolve-se mais depressa — muitas vezes em segundos, com o interruptor que volta atrás sem nova versão da app. E o trabalho do suporte é tão importante: conhecer o produto e ajudar o cliente. É para isso que queremos que sobre tempo.',
  render: () => <Incendios />,
};

/* ───────────── Come-se com os olhos ───────────── */
// Capturas reais do mesmo ecrã no sistema antigo e no novo (BMS Test Team), no computador e no telemóvel.
const OLHOS = [
  { area: 'Agenda', pc: ['/obra/olhos/agenda-pc-antes.webp', '/obra/olhos/agenda-pc-depois.webp'], tel: ['/obra/olhos/agenda-tel-antes.webp', '/obra/olhos/agenda-tel-depois.webp'] },
  { area: 'Financeiro', pc: ['/obra/olhos/fin-pc-antes.webp', '/obra/olhos/fin-pc-depois.webp'], tel: ['/obra/olhos/fin-tel-antes.webp', '/obra/olhos/fin-tel-depois.webp'] },
];
const CICLO = 8; // segundos de uma passagem da cortina (ida e volta)

const ESTATICO = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('estatico');

/** O antes por baixo, o agora por cima e a linha da cortina: as duas coisas leem a MESMA posição (0–100 %),
 *  por isso nunca se desencontram. */
function Cortina({ pos, antes, depois, largura, altura, raio = 16, pega = true }: { pos: MotionValue<number>; antes: string; depois: string; largura: number; altura: number; raio?: number; pega?: boolean }) {
  const clip = useTransform(pos, (v) => `inset(0 0 0 ${v}%)`);
  const left = useTransform(pos, (v) => `${v}%`);
  const img = (src: string) => <img src={src} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }} />;
  return (
    <div style={{ position: 'relative', width: largura, height: altura, borderRadius: raio, overflow: 'hidden', border: `2px solid ${CORES.lima}`, boxShadow: '0 0 70px rgba(185,245,0,0.16)', background: '#fff' }}>
      {img(antes)}
      <motion.div style={{ position: 'absolute', inset: 0, clipPath: clip }}>{img(depois)}</motion.div>
      <motion.div style={{ position: 'absolute', top: 0, bottom: 0, left, width: 4, marginLeft: -2, background: CORES.lima, boxShadow: '0 0 18px rgba(185,245,0,0.8)' }}>
        {pega && (
          <div style={{ position: 'absolute', top: '50%', left: -22, marginTop: -24, width: 48, height: 48, borderRadius: '50%', background: CORES.lima, color: CORES.carvao, display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 20 }}>⇆</div>
        )}
      </motion.div>
    </div>
  );
}

/** A Agenda e depois o Financeiro, no computador e no telemóvel com a mesma cortina; no fim de cada passagem
 *  (de uma ponta à outra e de volta) muda de área. */
function Olhos() {
  const [i, setI] = useState(0);
  const pos = useMotionValue(ESTATICO ? 50 : 100);
  useEffect(() => {
    if (ESTATICO) return;
    let vivo = true;
    let atual: { stop: () => void } | null = null;
    (async () => {
      while (vivo) {
        // fica no antes, desliza até ao fim (só o agora), fica, e volta ao início (só o antes)
        const c = animate(pos, [100, 100, 0, 0, 100], { duration: CICLO, times: [0, 0.1, 0.45, 0.6, 1], ease: 'easeInOut' });
        atual = c;
        await c;
        if (!vivo) break;
        setI((v) => (v + 1) % OLHOS.length);
      }
    })();
    return () => { vivo = false; atual?.stop(); };
  }, [pos]);
  const o = OLHOS[i];
  const ALTURA = 548;
  return (
    <div style={{ flex: 1, paddingBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        {OLHOS.map((x, k) => (
          <motion.span key={x.area} className="chip" animate={{ background: k === i ? CORES.lima : 'rgba(0,0,0,0)', color: k === i ? CORES.carvao : CORES.cinza, borderColor: k === i ? CORES.lima : '#44444f' }}
            style={{ fontSize: 18, fontWeight: 800, padding: '6px 16px' }}>{x.area}</motion.span>
        ))}
        <span className="legenda" style={{ marginLeft: 'auto', fontSize: 17 }}>
          <b style={{ color: CORES.branco }}>antes</b> à esquerda da cortina · <b className="lima">agora</b> à direita
        </span>
      </div>
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start' }}>
        <Cortina pos={pos} antes={o.pc[0]} depois={o.pc[1]} largura={Math.round(ALTURA * 1.99)} altura={ALTURA} />
        <Cortina pos={pos} antes={o.tel[0]} depois={o.tel[1]} largura={Math.round(ALTURA * 0.4585)} altura={ALTURA} raio={28} pega={false} />
      </div>
    </div>
  );
}

const olhos: SlideDef = {
  id: 'olhos', titulo: 'Come-se com os olhos', steps: 1,
  notas:
    'Para quem vende: as pessoas compram com os olhos. O mesmo ecrã, no sistema antigo e no novo, no computador e no telemóvel — a cortina passa sozinha de um para o outro. Primeiro a Agenda, depois o Financeiro. Acredito mesmo que quem vir vai gostar mais do novo — e é mais fácil vender o que dá vontade de usar.',
  render: () => (
    <>
      <Cabeca kicker="Uma melhoria para todos">Come-se com os olhos</Cabeca>
      <Olhos />
    </>
  ),
};

/* ───────────── O bug que voltava ───────────── */
const bugs: SlideDef = {
  id: 'bugs', titulo: 'O bug que voltava', steps: 4,
  notas:
    'Sejamos honestos: ainda vamos ter bugs. Não estamos livres deles. O problema que temos hoje é outro — o bug que corrigimos e que VOLTA, como um boomerang. (→) Na nova base, cada área tem uma rede: provas que comparam com o sistema de hoje, e testes que estragam o código de propósito para ver se a prova apanha. (→) E mudamos a forma de testar: hoje os nossos testes acabam por ficar separados, cada um à sua peça. Agora vamos focar nos testes de valor e de fluxo — o percurso inteiro, como o cliente o faz: marcar, pagar, entrar, receber a fatura. Se o percurso partir, o teste apanha antes do cliente. (→) O objetivo deste produto é esse: evitar o regresso dos bugs, mais do que melhorar coisas.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="Uma melhoria para todos">O bug que voltava</Cabeca>
      <div style={{ position: 'relative', flex: 1 }}>
        <svg width={1408} height={460} viewBox="0 0 1408 460" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <path id="boomerang" d="M 160 360 C 500 20, 1000 20, 1180 220 C 1000 420, 500 440, 160 360" fill="none" stroke="#34343e" strokeWidth={3} strokeDasharray="8 10" />
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: 9 }).map((_, i) => <line key={`v${i}`} x1={900 + i * 30} y1={70} x2={900 + i * 30} y2={390} stroke={CORES.lima} strokeWidth={2} opacity={0.65} />)}
              {Array.from({ length: 11 }).map((_, i) => <line key={`h${i}`} x1={900} y1={70 + i * 32} x2={1140} y2={70 + i * 32} stroke={CORES.lima} strokeWidth={2} opacity={0.65} />)}
            </motion.g>
          )}
        </svg>
        {step === 0 ? (
          <motion.div
            animate={{ offsetDistance: ['0%', '100%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: 0, top: 0, offsetPath: "path('M 160 360 C 500 20, 1000 20, 1180 220 C 1000 420, 500 440, 160 360')", offsetRotate: 'auto 90deg', marginLeft: -40, marginTop: -40 }}
          >
            {/* segue a linha de cabeça para a frente, só a abanar as patas — sem girar sobre si próprio */}
            <motion.div animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}>
              <Bug size={80} color={CORES.vermelho} strokeWidth={1.8} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial={{ x: 700, y: 120, rotate: 0 }} animate={{ x: 980, y: 190, rotate: [0, 20, -15, 10, 0] }} transition={{ duration: 0.9 }}
            style={{ position: 'absolute', left: 0, top: 0 }}>
            <Bug size={80} color={CORES.vermelho} strokeWidth={1.8} />
          </motion.div>
        )}
        <div style={{ position: 'absolute', left: 60, top: 380, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="chip">o bug que corrigimos</span>
          <motion.span className="chip" animate={{ opacity: step === 0 ? 1 : 0.3 }} style={{ borderColor: CORES.vermelho, color: CORES.vermelho }}>…e que voltava</motion.span>
        </div>
        <Entra show={step >= 1} style={{ position: 'absolute', right: 40, top: 410 }}>
          <span className="chip chip-laranja">a rede: provas contra o sistema de hoje + testes que estragam de propósito</span>
        </Entra>
        {/* dos testes soltos aos testes de fluxo: o percurso inteiro, como o cliente o faz */}
        <Entra show={step >= 2} style={{ position: 'absolute', left: 0, top: 0, width: 640 }}>
          <div className="cartao cartao-lima" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700 }}>
              <span className="cinza" style={{ textDecoration: 'line-through' }}>testes soltos, cada um à sua peça</span>
              <span className="lima">→ testes de valor e de fluxo</span>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <div style={{ position: 'absolute', left: 30, right: 30, top: 17, height: 3, background: 'rgba(185,245,0,0.35)' }} />
              <motion.span animate={{ left: ['5%', '92%'] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: 11, width: 15, height: 15, borderRadius: '50%', background: CORES.lima, boxShadow: '0 0 12px rgba(185,245,0,0.8)' }} />
              {['marcar', 'pagar', 'entrar', 'fatura'].map((p) => (
                <div key={p} style={{ position: 'relative', textAlign: 'center', width: 80 }}>
                  <div style={{ margin: '0 auto', width: 36, height: 36, borderRadius: '50%', border: `2px solid ${CORES.lima}`, background: '#1c1c22' }} />
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{p}</div>
                </div>
              ))}
            </div>
          </div>
        </Entra>
        <Entra show={step >= 3} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center' }}>
          <p className="frase-grande" style={{ fontSize: 38 }}>Não estamos livres de bugs. <span className="lima">O objetivo é que não voltem.</span></p>
        </Entra>
      </div>
    </>
  ),
};

/* ───────────── Focar no que importa ───────────── */
const deploys: SlideDef = {
  id: 'deploys', titulo: 'Focar no que importa', steps: 2,
  notas:
    'Sabem quantos deploys fizemos numa quarta-feira? Mais de 30. Num dia. Cada um é uma correção a correr, um risco, uma interrupção. (→) É isto que a nova base nos dá: menos regressos de bugs, menos pressa, mais foco no que importa.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="Uma melhoria para todos">Focar no que importa</Cabeca>
      <div style={{ display: 'flex', gap: 60, flex: 1, paddingBottom: 30, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, height: 480, borderRadius: 22, background: '#202026', overflow: 'hidden', border: `1px solid ${step === 0 ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}` }}>
          {(step === 0 ? Array.from({ length: 14 }) : Array.from({ length: 1 })).map((_, i) => (
            <motion.div key={`${step}-${i}`}
              initial={{ y: 520, x: 40 + ((i * 97) % 560), opacity: 0 }}
              animate={{ y: -120, opacity: [0, 1, 1, 0] }}
              transition={{ duration: step === 0 ? 1.1 : 4, delay: step === 0 ? i * 0.17 : 0.3, repeat: Infinity, repeatDelay: step === 0 ? 0.6 : 2, ease: 'easeIn' }}
              style={{ position: 'absolute', left: 0, top: 0 }}>
              <Rocket size={step === 0 ? 46 : 72} color={step === 0 ? CORES.vermelho : CORES.lima} strokeWidth={1.7} style={{ transform: 'rotate(-45deg)' }} />
            </motion.div>
          ))}
        </div>
        <div style={{ width: 460 }}>
          {step === 0 ? (
            <>
              <div className="numero-enorme" style={{ fontSize: 150, color: CORES.vermelho }}><Contador ate={30} />+</div>
              <p className="frase">deploys numa só <b>quarta-feira</b></p>
            </>
          ) : (
            <Entra>
              <p className="frase-grande" style={{ fontSize: 62 }}>Menos pressa.<br /><span className="lima">Mais foco.</span></p>
            </Entra>
          )}
        </div>
      </div>
    </>
  ),
};

export const acto4: SlideDef[] = [organizado, incendios, olhos, marketing, bugs, deploys];
