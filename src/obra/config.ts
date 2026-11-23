// O que muda de apresentação para apresentação, num sítio só.

import { criarCanal } from '../canal.ts';

/** O canal entre a Obra e a janela do apresentador (o seu, para não se cruzar com os outros decks). */
export const canalDaObra = criarCanal('bms-obra');

export const CORES = {
  carvao: '#18181C',
  violeta: '#723BFA',
  violetaClaro: '#9B74FF',
  lima: '#B9F500',
  branco: '#F4F4F6',
  cinza: '#9A9AA6',
  vermelho: '#EF4444',
} as const;

/** A app nova (o QR do Ato 5 e o botão do Ato 6). */
export const LINK_DA_APP = 'https://app-v2.bmsnation.com/Home';

/** Os vídeos curtos (10–20 s) da app nova, em public/obra/. Enquanto não existirem, aparece um desenho animado no lugar. */
export const VIDEOS = {
  painel: '/obra/painel.mp4',
  relatorios: '/obra/relatorios.mp4',
  fazerComigo: '/obra/fazer-comigo.mp4',
} as const;

