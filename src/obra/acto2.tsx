// Ato 2 · Gestão à vista: em que etapa está o GRUPO (não módulo a módulo), e o modelo de Markov — para que serve.

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Hammer, LayoutGrid, Map, Power } from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { CORES } from './config.ts';
import { Cabeca, Entra, useSequencia } from './pecas.tsx';

/* ───────────── As cinco etapas da obra ───────────── */
// A meio da obra: duas etapas feitas, a reconstrução a meio (é onde estamos), a ligação já começou (a Agenda) e
// a aprendizagem ainda por fazer. Bate certo com o ecrã seguinte (12% das rotas, com honestidade).
type EstadoDaEtapa = 'feito' | 'meio' | 'comecou' | 'por';
const etapas: { nome: string; Icone: typeof Map; frase: string; estado: EstadoDaEtapa; nota?: string }[] = [
  { nome: 'Conhecer', Icone: Map, frase: 'o mapa do servidor e da arquitetura', estado: 'feito' },
  { nome: 'Organizar', Icone: LayoutGrid, frase: 'as regras, as salas, os muros', estado: 'feito' },
  { nome: 'Reconstruir', Icone: Hammer, frase: 'a v2, área a área, com prova', estado: 'meio' },
  { nome: 'Ligar', Icone: Power, frase: 'os interruptores em produção, centro a centro', estado: 'comecou', nota: 'já começou: Agenda, Financeiro e Relatórios ligados' },
  { nome: 'Aprender', Icone: Brain, frase: 'o cérebro sugere o próximo passo', estado: 'por' },
];
const PREENCHIMENTO: Record<EstadoDaEtapa, number> = { feito: 100, meio: 50, comecou: 22, por: 0 };

const X = [130, 445, 760, 1075, 1390];
const Y = 300;

