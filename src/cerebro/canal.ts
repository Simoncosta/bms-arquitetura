// Liga a janela do mapa à janela do apresentador (o mesmo browser, duas janelas). Um canal
// próprio, separado do dos slides da arquitetura.

export type Contexto = {
  /** «Lobo 2 · B5», «Roteiro · passo 7 de 24», «Visão geral»… */
  onde: string;
  titulo: string;
  notas: string;
  /** O que vem a seguir, quando há um roteiro ou um percurso aberto. */
  seguinte?: string;
};

export type Mensagem =
  | { tipo: 'estado'; contexto: Contexto }
  | { tipo: 'ir'; acao: 'seguinte' | 'anterior' }
  | { tipo: 'pedir-estado' };

export const canal = new BroadcastChannel('bms-cerebro');

export function enviar(mensagem: Mensagem) {
  canal.postMessage(mensagem);
}
