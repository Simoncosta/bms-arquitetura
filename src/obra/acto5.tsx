// Ato 5 · O produto. Um minuto do produto inteiro, só em imagem; depois a equipa
// mexe no produto real, com três missões curtas e sem instruções.

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { ChartColumn, LayoutDashboard, ListChecks, MessageSquareText, Sparkles } from 'lucide-react';
import type { SlideDef } from '../types.ts';
import { CORES, LINK_DA_APP, VIDEOS } from './config.ts';
import { Cabeca, Entra } from './pecas.tsx';
import { novidades } from './novidades.tsx';

/** O vídeo da app nova; enquanto o ficheiro não existir em public/obra/, um desenho animado no lugar. */
function Video({ src, desenho }: { src: string; desenho: React.ReactNode }) {
  // O servidor do Vite devolve a página (200, text/html) para um ficheiro que não existe: pergunta-se primeiro.
  const [existe, setExiste] = useState<boolean | null>(null);
  const [falhou, setFalhou] = useState(false);
  useEffect(() => {
    let vivo = true;
    fetch(src, { method: 'HEAD' })
      .then((r) => vivo && setExiste(r.ok && (r.headers.get('content-type') ?? '').startsWith('video/')))
      .catch(() => vivo && setExiste(false));
    return () => { vivo = false; };
  }, [src]);
  if (existe === false || falhou) return <>{desenho}</>;
  if (existe === null) return null;
  return <video src={src} autoPlay muted loop playsInline onError={() => setFalhou(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }} />;
}

function DesenhoDoPainel() {
  return (
    <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#26262e', borderRadius: 12, padding: '12px 14px' }}>
        <Sparkles size={20} color={CORES.violetaClaro} />
        <motion.span initial={{ width: 0 }} animate={{ width: 230 }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.4 }}
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', fontSize: 15, color: CORES.branco }}>clientes e faturação por plano</motion.span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1 }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1] }}
            transition={{ duration: 4, delay: 1.6 + i * 0.25, repeat: Infinity, repeatDelay: 0, times: [0, 0.1, 0.9, 1] }}
            style={{ borderRadius: 12, background: '#26262e', borderTop: `4px solid ${i % 2 ? CORES.violeta : CORES.lima}` }} />
        ))}
      </div>
    </div>
  );
}

function DesenhoDosRelatorios() {
  const alturas = [40, 70, 55, 90, 65, 80];
  return (
    <div style={{ padding: 26, display: 'flex', alignItems: 'flex-end', gap: 14, height: '100%' }}>
      {alturas.map((h, i) => (
        <motion.div key={i} animate={{ height: [`0%`, `${h}%`, `${h}%`, '0%'] }} transition={{ duration: 4, delay: i * 0.15, repeat: Infinity, times: [0, 0.3, 0.85, 1] }}
          style={{ flex: 1, borderRadius: 8, background: i === 3 ? CORES.lima : CORES.violeta }} />
      ))}
    </div>
  );
}

