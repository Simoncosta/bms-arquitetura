// A Obra — a terceira apresentação: onde estamos, o que já foi possível e para onde vamos.
// Mesmo motor da arquitetura (Deck + janela do apresentador), com o seu canal, o seu tema e a brincadeira do React
// (tecla R). O que estiver na pasta `local/` (fora do git) entra sozinho: slides antes da capa, um fecho próprio e
// um painel extra na janela do apresentador.

import { useCallback, useState, type ComponentType } from 'react';
import { Deck } from '../Deck.tsx';
import { Apresentador } from '../Apresentador.tsx';
import type { SlideDef } from '../types.ts';
import { canalDaObra } from './config.ts';
import { acto1 } from './acto1.tsx';
import { acto2 } from './acto2.tsx';
import { acto3 } from './acto3.tsx';
import { acto4 } from './acto4.tsx';
import { acto5 } from './acto5.tsx';
import { acto6, fechoSimples } from './acto6.tsx';
import { PiadaReact } from './PiadaReact.tsx';
import './obra.css';

type ConteudoLocal = {
  antes?: SlideDef[];
  fecho?: SlideDef;
  PainelDoApresentador?: ComponentType<{ slideId: string; passo: number }>;
};

// Opcional: se a pasta `local/` não existir (o projeto como está no git), isto fica vazio e a Obra segue sem ela.
const modulos = import.meta.glob<ConteudoLocal>('./local/index.tsx', { eager: true });
const local: ConteudoLocal = Object.values(modulos)[0] ?? {};

export const slidesDaObra: SlideDef[] = [
  ...(local.antes ?? []),
  ...acto1, ...acto2, ...acto3, ...acto4, ...acto5, ...acto6,
  local.fecho ?? fechoSimples,
];

export function Obra() {
  const [piada, setPiada] = useState(false);
  const teclaExtra = useCallback((k: string) => {
    if (k === 'r') { setPiada((v) => !v); return true; }
    if (k === 'escape' && piada) { setPiada(false); return true; }
    return false;
  }, [piada]);
  return (
    <Deck
      slides={slidesDaObra}
      canal={canalDaObra}
      ver="obra"
      tema="obra"
      teclaExtra={teclaExtra}
      extra={<PiadaReact aberta={piada} fechar={() => setPiada(false)} />}
    />
  );
}

export function ApresentadorDaObra() {
  const Painel = local.PainelDoApresentador;
  return (
    <Apresentador
      slides={slidesDaObra}
      canal={canalDaObra}
      tema="obra"
      extra={({ slide, passo }) => (Painel ? <Painel slideId={slide.id} passo={passo} /> : null)}
    />
  );
}
