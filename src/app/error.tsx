'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 text-center space-y-4 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-bold text-[var(--foreground)]">
            A Moment to Regroup
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            &ldquo;In the middle of difficulty lies opportunity.&rdquo; — Something unexpected interrupted this view, but your study progress is safely preserved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </button>

          <Link
            href="/today"
            className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-raised)] flex items-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Today&apos;s Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
