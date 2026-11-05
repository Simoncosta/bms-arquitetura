import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  BaseEdge, Controls, getBezierPath, MarkerType, ReactFlow, useEdgesState, useNodesState,
  type Edge, type EdgeProps, type Node,
} from '@xyflow/react';
import { Icone, Reveal, Titulo } from '../components.tsx';
import type { SlideDef } from '../types.ts';

const LARANJA = '#ff6b00';
const VERMELHO = '#ef4444';

/* ───────────── 1. Capa: o símbolo da BMS a desenhar-se ───────────── */
const tracos = [
  { tipo: 'circle', props: { cx: 194.48, cy: 194.23, r: 114.86 } },
  { tipo: 'circle', props: { cx: 194.48, cy: 124.98, r: 15.76 } },
  { tipo: 'path', props: { d: 'M118.18,108.39l45.72,37.77c12.59,10.4,19.88,25.89,19.88,42.22v120.22' } },
  { tipo: 'path', props: { d: 'M269.66,108.39l-45.72,37.77c-12.59,10.4-19.88,25.89-19.88,42.22v120.22' } },
  { tipo: 'line', props: { x1: 273.19, y1: 277.89, x2: 204.05, y2: 202.85 } },
  { tipo: 'line', props: { x1: 183.78, y1: 202.85, x2: 115.15, y2: 277.29 } },
  { tipo: 'line', props: { x1: 178.72, y1: 162.87, x2: 83.57, y2: 162.87 } },
  { tipo: 'line', props: { x1: 305.4, y1: 162.87, x2: 210.36, y2: 162.87 } },
] as const;

function SimboloBMS({ tamanho }: { tamanho: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 388.78 388.78">
      {tracos.map((t, i) => {
        const comum = {
          key: i, fill: 'none', stroke: i === 1 ? LARANJA : '#f5f5f5', strokeWidth: 14, strokeLinecap: 'round' as const,
          initial: { pathLength: 0 }, animate: { pathLength: 1 },
          transition: { duration: 1.1, delay: 0.2 + i * 0.18, ease: 'easeInOut' as const },
        };
        if (t.tipo === 'circle') return <motion.circle {...comum} {...t.props} />;
        if (t.tipo === 'path') return <motion.path {...comum} {...t.props} />;
        return <motion.line {...comum} {...t.props} />;
      })}
    </svg>
  );
}

const capa: SlideDef = {
  id: 'capa', titulo: 'Capa', steps: 1,
  notas: 'Apresentar-me e o objetivo: não venho propor deitar nada abaixo. Analisei a base que temos, que funciona e dá receita, e quero mostrar como podemos evoluí-la para aguentar o que o BMS Ops vai trazer.',
  render: () => (
    <div style={{ margin: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 30 }}>
      <SimboloBMS tamanho={250} />
      <Reveal delay={1.9}><h1 className="titulo" style={{ fontSize: 64, margin: '30px 0 16px' }}>Evoluir a BMS sobre o que já construímos</h1></Reveal>
      <Reveal delay={2.2}><p className="rotulo">Proposta de arquitetura · novembro de 2026</p></Reveal>
    </div>
  ),
};

/* ───────────── 2. Como as peças conversam hoje (interativo) ───────────── */
export type DadosAresta = { carga: number; dur: number; cor: string };

function ArestaViva(props: EdgeProps<Edge<DadosAresta>>) {
  const [caminho, labelX, labelY] = getBezierPath(props);
  const { carga = 1, dur = 2, cor = '#f5f5f5' } = (props.data ?? {}) as Partial<DadosAresta>;
  return (
    <>
      <BaseEdge id={props.id} path={caminho} markerEnd={props.markerEnd} style={props.style} label={props.label}
        labelStyle={props.labelStyle} labelBgStyle={props.labelBgStyle} labelBgPadding={props.labelBgPadding} labelX={labelX} labelY={labelY} />
      {Array.from({ length: carga }).map((_, i) => (
        <circle key={i} r={5} fill={cor}>
          <animateMotion dur={`${dur}s`} begin={`-${(i * dur) / carga}s`} repeatCount="indefinite" path={caminho} />
        </circle>
      ))}
    </>
  );
}
export const tiposDeAresta = { viva: ArestaViva };

