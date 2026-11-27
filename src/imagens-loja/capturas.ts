// As capturas reais da app vivem em src/imagens-loja/capturas/. Basta largar lá o ficheiro com o nome
// que está no conteudo.ts: o Vite apanha-o sozinho, sem mexer em código.

const FICHEIROS = import.meta.glob('./capturas/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function urlDaCaptura(nome: string | undefined): string | undefined {
  return nome ? FICHEIROS[`./capturas/${nome}`] : undefined;
}
