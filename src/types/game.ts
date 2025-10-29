export interface GameState {
  id: string;
  playerId: string;
  balance: number;
  initialBalance: number;
  targetBalance: number;
  timeRemaining: number;
  gameStartedAt: Date;
  gameEndedAt?: Date;
  isActive: boolean;
  isCompleted: boolean;
  totalFlips: number;
  winCount: number;
  lossCount: number;
  largestBet: number;
  finalResult: 'won' | 'lost' | 'timeout' | null;
}

export interface GameFlip {
  id: string;
  gameId: string;
  flipNumber: number;
  betAmount: number;
  betSide: 'heads' | 'tails';
  result: 'heads' | 'tails';
  won: boolean;
  balanceBefore: number;
  balanceAfter: number;
  timestamp: Date;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  phone?: string;
  smsOptIn: boolean;
  createdAt: Date;
  totalGames: number;
  bestScore: number;
  averageScore: number;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  finalBalance: number;
  totalFlips: number;
  gameCompletedAt: Date;
  consistencyScore: number;
}

export interface GameConfig {
  initialBalance: number;
  targetBalance: number;
  gameDurationMs: number;
  minBet: number;
  coinBias: number; // 0.6 for 60% heads
  quickChipPercentages: number[];
  quickChipAmounts: number[];
}

export interface BettingStats {
  averageBetPercentage: number;
  betVariance: number;
  streakSwitching: number;
  gamblersFallacyCount: number;
  consistencyScore: number;
}

export type GamePhase = 'landing' | 'signup' | 'instructions' | 'playing' | 'results' | 'coach';

export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  autoFocusEnabled: boolean;
}
