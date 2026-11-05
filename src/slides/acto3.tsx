import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Icone, Reveal, Titulo } from '../components.tsx';
import type { SlideDef } from '../types.ts';

const LARANJA = '#ff6b00';
const VERMELHO = '#ef4444';

/* ───────────── 13. Um código, três motores ───────────── */
function Engrenagem({ tamanho, velocidade, cor = '#f5f5f5' }: { tamanho: number; velocidade: number; cor?: string }) {
  return (
    <motion.svg width={tamanho} height={tamanho} viewBox="0 0 100 100" animate={{ rotate: 360 }} transition={{ duration: velocidade, repeat: Infinity, ease: 'linear' }}>
      <circle cx="50" cy="50" r="38" fill="none" stroke={cor} strokeWidth="14" strokeDasharray="10 7" />
      <circle cx="50" cy="50" r="16" fill="none" stroke={cor} strokeWidth="5" />
    </motion.svg>
  );
}

const TOTAL_FILA = 40;

/** A fila da 1.ª segunda-feira: enche de uma vez e o worker esvazia-a dois de cada vez. */
function FilaDoMes({ ativa }: { ativa: boolean }) {
  const [restam, setRestam] = useState(TOTAL_FILA);
  useEffect(() => {
    if (!ativa) { setRestam(TOTAL_FILA); return; }
    let atual = TOTAL_FILA;
    const t = setInterval(() => {
      atual = atual <= 0 ? TOTAL_FILA : atual - 2;
      setRestam(atual);
    }, 260);
    return () => clearInterval(t);
  }, [ativa]);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 22px)', gap: 6 }}>
        {Array.from({ length: TOTAL_FILA }).map((_, i) => (
          <motion.div key={i} style={{ width: 22, height: 22, borderRadius: 5 }} animate={{ background: i < restam ? LARANJA : '#222' }} transition={{ duration: 0.15 }} />
        ))}
      </div>
      <p className="mono" style={{ fontSize: 18, margin: '12px 0 0' }}>fila: {restam} · <span className="cinza">2 de cada vez</span></p>
    </div>
  );
}