/** As etapas contam-se sozinhas: cada uma entra a seu tempo, sem setas. */
function Etapas() {
  const step = useSequencia([0, 500, 1300, 2300, 3500, 4700]);

    // Passo 1 e 2: as feitas · 3: a reconstrução a meio · 4: a ligação começada · 5: o destino.
    const visivel = (i: number) => step >= i + 1;
    const fimLima = step === 0 ? X[0] : step === 1 ? X[0] : step === 2 ? X[1] : X[2];
    return (
      <>
        <Cabeca kicker="Gestão à vista">Em que etapa está o grupo</Cabeca>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg width={1408} height={460} viewBox="0 0 1408 460" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={X[0]} y1={Y} x2={X[4]} y2={Y} stroke="#34343e" strokeWidth={10} strokeLinecap="round" />
            <motion.line x1={X[0]} y1={Y} x2={X[0]} y2={Y} stroke={CORES.lima} strokeWidth={10} strokeLinecap="round"
              animate={{ x2: fimLima }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
            {step >= 4 && (
              <motion.line x1={X[2]} y1={Y} x2={X[2]} y2={Y} stroke={CORES.lima} strokeOpacity={0.5} strokeWidth={10} strokeLinecap="round" strokeDasharray="14 12"
                animate={{ x2: X[2] + (X[3] - X[2]) * 0.55 }} transition={{ duration: 0.9 }} />
            )}
            {step >= 5 && (
              <motion.line x1={X[3]} y1={Y} x2={X[4]} y2={Y} stroke={CORES.violeta} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 22"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
            )}
          </svg>
          {etapas.map((e, i) => {
            const mostra = visivel(i);
            const p = mostra ? PREENCHIMENTO[e.estado] : 0;
            const cor = !mostra ? '#55555f' : e.estado === 'por' ? CORES.violetaClaro : CORES.lima;
            const aqui = e.estado === 'meio' && mostra;
            return (
              <div key={e.nome} style={{ position: 'absolute', left: X[i] - 120, top: Y - 160, width: 240, textAlign: 'center' }}>
                {aqui && (
                  <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    style={{ position: 'absolute', left: 0, right: 0, top: -58, fontWeight: 800, fontSize: 20, color: CORES.lima, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    estamos aqui ▾
                  </motion.div>
                )}
                <motion.div
                  animate={{ scale: mostra ? 1 : 0.85, borderColor: cor }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  style={{ position: 'relative', overflow: 'hidden', margin: '0 auto', width: 118, height: 118, borderRadius: 32, border: '3px solid', display: 'grid', placeItems: 'center', background: '#202026',
                    boxShadow: aqui ? '0 0 0 10px rgba(185,245,0,0.12), 0 0 46px rgba(185,245,0,0.45)' : undefined }}
                >
                  {/* o enchimento: cheio (feito), a meio (onde estamos), uma fatia (começou) */}
                  <motion.div initial={false} animate={{ height: `${p}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: e.estado === 'feito' ? 'rgba(185,245,0,0.22)' : 'rgba(185,245,0,0.32)' }} />
                  <e.Icone size={54} strokeWidth={1.6} color={cor} style={{ position: 'relative' }} />
                </motion.div>
                <div style={{ height: 82 }} />
                <motion.div animate={{ opacity: mostra ? 1 : 0.35 }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: cor }}>
                    {e.nome}{mostra && e.estado === 'feito' && <span style={{ fontSize: 22 }}> ✓</span>}
                  </div>
                  <p className="legenda" style={{ marginTop: 6, fontSize: 18 }}>{e.frase}</p>
                  {mostra && e.nota && <p style={{ margin: '8px 0 0', fontSize: 17, fontWeight: 700, color: CORES.lima }}>{e.nota}</p>}
                  {mostra && e.estado === 'meio' && <p style={{ margin: '8px 0 0', fontSize: 17, fontWeight: 700, color: CORES.lima }}>a meio da obra</p>}
                  {mostra && e.estado === 'por' && <p style={{ margin: '8px 0 0', fontSize: 17, fontWeight: 700, color: CORES.violetaClaro }}>o destino</p>}
                </motion.div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

const ondeEstamos: SlideDef = {
  id: 'etapas', titulo: 'Gestão à vista: em que etapa estamos', steps: 1,
  notas:
    'Isto é a gestão à vista: não é área a área, é o grupo todo. (O ecrã conta-se sozinho.) Primeiro, conhecer: pela primeira vez temos o mapa do servidor e da arquitetura. Feito. Depois, organizar: as regras, as salas, os muros. Feito. Reconstruir: a v2, área a área, e nada avança sem provar que dá o mesmo resultado. Estamos aqui, a meio da obra. E ligar já começou ao mesmo tempo: a Agenda, o Financeiro e os Relatórios estão ligados em produção, com volta atrás em segundos. E o destino, ainda por fazer: aprender. O cérebro.',
  render: () => <Etapas />,
};

/* ───────────── Onde estamos, com honestidade (ponto de situação de 23/11) ───────────── */
// Em vez de percentagens por área (eram de 20/11 e já não batem), o estado de cada uma: ligada em produção, pronta
// na v2 (desligada até a app a usar), em curso ou por começar.
const GRUPOS: { titulo: string; cor: string; itens: [string, string][] }[] = [
  { titulo: 'Ligado em produção', cor: CORES.lima, itens: [['Agenda', '72% das rotas'], ['Financeiro', 'o dia a dia: caixa, gastos, pagamentos'], ['Relatórios', 'o motor novo, com interruptor']] },
  { titulo: 'Pronto na v2', cor: CORES.violetaClaro, itens: [['Clientes', 'ficha e lista, 4× mais rápida'], ['Planos', '791 planos comparados um a um'], ['Equipa', 'férias e ausências, com o fecho do ano'], ['CRM', 'lista, quadro e 22 escritas das leads'], ['Biblioteca de conteúdos', 'completa']] },
  { titulo: 'Em curso', cor: '#ffd24a', itens: [['Kids', ''], ['Configurações', ''], ['Tarefas automáticas', '21 de 150']] },
  { titulo: 'Por começar', cor: CORES.cinza, itens: [['BMS HQ', ''], ['Treino e dieta', ''], ['Notificações e chat', ''], ['IA e suporte', ''], ['Loja e stock', ''], ['Acessos', ''], ['Comissões', '']] },
];

const honesto: SlideDef = {
  id: 'honesto', titulo: 'Onde estamos, com honestidade', steps: 1,
  notas:
    'Com honestidade: no total, 12% das rotas do sistema já têm par na nova base — 362 de 2 965. Parece pouco, e o número até subestima: a v2 junta várias rotas numa só (o dinheiro do Início passou de 5 para 1). Ligados em produção, cada um com interruptor: a Agenda, que já vai em 72%, o Financeiro do dia a dia e os Relatórios. Prontos na v2, à espera de entrar na app: Clientes, Planos, Equipa e CRM — cada um comparado com o sistema de hoje. Em curso: Kids, Configurações e as tarefas automáticas, 21 de 150. E há áreas por começar — e é bom dizê-lo. O sistema de hoje não mudou em nada: a v2 corre ao lado, com volta atrás.',
  render: () => (
    <>
      <Cabeca kicker="Gestão à vista · ponto de situação">Onde estamos, com honestidade</Cabeca>
      <div style={{ display: 'flex', gap: 40, flex: 1, paddingBottom: 20 }}>
        <Entra style={{ width: 300 }}>
          <div className="cartao" style={{ textAlign: 'center', padding: '28px 22px' }}>
            <div className="numero-enorme lima" style={{ fontSize: 104 }}>12%</div>
            <p className="legenda" style={{ fontSize: 18, marginTop: 8 }}>das rotas do sistema já com par na nova base<br /><b style={{ color: CORES.branco }}>362 de 2 965</b></p>
          </div>
          <Entra delay={0.4} style={{ marginTop: 16 }}>
            <div className="cartao cartao-lima" style={{ padding: '16px 18px' }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>O sistema de hoje não mudou: a v2 corre <b className="lima">ao lado</b>, com volta atrás em segundos.</p>
            </div>
          </Entra>
        </Entra>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.15fr 1.25fr 0.8fr 0.8fr', gap: 16 }}>
          {GRUPOS.map((g, gi) => (
            <Entra key={g.titulo} delay={0.2 + gi * 0.25}>
              <div style={{ height: '100%', borderRadius: 18, border: `2px solid ${g.cor}`, background: `${g.cor}10`, padding: '16px 14px' }}>
                <div className="rotulo" style={{ color: g.cor, fontSize: 14, marginBottom: 12 }}>{g.titulo}</div>
                {g.itens.map(([nome, nota], i) => (
                  <motion.div key={nome} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + gi * 0.25 + i * 0.08 }}
                    style={{ marginBottom: 10, padding: '8px 10px', borderRadius: 10, background: '#1c1c22' }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{nome}</div>
                    {nota && <div className="legenda" style={{ fontSize: 14 }}>{nota}</div>}
                  </motion.div>
                ))}
              </div>
            </Entra>
          ))}
        </div>
      </div>
    </>
  ),
};

/* ───────────── O modelo de Markov: o próximo passo depende de onde estás ───────────── */
type Estado = 'ativo' | 'risco' | 'saiu';
const posicao: Record<Estado, { x: number; y: number; nome: string; cor: string }> = {
  ativo: { x: 300, y: 330, nome: 'Ativo', cor: CORES.lima },
  risco: { x: 760, y: 150, nome: 'Em risco', cor: '#ffd24a' },
  saiu: { x: 1180, y: 330, nome: 'Saiu', cor: CORES.vermelho },
};
const emoji: Record<Estado, string> = { ativo: '🙂', risco: '😟', saiu: '🚪' };
/** As probabilidades de cada passo (de → para). São de exemplo: o cérebro aprende-as com os dados. */
const transicoes: { de: Estado; para: Estado; p: number }[] = [
  { de: 'ativo', para: 'risco', p: 0.15 },
  { de: 'risco', para: 'ativo', p: 0.55 },
  { de: 'risco', para: 'saiu', p: 0.25 },
];

function proximo(estado: Estado, sorte: number): Estado {
  if (estado === 'ativo') return sorte < 0.15 ? 'risco' : 'ativo';
  if (estado === 'risco') return sorte < 0.55 ? 'ativo' : sorte < 0.8 ? 'saiu' : 'risco';
  return sorte < 0.12 ? 'ativo' : 'saiu'; // quem saiu, às vezes volta
}

function Fichas({ ativo }: { ativo: boolean }) {
  const [fichas, setFichas] = useState<Estado[]>(() => Array.from({ length: 14 }, (_, i) => (i < 10 ? 'ativo' : 'risco')));
  useEffect(() => {
    if (!ativo) return;
    const t = setInterval(() => setFichas((f) => f.map((e) => proximo(e, Math.random()))), 1300);
    return () => clearInterval(t);
  }, [ativo]);
  return (
    <>
      {fichas.map((e, i) => {
        const p = posicao[e];
        const angulo = (i / fichas.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            animate={{ x: p.x + Math.cos(angulo) * 104 - 9, y: p.y + Math.sin(angulo) * 104 - 9 }}
            transition={{ type: 'spring', stiffness: 60, damping: 12, delay: (i % 5) * 0.05 }}
            style={{ position: 'absolute', left: 0, top: 0, width: 18, height: 18, borderRadius: '50%', background: CORES.branco, boxShadow: '0 0 12px rgba(255,255,255,0.6)' }}
          />
        );
      })}
    </>
  );
}

function Seta({ de, para, p, show }: { de: Estado; para: Estado; p: number; show: boolean }) {
  const a = posicao[de];
  const b = posicao[para];
  const curva = de === 'risco' && para === 'ativo' ? 70 : -70;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 + curva;
  const d = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  return (
    <g>
      <motion.path d={d} fill="none" stroke={CORES.lima} strokeWidth={4 + p * 26} strokeLinecap="round" opacity={0.45}
        initial={{ pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }} transition={{ duration: 0.9 }} />
      <motion.text x={mx} y={my + (curva > 0 ? 34 : -14)} textAnchor="middle" fontSize={26} fontWeight={800} fill={CORES.branco} fontFamily="Poppins"
        initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ delay: 0.6 }}>
        {Math.round(p * 100)}%
      </motion.text>
    </g>
  );
}

/** O Markov conta-se sozinho: os estados entram, as setas desenham-se e os clientes começam a mexer-se. */
function MarkovVivo({ step }: { step: number }) {
  const fase = useSequencia([0, 700, 1700]);
  return (
    <>
      <svg width={1408} height={480} viewBox="0 0 1408 480" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {transicoes.map((t) => <Seta key={`${t.de}-${t.para}`} {...t} show={fase >= 1} />)}
      </svg>
      {(Object.keys(posicao) as Estado[]).map((k, i) => {
        const e = posicao[k];
        return (
          <motion.div key={k}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: i * 0.12 }}
            style={{ position: 'absolute', left: e.x - 80, top: e.y - 80, width: 160, height: 160, borderRadius: '50%', border: `4px solid ${e.cor}`, background: `linear-gradient(${e.cor}24, ${e.cor}24), #1c1c22`, display: 'grid', placeItems: 'center', alignContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 38, lineHeight: 1 }}>{emoji[k]}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: e.cor, marginTop: 6 }}>{e.nome}</div>
          </motion.div>
        );
      })}
      {fase >= 2 && <Fichas ativo />}
      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5 }}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center' }}>
          <p className="frase" style={{ fontSize: 28, maxWidth: 1300, margin: '0 auto' }}>
            Cada ponto é um cliente. De quem está em risco, <b className="lima">55 em 100 voltam</b> e 25 saem. Para adivinhar o que vem a seguir, <b className="lima">basta saber onde ele está agora</b>.
          </p>
        </motion.div>
      )}
    </>
  );
}

const markov: SlideDef = {
  id: 'markov', titulo: 'O modelo de Markov', steps: 3,
  notas:
    'Vou usar uma palavra que vão ouvir muitas vezes: Markov. Numa frase: para prever o próximo passo, basta saber onde estás agora. Um cliente de um centro está sempre num destes estados: ativo, em risco (deixou de vir, está com dívida) ou já saiu. As setas dizem o que costuma acontecer a seguir: de cada 100 clientes em risco, 55 voltam e 25 saem. Os números são de exemplo — o cérebro vai aprendê-los com os nossos dados. Cada ponto é um cliente a mexer-se entre estados. (→) Um caso: a Joana não vem há 12 dias e tem a mensalidade por pagar. Está em risco. O cérebro avisa a receção hoje, não daqui a um mês, quando ela já saiu. E pode juntar o que vem de fora: num dia de chuva, quantos vêm treinar? Serve para tudo o que tem estados: uma lead no CRM, uma dívida, as nossas tarefas automáticas. (→) A verdade: a captura dos dados de que o cérebro precisa está um terço preparada, mas ainda não captura nada — falta a peça dos eventos. É o próximo passo, logo depois de passarmos as rotas para a v2. E cada mês sem captura é um mês que o cérebro não vê.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="O modelo de Markov · uma ideia só, para todos">O próximo passo depende de onde estás</Cabeca>
      <div style={{ position: 'relative', flex: 1 }}>
        <MarkovVivo step={step} />
        <Entra show={step >= 1} style={{ position: 'absolute', left: 0, right: 0, bottom: 4, display: 'flex', gap: 22 }}>
          <div className="cartao cartao-violeta" style={{ flex: 1.3, display: 'flex', alignItems: 'center', gap: 20 }}>
            <Brain size={46} color={CORES.violetaClaro} strokeWidth={1.6} />
            <div>
              <p className="frase" style={{ fontSize: 21 }}>A Joana não vem há 12 dias e tem a mensalidade por pagar → <b>está em risco</b> → o cérebro avisa a receção <b className="lima">hoje, não daqui a um mês</b>.</p>
              <p className="legenda" style={{ fontSize: 16, marginTop: 6 }}>🌧️ E junta o que vem de fora: num dia de chuva, quantos vêm treinar?</p>
            </div>
          </div>
          <motion.div className="cartao" initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ fontSize: 40, flex: 'none' }}>⏳</span>
            <p className="frase" style={{ fontSize: 19 }}>A captura está <b>um terço preparada, mas ainda não captura</b>: falta uma peça, e é o próximo passo, <b>logo depois das rotas na v2</b>. <span className="lima">Cada mês sem captura é um mês que o cérebro não vê.</span></p>
          </motion.div>
        </Entra>
      </div>
    </>
  ),
};

export const acto2: SlideDef[] = [ondeEstamos, honesto, markov];
