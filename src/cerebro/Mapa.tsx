// O MAPA DO CÉREBRO: navega-se como no Figma (arrastar, scroll, pinça). Clicar num lobo abre-o;
// clicar num ponto acende as sinapses e abre o painel.
//
// Dois modos guiados:
//  - o ROTEIRO (R, ou → a partir da visão geral): a história do princípio ao fim. Cada → leva ao
//    ponto seguinte e abre-lhe o painel. Pode-se sair do caminho para uma pergunta e voltar com R.
//  - os PERCURSOS P1–P4: um processo concreto, que acende o caminho nó a nó pelos três lobos.

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type FitViewOptions,
  type Node,
} from '@xyflow/react';
import {
  CENTRO,
  LOBOS,
  LOBO_POR_ID,
  PERCURSOS,
  PERGUNTAS,
  PONTOS,
  PONTO_POR_ID,
  ROTULO_DO_ESTADO,
  SINAPSES,
  descreverAlvo,
  posicaoDoPonto,
} from './conteudo.ts';
import { tiposDeLigacao, tiposDeNo } from './nos.tsx';
import { Painel } from './Painel.tsx';
import { Icone } from './icones.tsx';
import { canal, enviar, type Contexto, type Mensagem } from './canal.ts';
import type { Acao, Estado, LoboId } from './tipos.ts';
import './cerebro.css';

/**
 * Onde ficou o roteiro, guardado na sessão do browser: o T3 abre a apresentação da arquitetura,
 * e ao voltar pelo menu o roteiro continua no mesmo passo. Se o browser não deixar guardar,
 * recomeça do princípio — nada parte.
 */
