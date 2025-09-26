'use client';

import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export function ComponentErrorBoundary({
  children,
  fallback,
  onError
}: ComponentErrorBoundaryProps) {
  const handleError = (error: Error) => {
    console.error('Component error:', error);
    onError?.(error);
  };

  return (
    <ErrorBoundary
      level="component"
      onError={handleError}
      fallback={fallback}
    >
      {children}
    </ErrorBoundary>
  );
}

export function WidgetErrorBoundary({
  children,
  fallback,
  onError
}: ComponentErrorBoundaryProps) {
  const handleError = (error: Error) => {
    console.error('Widget error:', error);
    onError?.(error);
  };

  return (
    <ErrorBoundary
      level="widget"
      onError={handleError}
      fallback={fallback}
    >
      {children}
    </ErrorBoundary>
  );
}

export function PageErrorBoundary({
  children,
  fallback,
  onError
}: ComponentErrorBoundaryProps) {
  const handleError = (error: Error) => {
    console.error('Page error:', error);
    onError?.(error);

    // Report critical page errors
    if (process.env.NODE_ENV === 'production') {
      // Report to error tracking service
      console.log('Would report to error tracking service:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
    }
  };

  return (
    <ErrorBoundary
      level="page"
      onError={handleError}
      fallback={fallback}
      enableReporting={true}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  );
}