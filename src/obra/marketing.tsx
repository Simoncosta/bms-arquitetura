// Ato 4 · O Pixel e o GA4, pincelados para toda a equipa: o caminho de um novo cliente até à BMS (anúncio → site →
// pedido de demonstração → cliente), o que cada um dos dois mede e porque é que uma comunicação única os faz
// funcionar melhor (sinais limpos, anúncios que aprendem, mais clientes, base sólida).

import { motion } from 'motion/react';
import { Activity, ClipboardList, Globe, Handshake, Smartphone, Target, Users } from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { CORES } from './config.ts';
import { Cabeca } from './pecas.tsx';

const ESTACOES = [
  { x: 150, Icone: Smartphone, nome: 'Vê um anúncio', sub: 'Instagram · Google' },
  { x: 520, Icone: Globe, nome: 'Entra no site', sub: 'o site da BMS' },
  { x: 890, Icone: ClipboardList, nome: 'Pede demonstração', sub: 'ou fala no WhatsApp · lead quente' },
  { x: 1260, Icone: Handshake, nome: 'Torna-se cliente', sub: 'um centro novo' },
];
const CY = 190;
const INICIO = 30;
const FIM = 1330;

type Modo = 'normal' | 'baralhado' | 'unico';

/** Em que estação cada pessoa desiste (0 = no site, 1 = na demonstração, 2 = antes de fechar, 3 = chega a cliente). */
function desistencias(modo: Modo, n: number) {
  const fatias = modo === 'baralhado' ? [10, 7, 4] : modo === 'unico' ? [5, 4, 3] : [8, 6, 4];
  const lista: number[] = [];
  fatias.forEach((q, k) => { for (let i = 0; i < q; i++) lista.push(k); });
  while (lista.length < n) lista.push(3);
  // baralhar de forma estável, para os que desistem não irem todos seguidos
  return lista.map((v, i) => ({ v, o: (i * 7919) % n })).sort((a, b) => a.o - b.o).map((x) => x.v);
}

const CORES_BARALHADAS = [CORES.lima, '#ff8fb1', '#7cc4ff', '#ffd24a', CORES.violetaClaro, '#5ee0c8'];
const N = 24;

/** Altura do funil em x: estreita para a direita; com comunicação única, estreita menos. */
function meiaAltura(x: number, modo: Modo) {
  const t = (x - INICIO) / (FIM - INICIO);
  const fim = modo === 'unico' ? 82 : modo === 'baralhado' ? 38 : 55;
  return 130 + (fim - 130) * t;
}

function Pessoas({ modo }: { modo: Modo }) {
  const destinos = desistencias(modo, N);
  return (
    <>
      {destinos.map((para, i) => {
        const xs = [INICIO, ...ESTACOES.map((e) => e.x)];
        const ultimo = para === 3 ? FIM : ESTACOES[para + 1].x - 40;
        const caminhoX = [...xs.slice(0, para + 2).map((x, k) => (k === para + 1 ? ultimo : x)), ultimo];
        const desvio = ((i * 37) % 100) / 100 - 0.5;
        const caminhoY = caminhoX.map((x, k) => (k === caminhoX.length - 1 && para < 3 ? CY + 150 : CY + desvio * 1.6 * meiaAltura(x, modo)));
        const cor = modo === 'baralhado' ? CORES_BARALHADAS[i % CORES_BARALHADAS.length] : CORES.lima;
        const duracao = 5.5;
        const opacidade = caminhoX.map((_, k) => (k === caminhoX.length - 1 && para < 3 ? 0 : 1));
        return (
          <motion.span
            key={`${modo}-${i}`}
            initial={{ x: INICIO, y: CY, opacity: 0 }}
            animate={{ x: caminhoX, y: caminhoY, opacity: opacidade }}
            transition={{ duration: duracao * (caminhoX.length / 6), delay: (i / N) * duracao, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: -8, top: -8, width: 16, height: 16, borderRadius: '50%', background: cor, boxShadow: `0 0 10px ${cor}` }}
          />
        );
      })}
    </>
  );
}