const CHAVE_DO_ROTEIRO = 'bms-cerebro-roteiro';
function lerPassoGuardado() {
  try {
    const n = Number(sessionStorage.getItem(CHAVE_DO_ROTEIRO));
    return Number.isInteger(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}
function guardarPasso(passo: number) {
  try {
    sessionStorage.setItem(CHAVE_DO_ROTEIRO, String(passo));
  } catch {
    /* sem armazenamento: o roteiro recomeça, e é tudo */
  }
}

const eDePergunta = (id: string) => PONTO_POR_ID.get(id)?.lobo === 'Q';

const POSICAO_DO_CENTRO = { x: -210, y: 0 };
const ORDEM_DOS_ESTADOS: Estado[] = ['existe', 'parcial', 'curso', 'falta', 'problema', 'nota'];
const TECLA_DO_LOBO: Record<string, LoboId> = { '1': 'E', '2': 'B', '3': 'I' };
const ROTEIRO = PERCURSOS.find((p) => p.modo === 'roteiro')!;

/**
 * Margens do enquadramento, para nada ficar por baixo do que está por cima do mapa: a barra de
 * baixo, o painel à direita (470 px) ou o cartão do percurso em baixo à esquerda (540 px).
 */
type Enquadramento = 'livre' | 'painel' | 'percurso';
const MARGENS: Record<Enquadramento, FitViewOptions['padding']> = {
  livre: { top: '90px', right: '70px', bottom: '150px', left: '70px' },
  painel: { top: '90px', right: '540px', bottom: '150px', left: '70px' },
  percurso: { top: '90px', right: '90px', bottom: '130px', left: '640px' },
};

type PedidoDeCamera = { ids: string[]; padding: FitViewOptions['padding']; maxZoom: number; vez: number };

export function Mapa() {
  return (
    <ReactFlowProvider>
      <MapaInterior />
    </ReactFlowProvider>
  );
}

function MapaInterior() {
  const rf = useReactFlow();
  const [abertos, setAbertos] = useState<Set<LoboId>>(() => new Set());
  const [ultimoLobo, setUltimoLobo] = useState<LoboId | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [percurso, setPercurso] = useState<{ id: string; passo: number } | null>(null);
  const [estadoModo, setEstadoModo] = useState(false);
  const [notas, setNotas] = useState(false);
  const [preto, setPreto] = useState(false);
  const [laser, setLaser] = useState(false);
  const [rato, setRato] = useState({ x: -100, y: -100 });
  const [camera, setCamera] = useState<PedidoDeCamera | null>(null);
  const [perguntasAbertas, setPerguntasAbertas] = useState(false);
  /** Onde ficou o roteiro, para retomar com R (ou depois de ir à arquitetura e voltar). */
  const passoDoRoteiro = useRef(lerPassoGuardado());

  // A câmara move-se DEPOIS de os nós aparecerem (um lobo que abre ainda não tem os pontos no ecrã).
  const focar = useCallback((ids: string[], enquadramento: Enquadramento = 'livre', maxZoom = 1) => {
    setCamera({ ids, padding: MARGENS[enquadramento], maxZoom, vez: Date.now() });
  }, []);

  useEffect(() => {
    if (!camera) return;
    const t = setTimeout(() => {
      rf.fitView({
        nodes: camera.ids.length ? camera.ids.map((id) => ({ id })) : undefined,
        padding: camera.padding,
        maxZoom: camera.maxZoom,
        duration: 800,
      });
    }, 60);
    return () => clearTimeout(t);
  }, [camera, rf]);

  const percursoAtual = percurso ? PERCURSOS.find((p) => p.id === percurso.id) ?? null : null;
  const emRoteiro = percursoAtual?.modo === 'roteiro';
  const emCaminho = percursoAtual?.modo === 'caminho';
  const passosFeitos = useMemo(
    () => (emCaminho && percursoAtual && percurso ? percursoAtual.passos.slice(0, percurso.passo + 1) : []),
    [emCaminho, percursoAtual, percurso],
  );
  const visitados = useMemo(() => new Set(passosFeitos.map((p) => p.no)), [passosFeitos]);
  const atual = passosFeitos.length ? passosFeitos[passosFeitos.length - 1].no : null;
  const noDoRoteiro = emRoteiro && percurso ? ROTEIRO.passos[percurso.passo].no : null;

  const ligados = useMemo(() => {
    const s = new Set<string>();
    if (!selecionado) return s;
    for (const [a, b] of SINAPSES) {
      if (a === selecionado) s.add(b);
      if (b === selecionado) s.add(a);
    }
    return s;
  }, [selecionado]);

  // ── Ações ─────────────────────────────────────────────────────────────────
  const abrirLobo = useCallback(
    (id: LoboId) => {
      setAbertos((prev) => new Set(prev).add(id));
      setUltimoLobo(id);
      focar([`lobo-${id}`]);
    },
    [focar],
  );

  const fecharLobo = useCallback(
    (id: LoboId) => {
      setAbertos((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      setSelecionado((s) => (s && PONTO_POR_ID.get(s)?.lobo === id ? null : s));
      focar([]);
    },
    [focar],
  );

  const alternarLobo = useCallback(
    (id: LoboId) => (abertos.has(id) ? fecharLobo(id) : abrirLobo(id)),
    [abertos, abrirLobo, fecharLobo],
  );

  const visaoGeral = useCallback(() => {
    setSelecionado(null);
    setPercurso(null);
    setAbertos(new Set());
    setUltimoLobo(null);
    focar([]);
  }, [focar]);

  /** Uma pergunta prevista: abre o painel com a resposta e acende no mapa os pontos que a sustentam. */
  const abrirPergunta = useCallback(
    (id: string) => {
      const ligadosAqui = SINAPSES.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a));
      setAbertos((prev) => {
        const n = new Set(prev);
        for (const l of ligadosAqui) {
          const p = PONTO_POR_ID.get(l);
          if (p && p.lobo !== 'T' && p.lobo !== 'Q') n.add(p.lobo as LoboId);
        }
        return n;
      });
      setSelecionado(id);
      if (ligadosAqui.length) focar(ligadosAqui, 'painel', 0.9);
    },
    [focar],
  );

  const irPara = useCallback(
    (id: string) => {
      const ponto = PONTO_POR_ID.get(id);
      if (!ponto) return;
      if (ponto.lobo === 'Q') return abrirPergunta(id);
      if (ponto.lobo !== 'T') setAbertos((prev) => new Set(prev).add(ponto.lobo as LoboId));
      const de = selecionado && !eDePergunta(selecionado) ? selecionado : null;
      setSelecionado(id);
      focar(de ? [de, id] : [id], 'painel');
    },
    [focar, selecionado, abrirPergunta],
  );

  const alternarEstado = useCallback(() => {
    if (!estadoModo) {
      setAbertos(new Set(LOBOS.map((l) => l.id)));
      focar([]);
    }
    setEstadoModo(!estadoModo);
  }, [estadoModo, focar]);

  const iniciarPercurso = useCallback((id: string) => {
    setSelecionado(null);
    setPercurso({ id, passo: id === ROTEIRO.id ? passoDoRoteiro.current : 0 });
  }, []);

  const sairDoPercurso = useCallback(() => {
    setPercurso(null);
    setSelecionado(null);
  }, []);

  const seguinte = useCallback(() => {
    setPercurso((p) => {
      if (!p) return p;
      const total = PERCURSOS.find((x) => x.id === p.id)!.passos.length;
      return p.passo < total - 1 ? { ...p, passo: p.passo + 1 } : p;
    });
  }, []);

  const anterior = useCallback(() => {
    setPercurso((p) => (p && p.passo > 0 ? { ...p, passo: p.passo - 1 } : p));
  }, []);

  /** → : passo seguinte; sem nada aberto, arranca o roteiro (para usar com um comando de apresentação). */
  const avancar = useCallback(() => {
    if (percurso) seguinte();
    else iniciarPercurso(ROTEIRO.id);
  }, [percurso, seguinte, iniciarPercurso]);

  /** R: volta ao passo atual do roteiro (ou retoma-o onde ficou). */
  const voltarAoRoteiro = useCallback(() => {
    setPercurso((p) => (p && p.id === ROTEIRO.id ? { ...p } : { id: ROTEIRO.id, passo: passoDoRoteiro.current }));
  }, []);

  // Cada passo move o mapa: no roteiro abre o painel do ponto; num percurso acende o caminho.
  useEffect(() => {
    if (!percurso || !percursoAtual) return;
    if (percursoAtual.modo === 'roteiro') {
      passoDoRoteiro.current = percurso.passo;
      guardarPasso(percurso.passo);
      const no = percursoAtual.passos[percurso.passo].no;
      if (no === 'centro') {
        setSelecionado(null);
        focar([]);
      } else if (no.startsWith('lobo-')) {
        const l = no.replace('lobo-', '') as LoboId;
        setAbertos((prev) => new Set(prev).add(l));
        setUltimoLobo(l);
        setSelecionado(null);
        focar([no]);
      } else {
        const p = PONTO_POR_ID.get(no);
        if (p && p.lobo !== 'T') setAbertos((prev) => new Set(prev).add(p.lobo as LoboId));
        setSelecionado(no);
        focar([no], 'painel', 0.85);
      }
      return;
    }
    const feitos = percursoAtual.passos.slice(0, percurso.passo + 1);
    setAbertos((prev) => {
      const n = new Set(prev);
      for (const passo of feitos) {
        const p = PONTO_POR_ID.get(passo.no);
        if (p && p.lobo !== 'T') n.add(p.lobo as LoboId);
      }
      return n;
    });
    focar([...new Set(feitos.slice(-2).map((p) => p.no))], 'percurso', 1.05);
  }, [percurso, percursoAtual, focar]);

  const aoClicarNo = useCallback(
    (_: MouseEvent, no: Node) => {
      if (no.type === 'lobo') {
        const id = no.id.replace('lobo-', '') as LoboId;
        if (!abertos.has(id)) abrirLobo(id);
        else focar([no.id]);
      } else if (no.type === 'ponto') {
        const vaiAbrir = selecionado !== no.id;
        setSelecionado(vaiAbrir ? no.id : null);
        // Se o ponto ficar por baixo do painel (470 px à direita), o mapa desliza — sem mudar o zoom.
        if (vaiAbrir) {
          const largura = no.measured?.width ?? 250;
          const altura = no.measured?.height ?? 122;
          const direita = rf.flowToScreenPosition({ x: no.position.x + largura, y: no.position.y });
          if (direita.x > window.innerWidth - 520) {
            const { zoom } = rf.getViewport();
            const centroVisivel = (window.innerWidth - 520) / 2;
            const desvio = (window.innerWidth / 2 - centroVisivel) / zoom;
            rf.setCenter(no.position.x + largura / 2 + desvio, no.position.y + altura / 2, { zoom, duration: 600 });
          }
        }
      } else if (no.type === 'centro') {
        visaoGeral();
      }
    },
    [abertos, abrirLobo, focar, visaoGeral, selecionado, rf],
  );

  // ── Nós e sinapses ────────────────────────────────────────────────────────
  const nos: Node[] = useMemo(() => {
    const lista: Node[] = [
      {
        id: 'centro',
        type: 'centro',
        position: POSICAO_DO_CENTRO,
        data: { aceso: !selecionado && !percurso },
        draggable: false,
        selectable: false,
        zIndex: 10,
        width: 420,
        height: 270,
      },
    ];
    for (const lobo of LOBOS) {
      const doLobo = PONTOS.filter((p) => p.lobo === lobo.id);
      const contagens: Partial<Record<Estado, number>> = {};
      for (const p of doLobo) contagens[p.estado] = (contagens[p.estado] ?? 0) + 1;
      lista.push({
        id: `lobo-${lobo.id}`,
        type: 'lobo',
        position: { x: lobo.x, y: lobo.y },
        data: {
          lobo,
          aberto: abertos.has(lobo.id),
          total: doLobo.length,
          contagens,
          estadoModo,
          onFechar: () => fecharLobo(lobo.id),
        },
        draggable: false,
        selectable: false,
        zIndex: -1,
        width: lobo.largura,
        height: lobo.altura,
      });
    }
    for (const ponto of PONTOS) {
      if (ponto.lobo === 'Q') continue; // as perguntas vivem na bandeja, não no mapa
      const escondido = ponto.lobo !== 'T' && !abertos.has(ponto.lobo as LoboId);
      const classes = [
        estadoModo ? 'com-estado' : '',
        selecionado === ponto.id ? 'selecionado' : '',
        ligados.has(ponto.id) ? 'ligado' : '',
        selecionado && selecionado !== ponto.id && !ligados.has(ponto.id) ? 'apagado' : '',
        emCaminho ? (visitados.has(ponto.id) ? 'caminho' : 'apagado') : '',
        atual === ponto.id ? 'atual' : '',
      ]
        .filter(Boolean)
        .join(' ');
      lista.push({
        id: ponto.id,
        type: 'ponto',
        position: posicaoDoPonto(ponto),
        data: { ponto, classes },
        hidden: escondido,
        draggable: false,
        selectable: false,
        zIndex: 10,
        width: 250,
      });
    }
    return lista;
  }, [abertos, selecionado, ligados, visitados, atual, estadoModo, percurso, emCaminho, fecharLobo]);

  /** Um ponto de um lobo fechado liga-se através do próprio lobo. */
  const visivelComo = useCallback(
    (id: string) => {
      const p = PONTO_POR_ID.get(id);
      if (!p || p.lobo === 'T') return id;
      return abertos.has(p.lobo as LoboId) ? id : `lobo-${p.lobo}`;
    },
    [abertos],
  );

  const ligacoes: Edge[] = useMemo(() => {
    const lista: Edge[] = LOBOS.map((lobo) => ({
      id: `tronco-${lobo.id}`,
      source: 'centro',
      target: `lobo-${lobo.id}`,
      type: 'sinapse',
      data: { classe: `tronco ${abertos.has(lobo.id) ? 'forte' : ''}`, curva: 0.06 },
    }));
    const vistas = new Set<string>();
    for (const [a, b] of SINAPSES) {
      if (eDePergunta(a) || eDePergunta(b)) continue;
      const va = visivelComo(a);
      const vb = visivelComo(b);
      if (va === vb) continue;
      const ativa = !!selecionado && (a === selecionado || b === selecionado);
      const chave = [va, vb].sort().join('|');
      if (vistas.has(chave) && !ativa) continue;
      vistas.add(chave);
      const distante = va !== a || vb !== b;
      lista.push({
        id: `s-${a}-${b}`,
        source: va,
        target: vb,
        type: 'sinapse',
        zIndex: ativa ? 2 : 0,
        data: { classe: ativa ? 'ativa' : distante ? 'distante' : '' },
      });
    }
    for (let i = 1; i < passosFeitos.length; i++) {
      const a = visivelComo(passosFeitos[i - 1].no);
      const b = visivelComo(passosFeitos[i].no);
      if (a === b) continue;
      lista.push({
        id: `caminho-${i}`,
        source: a,
        target: b,
        type: 'sinapse',
        zIndex: 3,
        data: { classe: i === passosFeitos.length - 1 ? 'caminho recente' : 'caminho', curva: 0.24 },
      });
    }
    return lista;
  }, [abertos, selecionado, passosFeitos, visivelComo]);

  // ── Janela do apresentador ────────────────────────────────────────────────
  const contexto: Contexto = useMemo(() => {
    if (percursoAtual && percurso) {
      const passo = percursoAtual.passos[percurso.passo];
      const proximo = percursoAtual.passos[percurso.passo + 1];
      const alvo = descreverAlvo(passo.no);
      const total = percursoAtual.passos.length;
      if (percursoAtual.modo === 'roteiro') {
        // Saiu do roteiro para responder a uma pergunta: mostra o ponto clicado.
        if (selecionado && selecionado !== passo.no) {
          const fora = descreverAlvo(selecionado);
          return { onde: `Fora do roteiro · ${fora.codigo}`, titulo: fora.titulo, notas: fora.notas, seguinte: 'R volta ao roteiro' };
        }
        return {
          onde: `Roteiro · ${percurso.passo + 1} de ${total} · ${alvo.codigo}`,
          titulo: alvo.titulo,
          notas: alvo.notas,
          seguinte: proximo ? descreverAlvo(proximo.no).titulo : 'fim do roteiro',
        };
      }
      return {
        onde: `${percursoAtual.id} · ${percursoAtual.titulo} · passo ${percurso.passo + 1} de ${total}`,
        titulo: `${alvo.codigo} · ${passo.frase}`,
        notas: `${passo.notas}\n\n${alvo.notas}`,
        seguinte: proximo ? proximo.frase : 'fim do percurso',
      };
    }
    if (selecionado) {
      const ponto = PONTO_POR_ID.get(selecionado)!;
      const lobo = ponto.lobo === 'T' || ponto.lobo === 'Q' ? null : LOBO_POR_ID.get(ponto.lobo as LoboId)!;
      const onde = lobo
        ? `Lobo ${lobo.numero} · ${lobo.titulo} · ${ponto.id}`
        : `${ponto.lobo === 'Q' ? 'Pergunta prevista' : 'Transversal'} · ${ponto.id}`;
      return { onde, titulo: ponto.titulo, notas: ponto.notas };
    }
    if (ultimoLobo && abertos.has(ultimoLobo)) {
      const lobo = LOBO_POR_ID.get(ultimoLobo)!;
      return { onde: `Lobo ${lobo.numero}`, titulo: lobo.titulo, notas: lobo.notas };
    }
    return { onde: 'Visão geral', titulo: CENTRO.titulo, notas: CENTRO.notas };
  }, [percursoAtual, percurso, selecionado, ultimoLobo, abertos]);

  useEffect(() => {
    enviar({ tipo: 'estado', contexto });
  }, [contexto]);

  useEffect(() => {
    const ouvir = (e: MessageEvent<Mensagem>) => {
      if (e.data.tipo === 'ir') (e.data.acao === 'seguinte' ? avancar : anterior)();
      if (e.data.tipo === 'pedir-estado') enviar({ tipo: 'estado', contexto });
    };
    canal.addEventListener('message', ouvir);
    return () => canal.removeEventListener('message', ouvir);
  }, [contexto, avancar, anterior]);

  // ── Teclado ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (['arrowright', 'pagedown', ' ', 'enter'].includes(k)) {
        e.preventDefault();
        avancar();
      } else if (['arrowleft', 'pageup'].includes(k)) {
        e.preventDefault();
        if (percurso) anterior();
      } else if (k === 'escape') {
        if (selecionado && selecionado !== noDoRoteiro) setSelecionado(null);
        else if (percurso) sairDoPercurso();
      } else if (k === 'r') voltarAoRoteiro();
      else if (k === 'q') setPerguntasAbertas((v) => !v);
      else if (k === '0' || k === 'home') visaoGeral();
      else if (TECLA_DO_LOBO[k]) alternarLobo(TECLA_DO_LOBO[k]);
      else if (k === 'e') alternarEstado();
      else if (k === 'n') setNotas((v) => !v);
      else if (k === 'b' || k === '.') setPreto((v) => !v);
      else if (k === 'l') setLaser((v) => !v);
      else if (k === 'p') window.open(`${window.location.pathname}?ver=cerebro&apresentador=1`, 'bms-cerebro-apresentador', 'width=900,height=700');
      else if (k === 'f') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [percurso, selecionado, noDoRoteiro, avancar, anterior, sairDoPercurso, voltarAoRoteiro, visaoGeral, alternarLobo, alternarEstado]);

  const pontoAberto = selecionado ? PONTO_POR_ID.get(selecionado) ?? null : null;
  const contagemTotal = useMemo(() => {
    const c: Partial<Record<Estado, number>> = {};
    for (const p of PONTOS) if (p.lobo !== 'Q') c[p.estado] = (c[p.estado] ?? 0) + 1;
    return c;
  }, []);

  /** O botão do painel: arranca um percurso, ou abre a outra apresentação (o roteiro fica guardado). */
  const aoAgir = useCallback(
    (acao: Acao) => {
      if (acao.tipo === 'percurso') iniciarPercurso(acao.id);
      else window.location.href = `${window.location.pathname}?ver=${acao.ver}`;
    },
    [iniciarPercurso],
  );

  return (
    <div className="cerebro">
      <div
        className="ecra"
        style={{ cursor: laser ? 'none' : undefined }}
        onMouseMove={(e) => laser && setRato({ x: e.clientX, y: e.clientY })}
      >
        <ReactFlow
          nodes={nos}
          edges={ligacoes}
          nodeTypes={tiposDeNo}
          edgeTypes={tiposDeLigacao}
          onNodeClick={aoClicarNo}
          onPaneClick={() => setSelecionado(null)}
          fitView
          fitViewOptions={{ padding: MARGENS.livre }}
          minZoom={0.12}
          maxZoom={2.2}
          panOnScroll
          zoomOnPinch
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          deleteKeyCode={null}
          selectionKeyCode={null}
          multiSelectionKeyCode={null}
          colorMode="dark"
          style={{ width: '100%', height: '100%' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={44} size={1.4} color="rgba(250, 248, 243, 0.07)" />
        </ReactFlow>

        <div className="marca">
          <img src="/logos/Logotipo_BMS_Branco.svg" alt="BMS" />
          <span>O cérebro</span>
        </div>

        <AnimatePresence>
          {estadoModo && (
            <motion.div className="legenda" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {ORDEM_DOS_ESTADOS.map((e) => (
                <span key={e} className={`legenda-item estado-${e}`}>
                  <span className="ponto-estado" />
                  {ROTULO_DO_ESTADO[e]} <b>{contagemTotal[e] ?? 0}</b>
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Percurso: o cartão do passo, em baixo à esquerda */}
        <AnimatePresence>
          {emCaminho && percursoAtual && percurso && (
            <motion.div
              key={`${percursoAtual.id}-${percurso.passo}`}
              className="passo"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="kicker">
                {percursoAtual.id} · {percursoAtual.titulo}
              </span>
              <div className="passo-linha">
                <span className="ponto-codigo">{percursoAtual.passos[percurso.passo].no}</span>
                <span className="passo-conta">
                  {percurso.passo + 1} / {percursoAtual.passos.length}
                </span>
              </div>
              <p>{percursoAtual.passos[percurso.passo].frase}</p>
              <div className="passo-pontos">
                {percursoAtual.passos.map((_, i) => (
                  <span key={i} className={i <= percurso.passo ? 'feito' : ''} />
                ))}
              </div>
              <div className="passo-botoes">
                <button onClick={anterior} disabled={percurso.passo === 0} aria-label="Passo anterior">
                  ←
                </button>
                <button onClick={seguinte} disabled={percurso.passo === percursoAtual.passos.length - 1} aria-label="Passo seguinte">
                  →
                </button>
                <button onClick={sairDoPercurso}>Sair</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roteiro: uma régua fina por cima da barra de baixo */}
        <AnimatePresence>
          {emRoteiro && percurso && (
            <motion.div className="roteiro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
              <button onClick={anterior} disabled={percurso.passo === 0} aria-label="Passo anterior">
                ←
              </button>
              <span className="roteiro-conta">
                {percurso.passo + 1} / {ROTEIRO.passos.length}
              </span>
              <div className="roteiro-pontos">
                {ROTEIRO.passos.map((p, i) => (
                  <span
                    key={i}
                    className={`${i < percurso.passo ? 'feito' : ''} ${i === percurso.passo ? 'agora' : ''} ${p.no.startsWith('lobo-') || p.no === 'centro' ? 'marco' : ''}`}
                  />
                ))}
              </div>
              <span className="roteiro-titulo">{descreverAlvo(ROTEIRO.passos[percurso.passo].no).titulo}</span>
              {selecionado && selecionado !== noDoRoteiro && <span className="roteiro-fora">R para voltar</span>}
              <button
                onClick={seguinte}
                disabled={percurso.passo === ROTEIRO.passos.length - 1}
                aria-label="Passo seguinte"
              >
                →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {pontoAberto && (
            <Painel key={pontoAberto.id} ponto={pontoAberto} onFechar={() => setSelecionado(null)} onIr={irPara} onAcao={aoAgir} />
          )}
        </AnimatePresence>

        {/* As perguntas previstas: «eu sabia que iam perguntar isto» — clica-se e a resposta abre */}
        <AnimatePresence>
          {perguntasAbertas && (
            <motion.div
              className="perguntas"
              style={{ bottom: emRoteiro ? 140 : 84 }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.3 }}
            >
              {PERGUNTAS.map((q, i) => (
                <motion.button
                  key={q.id}
                  className={`pergunta ${selecionado === q.id ? 'ativa' : ''}`}
                  onClick={() => (selecionado === q.id ? setSelecionado(null) : abrirPergunta(q.id))}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Icone nome={q.icone} tamanho={16} />
                  {q.titulo}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="dock" aria-label="Navegação do mapa">
          <button
            className={`dock-roteiro ${emRoteiro ? 'ativo' : ''}`}
            onClick={() => (emRoteiro ? sairDoPercurso() : iniciarPercurso(ROTEIRO.id))}
          >
            <Icone nome="Play" tamanho={14} /> Roteiro
          </button>
          <button className={!abertos.size && !percurso ? 'ativo' : ''} onClick={visaoGeral}>
            ◎ Visão geral
          </button>
          <span className="dock-sep" />
          {LOBOS.map((l) => (
            <button key={l.id} className={abertos.has(l.id) ? 'ativo' : ''} onClick={() => alternarLobo(l.id)}>
              <b>{l.numero}</b> {l.titulo}
            </button>
          ))}
          <span className="dock-sep" />
          {PERCURSOS.filter((p) => p.modo === 'caminho').map((p) => (
            <button
              key={p.id}
              className={percurso?.id === p.id ? 'ativo' : ''}
              title={p.titulo}
              onClick={() => (percurso?.id === p.id ? sairDoPercurso() : iniciarPercurso(p.id))}
            >
              <b>{p.id}</b> {p.rotulo}
            </button>
          ))}
          <span className="dock-sep" />
          <button className={estadoModo ? 'ativo' : ''} onClick={alternarEstado}>
            ◐ O que já temos
          </button>
          <button className={`dock-perguntas ${perguntasAbertas ? 'ativo' : ''}`} onClick={() => setPerguntasAbertas((v) => !v)}>
            <Icone nome="CircleQuestionMark" tamanho={15} /> Perguntas
          </button>
        </nav>

        <AnimatePresence>
          {notas && (
            <motion.aside className="notas" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
              <strong>{contexto.titulo}</strong>
              {contexto.notas}
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {preto && (
            <motion.div className="preto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreto(false)} />
          )}
        </AnimatePresence>
        {laser && <div className="laser" style={{ left: rato.x, top: rato.y }} />}
      </div>
    </div>
  );
}
