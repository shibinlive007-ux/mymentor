'use client';

import React from 'react';
import { OnboardingGoals } from '@/types/onboarding';
import { Calendar, Clock } from 'lucide-react';
import { getDaysUntil } from '@/lib/utils';

interface Step6GoalsProps {
  data: OnboardingGoals;
  onChange: (updated: Partial<OnboardingGoals>) => void;
}

export function Step6Goals({ data, onChange }: Step6GoalsProps) {
  const daysToPrelims = getDaysUntil(new Date(data.prelimsDate || '2027-05-23'));

  return (
    <div className="space-y-5">
      {/* Target Hours Range */}
      <div className="rounded-xl p-4 bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--primary)]" />
            Target Daily Study Hours Range
          </label>
          <span className="text-xs font-bold font-mono text-[var(--primary)]">
            {data.dailyTargetHoursMin}h – {data.dailyTargetHoursMax}h / day
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] text-[var(--foreground-muted)] mb-1">
              Minimum (Non-negotiable)
            </label>
            <input
              type="number"
              step="0.5"
              min="2"
              max="12"
              value={data.dailyTargetHoursMin}
              onChange={(e) => onChange({ dailyTargetHoursMin: parseFloat(e.target.value) })}
              className="w-full px-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-[var(--foreground-muted)] mb-1">
              Maximum (Stretch Goal)
            </label>
            <input
              type="number"
              step="0.5"
              min="4"
              max="16"
              value={data.dailyTargetHoursMax}
              onChange={(e) => onChange({ dailyTargetHoursMax: parseFloat(e.target.value) })}
              className="w-full px-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
            />
          </div>
        </div>
      </div>

      {/* UPSC 2027 Official Calendar Dates */}
      <div className="rounded-xl p-4 bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
          <Calendar className="w-4 h-4 text-[var(--primary)]" />
          UPSC 2027 Calendar (Auto-filled &amp; Editable)
        </div>

        <div>
          <label className="block text-[11px] text-[var(--foreground-muted)] mb-1">
            UPSC CSE Prelims 2027 Date
          </label>
          <input
            type="date"
            value={data.prelimsDate}
            onChange={(e) => onChange({ prelimsDate: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] text-[var(--foreground-muted)] mb-1">
            UPSC CSE Mains 2027 Date
          </label>
          <input
            type="date"
            value={data.mainsDate}
            onChange={(e) => onChange({ mainsDate: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
          />
        </div>
      </div>

      {/* Countdown Preview */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
        <div>
          <span className="font-semibold text-emerald-950 dark:text-emerald-200 block">
            Target Countdown to Prelims
          </span>
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
            Plenty of time for foundational mastery &amp; 3 revision cycles
          </span>
        </div>
        <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
          {daysToPrelims}d
        </span>
      </div>
    </div>
  );
}
