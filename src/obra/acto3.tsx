// Ato 3 · O servidor. Não se vê, mas sente-se. (Fonte: Notion «Infraestrutura BMS — Digital Ocean».)

import { motion } from 'motion/react';
import { Brain, ConciergeBell, Container, Database, Laptop, Moon, Scissors, Sun, UserRound } from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { Contador } from '../components.tsx';
import { CORES } from './config.ts';
import { Cabeca, Entra, NoCentro } from './pecas.tsx';

/* ───────────── Não se vê, mas sente-se ───────────── */
function Batimento() {
  const d = 'M0 60 L240 60 L270 60 L290 20 L310 100 L330 10 L350 60 L380 60 L620 60 L650 60 L670 30 L690 90 L710 60 L1000 60';
  return (
    <svg width={1000} height={120} viewBox="0 0 1000 120">
      <path d={d} fill="none" stroke="#2a2a32" strokeWidth={6} />
      <motion.path d={d} fill="none" stroke={CORES.lima} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', times: [0, 0.85, 1] }} />
    </svg>
  );
}

const naoSeVe: SlideDef = {
  id: 'nao-se-ve', titulo: 'Não se vê, mas sente-se', steps: 1,
  notas:
    'Agora a parte que ninguém vê. O servidor. A maior parte deste trabalho não aparece em ecrã nenhum — mas é o que faz a app responder depressa e não falhar às 18h, quando os centros estão cheios.',
  render: () => (
    <div className="centro" style={{ gap: 40 }}>
      <Batimento />
      <Entra delay={0.4}><p className="frase-grande" style={{ fontSize: 76 }}>Não se vê,<br /><span className="lima">mas sente-se.</span></p></Entra>
    </div>
  ),
};

/* ───────────── O backup saiu da hora de ponta ───────────── */
function Relogio24({ step }: { step: number }) {
  const R = 190;
  const angulo = (h: number) => (h / 24) * 360 - 90;
  const ponto = (h: number, r = R) => {
    const a = (angulo(h) * Math.PI) / 180;
    return { x: 220 + Math.cos(a) * r, y: 220 + Math.sin(a) * r };
  };
  const arco = (h1: number, h2: number, r: number) => {
    const a = ponto(h1, r);
    const b = ponto(h2, r);
    return `M ${a.x} ${a.y} A ${r} ${r} 0 0 1 ${b.x} ${b.y}`;
  };
  const horaDoBackup = step >= 1 ? 25 : 17 + 20 / 60; // 01h00 do dia seguinte
  return (
    <svg width={430} height={430} viewBox="-30 -30 500 500" style={{ overflow: 'visible' }}>
      <circle cx={220} cy={220} r={R} fill="#202026" stroke="#34343e" strokeWidth={3} />
      <motion.path d={arco(18, 20, R - 14)} fill="none" strokeWidth={26} strokeLinecap="round"
        animate={{ stroke: step >= 1 ? CORES.lima : CORES.vermelho }} transition={{ duration: 0.8, delay: step >= 1 ? 1.2 : 0 }} />
      {[0, 6, 12, 18].map((h) => {
        const p = ponto(h, R + 26);
        return <text key={h} x={p.x} y={p.y + 8} textAnchor="middle" fontSize={22} fill={CORES.cinza} fontFamily="Poppins">{String(h).padStart(2, '0')}h</text>;
      })}
      <motion.g style={{ originX: '220px', originY: '220px' }} initial={false} animate={{ rotate: (horaDoBackup / 24) * 360 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
        <line x1={220} y1={220} x2={220} y2={70} stroke={CORES.branco} strokeWidth={6} strokeLinecap="round" />
        <circle cx={220} cy={58} r={20} fill={step >= 1 ? CORES.violeta : CORES.vermelho} />
      </motion.g>
      <circle cx={220} cy={220} r={10} fill={CORES.branco} />
    </svg>
  );
}

const backup: SlideDef = {
  id: 'backup', titulo: 'O backup saiu da hora de ponta', steps: 3,
  notas:
    'A cópia de segurança diária corria às 17h20 — mesmo antes das 18h, a hora mais cheia dos centros. A base de dados entrava na hora de ponta já cansada. (→) Passámos o backup para a 01h00. Às 18h, o sistema tem mais fôlego para os check-ins e os pagamentos. Mudou a 17/11 e o primeiro backup na hora nova já correu. (→) No centro, isto quer dizer: às 18h, quando a receção está cheia, os check-ins e os pagamentos têm mais fôlego.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="O servidor · 17/11">O backup saiu da hora de ponta</Cabeca>
      <div style={{ display: 'flex', alignItems: 'center', gap: 90, flex: 1, paddingBottom: 110 }}>
        <Relogio24 step={step} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, flex: 1 }}>
          <div className="cartao" style={{ display: 'flex', alignItems: 'center', gap: 22, borderColor: step === 0 ? CORES.vermelho : undefined }}>
            <Sun size={44} color={step === 0 ? CORES.vermelho : CORES.cinza} />
            <div><div style={{ fontSize: 40, fontWeight: 800, color: step === 0 ? CORES.vermelho : CORES.cinza, textDecoration: step >= 1 ? 'line-through' : 'none' }}>17h20</div>
              <p className="legenda">colado às 18h, a hora mais cheia</p></div>
          </div>
          <Entra show={step >= 1}>
            <div className="cartao cartao-lima" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <Moon size={44} color={CORES.lima} />
              <div><div style={{ fontSize: 40, fontWeight: 800, color: CORES.lima }}>01h00</div>
                <p className="legenda" style={{ color: CORES.branco }}>às 18h, mais fôlego para check-ins e pagamentos</p></div>
            </div>
          </Entra>
        </div>
      </div>
      <NoCentro show={step >= 2} Icone={ConciergeBell} quem="a receção" frase={<>às 18h, com a receção cheia, <span className="lima">check-ins e pagamentos com mais fôlego</span>.</>} />
    </>
  ),
};

