// Ato 1 · Como trabalhamos — o diferencial, num desenho só: a v2 nasce ao lado da v1, cada área é comparada com a
// v1 (os mesmos pedidos, os mesmos resultados), um interruptor decide quem serve o centro e volta atrás em
// segundos, e os erros encontrados na v1 ficam corrigidos na v2 e passam à equipa.

import { motion } from 'motion/react';
import { Bug, Building2, Check, CreditCard, Smartphone, Users } from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { CORES } from './config.ts';
import { Cabeca, Entra } from './pecas.tsx';

const Y1 = 120; // a v1, em cima
const Y2 = 340; // a v2, em baixo
const YM = 230; // o meio: o pedido, a comparação, o interruptor e o centro
const X_PEDIDO = 70;
const X_SISTEMA = 470;
const X_COMPARA = 800;
const X_INTERRUPTOR = 1060;
const X_CENTRO = 1320;

function Fluxo({ d, show, cor = CORES.lima, atraso = 0 }: { d: string; show: boolean; cor?: string; atraso?: number }) {
  return (
    <g>
      <motion.path d={d} fill="none" stroke={cor} strokeWidth={3} opacity={0.45}
        initial={{ pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }} transition={{ duration: 0.8, delay: atraso }} />
      {show && [0, 1].map((k) => (
        <circle key={k} r={7} fill={cor}>
          <animateMotion dur="2.2s" begin={`-${k * 1.1 + atraso}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}
    </g>
  );
}

function Caixa({ x, y, titulo, sub, cor, show = true, children }: { x: number; y: number; titulo: string; sub: string; cor: string; show?: boolean; children?: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      style={{ position: 'absolute', left: x - 120, top: y - 48, width: 240, height: 96, borderRadius: 18, border: `3px solid ${cor}`, background: '#1c1c22', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: cor }}>{titulo}</div>
        <div className="legenda" style={{ fontSize: 15 }}>{sub}</div>
      </div>
      {children}
    </motion.div>
  );
}

function No({ x, y, Icone, nome }: { x: number; y: number; Icone: typeof Smartphone; nome: string }) {
  return (
    <div style={{ position: 'absolute', left: x - 60, top: y - 44, width: 120, textAlign: 'center' }}>
      <div style={{ margin: '0 auto', width: 88, height: 88, borderRadius: '50%', border: `3px solid ${CORES.branco}`, background: '#1c1c22', display: 'grid', placeItems: 'center' }}>
        <Icone size={38} strokeWidth={1.6} />
      </div>
      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{nome}</div>
    </div>
  );
}

const LEGENDAS = [
  <>O sistema de hoje <b>continua a servir os centros</b>, como sempre.</>,
  <>A v2 nasce <b className="lima">ao lado</b>, área a área, <b className="lima">sem mexer na v1</b>.</>,
  <><b className="lima">Prova de paridade</b>: os mesmos pedidos nas duas, os mesmos resultados, linha a linha. <b className="lima">55 dos 57 módulos</b> já têm prova.</>,
  <>Um <b className="lima">interruptor</b> decide quem serve o centro. Se algo correr mal, <b className="lima">volta à v1 em segundos</b>, sem nova versão da app.</>,
  <>Os erros que encontramos na v1 ficam <b className="lima">corrigidos na v2</b> e passam à equipa. E cada escrita de dinheiro é <b className="lima">protegida contra o duplo clique</b> e auditada.</>,
];

export const comoTrabalhamos: SlideDef = {
  id: 'metodo', titulo: 'Como trabalhamos', steps: 5,
  notas:
    'Antes do que já fizemos, como o fazemos — porque é isto que nos deixa mudar tudo sem parar nada. (→) O sistema de hoje continua a servir os centros. (→) A v2 nasce ao lado, área a área, e não mexe no comportamento da v1. (→) Antes de uma área entrar, comparamos as duas: os mesmos pedidos, os mesmos resultados, linha a linha. Chamamos-lhe prova de paridade — 55 dos 57 módulos já a têm, em 177 ficheiros de prova. (→) Cada área tem um interruptor no servidor: liga-se por uma variável e, se algo correr mal, volta à v1 em segundos, sem obrigar ninguém a atualizar a app. (→) E quando encontramos um erro na v1, fica corrigido na v2 e passamos à equipa. As escritas de dinheiro levam proteção contra o duplo clique e ficam auditadas, uma a uma.',
  render: ({ step }) => {
    const naV2 = step >= 3;
    const caminhoV1 = `M ${X_PEDIDO + 50} ${YM} C ${X_PEDIDO + 180} ${YM}, ${X_SISTEMA - 260} ${Y1}, ${X_SISTEMA - 120} ${Y1}`;
    const caminhoV2 = `M ${X_PEDIDO + 50} ${YM} C ${X_PEDIDO + 180} ${YM}, ${X_SISTEMA - 260} ${Y2}, ${X_SISTEMA - 120} ${Y2}`;
    const v1ParaCompara = `M ${X_SISTEMA + 120} ${Y1} C ${X_COMPARA - 160} ${Y1}, ${X_COMPARA - 140} ${YM}, ${X_COMPARA - 50} ${YM}`;
    const v2ParaCompara = `M ${X_SISTEMA + 120} ${Y2} C ${X_COMPARA - 160} ${Y2}, ${X_COMPARA - 140} ${YM}, ${X_COMPARA - 50} ${YM}`;
    const comparaParaInterruptor = `M ${X_COMPARA + 50} ${YM} L ${X_INTERRUPTOR - 50} ${YM}`;
    const interruptorParaCentro = `M ${X_INTERRUPTOR + 50} ${YM} L ${X_CENTRO - 50} ${YM}`;
    return (
      <>
        <Cabeca kicker="O nosso diferencial">Como trabalhamos</Cabeca>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg width={1408} height={470} viewBox="0 0 1408 470" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
            <Fluxo d={caminhoV1} show cor={CORES.cinza} />
            <Fluxo d={v1ParaCompara} show cor={CORES.cinza} />
            <Fluxo d={caminhoV2} show={step >= 2} atraso={0.2} />
            <Fluxo d={v2ParaCompara} show={step >= 2} atraso={0.2} />
            <Fluxo d={comparaParaInterruptor} show cor={naV2 ? CORES.lima : CORES.cinza} />
            <Fluxo d={interruptorParaCentro} show cor={naV2 ? CORES.lima : CORES.cinza} />
          </svg>

          <No x={X_PEDIDO} y={YM} Icone={Smartphone} nome="um pedido" />
          <Caixa x={X_SISTEMA} y={Y1} titulo="v1" sub="o sistema de hoje" cor={CORES.cinza}>
            {step >= 4 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                style={{ position: 'absolute', right: -18, top: -18, width: 44, height: 44, borderRadius: '50%', background: CORES.vermelho, display: 'grid', placeItems: 'center' }}>
                <Bug size={24} color="#fff" />
              </motion.div>
            )}
          </Caixa>
          <Caixa x={X_SISTEMA} y={Y2} titulo="v2" sub="a nova base, ao lado" cor={CORES.lima} show={step >= 1}>
            {step >= 4 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 14 }}
                style={{ position: 'absolute', right: -18, top: -18, width: 44, height: 44, borderRadius: '50%', background: CORES.lima, display: 'grid', placeItems: 'center' }}>
                <Check size={26} color={CORES.carvao} strokeWidth={3} />
              </motion.div>
            )}
          </Caixa>
          {/* o erro da v1, corrigido na v2, passa à equipa */}
          {step >= 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              style={{ position: 'absolute', left: X_SISTEMA - 260, top: YM - 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: CORES.lima }}>
              <Users size={20} /> passa à equipa
            </motion.div>
          )}

          {/* a comparação: os mesmos resultados, linha a linha */}
          <motion.div animate={{ opacity: step >= 2 ? 1 : 0.25, scale: step >= 2 ? 1 : 0.85, borderColor: step >= 2 ? CORES.lima : '#44444f' }}
            style={{ position: 'absolute', left: X_COMPARA - 50, top: YM - 50, width: 100, height: 100, borderRadius: 24, border: '3px solid', background: '#1c1c22', display: 'grid', placeItems: 'center', fontSize: 52, fontWeight: 800, color: CORES.lima }}>
            =
          </motion.div>
          <Entra show={step >= 2} delay={0.6} style={{ position: 'absolute', left: X_COMPARA - 110, top: YM + 62, width: 220, textAlign: 'center' }}>
            <span className="chip" style={{ borderColor: CORES.lima, fontSize: 16 }}>✓ 55 de 57 módulos</span>
          </Entra>

          {/* o interruptor: em cima a v1, em baixo a v2 */}
          <div style={{ position: 'absolute', left: X_INTERRUPTOR - 50, top: YM - 80, width: 100, height: 160 }}>
            <div style={{ position: 'absolute', left: 30, top: 0, width: 40, height: 160, borderRadius: 20, background: '#2a2a32', border: `2px solid ${naV2 ? CORES.lima : '#55555f'}` }} />
            <motion.div animate={{ y: naV2 ? 112 : 8 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              style={{ position: 'absolute', left: 34, top: 0, width: 32, height: 32, borderRadius: '50%', background: naV2 ? CORES.lima : CORES.cinza, boxShadow: naV2 ? '0 0 24px rgba(185,245,0,0.7)' : 'none' }} />
            <div style={{ position: 'absolute', left: 78, top: 4, fontSize: 16, fontWeight: 800, color: naV2 ? CORES.cinza : CORES.branco }}>v1</div>
            <div style={{ position: 'absolute', left: 78, top: 120, fontSize: 16, fontWeight: 800, color: naV2 ? CORES.lima : CORES.cinza }}>v2</div>
          </div>
          {step >= 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ position: 'absolute', left: X_INTERRUPTOR - 120, top: YM + 96, width: 240, textAlign: 'center', fontSize: 16, fontWeight: 700, color: CORES.lima }}>
              ↺ volta atrás em segundos
            </motion.div>
          )}

          <No x={X_CENTRO} y={YM} Icone={Building2} nome="o centro" />

          {step >= 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}
              style={{ position: 'absolute', left: X_CENTRO - 130, top: YM - 150, width: 260, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 12, border: `1.5px solid ${CORES.lima}`, background: '#1f2512', fontSize: 15, fontWeight: 700 }}>
              <CreditCard size={20} color={CORES.lima} /> dinheiro: sem duplo clique, auditado
            </motion.div>
          )}

          <motion.div key={`legenda-${step}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 8, textAlign: 'center' }}>
            <p className="frase" style={{ fontSize: 26, maxWidth: 1250, margin: '0 auto' }}>{LEGENDAS[step]}</p>
          </motion.div>
        </div>
      </>
    );
  },
};