/** A base de clientes, em blocos: cresce com a comunicação única. */
function Base({ modo }: { modo: Modo }) {
  const n = modo === 'unico' ? 12 : modo === 'baralhado' ? 3 : 6;
  return (
    <div style={{ position: 'absolute', left: 1180, top: 372, width: 170, display: 'flex', flexWrap: 'wrap-reverse', gap: 6 }}>
      {Array.from({ length: n }).map((_, i) => (
        <motion.span key={`${modo}-${i}`} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 260, damping: 16 }}
          style={{ width: 36, height: 22, borderRadius: 5, background: CORES.lima }} />
      ))}
      <div style={{ width: '100%', fontSize: 15, fontWeight: 700, color: CORES.cinza, textAlign: 'center', marginTop: 4 }}>
        <Users size={14} style={{ verticalAlign: -2 }} /> a nossa base
      </div>
    </div>
  );
}

const LEGENDAS = [
  <>O caminho de um novo cliente: vê um anúncio, entra no nosso site, pede uma demonstração ou fala connosco no WhatsApp — <b className="lima">é uma lead quente</b> — e torna-se cliente. Pelo caminho, muitos ficam.</>,
  <><b style={{ color: CORES.violetaClaro }}>Pixel (Meta)</b>, o recibo que volta ao anúncio: diz ao Instagram e ao Facebook quem veio do anúncio e quem pediu demonstração. A Meta <b className="lima">aprende quem é o nosso cliente</b> e mostra o anúncio a mais pessoas parecidas.</>,
  <><b className="lima">GA4 (Google Analytics)</b>, o contador à porta da loja: mostra de onde vêm as visitas, o que leem e <b className="lima">em que página desistem</b>. Assim sabemos o que funciona.</>,
  <>Quando cada canal diz uma coisa diferente (o post, o email, a conversa de vendas), <b>os sinais baralham-se</b>: o Pixel aprende mal, o GA4 mostra confusão e <b>chegam menos clientes</b>.</>,
];

