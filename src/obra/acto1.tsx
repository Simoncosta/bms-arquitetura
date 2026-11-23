// Ato 1 · O que prometemos. A primeira apresentação volta ao ecrã e cada promessa leva o seu carimbo.

import { motion } from 'motion/react';
import { Brain, BrickWall, Database, DoorOpen, Flame, Layers, MoonStar, Smartphone } from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { Contador } from '../components.tsx';
import { CORES } from './config.ts';
import { Cabeca, Entra, Selo } from './pecas.tsx';
import { comoTrabalhamos } from './metodo.tsx';
import { mudou } from './mudou.tsx';

/* ───────────── A capa: os blocos a empilhar-se até ser uma obra ───────────── */
function Blocos() {
  const colunas = 6;
  const linhas = 4;
  const lado = 64;
  const vao = 8;
  const blocos = [] as { c: number; l: number; i: number }[];
  for (let l = 0; l < linhas; l++) for (let c = 0; c < colunas; c++) if (!(l === linhas - 1 && (c === 0 || c === colunas - 1))) blocos.push({ c, l, i: blocos.length });
  const largura = colunas * (lado + vao);
  const altura = linhas * (lado + vao);
  return (
    <svg width={largura} height={altura + 40} viewBox={`0 -40 ${largura} ${altura + 40}`} style={{ overflow: 'visible' }}>
      {blocos.map(({ c, l, i }) => {
        const x = c * (lado + vao);
        const y = altura - (l + 1) * (lado + vao);
        const cor = (c + l) % 3 === 0 ? CORES.violeta : (c + l) % 3 === 1 ? CORES.lima : '#34343e';
        return (
          <motion.rect
            key={i} x={x} y={y} width={lado} height={lado} rx={10} fill={cor}
            initial={{ translateY: -420, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 15, delay: 0.15 + i * 0.07 }}
          />
        );
      })}
      {/* a grua por cima, a pousar o último bloco */}
      <motion.g initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}>
        <line x1={largura - 40} y1={-36} x2={largura - 40} y2={altura - 4 * (lado + vao) + 10} stroke={CORES.cinza} strokeWidth={3} strokeDasharray="6 6" />
        <motion.rect
          x={largura - 72} y={-30} width={lado} height={lado * 0.5} rx={8} fill={CORES.lima}
          animate={{ y: [-30, -18, -30] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
    </svg>
  );
}

const capa: SlideDef = {
  id: 'capa', titulo: 'Capa — A Obra', steps: 1,
  notas:
    'Há três semanas mostrei-vos uma proposta de arquitetura. Hoje não venho propor: venho mostrar onde está a obra. O que foi possível, o que está a ser possível e para onde vamos — para todos: quem programa, quem vende, quem dá suporte, quem gere.',
  render: () => (
    <div className="centro" style={{ paddingBottom: 20 }}>
      <Blocos />
      <Entra delay={2}><h1 className="titulo" style={{ fontSize: 92, margin: '34px 0 10px' }}>A <span className="lima">Obra</span></h1></Entra>
      <Entra delay={2.25}><p className="rotulo">Onde estamos e para onde vamos · novembro de 2026</p></Entra>
    </div>
  ),
};

/* ───────────── Porquê: o dia em que a base apertou, e as três razões ───────────── */
const razoes = [
  { Icone: Flame, titulo: 'A base apertava', frase: 'e quem sentia era o centro: fila no torniquete, erro no balcão.' },
  { Icone: Layers, titulo: 'Mudar partia outras coisas', frase: 'bugs que voltavam, mais de 30 deploys numa quarta-feira.' },
  { Icone: Brain, titulo: 'Queremos um produto que pensa', frase: 'e um cérebro só aprende com dados limpos: uma verdade por conceito.' },
];

const porque: SlideDef = {
  id: 'porque', titulo: 'Porque fizemos isto', steps: 3,
  notas:
    'Antes dos números, o porquê. (Registos a aparecer.) A 2 de novembro, às 17h23, a API começou a dar erros — a base de dados a 100%. A 4 de novembro, às 19h, a base ficou tão carregada que teve de ser reiniciada à mão. Para nós é uma linha num registo; para o centro é a fila no torniquete e o erro no balcão à hora de ponta. (→) Foram três as razões. A base apertava. Mudar uma coisa partia outras — bugs que voltavam. E queremos um produto que pensa, e um cérebro só aprende com dados limpos. (→) Por isso não fizemos «uma app nova bonita»: trocámos os alicerces, sem fechar a loja.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="Antes dos números">Porque fizemos isto</Cabeca>
      <div style={{ display: 'flex', gap: 40, flex: 1, paddingBottom: 30 }}>
        <Entra style={{ width: 520 }}>
          <div className="registo" style={{ fontSize: 19 }}>
            {[
              ['02/11 17:23', 'API em erro 500 · Postgres a 100% de CPU'],
              ['04/11 19h', 'base sobrecarregada'],
              ['04/11 19h', 'base reiniciada à mão'],
            ].map(([h, t], i) => (
              <motion.div key={`${h}-${t}`} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.45 }}>
                <span className="hora">{h}</span>{t}
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.3, 1] }} transition={{ delay: 2.4, duration: 1.2 }}
              style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Poppins', color: CORES.branco, fontSize: 21 }}>
              No centro: <b style={{ color: CORES.vermelho }}>fila no torniquete, erro no balcão.</b>
            </motion.div>
          </div>
        </Entra>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {razoes.map((r, i) => (
            <Entra key={r.titulo} show={step >= 1} delay={i * 0.18} x={40} y={0}>
              <div className="cartao" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px' }}>
                <r.Icone size={40} color={i === 2 ? CORES.violetaClaro : CORES.lima} strokeWidth={1.7} />
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{r.titulo}</div>
                  <p className="legenda" style={{ fontSize: 19, marginTop: 4 }}>{r.frase}</p>
                </div>
              </div>
            </Entra>
          ))}
          <Entra show={step >= 2} style={{ marginTop: 8 }}>
            <p className="frase" style={{ fontSize: 28 }}>Não fizemos «uma app bonita»: <b className="lima">trocámos os alicerces, sem fechar a loja.</b></p>
          </Entra>
        </div>
      </div>
    </>
  ),
};

