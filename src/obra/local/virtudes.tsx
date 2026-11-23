// As virtudes da dinâmica da caixa, pela ordem das cartas. O ecrã mostra só a REPRESENTAÇÃO (o ícone e a cor):
// o texto lê-o o apresentador. O `marco` é o que cada virtude ilumina no fecho da apresentação.

import type { ComponentType } from 'react';
import {
  AlarmClock, BadgeCheck, Bird, Brain, Flame, Gem, Gift, Hammer, Handshake, HandHeart, Heart, LayoutGrid,
  PartyPopper, Scale, Smile, SmilePlus, Sparkles, Sun, Zap, type LucideProps,
} from 'lucide-react';
import { CORES } from '../config.ts';

/** A borboleta da Felicidade («quanto mais a persegues, mais ela foge») — não existe no lucide. */
export function Borboleta({ size = 24, strokeWidth = 2, color = 'currentColor' }: LucideProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7v13" />
      <path d="M12 9C10 4.5 4.5 3 3 5.5c-1.4 2.4 1 6 5 6.5-3 1-4 4.5-1.8 6 2.2 1.4 4.8-1.5 5.8-4" />
      <path d="M12 9c2-4.5 7.5-6 9-3.5 1.4 2.4-1 6-5 6.5 3 1 4 4.5 1.8 6-2.2 1.4-4.8-1.5-5.8-4" />
      <path d="M10.5 4.5 12 7l1.5-2.5" />
    </svg>
  );
}

export type Virtude = {
  id: string;
  /** O nome (só no apresentador e no fecho). */
  nome: string;
  Icone: ComponentType<LucideProps>;
  cor: string;
  /** O marco da Obra a que esta virtude corresponde, no fecho. */
  marco: string;
};

const { lima } = CORES;

export const VIRTUDES: Virtude[] = [
  { id: 'organizacao', nome: 'Organização', Icone: LayoutGrid, cor: lima, marco: 'as salas do código, cada uma no seu sítio' },
  { id: 'alegria', nome: 'Alegria', Icone: Sun, cor: lima, marco: 'o design novo, que dá gosto abrir' },
  { id: 'seriedade', nome: 'Seriedade', Icone: Scale, cor: lima, marco: 'cada mudança provada contra o sistema de hoje' },
  { id: 'elegancia', nome: 'Elegância', Icone: Gem, cor: lima, marco: 'ecrãs mais claros e consistentes' },
  { id: 'meiguice', nome: 'Meiguice', Icone: Heart, cor: lima, marco: 'o «Fazer comigo», que guia sem pressa' },
  { id: 'extroversao', nome: 'Extroversão', Icone: PartyPopper, cor: lima, marco: 'o produto aberto à equipa, para mexer' },
  { id: 'felicidade', nome: 'Felicidade', Icone: Borboleta, cor: lima, marco: 'menos incêndios, mais tempo para o cliente' },
  { id: 'coragem', nome: 'Coragem', Icone: Flame, cor: lima, marco: 'trocar os alicerces sem fechar a loja' },
  { id: 'inteligencia', nome: 'Inteligência', Icone: Brain, cor: lima, marco: 'o cérebro que sugere o próximo passo' },
  { id: 'simpatia', nome: 'Simpatia', Icone: SmilePlus, cor: lima, marco: 'a app que se entende sozinha' },
  { id: 'amizade', nome: 'Amizade', Icone: Handshake, cor: lima, marco: 'uma comunicação única, para todos' },
  { id: 'pontualidade', nome: 'Pontualidade', Icone: AlarmClock, cor: lima, marco: 'o backup fora da hora de ponta' },
  { id: 'solidariedade', nome: 'Solidariedade', Icone: HandHeart, cor: lima, marco: 'cada erro encontrado fica resolvido para todos' },
  { id: 'beleza', nome: 'Beleza', Icone: Sparkles, cor: lima, marco: 'come-se com os olhos' },
  { id: 'paz', nome: 'Paz', Icone: Bird, cor: lima, marco: 'nenhum teste mexe nos dados de um centro' },
  { id: 'dinamica', nome: 'Dinâmica', Icone: Zap, cor: lima, marco: 'de 3 segundos para 1, nas listas pesadas' },
  { id: 'trabalho', nome: 'Trabalho', Icone: Hammer, cor: lima, marco: 'as noites dos índices, sem um erro' },
  { id: 'responsabilidade', nome: 'Responsabilidade', Icone: BadgeCheck, cor: lima, marco: 'o interruptor para voltar atrás em segundos' },
  { id: 'caridade', nome: 'Caridade', Icone: Gift, cor: lima, marco: 'abrir a caixa e dividir com todos' },
];

/** Ícones que não são virtude mas aparecem na dinâmica. */
export const IconeDoSorriso = Smile;
