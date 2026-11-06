// As peças do mapa: o centro, os três lobos, os pontos e as sinapses.

import { memo, useMemo } from 'react';
import { Handle, Position, type EdgeProps, type NodeProps } from '@xyflow/react';
import type { Estado, Lobo, Ponto } from './tipos.ts';
import { CENTRO, ROTULO_DO_ESTADO } from './conteudo.ts';
import { circunvolucoes, contornoDoLobo } from './forma.ts';
import { Icone } from './icones.tsx';

/** A ponta invisível onde as sinapses ligam (no meio da peça, salvo indicação). */
function Pegas({ estilo }: { estilo?: { left: string; top: string } }) {
  const style = estilo ? { left: estilo.left, top: estilo.top } : undefined;
  return (
    <>
      <Handle type="source" position={Position.Top} className="pega" style={style} isConnectable={false} />
      <Handle type="target" position={Position.Top} className="pega" style={style} isConnectable={false} />
    </>
  );
}

export type CentroDados = { aceso: boolean };

export const NoCentro = memo(function NoCentro({ data }: NodeProps) {
  const d = data as CentroDados;
  return (
    <div className={`centro ${d.aceso ? 'aceso' : ''}`}>
      <Pegas />
      <Icone nome="BrainCircuit" tamanho={40} className="centro-icone" />
      <h1>{CENTRO.titulo}</h1>
      <p>{CENTRO.frase}</p>
      <div className="centro-chips">
        <span className="chip">GPS para o centro</span>
        <span className="chip">Bússola para a equipa</span>
      </div>
    </div>
  );
});

export type LoboDados = {
  lobo: Lobo;
  aberto: boolean;
  total: number;
  contagens: Partial<Record<Estado, number>>;
  estadoModo: boolean;
  onFechar: () => void;
};

const ORDEM: Estado[] = ['existe', 'parcial', 'curso', 'falta', 'problema', 'nota'];

export const NoLobo = memo(function NoLobo({ data }: NodeProps) {
  const d = data as LoboDados;
  const { lobo } = d;
  const contorno = useMemo(() => contornoDoLobo(lobo.largura, lobo.altura, lobo.semente), [lobo]);
  const dobras = useMemo(() => circunvolucoes(lobo.largura, lobo.altura, lobo.semente), [lobo]);
  const idClip = `clip-${lobo.id}`;

  return (
    <div className={`lobo ${d.aberto ? 'aberto' : 'fechado'}`} style={{ width: lobo.largura, height: lobo.altura }}>
      <Pegas estilo={lobo.pega} />
      <svg className="lobo-forma" width={lobo.largura} height={lobo.altura} viewBox={`0 0 ${lobo.largura} ${lobo.altura}`}>
        <defs>
          <clipPath id={idClip}>
            <path d={contorno} />
          </clipPath>
          <radialGradient id={`brilho-${lobo.id}`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#CDF22B" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#CDF22B" stopOpacity="0.015" />
          </radialGradient>
        </defs>
        <path d={contorno} className="lobo-fundo" fill={`url(#brilho-${lobo.id})`} />
        <g clipPath={`url(#${idClip})`}>
          {dobras.map((linha, i) => (
            <path key={i} d={linha} className="lobo-dobra" />
          ))}
        </g>
        <path d={contorno} className="lobo-contorno" />
      </svg>

      {d.aberto ? (
        <header className="lobo-cabecalho">
          <div className="lobo-cabecalho-texto">
            <Icone nome={lobo.icone} tamanho={44} className="lobo-icone" />
            <div>
              <span className="kicker">Lobo {lobo.numero}</span>
              <h2>{lobo.titulo}</h2>
            </div>
          </div>
          <button
            className="lobo-fechar nodrag"
            aria-label={`Fechar o lobo ${lobo.titulo}`}
            onClick={(e) => {
              e.stopPropagation();
              d.onFechar();
            }}
          >
            −
          </button>
        </header>
      ) : (
        <div className="lobo-capa">
          <Icone nome={lobo.icone} tamanho={96} className="lobo-icone" />
          <span className="kicker">Lobo {lobo.numero}</span>
          <h2>{lobo.titulo}</h2>
          <p>{lobo.frase}</p>
          <span className="chip">{d.total} pontos</span>
          {d.estadoModo && (
            <div className="barra-estados" aria-label="Estado dos pontos deste lobo">
              {ORDEM.filter((e) => d.contagens[e]).map((e) => (
                <span key={e} className={`barra-${e}`} style={{ flex: d.contagens[e] }} title={`${ROTULO_DO_ESTADO[e]}: ${d.contagens[e]}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export type PontoDados = { ponto: Ponto; classes: string };

export const NoPonto = memo(function NoPonto({ data }: NodeProps) {
  const { ponto, classes } = data as PontoDados;
  return (
    <div className={`ponto estado-${ponto.estado} ${ponto.lobo === 'T' ? 'transversal' : ''} ${classes}`}>
      <Pegas />
      <div className="ponto-topo">
        <span className="ponto-icone">
          <Icone nome={ponto.icone} tamanho={22} />
        </span>
        <span className="ponto-codigo">{ponto.id}</span>
        <span className="ponto-estado" title={ROTULO_DO_ESTADO[ponto.estado]} />
      </div>
      <strong>{ponto.titulo}</strong>
      <p>{ponto.frase}</p>
    </div>
  );
});

export type SinapseDados = { classe?: string; curva?: number };

/** Uma curva suave entre duas peças, com um halo por baixo. */
export function Sinapse({ sourceX, sourceY, targetX, targetY, data }: EdgeProps) {
  const d = (data ?? {}) as SinapseDados;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const k = d.curva ?? 0.16;
  const cx = (sourceX + targetX) / 2 - dy * k;
  const cy = (sourceY + targetY) / 2 + dx * k;
  const caminho = `M ${sourceX} ${sourceY} Q ${cx} ${cy} ${targetX} ${targetY}`;
  return (
    <g className={`sinapse ${d.classe ?? ''}`}>
      <path d={caminho} className="sinapse-halo" />
      <path d={caminho} className="sinapse-linha" />
    </g>
  );
}

export const tiposDeNo = { centro: NoCentro, lobo: NoLobo, ponto: NoPonto };
export const tiposDeLigacao = { sinapse: Sinapse };