/* ───────────── As promessas da primeira apresentação, carimbadas uma a uma ───────────── */
type Promessa = { Icone: typeof Layers; frase: string; detalhe: string; selo: 'feito' | 'curso' | 'seguir' | 'virou'; texto: string };

const promessas: Promessa[] = [
  { Icone: DoorOpen, frase: 'Cada área na sua sala, com porta própria', detalhe: 'em migração: as rotas estão todas a passar para a v2, pela porta', selo: 'feito', texto: 'feito' },
  { Icone: BrickWall, frase: 'Muros, não castelos de areia', detalhe: 'uma guarda corre sozinha e não deixa as salas misturarem-se', selo: 'feito', texto: 'feito' },
  { Icone: Database, frase: 'Nada se reescreve, a mesma base de dados', detalhe: 'a v2 nasce ao lado da v1, área a área', selo: 'feito', texto: 'feito' },
  { Icone: MoonStar, frase: 'O pesado vai para a fila, de noite', detalhe: 'as tarefas automáticas já correm na v2 — e vão melhorar com o Markov', selo: 'feito', texto: 'feito' },
  { Icone: Layers, frase: 'Uma cópia só para os relatórios', detalhe: 'primeiro medir o início do mês (1/12 e 7/12) e aliviar as consultas pesadas — é mais barato', selo: 'seguir', texto: 'a seguir' },
  { Icone: Smartphone, frase: 'A app em pausa até março', detalhe: 'não esperámos', selo: 'virou', texto: 'mudámos' },
];

