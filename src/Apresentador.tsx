// A janela só do apresentador: notas, o que vem a seguir e o tempo. Abre-se com a tecla P.

import { useEffect, useState, type ReactNode } from 'react';
import { slides as slidesDaArquitetura } from './slides/index.ts';
import { canalDaArquitetura, type Canal, type Mensagem } from './canal.ts';
import type { SlideDef } from './types.ts';

function relogio(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

type ApresentadorProps = {
  slides?: SlideDef[];
  canal?: Canal;
  tema?: string;
  /** O que a apresentação quer mostrar por baixo das notas (ex.: o registo da caixa). */
  extra?: (atual: { slide: SlideDef; passo: number; enviar: Canal['enviar'] }) => ReactNode;
};

export function Apresentador({ slides = slidesDaArquitetura, canal: ligacao = canalDaArquitetura, tema, extra }: ApresentadorProps) {
  const { canal, enviar } = ligacao;
  const [{ indice, passo }, setEstado] = useState({ indice: 0, passo: 0 });
  const [inicio] = useState(() => Date.now());
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    const ouvir = (e: MessageEvent<Mensagem>) => {
      if (e.data.tipo === 'estado') setEstado({ indice: e.data.indice, passo: e.data.passo });
    };
    canal.addEventListener('message', ouvir);
    enviar({ tipo: 'pedir-estado' });
    const t = setInterval(() => setAgora(Date.now()), 1000);
    const tecla = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('input, textarea')) return;
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) enviar({ tipo: 'ir', acao: 'seguinte' });
      if (['ArrowLeft', 'PageUp'].includes(e.key)) enviar({ tipo: 'ir', acao: 'anterior' });
    };
    window.addEventListener('keydown', tecla);
    return () => { canal.removeEventListener('message', ouvir); clearInterval(t); window.removeEventListener('keydown', tecla); };
  }, [canal, enviar]);

  const slide = slides[indice] ?? slides[0];
  const proximo = slides[indice + 1];

  return (
    <div className={`apresentador ${tema ?? ''}`}>
      <header>
        <span className="laranja">{String(indice + 1).padStart(2, '0')} / {slides.length}</span>
        <strong>{slide.titulo}</strong>
        <span>passo {passo + 1} de {slide.steps}</span>
        <span className="tempo">{relogio(Math.floor((agora - inicio) / 1000))}</span>
      </header>
      <p className="apresentador-notas">{slide.notas}</p>
      {extra?.({ slide, passo, enviar })}
      <footer>
        <span>A seguir: {proximo ? proximo.titulo : 'fim'}</span>
        <div>
          <button onClick={() => enviar({ tipo: 'ir', acao: 'anterior' })}>← Anterior</button>
          <button onClick={() => enviar({ tipo: 'ir', acao: 'seguinte' })}>Seguinte →</button>
        </div>
      </footer>
    </div>
  );
}
