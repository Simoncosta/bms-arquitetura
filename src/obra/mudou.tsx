// Ato 1 · O que mudou para quem usa — cada cartão conta a sua melhoria com uma mini-animação em loop (o duplo
// clique bloqueado, a dívida em 1 s contra 2,9 s, …). Primeiro a ronda de cima, grande; quando entra a segunda
// ronda, os cartões encolhem para caber tudo.

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import {
  BarChart3, Building2, CalendarCheck, CreditCard, EyeOff, Lock, MousePointer2, RotateCcw, ShieldCheck, Undo2, Users, Zap,
} from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { CORES } from './config.ts';
import { Cabeca, Entra } from './pecas.tsx';

const L = CORES.lima;
const V = CORES.vermelho;
const FUNDO = '#24242b';
const loop = (duracao: number, times: number[]) => ({ duration: duracao, times, repeat: Infinity, ease: 'easeInOut' as const });

/** O cursor tenta pagar duas vezes: o primeiro clique paga, o segundo é bloqueado. */
function DuploClique() {
  const t = [0, 0.15, 0.25, 0.32, 0.5, 0.58, 0.85, 1];
  return (
    <div style={{ position: 'relative', width: 200, height: 86 }}>
      <motion.div animate={{ x: [0, 0, 0, 0, 0, -6, 6, 0].map((v, i) => (i >= 5 && i <= 6 ? v : 0)), background: [FUNDO, FUNDO, L, L, L, L, L, FUNDO] }}
        transition={loop(4, t)}
        style={{ position: 'absolute', left: 30, top: 18, width: 140, height: 44, borderRadius: 12, border: `2px solid ${L}`, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 16 }}>
        <motion.span animate={{ opacity: [1, 1, 0, 0, 0, 0, 0, 1] }} transition={loop(4, t)} style={{ position: 'absolute' }}>Pagar 45 €</motion.span>
        <motion.span animate={{ opacity: [0, 0, 1, 1, 1, 1, 1, 0] }} transition={loop(4, t)} style={{ position: 'absolute', color: CORES.carvao }}>✓ Pago</motion.span>
      </motion.div>
      <motion.div animate={{ opacity: [0, 0, 0, 0, 0, 1, 1, 0], scale: [0.6, 0.6, 0.6, 0.6, 0.6, 1, 1, 0.6] }} transition={loop(4, t)}
        style={{ position: 'absolute', right: -4, top: -6, padding: '3px 9px', borderRadius: 999, background: V, fontSize: 12, fontWeight: 800 }}>
        2.º clique bloqueado
      </motion.div>
      <motion.div animate={{ x: [150, 100, 100, 100, 100, 100, 100, 150], y: [70, 42, 42, 42, 42, 42, 42, 70], scale: [1, 1, 0.75, 1, 1, 0.75, 1, 1] }}
        transition={loop(4, t)} style={{ position: 'absolute', left: 0, top: 0 }}>
        <MousePointer2 size={26} fill="#fff" color={CORES.carvao} />
      </motion.div>
    </div>
  );
}

/** Duas barras em corrida, em loop: a de agora chega num instante, a de antes arrasta-se. */
function Corrida({ agora, antes, rotuloAgora, rotuloAntes }: { agora: number; antes: number; rotuloAgora: string; rotuloAntes: string }) {
  const ciclo = antes + 1.2;
  const linha = (seg: number, cor: string, rotulo: string, nome: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 46px', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
      <span style={{ color: CORES.cinza }}>{nome}</span>
      <div style={{ height: 14, borderRadius: 7, background: FUNDO, overflow: 'hidden' }}>
        <motion.div animate={{ width: ['0%', '100%', '100%'] }} transition={{ duration: ciclo, times: [0, seg / ciclo, 1], repeat: Infinity, ease: 'linear' }}
          style={{ height: '100%', borderRadius: 7, background: cor }} />
      </div>
      <motion.span animate={{ opacity: [0, 0, 1, 1] }} transition={{ duration: ciclo, times: [0, seg / ciclo - 0.01, seg / ciclo, 1], repeat: Infinity }} style={{ color: cor }}>{rotulo}</motion.span>
    </div>
  );
  return (
    <div style={{ width: 210, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {linha(agora, L, rotuloAgora, 'agora')}
      {linha(antes, V, rotuloAntes, 'antes')}
    </div>
  );
}

/** O NIF e o IBAN escondidos na lista. */
function Escondido() {
  return (
    <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 7 }}>
      {[['NIF', '2••••••••9'], ['IBAN', 'PT50 •••• ••••'], ['Saúde', '••••••']].map(([k, v], i) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 8, background: FUNDO, fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 42, color: CORES.cinza }}>{k}</span>
          <motion.span animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} style={{ flex: 1, letterSpacing: '0.08em' }}>{v}</motion.span>
          <EyeOff size={14} color={L} />
        </div>
      ))}
    </div>
  );
}

