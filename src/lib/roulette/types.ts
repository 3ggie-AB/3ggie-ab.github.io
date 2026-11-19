export type RouletteColor = 'red' | 'black' | 'green';

export interface RouletteNumber {
  value: number;
  color: RouletteColor;
  sector: 'voisins' | 'tiers' | 'orphelins' | 'zero';
}

export type BetType =
  | 'straight' // Single number (0-36)
  | 'red'
  | 'black'
  | 'even'
  | 'odd'
  | 'low' // 1-18
  | 'high' // 19-36
  | 'dozen1' // 1-12
  | 'dozen2' // 13-24
  | 'dozen3' // 25-36
  | 'col1' // 1, 4, 7... 34
  | 'col2' // 2, 5, 8... 35
  | 'col3'; // 3, 6, 9... 36

export interface Bet {
  id: string;
  type: BetType;
  target?: number; // for straight bet (0-36)
  amount: number;
  payoutMultiplier: number; // e.g. 35 for straight, 1 for red/black, 2 for dozens
  label: string;
  coveredNumbers: number[];
}

export interface SpinRecord {
  id: string;
  spinNumber: number;
  winningNumber: number;
  color: RouletteColor;
  timestamp: number;
  totalBet: number;
  payout: number;
  netProfit: number;
  balanceAfter: number;
}

export interface ProbabilityMetrics {
  totalNumbersCovered: number;
  coveragePercentage: number;
  winProbability: number;
  totalBetAmount: number;
  expectedValue: number; // in currency ($)
  expectedValuePercentage: number;
  minWinPayout: number;
  maxWinPayout: number;
  netOutcomes: { [number: number]: number }; // number 0-36 -> net profit
}

export interface HistoryStats {
  totalSpins: number;
  redCount: number;
  blackCount: number;
  greenCount: number;
  evenCount: number;
  oddCount: number;
  lowCount: number;
  highCount: number;
  dozen1Count: number;
  dozen2Count: number;
  dozen3Count: number;
  numberFrequencies: Record<number, number>;
  hotNumbers: { number: number; count: number; color: RouletteColor }[];
  coldNumbers: { number: number; count: number; color: RouletteColor }[];
  currentStreak: {
    type: 'red' | 'black' | 'even' | 'odd' | 'none';
    length: number;
  };
  chiSquareStat: number;
  isUniform: boolean;
}

export interface PredictionInsight {
  title: string;
  category: 'hot' | 'cold' | 'streak' | 'sector' | 'kelly';
  recommendation: string;
  confidence: 'Tinggi' | 'Sedang' | 'Rendah' | 'Edukasi';
  description: string;
  dataBadge?: string;
}

export interface MonteCarloResult {
  spinsRun: number;
  initialBalance: number;
  finalBalance: number;
  totalWagered: number;
  netProfit: number;
  winRate: number;
  maxDrawdown: number;
  history: { spin: number; balance: number }[];
}
