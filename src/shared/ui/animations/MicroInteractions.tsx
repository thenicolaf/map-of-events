'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface ClickAnimationProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export function ClickAnimation({
  children,
  className,
  scale = 0.95,
  duration = 150,
}: ClickAnimationProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = () => {
    setIsClicked(true);
  };

  const handleMouseUp = () => {
    setIsClicked(false);
  };

  const handleMouseLeave = () => {
    setIsClicked(false);
  };

  return (
    <div
      className={cn('transition-transform cursor-pointer', className)}
      style={{
        transform: isClicked ? `scale(${scale})` : 'scale(1)',
        transitionDuration: `${duration}ms`,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export function HoverLift({
  children,
  className,
  lift = 4,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
}) {
  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out cursor-pointer',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `translateY(-${lift}px)`;
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {children}
    </div>
  );
}

export function RippleEffect({
  children,
  className,
  color = 'rgba(255, 255, 255, 0.6)',
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div
      className={cn('relative overflow-hidden cursor-pointer', className)}
      onClick={addRipple}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            backgroundColor: color,
            animation: 'ripple 0.6s linear',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(20);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export function GlowOnHover({
  children,
  className,
  glowColor = 'rgba(59, 130, 246, 0.5)',
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out cursor-pointer',
        className
      )}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {children}
    </div>
  );
}

export function RotateOnHover({
  children,
  className,
  degrees = 5,
}: {
  children: ReactNode;
  className?: string;
  degrees?: number;
}) {
  return (
    <div
      className={cn(
        'transition-transform duration-300 ease-out cursor-pointer',
        'hover:rotate-[var(--rotation)]',
        className
      )}
      style={{
        '--rotation': `${degrees}deg`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}