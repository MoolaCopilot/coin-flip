'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface CoinFlipProps {
  isFlipping: boolean;
  result?: 'heads' | 'tails';
  size?: 'sm' | 'md' | 'lg';
}

export function CoinFlip({ isFlipping, result, size = 'md' }: CoinFlipProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 md:w-32 md:h-32',
    lg: 'w-32 h-32 md:w-40 md:h-40'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} mx-auto relative`}
      animate={isFlipping ? { rotateY: 360 } : { rotateY: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Coin Base */}
      <div className="w-full h-full rounded-full shadow-2xl shadow-primary/25 relative overflow-hidden border-2 border-gray-400/40 bg-gray-200">
        
        {/* Heads Side */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          !isFlipping && result === 'heads' ? 'opacity-100' : 'opacity-0'
        }`}>
          <Image
            src="/quarter-heads.png"
            alt="Quarter Heads"
            fill
            className="object-cover rounded-full"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>

        {/* Tails Side */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          !isFlipping && result === 'tails' ? 'opacity-100' : 'opacity-0'
        }`}>
          <Image
            src="/quarter-tails.png"
            alt="Quarter Tails"
            fill
            className="object-cover rounded-full"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>

        {/* Default State (no result yet) - Show heads by default */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          !result ? 'opacity-100' : 'opacity-0'
        }`}>
          <Image
            src="/quarter-heads.png"
            alt="Quarter"
            fill
            className="object-cover rounded-full"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>

      </div>

      {/* Spinning Blur Effect */}
      {isFlipping && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 to-pink-500/50 blur-sm"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
