import { GameConfig } from '@/types/game';

export const GAME_CONFIG: GameConfig = {
  initialBalance: 25,
  targetBalance: 150,
  gameDurationMs: 5 * 60 * 1000, // 5 minutes
  minBet: 0.01,
  coinBias: 0.6, // 60% heads
  quickChipPercentages: [10, 15, 20, 30, 40], // Percentage of balance
  quickChipAmounts: [0.25, 0.50, 1.00, 2.00, 3.00, 5.00], // Fixed dollar amounts
};

export const COIN_FLIP_MESSAGES = {
  win: [
    "Nice one! 🎉",
    "Winner! 💰",
    "You got it! ✨",
    "Great call! 🔥",
    "Boom! 💥"
  ],
  loss: [
    "Not this time! 😅",
    "Close one! 🎯",
    "Next flip! 💪",
    "Keep going! 🚀",
    "Almost! ⚡"
  ]
};

export const BEHAVIORAL_PATTERNS = {
  GAMBLERS_FALLACY: 'gamblers_fallacy', // Switching after streaks
  OVERCONFIDENCE: 'overconfidence', // Betting too much after wins
  LOSS_CHASING: 'loss_chasing', // Increasing bets after losses
  HOT_HAND: 'hot_hand', // Sticking with winning side
  ANCHORING: 'anchoring', // Sticking to initial bet amounts
} as const;

export type BehavioralPattern = typeof BEHAVIORAL_PATTERNS[keyof typeof BEHAVIORAL_PATTERNS];
