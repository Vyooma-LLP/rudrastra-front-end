import React from 'react';
import { CommandError } from '../../../contracts/base';

interface ErrorStateProps {
  error: CommandError | null;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  if (!error) return null;

  return (
    <div className="flex flex-col items-start p-4 rounded-lg bg-red-50 border border-red-200 text-red-900">
      <h3 className="font-semibold text-sm">Operation Failed</h3>
      <p className="text-sm mt-1">{error.message}</p>
      {error.code && <p className="text-xs mt-2 font-mono bg-red-100 px-2 py-1 rounded">Code: {error.code}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