/* ───────────── As noites dos índices ───────────── */
function Cilindro({ encolhido }: { encolhido: boolean }) {
  return (
    <motion.svg width={260} height={340} viewBox="0 0 260 340" animate={{ scaleY: encolhido ? 0.86 : 1 }} style={{ originY: 1 }} transition={{ duration: 1.2, delay: encolhido ? 0.8 : 0 }}>
      <path d="M20 50 v240 a110 34 0 0 0 220 0 v-240" fill="#2a2a32" stroke={CORES.lima} strokeWidth={4} />
      <ellipse cx={130} cy={50} rx={110} ry={34} fill="#34343e" stroke={CORES.lima} strokeWidth={4} />
      <path d="M20 130 a110 34 0 0 0 220 0 M20 210 a110 34 0 0 0 220 0" fill="none" stroke={CORES.lima} strokeWidth={3} opacity={0.5} />
    </motion.svg>
  );
}

function IndicesASair({ show }: { show: boolean }) {
  return (
    <div style={{ position: 'absolute', left: 130, top: 170, width: 0, height: 0 }}>
      {Array.from({ length: 74 }).map((_, i) => {
        const a = -Math.PI / 2 + ((i / 73) - 0.5) * 2.6;
        const d = 260 + (i % 7) * 30;
        return (
          <motion.span key={i}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={show ? { x: Math.cos(a) * d + 300, y: Math.sin(a) * d, opacity: [0, 1, 0] } : { x: 0, y: 0, opacity: 0 }}
            transition={{ duration: 1.6, delay: (i % 14) * 0.05 }}
            style={{ position: 'absolute', width: 26, height: 12, borderRadius: 4, background: i % 2 ? CORES.violetaClaro : CORES.cinza }} />
        );
      })}
    </div>
  );
}

