// O quadro (a caixa, as vinhetas dos atos e o fecho): uma pintura em aguarela feita de camadas a profundidades diferentes (o céu ao fundo, a cliente e
// as flores à frente), que se desbloqueia como um jogo. Cada carta desbloqueia a cena da sua virtude; no fim de cada
// ato abre-se também o cenário à volta (a fachada, a rua, as árvores e o céu, a cidade). Ao abrir a caixa, tudo.
// As camadas vêm do Figma (arte/camadas/*.png, convertidas para public/obra/camadas/*.webp), com fundo verde que o
// código recorta. Todas as coordenadas estão em píxeis da composição (1920×1080).

export type Ponto = [number, number];
export type IdCamada = 'p1' | 'p2' | 'p2b' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';

export type Camada = {
  id: IdCamada;
  src: string;
  /** 0 = ao fundo (quase não se mexe) · 1 = à frente (mexe-se mais). */
  profundidade: number;
  /** Tem fundo verde para recortar (todas menos o céu). */
  verde: boolean;
  /** Só fica o que estiver dentro destas formas: limpa restos que a IA deixou fora do sítio. */
  recorte?: Ponto[][];
};

const ret = (x0: number, y0: number, x1: number, y1: number): Ponto[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const TUDO = ret(0, 0, 1920, 1080);

export const LARGURA = 1920;
export const ALTURA = 1080;

export const CAMADAS: Camada[] = [
  { id: 'p1', src: '/obra/camadas/p1-ceu.webp', profundidade: 0, verde: false },
  { id: 'p2', src: '/obra/camadas/p2-horizonte.webp', profundidade: 0.12, verde: true, recorte: [ret(0, 120, 1920, 600)] },
  { id: 'p2b', src: '/obra/camadas/p2b-horizonte-aceso.webp', profundidade: 0.12, verde: true, recorte: [ret(0, 120, 1920, 600)] },
  { id: 'p3', src: '/obra/camadas/p3-fundo.webp', profundidade: 0.3, verde: true, recorte: [ret(0, 300, 1920, 800)] },
  { id: 'p4', src: '/obra/camadas/p4-centro.webp', profundidade: 0.5, verde: true, recorte: [ret(400, 195, 1545, 800)] },
  { id: 'p5', src: '/obra/camadas/p5-rua.webp', profundidade: 0.68, verde: true, recorte: [ret(0, 470, 1920, 1080)] },
  { id: 'p6', src: '/obra/camadas/p6-cliente.webp', profundidade: 0.85, verde: true, recorte: [ret(950, 600, 1350, 1080)] },
  {
    // A IA devolveu a cena quase toda; daqui ficam só o ramo, o canteiro com a criança e a caixa.
    id: 'p7', src: '/obra/camadas/p7-frente.webp', profundidade: 1, verde: true,
    recorte: [
      [[0, 0], [620, 0], [620, 120], [470, 240], [300, 300], [150, 360], [40, 470], [0, 480]],
      [[50, 850], [440, 772], [590, 785], [692, 940], [692, 1080], [50, 1080]],
      ret(686, 935, 895, 1080),
    ],
  },
];

export type Zona = { camada: IdCamada; formas: Ponto[][] };
export type Cena = {
  /** O que se desbloqueia, em poucas palavras (aparece por baixo do quadro). */
  nome: string;
  frase: string;
  /** A cena da virtude: é para aqui que a câmara se aproxima. */
  cena: Zona[];
  /** O cenário que se abre com ela (no fim de cada ato). */
  cenario?: Zona[];
  /** Para onde a câmara olha, quando não é o centro da cena (em píxeis da composição). */
  foco?: Ponto;
};

export type Ato = { titulo: string; primeiraCarta: number };

export const ATOS: Ato[] = [
  { titulo: 'Ato I · O despertar', primeiraCarta: 1 },
  { titulo: 'Ato II · A rua abre-se', primeiraCarta: 6 },
  { titulo: 'Ato III · O vínculo', primeiraCarta: 11 },
  { titulo: 'Ato IV · O legado', primeiraCarta: 16 },
];

/** Uma cena por virtude, pela ordem das cartas (VIRTUDES[0] ↔ CENAS[0]). */
export const CENAS: Cena[] = [
  // Ato I · dentro do centro
  { nome: 'A receção arrumada', frase: 'Primeiro, cada coisa no seu sítio.', cena: [{ camada: 'p4', formas: [ret(455, 368, 582, 588)] }] },
  { nome: 'A aula de grupo', frase: 'Com a casa arrumada, volta a alegria.', cena: [{ camada: 'p4', formas: [ret(1178, 368, 1480, 590)] }] },
  { nome: 'O treinador e o plano', frase: 'A alegria precisa de foco.', cena: [{ camada: 'p4', formas: [ret(826, 368, 966, 580)] }] },
  { nome: 'O alongamento', frase: 'Fazer mais com menos.', cena: [{ camada: 'p4', formas: [ret(964, 368, 1124, 580)] }] },
  {
    nome: 'O acolhimento', frase: 'Quem chega é recebido com carinho.',
    cena: [{ camada: 'p4', formas: [ret(580, 368, 774, 590)] }],
    cenario: [{ camada: 'p4', formas: [ret(400, 320, 812, 800), ret(1138, 320, 1545, 800), ret(810, 320, 1140, 588)] }],
  },
  // Ato II · a rua abre-se
  { nome: 'A porta aberta', frase: 'As portas abrem-se para a rua.', cena: [{ camada: 'p4', formas: [ret(808, 576, 1142, 800)] }] },
  { nome: 'A criança e a borboleta', frase: 'Lá fora, a luz volta.', cena: [{ camada: 'p5', formas: [ret(352, 636, 472, 802)] }] },
  { nome: 'Os operários no telhado', frase: 'Trocar os alicerces sem fechar a casa.', cena: [{ camada: 'p4', formas: [ret(716, 195, 1252, 332)] }] },
  { nome: 'A cliente com a app', frase: 'A tecnologia ao serviço de quem treina.', cena: [{ camada: 'p6', formas: [TUDO] }], foco: [1150, 820] },
  {
    nome: 'O quiosque do café', frase: 'Um sorriso abre conversa.',
    cena: [{ camada: 'p5', formas: [ret(1558, 540, 1772, 782)] }],
    cenario: [{ camada: 'p5', formas: [ret(0, 800, 665, 1080), ret(805, 800, 1535, 1080), ret(1858, 800, 1920, 1080), ret(1535, 900, 1858, 1080), ret(665, 895, 805, 1080)] }],
  },
  // Ato III · o vínculo
  { nome: 'O abraço', frase: 'Já ninguém está sozinho.', cena: [{ camada: 'p5', formas: [ret(666, 630, 804, 894)] }] },
  { nome: 'O relógio da rua', frase: 'Cada um no seu tempo, todos a tempo.', cena: [{ camada: 'p5', formas: [ret(1202, 552, 1284, 800)] }] },
  { nome: 'A ajuda com o saco', frase: 'Quando um tropeça, outro ajuda.', cena: [{ camada: 'p5', formas: [ret(116, 616, 310, 806)] }] },
  {
    nome: 'O canteiro', frase: 'O que se cuida, floresce.',
    cena: [{ camada: 'p7', formas: [[[50, 850], [440, 772], [590, 785], [692, 940], [692, 1080], [50, 1080]]] }],
    cenario: [{ camada: 'p3', formas: [TUDO] }],
  },
  {
    nome: 'O céu', frase: 'Quando há paz, o céu abre.',
    cena: [{ camada: 'p1', formas: [ret(960, 50, 1250, 200)] }],
    cenario: [{ camada: 'p1', formas: [TUDO] }],
  },
  // Ato IV · o legado
  { nome: 'Quem corre na rua', frase: 'A cidade ganha movimento.', cena: [{ camada: 'p5', formas: [ret(1538, 672, 1858, 900), ret(1276, 652, 1394, 806)] }] },
  {
    nome: 'A grua ao longe', frase: 'Há sempre mais para construir.',
    cena: [{ camada: 'p2', formas: [ret(1390, 140, 1680, 560)] }],
    cenario: [{ camada: 'p2', formas: [TUDO] }],
  },
  {
    nome: 'O guarda e os candeeiros', frase: 'Alguém garante que nada se apaga.',
    cena: [{ camada: 'p5', formas: [ret(1418, 600, 1518, 802), ret(90, 488, 148, 788), ret(316, 488, 372, 788), ret(1516, 488, 1572, 788), ret(1788, 488, 1848, 788)] }],
  },
  { nome: 'A caixa', frase: 'Tudo o que se conquista, divide-se.', cena: [{ camada: 'p7', formas: [ret(686, 935, 895, 1080)] }] },
];
