'use client';

import { useCallback } from 'react';

interface ErrorInfo {
  componentStack?: string;
  errorBoundary?: string;
  context?: Record<string, unknown>;
}

export function useErrorHandler() {
  const reportError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error reported:', error, errorInfo);

    // In production, report to error tracking service
    if (process.env.NODE_ENV === 'production') {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...errorInfo,
      };

      // Send to error tracking service (e.g., Sentry, LogRocket, etc.)
      console.log('Would send error report:', errorReport);
    }
  }, []);

  const handleAsyncError = useCallback((error: Error, context?: Record<string, unknown>) => {
    reportError(error, { context });
  }, [reportError]);

  const wrapAsyncFunction = useCallback(
    <T extends unknown[], R>(
      fn: (...args: T) => Promise<R>,
      context?: Record<string, unknown>
    ) => {
      return async (...args: T): Promise<R> => {
        try {
          return await fn(...args);
        } catch (error) {
          handleAsyncError(error as Error, context);
          throw error; // Re-throw to allow component to handle
        }
      };
    },
    [handleAsyncError]
  );

  return {
    reportError,
    handleAsyncError,
    wrapAsyncFunction,
  };
}