/** Cada índice que saiu tinha um gémeo igual: um apaga-se e o outro acende-se, com os usos a subir. */
function Gemeo({ show }: { show: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
      <div style={{ display: 'flex', gap: 14 }}>
        <motion.div animate={show ? { opacity: [1, 1, 0.15], scale: [1, 1, 0.8] } : { opacity: 1, scale: 1 }} transition={{ duration: 2, times: [0, 0.4, 1], delay: 0.5 }}
          style={{ width: 70, height: 86, borderRadius: 12, border: `2px dashed ${CORES.vermelho}`, background: '#2a2a32', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, color: CORES.cinza }}>
          repetido
        </motion.div>
        <motion.div animate={show ? { borderColor: CORES.lima, boxShadow: '0 0 30px rgba(185,245,0,0.45)' } : {}} transition={{ delay: 1.6, duration: 0.6 }}
          style={{ width: 70, height: 86, borderRadius: 12, border: '2px solid #55555f', background: '#2a2a32', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, color: CORES.lima }}>
          gémeo
        </motion.div>
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: CORES.cinza }}>usos do gémeo, em minutos</div>
        <div style={{ fontSize: 34, fontWeight: 800 }}>
          <span className="cinza">641 mil</span>{' '}
          <motion.b className="lima" style={{ display: 'inline-block' }} initial={{ opacity: 0, scale: 0.6 }} animate={show ? { opacity: 1, scale: [0.6, 1.15, 1] } : { opacity: 0 }} transition={{ delay: 1.9, duration: 0.6 }}>→ 1,4 milhões</motion.b>
        </div>
        <div className="legenda" style={{ fontSize: 15 }}>cada índice que saiu tinha um igual, que a base passou a usar logo</div>
      </div>
    </div>
  );
}

const noites: SlideDef = {
  id: 'noites', titulo: 'As noites dos índices', steps: 4,
  notas:
    'A base de dados tinha índices repetidos: trabalho a dobrar em cada gravação — uma inscrição, um pagamento, um check-in. (→) Em duas noites limpámos tudo: 74 índices apagados, 42 na primeira e 32 na segunda, cerca de 2 GB libertados. Com a base a funcionar, sem paragem e sem um único erro. (→) Porque é que foi seguro: cada índice que saiu tinha um gémeo igual, que a base passou a usar logo. O dos módulos por empresa passou de 641 mil para 1,4 milhões de usos em minutos. E ficou uma volta atrás guardada — a definição de cada índice — e o registo no Notion. (→) No centro, isto quer dizer: cada inscrição, pagamento ou check-in dá menos trabalho à base, e as cópias de segurança ficam mais leves.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="O servidor · de madrugada">As noites dos índices</Cabeca>
      <div style={{ display: 'flex', alignItems: 'center', gap: 70, flex: 1, paddingBottom: 110, position: 'relative' }}>
        <div style={{ position: 'relative', width: 260, height: 340 }}>
          <Cilindro encolhido={step >= 1} />
          <IndicesASair show={step >= 1} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, flex: 1 }}>
          <Entra show={step >= 1} delay={0.9}><div className="cartao cartao-lima"><div className="numero-enorme lima"><Contador ate={74} show={step >= 1} /></div><p className="legenda" style={{ color: CORES.branco, marginTop: 10 }}>índices repetidos apagados</p></div></Entra>
          <Entra show={step >= 1} delay={1.05}><div className="cartao cartao-lima"><div className="numero-enorme lima">~2 GB</div><p className="legenda" style={{ color: CORES.branco, marginTop: 10 }}>libertados</p></div></Entra>
          <Entra show={step >= 1} delay={1.2}><div className="cartao cartao-lima"><div className="numero-enorme lima">0</div><p className="legenda" style={{ color: CORES.branco, marginTop: 10 }}>paragens</p></div></Entra>
          <Entra show={step >= 1} delay={1.5} style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
            <span className="chip" style={{ borderColor: CORES.lima, fontSize: 17 }}><Moon size={16} style={{ verticalAlign: -2 }} /> Noite 1 · <b className="lima">42</b></span>
            <span className="chip" style={{ borderColor: CORES.lima, fontSize: 17 }}><Moon size={16} style={{ verticalAlign: -2 }} /> Noite 2 · <b className="lima">32</b></span>
            <span className="chip" style={{ fontSize: 17 }}>com a base a funcionar</span>
          </Entra>
          <Entra show={step >= 2} style={{ gridColumn: '1 / -1' }}>
            <div className="cartao cartao-lima"><Gemeo show={step >= 2} /></div>
          </Entra>
        </div>
      </div>
      <NoCentro show={step >= 3} Icone={UserRound} quem="toda a gente" frase={<>cada inscrição, pagamento ou check-in <span className="lima">dá menos trabalho à base</span>, e as cópias de segurança ficam mais leves.</>} />
    </>
  ),
};

