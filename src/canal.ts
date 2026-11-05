// Liga a janela da apresentação à janela do apresentador (o mesmo browser, duas janelas).

export type Mensagem =
  | { tipo: 'estado'; indice: number; passo: number }
  | { tipo: 'ir'; acao: 'seguinte' | 'anterior' }
  | { tipo: 'pedir-estado' };

export const canal = new BroadcastChannel('bms-apresentacao');

export function enviar(mensagem: Mensagem) {
  canal.postMessage(mensagem);
}
