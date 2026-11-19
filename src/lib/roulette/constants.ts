import { RouletteColor } from './types';

// European Roulette Wheel standard sequence (clockwise)
export const WHEEL_NUMBERS: number[] = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export const RED_NUMBERS = new Set<number>([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

export const BLACK_NUMBERS = new Set<number>([
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
]);

export function getNumberColor(num: number): RouletteColor {
  if (num === 0) return 'green';
  return RED_NUMBERS.has(num) ? 'red' : 'black';
}

// French Call Bets / Sectors on European Wheel
// Voisins du Zéro (Neighbors of Zero): 17 numbers (22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25)
export const VOISINS_NUMBERS = [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25];

// Le Tiers du Cylindre: 12 numbers (27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33)
export const TIERS_NUMBERS = [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33];

// Orphelins (Orphans): 8 numbers (1, 20, 14, 31, 9, 17, 34, 6)
export const ORPHELINS_NUMBERS = [1, 20, 14, 31, 9, 17, 34, 6];

// Chip options
export interface ChipConfig {
  value: number;
  label: string;
  color: string;
  border: string;
  textColor: string;
}

export const CHIP_CONFIGS: ChipConfig[] = [
  { value: 1, label: '1', color: 'bg-stone-100 hover:bg-stone-200', border: 'border-stone-400', textColor: 'text-stone-900' },
  { value: 5, label: '5', color: 'bg-red-600 hover:bg-red-500', border: 'border-red-300', textColor: 'text-white' },
  { value: 25, label: '25', color: 'bg-emerald-600 hover:bg-emerald-500', border: 'border-emerald-300', textColor: 'text-white' },
  { value: 50, label: '50', color: 'bg-blue-600 hover:bg-blue-500', border: 'border-blue-300', textColor: 'text-white' },
  { value: 100, label: '100', color: 'bg-purple-600 hover:bg-purple-500', border: 'border-purple-300', textColor: 'text-white' },
  { value: 500, label: '500', color: 'bg-amber-500 hover:bg-amber-400', border: 'border-amber-200', textColor: 'text-amber-950 font-black' },
];

// Helper to get covered numbers for any bet type
export function getCoveredNumbers(type: string, target?: number): number[] {
  switch (type) {
    case 'straight':
      return target !== undefined ? [target] : [];
    case 'red':
      return Array.from(RED_NUMBERS);
    case 'black':
      return Array.from(BLACK_NUMBERS);
    case 'even':
      return Array.from({ length: 36 }, (_, i) => i + 1).filter((n) => n % 2 === 0);
    case 'odd':
      return Array.from({ length: 36 }, (_, i) => i + 1).filter((n) => n % 2 !== 0);
    case 'low':
      return Array.from({ length: 18 }, (_, i) => i + 1);
    case 'high':
      return Array.from({ length: 18 }, (_, i) => i + 19);
    case 'dozen1':
      return Array.from({ length: 12 }, (_, i) => i + 1);
    case 'dozen2':
      return Array.from({ length: 12 }, (_, i) => i + 13);
    case 'dozen3':
      return Array.from({ length: 12 }, (_, i) => i + 25);
    case 'col1':
      return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
    case 'col2':
      return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
    case 'col3':
      return [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
    default:
      return [];
  }
}

export function getBetPayoutMultiplier(type: string): number {
  switch (type) {
    case 'straight':
      return 35; // 35:1
    case 'dozen1':
    case 'dozen2':
    case 'dozen3':
    case 'col1':
    case 'col2':
    case 'col3':
      return 2; // 2:1
    case 'red':
    case 'black':
    case 'even':
    case 'odd':
    case 'low':
    case 'high':
      return 1; // 1:1
    default:
      return 1;
  }
}