const motores: SlideDef = {
  id: 'motores', titulo: 'Um código, três motores', steps: 3,
  notas: 'Aqui a equipa já deu o primeiro passo: na DigitalOcean os crons já correm num componente próprio, separado da API. O próximo passo é o worker: hoje as filas ainda correm dentro dos contentores da API. O mesmo código corre em três papéis separados. A API só atende pedidos ao vivo. A agenda só marca o que fazer e mete na fila. O worker processa a fila. Seguinte: a primeira segunda-feira do mês, quando se emite o SAF-T e se fazem as remessas de todos os centros ao mesmo tempo. Hoje isso compete com os pagamentos ao vivo. No novo modelo, vai tudo para a fila e o worker trata dois de cada vez, enquanto a API continua rápida. Seguinte: o que puder esperar corre de noite, e os relatórios e listas pesadas leem de uma réplica, que mostramos já a seguir.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Técnico · como corre">Um código, três motores</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 50, alignItems: 'start' }}>
        <Reveal className="bloco" style={{ padding: 30, textAlign: 'center' }}>
          <Engrenagem tamanho={180} velocidade={2.2} />
          <p style={{ fontSize: 30, fontWeight: 700, margin: '14px 0 4px' }}>API</p>
          <p className="rotulo" style={{ margin: 0 }}>pedidos ao vivo</p>
          {step >= 1 && <motion.span className="chip" style={{ marginTop: 18, fontSize: 15 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{Icone.visto(18)} continua rápida</motion.span>}
        </Reveal>
        <Reveal delay={0.15} className="bloco" style={{ padding: 30 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 170px', alignItems: 'center', gap: 26 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: step >= 2 ? '#f5f5f5' : LARANJA }}>{step >= 2 ? Icone.lua(90) : Icone.sol(90)}</div>
              <p style={{ fontSize: 26, fontWeight: 700, margin: '10px 0 0' }}>Agenda</p>
              <p className="rotulo" style={{ margin: 0 }}>marca</p>
              <span className="chip" style={{ marginTop: 10, fontSize: 13, padding: '5px 10px' }}><span className="laranja">{Icone.visto(14)}</span> já separada</span>
            </div>
            <div>
              {step >= 1 ? (
                <>
                  <span className="chip chip-laranja" style={{ fontSize: 15, marginBottom: 16 }}>1.ª segunda do mês · SAF-T + remessas de todos os centros</span>
                  <FilaDoMes ativa={step >= 1} />
                </>
              ) : (
                <div style={{ position: 'relative', height: 40 }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 18, height: 4, background: '#2a2a2a', borderRadius: 2 }} />
                  {[0, 1, 2].map((k) => (
                    <motion.div key={k} style={{ position: 'absolute', top: 8, width: 24, height: 24, borderRadius: 6, background: LARANJA }}
                      animate={{ left: ['0%', '92%'] }} transition={{ duration: 2.4, delay: k * 0.8, repeat: Infinity, ease: 'linear' }} />
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Engrenagem tamanho={130} velocidade={3.2} cor={LARANJA} />
              <p style={{ fontSize: 26, fontWeight: 700, margin: '10px 0 0' }}>Worker</p>
              <p className="rotulo" style={{ margin: 0 }}>processa</p>
              <span className="chip" style={{ marginTop: 10, fontSize: 13, padding: '5px 10px' }}>o próximo passo</span>
            </div>
          </div>
        </Reveal>
      </div>
      <Reveal show={step >= 2} style={{ display: 'flex', gap: 14, marginTop: 30 }}>
        <span className="chip chip-laranja" style={{ fontSize: 19 }}>{Icone.lua(20)} o que pode esperar · 23h–7h</span>
        <span className="chip" style={{ fontSize: 19 }}>poucos de cada vez</span>
        <span className="chip" style={{ fontSize: 19 }}>relatórios numa cópia da base (réplica)</span>
      </Reveal>
    </>
  ),
};

/* ───────────── 14. Réplica: um espelho para as leituras pesadas ───────────── */
function Cilindro({ cor, tamanho = 70 }: { cor: string; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho * 1.1} viewBox="0 0 60 66">
      <path d="M4 12 V54 C4 62 56 62 56 54 V12" fill="none" stroke={cor} strokeWidth="4" />
      <path d="M4 33 C4 41 56 41 56 33" fill="none" stroke={cor} strokeWidth="4" />
      <ellipse cx="30" cy="12" rx="26" ry="8" fill="none" stroke={cor} strokeWidth="4" />
    </svg>
  );
}

function Carga({ valor, cor }: { valor: number; cor: string }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ height: 12, borderRadius: 6, background: '#2a2a2a', overflow: 'hidden' }}>
        <motion.div style={{ height: '100%', borderRadius: 6 }} animate={{ width: `${valor}%`, background: cor }} transition={{ duration: 0.8 }} />
      </div>
      <p className="mono" style={{ margin: '6px 0 0', fontSize: 16, color: cor }}>carga {valor}%</p>
    </div>
  );
}

/** Bolinhas a correr por um caminho SVG; começam já espalhadas (begin negativo). */
function Fluxo({ d, n, cor, r, dur, visivel = true }: { d: string; n: number; cor: string; r: number; dur: number; visivel?: boolean }) {
  return (
    <motion.g animate={{ opacity: visivel ? 1 : 0 }} transition={{ duration: 0.5 }}>
      <path d={d} fill="none" stroke={cor} strokeOpacity="0.35" strokeWidth="3" />
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} r={r} fill={cor}>
          <animateMotion dur={`${dur}s`} begin={`-${(i * dur) / n}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}
    </motion.g>
  );
}

const C_APP = 'M330,70 C420,70 420,170 500,170';
const C_PESADO_PRINCIPAL = 'M330,320 C420,320 420,240 500,240';
const C_PESADO_REPLICA = 'M330,320 C500,395 1090,400 1238,282';
const C_ESPELHO = 'M840,195 L1068,195';

function Espelho({ step }: { step: number }) {
  const [escolha, setEscolha] = useState<boolean | null>(null);
  useEffect(() => setEscolha(null), [step]);
  const com = escolha ?? step >= 1;
  return (
    <>
      <div style={{ position: 'absolute', top: 64, right: 96, display: 'flex', gap: 10, zIndex: 5 }}>
        <button className="botao" style={!com ? { background: VERMELHO, borderColor: VERMELHO, color: '#fff' } : undefined} onClick={() => setEscolha(false)}>Sem réplica</button>
        <button className={`botao ${com ? 'ativo' : ''}`} onClick={() => setEscolha(true)}>Com réplica</button>
      </div>
      <div style={{ position: 'relative', height: 400 }}>
        <svg width="1408" height="400" style={{ position: 'absolute', inset: 0 }}>
          <Fluxo d={C_APP} n={6} cor="#f5f5f5" r={6} dur={1.4} />
          <Fluxo d={C_PESADO_PRINCIPAL} n={10} cor={VERMELHO} r={10} dur={2.6} visivel={!com} />
          <Fluxo d={C_PESADO_REPLICA} n={10} cor={LARANJA} r={10} dur={3.4} visivel={com} />
          <Fluxo d={C_ESPELHO} n={4} cor={LARANJA} r={5} dur={0.9} visivel={com} />
          <motion.g animate={{ opacity: com ? 1 : 0 }}>
            <text x="954" y="178" textAnchor="middle" fill={LARANJA} fontSize="16" fontWeight="600" fontFamily="Poppins">cópia contínua</text>
            <text x="954" y="224" textAnchor="middle" fill={LARANJA} fontSize="16" fontWeight="600" fontFamily="Poppins">em milissegundos</text>
          </motion.g>
        </svg>

        <div className="bloco" style={{ position: 'absolute', left: 0, top: 10, width: 330, height: 120, padding: '18px 22px' }}>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>App · ao vivo</p>
          <p className="cinza" style={{ margin: '4px 0 0', fontSize: 16 }}>check-in, pagamentos, inscrições</p>
          <p style={{ margin: '8px 0 0', fontSize: 16 }}>resposta: <motion.strong animate={{ color: com ? LARANJA : VERMELHO }}>{com ? '0,4 s' : '10 s'}</motion.strong></p>
        </div>
        <motion.div className="bloco" style={{ position: 'absolute', left: 0, top: 260, width: 330, height: 120, padding: '18px 22px', border: '1.5px solid' }}
          animate={{ borderColor: com ? LARANJA : VERMELHO }}>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Leituras pesadas</p>
          <p className="cinza" style={{ margin: '4px 0 0', fontSize: 16 }}>SAF-T, relatórios, exportações</p>
          <p style={{ margin: '8px 0 0', fontSize: 16 }}>só leem, mas milhares de linhas</p>
        </motion.div>

        <motion.div className="bloco" style={{ position: 'absolute', left: 500, top: 110, width: 340, height: 170, padding: '18px 22px', display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14, alignItems: 'center', border: '2px solid' }}
          animate={{ borderColor: com ? '#f5f5f5' : VERMELHO, backgroundColor: com ? '#141414' : 'rgba(239,68,68,0.16)' }}>
          <Cilindro cor={com ? '#f5f5f5' : VERMELHO} tamanho={60} />
          <div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, whiteSpace: 'nowrap' }}>Base principal</p>
            <p className="cinza" style={{ margin: '2px 0 0', fontSize: 15 }}>escreve e lê</p>
            <Carga valor={com ? 35 : 95} cor={com ? '#f5f5f5' : VERMELHO} />
          </div>
        </motion.div>

        <motion.div className="bloco" style={{ position: 'absolute', left: 1068, top: 110, width: 340, height: 170, padding: '18px 22px', display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14, alignItems: 'center', border: '2px dashed' }}
          animate={{ opacity: com ? 1 : 0.3, borderColor: com ? LARANJA : '#3a3a3a' }}>
          <Cilindro cor={com ? LARANJA : '#555'} tamanho={60} />
          <div>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Réplica</p>
            <p className="cinza" style={{ margin: '2px 0 0', fontSize: 15 }}>{com ? 'espelho · só leitura' : 'ainda não existe'}</p>
            {com && <Carga valor={60} cor={LARANJA} />}
          </div>
        </motion.div>
      </div>
    </>
  );
}

const replica: SlideDef = {
  id: 'replica', titulo: 'Réplica: um espelho para as leituras pesadas', steps: 3, interativo: true,
  notas: 'Na base de dados há dois tipos de trabalho. Em cima, a app ao vivo: check-in, pagamentos, inscrições. São pedidos pequenos, muitos, e precisam de resposta já. Em baixo, as leituras pesadas: o SAF-T, os relatórios, as exportações. Só leem, mas leem milhares de linhas. Hoje vão todos à mesma base, e na hora de ponta ela chega perto dos 100%: o check-in fica à espera do relatório. Seguinte (ou o botão): criamos uma réplica, um espelho da base principal. O próprio Postgres copia cada alteração para ela em milissegundos; não é outra base para manter, são os mesmos dados. As leituras pesadas passam a ir ao espelho, e a principal fica com folga para a app. Seguinte: um cuidado. Como há esse atraso de milissegundos, nunca se lê da réplica um dado que se acabou de escrever, como "gravei o pagamento, mostra-me o pagamento". Esses pedidos leem da principal. A réplica fica para leituras pesadas, onde meio segundo de atraso não interessa.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Técnico · base de dados">Um espelho para as leituras pesadas</Titulo>
      <Espelho step={step} />
      <Reveal show={step >= 2} className="bloco" style={{ marginTop: 22, padding: '18px 26px', display: 'grid', gridTemplateColumns: '44px 1fr 1fr', gap: 24, alignItems: 'center', border: '1.5px solid #f5f5f5' }}>
        <span className="laranja">{Icone.olho(40)}</span>
        <div>
          <p className="rotulo" style={{ margin: 0 }}>acabei de gravar</p>
          <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 600 }}>"gravei o pagamento, mostra-me o pagamento" → <span>lê da principal</span></p>
        </div>
        <div>
          <p className="rotulo laranja" style={{ margin: 0 }}>leitura pesada</p>
          <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 600 }}>meio segundo de atraso não interessa → <span className="laranja">lê da réplica</span></p>
        </div>
      </Reveal>
    </>
  ),
};

/* ───────────── 15. Por onde começamos: os seis pontos críticos ───────────── */
const criticos = [
  { nome: 'Remessas SEPA', ficheiro: 'generateRemesaController.js', porque: 'a saturação de 27/08 e os 19 lotes de 10/09', faz: 'job no worker, poucos de cada vez, fora da hora de ponta' },
  { nome: 'Leituras pesadas', ficheiro: 'selectClientsByBranchIDQueryV3.js', porque: 'a queda de 02/11', faz: 'repositories que leem da réplica, com o custo medido antes' },
  { nome: 'Costura da faturação', ficheiro: 'emitForPaymentService.js', porque: 'o VeriFactu precisa dela', faz: 'uma porta de faturação, uma estratégia por país' },
  { nome: 'Motor de pagamentos', ficheiro: 'billingCycleGenerator.js · 4.022 linhas', porque: 'todos os módulos novos lhe pedem coisas', faz: 'não se mexe por dentro: porta à frente dele' },
  { nome: 'Checkout unificado', ficheiro: 'unifiedCheckoutController.js', porque: 'a pré-venda do Superfit passa por aqui', faz: 'fachada à frente; por dentro, só depois de dezembro' },
  { nome: 'Permissões', ficheiro: 'checkPermission', porque: 'ainda abrem por omissão na maioria das filiais', faz: 'o Superfit nasce com permissões a fechar por omissão' },
];

const pontosCriticos: SlideDef = {
  id: 'criticos', titulo: 'Por onde começamos: seis pontos críticos', steps: 2,
  notas: 'Por onde começamos. Estes seis pontos foram identificados pela própria equipa, e cada um tem um porquê real. Seguinte: o que se faz em cada um, com as peças que vimos. As remessas SEPA passam a job no worker, poucas de cada vez e fora da hora de ponta. As leituras pesadas vão para a réplica. A faturação ganha uma porta com uma estratégia por país, que é o que o VeriFactu precisa. No motor de pagamentos não se mexe por dentro: constrói-se a porta à frente. O checkout ganha uma fachada, e só se parte por dentro depois de dezembro. E o Superfit nasce com as permissões a fechar por omissão. Em baixo, o ganho rápido que medimos: a consulta da agenda.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Por onde começamos">Seis pontos críticos</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
        {criticos.map((c, i) => (
          <Reveal key={c.nome} delay={i * 0.12} className="bloco" style={{ padding: '20px 24px', height: 232, display: 'flex', flexDirection: 'column', border: step >= 1 ? `1.5px solid ${LARANJA}` : '1px solid var(--linha)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: LARANJA }}>{i + 1}</span>
              <span style={{ fontSize: 23, fontWeight: 800 }}>{c.nome}</span>
            </div>
            <p className="mono cinza" style={{ margin: '4px 0 0', fontSize: 13 }}>{c.ficheiro}</p>
            <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.35 }}><span className="cinza">porquê · </span>{c.porque}</p>
            {step >= 1 && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                style={{ margin: 'auto 0 0', fontSize: 17, fontWeight: 700, lineHeight: 1.35, color: LARANJA }}>→ {c.faz}</motion.p>
            )}
          </Reveal>
        ))}
      </div>
      <Reveal show={step >= 1} delay={0.9} style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}>
        <span className="chip chip-laranja" style={{ fontSize: 17 }}>+ ganho rápido: a consulta da agenda, sem custo de infraestrutura</span>
      </Reveal>
    </>
  ),
};

/* ───────────── 16. Quem faz o quê, e o caminho do código ───────────── */
function Frente({ nome, rotulo, tarefas, laranja }: { nome: string; rotulo: string; tarefas: string[]; laranja?: boolean }) {
  return (
    <div className={laranja ? 'bloco-laranja' : 'bloco'} style={{ padding: '24px 30px', border: laranja ? undefined : '2px solid #f5f5f5' }}>
      <p className={`rotulo ${laranja ? 'laranja' : ''}`} style={{ margin: 0 }}>{rotulo}</p>
      <p style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 16px' }}>{nome}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{tarefas.map((t) => <span key={t} className="chip" style={{ fontSize: 15 }}>{t}</span>)}</div>
    </div>
  );
}

const ramos = [
  { nome: 'latest', y: 70, desc: 'todos trabalham aqui · só entra o que está fechado' },
  { nome: 'developer', y: 160, desc: 'simula num servidor' },
  { nome: 'main', y: 250, desc: 'produção' },
];
const features = [560, 780, 1000];

function Branches() {
  return (
    <div style={{ position: 'relative' }}>
      <svg width="1408" height="290" viewBox="0 0 1408 290">
        {ramos.map((r, i) => (
          <g key={r.nome}>
            <line x1="300" y1={r.y} x2="1400" y2={r.y} stroke={i === 0 ? LARANJA : i === 2 ? '#f5f5f5' : '#8c8c8c'} strokeWidth="4" strokeLinecap="round" />
            <text x="0" y={r.y - 4} fill="#f5f5f5" fontSize="26" fontWeight="800" fontFamily="Poppins">{r.nome}</text>
            <text x="0" y={r.y + 22} fill="#8c8c8c" fontSize="15" fontFamily="Poppins">{r.desc}</text>
          </g>
        ))}
        <text x="0" y="28" fill="#8c8c8c" fontSize="17" fontWeight="600" fontFamily="Poppins">a branch de cada pessoa</text>
        {features.map((x, i) => {
          const d = `M${x - 160},22 C${x - 90},22 ${x - 60},70 ${x},70`;
          return (
            <g key={x}>
              <path d={d} fill="none" stroke="#555" strokeWidth="3" strokeDasharray="6 6" />
              <circle r="8" fill={LARANJA}>
                <animateMotion dur="3s" begin={`-${i * 0.9}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}
        {[
          'M1040,70 C1080,70 1080,160 1120,160',
          'M1240,160 C1280,160 1280,250 1320,250',
        ].map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="#8c8c8c" strokeWidth="4" />
            <circle r="9" fill={i === 0 ? '#bdbdbd' : '#f5f5f5'}>
              <animateMotion dur="2.4s" begin={`-${1 + i * 1.2}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        ))}
      </svg>
      <span className="chip" style={{ position: 'absolute', left: 560, top: -34, fontSize: 15 }}>{Icone.olho(18)} PR · revisão + guarda no CI</span>
    </div>
  );
}

const quemFaz: SlideDef = {
  id: 'quem-faz', titulo: 'Quem faz o quê', steps: 2,
  notas: 'Duas frentes de trabalho, uma só equipa, e as pessoas podem rodar. A Frente Plataforma cuida da base: os clientes de hoje, a receção, a porta de serviço do motor antigo e a segurança. A Frente Crescimento constrói o que é novo. Seguinte: e o caminho do código, como o Rúben propôs. Cada pessoa trabalha na sua branch e só junta à latest o que está fechado, com revisão e a guarda do CI. Assim, todos testam o mesmo código em tempo real. Da latest vai para a developer, que simula num servidor, e daí para a main, que é produção.',
  render: ({ step }) => (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><Titulo kicker="Duas frentes, uma equipa">Quem faz o quê</Titulo></div>
        <Reveal delay={0.3}><span className="chip" style={{ fontSize: 17, marginTop: 30 }}>{Icone.pessoa(20)} papéis, não equipas</span></Reveal>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        <Reveal><Frente nome="Frente Plataforma" rotulo="a base" tarefas={['clientes de hoje', 'receção', 'porta de serviço', 'segurança']} /></Reveal>
        <Reveal delay={0.12}><Frente nome="Frente Crescimento" rotulo="o que é novo" tarefas={['funcionalidades novas', 'clientes novos', 'mercados novos']} laranja /></Reveal>
      </div>
      <Reveal show={step >= 1} style={{ marginTop: 56 }}>{step >= 1 && <Branches />}</Reveal>
    </>
  ),
};

/* ───────────── 15. Foco no backend ───────────── */
const foco: SlideDef = {
  id: 'foco', titulo: 'Foco onde está o dinheiro', steps: 2,
  notas: 'A app Flutter fala com o backend em Node, e é no backend que a receita do BMS Ops é feita: faturação, cobranças, contratos, agentes. Seguinte: a proposta é pausar funcionalidades novas na app até março, manter a manutenção, e designar uma pessoa para os ecrãs mínimos de que o Superfit precisa.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Prioridade">Foco onde está o dinheiro</Titulo>
      <div style={{ display: 'grid', gap: 30 }}>
        <Reveal className="bloco-laranja" style={{ padding: '30px 36px', display: 'grid', gridTemplateColumns: '300px 1fr 120px', alignItems: 'center', gap: 30 }}>
          <div><p className="rotulo laranja" style={{ margin: 0 }}>backend · Node</p><p style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 0' }}>prioridade total</p></div>
          <div style={{ position: 'relative', height: 40 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 18, height: 4, background: 'rgba(255,107,0,0.3)', borderRadius: 2 }} />
            {[0, 1, 2, 3, 4].map((k) => (
              <motion.div key={k} style={{ position: 'absolute', top: 8, width: 24, height: 24, borderRadius: 12, background: LARANJA }}
                animate={{ left: ['0%', '96%'] }} transition={{ duration: 2.5, delay: k * 0.5, repeat: Infinity, ease: 'linear' }} />
            ))}
          </div>
          <motion.div style={{ fontSize: 70, fontWeight: 800, color: LARANJA, textAlign: 'center' }} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>€</motion.div>
        </Reveal>
        <Reveal show={step >= 1} className="bloco" style={{ padding: '30px 36px', display: 'grid', gridTemplateColumns: '300px 1fr 120px', alignItems: 'center', gap: 30 }}>
          <div><p className="rotulo" style={{ margin: 0 }}>app · Flutter</p><p style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 0' }}>pausa até março</p></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--cinza)', fontSize: 20 }}>{Icone.pessoa(40)} 1 pessoa · ecrãs mínimos do Superfit</div>
          <div style={{ textAlign: 'center', color: 'var(--cinza)' }}>{Icone.pausa(70)}</div>
        </Reveal>
      </div>
    </>
  ),
};

/* ───────────── 16. Muros, não castelos de areia ───────────── */
function GuardaCI() {
  return (
    <div style={{ display: 'grid', gap: 22 }}>
      <Reveal className="bloco" style={{ padding: '24px 30px' }}>
        <p className="mono cinza" style={{ fontSize: 16, margin: '0 0 12px' }}>src/modules/faturacao/faturacao.service.ts</p>
        <p className="mono" style={{ fontSize: 25, margin: 0, position: 'relative', display: 'inline-block' }}>
          import {'{ contratosRepo }'} from '../contratos/contratos.repository';
          <motion.span style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 4, background: VERMELHO, transformOrigin: 'left' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.6 }} />
        </p>
      </Reveal>
      <Reveal delay={1.2} className="bloco" style={{ padding: '20px 30px', display: 'flex', alignItems: 'center', gap: 18, border: `1.5px solid ${VERMELHO}`, background: 'var(--vermelho-fundo)' }}>
        <span className="vermelho">{Icone.cruz(38)}</span>
        <span style={{ fontSize: 25, fontWeight: 700 }}>bloqueado no CI · na sala contratos só se entra pela porta interna</span>
      </Reveal>
      <Reveal delay={2.2} className="bloco-laranja" style={{ padding: '20px 30px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <span className="laranja">{Icone.visto(38)}</span>
        <span className="mono" style={{ fontSize: 25 }}>import {'{ lerContrato }'} from '../contratos';</span>
      </Reveal>
    </div>
  );
}

const muroRegras = [
  { de: 'sala → outra sala', como: 'só pela porta interna', ok: true },
  { de: 'sala → motor antigo', como: 'só pela porta de serviço', ok: true },
  { de: 'receção → sala', como: 'nunca', ok: false },
];

const muros: SlideDef = {
  id: 'muros', titulo: 'Muros, não castelos de areia', steps: 2,
  notas: 'Não é para provar que funciona: é para mostrar os muros. Em cada PR corre uma guarda automática no CI, como um revisor que nunca se cansa. Aqui, alguém na faturação tentou ir buscar o repository dos contratos diretamente: bloqueado. A forma certa é pedir pela porta interna, lerContrato. Seguinte: as três regras que a guarda verifica sozinha.',
  render: ({ step }) => (
    <>
      <Titulo kicker="A garantia">Muros, não castelos de areia</Titulo>
      {step === 0 ? <GuardaCI /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
          {muroRegras.map((r, i) => (
            <Reveal key={r.de} delay={i * 0.15} className="bloco" style={{ padding: '40px 30px', textAlign: 'center', border: `1.5px solid ${r.ok ? '#3a3a3a' : VERMELHO}` }}>
              <div style={{ color: r.ok ? LARANJA : VERMELHO, display: 'flex', justifyContent: 'center' }}>{r.ok ? Icone.visto(70) : Icone.cruz(70)}</div>
              <p className="mono" style={{ fontSize: 22, margin: '26px 0 10px' }}>{r.de}</p>
              <p style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{r.como}</p>
            </Reveal>
          ))}
          <Reveal delay={0.6} style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: 12 }}>
            <span className="chip" style={{ fontSize: 18 }}>{Icone.olho(20)} corre sozinha em cada PR · um revisor automático</span>
          </Reveal>
        </div>
      )}
    </>
  ),
};

/* ───────────── 17. Um sócio novo: as salas a trabalhar juntas ───────────── */
const C_L = 276;
const C_GAP = (1408 - 4 * C_L) / 3;
const colX = (i: number) => i * (C_L + C_GAP);
const caixasDia = [
  { sala: 'Clientes', faz: 'inscrição', x: colX(0), y: 130 },
  { sala: 'Contratos', faz: 'assina', x: colX(1), y: 130 },
  { sala: 'Cobranças', faz: 'paga', x: colX(2), y: 130 },
  { sala: 'Faturação', faz: 'fatura · na fila', x: colX(3), y: 0 },
  { sala: 'Acessos', faz: 'QR libertado', x: colX(3), y: 260 },
];
const CICLO_DIA = 6;

function SalaDoDia({ c, i }: { c: typeof caixasDia[number]; i: number }) {
  const atraso = [0, 1.2, 2.4, 3.6, 3.6][i];
  return (
    <motion.div style={{ position: 'absolute', left: c.x, top: c.y, width: C_L, height: 120, borderRadius: 16, border: '2px solid', padding: '20px 18px' }}
      animate={{ borderColor: ['#3a3a3a', LARANJA, LARANJA, '#3a3a3a'], backgroundColor: ['#141414', 'rgba(255,107,0,0.16)', 'rgba(255,107,0,0.16)', '#141414'] }}
      transition={{ duration: 1.6, delay: atraso, repeat: Infinity, repeatDelay: CICLO_DIA - 1.6, times: [0, 0.15, 0.7, 1] }}>
      <p style={{ margin: 0, fontSize: 24, fontWeight: 800, whiteSpace: 'nowrap' }}>Sala {c.sala}</p>
      <p className="cinza" style={{ margin: '6px 0 0', fontSize: 18 }}>{c.faz}</p>
    </motion.div>
  );
}

const diaNoGinasio: SlideDef = {
  id: 'dia', titulo: 'Um sócio novo: as salas a trabalhar juntas', steps: 1,
  notas: 'O fluxo completo, num caso real. Um sócio novo inscreve-se: a sala Clientes cria a ficha e pede à sala Contratos, pela porta interna, que gere o contrato. Ele assina, e a sala Cobranças cobra a primeira mensalidade. Quando o pagamento entra, a Cobranças publica um evento: a Faturação emite a fatura pela fila, sem atrasar ninguém, e a Acessos liberta o QR para o torniquete. Cada sala faz a sua parte, e nenhuma conhece o interior da outra.',
  render: () => (
    <>
      <Titulo kicker="O fluxo completo">Um sócio novo: as salas a trabalhar juntas</Titulo>
      <div style={{ position: 'relative', height: 420, marginTop: 10 }}>
        <svg width="1408" height="420" style={{ position: 'absolute', inset: 0 }}>
          <line x1={colX(0) + C_L} y1="190" x2={colX(1)} y2="190" stroke="#555" strokeWidth="3" />
          <line x1={colX(1) + C_L} y1="190" x2={colX(2)} y2="190" stroke="#555" strokeWidth="3" />
          <path d={`M${colX(2) + C_L},170 C${colX(3) - 40},170 ${colX(3) - 60},60 ${colX(3)},60`} fill="none" stroke={LARANJA} strokeWidth="3" strokeDasharray="8 6" />
          <path d={`M${colX(2) + C_L},210 C${colX(3) - 40},210 ${colX(3) - 60},320 ${colX(3)},320`} fill="none" stroke={LARANJA} strokeWidth="3" strokeDasharray="8 6" />
          <text x={colX(0) + C_L + C_GAP / 2} y="176" textAnchor="middle" fill="#8c8c8c" fontSize="15" fontFamily="Poppins">porta interna</text>
          <text x={colX(1) + C_L + C_GAP / 2} y="176" textAnchor="middle" fill="#8c8c8c" fontSize="15" fontFamily="Poppins">porta interna</text>
          <text x={colX(2) + C_L + 20} y="110" fill={LARANJA} fontSize="15" fontFamily="Poppins" fontWeight="600">evento</text>
          <text x={colX(2) + C_L + 20} y="290" fill={LARANJA} fontSize="15" fontFamily="Poppins" fontWeight="600">evento</text>
        </svg>
        {caixasDia.map((c, i) => <SalaDoDia key={c.sala} c={c} i={i} />)}
        <motion.div style={{ position: 'absolute', color: LARANJA, marginLeft: -22, marginTop: -60 }}
          animate={{ left: [colX(0) + C_L / 2, colX(1) + C_L / 2, colX(2) + C_L / 2, colX(2) + C_L / 2], top: [130, 130, 130, 130], opacity: [1, 1, 1, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, repeatDelay: CICLO_DIA - 3.6, times: [0, 0.33, 0.66, 1] }}>
          {Icone.pessoa(44)}
        </motion.div>
      </div>
      <Reveal delay={0.6} style={{ textAlign: 'center', marginTop: 20 }}>
        <span className="chip" style={{ fontSize: 18 }}>cada sala faz a sua parte · nenhuma conhece o interior da outra</span>
      </Reveal>
    </>
  ),
};

/* ───────────── 18. Prós e contras ───────────── */
const pros = ['Nada se reescreve', 'Custo inicial baixo', 'Avança aos poucos', 'Aproveita o que já existe'];
const contras = ['Disciplina nova nas revisões', 'TypeScript: um passo extra', 'Dois estilos durante a transição', 'Precisamos também de uma réplica e de horários para os lotes'];

function Coluna({ itens, icone, cor, show }: { itens: string[]; icone: ReactNode; cor: string; show: boolean }) {
  return (
    <div style={{ display: 'grid', gap: 22 }}>
      {itens.map((t, i) => (
        <Reveal key={t} show={show} delay={i * 0.12} y={12} style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 28, fontWeight: 600 }}>
          <span style={{ color: cor, flexShrink: 0 }}>{icone}</span>{t}
        </Reveal>
      ))}
    </div>
  );
}

const prosContras: SlideDef = {
  id: 'pros-contras', titulo: 'Prós e contras', steps: 2,
  notas: 'Com honestidade: há custos. O maior não é técnico, é a disciplina nas revisões. O TypeScript pede um passo extra. Durante uns meses convivem o estilo antigo e o novo. E a organização do código não resolve sozinha a carga da base de dados: precisa também de uma réplica, uma cópia só para leituras pesadas, e de horários para os lotes.',
  render: ({ step }) => (
    <>
      <Titulo kicker="Com honestidade">Prós e contras</Titulo>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginTop: 10 }}>
        <Coluna itens={pros} icone={Icone.visto(36)} cor={LARANJA} show />
        <Coluna itens={contras} icone={Icone.cruz(36)} cor={VERMELHO} show={step >= 1} />
      </div>
    </>
  ),
};

/* ───────────── 19. Fecho ───────────── */
const fecho: SlideDef = {
  id: 'fecho', titulo: 'Fecho', steps: 1,
  notas: 'Fechar com realismo: não vamos construir do zero. Reaproveitamos o conhecimento da equipa e a base que já temos, com a mesma base de dados. O que muda é a organização, para que cada cliente novo seja receita e não risco. Abrir para perguntas.',
  render: () => (
    <div style={{ margin: 'auto 0', paddingBottom: 30 }}>
      <Reveal><img src="/logos/bms-log-white.svg" alt="" style={{ height: 110, marginBottom: 40 }} /></Reveal>
      <Reveal delay={0.15}><h1 className="titulo" style={{ fontSize: 78, margin: '0 0 24px' }}>Não vamos construir do zero.</h1></Reveal>
      <Reveal delay={0.4}>
        <p style={{ fontSize: 34, lineHeight: 1.4, margin: 0, maxWidth: 1250, color: 'var(--cinza)' }}>
          Reaproveitamos o conhecimento e a base que já temos, <span className="laranja" style={{ fontWeight: 700 }}>com a mesma base de dados</span>.
        </p>
      </Reveal>
    </div>
  ),
};

export const acto3: SlideDef[] = [motores, replica, pontosCriticos, quemFaz, foco, muros, diaNoGinasio, prosContras, fecho];