/* ───────────── Antes e depois, medido ───────────── */
const medidas = [
  { o: 'A dívida na lista de clientes', antes: '2,9 s', depois: '1,0 s', fim: 1.0 / 2.9 },
  { o: 'As cobranças SEPA «em voo»', antes: '100 %', depois: 'metade do tempo', fim: 0.5 },
  { o: 'Uma verificação SEPA', antes: '1×', depois: '4× mais rápida', fim: 0.25 },
  { o: 'Duas consultas repetidas milhões de vezes', antes: 'a pesar', depois: 'deixaram de pesar', fim: 0.03 },
];

const antesDepois: SlideDef = {
  id: 'antes-depois', titulo: 'Antes e depois, medido', steps: medidas.length + 3,
  notas:
    'Cada melhoria tem um antes e um depois. (→) A dívida na lista de clientes: de 2,9 segundos para 1. (→) As cobranças SEPA em voo: metade do tempo. (→) Uma verificação SEPA: quatro vezes mais rápida. (→) E duas consultas que se repetiam milhões de vezes deixaram de pesar. A base faz menos trabalho pelo mesmo resultado. (→) No centro, isto quer dizer: a receção vê a dívida de um cliente num segundo, e as cobranças por débito direto no início do mês já não arrastam o resto. (→) E há mais do que velocidade: o Markov e o cérebro vão aprender com esta base real. Índices a dobrar, registos repetidos e testes a correr na base de produção são ruído nos dados — e dados com ruído dão previsões erradas. Uma base limpa e leve é uma base em que o cérebro pode confiar.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="O servidor · 18/11">Antes e depois, medido</Cabeca>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        {medidas.map((m, i) => (
          <Entra key={m.o} show={step > i}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr 340px', alignItems: 'center', gap: 28 }}>
              <span style={{ fontSize: 24, fontWeight: 600 }}>{m.o}</span>
              <div style={{ position: 'relative', height: 40, borderRadius: 10, background: '#2a2a32', overflow: 'hidden' }}>
                <motion.div initial={{ width: '100%' }} animate={{ width: step > i ? `${Math.max(m.fim * 100, 2)}%` : '100%' }}
                  transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', inset: 0, right: 'auto', borderRadius: 10, background: `linear-gradient(90deg, ${CORES.lima}, ${CORES.violeta})` }} />
              </div>
              <div style={{ fontSize: 22 }}><span className="cinza" style={{ textDecoration: 'line-through' }}>{m.antes}</span> <b className="lima">→ {m.depois}</b></div>
            </div>
          </Entra>
        ))}
      </div>
      <Entra show={step > medidas.length + 1} style={{ marginTop: 26 }}>
        <div className="cartao cartao-violeta" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 22px' }}>
          <Brain size={42} color={CORES.violetaClaro} strokeWidth={1.6} style={{ flex: 'none' }} />
          <p className="frase" style={{ fontSize: 21 }}>E há mais do que velocidade: <b>o Markov vai aprender com esta base real</b>. Índices a dobrar, registos repetidos e testes na base de produção são ruído nos dados. <span className="lima">Uma base limpa é uma base em que o cérebro pode confiar.</span></p>
        </div>
      </Entra>
      <NoCentro show={step === medidas.length + 1} Icone={ConciergeBell} quem="a receção e o gestor" frase={<>a dívida de um cliente <span className="lima">num segundo</span>, e o início do mês sem arrastar o resto.</>} />
    </>
  ),
};

