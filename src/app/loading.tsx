import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      <p className="text-xs font-medium text-[var(--foreground-muted)] animate-pulse">
        Calibrating your preparation space...
      </p>
    </div>
  );
}
