// Uma imagem da loja no tamanho exato do preset: fundo, frase, subtítulo e o ecrã real num telemóvel.
// Tudo se mede em unidades do contentor (cqw/cqh), por isso a mesma imagem serve aos três formatos.

import { useState, type CSSProperties, type ReactNode, type SyntheticEvent } from 'react';
import type { Entrada } from './conteudo.ts';
import type { Preset } from './marca.ts';
import { urlDaCaptura } from './capturas.ts';
import './loja.css';

/** «O teu centro, na *palma* da mão» → a palavra entre asteriscos fica em destaque. */
function comDestaque(frase: string): ReactNode[] {
  return frase.split(/(\*[^*]+\*)/g).map((parte, i) =>
    parte.startsWith('*') && parte.endsWith('*') ? <em key={i}>{parte.slice(1, -1)}</em> : parte,
  );
}

/** Moldura de telemóvel genérica, desenhada por nós: sem formas nem marcas da Apple ou da Google. */
/** A cor do canto de cima da captura, para a barra de estado continuar o cabeçalho da app. */
function corDoTopo(e: SyntheticEvent<HTMLImageElement>): { fundo: string; escura: boolean } | null {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const g = c.getContext('2d');
    if (!g) return null;
    g.drawImage(e.currentTarget, 4, 4, 1, 1, 0, 0, 1, 1);
    const [r, v, a] = g.getImageData(0, 0, 1, 1).data;
    return { fundo: `rgb(${r} ${v} ${a})`, escura: 0.299 * r + 0.587 * v + 0.114 * a < 140 };
  } catch {
    return null;
  }
}

/**
 * Barra de estado genérica (hora, rede e bateria), desenhada por nós. As capturas da app web não a têm,
 * e sem ela a câmara da moldura ficava por cima do cabeçalho da app.
 */
function BarraDeEstado({ fundo, escura }: { fundo: string; escura: boolean }) {
  return (
    <div className="li-tel-estado" style={{ background: fundo, color: escura ? '#faf8f3' : '#08090b' }}>
      <span className="li-tel-hora">9:41</span>
      <span className="li-tel-icones">
        <span className="li-tel-rede">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="li-tel-bateria">
          <i />
        </span>
      </span>
    </div>
  );
}

export function Telemovel({ captura, className = '', style }: { captura: string; className?: string; style?: CSSProperties }) {
  const url = urlDaCaptura(captura);
  const [topo, setTopo] = useState<{ fundo: string; escura: boolean } | null>(null);
  return (
    <div className={`li-tel ${className}`} style={style}>
      <div className="li-tel-corpo">
      <div className="li-tel-ecra">
        {url ? (
          <>
            <BarraDeEstado fundo={topo?.fundo ?? '#ffffff'} escura={topo?.escura ?? false} />
            <img src={url} alt="" onLoad={(e) => setTopo(corDoTopo(e))} />
          </>
        ) : (
          <div className="li-tel-espera">
            <span className="li-tel-espera-barra" style={{ width: '58%' }} />
            <span className="li-tel-espera-cartao" />
            <span className="li-tel-espera-barra" style={{ width: '80%' }} />
            <span className="li-tel-espera-barra" style={{ width: '66%' }} />
            <span className="li-tel-espera-cartao curto" />
            <span className="li-tel-espera-nome">
              captura em falta
              <br />
              <b>{captura}</b>
            </span>
          </div>
        )}
        <span className="li-tel-camara" />
      </div>
      </div>
    </div>
  );
}

export function Imagem({ entrada, preset }: { entrada: Entrada; preset: Preset }) {
  const { fundo, composicao } = entrada;
  return (
    <div
      className={`li-imagem li-fundo-${fundo} li-comp-${composicao}`}
      style={{ width: preset.largura, height: preset.altura }}
    >
      <div className="li-decor" aria-hidden>
        <span className="li-anel a1" />
        <span className="li-anel a2" />
        <span className="li-anel a3" />
      </div>

      <div className="li-texto">
        {composicao === 'abertura' && <span className="li-logo" role="img" aria-label="BMS" />}
        <h1>{comDestaque(entrada.frase)}</h1>
        <p>{entrada.subtitulo}</p>
      </div>

      <div className="li-palco">
        {composicao === 'dois' ? (
          <>
            <Telemovel captura={entrada.captura2 ?? entrada.captura} className="li-tel-tras" />
            <Telemovel captura={entrada.captura} className="li-tel-frente" />
          </>
        ) : (
          <Telemovel captura={entrada.captura} className="li-tel-principal" />
        )}
      </div>
    </div>
  );
}