/** Um dado tenta passar de um centro para o outro e bate no muro. */
function Muro() {
  return (
    <div style={{ position: 'relative', width: 210, height: 80 }}>
      <Building2 size={42} color={L} style={{ position: 'absolute', left: 4, top: 18 }} />
      <Building2 size={42} color={CORES.cinza} style={{ position: 'absolute', right: 4, top: 18 }} />
      <div style={{ position: 'absolute', left: 103, top: 6, width: 5, height: 68, borderRadius: 3, background: L, boxShadow: '0 0 14px rgba(185,245,0,0.7)' }} />
      <ShieldCheck size={22} color={L} style={{ position: 'absolute', left: 94, top: -14 }} />
      <motion.span animate={{ x: [52, 92, 52], scale: [1, 1.3, 1] }} transition={loop(1.6, [0, 0.5, 1])}
        style={{ position: 'absolute', left: 0, top: 34, width: 12, height: 12, borderRadius: '50%', background: '#fff' }} />
    </div>
  );
}

/** O interruptor volta à v1 e regressa, em segundos. */
function VoltaAtras() {
  const t = [0, 0.3, 0.5, 0.8, 1];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 800 }}>
      <motion.span animate={{ color: [CORES.cinza, '#fff', '#fff', CORES.cinza, CORES.cinza] }} transition={loop(3.2, t)}>v1</motion.span>
      <div style={{ position: 'relative', width: 76, height: 36, borderRadius: 18, background: FUNDO, border: `2px solid ${L}` }}>
        <motion.span animate={{ x: [42, 4, 4, 42, 42] }} transition={loop(3.2, t)}
          style={{ position: 'absolute', top: 4, left: 0, width: 24, height: 24, borderRadius: '50%', background: L }} />
      </div>
      <motion.span animate={{ color: [L, CORES.cinza, CORES.cinza, L, L] }} transition={loop(3.2, t)}>v2</motion.span>
      <Undo2 size={18} color={L} />
    </div>
  );
}

/** O relatório pesado corre na sua faixa; o balcão continua a andar. */
function FaixaPropria() {
  return (
    <div style={{ width: 210, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, fontWeight: 700 }}>
      <div style={{ position: 'relative', height: 22, borderRadius: 11, background: FUNDO, overflow: 'hidden' }}>
        <span style={{ position: 'absolute', left: 8, top: 3, color: CORES.cinza }}>balcão</span>
        {[0, 1, 2, 3].map((i) => (
          <motion.span key={i} animate={{ x: [60, 200] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: 'linear' }}
            style={{ position: 'absolute', left: 0, top: 6, width: 10, height: 10, borderRadius: '50%', background: L }} />
        ))}
      </div>
      <div style={{ position: 'relative', height: 22, borderRadius: 11, background: FUNDO, overflow: 'hidden' }}>
        <span style={{ position: 'absolute', left: 8, top: 3, color: CORES.cinza }}>relatório</span>
        <motion.span animate={{ x: [70, 170] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', left: 0, top: 4, width: 26, height: 14, borderRadius: 4, background: CORES.violetaClaro }} />
      </div>
    </div>
  );
}

/** A baixa de um colega: desfocada para os colegas, visível para quem gere. */
function Baixa() {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {[{ quem: 'colega', ve: false }, { quem: 'quem gere', ve: true }].map(({ quem, ve }) => (
        <div key={quem} style={{ width: 96, textAlign: 'center' }}>
          <div style={{ position: 'relative', height: 50, borderRadius: 10, background: FUNDO, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, overflow: 'hidden' }}>
            <span style={{ filter: ve ? 'none' : 'blur(5px)', color: ve ? '#fff' : CORES.cinza }}>baixa · 5 dias</span>
            {!ve && (
              <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ position: 'absolute' }}>
                <Lock size={20} color={L} />
              </motion.span>
            )}
          </div>
          <div style={{ fontSize: 11, color: CORES.cinza, marginTop: 4 }}>{quem}</div>
        </div>
      ))}
    </div>
  );
}

/** Desfazer o fecho do ano: a seta roda e os dias de férias ficam todos. */
function FechoDoAno() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <motion.div animate={{ rotate: [0, -360, -360] }} transition={loop(3, [0, 0.4, 1])}><RotateCcw size={34} color={L} /></motion.div>
      <div style={{ textAlign: 'center' }}>
        <motion.div animate={{ scale: [1, 1, 1.15, 1] }} transition={loop(3, [0, 0.4, 0.5, 1])} style={{ fontSize: 30, fontWeight: 800, color: L }}>22 dias</motion.div>
        <div style={{ fontSize: 12, color: CORES.cinza }}>de férias, intactos</div>
      </div>
    </div>
  );
}

/** O backup sai das 17h20 e vai para a 01h. */
function Relogio() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', border: `3px solid ${L}` }}>
        <motion.span animate={{ rotate: [140, 390, 390, 140] }} transition={loop(4, [0, 0.4, 0.85, 1])}
          style={{ position: 'absolute', left: 30, top: 8, width: 3, height: 25, borderRadius: 2, background: '#fff', transformOrigin: '50% 100%' }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 800 }}>
        <div style={{ color: V, textDecoration: 'line-through' }}>17:20</div>
        <div style={{ color: L }}>01:00</div>
      </div>
    </div>
  );
}

