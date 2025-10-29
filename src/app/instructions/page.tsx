'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoolaLogo } from '@/components/ui/MoolaLogo';
import { 
  Coins, 
  Target, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  DollarSign,
  BarChart3
} from 'lucide-react';

const instructionSteps = [
  {
    icon: DollarSign,
    title: "You start with $25",
    description: "Your virtual bankroll to grow",
    color: "text-green-400"
  },
  {
    icon: Coins,
    title: "The coin lands Heads 60% of the time",
    description: "This bias is your advantage—use it wisely",
    color: "text-primary"
  },
  {
    icon: Target,
    title: "Bet as much as you like each flip",
    description: "Minimum $0.01, maximum your entire balance",
    color: "text-pink-400"
  },
  {
    icon: Clock,
    title: "Try to reach $150 before time runs out",
    description: "You have exactly 5 minutes to 6x your money",
    color: "text-purple-400"
  },
  {
    icon: BarChart3,
    title: "Learn smart risk management",
    description: "See how steady players outperform gamblers",
    color: "text-blue-400"
  }
];

export default function InstructionsPage() {
  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      {/* Header with Logo */}
      <div className="flex justify-center pt-6 pb-2">
        <MoolaLogo size="lg" white />
      </div>
      
      {/* Header */}
      <div className="text-center pt-4 pb-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            How It Works
          </h1>
          <p className="text-white/80 text-lg">
            Simple rules, powerful lessons
          </p>
        </motion.div>
      </div>

      {/* Instructions Cards */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-lg mx-auto space-y-4">
          {instructionSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-white/80">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Key Strategy Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-lg mx-auto mt-8"
        >
          <Card className="glass-card border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  💡 Pro Tip
                </h3>
                <p className="text-white/90 leading-relaxed">
                  The best players bet a <span className="font-semibold text-primary">consistent percentage</span> of their balance each time. 
                  Avoid the temptation to "go all in" or chase losses!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Start Game Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <Button
            size="lg"
            className="btn-gradient text-lg px-8 py-4 h-auto font-bold text-white border-0 touch-target"
            onClick={() => {
              window.location.href = '/game';
            }}
          >
            Start Game
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Bottom Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-white/60 text-sm">
            This is an educational simulation inspired by behavioral finance research.
            <br />
            No real money is involved.
          </p>
        </motion.div>
      </div>

      {/* Background Animation Elements */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-1/3 left-1/5 w-20 h-20 rounded-full bg-primary/20 blur-xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-16 h-16 rounded-full bg-pink-500/20 blur-xl"
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>
    </div>
  );
}