export function grafo(pico: boolean) {
  const nos: Node[] = [
    { id: 'app', position: { x: 0, y: 0 }, data: { label: pico ? 'App · 10 s à espera' : 'App' }, className: `no cliente ${pico ? 'lento' : ''}` },
    { id: 'torn', position: { x: 330, y: 0 }, data: { label: pico ? 'Torniquetes · fila à porta' : 'Torniquetes' }, className: `no cliente ${pico ? 'lento' : ''}` },
    { id: 'balcao', position: { x: 660, y: 0 }, data: { label: pico ? 'Balcão · erro 500' : 'Balcão' }, className: `no cliente ${pico ? 'lento' : ''}` },
    { id: 'routes', position: { x: 330, y: 150 }, data: { label: 'routes · 90 ficheiros' }, className: 'no' },
    { id: 'crons', position: { x: 900, y: 150 }, data: { label: '146 crons' }, className: `no ${pico ? 'quente' : ''}` },
    { id: 'ctrl', position: { x: 330, y: 300 }, data: { label: 'controllers · 2.545 ficheiros' }, className: `no ${pico ? 'quente' : ''}` },
    { id: 'helpers', position: { x: 720, y: 430 }, data: { label: 'helpers · 2.745 ficheiros' }, className: `no ${pico ? 'quente' : ''}` },
    { id: 'queries', position: { x: 330, y: 570 }, data: { label: 'db/queries · 2.176 ficheiros' }, className: 'no' },
    { id: 'pg', position: { x: 720, y: 720 }, data: { label: pico ? 'Postgres · 100% CPU' : 'Postgres' }, className: `no ${pico ? 'critico' : ''}` },
  ];
  const aresta = (id: string, source: string, target: string, carga: number, opcoes: { label?: string; aoContrario?: boolean; carregada?: boolean } = {}): Edge<DadosAresta> => {
    const vermelha = pico && opcoes.carregada;
    const cor = vermelha ? VERMELHO : opcoes.aoContrario ? LARANJA : '#555';
    return {
      id, source, target, type: 'viva', label: opcoes.label,
      data: { carga: vermelha ? carga * 5 : carga, dur: vermelha ? 0.8 : 2.6, cor: vermelha ? VERMELHO : opcoes.aoContrario ? LARANJA : '#bdbdbd' },
      style: { stroke: cor, strokeWidth: vermelha ? 3 : 2, strokeDasharray: opcoes.aoContrario ? '8 6' : undefined },
      markerEnd: { type: MarkerType.ArrowClosed, color: cor },
      labelStyle: { fill: vermelha ? VERMELHO : LARANJA, fontSize: 15, fontWeight: 700 },
      labelBgPadding: [6, 4],
    };
  };
  const arestas = [
    aresta('c1', 'app', 'routes', 1, { carregada: true }),
    aresta('c2', 'torn', 'routes', 1, { carregada: true }),
    aresta('c3', 'balcao', 'routes', 1, { carregada: true }),
    aresta('a1', 'routes', 'ctrl', 1, { carregada: true }),
    aresta('a2', 'ctrl', 'helpers', 2, { carregada: true }),
    aresta('a3', 'helpers', 'ctrl', 2, { label: '148 ao contrário', aoContrario: true, carregada: true }),
    aresta('a4', 'ctrl', 'queries', 1),
    aresta('a5', 'queries', 'pg', 1, { carregada: true }),
    aresta('a6', 'ctrl', 'pg', 1, { label: '1.002 com SQL direto', aoContrario: true, carregada: true }),
    aresta('a7', 'helpers', 'pg', 1, { label: '905 com SQL direto', aoContrario: true, carregada: true }),
    aresta('a8', 'crons', 'helpers', 2, { carregada: true }),
    aresta('a9', 'crons', 'ctrl', 1, { label: '8 ao contrário', aoContrario: true }),
  ];
  return { nos, arestas };
}

