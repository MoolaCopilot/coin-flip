'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MoolaLogo } from '@/components/ui/MoolaLogo';
import { VideoEmbed, RESULT_VIDEOS, VideoType } from '@/components/ui/VideoEmbed';
import { 
  Trophy, 
  TrendingUp, 
  BarChart3, 
  Target,
  Clock,
  Coins,
  RefreshCw,
  ExternalLink,
  Share2
} from 'lucide-react';
import { formatCurrency } from '@/lib/game/engine';
import { useSearchParams } from 'next/navigation';

interface GameResults {
  finalBalance: number;
  totalFlips: number;
  result: 'won' | 'lost' | 'timeout';
  winRate: number;
  consistencyScore: number;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<GameResults>({
    finalBalance: 25,
    totalFlips: 0,
    result: 'lost',
    winRate: 0,
    consistencyScore: 0,
  });
  const [showCoach, setShowCoach] = useState(false);

  useEffect(() => {
    // Get results from URL params
    const balance = parseFloat(searchParams.get('balance') || '25');
    const flips = parseInt(searchParams.get('flips') || '0');
    const result = (searchParams.get('result') || 'lost') as 'won' | 'lost' | 'timeout';
    
    setResults({
      finalBalance: balance,
      totalFlips: flips,
      result,
      winRate: Math.random() * 40 + 40, // Simulate win rate between 40-80%
      consistencyScore: Math.random() * 40 + 30, // Simulate consistency score
    });
  }, [searchParams]);

  const getResultIcon = () => {
    switch (results.result) {
      case 'won':
        return { icon: Trophy, color: 'text-green-400', bg: 'bg-green-400/20' };
      case 'timeout':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
      default:
        return { icon: Target, color: 'text-red-400', bg: 'bg-red-400/20' };
    }
  };

  const getResultMessage = () => {
    switch (results.result) {
      case 'won':
        return {
          title: 'Congratulations! 🎉',
          subtitle: 'You reached the $150 goal!',
          message: 'You successfully grew your bankroll and beat the challenge.'
        };
      case 'timeout':
        return {
          title: 'Time\'s Up! ⏰',
          subtitle: 'You ran out of time',
          message: 'You made good progress but didn\'t reach the goal in time.'
        };
      default:
        return {
          title: 'Game Over 💸',
          subtitle: 'Your balance ran too low',
          message: 'You ran out of money to continue playing.'
        };
    }
  };

  const resultInfo = getResultIcon();
  const resultMessage = getResultMessage();
  const progressPercentage = Math.min(100, (results.finalBalance / 150) * 100);

  // Determine which video to show based on outcome
  const getVideoType = (): VideoType => {
    if (results.finalBalance <= 0) {
      return 'BANKRUPT'; // Went to $0.00
    } else if (results.finalBalance >= 150) {
      return 'WON'; // Reached $150+ cap
    } else {
      return 'TIMEOUT'; // Didn't reach $150
    }
  };

  const videoType = getVideoType();
  const vimeoId = RESULT_VIDEOS[videoType];

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header with Logo */}
        <div className="flex justify-center mb-6">
          <MoolaLogo size="lg" white />
        </div>
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${resultInfo.bg} mb-4`}>
            <resultInfo.icon className={`w-10 h-10 ${resultInfo.color}`} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {resultMessage.title}
          </h1>
          <p className="text-xl text-white/80 mb-2">
            {resultMessage.subtitle}
          </p>
          <p className="text-white/70">
            {resultMessage.message}
          </p>
        </motion.div>

        {/* Final Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-white">Final Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {formatCurrency(results.finalBalance)}
                </div>
                <div className="text-white/70">
                  Started with {formatCurrency(25)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/80">
                  <span>Progress to $150 goal</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Coins className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-white">{results.totalFlips}</div>
              <div className="text-xs text-white/70">Total Flips</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white">{Math.round(results.winRate)}%</div>
              <div className="text-xs text-white/70">Win Rate</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{Math.round(results.consistencyScore)}</div>
              <div className="text-xs text-white/70">Consistency</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">
                {results.finalBalance >= 150 ? '✅' : '❌'}
              </div>
              <div className="text-xs text-white/70">Goal Reached</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Educational Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {videoType === 'BANKRUPT' && '💸 What Happened & How to Avoid It'}
                  {videoType === 'TIMEOUT' && '⏰ Getting Closer to the Goal'}
                  {videoType === 'WON' && '🎉 Congratulations! You Mastered It'}
                </h3>
                <p className="text-white/80 text-sm">
                  {videoType === 'BANKRUPT' && 'Learn why going bust happens and how to prevent it'}
                  {videoType === 'TIMEOUT' && 'Discover strategies to reach the goal faster'}
                  {videoType === 'WON' && 'See why your strategy worked so well'}
                </p>
              </div>
              
              <VideoEmbed 
                vimeoId={vimeoId}
                title={`Moola Educational Video - ${videoType}`}
                className="w-full"
              />
              
              {!vimeoId && (
                <div className="text-center text-white/60 text-sm mt-2">
                  Educational video coming soon
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Coach Section Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Card className="glass-card border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    🧠 Moola Coach Analysis
                  </h3>
                  <p className="text-white/80 text-sm">
                    See how steady betting would have performed
                  </p>
                </div>
                <Button
                  onClick={() => setShowCoach(!showCoach)}
                  variant="outline"
                  className="btn-glass"
                >
                  {showCoach ? 'Hide' : 'Show'} Analysis
                </Button>
              </div>
              
              {showCoach && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-white/20"
                >
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">💡 Key Insight</h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        Players who bet a consistent 15% of their balance each time typically 
                        outperform those who vary their bet sizes dramatically. This is because 
                        steady sizing protects against devastating losses while still allowing 
                        for compound growth.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">📊 Your Patterns</h4>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• Consistency Score: {Math.round(results.consistencyScore)}/100</li>
                        <li>• {results.consistencyScore > 70 ? 'Great job staying disciplined!' : 'Try more consistent bet sizing next time'}</li>
                        <li>• {results.winRate > 55 ? 'You took advantage of the 60% bias well' : 'Remember: Heads wins 60% of the time'}</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">🚀 This is how Moola works</h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        Just like this game rewards disciplined risk-taking, Moola automatically 
                        sizes your investments using proven strategies. No emotional decisions, 
                        no guesswork—just smart, consistent growth.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => window.location.href = '/game'}
              className="btn-gradient font-semibold py-3 h-auto touch-target"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.open('https://moola.com', '_blank')}
              variant="outline"
              className="btn-glass font-semibold py-3 h-auto touch-target flex items-center justify-center"
              size="lg"
            >
              <MoolaLogo size="sm" white className="mr-2" />
              See How Moola Works
            </Button>
          </div>
          
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'I just played the Moola Coin Flip Challenge!',
                  text: `I turned $25 into ${formatCurrency(results.finalBalance)} in the 5-minute coin flip challenge. Can you beat my score?`,
                  url: window.location.origin,
                });
              } else {
                // Fallback for browsers without Web Share API
                const text = `I just turned $25 into ${formatCurrency(results.finalBalance)} in the Moola Coin Flip Challenge! Can you beat my score? ${window.location.origin}`;
                navigator.clipboard.writeText(text);
                alert('Share text copied to clipboard!');
              }
            }}
            variant="outline"
            className="w-full btn-glass font-semibold py-3 h-auto touch-target"
            size="lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share My Score
          </Button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-white/60 text-sm leading-relaxed">
            This educational simulation is inspired by Victor Haghani & Richard Dewey's 
            "Rational Decision Making Under Uncertainty" experiment.
            <br />
            No real money or prizes involved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
