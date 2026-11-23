// O fecho com a pirâmide das virtudes da caixa e os nomes de quem as recebeu (só nesta máquina).

import { motion } from 'motion/react';
import type { SlideDef } from '../../types.ts';
import { CORES } from '../config.ts';
import { Entra } from '../pecas.tsx';
import { useRegisto } from './registo.ts';
import { VIRTUDES } from './virtudes.tsx';
import { QuadroInteiro } from '../quadroInteiro.tsx';
import { CENAS, LARGURA, ALTURA } from '../quadro.ts';

/* ───────────── O fecho: a obra da capa volta a construir-se — cada bloco é uma virtude da caixa,
   e por baixo, como créditos, quem as recebeu ───────────── */
function ObraDasVirtudes() {
  // Uma pirâmide de 19 blocos (6, 5, 4, 3, 1): uma virtude por bloco, e a Caridade — o presente, a própria caixa — no topo.
  const fiadas = [6, 5, 4, 3, 1];
  const lado = 74;
  const vao = 10;
  const posicoes: { x: number; l: number }[] = [];
  fiadas.forEach((n, l) => { for (let c = 0; c < n; c++) posicoes.push({ x: ((fiadas[0] - n) / 2 + c) * (lado + vao), l }); });
  const largura = fiadas[0] * (lado + vao) - vao;
  const altura = fiadas.length * (lado + vao) - vao;
  return (
    <div style={{ position: 'relative', width: largura, height: altura }}>
      {posicoes.map(({ x, l }, i) => {
        const v = VIRTUDES[i];
        const claro = (i + l) % 2 === 0 || i === posicoes.length - 1;
        return (
          <motion.div key={i}
            initial={{ y: -500, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 15, delay: 0.2 + i * 0.09 }}
            style={{
              position: 'absolute', left: x, top: altura - (l + 1) * (lado + vao) + vao, width: lado, height: lado, borderRadius: 14,
              background: v ? (claro ? CORES.lima : '#2a2a32') : '#34343e', border: v && !claro ? `2px solid ${CORES.lima}` : 'none',
              display: 'grid', placeItems: 'center',
            }}>
            {v && <v.Icone size={36} strokeWidth={1.8} color={claro ? CORES.carvao : CORES.lima} />}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ───────────── O quadro outra vez, com o nome de cada pessoa junto à cena da sua virtude ───────────── */
const QUADRO_L = 1500;
const QUADRO_A = (QUADRO_L * 9) / 16;
/** Onde fica, no quadro inteiro (câmara de longe), um ponto da composição: o mesmo cálculo do shader. */
function noQuadro(x: number, y: number) {
  return { left: ((x / LARGURA - 0.5) * 1.035 + 0.5) * QUADRO_L, top: ((y / ALTURA - 0.5) * 1.035 + 0.5) * QUADRO_A };
}

function NomesNoQuadro({ show }: { show: boolean }) {
  const registo = useRegisto();
  return (
    <>
      {VIRTUDES.map((v, i) => {
        const cena = CENAS[i];
        const quem = registo[v.id];
        // Só aparece quem recebeu a virtude (escrito na janela do apresentador); sem nomes, o quadro fica limpo.
        if (!cena || !quem) return null;
        const pts = cena.foco ? [cena.foco] : cena.cena[0].formas[0];
        const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
        // Alternar por cima e por baixo da cena, para as vizinhas (receção, treinador…) não se taparem.
        const porCima = i === 4 ? false : i % 2 === 0;
        const y = Math.min(990, porCima ? Math.min(...ys) + 20 : Math.max(...ys) - 20);
        const { left, top } = noQuadro((Math.min(...xs) + Math.max(...xs)) / 2, y);
        return (
          <motion.div key={v.id}
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }}
            transition={{ delay: show ? 0.8 + i * 0.12 : 0, type: 'spring', stiffness: 240, damping: 18 }}
            style={{ position: 'absolute', left, top, transform: 'translate(-50%, -50%)', whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: 999,
              background: 'rgba(24,24,28,0.88)', border: `1.5px solid ${CORES.lima}`, fontSize: 14, fontWeight: 700, color: CORES.branco, pointerEvents: 'none' }}>
            <span style={{ color: CORES.lima }}>{v.nome}</span> · {quem}
          </motion.div>
        );
      })}
    </>
  );
}

export const fechoDasVirtudes: SlideDef = {
  id: 'fecho', titulo: 'Fecho — a obra das virtudes', steps: 3, semRodape: true,
  notas:
    'Lembram-se da caixa? Cada bloco desta obra é uma das virtudes que passou de mão em mão. A organização são as salas do código; a seriedade, cada mudança provada; a coragem, trocar os alicerces sem fechar a loja; a responsabilidade, poder voltar atrás em segundos; a inteligência, o cérebro. (→) E o quadro da caixa outra vez, já todo pintado: cada um de vocês está lá, na cena da sua virtude. (→) A obra continua. E é de todos.',
  render: ({ step }) => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {step === 0 && (
        <div className="centro" style={{ position: 'absolute', inset: 0, gap: 36, paddingTop: 40 }}>
          <ObraDasVirtudes />
        </div>
      )}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: step >= 2 ? 0.6 : 1, y: step >= 2 ? -150 : 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'absolute', inset: 0 }}>
          <QuadroInteiro largura={QUADRO_L}>
            <NomesNoQuadro show={step === 1} />
          </QuadroInteiro>
        </motion.div>
      )}
      {step >= 2 && (
        <div className="centro" style={{ position: 'absolute', left: 0, right: 0, top: 560, gap: 14 }}>
          <Entra delay={0.6}><p className="frase-grande" style={{ fontSize: 76 }}>A obra continua.</p></Entra>
          <Entra delay={0.9}><p className="frase-grande lima" style={{ fontSize: 44 }}>E é de todos.</p></Entra>
        </div>
      )}
    </div>
  ),
};