export const marketing: SlideDef = {
  id: 'pixel-ga4', titulo: 'Como chegam novos clientes: Pixel e GA4', steps: 5,
  notas:
    'Uma coisa que não é do código, mas é de todos: como chegam novos clientes. (→) O caminho: alguém vê um anúncio, entra no nosso site, pede uma demonstração ou fala connosco no WhatsApp — isso já é uma lead quente — e torna-se cliente. Pelo caminho, muitos ficam. (→) O Pixel, da Meta, é o recibo que volta ao anúncio: diz ao Instagram e ao Facebook quem veio do anúncio e quem pediu demonstração. Com isso, a Meta aprende o perfil do nosso cliente e mostra o anúncio a mais pessoas parecidas. (→) O GA4, do Google, é o contador à porta da loja: mostra de onde vêm as visitas, o que leem e em que página desistem. (→) Agora o problema: se cada canal diz uma coisa diferente (o post diz uma coisa, o email outra, a conversa de vendas outra), os sinais baralham-se. O Pixel aprende mal, o GA4 mostra confusão, e chegam menos clientes. (→) A solução é de todos: uma comunicação única. O post, o email, o site e o CRM com a mesma voz e o mesmo aspeto. Quem chega ao site reconhece o que já viu no Instagram e no email, abre o CRM e é igual — sente-se em casa, porque confiamos no que já vimos muitas vezes. Os anúncios aprendem mais depressa, o caminho fica claro, e chegam mais clientes pelo mesmo dinheiro. É assim que se constrói uma base sólida — e vocês fizeram parte disto.',
  render: ({ step }) => {
    const modo: Modo = step === 3 ? 'baralhado' : step >= 4 ? 'unico' : 'normal';
    const caminhoFunil = (m: Modo) => {
      const pts: string[] = [];
      for (let x = INICIO; x <= FIM; x += 50) pts.push(`${x},${CY - meiaAltura(x, m)}`);
      for (let x = FIM; x >= INICIO; x -= 50) pts.push(`${x},${CY + meiaAltura(x, m)}`);
      return `M ${pts.join(' L ')} Z`;
    };
    return (
      <>
        <Cabeca kicker="Para todos · marketing">Como chegam novos clientes</Cabeca>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg width={1408} height={460} viewBox="0 0 1408 460" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <motion.path initial={false} animate={{ d: caminhoFunil(modo) }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              fill={modo === 'baralhado' ? 'rgba(255,255,255,0.04)' : 'rgba(185,245,0,0.06)'} stroke={modo === 'baralhado' ? '#55555f' : 'rgba(185,245,0,0.35)'} strokeWidth={2} />
            {/* o Pixel: o sinal volta da demonstração e do cliente até ao anúncio */}
            {step >= 1 && (
              <motion.path d={`M ${ESTACOES[2].x} ${CY - 70} C ${ESTACOES[2].x - 120} ${CY - 230}, ${ESTACOES[0].x + 160} ${CY - 230}, ${ESTACOES[0].x + 30} ${CY - 75}`}
                fill="none" stroke={CORES.violetaClaro} strokeWidth={4} strokeDasharray="10 12"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: modo === 'baralhado' ? 0.3 : 1, strokeDashoffset: [0, -44] }}
                transition={{ pathLength: { duration: 1 }, strokeDashoffset: { duration: 1.2, repeat: Infinity, ease: 'linear' } }} />
            )}
          </svg>
          <Pessoas modo={modo} />
          {ESTACOES.map((e, i) => (
            <div key={e.nome} style={{ position: 'absolute', left: e.x - 140, top: CY - 52, width: 280, textAlign: 'center' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 220, damping: 16 }}
                style={{ margin: '0 auto', width: 104, height: 104, borderRadius: '50%', border: `3px solid ${CORES.lima}`, background: '#1c1c22', display: 'grid', placeItems: 'center' }}>
                <e.Icone size={46} strokeWidth={1.6} color={CORES.lima} />
              </motion.div>
              <div style={{ marginTop: 74, fontSize: 22, fontWeight: 800 }}>{e.nome}</div>
              <div className="legenda" style={{ fontSize: 16 }}>{e.sub}</div>
            </div>
          ))}
          {/* os dois sensores */}
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: modo === 'baralhado' ? 0.45 : 1, y: 0 }}
              style={{ position: 'absolute', left: ESTACOES[0].x - 95, top: CY - 150, width: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: CORES.violeta, fontWeight: 800, fontSize: 18 }}>
              <Target size={20} /> Pixel · Meta
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: modo === 'baralhado' ? 0.45 : 1, y: 0 }}
              style={{ position: 'absolute', left: ESTACOES[1].x - 120, top: CY - 150, width: 240, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: CORES.lima, color: CORES.carvao, fontWeight: 800, fontSize: 18 }}>
              <Activity size={20} /> GA4 · Google
              <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 18, marginLeft: 4 }}>
                {[0.4, 0.8, 0.6, 1].map((h, k) => (
                  <motion.span key={k} animate={{ height: [`${h * 40}%`, `${h * 100}%`, `${h * 40}%`] }} transition={{ duration: 1.4, repeat: Infinity, delay: k * 0.15 }}
                    style={{ width: 4, background: CORES.carvao, borderRadius: 1 }} />
                ))}
              </span>
            </motion.div>
          )}
          <Base modo={modo} />
          {step <= 3 && (
            <motion.div key={`legenda-${step}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ position: 'absolute', left: 0, right: 200, bottom: 6, textAlign: 'center' }}>
              <p className="frase" style={{ fontSize: 25, maxWidth: 1150, margin: '0 auto' }}>{LEGENDAS[step]}</p>
            </motion.div>
          )}
          {step >= 4 && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ position: 'absolute', left: 0, right: 200, bottom: -14, display: 'flex', alignItems: 'center', gap: 20, padding: '12px 22px', borderRadius: 18, background: '#1f2512', border: `1.5px solid ${CORES.lima}` }}>
              <span style={{ width: 56, height: 56, borderRadius: '50%', background: CORES.lima, display: 'grid', placeItems: 'center', flex: 'none' }}>
                <Users size={30} color={CORES.carvao} strokeWidth={1.9} />
              </span>
              <div>
                <div className="rotulo" style={{ color: CORES.lima, fontSize: 13 }}>Para todos nós · uma comunicação única</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, lineHeight: 1.3 }}>
                  O post, o email, o site e o CRM com <span className="lima">a mesma voz</span> → quem chega reconhece tudo e confia (confiamos no que já vimos muitas vezes) → os anúncios aprendem mais depressa → <span className="lima">mais clientes pelo mesmo dinheiro</span>.
                </div>
                <div style={{ fontSize: 21, fontWeight: 800, marginTop: 4, color: CORES.lima }}>Vocês fizeram parte disto.</div>
              </div>
            </motion.div>
          )}
        </div>
      </>
    );
  },
};
