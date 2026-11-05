// A janela só do apresentador: notas, o que vem a seguir e o tempo. Abre-se com a tecla P.

import { useEffect, useState } from 'react';
import { slides } from './slides/index.ts';
import { canal, enviar, type Mensagem } from './canal.ts';

function relogio(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function Apresentador() {
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
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) enviar({ tipo: 'ir', acao: 'seguinte' });
      if (['ArrowLeft', 'PageUp'].includes(e.key)) enviar({ tipo: 'ir', acao: 'anterior' });
    };
    window.addEventListener('keydown', tecla);
    return () => { canal.removeEventListener('message', ouvir); clearInterval(t); window.removeEventListener('keydown', tecla); };
  }, []);

  const slide = slides[indice];
  const proximo = slides[indice + 1];

  return (
    <div className="apresentador">
      <header>
        <span className="laranja">{String(indice + 1).padStart(2, '0')} / {slides.length}</span>
        <strong>{slide.titulo}</strong>
        <span>passo {passo + 1} de {slide.steps}</span>
        <span className="tempo">{relogio(Math.floor((agora - inicio) / 1000))}</span>
      </header>
      <p className="apresentador-notas">{slide.notas}</p>
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
