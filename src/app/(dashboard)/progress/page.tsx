'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth-context';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const mockWeeklyHours = [
  { day: 'Mon', planned: 7.0, actual: 7.5 },
  { day: 'Tue', planned: 7.0, actual: 6.5 },
  { day: 'Wed', planned: 7.0, actual: 8.0 },
  { day: 'Thu', planned: 7.0, actual: 5.5 },
  { day: 'Fri', planned: 7.0, actual: 7.0 },
  { day: 'Sat', planned: 8.0, actual: 8.5 },
  { day: 'Sun', planned: 5.0, actual: 4.5 },
];

export default function ProgressPage() {
  const { examMode } = useAuth();
  const [showExtendedAnalytics, setShowExtendedAnalytics] = useState(false);

  const totalActualWeek = mockWeeklyHours.reduce((sum, d) => sum + d.actual, 0);
  const totalPlannedWeek = mockWeeklyHours.reduce((sum, d) => sum + d.planned, 0);

  return (
    <div className="space-y-4 pb-6">
      {/* 1. Overall Syllabus Coverage Card */}
      <div className="rounded-2xl p-5 bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
              {examMode} Syllabus Coverage
            </span>
            <div className="text-2xl font-extrabold text-[var(--foreground)] mt-0.5">
              47.5%
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">
              On track for 2027 completion with 3 full revision cycles
            </p>
          </div>

          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            +3.2%
          </div>
        </div>

        {/* Horizontal progress bar */}
        <div className="mt-4 h-2 w-full bg-[var(--ring-track)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" style={{ width: '47.5%' }} />
        </div>
      </div>

      {/* 2. Weekly Study Hours & Consistency */}
      <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              This Week&apos;s Study Hours
            </h3>
          </div>
          <span className="text-xs font-bold text-[var(--primary)]">
            {totalActualWeek.toFixed(1)} / {totalPlannedWeek.toFixed(1)} hrs
          </span>
        </div>

        {/* Minimal Clean Bar Display */}
        <div className="grid grid-cols-7 gap-2 pt-2 pb-1 text-center items-end h-28">
          {mockWeeklyHours.map((item) => {
            const heightPercent = Math.min(100, Math.round((item.actual / 9.0) * 100));
            return (
              <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-[var(--foreground-muted)]">
                  {item.actual}h
                </span>
                <div className="w-full bg-[var(--surface-raised)] rounded-md overflow-hidden h-20 flex items-end">
                  <div
                    className="w-full bg-[var(--primary)] rounded-t-md transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-[var(--foreground-muted)]">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Revision Health & Neglected Subjects */}
      <div className="grid grid-cols-1 gap-3">
        {/* Revision Health */}
        <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">
              Spaced Revision Health
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">12 On Track</span>
              <span className="text-xs text-[var(--foreground-muted)]">•</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">2 Due Today</span>
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* Neglected Subjects Alert */}
        <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-200">
              Neglected Subject Warning: Ethics (GS IV)
            </h4>
            <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
              You haven&apos;t revised Case Studies or Ethics theory in 7 days. Your AI Mentor will propose a lightweight 45-minute slot tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Weekly AI Synthesizer Summary */}
      <div className="rounded-2xl p-4 bg-[var(--surface-raised)] border border-[var(--border)] shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Weekly AI Strategic Review</span>
        </div>
        <p className="text-xs text-[var(--foreground)] leading-relaxed">
          <strong>What went well:</strong> Excellent consistency in Modern History &amp; Polity (completed 8 PYQs).
          Daily focus averaged 6.8 hours.
        </p>
        <p className="text-xs text-[var(--foreground)] leading-relaxed">
          <strong>Next week&apos;s focus:</strong> Re-balance towards Geography Monsoon concepts and dedicate 1 answer-writing slot for GS II.
        </p>
      </div>

      {/* Progressive Disclosure: See more toggle */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={() => setShowExtendedAnalytics(!showExtendedAnalytics)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
        >
          {showExtendedAnalytics ? (
            <>Less Analytics <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Deep Analytics &amp; PYQ Heatmap <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>

      {showExtendedAnalytics && (
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] space-y-2">
          <h4 className="font-semibold text-[var(--foreground)]">30-Day Consistency Heatmap</h4>
          <p>
            You have maintained a 14-day study streak. Consistency rate is currently 93.3% across scheduled hours.
          </p>
        </div>
      )}
    </div>
  );
}
