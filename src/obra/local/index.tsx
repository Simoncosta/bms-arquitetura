// O que só existe nesta máquina (a pasta está no .gitignore): a dinâmica da caixa antes da apresentação, o registo
// de quem recebeu cada virtude (na janela do apresentador) e o fecho com a pirâmide das virtudes.
// Sem esta pasta, a Obra começa na capa e acaba no fecho simples — e ninguém dá pela falta.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { SlideDef } from '../../types.ts';
import { acto0 } from './caixa.tsx';
import { fechoDasVirtudes } from './fecho.tsx';
import { exportarRegisto, guardarNome, limparRegisto, useRegisto } from './registo.ts';
import { VIRTUDES } from './virtudes.tsx';
import { CARTAS } from './cartas.ts';
import './registo.css';

export const antes: SlideDef[] = acto0;
export const fecho: SlideDef = fechoDasVirtudes;

/** Na janela do apresentador, durante a caixa: a virtude da vez e o campo para o nome de quem a recebeu. */
export function PainelDoApresentador({ slideId, passo }: { slideId: string; passo: number }) {
  if (slideId !== 'caixa') return null;
  return <RegistoDaCaixa passo={passo} />;
}

/** Um diálogo de confirmação próprio (no estilo do SweetAlert), em vez do confirm() nativo do browser. */
function Confirmar({ aberto, titulo, texto, confirmar, cancelar }: { aberto: boolean; titulo: string; texto: string; confirmar: () => void; cancelar: () => void }) {
  useEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') cancelar(); if (e.key === 'Enter') confirmar(); };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [aberto, confirmar, cancelar]);
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div className="obra-dialogo-fundo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={cancelar}>
          <motion.div className="obra-dialogo" role="alertdialog" aria-modal="true" aria-labelledby="obra-dialogo-titulo"
            initial={{ scale: 0.85, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }} onClick={(e) => e.stopPropagation()}>
            <motion.div className="obra-dialogo-icone" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 14 }}>!</motion.div>
            <h4 id="obra-dialogo-titulo">{titulo}</h4>
            <p>{texto}</p>
            <div className="obra-dialogo-botoes">
              <button className="secundario" onClick={cancelar}>Cancelar</button>
              <button className="perigo" autoFocus onClick={confirmar}>Sim, apagar</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RegistoDaCaixa({ passo }: { passo: number }) {
  const registo = useRegisto();
  const [aApagar, setAApagar] = useState(false);
  const virtude = passo >= 1 && passo <= VIRTUDES.length ? VIRTUDES[passo - 1] : null;
  const nomes = Object.fromEntries(VIRTUDES.map((v) => [v.id, v.nome]));
  return (
    <div className="obra-registo">
      {passo <= VIRTUDES.length && <p className="carta">{CARTAS[passo].texto}</p>}
      {virtude ? (
        <>
          <h3>Carta {passo + 1} · {virtude.nome}</h3>
          <input
            key={virtude.id}
            autoFocus
            placeholder="Quem ficou com esta virtude?"
            defaultValue={registo[virtude.id] ?? ''}
            onChange={(e) => guardarNome(virtude.id, e.target.value)}
          />
        </>
      ) : (
        <h3>{passo === 0 ? 'Carta 1 · a caixa fechada' : 'A caixa aberta · os doces dividem-se por todos'}</h3>
      )}
      <div className="lista">
        {VIRTUDES.map((v) => (
          <span key={v.id}>{v.nome}: <b>{registo[v.id] ?? '—'}</b></span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => exportarRegisto(registo, nomes)}>Guardar num ficheiro</button>
        <button onClick={() => setAApagar(true)}>Recomeçar</button>
      </div>
      <Confirmar
        aberto={aApagar}
        titulo="Apagar os nomes registados?"
        texto="Os nomes de quem recebeu cada virtude saem deste computador. Se quiseres guardá-los, usa antes «Guardar num ficheiro»."
        confirmar={() => { limparRegisto(); setAApagar(false); }}
        cancelar={() => setAApagar(false)}
      />
    </div>
  );
}