const MUDANCAS: { Icone: typeof Zap; quem: string; frase: string; anima: ReactNode }[] = [
  { Icone: CreditCard, quem: 'A receção', frase: 'Um duplo clique num pagamento nunca cobra duas vezes.', anima: <DuploClique /> },
  { Icone: Zap, quem: 'A receção', frase: 'A dívida de um cliente aparece em 1 segundo (eram 2,9).', anima: <Corrida agora={1} antes={2.9} rotuloAgora="1,0 s" rotuloAntes="2,9 s" /> },
  { Icone: EyeOff, quem: 'O cliente', frase: 'A lista nunca mostra o NIF, o IBAN nem os dados de saúde.', anima: <Escondido /> },
  { Icone: ShieldCheck, quem: 'O dono do centro', frase: 'Os dados de um centro não passam para outro.', anima: <Muro /> },
  { Icone: Zap, quem: 'A receção', frase: 'Na v2, a lista de clientes abre 4× mais depressa.', anima: <Corrida agora={1.1} antes={4.7} rotuloAgora="1,1 s" rotuloAntes="4,7 s" /> },
  { Icone: Undo2, quem: 'Toda a gente', frase: 'Se algo corre mal, volta-se atrás em segundos.', anima: <VoltaAtras /> },
  { Icone: BarChart3, quem: 'O gestor', frase: 'Um relatório pesado deixa de atrasar o balcão.', anima: <FaixaPropria /> },
  { Icone: Users, quem: 'A equipa', frase: 'A baixa de um colega só a vê quem gere a equipa.', anima: <Baixa /> },
  { Icone: CalendarCheck, quem: 'Quem gere a equipa', frase: 'Desfazer o fecho do ano já não perde dias de férias.', anima: <FechoDoAno /> },
  { Icone: RotateCcw, quem: 'Às 18h', frase: 'O backup já não corre colado à hora de ponta.', anima: <Relogio /> },
];

export const mudou: SlideDef = {
  id: 'mudou', titulo: 'O que mudou para quem usa', steps: 3,
  notas:
    'O utilizador não quer saber do que não vê — mas sente. Isto é o que já mudou, dito por quem o sente. Um duplo clique num pagamento nunca cobra duas vezes: vejam o segundo clique a ser bloqueado. A dívida de um cliente aparece em 1 segundo — eram 2,9. A lista nunca mostra NIF, IBAN nem saúde. Os dados de um centro não passam para outro: cada falha que encontramos fica fechada na v2 e passa à equipa para corrigir na v1. E na v2 a lista de clientes abre quatro vezes mais depressa. (→) Se algo correr mal, volta-se atrás em segundos, sem obrigar ninguém a atualizar a app. Um relatório pesado corre na sua faixa e não atrasa o balcão. A baixa de um colega só a vê quem gere a equipa. Desfazer o fecho do ano já não faz perder dias de férias. E o backup saiu da hora de ponta. (→) Por trás disto há números — 362 rotas na v2, 55 dos 57 módulos provados contra o sistema de hoje, 791 planos e 1 662 casos de férias comparados um a um sem uma diferença — mas o que importa é isto: o centro trabalha mais depressa e mais seguro. (No CRM: 22 escritas das leads, 240 situações iguais à v1.)',
  render: ({ step }) => {
    const compacto = step >= 1;
    return (
      <>
        <Cabeca kicker="Não se vê, mas sente-se">O que já mudou para quem usa</Cabeca>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {MUDANCAS.map((m, i) => (i < 5 || compacto) && (
            <Entra key={m.frase} delay={0.1 + (i % 5) * 0.1}>
              <motion.div className="cartao" initial={false} animate={{ height: compacto ? 252 : 340 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(185,245,0,0.14)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                    <m.Icone size={23} color={L} strokeWidth={1.8} />
                  </span>
                  <span className="rotulo" style={{ color: L, fontSize: 13 }}>{m.quem}</span>
                </div>
                <p style={{ margin: 0, fontSize: compacto ? 17 : 20, fontWeight: 600, lineHeight: 1.3 }}>{m.frase}</p>
                {/* a mini-animação no espaço de baixo do cartão */}
                <motion.div initial={false} animate={{ scale: compacto ? 0.78 : 1 }} style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                  {m.anima}
                </motion.div>
              </motion.div>
            </Entra>
          ))}
        </div>
        <Entra show={step >= 2} style={{ marginTop: 20, textAlign: 'center' }}>
          <p className="legenda" style={{ fontSize: 18 }}>
            Por trás: <b className="lima">362</b> rotas na v2 · <b className="lima">55</b> dos 57 módulos provados contra o sistema de hoje
            (<b className="lima">791</b> planos e <b className="lima">1 662</b> casos de férias comparados um a um, sem uma diferença)
          </p>
        </Entra>
      </>
    );
  },
};