function MapaDeLigacoes({ step }: { step: number }) {
  const [forcado, setForcado] = useState<boolean | null>(null);
  useEffect(() => setForcado(null), [step]);
  const pico = forcado ?? step >= 1;
  const inicial = useMemo(() => grafo(false), []);
  const [nos, setNos, mudarNos] = useNodesState(inicial.nos);
  const [arestas, setArestas] = useEdgesState(inicial.arestas);

  // Muda o estado (dia normal / hora de ponta) sem perder as posições que o apresentador arrastou.
  useEffect(() => {
    const g = grafo(pico);
    setNos((atuais) => atuais.map((n) => {
      const novo = g.nos.find((x) => x.id === n.id);
      return novo ? { ...n, data: novo.data, className: novo.className } : n;
    }));
    setArestas(g.arestas);
  }, [pico, setNos, setArestas]);

  return (
    <div className="fluxo">
      <ReactFlow nodes={nos} edges={arestas} onNodesChange={mudarNos} edgeTypes={tiposDeAresta} fitView fitViewOptions={{ padding: 0.12 }}
        nodesConnectable={false} minZoom={0.3} maxZoom={3}>
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>
      <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 5 }} className="bloco">
        <div style={{ padding: '12px 18px' }}>
          <p className="rotulo" style={{ margin: 0, fontSize: 12 }}>tempo de resposta</p>
          <motion.p style={{ margin: '2px 0 0', fontSize: 38, fontWeight: 800 }} animate={{ color: pico ? VERMELHO : '#f5f5f5' }}>{pico ? '10 s' : '0,4 s'}</motion.p>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 5 }}>
        <button className={`botao ${pico ? 'ativo' : ''}`} style={pico ? { background: VERMELHO, borderColor: VERMELHO, color: '#fff' } : undefined} onClick={() => setForcado(!pico)}>
          {pico ? 'Hora de ponta' : 'Dia normal'}
        </button>
      </div>
      <div style={{ position: 'absolute', bottom: 18, right: 18, zIndex: 5, display: 'flex', gap: 10 }}>
        <span className="chip" style={{ fontSize: 14 }}><span style={{ width: 22, borderTop: `2px dashed ${LARANJA}` }} /> sentido errado</span>
        <span className="chip" style={{ fontSize: 14 }}><span style={{ width: 22, borderTop: `3px solid ${VERMELHO}` }} /> sobrecarga</span>
      </div>
    </div>
  );
}

const ligacoes: SlideDef = {
  id: 'ligacoes', titulo: 'Como as peças conversam hoje', steps: 2, interativo: true,
  notas: 'Os números são ficheiros: 2.545 ficheiros de controllers, 2.745 de helpers, 2.176 de queries. Mostrar ao vivo: arrastar, zoom, mover. A seta laranja tracejada vai no sentido errado: os helpers chamam os controllers e os controllers chamam os helpers, e as duas camadas escrevem SQL direto na base. Seguinte (ou o botão): hora de ponta. O vaivém multiplica-se, tudo acaba no Postgres, que vai aos 100%, e quem paga são as pessoas lá em cima: a app fica à espera, forma-se fila nos torniquetes, o balcão recebe erros.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Técnico · como está hoje">Como as peças conversam hoje</Titulo>
      <MapaDeLigacoes step={step} />
    </>
  ),
};

/* ───────────── 3. A hora de ponta, com os registos ───────────── */
const horas = ['6h', '9h', '12h', '15h', '18h', '21h', '0h', '3h'];
const aoVivo = [15, 45, 40, 35, 65, 40, 10, 5];
const lotesHoje = [10, 30, 10, 15, 45, 20, 10, 10];
const lotesNoite = [0, 0, 0, 0, 0, 0, 75, 75];
const superfit = [3, 8, 6, 6, 25, 8, 1, 1];
const ESCALA = 2.3;
const riscado = 'repeating-linear-gradient(45deg, #ff6b00 0 8px, rgba(255,107,0,0.35) 8px 16px)';

const registos = [
  { hora: '27/08 09:27', texto: '23 respostas bancárias em horário de balcão' },
  { hora: '27/08 11:51', texto: 'dezenas de pedidos acima de 12 s' },
  { hora: '10/09', texto: '19 lotes SEPA em simultâneo · 0,7 s → 83 s' },
  { hora: 'outubro', texto: '1.477 correções de dados em produção' },
  { hora: '02/11 17:23', texto: 'API em erro 500 · Postgres a 100% CPU' },
  { hora: '02/11 17:41', texto: 'Postgres reiniciado' },
];

/** Medido no painel da DigitalOcean a 04/11 (Insights da base e da app, Query statistics). */
const medidos = [
  { hora: 'todos os dias', texto: '~150 pedidos/s às 18h–19h' },
  { hora: 'dia normal', texto: 'resposta abaixo de 0,5 s · picos de 10 s' },
  { hora: '02/11', texto: 'base entre 50% e 100% de CPU das 11h às 18h' },
  { hora: 'de noite', texto: 'base perto de 0%: há espaço para os lotes' },
];
const achado = { hora: 'achado', texto: 'uma consulta da agenda: 47 min de base em 206 mil chamadas, quase 4× a seguinte' };

