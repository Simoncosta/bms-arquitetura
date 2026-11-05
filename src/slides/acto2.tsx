import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Controls, MarkerType, ReactFlow, useEdgesState, useNodesState, type Edge, type Node } from '@xyflow/react';
import { Icone, Reveal, Titulo } from '../components.tsx';
import { grafo, tiposDeAresta, type DadosAresta } from './acto1.tsx';
import type { SlideDef } from '../types.ts';

const LARANJA = '#ff6b00';
const VERMELHO = '#ef4444';

/* ───────────── 4. Três caminhos ───────────── */
function MiniReescrever() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div key={i} style={{ width: 44, height: 44, borderRadius: 8, background: '#3a3a3a' }}
          animate={{ y: [0, 0, 120, 120, 0], rotate: [0, 0, (i % 2 ? 40 : -40), (i % 2 ? 40 : -40), 0], opacity: [1, 1, 0, 0, 1] }}
          transition={{ duration: 4, delay: i * 0.08, repeat: Infinity, times: [0, 0.3, 0.55, 0.85, 1] }} />
      ))}
    </div>
  );
}

function MiniMicro() {
  const pontos = [[20, 20], [110, 10], [190, 40], [40, 100], [140, 90], [200, 130], [20, 170], [100, 170], [180, 190]];
  return (
    <svg width="220" height="210" style={{ display: 'block', margin: '0 auto' }}>
      {pontos.flatMap(([x1, y1], i) => pontos.slice(i + 1).filter((_, j) => (i + j) % 2 === 0).map(([x2, y2], j) => (
        <motion.line key={`${i}-${j}`} x1={x1 + 14} y1={y1 + 14} x2={x2 + 14} y2={y2 + 14} stroke="#555" strokeWidth="1.5"
          animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 1.2, delay: (i + j) * 0.1, repeat: Infinity }} />
      )))}
      {pontos.map(([x, y], i) => <rect key={i} x={x} y={y} width="28" height="28" rx="6" fill="#3a3a3a" />)}
    </svg>
  );
}

function MiniModular() {
  return (
    <div style={{ width: 230, margin: '0 auto', border: `2px solid ${LARANJA}`, borderRadius: 16, padding: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div key={i} style={{ height: 70, borderRadius: 10, background: 'var(--laranja-fundo)', border: `1.5px solid ${LARANJA}` }}
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }} />
      ))}
    </div>
  );
}

function Caminho({ nome, show, escolhido, children }: { nome: string; show: boolean; escolhido?: boolean; children: ReactNode }) {
  return (
    <Reveal show={show} className={escolhido ? 'bloco-laranja' : 'bloco'} style={{ padding: '36px 24px 30px', position: 'relative', textAlign: 'center' }}>
      <div style={{ height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      <p style={{ fontSize: 30, fontWeight: 700, margin: '24px 0 0' }}>{nome}</p>
      <motion.div style={{ position: 'absolute', top: 18, right: 18, color: escolhido ? LARANJA : VERMELHO }}
        initial={{ scale: 0 }} animate={{ scale: show ? 1 : 0 }} transition={{ delay: 0.5, type: 'spring' }}>
        {escolhido ? Icone.visto(48) : Icone.cruz(48)}
      </motion.div>
    </Reveal>
  );
}

const caminhos: SlideDef = {
  id: 'caminhos', titulo: 'Três caminhos possíveis', steps: 3,
  notas: 'Avaliei três caminhos. Reescrever do zero: mais de 1.000 dias-pessoa só no backend e dois sistemas a manter ao mesmo tempo. Microsserviços: muitos sistemas pequenos a falar pela rede, mais pontos de falha, para uma escala que não é o nosso problema. O monólito modular: o mesmo sistema e a mesma base de dados, organizados por áreas com fronteiras claras. É o que proponho.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Opções avaliadas">Três caminhos possíveis</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
        <Caminho nome="Reescrever do zero" show><MiniReescrever /></Caminho>
        <Caminho nome="Microsserviços" show={step >= 1}><MiniMicro /></Caminho>
        <Caminho nome="Monólito modular" show={step >= 2} escolhido><MiniModular /></Caminho>
      </div>
    </>
  ),
};

/* ───────────── 5. Organizar o código como um ginásio ───────────── */
const salas = ['Clientes', 'Faturação', 'Cobranças', 'Acessos'];
const SALA_L = 300;
const SALA_GAP = (1408 - 4 * SALA_L) / 3;
const SALA_Y = 110;
const xSala = (i: number) => i * (SALA_L + SALA_GAP);

const percursos: Record<number, { rotulo: string; left: number[]; top: number[] }> = {
  1: { rotulo: 'pedido externo · vem da app', left: [-60, 150, 150, 150, 150, 150, -60], top: [150, 28, 189, 264, 189, 28, 150] },
  2: { rotulo: 'pedido interno · vem de outra sala', left: [xSala(1) + 150, 82, 150, 82, xSala(1) + 150], top: [264, 349, 264, 349, 264] },
  3: { rotulo: 'acesso ao motor antigo', left: [150, 217, 217, 217, 150], top: [264, 349, 515, 349, 264] },
};

function Porta({ texto, icone, ativa, x, cor = LARANJA }: { texto: string; icone: ReactNode; ativa: boolean; x: number; cor?: string }) {
  return (
    <motion.div style={{ position: 'absolute', left: x, top: 210, width: 125, height: 58, borderRadius: 10, border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 600 }}
      animate={{ borderColor: ativa ? cor : '#3a3a3a', backgroundColor: ativa ? cor : '#1a1a1a', color: ativa ? '#000' : '#9a9a9a' }}>
      {icone} {texto}
    </motion.div>
  );
}

function Sala({ nome, i, step }: { nome: string; i: number; step: number }) {
  const aMudar = step >= 4 && i === 1;
  const intacta = step >= 4 && i !== 1;
  const ehClientes = i === 0;
  return (
    <motion.div style={{ position: 'absolute', left: xSala(i), top: SALA_Y, width: SALA_L, height: 290, borderRadius: 18, background: 'var(--painel)', border: '2px solid' }}
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, borderColor: aMudar ? LARANJA : '#333' }} transition={{ delay: 0.15 + i * 0.12 }}>
      <p style={{ margin: '12px 0 0 20px', fontSize: 22, fontWeight: 700 }}>Sala {nome}</p>
      <motion.div style={{ position: 'absolute', left: 20, top: 50, width: 260, height: 58, borderRadius: 10, border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600 }}
        animate={{ borderColor: step === 1 && ehClientes ? LARANJA : '#3a3a3a', backgroundColor: step === 1 && ehClientes ? LARANJA : '#1a1a1a', color: step === 1 && ehClientes ? '#000' : '#f5f5f5' }}>
        Balcão · Route + Controller
      </motion.div>
      <motion.div style={{ position: 'absolute', left: 20, top: 122, width: 260, height: 64, borderRadius: 10, border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600 }}
        animate={{ borderColor: aMudar ? LARANJA : '#3a3a3a', backgroundColor: aMudar ? 'rgba(255,107,0,0.18)' : '#1a1a1a' }}
        transition={aMudar ? { duration: 0.8, repeat: Infinity, repeatType: 'reverse' } : {}}>
        Service · Repository
      </motion.div>
      <Porta x={20} texto="porta interna" icone={Icone.porta(18)} ativa={step === 2 && ehClientes} />
      <Porta x={155} texto="porta de serviço" icone={Icone.cadeado(18)} ativa={step === 3 && ehClientes} cor="#f5f5f5" />
      {aMudar && <span className="chip chip-laranja" style={{ position: 'absolute', top: -18, right: 16, fontSize: 14 }}>a mudar por dentro</span>}
      <motion.div style={{ position: 'absolute', top: -22, right: 16, color: LARANJA }} initial={{ scale: 0 }} animate={{ scale: intacta ? 1 : 0 }}>{Icone.visto(42)}</motion.div>
    </motion.div>
  );
}

