// A janela do apresentador do cérebro: o que dizer, o que vem a seguir e o tempo. Abre com P.

import { useEffect, useState } from 'react';
import { canal, enviar, type Contexto, type Mensagem } from './canal.ts';
import './cerebro.css';

function relogio(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ApresentadorDoCerebro() {
  const [contexto, setContexto] = useState<Contexto>({ onde: '—', titulo: 'À espera do mapa…', notas: '' });
  const [inicio] = useState(() => Date.now());
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    const ouvir = (e: MessageEvent<Mensagem>) => {
      if (e.data.tipo === 'estado') setContexto(e.data.contexto);
    };
    canal.addEventListener('message', ouvir);
    enviar({ tipo: 'pedir-estado' });
    const t = setInterval(() => setAgora(Date.now()), 1000);
    const tecla = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) enviar({ tipo: 'ir', acao: 'seguinte' });
      if (['ArrowLeft', 'PageUp'].includes(e.key)) enviar({ tipo: 'ir', acao: 'anterior' });
    };
    window.addEventListener('keydown', tecla);
    return () => {
      canal.removeEventListener('message', ouvir);
      clearInterval(t);
      window.removeEventListener('keydown', tecla);
    };
  }, []);

  return (
    <div className="cerebro">
      <div className="apresentador">
        <header>
          <span className="lima">{contexto.onde}</span>
          <span className="tempo">{relogio(Math.floor((agora - inicio) / 1000))}</span>
        </header>
        <h1>{contexto.titulo}</h1>
        <p className="apresentador-notas">{contexto.notas}</p>
        <footer>
          <span>{contexto.seguinte ? `A seguir: ${contexto.seguinte}` : 'Clica num lobo ou num ponto no mapa, ou → para o roteiro.'}</span>
          <div>
            <button onClick={() => enviar({ tipo: 'ir', acao: 'anterior' })}>← Anterior</button>
            <button onClick={() => enviar({ tipo: 'ir', acao: 'seguinte' })}>Seguinte →</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
