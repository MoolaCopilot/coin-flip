'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MoolaLogo } from '@/components/ui/MoolaLogo';
import { Coins, Target, Clock, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen gradient-mesh overflow-hidden">
      {/* Header with Logo */}
      <div className="absolute top-6 left-6 z-10">
        <MoolaLogo size="lg" white />
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="w-full max-w-4xl mx-auto">
        {/* Animated Coin */}
        <motion.div
          className="mb-8"
          animate={{ 
            rotateY: isHovered ? 180 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full gradient-bg flex items-center justify-center shadow-2xl shadow-primary/25">
              <Coins className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg">
            <span className="gradient-text">You get $25</span>
            <br />
            <span className="text-white">and a biased coin</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
            The coin lands <span className="gradient-text font-bold">Heads 60% of the time</span>
          </p>
          
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Can you grow it to <span className="text-green-400 font-bold">$150</span> in 5 minutes?
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <Button
            size="lg"
            className="btn-gradient text-lg px-8 py-4 h-auto font-bold text-white border-0 touch-target"
            onClick={() => {
              // Navigate to signup
              window.location.href = '/signup';
            }}
          >
            Play Free — 5-Minute Challenge
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          <Card className="glass-card p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-white mb-2">$25 → $150</h3>
            <p className="text-sm text-white/70">6x your money in 5 minutes</p>
          </Card>
          
          <Card className="glass-card p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-white mb-2">5 Minutes</h3>
            <p className="text-sm text-white/70">Fast-paced, exciting challenge</p>
          </Card>
          
          <Card className="glass-card p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-white mb-2">Learn Strategy</h3>
            <p className="text-sm text-white/70">Discover smart risk management</p>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm text-white/60 mt-8"
        >
          Educational simulation. No real money.
        </motion.p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-pink-500/10 blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-purple-500/10 blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
      </div>
    </div>
  );
}