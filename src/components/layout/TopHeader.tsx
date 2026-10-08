'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/supabase/auth-context';
import { ExamMode } from '@/types/database.types';
import { Flame, Settings } from 'lucide-react';
import { InstallPwaButton } from '@/components/pwa/InstallPwaButton';

export function TopHeader() {
  const { examMode, setExamMode, profile } = useAuth();

  const modes: { id: ExamMode; label: string }[] = [
    { id: 'prelims', label: 'Prelims' },
    { id: 'mains', label: 'Mains' },
    { id: 'combined', label: 'Combined' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Target */}
        <div className="flex items-center gap-2">
          <Link href="/today" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="My Mentor Logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain rounded-md"
              priority
            />
            <span className="font-bold text-base tracking-tight text-[var(--foreground)]">
              My <span className="text-[var(--primary)] font-extrabold">Mentor</span>
            </span>
          </Link>

          {/* Streak indicator */}
          {profile?.streak_count ? (
            <div
              className="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-semibold"
              title={`${profile.streak_count} days consistent`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{profile.streak_count}d</span>
            </div>
          ) : null}
        </div>

        {/* Right actions: Mode Selector & Settings */}
        <div className="flex items-center gap-2">
          {/* Exam Mode Toggle */}
          <div
            role="tablist"
            aria-label="Exam Mode"
            className="flex items-center p-0.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-full text-xs font-medium"
          >
            {modes.map((m) => {
              const isActive = examMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setExamMode(m.id)}
                  className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                    isActive
                      ? 'bg-[var(--surface)] text-[var(--primary)] font-semibold shadow-xs border border-[var(--border)]'
                      : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Install PWA Button (Shows when Chrome install prompt is ready) */}
          <InstallPwaButton />

          {/* Settings Link */}
          <Link
            href="/settings"
            aria-label="Settings"
            title="Settings"
            className="flex items-center justify-center p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]/60 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
