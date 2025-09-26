'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'normal' | 'strong';
  direction?: 'vertical' | 'horizontal';
  duration?: number;
}

export function FloatingElement({
  children,
  className,
  intensity = 'normal',
  direction = 'vertical',
  duration = 3000,
}: FloatingElementProps) {
  const getIntensityValue = () => {
    switch (intensity) {
      case 'subtle':
        return direction === 'vertical' ? '5px' : '3px';
      case 'normal':
        return direction === 'vertical' ? '10px' : '6px';
      case 'strong':
        return direction === 'vertical' ? '15px' : '10px';
      default:
        return '10px';
    }
  };

  const intensityValue = getIntensityValue();

  return (
    <div
      className={cn('animate-float', className)}
      style={{
        animation: `float-${direction} ${duration}ms ease-in-out infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes float-vertical {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-${intensityValue});
          }
        }

        @keyframes float-horizontal {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(${intensityValue});
          }
        }
      `}</style>
    </div>
  );
}

export function HoverGrow({
  children,
  className,
  scale = 1.05,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <div
      className={cn(
        'transition-transform duration-200 ease-out cursor-pointer',
        'hover:scale-105 active:scale-95',
        className
      )}
      style={{
        '--hover-scale': scale,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function ShimmerLoading({
  className,
  width = '100%',
  height = '1rem',
}: {
  className?: string;
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-muted via-muted-foreground/20 to-muted',
        'bg-[length:200%_100%] animate-shimmer rounded',
        className
      )}
      style={{
        width,
        height,
        animation: 'shimmer 2s infinite',
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export function BounceIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn('animate-bounce-in', className)}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}
    >
      {children}
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          75% {
            transform: scale(0.9);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}