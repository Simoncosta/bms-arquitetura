// Ato 5 · O que há de novo na app — seis coisas que já se veem, cada uma com um mini-desenho animado, para a
// equipa saber o que procurar quando pegar no telemóvel (o QR vem a seguir).

import { motion } from 'motion/react';
import { CalendarRange, LayoutTemplate, Palette, Rocket, Sparkles, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SlideDef } from '../types.ts';
import { CORES } from './config.ts';
import { Cabeca, Entra } from './pecas.tsx';

const FUNDO = '#24242b';
const L = CORES.lima;

/** O mesmo topo em três ecrãs: seletor de centro, período e ações, sempre no mesmo sítio. */
function MiniPadrao() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
          style={{ width: 62, height: 76, borderRadius: 8, background: FUNDO, padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            <span style={{ flex: 2, height: 7, borderRadius: 3, background: L }} />
            <span style={{ flex: 1, height: 7, borderRadius: 3, background: CORES.violetaClaro }} />
          </div>
          {[1, 2, 3].map((k) => <span key={k} style={{ height: 6, borderRadius: 3, background: '#3a3a44', width: `${90 - k * 15}%` }} />)}
        </motion.div>
      ))}
    </div>
  );
}

/** Uma pergunta e os cartões a montarem-se, cada um com o seu «i» de onde vêm os números. */
function MiniPaineis() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ padding: '6px 10px', borderRadius: 10, background: 'rgba(114,59,250,0.25)', fontSize: 12, fontWeight: 700 }}>
        «como correu o mês?»
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 34px)', gap: 5 }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.span key={i} animate={{ scale: [0, 1, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.25, times: [0, 0.2, 0.85, 1] }}
            style={{ position: 'relative', width: 34, height: 26, borderRadius: 5, background: i === 0 ? L : FUNDO, border: `1px solid ${L}` }}>
            <span style={{ position: 'absolute', right: 2, top: 1, fontSize: 8, fontWeight: 800, color: i === 0 ? CORES.carvao : L }}>i</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** Marcações sobrepostas lado a lado, como no Google Calendar, e «+N» quando não cabem. */
function MiniAgenda() {
  return (
    <div style={{ position: 'relative', width: 190, height: 76, borderRadius: 8, background: FUNDO }}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} initial={{ width: 160 }} animate={{ width: [160, 50, 50, 160] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.8, 1] }}
          style={{ position: 'absolute', top: 10 + i * 6, left: 0, height: 46, borderRadius: 6, background: [L, CORES.violetaClaro, '#5ee0c8'][i], opacity: 0.9, x: i * 54 + 8 }} />
      ))}
      <motion.span animate={{ opacity: [0, 0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.4, 0.8, 1] }}
        style={{ position: 'absolute', right: 6, bottom: 4, fontSize: 12, fontWeight: 800, color: L }}>+2</motion.span>
    </div>
  );
}

/** O formulário à esquerda e a pré-visualização à direita a mudar de cor ao vivo. */
function MiniEditor() {
  const cores = [L, CORES.violetaClaro, '#ffd24a'];
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {cores.map((c, i) => (
          <motion.span key={c} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i }}
            style={{ width: 16, height: 16, borderRadius: '50%', background: c }} />
        ))}
      </div>
      <motion.div animate={{ background: [...cores, L] }} transition={{ duration: 3, repeat: Infinity }}
        style={{ width: 120, height: 66, borderRadius: 10, padding: 8, color: CORES.carvao, fontSize: 12, fontWeight: 800 }}>
        Aula de grupo<br /><span style={{ fontWeight: 600 }}>18:00 · 50 min</span>
      </motion.div>
    </div>
  );
}

