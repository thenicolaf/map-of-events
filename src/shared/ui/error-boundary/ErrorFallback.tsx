'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  level?: 'page' | 'component' | 'widget';
}

export function ErrorFallback({ error, resetError, level = 'component' }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (level === 'component') {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-medium text-destructive">Component Error</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {error.message || 'Something went wrong with this component.'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={resetError}
          className="h-8"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Try Again
        </Button>
      </div>
    );
  }

  if (level === 'widget') {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Widget Unavailable</h3>
        <p className="text-muted-foreground mb-4">
          {error.message || 'This widget encountered an error and couldn\'t load properly.'}
        </p>
        <Button
          variant="outline"
          onClick={resetError}
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Page level error
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          {error.message || 'We\'re sorry, but something unexpected happened. Our team has been notified.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={resetError} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="w-full sm:w-auto"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}