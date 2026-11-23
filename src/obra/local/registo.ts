// Quem recebeu cada virtude da caixa. Escreve-se na janela do apresentador (só o Simon a vê), guarda-se neste
// computador (localStorage) e volta no fecho da apresentação. Pode exportar-se para um ficheiro, para guardar.

import { useEffect, useState } from 'react';
import { canalDaObra } from '../config.ts';
import type { Mensagem } from '../../canal.ts';

const CHAVE = 'bms-obra-virtudes';
/** O aviso dentro da MESMA janela (o BroadcastChannel não entrega a quem envia). */
const AVISO_LOCAL = 'bms-obra-registo';

export type Registo = Record<string, string>;

export function lerRegisto(): Registo {
  try {
    const bruto = localStorage.getItem(CHAVE);
    const valor = bruto ? JSON.parse(bruto) : {};
    return valor && typeof valor === 'object' ? (valor as Registo) : {};
  } catch {
    return {};
  }
}

export function guardarNome(virtude: string, nome: string) {
  const registo = { ...lerRegisto(), [virtude]: nome.trim() };
  if (!registo[virtude]) delete registo[virtude];
  try {
    localStorage.setItem(CHAVE, JSON.stringify(registo));
  } catch {
    /* sem armazenamento: o nome vive só nesta janela */
  }
  canalDaObra.enviar({ tipo: 'evento', nome: 'registo', dados: registo });
  window.dispatchEvent(new CustomEvent(AVISO_LOCAL, { detail: registo }));
  return registo;
}

export function limparRegisto() {
  try { localStorage.removeItem(CHAVE); } catch { /* nada a limpar */ }
  canalDaObra.enviar({ tipo: 'evento', nome: 'registo', dados: {} });
  window.dispatchEvent(new CustomEvent(AVISO_LOCAL, { detail: {} }));
}

/** O registo, sempre atual: lê o guardado e ouve a janela do apresentador. */
export function useRegisto(): Registo {
  const [registo, setRegisto] = useState<Registo>(lerRegisto);
  useEffect(() => {
    const ouvir = (e: MessageEvent<Mensagem>) => {
      if (e.data.tipo === 'evento' && e.data.nome === 'registo') setRegisto((e.data.dados as Registo) ?? {});
    };
    const local = (e: Event) => setRegisto(((e as CustomEvent<Registo>).detail) ?? {});
    canalDaObra.canal.addEventListener('message', ouvir);
    window.addEventListener(AVISO_LOCAL, local);
    return () => { canalDaObra.canal.removeEventListener('message', ouvir); window.removeEventListener(AVISO_LOCAL, local); };
  }, []);
  return registo;
}

/** Descarrega o registo para um ficheiro (para o Simon guardar quem ficou com cada virtude). */
export function exportarRegisto(registo: Registo, nomes: Record<string, string>) {
  const linhas = Object.entries(nomes).map(([id, nome]) => `${nome}: ${registo[id] ?? '—'}`);
  const texto = `A caixa · ${new Date().toLocaleDateString('pt-PT')}\n\n${linhas.join('\n')}\n`;
  const url = URL.createObjectURL(new Blob([texto], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `a-caixa-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
