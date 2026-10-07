import React from 'react';
import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 text-center space-y-4 shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] mx-auto flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary)]">
            404 • Out of Bounds
          </span>
          <h2 className="text-base font-bold text-[var(--foreground)]">
            Topic Not Found in UPSC Syllabus
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            The page you are looking for has moved or does not exist in the active CSE 2027 curriculum. Let&apos;s return to your scheduled preparation.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/today"
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5" /> Return to Today&apos;s Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