const ginasio: SlideDef = {
  id: 'ginasio', titulo: 'Organizar o código como um ginásio', steps: 5,
  notas: 'O código organizado como um ginásio. A receção é comum a todos: quem vem de fora identifica-se aqui. Cada área de negócio é uma sala. Seguinte: um pedido externo, da app, passa pela receção e chega ao balcão da sala, que é a rota mais o controller; a sala trata dele e a resposta volta pelo mesmo caminho. Seguinte: um pedido interno, de outra sala, não passa pelo balcão: entra pela porta interna, o index.ts. Seguinte: quando a sala precisa do motor de pagamentos antigo, vai pela porta de serviço, e só por aí. Seguinte: se a faturação muda por dentro, as outras salas continuam a funcionar, porque só conhecem a porta interna dela.',
  render: ({ step }) => {
    const p = percursos[step];
    return (
      <>
        <Titulo kicker="A proposta">Organizar o código como um ginásio</Titulo>
        <div style={{ position: 'relative', height: 590 }}>
          <motion.div className="bloco" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontSize: 18, color: 'var(--cinza)' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1, borderColor: step === 1 ? LARANJA : 'rgba(255,255,255,0.1)' }} transition={{ duration: 0.6 }}>
            <strong style={{ color: 'var(--branco)' }}>Receção</strong> autenticação · base de dados · filas · erros
          </motion.div>
          {salas.map((n, i) => <Sala key={n} nome={n} i={i} step={step} />)}
          {salas.map((_, i) => (
            <motion.div key={i} style={{ position: 'absolute', left: xSala(i) + 217, top: SALA_Y + 268, width: 2, height: 470 - SALA_Y - 268, background: '#f5f5f5', transformOrigin: 'top' }}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.5 + i * 0.1 }} />
          ))}
          <motion.div style={{ position: 'absolute', left: 0, right: 0, top: 470, height: 90, borderRadius: 18, background: '#1a1a1a', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1, borderColor: step === 3 ? LARANJA : '#f5f5f5' }} transition={{ delay: 0.4 }}>
            {Icone.cadeado(34)}
            <span style={{ fontSize: 24, fontWeight: 700 }}>Escritório antigo · o motor de pagamentos de hoje</span>
          </motion.div>
          {step === 1 && <motion.span className="chip" style={{ position: 'absolute', left: -96, top: 132 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>App</motion.span>}
          {p && (
            <>
              <motion.span key={`r${step}`} className="chip chip-laranja" style={{ position: 'absolute', right: 0, top: -62, fontSize: 16 }} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>{p.rotulo}</motion.span>
              <motion.div key={`p${step}`} style={{ position: 'absolute', width: 26, height: 26, marginLeft: -13, marginTop: -13, borderRadius: 13, background: LARANJA, boxShadow: '0 0 24px 6px rgba(255,107,0,0.6)', zIndex: 3 }}
                initial={{ left: p.left[0], top: p.top[0] }} animate={{ left: p.left, top: p.top }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />
            </>
          )}
        </div>
      </>
    );
  },
};

