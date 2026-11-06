// O painel lateral de um ponto: a imagem primeiro, pouco texto. O que se diz fica nas notas.

import { motion } from 'motion/react';
import type { Acao, LoboId, Ponto } from './tipos.ts';
import { LOBO_POR_ID, PONTO_POR_ID, ROTULO_DO_ESTADO, SINAPSES } from './conteudo.ts';
import { Icone } from './icones.tsx';
import { VisualDoPonto } from './visuais.tsx';

type Props = {
  ponto: Ponto;
  onFechar: () => void;
  onIr: (id: string) => void;
  onAcao: (acao: Acao) => void;
};

export function Painel({ ponto, onFechar, onIr, onAcao }: Props) {
  const lobo = ponto.lobo === 'T' || ponto.lobo === 'Q' ? null : LOBO_POR_ID.get(ponto.lobo as LoboId);
  const onde = lobo ? lobo.titulo : ponto.lobo === 'Q' ? 'Pergunta prevista' : 'Transversal';
  const ligacoes = SINAPSES.filter(([a, b]) => a === ponto.id || b === ponto.id)
    .map(([a, b]) => PONTO_POR_ID.get(a === ponto.id ? b : a)!)
    .filter(Boolean);

  return (
    <motion.aside
      className="painel"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="painel-fechar" aria-label="Fechar" onClick={onFechar}>
        ×
      </button>
      <div className="painel-cabeca">
        <span className="painel-icone">
          <Icone nome={ponto.icone} tamanho={30} />
        </span>
        <span className="kicker">
          {ponto.id} · {onde}
        </span>
      </div>
      <h2>{ponto.titulo}</h2>
      <p className="painel-frase">{ponto.frase}</p>

      {ponto.visual && (
        <div className="painel-visual">
          <VisualDoPonto visual={ponto.visual} />
        </div>
      )}

      {ponto.extra?.tipo === 'lista' && (
        <ul className="painel-lista">
          {ponto.extra.itens.map((item) => (
            <li key={item.rotulo}>
              <span>{item.rotulo}</span>
              {item.texto}
            </li>
          ))}
        </ul>
      )}

      {ponto.extra?.tipo === 'colunas' && (
        <div className="painel-colunas">
          {[ponto.extra.esquerda, ponto.extra.direita].map((coluna) => (
            <div key={coluna.titulo}>
              <span className="rotulo">{coluna.titulo}</span>
              <ul>
                {coluna.itens.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {ponto.acao && (
        <button className="painel-acao" onClick={() => onAcao(ponto.acao!)}>
          <Icone nome={ponto.acao.tipo === 'percurso' ? 'Play' : 'ExternalLink'} tamanho={18} />
          {ponto.acao.rotulo}
        </button>
      )}

      {ponto.prova && (
        <p className="painel-prova">
          <strong>{ponto.prova}</strong>
          {ponto.fonte && <span> · {ponto.fonte}</span>}
        </p>
      )}

      <div className={`painel-estado estado-${ponto.estado}`}>
        <span className="ponto-estado" />
        {ROTULO_DO_ESTADO[ponto.estado]}
      </div>

      {ligacoes.length > 0 && (
        <div className="painel-ligacoes">
          <span className="rotulo">Liga a</span>
          <div>
            {ligacoes.map((l) => (
              <button key={l.id} className="chip chip-botao" onClick={() => onIr(l.id)}>
                <Icone nome={l.icone} tamanho={14} />
                <b>{l.id}</b> {l.titulo}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
