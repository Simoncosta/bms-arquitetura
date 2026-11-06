export type LoboId = 'E' | 'B' | 'I';

/** O que já existe na BMS, para o modo «O que já temos». */
export type Estado = 'existe' | 'parcial' | 'curso' | 'falta' | 'problema' | 'nota';

export type Extra =
  | { tipo: 'lista'; itens: { rotulo: string; texto: string }[] }
  | {
      tipo: 'colunas';
      esquerda: { titulo: string; itens: string[] };
      direita: { titulo: string; itens: string[] };
    };

/** A imagem do painel: o que se mostra em vez de texto. */
export type Visual =
  | { tipo: 'numero'; valor: string; legenda: string; tom?: 'lima' | 'problema' }
  | {
      tipo: 'versus';
      a: { valor: string; legenda: string; tom?: 'lima' | 'problema' | 'neutro' };
      b: { valor: string; legenda: string; tom?: 'lima' | 'problema' | 'neutro' };
      nota?: string;
    }
  | { tipo: 'cadeia'; elos: { icone: string; rotulo: string }[]; ativo?: number }
  | { tipo: 'escada'; degraus: { rotulo: string; texto: string }[] }
  | { tipo: 'medidor'; percentagem: number; legenda: string }
  | { tipo: 'tempo'; marcos: { quando: string; oQue: string }[] }
  | { tipo: 'telemovel'; variante: 'fixo' | 'vivo' }
  | { tipo: 'cartao'; titulo: string; porque: string; efeito: string; desfazer: string };

/** Um botão no painel que faz alguma coisa: arrancar um percurso ou abrir a outra apresentação. */
export type Acao =
  | { tipo: 'percurso'; id: string; rotulo: string }
  | { tipo: 'apresentacao'; ver: string; rotulo: string };

export type Ponto = {
  /** F1, B3, I7, T2, Q4… — o código que se diz em voz alta. */
  id: string;
  /**
   * Lobo onde vive; 'T' = transversal (fora dos lobos); 'Q' = pergunta prevista (não está no
   * mapa: vive na bandeja «Perguntas», por baixo, e abre-se quando alguém pergunta).
   */
  lobo: LoboId | 'T' | 'Q';
  /** Nome de um ícone do lucide-react (ver icones.tsx). */
  icone: string;
  titulo: string;
  /** A frase solta que aparece no ecrã. Curta. */
  frase: string;
  /** O número que prova, se houver. */
  prova?: string;
  /** De onde vem a prova. */
  fonte?: string;
  estado: Estado;
  /** O que dizer — só na janela do apresentador (P) e na tecla N. */
  notas: string;
  visual?: Visual;
  extra?: Extra;
  acao?: Acao;
};

export type Lobo = {
  id: LoboId;
  numero: number;
  icone: string;
  titulo: string;
  frase: string;
  notas: string;
  /** Canto superior esquerdo e tamanho, em coordenadas do mapa. */
  x: number;
  y: number;
  largura: number;
  altura: number;
  /** Onde as sinapses tocam o lobo fechado (percentagens). */
  pega: { left: string; top: string };
  semente: number;
};

/** Um passo aponta para um ponto, para um lobo («lobo-E») ou para o centro («centro»). */
export type Passo = { no: string; frase: string; notas: string };

export type Percurso = {
  id: string;
  rotulo: string;
  titulo: string;
  frase: string;
  /** «roteiro»: a história da apresentação (abre o painel de cada ponto). «caminho»: acende o fluxo nó a nó. */
  modo: 'roteiro' | 'caminho';
  passos: Passo[];
};
