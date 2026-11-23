// O quadro da caixa inteiro, já pintado, para o fecho: a câmara parte de longe e pode aproximar-se de uma cena.

import { useEffect, useState, type ReactNode } from 'react';
import { QuadroEmCamadas } from './QuadroEmCamadas.tsx';
import { ALTURA, CAMADAS, LARGURA } from './quadro.ts';

const SEM_ZONAS: never[] = [];

type Foco = { x: number; y: number; zoom: number };
const LONGE: Foco = { x: 0.5, y: 0.5, zoom: 1 };

/** O quadro inteiro, já pintado, ocupando o slide; a câmara parte de longe e vai até `foco`. */
export function QuadroInteiro({ foco = LONGE, largura = 1500, children }: { foco?: Foco; largura?: number; children?: ReactNode }) {
  // Começa sempre de longe e, um instante depois, aproxima-se: é esse movimento que se sente como 3D.
  const [alvo, setAlvo] = useState<Foco>(LONGE);
  useEffect(() => {
    const t = setTimeout(() => setAlvo(foco), 250);
    return () => clearTimeout(t);
  }, [foco]);
  const altura = (largura * 9) / 16;
  return (
    <div style={{ position: 'absolute', left: 800 - largura / 2, top: 450 - altura / 2, width: largura, height: altura }}>
      <QuadroEmCamadas
        camadas={CAMADAS} zonas={SEM_ZONAS} abertas={SEM_ZONAS} tudo largura={LARGURA} altura={ALTURA}
        composicao="/obra/camadas/composicao.webp" foco={alvo} vida={0.6} aceso={1} acesas={['p2b']} ato={3}
        style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))' }}
      />
      {children}
    </div>
  );
}