/* ───────────── O .env que aponta para a produção ───────────── */
const producao: SlideDef = {
  id: 'env', titulo: 'O .env que aponta para a produção', steps: 3,
  notas:
    'Uma coisa que temos de mudar juntos: hoje, o ficheiro de configuração dos nossos portáteis (o .env) aponta para a base de dados de PRODUÇÃO. Um teste, um engano, e mexe-se nos dados de um centro a sério. (→) Vamos cortar esse cabo. (→) Cada um passa a trabalhar numa cópia local, em Docker, com o seu próprio acesso. Nenhum teste nem engano toca nos dados de um centro. [Depois deste slide, se a sala precisar: tecla R.]',
  render: ({ step }) => (
    <>
      <Cabeca kicker="Segurança · o que vamos mudar juntos">O <span className="mono lima">.env</span> que aponta para a produção</Cabeca>
      <div style={{ position: 'relative', flex: 1 }}>
        <div style={{ position: 'absolute', left: 60, top: 130, textAlign: 'center' }}>
          <Laptop size={150} strokeWidth={1.3} color={CORES.branco} />
          <p className="legenda" style={{ marginTop: 6 }}>o portátil de cada um</p>
        </div>
        <div style={{ position: 'absolute', right: 60, top: 110, textAlign: 'center' }}>
          <motion.div animate={step === 0 ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 1.2, repeat: Infinity }}>
            <Database size={170} strokeWidth={1.3} color={CORES.vermelho} />
          </motion.div>
          <p style={{ marginTop: 6, color: CORES.vermelho, fontWeight: 700, fontSize: 20, lineHeight: 1.3 }}>a base de PRODUÇÃO<br /><span style={{ fontWeight: 500 }}>os centros a sério</span></p>
        </div>
        <svg width={1408} height={420} viewBox="0 0 1408 420" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          <motion.path d="M 230 210 C 500 120, 900 300, 1180 200" fill="none" stroke={CORES.vermelho} strokeWidth={6} strokeDasharray="1 0"
            animate={{ opacity: step >= 1 ? 0 : 1, pathLength: step >= 1 ? 0.48 : 1 }} transition={{ duration: 0.6 }} />
          {step === 0 && [0, 1, 2, 3].map((i) => (
            <circle key={i} r={8} fill={CORES.vermelho}>
              <animateMotion dur="2s" begin={`-${i * 0.5}s`} repeatCount="indefinite" path="M 230 210 C 500 120, 900 300, 1180 200" />
            </circle>
          ))}
          {step >= 2 && (
            <motion.path d="M 230 260 C 300 330, 360 360, 430 350" fill="none" stroke={CORES.lima} strokeWidth={6} strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
          )}
        </svg>
        {step >= 1 && (
          <motion.div initial={{ x: -120, opacity: 0, rotate: 0 }} animate={{ x: 0, opacity: 1, rotate: [0, -30, 0, -30, 0] }} transition={{ duration: 0.9 }}
            style={{ position: 'absolute', left: 660, top: 150 }}>
            <Scissors size={96} color={CORES.lima} strokeWidth={1.6} />
          </motion.div>
        )}
        <Entra show={step >= 2} style={{ position: 'absolute', left: 440, top: 300, display: 'flex', alignItems: 'center', gap: 18 }}>
          <Container size={84} strokeWidth={1.4} color={CORES.lima} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: CORES.lima }}>uma cópia local, em Docker</div>
            <p className="legenda">cada um com o seu acesso</p>
          </div>
        </Entra>
        <Entra show={step >= 2} delay={0.4} style={{ position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center' }}>
          <p className="frase-grande" style={{ fontSize: 38 }}>Nenhum teste nem engano mexe nos dados de um centro.</p>
        </Entra>
      </div>
    </>
  ),
};

export const acto3: SlideDef[] = [naoSeVe, backup, noites, antesDepois, producao];
