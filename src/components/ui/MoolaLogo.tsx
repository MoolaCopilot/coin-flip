'use client';

import Image from 'next/image';

interface MoolaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  white?: boolean;
}

export function MoolaLogo({ size = 'md', className = '', white = false }: MoolaLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };

  return (
    <Image
      src="/moola-logo.svg"
      alt="Moola"
      width={100}
      height={32}
      className={`${sizeClasses[size]} ${white ? 'brightness-0 invert' : ''} ${className}`}
      priority
    />
  );
}
