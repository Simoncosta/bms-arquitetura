// Ato 6 · Para onde vamos, a ponte para o cérebro e o fecho.

import { motion } from 'motion/react';
import { Bell, Brain, CalendarCheck, CreditCard, Database, ExternalLink, FileText, Power, Repeat, Ruler, Users } from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { CORES, LINK_DA_APP } from './config.ts';
import { Cabeca, Entra, useSequencia } from './pecas.tsx';

/* ───────────── O caminho ───────────── */
type Estado = 'feito' | 'meio' | 'por';
const marcos: { Icone: typeof Power; nome: string; frase: string; estado: Estado }[] = [
  { Icone: CalendarCheck, nome: 'Agenda, Financeiro e Relatórios ligados', frase: 'na v2, com volta atrás em segundos', estado: 'feito' },
  { Icone: Repeat, nome: 'As tarefas automáticas na v2', frase: '21 de 150 com interruptor — e vão melhorar com o Markov', estado: 'feito' },
  { Icone: Users, nome: 'Clientes, Planos e CRM prontos', frase: 'já existem na v2, a entrar na app área a área', estado: 'feito' },
  { Icone: Power, nome: 'As restantes áreas na v2', frase: 'área a área, cada uma provada contra a de hoje', estado: 'meio' },
  { Icone: Database, nome: 'Começar a captura', frase: 'logo depois das rotas na v2 · um terço já preparado', estado: 'por' },
  { Icone: Ruler, nome: 'Medir o início do mês', frase: '1/12 e 7/12: o primeiro com as melhorias', estado: 'por' },
  { Icone: Brain, nome: 'O cérebro', frase: 'diz ao centro o próximo passo', estado: 'por' },
];
/** O marco onde estamos hoje (o que está a meio). */
const AGORA = marcos.findIndex((m) => m.estado === 'meio');
const POR_FAZER = marcos.length - AGORA - 1;
const FUNDO = '#1c1c22';