/** Linhas de movimentos a entrar, no layout novo. */
function MiniFinanceiro() {
  return (
    <div style={{ width: 190, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div key={i} animate={{ x: [-20, 0, 0], opacity: [0, 1, 1] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.25, repeatDelay: 1 }}
          style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', borderRadius: 6, background: FUNDO, fontSize: 11, fontWeight: 700 }}>
          <span>{['Mensalidade', 'SEPA', 'Aula avulsa', 'Gasto'][i]}</span>
          <span style={{ color: i === 3 ? CORES.vermelho : L }}>{['+45 €', '+38 €', '+12 €', '−20 €'][i]}</span>
        </motion.div>
      ))}
    </div>
  );
}

/** A versão à vista na app: o número sobe e diz o que entrou em cada uma. */
function MiniVersoes() {
  const versoes = [['v3.0', 'Financeiro no layout novo'], ['v3.1', 'Agenda lado a lado'], ['v3.2', 'Painéis com IA']];
  return (
    <div style={{ position: 'relative', width: 210, height: 70 }}>
      {versoes.map(([v, o], i) => (
        <motion.div key={v} animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -12] }}
          transition={{ duration: 6, times: [0, 0.08, 0.3, 0.36], repeat: Infinity, delay: i * 2 }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="chip" style={{ fontSize: 15, fontWeight: 800, borderColor: L, color: L, padding: '4px 12px' }}>{v}</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>entrou: {o}</span>
        </motion.div>
      ))}
    </div>
  );
}

const ITENS: { Icone: typeof Rocket; titulo: string; frase: string; desenho: ReactNode }[] = [
  { Icone: LayoutTemplate, titulo: 'Uma página igual em todo o lado', frase: 'o centro, o período e as ações sempre no mesmo sítio', desenho: <MiniPadrao /> },
  { Icone: Sparkles, titulo: 'Painéis com IA', frase: 'pergunta-se, ela monta e cada cartão diz de onde vêm os números', desenho: <MiniPaineis /> },
  { Icone: CalendarRange, titulo: 'A Agenda lado a lado', frase: 'marcações sobrepostas lado a lado, com «+N» quando não cabem', desenho: <MiniAgenda /> },
  { Icone: Palette, titulo: 'Os tipos de evento', frase: 'tudo o que o antigo tinha, com pré-visualização ao vivo', desenho: <MiniEditor /> },
  { Icone: Wallet, titulo: 'Financeiro e SEPA', frase: 'no layout novo, mais claros e consistentes', desenho: <MiniFinanceiro /> },
  { Icone: Rocket, titulo: 'Versões à vista · a caminho', frase: 'o cliente vê a app a evoluir e sabe em que versão entrou cada melhoria', desenho: <MiniVersoes /> },
];

export const novidades: SlideDef = {
  id: 'novidades', titulo: 'O que há de novo na app', steps: 2,
  notas:
    'Antes de vos dar o telemóvel, o que já lá está. Uma página igual em todo o lado: o seletor do centro, o período e as ações sempre no mesmo sítio. Os painéis com IA: pergunta-se, a IA monta, diz o que montou e o que faltou, e cada cartão explica de onde vêm os números. A Agenda com as marcações sobrepostas lado a lado, como no Google Calendar. (→) O editor dos tipos de evento com tudo o que o antigo tinha e pré-visualização ao vivo. O Financeiro e o SEPA no layout novo. E a caminho: as versões à vista na app — versão 3, 3.1, 3.2 — para o cliente sentir que o produto evolui e saber em que versão entrou cada melhoria, como o Rúben já faz.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="O produto">O que há de novo na app</Cabeca>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {ITENS.map((it, i) => (
          <Entra key={it.titulo} show={i < 3 || step >= 1} delay={0.1 + (i % 3) * 0.12}>
            <div className="cartao" style={{ height: 250, display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(185,245,0,0.14)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <it.Icone size={26} color={L} strokeWidth={1.8} />
                </span>
                <span style={{ fontSize: 22, fontWeight: 800 }}>{it.titulo}</span>
              </div>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>{it.desenho}</div>
              <p className="legenda" style={{ margin: 0, fontSize: 17 }}>{it.frase}</p>
            </div>
          </Entra>
        ))}
      </div>
    </>
  ),
};