const horaDePonta: SlideDef = {
  id: 'hora-de-ponta', titulo: 'A hora de ponta', steps: 4,
  notas: 'À direita, os registos reais do repositório: não é crítica, é o que a própria equipa documentou com cuidado. À esquerda, o porquê. A base de dados é uma cozinha só: às 18h a sala enche, e hoje nada impede que os lotes sejam cozinhados ao mesmo tempo. Passa a linha. Seguinte: o Superfit junta 5.000 sócios à mesma hora. Seguinte: no novo modelo, os lotes vão para a noite e a hora de ponta fica só com o tráfego ao vivo. Valores do gráfico ilustrativos. Seguinte: os números reais, medidos no painel da DigitalOcean. Cerca de 150 pedidos por segundo às 18h. Num dia normal a app responde em menos de meio segundo, mas há picos de 10. Na primeira segunda do mês a base esteve entre 50 e 100% durante sete horas, e de noite está perto de zero, por isso há espaço para os lotes. E um achado bom: uma única consulta da agenda pesa quase quatro vezes mais do que a seguinte. Não é crítica, é um ganho rápido: melhorá-la alivia a base sem custo de infraestrutura.',
  render: ({ step }) => {
    const lotes = step >= 2 ? lotesNoite : lotesHoje;
    const comSuperfit = step >= 1;
    const satura = step < 2;
    return (
      <>
        <Titulo kicker="O servidor">A hora de ponta</Titulo>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 470px', gap: 36 }}>
          <div>
            <div style={{ position: 'relative', height: 380, display: 'flex', alignItems: 'flex-end', gap: 22, padding: '0 10px', borderBottom: '2px solid #333' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 100 * ESCALA, borderTop: `2px dashed ${satura ? VERMELHO : '#f5f5f5'}`, opacity: 0.8 }} />
              <motion.div style={{ position: 'absolute', right: 0, top: -6, color: satura ? VERMELHO : '#f5f5f5' }}
                animate={satura ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }} transition={satura ? { duration: 0.5, repeat: Infinity, repeatDelay: 0.6 } : {}}>
                {Icone.servidor(64)}
              </motion.div>
              {horas.map((h, i) => (
                <div key={h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column-reverse' }}>
                    <motion.div style={{ background: '#e8e8e8', borderRadius: '0 0 6px 6px' }} initial={{ height: 0 }} animate={{ height: aoVivo[i] * ESCALA }} transition={{ duration: 0.7 }} />
                    <motion.div style={{ background: LARANJA }} initial={{ height: 0 }} animate={{ height: lotes[i] * ESCALA }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
                    <motion.div style={{ background: riscado, borderRadius: '6px 6px 0 0' }} initial={{ height: 0 }} animate={{ height: comSuperfit ? superfit[i] * ESCALA : 0 }} transition={{ duration: 0.7 }} />
                  </div>
                  <span style={{ marginTop: 12, color: h === '18h' ? (satura ? VERMELHO : LARANJA) : 'var(--cinza)', fontSize: 19, fontWeight: h === '18h' ? 700 : 500 }}>{h}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
              <span className="chip"><span style={{ width: 14, height: 14, borderRadius: 4, background: '#e8e8e8' }} /> ao vivo</span>
              <span className="chip"><span style={{ width: 14, height: 14, borderRadius: 4, background: LARANJA }} /> lotes</span>
              {comSuperfit && <span className="chip"><span style={{ width: 14, height: 14, borderRadius: 4, background: riscado }} /> + Superfit</span>}
              {step >= 2 && <span className="chip chip-laranja">{Icone.lua(18)} lotes à noite</span>}
            </div>
          </div>
          {step < 3 ? (
            <div className="registo" key="repositorio">
              <p className="rotulo" style={{ margin: '0 0 14px', fontFamily: 'var(--letra)' }}>registos do repositório</p>
              {registos.map((r, i) => (
                <Reveal key={r.hora + r.texto} delay={0.3 + i * 0.35} y={8} style={{ marginBottom: 12 }}>
                  <span className="hora">[{r.hora}]</span>{r.texto}
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="registo" key="medido">
              <p className="rotulo" style={{ margin: '0 0 14px', fontFamily: 'var(--letra)' }}>medido no painel · 04/11</p>
              {medidos.map((r, i) => (
                <Reveal key={r.hora} delay={0.1 + i * 0.3} y={8} style={{ marginBottom: 12 }}>
                  <span className="hora" style={{ color: '#bdbdbd' }}>[{r.hora}]</span>{r.texto}
                </Reveal>
              ))}
              <Reveal delay={1.4} y={8} style={{ marginTop: 18, padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${LARANJA}`, background: 'rgba(255,107,0,0.12)' }}>
                <span className="hora" style={{ color: LARANJA }}>[{achado.hora}]</span>{achado.texto}
                <p style={{ margin: '8px 0 0', fontFamily: 'var(--letra)', fontSize: 15, fontWeight: 600, color: LARANJA }}>ganho rápido, sem custo de infraestrutura</p>
              </Reveal>
            </div>
          )}
        </div>
      </>
    );
  },
};

export const acto1: SlideDef[] = [capa, ligacoes, horaDePonta];
