// O CONTEÚDO das imagens da loja: uma entrada por imagem, pela ordem em que aparecem na loja.
// Qualquer pessoa da equipa muda aqui os textos, a captura, o fundo e a composição, sem tocar nos componentes.
//
//   frase      → a frase principal, curta. Uma palavra entre *asteriscos* fica em destaque.
//   subtitulo  → uma linha que explica o benefício.
//   captura    → o nome do ficheiro em src/imagens-loja/capturas/ (ex.: 'aulas.png'). Se ainda não existir,
//                aparece um ecrã de espera com o nome que falta.
//   captura2   → só na composição 'dois': o segundo ecrã.
//   fundo      → 'escuro' | 'claro' | 'lima'
//   composicao → 'abertura' (com o logótipo) | 'centrado' | 'inclinado' | 'dois'
//
// Regras: português de Portugal; tratamos o cliente por tu; nunca «ginásio» nem «sócio» (é «centro» e
// «cliente»); só funcionalidades que a app tem hoje. A App Store aceita até 10 imagens e a Google Play até 8.

import type { Composicao, Fundo } from './marca.ts';

export type Entrada = {
  id: string;
  estado: 'rascunho' | 'validado';
  frase: string;
  subtitulo: string;
  captura: string;
  captura2?: string;
  fundo: Fundo;
  composicao: Composicao;
};

// RASCUNHO A VALIDAR: as frases e a ordem ainda não foram aprovadas.
export const IMAGENS: Entrada[] = [
  {
    id: 'abertura',
    estado: 'rascunho',
    frase: 'O teu centro, na *palma* da mão',
    subtitulo: 'Aulas, treino, alimentação e a equipa do centro numa só app',
    captura: 'inicio.png',
    fundo: 'escuro',
    composicao: 'abertura',
  },
  {
    id: 'aulas',
    estado: 'rascunho',
    frase: 'Marca a tua aula em *segundos*',
    subtitulo: 'Vê os horários do centro e garante o teu lugar',
    captura: 'aulas.png',
    fundo: 'lima',
    composicao: 'centrado',
  },
  {
    id: 'treino',
    estado: 'rascunho',
    frase: 'O teu treino, *exercício* a exercício',
    subtitulo: 'Séries, repetições e vídeos sempre contigo',
    captura: 'treino.png',
    fundo: 'escuro',
    composicao: 'inclinado',
  },
  {
    id: 'alimentacao',
    estado: 'rascunho',
    frase: 'A tua alimentação, *planeada*',
    subtitulo: 'O plano que o teu centro preparou, refeição a refeição',
    captura: 'alimentacao.png',
    fundo: 'claro',
    composicao: 'centrado',
  },
  {
    id: 'avaliacao',
    estado: 'rascunho',
    frase: 'Vê a tua *evolução*',
    subtitulo: 'As tuas avaliações físicas, umas ao lado das outras',
    captura: 'avaliacao.png',
    captura2: 'avaliacao-detalhe.png',
    fundo: 'escuro',
    composicao: 'dois',
  },
  {
    // Falta captura: o feed da conta de teste mostra publicações de centros reais.
    id: 'feed',
    estado: 'rascunho',
    frase: 'Tudo o que *acontece* no centro',
    subtitulo: 'Novidades, eventos e desafios no feed',
    captura: 'feed.png',
    fundo: 'claro',
    composicao: 'inclinado',
  },
  {
    // Era «Fala com a equipa do centro»: as conversas da conta de teste mostram centros reais, por isso
    // usa-se o assistente (BMS.Ai), que responde sobre horários, aulas, treino e pagamentos.
    id: 'assistente',
    estado: 'rascunho',
    frase: 'Pergunta ao *assistente* do centro',
    subtitulo: 'Horários, aulas, treino e pagamentos, respondidos na hora',
    captura: 'assistente.png',
    fundo: 'lima',
    composicao: 'centrado',
  },
  {
    id: 'qr',
    estado: 'rascunho',
    // Na app, o botão central LÊ o QR do centro (abre a câmara). Falta uma captura apresentável.
    frase: 'Lê o *QR* e entra',
    subtitulo: 'Aponta a câmara ao código do centro e está feito',
    captura: 'qr.png',
    fundo: 'escuro',
    composicao: 'centrado',
  },
];
