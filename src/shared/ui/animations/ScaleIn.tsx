'use client';

import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
  trigger?: boolean;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 400,
  initialScale = 0.8,
  className,
  trigger = true,
}: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay, trigger]);

  return (
    <div
      className={cn('transition-all ease-out', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : `scale(${initialScale})`,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function PulseAnimation({
  children,
  className,
  intensity = 1.05,
  duration = 1000,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
}) {
  return (
    <div
      className={cn('animate-pulse', className)}
      style={{
        animation: `pulse-custom ${duration}ms ease-in-out infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes pulse-custom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(${intensity});
          }
        }
      `}</style>
    </div>
  );
}