function DesenhoDoFazerComigo() {
  const passos = ['Abrir as Configurações', 'Escolher o que falta', 'Levar-me lá', 'Feito!'];
  return (
    <div style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 14, height: '100%', justifyContent: 'center' }}>
      {passos.map((p, i) => (
        <motion.div key={p} animate={{ opacity: [0.3, 1, 1, 0.3], x: [0, 6, 0, 0] }} transition={{ duration: 5, delay: i * 0.9, repeat: Infinity, times: [0, 0.1, 0.8, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 17, color: i === 3 ? CORES.lima : CORES.branco, fontWeight: i === 3 ? 800 : 500 }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${i === 3 ? CORES.lima : CORES.violetaClaro}`, display: 'grid', placeItems: 'center', fontSize: 14 }}>{i === 3 ? '✓' : i + 1}</span>
          {p}
        </motion.div>
      ))}
    </div>
  );
}

const quadros = [
  { nome: 'O Painel com IA', frase: 'pedes por palavras, a IA monta o painel', Icone: LayoutDashboard, src: VIDEOS.painel, desenho: <DesenhoDoPainel /> },
  { nome: 'Os Relatórios', frase: 'cada um monta o seu, sem esperar', Icone: ChartColumn, src: VIDEOS.relatorios, desenho: <DesenhoDosRelatorios /> },
  { nome: 'O «Fazer comigo»', frase: 'a app guia passo a passo até ao «Feito!»', Icone: ListChecks, src: VIDEOS.fazerComigo, desenho: <DesenhoDoFazerComigo /> },
];

const umMinuto: SlideDef = {
  id: 'produto', titulo: 'Um minuto do produto', steps: quadros.length + 1,
  notas:
    'Agora o produto. Não vou explicar — vou só mostrar três coisas onde estou a trabalhar. (→) O Painel com IA: o centro pede por palavras e a IA monta o painel, diz o que fez e de onde vêm os números. (→) Os Relatórios: cada um monta o seu, e correm à parte, sem pesar no resto. (→) O «Fazer comigo»: a app guia passo a passo até ao «Feito!». Mas não acreditem em mim…',
  render: ({ step }) => (
    <>
      <Cabeca kicker="O produto">Um minuto do produto</Cabeca>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26, flex: 1, paddingBottom: 40 }}>
        {quadros.map((q, i) => (
          <Entra key={q.nome} show={step > i} y={50}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
              <div style={{ flex: 1, minHeight: 360, borderRadius: 18, background: '#1c1c22', border: `2px solid ${i % 2 ? CORES.violeta : CORES.lima}`, overflow: 'hidden', boxShadow: `0 0 60px ${i % 2 ? 'rgba(114,59,250,0.2)' : 'rgba(185,245,0,0.12)'}` }}>
                <Video src={q.src} desenho={q.desenho} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <q.Icone size={30} color={i % 2 ? CORES.violetaClaro : CORES.lima} />
                <span style={{ fontSize: 26, fontWeight: 800 }}>{q.nome}</span>
              </div>
              <p className="legenda" style={{ fontSize: 19 }}>{q.frase}</p>
            </div>
          </Entra>
        ))}
      </div>
    </>
  ),
};

/* ───────────── Agora é convosco: o QR da app nova e três missões, com o feedback em tempo real ───────────── */
const missoes = [
  { Icone: LayoutDashboard, texto: 'Pede um painel à IA' },
  { Icone: ChartColumn, texto: 'Monta o relatório de vendas do mês' },
  { Icone: ListChecks, texto: 'Segue o «Fazer comigo» até ao «Feito!»' },
];

const convosco: SlideDef = {
  id: 'convosco', titulo: 'Agora é convosco', steps: 2,
  notas:
    'Agora é convosco. Apontem o telemóvel ao QR: é a app nova. Três missões, sem instruções nenhumas — quero mesmo ver se o produto se entende sozinho. (→) E digam-me em voz alta, à medida que forem fazendo: conseguiram? onde encravaram? o que vos surpreendeu? Eu vou tomando nota.',
  render: ({ step }) => (
    <>
      <Cabeca kicker="Agora é convosco">Mexam no produto</Cabeca>
      <div style={{ display: 'flex', gap: 50, flex: 1, paddingBottom: 30, alignItems: 'center' }}>
        <Entra>
          <div style={{ background: '#fff', padding: 22, borderRadius: 22, boxShadow: '0 0 80px rgba(185,245,0,0.25)' }}>
            <QRCodeSVG value={LINK_DA_APP} size={300} bgColor="#ffffff" fgColor={CORES.carvao} level="M" />
          </div>
          <p className="legenda" style={{ textAlign: 'center', marginTop: 14 }}>a app nova, no telemóvel</p>
        </Entra>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {missoes.map((m, i) => (
            <Entra key={m.texto} delay={0.2 + i * 0.15} x={40} y={0}>
              <div className="cartao" style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '20px 26px', borderColor: CORES.lima }}>
                <span style={{ width: 48, height: 48, borderRadius: 14, background: CORES.lima, color: CORES.carvao, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 24 }}>{i + 1}</span>
                <m.Icone size={34} color={CORES.lima} />
                <span style={{ fontSize: 28, fontWeight: 700 }}>{m.texto}</span>
              </div>
            </Entra>
          ))}
          <Entra show={step >= 1} style={{ marginTop: 10 }}>
            <div className="cartao cartao-violeta" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px' }}>
              <MessageSquareText size={34} color={CORES.violetaClaro} />
              <span style={{ fontSize: 24, fontWeight: 600 }}>Digam em voz alta: <b className="lima">conseguiram? onde encravaram?</b></span>
            </div>
          </Entra>
        </div>
      </div>
    </>
  ),
};

export const acto5: SlideDef[] = [umMinuto, novidades, convosco];
