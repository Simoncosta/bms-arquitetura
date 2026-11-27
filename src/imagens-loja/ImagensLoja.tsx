// Opção 4 · Imagens da loja (App Store e Google Play). Não é uma apresentação: é o gerador das capturas
// que os CLIENTES dos centros veem na ficha da app. À parte da apresentação; só partilha a entrada e o menu.
//
//   ?ver=loja                               → a série completa, lado a lado, como aparece na loja
//   ?ver=loja&preset=android                → idem, noutro formato
//   ?ver=loja&imagem=aulas&preset=android   → só essa imagem no tamanho real (é o que o exportar.mjs fotografa)

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { IMAGENS, type Entrada } from './conteudo.ts';
import { PRESETS, type Preset } from './marca.ts';
import { urlDaCaptura } from './capturas.ts';
import { Imagem } from './Imagem.tsx';
import './loja.css';
import './pagina.css';

const params = new URLSearchParams(window.location.search);

function presetDoEndereco(): Preset {
  return PRESETS.find((p) => p.id === params.get('preset')) ?? PRESETS[0];
}

/** Uma imagem reduzida para caber na altura pedida, sem perder o desenho do tamanho real. */
function Miniatura({ children, preset, altura }: { children: ReactNode; preset: Preset; altura: number }) {
  const escala = altura / preset.altura;
  return (
    <div className="lp-mini" style={{ width: preset.largura * escala, height: altura }}>
      <div style={{ transform: `scale(${escala})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
  );
}

const PODE_DESCARREGAR = import.meta.env.DEV; // o PNG é gerado pelo servidor do pnpm dev (plugin-vite.mjs)

/** Botão só com ícone, no canto da imagem: pede o PNG exato ao servidor e descarrega-o. */
function BotaoDescarregar({ entrada, posicao, preset }: { entrada: Entrada; posicao: number; preset: Preset }) {
  const [estado, setEstado] = useState<'pronto' | 'a-gerar' | 'erro'>('pronto');
  const nome = `${String(posicao).padStart(2, '0')}-${entrada.id}-${preset.id}`;

  async function descarregar() {
    if (estado === 'a-gerar') return;
    setEstado('a-gerar');
    try {
      const q = new URLSearchParams({ imagem: entrada.id, preset: preset.id, largura: String(preset.largura), altura: String(preset.altura), nome });
      const r = await fetch(`/__loja/png?${q}`);
      if (!r.ok) throw new Error(await r.text());
      const url = URL.createObjectURL(await r.blob());
      const a = Object.assign(document.createElement('a'), { href: url, download: `${nome}.png` });
      a.click();
      URL.revokeObjectURL(url);
      setEstado('pronto');
    } catch (e) {
      console.error('Não foi possível gerar o PNG:', e);
      setEstado('erro');
      setTimeout(() => setEstado('pronto'), 2500);
    }
  }

  const rotulo = estado === 'a-gerar' ? 'A gerar o PNG…' : estado === 'erro' ? 'Falhou — tenta de novo' : `Descarregar PNG ${preset.largura}×${preset.altura}`;
  return (
    <button className={`lp-descarregar ${estado}`} onClick={descarregar} aria-label={rotulo} title={rotulo}>
      <Download size={20} strokeWidth={2.2} />
    </button>
  );
}

/** A fila de imagens com setas e uma barra própria, em vez da barra de deslocamento do navegador. */
function Fila({ children }: { children: ReactNode }) {
  const fila = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const [medida, setMedida] = useState({ inicio: 0, visivel: 1, noInicio: true, noFim: true });

  const medir = useCallback(() => {
    const el = fila.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setMedida({
      inicio: max > 0 ? el.scrollLeft / el.scrollWidth : 0,
      visivel: el.clientWidth / el.scrollWidth,
      noInicio: el.scrollLeft <= 2,
      noFim: el.scrollLeft >= max - 2,
    });
  }, []);

  useEffect(() => {
    medir();
    const obs = new ResizeObserver(medir);
    if (fila.current) {
      obs.observe(fila.current);
      Array.from(fila.current.children).forEach((c) => obs.observe(c));
    }
    return () => obs.disconnect();
  }, [medir, children]);

  const andar = (sentido: 1 | -1) => fila.current?.scrollBy({ left: sentido * fila.current.clientWidth * 0.8, behavior: 'smooth' });

  // Arrastar o polegar da barra, ou clicar no trilho para saltar.
  const arrastar = (e: React.PointerEvent) => {
    const el = fila.current;
    const t = trilho.current;
    if (!el || !t) return;
    const caixa = t.getBoundingClientRect();
    const polegar = medida.visivel * caixa.width;
    const dentroDoPolegar = e.target !== t;
    const desvio = dentroDoPolegar ? e.clientX - (caixa.left + medida.inicio * caixa.width) : polegar / 2;
    const mover = (x: number) => {
      const fracao = (x - caixa.left - desvio) / caixa.width;
      el.scrollLeft = fracao * el.scrollWidth;
    };
    if (!dentroDoPolegar) el.scrollTo({ left: ((e.clientX - caixa.left - desvio) / caixa.width) * el.scrollWidth, behavior: 'smooth' });
    const aoMover = (ev: PointerEvent) => mover(ev.clientX);
    const aoLargar = () => {
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', aoLargar);
    };
    if (dentroDoPolegar) {
      window.addEventListener('pointermove', aoMover);
      window.addEventListener('pointerup', aoLargar);
    }
  };

  const tudoVisivel = medida.noInicio && medida.noFim;
  return (
    <div className="lp-fila">
      <div className="lp-fila-moldura">
        <div ref={fila} className="lp-serie" onScroll={medir} aria-label="A série, como aparece na loja">
          {children}
        </div>
        {!tudoVisivel && (
          <>
            <button className="lp-seta esquerda" onClick={() => andar(-1)} disabled={medida.noInicio} aria-label="Anteriores">
              <ChevronLeft size={26} />
            </button>
            <button className="lp-seta direita" onClick={() => andar(1)} disabled={medida.noFim} aria-label="Seguintes">
              <ChevronRight size={26} />
            </button>
          </>
        )}
      </div>
      {!tudoVisivel && (
        <div ref={trilho} className="lp-trilho" onPointerDown={arrastar}>
          <span className="lp-polegar" style={{ left: `${medida.inicio * 100}%`, width: `${medida.visivel * 100}%` }} />
        </div>
      )}
    </div>
  );
}

function ModoExportacao({ id }: { id: string }) {
  const entrada = IMAGENS.find((e) => e.id === id);
  if (!entrada) return <p style={{ color: '#fff', padding: 40 }}>Não há nenhuma imagem com o id «{id}».</p>;
  return (
    <div className="lp-exportacao">
      <Imagem entrada={entrada} preset={presetDoEndereco()} />
    </div>
  );
}

export function ImagensLoja() {
  const soUma = params.get('imagem');
  const [preset, setPreset] = useState<Preset>(presetDoEndereco);
  const [altura, setAltura] = useState(560);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('preset', preset.id);
    window.history.replaceState(null, '', url);
  }, [preset]);

  if (soUma) return <ModoExportacao id={soUma} />;

  const emFalta = IMAGENS.flatMap((e) => [e.captura, e.captura2]).filter(
    (nome, i, todos): nome is string => !!nome && !urlDaCaptura(nome) && todos.indexOf(nome) === i,
  );
  const rascunhos = IMAGENS.filter((e) => e.estado === 'rascunho').length;
  const limite = preset.loja === 'Google Play' ? 8 : 10;

  return (
    <div className="lp-pagina">
      <header className="lp-topo">
        <div>
          <img src="/logos/Logotipo_BMS_Branco.svg" alt="BMS" className="lp-logo" />
          <h1>Imagens da loja</h1>
          <p>Para os clientes dos centros, na App Store e na Google Play. Uma imagem, uma frase, um benefício.</p>
        </div>
        <div className="lp-controlos">
          <div className="lp-separadores" role="tablist">
            {PRESETS.map((p) => (
              <button key={p.id} role="tab" aria-selected={p.id === preset.id} className={p.id === preset.id ? 'ativo' : ''} onClick={() => setPreset(p)}>
                <strong>{p.nome}</strong>
                <span>
                  {p.loja} · {p.largura}×{p.altura}
                </span>
              </button>
            ))}
          </div>
          <label className="lp-zoom">
            Tamanho
            <input type="range" min={320} max={900} step={20} value={altura} onChange={(e) => setAltura(Number(e.target.value))} />
          </label>
        </div>
      </header>

      <div className="lp-avisos">
        {rascunhos > 0 && (
          <span className="lp-aviso rascunho">
            RASCUNHO A VALIDAR · {rascunhos} de {IMAGENS.length} frases por aprovar
          </span>
        )}
        {emFalta.length > 0 && <span className="lp-aviso">{emFalta.length} capturas em falta em src/imagens-loja/capturas/</span>}
        {IMAGENS.length > limite && (
          <span className="lp-aviso erro">
            A {preset.loja} aceita até {limite} imagens; a série tem {IMAGENS.length}
          </span>
        )}
        <span className="lp-nota">{preset.nota}</span>
      </div>

      <Fila>
        {IMAGENS.map((entrada, i) => (
          <figure key={entrada.id} className="lp-item">
            <div className="lp-cartao">
              <Miniatura preset={preset} altura={altura}>
                <Imagem entrada={entrada} preset={preset} />
              </Miniatura>
              {PODE_DESCARREGAR && <BotaoDescarregar entrada={entrada} posicao={i + 1} preset={preset} />}
            </div>
            <figcaption>
              <span className="lp-numero">{String(i + 1).padStart(2, '0')}</span>
              <span className="lp-id">{entrada.id}</span>
              <span className="lp-meta">
                {entrada.fundo} · {entrada.composicao}
              </span>
              <a href={`?ver=loja&imagem=${entrada.id}&preset=${preset.id}`} target="_blank" rel="noreferrer">
                tamanho real ↗
              </a>
            </figcaption>
          </figure>
        ))}
      </Fila>

    </div>
  );
}
