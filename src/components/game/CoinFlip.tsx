'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CoinFlipProps {
  isFlipping: boolean;
  result?: 'heads' | 'tails';
  size?: 'sm' | 'md' | 'lg';
}

export function CoinFlip({ isFlipping, result, size = 'md' }: CoinFlipProps) {
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 md:w-32 md:h-32',
    lg: 'w-32 h-32 md:w-40 md:h-40'
  };

  // Handle flip animation
  useEffect(() => {
    if (isFlipping && !isAnimating) {
      setIsAnimating(true);
      
      // Always land on a clean 0° or 360° position to avoid flipped text
      // Calculate how to get to the next clean position
      const currentPos = rotationDegrees % 360;
      const rotationsToAdd = 360 * 3; // 3 full spins for effect
      
      // Always land on 0° (which shows the correct image via opacity)
      // The image switching is handled by opacity, not rotation
      const finalRotation = rotationDegrees + rotationsToAdd + (360 - currentPos);
      
      setRotationDegrees(finalRotation);
      
      // Stop animating after the duration
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  }, [isFlipping, isAnimating, result, rotationDegrees]);

  return (
    <motion.div
      className={`${sizeClasses[size]} mx-auto relative`}
      animate={{ rotateY: rotationDegrees }}
      transition={{ duration: isAnimating ? 1 : 0, ease: "easeInOut" }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Coin Base */}
      <div className="w-full h-full rounded-full shadow-2xl shadow-primary/25 relative overflow-hidden border-2 border-gray-400/40 bg-gray-200">
        
        {/* Show result after animation, heads during animation/default */}
        <div className={`absolute inset-0 transition-opacity duration-200 ${
          !isAnimating && result === 'tails' ? 'opacity-0' : 'opacity-100'
        }`}>
          <Image
            src="/quarter-heads.png"
            alt="Quarter Heads"
            fill
            className="object-cover rounded-full"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>

        {/* Show tails only when animation is done and result is tails */}
        <div className={`absolute inset-0 transition-opacity duration-200 ${
          !isAnimating && result === 'tails' ? 'opacity-100' : 'opacity-0'
        }`}>
          <Image
            src="/quarter-tails.png"
            alt="Quarter Tails"
            fill
            className="object-cover rounded-full"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>

      </div>

      {/* Spinning Blur Effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 to-pink-500/50 blur-sm"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