const caminho: SlideDef = {
  id: 'caminho', titulo: 'Para onde vamos', steps: POR_FAZER + 1,
  notas:
    'O caminho. Três marcos já feitos: a Agenda, o Financeiro e os Relatórios estão ligados na v2, com volta atrás em segundos; as tarefas automáticas já começaram a passar para a v2 — 21 de 150, cada uma com interruptor — e vão ficar melhores com o Markov; e Clientes, Planos e CRM já existem na v2 e vão entrando na app, área a área. Hoje estamos aqui: as restantes áreas, uma a uma, cada uma provada contra o sistema de hoje. (→) A seguir, logo depois das rotas na v2, começar a captura dos dados: um terço já está preparado, falta a peça dos eventos — é o que dá ao cérebro e ao Markov aquilo de que precisam. (→) A 1 e a 7 de dezembro medimos o primeiro início de mês com as melhorias, e mostramos a diferença. (→) E o destino: o cérebro.',
  render: ({ step }) => {
    const pontos = marcos.map((_, i) => ({ x: 120 + i * 196, y: i % 2 ? 150 : 330 }));
    const caminhoDe = (lista: typeof pontos) => lista.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
    const feito = caminhoDe(pontos.slice(0, AGORA + 1));
    const porFazer = caminhoDe(pontos.slice(AGORA));
    const agora = pontos[AGORA];
    return (
      <>
        <Cabeca kicker="Para onde vamos">O caminho a seguir</Cabeca>
        <div style={{ position: 'relative', flex: 1 }}>
          {/* as linhas primeiro: os círculos e os textos (opacos) ficam por cima delas */}
          <svg width={1408} height={500} viewBox="0 0 1408 500" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <path d={porFazer} fill="none" stroke="#34343e" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 18" />
            <motion.path d={feito} fill="none" stroke={CORES.lima} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} />
            <motion.path d={porFazer} fill="none" stroke={CORES.violeta} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 12"
              initial={{ pathLength: 0 }} animate={{ pathLength: step / POR_FAZER }} transition={{ duration: 0.9 }} />
          </svg>
          <div style={{ position: 'absolute', left: agora.x - 60, top: agora.y - 118, width: 120, textAlign: 'center', color: CORES.lima, fontWeight: 800, fontSize: 18, letterSpacing: '0.14em' }}>
            HOJE
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ fontSize: 22, lineHeight: 1 }}>▾</motion.div>
          </div>
          {marcos.map((m, i) => {
            const p = pontos[i];
            const aceso = m.estado !== 'por' || step > i - AGORA - 1;
            const ultimo = i === marcos.length - 1;
            const fundo =
              m.estado === 'feito' ? `linear-gradient(rgba(185,245,0,0.18), rgba(185,245,0,0.18)), ${FUNDO}`
              : m.estado === 'meio' ? `linear-gradient(90deg, rgba(185,245,0,0.32) 50%, transparent 50%), ${FUNDO}`
              : aceso && ultimo ? CORES.violeta : FUNDO;
            const borda =
              m.estado === 'feito' ? CORES.lima
              : m.estado === 'meio' ? 'transparent'
              : aceso ? CORES.violetaClaro : '#44444f';
            const corDoIcone = m.estado !== 'por' ? CORES.lima : aceso ? (ultimo ? '#fff' : CORES.violetaClaro) : CORES.cinza;
            return (
              <div key={m.nome} style={{ position: 'absolute', left: p.x - 120, top: p.y - 52, width: 240, textAlign: 'center' }}>
                <motion.div
                  animate={{ scale: aceso ? (ultimo ? 1.2 : 1) : 0.7, opacity: aceso ? 1 : 0.4 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                  style={{
                    position: 'relative', margin: '0 auto', width: 104, height: 104, borderRadius: '50%', background: fundo, border: `3px solid ${borda}`,
                    display: 'grid', placeItems: 'center',
                    boxShadow: aceso && ultimo ? '0 0 70px rgba(114,59,250,0.6)' : m.estado !== 'por' ? '0 0 40px rgba(185,245,0,0.25)' : 'none',
                  }}>
                  {m.estado === 'meio' && (
                    // a borda meio verde, meio roxa: está a meio caminho
                    <svg width={110} height={110} viewBox="0 0 110 110" style={{ position: 'absolute', inset: -3 }}>
                      <path d="M55 2 A53 53 0 0 0 55 108" fill="none" stroke={CORES.lima} strokeWidth={3} />
                      <path d="M55 2 A53 53 0 0 1 55 108" fill="none" stroke={CORES.violetaClaro} strokeWidth={3} strokeDasharray="6 6" />
                    </svg>
                  )}
                  <m.Icone size={46} color={corDoIcone} strokeWidth={1.6} />
                </motion.div>
                <motion.div animate={{ opacity: aceso ? 1 : 0 }}
                  style={{ margin: '12px auto 0', padding: '6px 10px', borderRadius: 12, background: 'rgba(24,24,28,0.92)', display: 'inline-block' }}>
                  <div style={{ fontSize: 21, fontWeight: 800, color: m.estado === 'por' ? CORES.branco : CORES.lima }}>
                    {m.estado === 'feito' ? '✓ ' : m.estado === 'meio' ? '◐ ' : ''}{m.nome}
                  </div>
                  <p className="legenda" style={{ fontSize: 16, marginTop: 4 }}>{m.frase}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </>
    );
  },
};

/* ───────────── A ponte para o cérebro: cada tarefa automática vira um fluxo que ele vê ───────────── */
const fluxos = [
  { Icone: Bell, nome: 'lembretes' },
  { Icone: CreditCard, nome: 'cobranças' },
  { Icone: FileText, nome: 'faturação' },
  { Icone: CalendarCheck, nome: 'aulas e presenças' },
];

/** A ponte conta-se sozinha: os fluxos, o cérebro e a base que já existe, a captura e os dois botões. */
function Ponte() {
  const step = useSequencia([0, 900, 2600, 3800]);
  return (
    <>
      <Cabeca kicker="Onde tudo se liga">A ponte para o cérebro</Cabeca>
      <div style={{ position: 'relative', flex: 1 }}>
        {fluxos.map((f, i) => (
          <Entra key={f.nome} delay={0.15 + i * 0.1} x={-40} y={0}
            style={{ position: 'absolute', left: 30, top: 20 + i * 110, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 76, height: 76, borderRadius: 20, background: '#2a2a32', border: `2px solid ${CORES.lima}`, display: 'grid', placeItems: 'center' }}>
              <f.Icone size={36} color={CORES.lima} strokeWidth={1.7} />
            </div>
            <span style={{ fontSize: 24, fontWeight: 700 }}>{f.nome}</span>
          </Entra>
        ))}
        <svg width={1408} height={480} viewBox="0 0 1408 480" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {fluxos.map((_, i) => {
            const d = `M 400 ${58 + i * 110} C 640 ${58 + i * 110}, 720 240, 960 240`;
            return (
              <g key={i}>
                <motion.path d={d} fill="none" stroke={CORES.lima} strokeWidth={3} opacity={0.4}
                  initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.9, delay: i * 0.12 }} />
                {step >= 1 && [0, 1].map((k) => (
                  <circle key={k} r={7} fill={CORES.lima}>
                    <animateMotion dur="2.4s" begin={`-${k * 1.2 + i * 0.3}s`} repeatCount="indefinite" path={d} />
                  </circle>
                ))}
              </g>
            );
          })}
        </svg>
        <motion.div animate={{ scale: step >= 1 ? [1, 1.05, 1] : 1 }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ position: 'absolute', left: 960, top: 240, marginLeft: -150, marginTop: -150, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(114,59,250,0.45), rgba(114,59,250,0.05) 70%)', display: 'grid', placeItems: 'center' }}>
          <Brain size={190} color={step >= 1 ? '#fff' : CORES.violetaClaro} strokeWidth={1.2} />
        </motion.div>
        {/* o cérebro não começa do zero: a base já existe */}
        <Entra show={step >= 1} delay={0.8} style={{ position: 'absolute', left: 1150, top: 70, width: 258 }}>
          <p className="rotulo" style={{ color: CORES.violetaClaro, fontSize: 13, marginBottom: 10 }}>A base já existe</p>
          {['o rasto de cada escrita', '~490 leis da casa', 'a IA longe do dinheiro', '192 leituras e 13 ações da IA'].map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, x: 20 }} animate={{ opacity: step >= 1 ? 1 : 0, x: 0 }} transition={{ delay: 1 + i * 0.15 }}
              style={{ marginBottom: 10, padding: '8px 14px', borderRadius: 12, background: 'rgba(114,59,250,0.16)', border: `1.5px solid ${CORES.violeta}`, fontSize: 17, fontWeight: 700 }}>
              {t}
            </motion.div>
          ))}
        </Entra>
        <Entra show={step >= 2} style={{ position: 'absolute', left: 0, bottom: 0, width: 640 }}>
          <div className="cartao cartao-lima" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 22px' }}>
            <Database size={36} color={CORES.lima} strokeWidth={1.7} />
            <p className="frase" style={{ fontSize: 20 }}>A captura está <b>um terço preparada</b> e é o próximo passo, <b>logo depois das rotas na v2</b>. <span className="lima">Cada mês sem captura é um mês que o cérebro não vê.</span></p>
          </div>
        </Entra>
        <Entra show={step >= 3} style={{ position: 'absolute', right: 0, bottom: 0, display: 'flex', gap: 16 }}>
          <a className="botao ativo" href={LINK_DA_APP} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', fontSize: 20, padding: '14px 22px' }}>
            <ExternalLink size={20} /> Abrir a app nova
          </a>
          <a className="botao" href="?ver=cerebro" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', fontSize: 20, padding: '14px 22px', borderColor: CORES.violeta }}>
            <Brain size={20} /> Abrir o cérebro
          </a>
        </Entra>
      </div>
    </>
  );
}

