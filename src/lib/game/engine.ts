import { GameFlip, BettingStats } from '@/types/game';
import { GAME_CONFIG, BehavioralPattern, BEHAVIORAL_PATTERNS } from './config';

/**
 * Server-side random number generator for coin flips
 * Uses crypto.getRandomValues for secure randomness
 */
export function generateCoinFlip(): 'heads' | 'tails' {
  const randomValue = crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1);
  return randomValue < GAME_CONFIG.coinBias ? 'heads' : 'tails';
}

/**
 * Calculate if a bet amount is valid
 */
export function isValidBet(betAmount: number, currentBalance: number): boolean {
  return betAmount >= GAME_CONFIG.minBet && 
         betAmount <= currentBalance && 
         betAmount > 0;
}

/**
 * Process a single flip and return the result
 */
export function processFlip(
  betAmount: number,
  betSide: 'heads' | 'tails',
  currentBalance: number
): {
  result: 'heads' | 'tails';
  won: boolean;
  newBalance: number;
  isValid: boolean;
} {
  if (!isValidBet(betAmount, currentBalance)) {
    return {
      result: 'heads',
      won: false,
      newBalance: currentBalance,
      isValid: false,
    };
  }

  const result = generateCoinFlip();
  const won = result === betSide;
  const newBalance = won ? currentBalance + betAmount : currentBalance - betAmount;

  return {
    result,
    won,
    newBalance: Math.max(0, newBalance), // Prevent negative balance
    isValid: true,
  };
}

/**
 * Calculate betting statistics and behavioral patterns
 */
export function calculateBettingStats(flips: GameFlip[]): BettingStats & {
  behavioralPatterns: BehavioralPattern[];
} {
  if (flips.length === 0) {
    return {
      averageBetPercentage: 0,
      betVariance: 0,
      streakSwitching: 0,
      gamblersFallacyCount: 0,
      consistencyScore: 100,
      behavioralPatterns: [],
    };
  }

  // Calculate bet percentages (this is the key fix)
  const betPercentages = flips.map(flip => 
    (flip.betAmount / flip.balanceBefore) * 100
  );
  
  const averageBetPercentage = betPercentages.reduce((a, b) => a + b, 0) / betPercentages.length;
  
  // Calculate standard deviation of bet percentages (not dollar amounts)
  const variance = betPercentages.reduce((acc, percentage) => {
    return acc + Math.pow(percentage - averageBetPercentage, 2);
  }, 0) / betPercentages.length;
  
  const betVariance = Math.sqrt(variance);

  // Detect behavioral patterns
  const behavioralPatterns: BehavioralPattern[] = [];
  let streakSwitching = 0;
  let gamblersFallacyCount = 0;

  // Analyze streaks and switching behavior
  for (let i = 2; i < flips.length; i++) {
    const current = flips[i];
    const previous = flips[i - 1];
    const beforePrevious = flips[i - 2];

    // Gambler's fallacy: switching after 2+ consecutive losses/wins
    if (previous.result === beforePrevious.result && 
        current.betSide !== previous.betSide) {
      gamblersFallacyCount++;
      if (gamblersFallacyCount >= 2 && !behavioralPatterns.includes(BEHAVIORAL_PATTERNS.GAMBLERS_FALLACY)) {
        behavioralPatterns.push(BEHAVIORAL_PATTERNS.GAMBLERS_FALLACY);
      }
    }

    // General streak switching
    if (current.betSide !== previous.betSide) {
      streakSwitching++;
    }

    // Loss chasing: increasing bet after losses
    if (!previous.won && current.betAmount > previous.betAmount * 1.5) {
      if (!behavioralPatterns.includes(BEHAVIORAL_PATTERNS.LOSS_CHASING)) {
        behavioralPatterns.push(BEHAVIORAL_PATTERNS.LOSS_CHASING);
      }
    }

    // Overconfidence: increasing bet significantly after wins
    if (previous.won && current.betAmount > previous.betAmount * 2) {
      if (!behavioralPatterns.includes(BEHAVIORAL_PATTERNS.OVERCONFIDENCE)) {
        behavioralPatterns.push(BEHAVIORAL_PATTERNS.OVERCONFIDENCE);
      }
    }
  }

  // Calculate consistency score (lower percentage variance = higher consistency)
  // Perfect consistency (0% variance) = 100, high variance (>15%) = 0
  const consistencyScore = Math.max(0, Math.min(100, 100 - (betVariance * 4)));

  return {
    averageBetPercentage,
    betVariance,
    streakSwitching: (streakSwitching / Math.max(1, flips.length - 1)) * 100,
    gamblersFallacyCount,
    consistencyScore,
    behavioralPatterns,
  };
}

/**
 * Calculate optimal Kelly Criterion bet size
 */
export function calculateKellyBet(balance: number, bias: number = GAME_CONFIG.coinBias): number {
  // Kelly formula: f = (bp - q) / b
  // where b = odds (1:1 for coin flip), p = probability of win, q = probability of loss
  const p = bias;
  const q = 1 - bias;
  const b = 1; // 1:1 odds
  
  const kellyFraction = (b * p - q) / b;
  return balance * kellyFraction;
}

/**
 * Simulate optimal play for comparison
 */
export function simulateOptimalPlay(
  initialBalance: number,
  targetBalance: number,
  maxFlips: number = 100
): {
  finalBalance: number;
  flipsUsed: number;
  reachedTarget: boolean;
} {
  let balance = initialBalance;
  let flips = 0;
  
  while (balance >= GAME_CONFIG.minBet && 
         balance < targetBalance && 
         flips < maxFlips) {
    
    const kellyBet = calculateKellyBet(balance);
    const betAmount = Math.min(kellyBet, balance * 0.15); // Cap at 15% for safety
    
    const result = generateCoinFlip();
    const won = result === 'heads'; // Always bet on heads (the favored side)
    
    balance = won ? balance + betAmount : balance - betAmount;
    flips++;
  }
  
  return {
    finalBalance: balance,
    flipsUsed: flips,
    reachedTarget: balance >= targetBalance,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format time remaining in MM:SS format
 */
export function formatTimeRemaining(milliseconds: number): string {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
