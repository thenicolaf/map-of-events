'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SlideInProps {
  children: ReactNode;
  direction: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  triggerOnce?: boolean;
  threshold?: number;
}

export function SlideIn({
  children,
  direction,
  delay = 0,
  duration = 600,
  distance = 50,
  className,
  triggerOnce = true,
  threshold = 0.1,
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);

          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, triggerOnce, threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return `translateX(-${distance}px)`;
      case 'right':
        return `translateX(${distance}px)`;
      case 'up':
        return `translateY(-${distance}px)`;
      case 'down':
        return `translateY(${distance}px)`;
      default:
        return 'translateX(0)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all ease-out',
        className
      )}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}