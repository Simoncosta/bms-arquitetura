import type { SlideDef } from '../types.ts';
import { acto1 } from './acto1.tsx';
import { acto2 } from './acto2.tsx';
import { acto3 } from './acto3.tsx';

export const slides: SlideDef[] = [...acto1, ...acto2, ...acto3];