/* ───────────── 6. A viagem de um pedido (exemplo de clientes) ───────────── */
const viagemCamadas = [
  { nome: 'Route', faz: 'a morada do pedido', exemplo: 'GET /clientes/:id', hoje: 'routes/user.js' },
  { nome: 'Middleware', faz: 'quem és?', exemplo: 'token Firebase válido → é a Ana, rececionista', hoje: 'middlewares/authenticationFirebase.js' },
  { nome: 'Request', faz: 'o pedido está bem feito?', exemplo: 'o id é um número? sim', hoje: 'checkRequiredFields dentro do controller' },
  { nome: 'Controller', faz: 'orquestra, sem regra nem SQL', exemplo: 'chama o service e depois o resource', hoje: 'controllers/user/*Controller.js' },
  { nome: 'Policy', faz: 'podes ver isto?', exemplo: 'a Ana trabalha nesta filial? sim', hoje: 'helpers/tenantParamGuard.js' },
  { nome: 'Service', faz: 'a regra de negócio', exemplo: 'cliente + plano ativo + dívida em aberto', hoje: 'espalhado por helpers/' },
  { nome: 'Repository', faz: 'fala com a base de dados', exemplo: 'SELECT … FROM "user" WHERE id = $1', hoje: 'db/queries/…Query.js' },
  { nome: 'Resource', faz: 'o que a app recebe', exemplo: 'nome, plano e estado · nunca o IBAN', hoje: 'res.send(…) com a linha inteira' },
];
const V_CAIXA = 160;
const V_ESPACO = (1408 - viagemCamadas.length * V_CAIXA) / (viagemCamadas.length - 1);

