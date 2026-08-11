import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Processing...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 rounded-lg bg-gray-50 border border-gray-100">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
}
