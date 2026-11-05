import type { ReactNode } from 'react';

export type SlideProps = { step: number };

export type SlideDef = {
  id: string;
  /** Nome curto do slide (aparece no modo apresentador). */
  titulo: string;
  /** Quantas vezes se carrega em "seguinte" antes de mudar de slide. */
  steps: number;
  /** O que dizer neste slide (modo apresentador e tecla N). */
  notas: string;
  /** Slide com rato ativo (zoom, arrastar, botões): desliga as zonas de clique das margens. */
  interativo?: boolean;
  render: (props: SlideProps) => ReactNode;
};
