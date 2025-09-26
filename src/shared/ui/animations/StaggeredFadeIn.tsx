'use client';

import { ReactNode, Children } from 'react';
import { FadeIn } from './FadeIn';

interface StaggeredFadeInProps {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
}

export function StaggeredFadeIn({
  children,
  staggerDelay = 100,
  initialDelay = 0,
  duration = 500,
  direction = 'up',
  distance = 20,
  className,
}: StaggeredFadeInProps) {
  const childrenArray = Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => {
        const totalDelay = initialDelay + (index * staggerDelay);

        return (
          <FadeIn
            key={index}
            delay={totalDelay}
            duration={duration}
            direction={direction}
            distance={distance}
          >
            {child}
          </FadeIn>
        );
      })}
    </div>
  );
}