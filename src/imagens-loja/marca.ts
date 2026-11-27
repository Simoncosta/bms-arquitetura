// A marca e os formatos das imagens da loja. As cores são as do site novo (website/src/styles/tokens.css,
// cópia fiel do bms_ui): uma comunicação só entre site, app e loja. Para mudar uma cor, muda-se lá primeiro.

export const MARCA = {
  lima: '#cdf22b', // --bms-primaria
  tinta: '#08090b', // --bms-tinta (fundo escuro, texto sobre a lima)
  papel: '#faf8f3', // --bms-papel (fundo claro, texto sobre o escuro)
  superficieEscura: '#16171a', // --bms-superficie no .tema-escuro
  textoSuaveEscuro: '#a3a19c', // --bms-texto-suave no .tema-escuro
  textoSuaveClaro: '#5c5b58', // --bms-texto-suave no tema claro
  limaFundoClaro: '#f1fac7', // --bms-primaria-fundo no tema claro
  limaTextoClaro: '#556b00', // --bms-primaria-texto no tema claro
  bordaEscura: '#2c2d31', // --bms-borda no .tema-escuro
} as const;

export type Fundo = 'escuro' | 'claro' | 'lima';
export type Composicao = 'abertura' | 'centrado' | 'inclinado' | 'dois';

export type Preset = {
  id: string;
  nome: string;
  loja: 'App Store' | 'Google Play';
  largura: number;
  altura: number;
  nota: string;
};

// Tamanhos confirmados a 27/11/2026 nas páginas oficiais:
//   Apple  — developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
//   Google — support.google.com/googleplay/android-developer/answer/9866151
export const PRESETS: Preset[] = [
  {
    id: 'iphone-grande',
    nome: 'iPhone 6,9″',
    loja: 'App Store',
    largura: 1320,
    altura: 2868,
    nota: 'Dynamic Island, ecrã grande (iPhone 16/17 Pro Max). A resolução mais alta: a Apple reduz para os outros tamanhos.',
  },
  {
    id: 'iphone-medio',
    nome: 'iPhone 6,3″',
    loja: 'App Store',
    largura: 1206,
    altura: 2622,
    nota: 'Dynamic Island, ecrã médio (iPhone 16/17 Pro). É o único tamanho de iPhone obrigatório.',
  },
  {
    id: 'android',
    nome: 'Android 9:16',
    loja: 'Google Play',
    largura: 1080,
    altura: 1920,
    nota: 'Retrato 9:16, o mínimo para a Google poder promover a app (pede pelo menos 4 capturas).',
  },
];