const prometemos: SlideDef = {
  id: 'prometemos', titulo: 'O que prometemos', steps: promessas.length + 1,
  notas:
    'Na primeira apresentação prometemos seis coisas. Vamos carimbá-las uma a uma (→ a cada carimbo). As salas: sim — estamos a passar as rotas todas para a v2, pela porta, como combinámos. Os muros: a guarda corre sozinha. Nada se reescreve: a v2 nasce ao lado. A fila de noite: as tarefas automáticas já correm na v2. A réplica fica para depois de medirmos o início do mês — corrigir as consultas é mais barato. E a última… merece um slide só para ela.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="Há três semanas">O que prometemos</Cabeca>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
        {promessas.map((p, i) => (
          <Entra key={p.frase} delay={0.15 + i * 0.08}>
            <motion.div
              className="cartao"
              animate={{ borderColor: step > i ? (p.selo === 'curso' || p.selo === 'seguir' ? CORES.violeta : CORES.lima) : 'rgba(255,255,255,0.09)' }}
              style={{ height: 238, display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <p.Icone size={40} strokeWidth={1.7} color={step > i ? (p.selo === 'curso' || p.selo === 'seguir' ? CORES.violetaClaro : CORES.lima) : CORES.cinza} />
              <p style={{ margin: 0, fontSize: 25, fontWeight: 700, lineHeight: 1.2, paddingRight: 90 }}>{p.frase}</p>
              <motion.p className="legenda" animate={{ opacity: step > i ? 1 : 0 }} style={{ fontSize: 17 }}>{p.detalhe}</motion.p>
              <Selo show={step > i} tipo={p.selo} texto={p.texto} />
            </motion.div>
          </Entra>
        ))}
      </div>
    </>
  ),
};

/* ───────────── «Íamos esperar até março» ───────────── */
const meses = ['Março', 'Fevereiro', 'Janeiro', 'Dezembro', 'Novembro'];

function Calendario({ step }: { step: number }) {
  return (
    <div style={{ position: 'relative', width: 420, height: 440 }}>
      <div className="cartao" style={{ position: 'absolute', inset: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 70, background: step >= 1 ? CORES.lima : CORES.violeta, transition: 'background 0.6s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 70 }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: CORES.carvao }} />
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: CORES.carvao }} />
        </div>
        <div style={{ flex: 1, position: 'relative', display: 'grid', placeItems: 'center', perspective: 900 }}>
          {meses.map((mes, i) => {
            const visivel = step === 0 ? i === 0 : true;
            const virado = step >= 1 && i < meses.length - 1;
            return (
              <motion.div
                key={mes}
                initial={false}
                animate={virado ? { rotateX: -100, opacity: 0 } : { rotateX: 0, opacity: visivel ? 1 : 0 }}
                transition={{ duration: 0.5, delay: step >= 1 ? i * 0.32 : 0 }}
                style={{ position: 'absolute', inset: 20, display: 'grid', placeItems: 'center', transformOrigin: 'top', background: CORES.carvao, borderRadius: 14, zIndex: meses.length - i }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', color: i === meses.length - 1 ? CORES.lima : CORES.branco }}>{mes}</div>
                  <div className="legenda" style={{ fontSize: 22 }}>{i === 0 ? '2027' : i < 3 ? '2027' : '2026'}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {step === 0 && (
        <motion.div initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          style={{ position: 'absolute', bottom: -26, left: '50%', transform: 'translateX(-50%) rotate(-6deg)', background: CORES.violeta, color: '#fff', padding: '8px 18px', borderRadius: 10, fontWeight: 800, fontSize: 22, whiteSpace: 'nowrap' }}>
          app em pausa
        </motion.div>
      )}
    </div>
  );
}

const marco = 1858;
const hoje = 446;

const marcoDeMarco: SlideDef = {
  id: 'marco', titulo: 'Íamos esperar até março', steps: 3,
  notas:
    'Na primeira apresentação dissemos: a app fica em pausa até março. (→) Não esperámos. Estamos em novembro e o design novo já chegou a três quartos da app. O que isto quer dizer: ecrãs mais claros, iguais em todo o lado — mais fáceis de vender e de ensinar a um centro. (→) A 10 de novembro havia 1 858 ficheiros da app ainda no design antigo. Hoje são 446. E cada um que sai não volta: há uma guarda que só deixa este número descer.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="A promessa que mudámos">Íamos esperar até março</Cabeca>
      <div style={{ display: 'flex', alignItems: 'center', gap: 90, flex: 1, paddingBottom: 40 }}>
        <Calendario step={step} />
        <div style={{ flex: 1 }}>
          <Entra show={step >= 1}><p className="frase-grande">Estamos em novembro.<br /><span className="lima">O design novo já chegou a três quartos da app.</span></p>
            <p className="legenda" style={{ marginTop: 14, fontSize: 22 }}>Ecrãs mais claros, iguais em todo o lado — mais fáceis de vender e de ensinar.</p></Entra>
          <Entra show={step >= 2} delay={0.1} style={{ marginTop: 50 }}>
            <p className="rotulo" style={{ marginBottom: 14 }}>Ficheiros da app ainda no design antigo</p>
            <div style={{ position: 'relative', height: 64, borderRadius: 14, background: '#2a2a32', overflow: 'hidden' }}>
              <motion.div initial={{ width: '100%' }} animate={{ width: step >= 2 ? `${(hoje / marco) * 100}%` : '100%' }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                style={{ position: 'absolute', inset: 0, right: 'auto', background: CORES.violeta, borderRadius: 14 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, alignItems: 'baseline' }}>
              <span className="legenda">10/11 · {marco.toLocaleString('pt-PT')}</span>
              <span className="numero-enorme lima"><Contador ate={hoje} show={step >= 2} /></span>
              <span className="chip" style={{ background: CORES.lima, color: CORES.carvao, borderColor: CORES.lima, fontSize: 22 }}>−76 %</span>
            </div>
          </Entra>
        </div>
      </div>
    </>
  ),
};

export const acto1: SlideDef[] = [capa, porque, comoTrabalhamos, prometemos, marcoDeMarco, mudou];
