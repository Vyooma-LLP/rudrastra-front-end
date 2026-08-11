import React from 'react';

interface SuccessStateProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SuccessState({ title = 'Success', message, action }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 rounded-lg bg-green-50 border border-green-100 text-center">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-green-900">{title}</h3>
        <p className="text-sm text-green-700 mt-1">{message}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