const viagem: SlideDef = {
  id: 'viagem', titulo: 'A viagem de um pedido', steps: 9,
  notas: 'Para a equipa técnica: a viagem de um pedido real, com clientes, como no api_v1 de hoje. A Ana, rececionista, abre a ficha de um cliente. Cada seguinte avança uma camada, e em baixo aparece o que ela faz neste pedido e onde isso vive hoje no api_v1. A última mostra o caminho assíncrono, para o que é pesado.',
  render: ({ step }) => {
    const atual = Math.min(step, viagemCamadas.length - 1);
    const camada = viagemCamadas[atual];
    const assinc = step >= viagemCamadas.length;
    return (
      <>
        <Titulo kicker="Técnico · exemplo com clientes">A viagem de um pedido</Titulo>
        <p className="mono" style={{ fontSize: 22, margin: '-14px 0 36px' }}><span className="laranja">GET</span> /clientes/1042 <span className="cinza">· a Ana, rececionista, abre a ficha de um cliente</span></p>
        <div style={{ position: 'relative', height: 120 }}>
          <motion.div style={{ position: 'absolute', top: -18, width: 18, height: 18, marginLeft: -9, borderRadius: 9, background: LARANJA, boxShadow: '0 0 18px 4px rgba(255,107,0,0.7)' }}
            animate={{ left: atual * (V_CAIXA + V_ESPACO) + V_CAIXA / 2 }} transition={{ duration: 0.5 }} />
          {viagemCamadas.map((c, i) => (
            <motion.div key={c.nome} style={{ position: 'absolute', left: i * (V_CAIXA + V_ESPACO), top: 0, width: V_CAIXA, height: 100, borderRadius: 14, border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 700 }}
              animate={{
                borderColor: i <= atual ? LARANJA : '#3a3a3a',
                backgroundColor: i === atual && !assinc ? LARANJA : i < atual || assinc ? 'rgba(255,107,0,0.12)' : '#141414',
                color: i === atual && !assinc ? '#000' : '#f5f5f5',
              }}>
              {c.nome}
            </motion.div>
          ))}
        </div>
        {!assinc ? (
          <motion.div key={atual} className="bloco" style={{ padding: '30px 36px', marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div>
              <p className="rotulo laranja" style={{ margin: 0 }}>{camada.nome} · {camada.faz}</p>
              <p className="mono" style={{ fontSize: 28, margin: '16px 0 0', lineHeight: 1.4 }}>{camada.exemplo}</p>
            </div>
            <div style={{ borderLeft: '1px solid #333', paddingLeft: 36 }}>
              <p className="rotulo" style={{ margin: 0 }}>hoje no api_v1</p>
              <p className="mono cinza" style={{ fontSize: 22, margin: '16px 0 0', lineHeight: 1.4 }}>{camada.hoje}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div className="bloco" style={{ padding: '30px 36px', marginTop: 20 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="rotulo laranja" style={{ margin: '0 0 18px' }}>e se o cliente pagar agora? o pesado vai para a fila, depois de gravar</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {['Event · PagamentoRecebido', 'Listener', 'Job · emitir fatura', 'Worker'].map((a, i, todos) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <motion.div style={{ border: `1.5px dashed ${LARANJA}`, borderRadius: 14, padding: '16px 24px', fontSize: 20, fontWeight: 700 }}
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity }}>{a}</motion.div>
                  {i < todos.length - 1 && <span style={{ color: LARANJA, fontSize: 30 }}>→</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </>
    );
  },
};

/* ───────────── 7. A pasta src/: uma árvore que abre e fecha ───────────── */
type Linha = { t: string; nota?: string; cor?: 'laranja' | 'cinza' };

function Ramo({ nome, aberto, nivel, resumo, linhas, cor }: { nome: string; aberto: boolean; nivel: number; resumo: string; linhas: Linha[]; cor?: 'laranja' }) {
  return (
    <div style={{ paddingLeft: nivel * 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
        <motion.span style={{ display: 'inline-block', color: LARANJA }} animate={{ rotate: aberto ? 90 : 0 }}>▸</motion.span>
        <span style={{ color: cor ? LARANJA : '#f5f5f5', fontWeight: 700 }}>{nome}</span>
        {!aberto && <span className="cinza" style={{ fontSize: 16 }}>{resumo}</span>}
      </div>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45 }} style={{ overflow: 'hidden' }}>
            {linhas.map((l) => (
              <div key={l.t} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '3px 0', paddingLeft: 32 }}>
                <span style={{ color: l.cor === 'laranja' ? LARANJA : l.cor === 'cinza' ? '#8c8c8c' : '#f5f5f5' }}>{l.t}</span>
                {l.nota && <span className="chip" style={{ fontSize: 14, padding: '3px 10px', fontFamily: 'var(--letra)' }}>{l.nota}</span>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ficheirosShared: Linha[] = [
  { t: 'db.ts', nota: 'a mesma base de dados · runInTransaction' },
  { t: 'auth.ts', nota: 'quem és · autenticação' },
  { t: 'errors.ts', nota: 'erros iguais em todo o lado' },
  { t: 'queue.ts', nota: 'filas · BullMQ' },
  { t: 'events.ts', nota: 'eventos entre salas' },
  { t: 'modulo.ts', nota: 'o que cada sala entrega ao server' },
];
const ficheirosClientes: Linha[] = [
  { t: 'index.ts', nota: 'porta interna' },
  { t: 'clientes.routes.ts · clientes.controller.ts', nota: 'balcão' },
  { t: 'clientes.request.ts · clientes.policy.ts' },
  { t: 'clientes.service.ts · clientes.repository.ts' },
  { t: 'clientes.resource.ts' },
  { t: 'engine.port.ts', nota: 'porta de serviço' },
  { t: 'MODULE.md', nota: 'as regras da sala' },
];

const regras = [
  { de: 'modules', para: 'shared', ok: true, texto: 'as salas usam a receção' },
  { de: 'sala', para: 'outra sala', ok: true, texto: 'só pela porta interna' },
  { de: 'sala', para: 'legado', ok: true, texto: 'só pela porta de serviço' },
  { de: 'shared', para: 'modules', ok: false, texto: 'a receção nunca depende de uma sala' },
];

const pastaSrc: SlideDef = {
  id: 'pasta-src', titulo: 'A pasta src/', steps: 4,
  notas: 'Onde isto mora no código. O api_v1 de hoje fica como está. Seguinte: abre-se src/ e o shared, a receção: aqui vive o que todas as salas partilham, a ligação à mesma base de dados, a autenticação, os erros, as filas e os eventos. Seguinte: fecha-se o shared e abre-se modules: cada sala é uma pasta, sempre com a mesma forma. Seguinte: as regras de dependência, que a guarda do CI verifica sozinha.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Técnico · onde mora">A pasta src/</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: step >= 3 ? '1fr 560px' : '1fr 0px', gap: step >= 3 ? 30 : 0, transition: 'grid-template-columns 0.5s' }}>
        <div className="bloco" style={{ padding: '24px 30px', fontFamily: 'var(--mono)', fontSize: 20, minHeight: 560 }}>
          <div style={{ padding: '4px 0', fontWeight: 700 }}>api_v1/</div>
          <div style={{ paddingLeft: 30 }}>
            <div className="cinza" style={{ padding: '3px 0' }}>server.js · controllers/ · helpers/ · db/ <span className="chip" style={{ fontSize: 14, padding: '3px 10px', fontFamily: 'var(--letra)', marginLeft: 10 }}>o antigo, continua a funcionar</span></div>
            {step >= 1 && (
              <Reveal y={6}>
                <Ramo nome="src/" aberto nivel={0} resumo="" cor="laranja" linhas={[]} />
                <Ramo nome="shared/" aberto={step === 1} nivel={1} resumo="· 6 ficheiros · a receção" linhas={ficheirosShared} />
                <Ramo nome="modules/" aberto={step >= 2} nivel={1} resumo="· as salas" linhas={[]} />
                {step >= 2 && (
                  <div style={{ paddingLeft: 30 }}>
                    <Ramo nome="clientes/" aberto nivel={1} resumo="" cor="laranja" linhas={ficheirosClientes} />
                    <Ramo nome="faturacao/  cobrancas/  acessos/" aberto={false} nivel={1} resumo="· a mesma forma" linhas={[]} />
                  </div>
                )}
              </Reveal>
            )}
          </div>
        </div>
        {step >= 3 && (
          <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            {regras.map((r, i) => (
              <Reveal key={r.texto} delay={i * 0.15} className="bloco" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16, border: `1.5px solid ${r.ok ? '#3a3a3a' : VERMELHO}` }}>
                <span style={{ color: r.ok ? LARANJA : VERMELHO }}>{r.ok ? Icone.visto(32) : Icone.cruz(32)}</span>
                <div>
                  <p className="mono" style={{ margin: 0, fontSize: 18 }}>{r.de} → {r.para}</p>
                  <p className="cinza" style={{ margin: '4px 0 0', fontSize: 16 }}>{r.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  ),
};

/* ───────────── 8. A hora de ponta: hoje e com o novo modelo ───────────── */
function grafoNovo() {
  const nos: Node[] = [
    { id: 'app', position: { x: 0, y: 0 }, data: { label: 'App · 0,4 s' }, className: 'no cliente calmo' },
    { id: 'torn', position: { x: 330, y: 0 }, data: { label: 'Torniquetes · a passar' }, className: 'no cliente calmo' },
    { id: 'balcao', position: { x: 660, y: 0 }, data: { label: 'Balcão · normal' }, className: 'no cliente calmo' },
    { id: 'api', position: { x: 330, y: 150 }, data: { label: 'API · receção e balcões' }, className: 'no novo' },
    { id: 'clientes', position: { x: 0, y: 300 }, data: { label: 'Sala Clientes' }, className: 'no novo' },
    { id: 'cobrancas', position: { x: 330, y: 300 }, data: { label: 'Sala Cobranças' }, className: 'no novo' },
    { id: 'acessos', position: { x: 660, y: 300 }, data: { label: 'Sala Acessos' }, className: 'no novo' },
    { id: 'pg', position: { x: 330, y: 470 }, data: { label: 'Postgres · escritas · folga' }, className: 'no calmo' },
    { id: 'relatorios', position: { x: 1000, y: 150 }, data: { label: 'Relatórios e listas' }, className: 'no' },
    { id: 'replica', position: { x: 1000, y: 470 }, data: { label: 'Réplica · só leituras' }, className: 'no novo' },
    { id: 'agenda', position: { x: -360, y: 150 }, data: { label: 'Agenda · já separada ✓' }, className: 'no calmo' },
    { id: 'fila', position: { x: -360, y: 300 }, data: { label: 'Fila · SAF-T, remessas' }, className: 'no' },
    { id: 'worker', position: { x: -360, y: 470 }, data: { label: 'Worker · 2 de cada vez · à noite' }, className: 'no novo' },
  ];
  const a = (id: string, source: string, target: string, carga: number, opcoes: { label?: string; tracejada?: boolean; lenta?: boolean } = {}): Edge<DadosAresta> => ({
    id, source, target, type: 'viva', label: opcoes.label,
    data: { carga, dur: opcoes.lenta ? 4 : 2, cor: opcoes.lenta ? '#8c8c8c' : LARANJA },
    style: { stroke: opcoes.tracejada ? '#666' : '#777', strokeWidth: 2, strokeDasharray: opcoes.tracejada ? '8 6' : undefined },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#777' },
    labelStyle: { fill: '#bdbdbd', fontSize: 14, fontWeight: 600 },
    labelBgPadding: [6, 4],
  });
  const arestas = [
    a('c1', 'app', 'api', 3), a('c2', 'torn', 'api', 3), a('c3', 'balcao', 'api', 3),
    a('s1', 'api', 'clientes', 2), a('s2', 'api', 'cobrancas', 2), a('s3', 'api', 'acessos', 2),
    a('p1', 'clientes', 'pg', 1), a('p2', 'cobrancas', 'pg', 1), a('p3', 'acessos', 'pg', 1),
    a('r1', 'api', 'relatorios', 1), a('r2', 'relatorios', 'replica', 2, { label: 'leituras pesadas' }),
    a('r3', 'pg', 'replica', 1, { label: 'cópia contínua', tracejada: true, lenta: true }),
    a('w1', 'agenda', 'fila', 1, { lenta: true }), a('w2', 'fila', 'worker', 1, { lenta: true }),
    a('w3', 'worker', 'pg', 1, { tracejada: true, lenta: true, label: 'fora da hora de ponta' }),
  ];
  return { nos, arestas };
}

function MapaSimples({ nos: nosIniciais, arestas: arestasIniciais }: { nos: Node[]; arestas: Edge<DadosAresta>[] }) {
  const [nos, , mudarNos] = useNodesState(nosIniciais);
  const [arestas] = useEdgesState(arestasIniciais);
  return (
    <ReactFlow nodes={nos} edges={arestas} onNodesChange={mudarNos} edgeTypes={tiposDeAresta} fitView fitViewOptions={{ padding: 0.1 }}
      nodesConnectable={false} minZoom={0.3} maxZoom={3}>
      <Controls showInteractive={false} position="bottom-left" />
    </ReactFlow>
  );
}

function AntesDepois({ step }: { step: number }) {
  const [escolha, setEscolha] = useState<'hoje' | 'novo' | null>(null);
  useEffect(() => setEscolha(null), [step]);
  const modo = escolha ?? (step >= 1 ? 'novo' : 'hoje');
  const g = modo === 'hoje' ? grafo(true) : grafoNovo();
  return (
    <div className="fluxo">
      <MapaSimples key={modo} nos={g.nos} arestas={g.arestas} />
      <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 5 }} className="bloco">
        <div style={{ padding: '12px 18px' }}>
          <p className="rotulo" style={{ margin: 0, fontSize: 12 }}>18h · tempo de resposta</p>
          <motion.p style={{ margin: '2px 0 0', fontSize: 38, fontWeight: 800 }} animate={{ color: modo === 'hoje' ? VERMELHO : LARANJA }}>{modo === 'hoje' ? '10 s' : '0,4 s'}</motion.p>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 5, display: 'flex', gap: 10 }}>
        <button className="botao" style={modo === 'hoje' ? { background: VERMELHO, borderColor: VERMELHO, color: '#fff' } : undefined} onClick={() => setEscolha('hoje')}>Hoje</button>
        <button className={`botao ${modo === 'novo' ? 'ativo' : ''}`} onClick={() => setEscolha('novo')}>Novo modelo</button>
      </div>
    </div>
  );
}

const antesDepois: SlideDef = {
  id: 'antes-depois', titulo: 'Hora de ponta: hoje e com o novo modelo', steps: 2, interativo: true,
  notas: 'A mesma hora de ponta, as 18h, hoje e com o novo modelo. Os tempos são os medidos no painel da DigitalOcean: menos de meio segundo num dia normal, picos de 10 segundos na hora de ponta. A agenda dos crons já está separada da API, foi o primeiro passo que a equipa deu. Hoje: o vaivém entre controllers e helpers, os lotes e as leituras pesadas, tudo no mesmo Postgres, que vai aos 100%, e as pessoas à espera. Seguinte (ou o botão): com o novo modelo, a API só atende pedidos e entrega-os às salas; o pesado, como o SAF-T e as remessas, vai para a fila e o worker trata dele fora da hora de ponta; os relatórios e as listas leem de uma réplica. O Postgres principal fica com folga, e a app responde em décimas de segundo. Também se pode arrastar e fazer zoom.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Técnico · antes e depois">Hora de ponta: hoje e com o novo modelo</Titulo>
      <AntesDepois step={step} />
    </>
  ),
};

/* ───────────── 9. Migrar o que já existe: clientes ───────────── */
const pecas = [
  { t: 'routes/user.js', de: { x: 30, y: 70 }, para: { x: 980, y: 70 } },
  { t: 'controllers/user/', de: { x: 240, y: 140 }, para: { x: 980, y: 120 } },
  { t: 'helpers/clientCode.js · 3.215 linhas', de: { x: 40, y: 210 }, para: { x: 980, y: 205 } },
  { t: 'helpers/fichaName.js', de: { x: 270, y: 280 }, para: { x: 980, y: 255 } },
  { t: 'selectClientsByBranchIDQueryV3.js', de: { x: 50, y: 350 }, para: { x: 980, y: 340 } },
];
const ranhuras = [
  { nome: 'Balcão', y: 50, h: 120 },
  { nome: 'Service', y: 185, h: 120 },
  { nome: 'Repository', y: 320, h: 70 },
  { nome: 'Porta interna', y: 405, h: 55, laranja: true },
];
const quando = [
  { t: 'bug pequeno', d: 'corrige-se onde está' },
  { t: 'peça crítica', d: 'muda para o módulo novo, com plano' },
  { t: 'mudança grande', d: 'faz-se já no módulo novo' },
];

const migrar: SlideDef = {
  id: 'migrar', titulo: 'Migrar o que já existe: clientes', steps: 2,
  notas: 'E o que já existe? Exemplo: clientes. Hoje, o código de clientes está espalhado pelo prédio antigo: rotas, controllers, helpers enormes como o clientCode com 3.215 linhas, queries. Seguinte: a migração toda numa animação. As peças mudam-se para a sala Clientes, cada uma para a sua camada. Quem usava o antigo, como a faturação ou o CRM, passa a pedir pela porta interna. E só no fim se apaga o antigo. Quando é que isto acontece? Em baixo: um bug pequeno corrige-se onde está, sem migrar. As peças críticas migram com plano, pela Frente Plataforma. E quando é preciso fazer uma mudança grande numa peça antiga, aproveita-se e faz-se já na sala nova. Nunca tudo de uma vez.',
  render: ({ step }) => {
    const anima = step >= 1;
    return (
      <>
        <Titulo kicker="E o que já existe?">Migrar o que já existe: clientes</Titulo>
        <div style={{ position: 'relative', height: 560 }}>
          <div className="bloco" style={{ position: 'absolute', left: 0, top: 0, width: 600, height: 400, border: '2px dashed #3a3a3a' }}>
            <p className="rotulo" style={{ margin: '16px 0 0 22px' }}>prédio antigo · hoje</p>
            {anima && pecas.map((p, i) => (
              <motion.div key={p.t} style={{ position: 'absolute', left: p.de.x, top: p.de.y + 6, display: 'flex', alignItems: 'center', gap: 8, color: LARANJA, fontSize: 15 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4 + i * 0.12 }}>{Icone.visto(22)} apagado do antigo</motion.div>
            ))}
          </div>
          <div className="bloco-laranja" style={{ position: 'absolute', left: 760, top: 0, width: 648, height: 480 }}>
            <p className="rotulo laranja" style={{ margin: '16px 0 0 22px' }}>sala clientes · src/modules/clientes</p>
            {ranhuras.map((r) => (
              <motion.div key={r.nome} style={{ position: 'absolute', left: 20, right: 20, top: r.y, height: r.h, borderRadius: 12, border: `1px ${r.laranja ? 'solid' : 'dashed'} ${r.laranja ? LARANJA : '#444'}`, padding: '10px 14px', fontSize: 16, fontWeight: 600 }}
                animate={r.laranja && anima ? { backgroundColor: LARANJA, color: '#000' } : { backgroundColor: 'rgba(0,0,0,0)', color: '#9a9a9a' }}
                transition={{ delay: r.laranja && anima ? 2.2 : 0 }}>
                {r.nome}{r.laranja && ' · lerCliente()'}
              </motion.div>
            ))}
          </div>
          {pecas.map((p, i) => (
            <motion.div key={p.t} className="chip" style={{ position: 'absolute', fontSize: 14, fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}
              initial={{ left: p.de.x, top: p.de.y }}
              animate={anima ? { left: p.para.x, top: p.para.y } : { left: p.de.x, top: p.de.y }}
              transition={{ duration: 0.9, delay: anima ? 0.2 + i * 0.3 : 0, ease: 'easeInOut' }}>
              {p.t}
            </motion.div>
          ))}
          <Reveal show={anima} delay={2.4} style={{ position: 'absolute', left: 0, top: 425, display: 'flex', alignItems: 'center', gap: 12 }}>
            {['faturação', 'CRM', 'acessos'].map((q) => <span key={q} className="chip">{q}</span>)}
            <motion.span style={{ color: LARANJA, fontSize: 30 }} animate={{ x: [0, 12, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
            <span className="cinza" style={{ fontSize: 17 }}>passam a pedir pela porta interna</span>
          </Reveal>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 505, display: 'flex', gap: 12 }}>
            <span className="rotulo" style={{ alignSelf: 'center', marginRight: 6 }}>quando?</span>
            {quando.map((q) => (
              <span key={q.t} className="chip" style={{ fontSize: 16, whiteSpace: 'nowrap' }}><strong className="laranja">{q.t}</strong>&nbsp;→ {q.d}</span>
            ))}
          </div>
        </div>
      </>
    );
  },
};

/* ───────────── 10. Mudar uma peça sem partir as outras ───────────── */
const areas = ['Clientes', 'Pagamentos', 'Faturação', 'Acessos', 'Planos', 'CRM'];
const posicoes = areas.map((_, i) => {
  const ang = (i / areas.length) * Math.PI * 2 - Math.PI / 2;
  return { x: 330 + Math.cos(ang) * 150, y: 200 + Math.sin(ang) * 150 };
});
const IDX_FATURACAO = 2;

function PainelHoje({ ativo }: { ativo: boolean }) {
  return (
    <svg width="660" height="400">
      {posicoes.flatMap((p, i) => posicoes.slice(i + 1).map((q, j) => (
        <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#3a3a3a" strokeWidth="1.5" />
      )))}
      {ativo && [0, 1, 2].map((k) => (
        <motion.circle key={k} cx={posicoes[IDX_FATURACAO].x} cy={posicoes[IDX_FATURACAO].y} fill="none" stroke={VERMELHO} strokeWidth="3"
          initial={{ r: 10, opacity: 1 }} animate={{ r: 330, opacity: 0 }} transition={{ duration: 1.8, delay: k * 0.5, repeat: Infinity }} />
      ))}
      {posicoes.map((p, i) => (
        <g key={i}>
          <motion.circle cx={p.x} cy={p.y} r={44} initial={{ fill: '#1d1d1d' }}
            animate={{ fill: ativo ? (i === IDX_FATURACAO ? LARANJA : ['#1d1d1d', VERMELHO, '#1d1d1d']) : '#1d1d1d' }}
            transition={ativo && i !== IDX_FATURACAO ? { duration: 1.2, delay: 0.4 + i * 0.15, repeat: Infinity } : {}}
            stroke="#555" strokeWidth="1.5" />
          <text x={p.x} y={p.y + 6} textAnchor="middle" fill="#f5f5f5" fontSize="15" fontWeight="600">{areas[i]}</text>
        </g>
      ))}
    </svg>
  );
}

function PainelSalas({ ativo }: { ativo: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, padding: '40px 20px', height: 400, alignContent: 'center' }}>
      {areas.map((nome, i) => (
        <motion.div key={nome} style={{ position: 'relative', height: 130, borderRadius: 16, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}
          animate={{ borderColor: ativo && i === IDX_FATURACAO ? LARANJA : '#3a3a3a', backgroundColor: ativo && i === IDX_FATURACAO ? 'rgba(255,107,0,0.18)' : '#141414' }}>
          {nome}
          <motion.span style={{ position: 'absolute', top: 10, right: 10, color: i === IDX_FATURACAO ? LARANJA : '#f5f5f5' }} initial={{ scale: 0 }} animate={{ scale: ativo ? 1 : 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
            {i === IDX_FATURACAO ? <span className="chip chip-laranja" style={{ fontSize: 13, padding: '4px 10px' }}>mudou</span> : Icone.visto(26)}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

const isolamento: SlideDef = {
  id: 'isolamento', titulo: 'Mudar uma peça sem partir as outras', steps: 2,
  notas: 'O ganho mais importante para quem programa. Hoje, as áreas estão todas ligadas entre si: uma mudança na faturação propaga-se a clientes, pagamentos, acessos, e é aí que aparecem os erros que ninguém esperava. Seguinte: com salas separadas, a faturação muda por dentro e as outras ficam exatamente como estavam.',
  render: ({ step }) => (
    <>
      <Titulo kicker="O ganho principal">Mudar uma peça sem partir as outras</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div>
          <p className="rotulo" style={{ margin: 0 }}>hoje · uma mudança, tudo mexe</p>
          <PainelHoje ativo />
        </div>
        <div>
          <p className="rotulo laranja" style={{ margin: 0 }}>com salas · uma mudança, uma sala</p>
          <PainelSalas ativo={step >= 1} />
        </div>
      </div>
    </>
  ),
};

/* ───────────── 11. SOLID, com o exemplo da dependência ───────────── */
const solid = [
  { l: 'S', nome: 'Single responsibility', ex: 'balcão, regra e dados em peças separadas' },
  { l: 'O', nome: 'Open / closed', ex: 'novo país = peça nova, o resto não muda' },
  { l: 'L', nome: 'Liskov', ex: 'Vendus ou VeriFactu encaixam no mesmo sítio' },
  { l: 'I', nome: 'Interface segregation', ex: 'a porta interna só mostra o necessário' },
  { l: 'D', nome: 'Dependency inversion', ex: 'as salas usam portas, nunca o interior' },
];

function DemoDependencia() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 140px 1fr 260px', alignItems: 'center', gap: 20 }}>
      <div className="bloco" style={{ padding: '22px 24px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Sala Faturação</p>
        <p className="mono cinza" style={{ margin: '8px 0 0', fontSize: 15 }}>lerCliente(id)</p>
      </div>
      <motion.div style={{ height: 4, background: LARANJA, borderRadius: 2, transformOrigin: 'left' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6 }} />
      <div className="bloco" style={{ padding: 14, display: 'grid', gridTemplateColumns: '150px 1fr', gap: 14, alignItems: 'stretch' }}>
        <div style={{ borderRadius: 10, background: LARANJA, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, textAlign: 'center', padding: 8 }}>porta interna<br />não muda</div>
        <motion.div style={{ borderRadius: 10, border: '1.5px dashed', padding: '14px 16px', fontSize: 16 }}
          animate={{ borderColor: ['#444', LARANJA, '#444'] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <strong>Sala Clientes</strong>
          <p className="cinza" style={{ margin: '6px 0 0', fontSize: 15 }}>service e repository mudam por dentro</p>
        </motion.div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 20, fontWeight: 700 }}>
        <span className="laranja">{Icone.visto(34)}</span> a faturação não muda nada
      </div>
    </div>
  );
}

const solidSlide: SlideDef = {
  id: 'solid', titulo: 'SOLID', steps: 2,
  notas: 'Nada disto é invenção: são os princípios SOLID, ensinados em todo o mundo. S: cada peça tem um trabalho, o balcão não faz contas. O: o ginásio cresce sem mexer no que funciona. L: peças trocáveis, como Vendus e VeriFactu. I: a porta interna mostra só o necessário. D: as salas dependem das portas, nunca do interior umas das outras. Seguinte: o exemplo. A faturação precisa de dados de clientes e pede-os pela porta interna, lerCliente. Se a sala Clientes reorganizar o service ou o repository por dentro, a porta continua igual, e a faturação não muda uma linha.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Técnico · fundamentos">SOLID</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
        {solid.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.15} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 140, fontWeight: 800, lineHeight: 1, color: i % 2 ? 'var(--branco)' : LARANJA }}>{s.l}</div>
            <p style={{ fontSize: 19, fontWeight: 700, margin: '14px 0 10px' }}>{s.nome}</p>
            <p className="cinza" style={{ fontSize: 16, margin: 0, lineHeight: 1.4 }}>{s.ex}</p>
          </Reveal>
        ))}
      </div>
      <Reveal show={step >= 1} style={{ marginTop: 44 }}>
        <p className="rotulo" style={{ margin: '0 0 16px' }}>na prática · a dependência é só da porta</p>
        {step >= 1 && <DemoDependencia />}
      </Reveal>
    </>
  ),
};

/* ───────────── 12. Padrões de projeto na prática ───────────── */
function DemoFacade() {
  return (
    <div style={{ position: 'relative', width: 300, height: 230, margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '2px solid #3a3a3a', background: '#141414' }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i} style={{ position: 'absolute', left: 110 + (i % 4) * 44, top: 30 + Math.floor(i / 4) * 80, width: 34, height: 34, borderRadius: 8, background: '#2a2a2a' }}
          animate={{ background: ['#2a2a2a', '#555', '#2a2a2a'] }} transition={{ duration: 1, delay: 1 + i * 0.1, repeat: Infinity, repeatDelay: 2 }} />
      ))}
      <div style={{ position: 'absolute', left: 16, top: 70, width: 80, height: 90, borderRadius: 10, background: LARANJA, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>lerCliente()</div>
      <motion.div style={{ position: 'absolute', top: 108, width: 16, height: 16, borderRadius: 8, background: '#f5f5f5' }}
        animate={{ left: [-60, 8, 8, -60] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.7, 1] }} />
    </div>
  );
}

function DemoAdapter() {
  const destinos = ['Vendus', 'VeriFactu', 'Santander'];
  return (
    <div style={{ position: 'relative', width: 340, height: 230, margin: '0 auto' }}>
      <div style={{ position: 'absolute', left: 0, top: 85, width: 90, height: 60, borderRadius: 10, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>o nosso</div>
      <div style={{ position: 'absolute', left: 125, top: 75, width: 80, height: 80, borderRadius: 40, border: `3px solid ${LARANJA}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: LARANJA, fontSize: 14, fontWeight: 700 }}>adapter</div>
      {destinos.map((d, i) => (
        <div key={d} style={{ position: 'absolute', left: 240, top: 15 + i * 75, width: 100, height: 50, borderRadius: 10, border: '1.5px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>{d}</div>
      ))}
      {destinos.map((_, i) => (
        <motion.div key={i} style={{ position: 'absolute', width: 12, height: 12, borderRadius: 6, background: LARANJA }}
          animate={{ left: [90, 160, 240], top: [109, 109, 34 + i * 75] }} transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }} />
      ))}
    </div>
  );
}

const paisesBase = ['PT', 'ES'];
const paisesNovos = ['FR', 'IT', 'BR', 'UK'];

function DemoStrategy({ comNovos }: { comNovos: boolean }) {
  const paises = comNovos ? [...paisesBase, ...paisesNovos] : paisesBase;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ width: 110, height: 110, borderRadius: 16, border: '2px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700 }}>Service</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 88px)', gap: 10 }}>
        {paises.map((p, i) => {
          const novo = paisesNovos.includes(p);
          return (
            <motion.div key={p} style={{ height: 50, borderRadius: 10, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: novo ? LARANJA : '#f5f5f5' }}
              initial={novo ? { opacity: 0, scale: 0.4 } : false}
              animate={{ opacity: 1, scale: 1, borderColor: ['#3a3a3a', LARANJA, '#3a3a3a'] }}
              transition={{ borderColor: { duration: 0.9, delay: i * 0.9, repeat: Infinity, repeatDelay: (paises.length - 1) * 0.9 }, opacity: { delay: novo ? (i - 2) * 0.25 : 0 }, scale: { delay: novo ? (i - 2) * 0.25 : 0, type: 'spring' } }}>
              {p}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const padroesNaPratica: SlideDef = {
  id: 'padroes', titulo: 'Padrões de projeto na prática', steps: 2,
  notas: 'Três padrões de projeto que vamos usar, todos documentados no refactoring.guru. Facade: uma porta simples à frente de muita coisa; é o index.ts de cada sala, quem chama só vê lerCliente e não precisa de conhecer o interior. Adapter: traduz o nosso formato para o de cada fornecedor; a sala de faturação fala com a Vendus e com o VeriFactu, a de cobranças com o Santander, e trocar de fornecedor é trocar um adapter. Strategy: a regra que muda por país vive em peças separadas com o mesmo encaixe; o service pede a peça do país e usa-a. Seguinte: e se amanhã formos para França, Itália, Brasil ou Inglaterra? É mais uma peça cada; o service não muda.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Técnico · padrões de projeto">Padrões de projeto na prática</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
        {[
          { nome: 'Facade', onde: 'a porta interna de cada sala', demo: <DemoFacade /> },
          { nome: 'Adapter', onde: 'faturação e cobranças', demo: <DemoAdapter /> },
          { nome: 'Strategy', onde: 'regras que mudam por país', demo: <DemoStrategy comNovos={step >= 1} /> },
        ].map((p, i) => (
          <Reveal key={p.nome} delay={i * 0.15} className="bloco" style={{ padding: '30px 24px', textAlign: 'center' }}>
            <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.demo}</div>
            <p style={{ fontSize: 34, fontWeight: 800, margin: '22px 0 8px' }}>{p.nome}</p>
            <p className="rotulo" style={{ margin: 0 }}>{p.onde}</p>
          </Reveal>
        ))}
      </div>
    </>
  ),
};

export const acto2: SlideDef[] = [caminhos, ginasio, viagem, pastaSrc, antesDepois, migrar, isolamento, solidSlide, padroesNaPratica];
