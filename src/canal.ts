// Liga a janela da apresentação à janela do apresentador (o mesmo browser, duas janelas).
// Cada apresentação tem o seu canal: duas abertas ao mesmo tempo não se atropelam.

export type Mensagem =
  | { tipo: 'estado'; indice: number; passo: number }
  | { tipo: 'ir'; acao: 'seguinte' | 'anterior' }
  | { tipo: 'pedir-estado' }
  | { tipo: 'evento'; nome: string; dados?: unknown };

export type Canal = {
  canal: BroadcastChannel;
  enviar: (mensagem: Mensagem) => void;
};

export function criarCanal(nome: string): Canal {
  const canal = new BroadcastChannel(nome);
  return { canal, enviar: (mensagem) => canal.postMessage(mensagem) };
}

/** O canal da apresentação da arquitetura (o nome de sempre). */
export const canalDaArquitetura = criarCanal('bms-apresentacao');
export const canal = canalDaArquitetura.canal;
export const enviar = canalDaArquitetura.enviar;
