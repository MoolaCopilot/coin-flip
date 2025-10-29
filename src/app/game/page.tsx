'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Coins, 
  Target, 
  TrendingUp,
  Repeat,
  Zap
} from 'lucide-react';
import { CoinFlip } from '@/components/game/CoinFlip';
import { MoolaLogo } from '@/components/ui/MoolaLogo';
import { GAME_CONFIG } from '@/lib/game/config';
import { formatCurrency, formatTimeRemaining, processFlip } from '@/lib/game/engine';
import { GameState, GameFlip } from '@/types/game';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    id: '',
    playerId: '',
    balance: GAME_CONFIG.initialBalance,
    initialBalance: GAME_CONFIG.initialBalance,
    targetBalance: GAME_CONFIG.targetBalance,
    timeRemaining: GAME_CONFIG.gameDurationMs,
    gameStartedAt: new Date(),
    isActive: true,
    isCompleted: false,
    totalFlips: 0,
    winCount: 0,
    lossCount: 0,
    largestBet: 0,
    finalResult: null,
  });

  const [currentBet, setCurrentBet] = useState<number>(2.50);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
  const [lastBetType, setLastBetType] = useState<{ wasPercentage: boolean; percentage?: number } | null>(null);
  const [lastBet, setLastBet] = useState<{ amount: number; side: 'heads' | 'tails'; wasPercentage?: boolean; percentage?: number } | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<{ result: 'heads' | 'tails'; won: boolean } | null>(null);
  const [gameFlips, setGameFlips] = useState<GameFlip[]>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!gameState.isActive || gameState.isCompleted) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1000);
        
        if (newTimeRemaining <= 0) {
          return {
            ...prev,
            timeRemaining: 0,
            isActive: false,
            isCompleted: true,
            finalResult: prev.balance >= prev.targetBalance ? 'won' : 'timeout',
            gameEndedAt: new Date(),
          };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isActive, gameState.isCompleted]);

  // Show win animation when reaching target but don't end game
  useEffect(() => {
    if (gameState.balance >= gameState.targetBalance && gameState.isActive && !showWinAnimation) {
      setShowWinAnimation(true);
      setTimeout(() => setShowWinAnimation(false), 3000);
    }
  }, [gameState.balance, gameState.targetBalance, gameState.isActive, showWinAnimation]);

  // Check for bust condition
  useEffect(() => {
    if (gameState.balance < GAME_CONFIG.minBet && gameState.isActive) {
      setGameState(prev => ({
        ...prev,
        isActive: false,
        isCompleted: true,
        finalResult: 'lost',
        gameEndedAt: new Date(),
      }));
    }
  }, [gameState.balance, gameState.isActive]);

  const handleFlip = useCallback(async () => {
    if (!gameState.isActive || isFlipping || currentBet < GAME_CONFIG.minBet || currentBet > gameState.balance) {
      return;
    }

    setIsFlipping(true);
    setLastResult(null);

    // Process the flip
    const flipResult = processFlip(currentBet, selectedSide, gameState.balance);
    
    if (!flipResult.isValid) {
      setIsFlipping(false);
      return;
    }

    // Create flip record
    const newFlip: GameFlip = {
      id: `flip-${Date.now()}`,
      gameId: gameState.id,
      flipNumber: gameState.totalFlips + 1,
      betAmount: currentBet,
      betSide: selectedSide,
      result: flipResult.result,
      won: flipResult.won,
      balanceBefore: gameState.balance,
      balanceAfter: flipResult.newBalance,
      timestamp: new Date(),
    };

    // Store the last bet for "Same Bet" functionality
    setLastBet({ 
      amount: currentBet, 
      side: selectedSide,
      wasPercentage: lastBetType?.wasPercentage || false,
      percentage: lastBetType?.percentage
    });

    // Simulate coin flip animation delay
    setTimeout(() => {
      // Set the result and stop flipping animation
      setLastResult({ result: flipResult.result, won: flipResult.won });
      setIsFlipping(false);
      
      setGameFlips(prev => [...prev, newFlip]);
      
      setGameState(prev => ({
        ...prev,
        balance: flipResult.newBalance,
        totalFlips: prev.totalFlips + 1,
        winCount: prev.winCount + (flipResult.won ? 1 : 0),
        lossCount: prev.lossCount + (flipResult.won ? 0 : 1),
        largestBet: Math.max(prev.largestBet, currentBet),
      }));
    }, 1000);
  }, [gameState, currentBet, selectedSide, isFlipping]);

  const handleQuickChip = (percentage: number) => {
    const amount = (gameState.balance * percentage) / 100;
    setCurrentBet(Math.min(amount, gameState.balance));
    // Track that this was a percentage bet
    setLastBetType({ wasPercentage: true, percentage: percentage });
  };

  const handleQuickAmount = (amount: number) => {
    setCurrentBet(Math.min(amount, gameState.balance));
    // Track that this was a fixed amount bet
    setLastBetType({ wasPercentage: false });
  };

  const handleSameBet = () => {
    if (lastBet) {
      if (lastBet.wasPercentage && lastBet.percentage) {
        // If last bet was a percentage, calculate new amount based on current balance
        const amount = (gameState.balance * lastBet.percentage) / 100;
        setCurrentBet(Math.min(amount, gameState.balance));
      } else {
        // If last bet was a fixed amount, use that amount
        setCurrentBet(Math.min(lastBet.amount, gameState.balance));
      }
      setSelectedSide(lastBet.side);
    }
  };

  const handleMaxBet = () => {
    setCurrentBet(gameState.balance);
    // Track that this was a fixed amount bet (max)
    setLastBetType({ wasPercentage: false });
  };

  // Redirect to results when game is completed
  useEffect(() => {
    if (gameState.isCompleted) {
      // Determine final result based on balance and time
      const finalResult = gameState.balance >= gameState.targetBalance ? 'won' : 
                         gameState.timeRemaining <= 0 ? 'timeout' : 'lost';
      
      setTimeout(() => {
        window.location.href = `/results?balance=${gameState.balance}&flips=${gameState.totalFlips}&result=${finalResult}`;
      }, 2000);
    }
  }, [gameState.isCompleted, gameState.balance, gameState.totalFlips, gameState.targetBalance, gameState.timeRemaining]);

  const progressPercentage = (gameState.balance / gameState.targetBalance) * 100;
  const timeProgressPercentage = ((GAME_CONFIG.gameDurationMs - gameState.timeRemaining) / GAME_CONFIG.gameDurationMs) * 100;

  if (gameState.isCompleted) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="glass-card p-8 max-w-md mx-auto">
            <CardContent className="space-y-4">
              <div className="text-6xl mb-4">
                {gameState.finalResult === 'won' ? '🎉' : gameState.finalResult === 'timeout' ? '⏰' : '💸'}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {gameState.finalResult === 'won' ? 'Congratulations!' : 
                 gameState.finalResult === 'timeout' ? 'Time\'s Up!' : 'Game Over'}
              </h2>
              <p className="text-white/80">
                Final Balance: <span className="font-bold text-primary">{formatCurrency(gameState.balance)}</span>
              </p>
              <p className="text-sm text-white/60">
                Redirecting to results...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <div className="w-full max-w-md mx-auto flex flex-col min-h-screen">
        {/* Header with Logo */}
        <div className="flex justify-center pt-4 pb-2">
          <MoolaLogo size="md" white />
        </div>
        
        {/* Header Stats */}
        <div className="px-4 pb-4 space-y-4">
        {/* Time and Balance */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="glass-card">
            <CardContent className="p-3 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold text-white">
                {formatTimeRemaining(gameState.timeRemaining)}
              </div>
              <div className="text-xs text-white/70">Time Left</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-3 text-center">
              <Target className="w-4 h-4 mx-auto mb-1 text-green-400" />
              <div className="text-xl font-bold text-white">
                {formatCurrency(gameState.balance)}
              </div>
              <div className="text-xs text-white/70">Balance</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="glass-card">
          <CardContent className="p-3">
            <div className="flex justify-between text-xs text-white/80 mb-2">
              <span>{formatCurrency(gameState.initialBalance)}</span>
              <span className="font-medium">{Math.round(progressPercentage)}% to goal</span>
              <span className="font-medium">Goal: {formatCurrency(gameState.targetBalance)}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-white/10 border border-white/20" 
            />
          </CardContent>
        </Card>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <div className="text-base font-bold text-white">{gameState.totalFlips}</div>
            <div className="text-xs text-white/70">Flips</div>
          </div>
          <div>
            <div className="text-base font-bold text-green-400">{gameState.winCount}</div>
            <div className="text-xs text-white/70">Wins</div>
          </div>
          <div>
            <div className="text-base font-bold text-red-400">{gameState.lossCount}</div>
            <div className="text-xs text-white/70">Losses</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 px-4 pb-4 space-y-6">
        {/* Coin Display */}
        <div className="text-center">
          <CoinFlip 
            isFlipping={isFlipping}
            result={lastResult?.result}
            size="md"
          />
          
          {/* Result Display */}
          <AnimatePresence>
            {lastResult && !isFlipping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4"
              >
                <div className={`text-xl font-bold ${lastResult.won ? 'text-green-400' : 'text-red-400'}`}>
                  {lastResult.result.toUpperCase()} - {lastResult.won ? 'WIN!' : 'LOSE'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Bias Reminder */}
          <p className="text-sm text-white/70 mt-2">
            💡 Heads wins ~60% of the time
          </p>
        </div>

        {/* Betting Interface */}
        <Card className="glass-card">
          <CardContent className="p-6 space-y-6">
            {/* Bet Amount Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Bet Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <Input
                  type="number"
                  step="0.01"
                  min={GAME_CONFIG.minBet}
                  max={gameState.balance}
                  value={currentBet}
                  onChange={(e) => setCurrentBet(Math.max(GAME_CONFIG.minBet, Math.min(parseFloat(e.target.value) || 0, gameState.balance)))}
                  className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary text-lg font-bold touch-target"
                />
              </div>
            </div>

            {/* Quick Chips - Percentages */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/80">Quick Percentages</label>
              <div className="grid grid-cols-5 gap-2">
                {GAME_CONFIG.quickChipPercentages.map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickChip(percentage)}
                    className="btn-glass text-xs font-medium touch-target h-9 px-2"
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Chips - Dollar Amounts */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/80">Quick Amounts</label>
              <div className="grid grid-cols-3 gap-2">
                {GAME_CONFIG.quickChipAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(amount)}
                    disabled={amount > gameState.balance}
                    className="btn-glass text-xs font-medium touch-target h-9 px-2"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMaxBet}
                  className="btn-glass text-xs font-medium touch-target h-9 px-2"
                >
                  Max
                </Button>
                {lastBet && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSameBet}
                    className="btn-glass text-xs font-medium touch-target h-9 px-2"
                  >
                    <Repeat className="w-3 h-3 mr-1" />
                    Same
                  </Button>
                )}
              </div>
            </div>

            {/* Side Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Choose Side</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedSide === 'heads' ? 'default' : 'outline'}
                  onClick={() => setSelectedSide('heads')}
                  className={`${selectedSide === 'heads' ? 'btn-gradient' : 'btn-glass'} h-12`}
                  size="lg"
                >
                  <Coins className="w-4 h-4 mr-2" />
                  HEADS
                  <span className="text-xs ml-2">(60%)</span>
                </Button>
                <Button
                  variant={selectedSide === 'tails' ? 'default' : 'outline'}
                  onClick={() => setSelectedSide('tails')}
                  className={`${selectedSide === 'tails' ? 'btn-gradient' : 'btn-glass'} h-12`}
                  size="lg"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  TAILS
                  <span className="text-xs ml-2">(40%)</span>
                </Button>
              </div>
            </div>

            {/* Flip Button */}
            <Button
              onClick={handleFlip}
              disabled={isFlipping || !gameState.isActive || currentBet < GAME_CONFIG.minBet || currentBet > gameState.balance}
              className="w-full btn-gradient text-lg font-bold h-14 touch-target"
              size="lg"
            >
              {isFlipping ? (
                <>
                  <Zap className="w-6 h-6 mr-2 animate-spin" />
                  Flipping...
                </>
              ) : (
                <>
                  <Coins className="w-6 h-6 mr-2" />
                  FLIP COIN
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Win Animation Overlay */}
      <AnimatePresence>
        {showWinAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-r from-green-500/20 to-primary/20 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center"
            >
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-2">YOU WON!</h2>
              <p className="text-2xl text-white/90">{formatCurrency(gameState.balance)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