const ponte: SlideDef = {
  id: 'ponte', titulo: 'A ponte para o cérebro', steps: 1, interativo: true,
  notas:
    'E é aqui que tudo se liga (o ecrã conta-se sozinho). Cada tarefa automática — lembretes, cobranças, faturação, aulas — está a ser reconstruída de forma a que o cérebro a consiga VER: de onde vem, o que faz, o que decide. E o cérebro não começa do zero: já temos o rasto de cada escrita, cerca de 490 leis da casa, a IA longe do dinheiro, 192 leituras e 13 ações da IA. Mas o cérebro precisa de memória: a captura dos dados está um terço preparada e é o próximo passo, logo depois de passarmos as rotas para a v2. Cada mês sem captura é um mês que ele não vê, por isso é a prioridade a seguir. É isto que alimenta o cérebro que vos mostrei na segunda apresentação. [Os dois botões: a app nova, e o mapa do cérebro.]',
  render: () => <Ponte />,
};

/* ───────────── O fecho ───────────── */
export const fechoSimples: SlideDef = {
  id: 'fecho', titulo: 'Fecho', steps: 1,
  notas: 'A obra continua. E é de todos.',
  render: () => (
    <div className="centro" style={{ gap: 26 }}>
      <motion.img src="/logos/Logotipo_BMS_Branco.svg" alt="BMS" style={{ height: 80 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} />
      <Entra delay={0.3}><p className="frase-grande" style={{ fontSize: 84 }}>A obra continua.</p></Entra>
      <Entra delay={0.6}><p className="frase-grande lima" style={{ fontSize: 46 }}>E é de todos.</p></Entra>
    </div>
  ),
};

/** Sem o fecho: o Obra.tsx põe o fecho certo no fim (o simples, ou o da pasta local). */
export const acto6: SlideDef[] = [caminho, ponte];
