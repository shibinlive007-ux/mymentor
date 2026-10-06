'use client';

import React from 'react';
import { OnboardingStatus, EmploymentStatus } from '@/types/onboarding';
import { Briefcase, BookOpen, GraduationCap, Clock } from 'lucide-react';

interface Step2StatusProps {
  data: OnboardingStatus;
  onChange: (updated: Partial<OnboardingStatus>) => void;
}

const STATUS_OPTIONS: { id: EmploymentStatus; label: string; sub: string; icon: React.ElementType }[] = [
  {
    id: 'working',
    label: 'Working Professional',
    sub: 'Balancing job hours with focused UPSC sessions',
    icon: Briefcase,
  },
  {
    id: 'full_time',
    label: 'Full-time Prep',
    sub: 'Dedicated completely to CSE preparation',
    icon: BookOpen,
  },
  {
    id: 'student',
    label: 'College Student',
    sub: 'Studying for degree while building UPSC foundation',
    icon: GraduationCap,
  },
];

export function Step2Status({ data, onChange }: Step2StatusProps) {
  const weeklyEstimatedHours = data.weekdayHours * 5 + data.weekendHours * 2;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-2">
          What is your current preparation status?
        </label>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = data.employmentStatus === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ employmentStatus: item.id })}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]/60 shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] hover:border-slate-300'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--foreground-muted)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-[var(--foreground)]">{item.label}</h4>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekday availability */}
      <div className="rounded-xl p-4 bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--primary)]" />
            Weekday Study Availability (Mon-Fri)
          </label>
          <span className="text-xs font-bold font-mono text-[var(--primary)]">
            {data.weekdayHours} hrs/day
          </span>
        </div>
        <input
          type="range"
          min="2"
          max="12"
          step="0.5"
          value={data.weekdayHours}
          onChange={(e) => onChange({ weekdayHours: parseFloat(e.target.value) })}
          className="w-full accent-[var(--primary)] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[var(--foreground-muted)]">
          <span>2 hrs (Busy workdays)</span>
          <span>6 hrs (Balanced)</span>
          <span>12 hrs (Full-time)</span>
        </div>
      </div>

      {/* Weekend availability */}
      <div className="rounded-xl p-4 bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--primary)]" />
            Weekend Study Availability (Sat-Sun)
          </label>
          <span className="text-xs font-bold font-mono text-[var(--primary)]">
            {data.weekendHours} hrs/day
          </span>
        </div>
        <input
          type="range"
          min="3"
          max="14"
          step="0.5"
          value={data.weekendHours}
          onChange={(e) => onChange({ weekendHours: parseFloat(e.target.value) })}
          className="w-full accent-[var(--primary)] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[var(--foreground-muted)]">
          <span>3 hrs (Relaxed)</span>
          <span>8 hrs (Standard)</span>
          <span>14 hrs (Deep sprint)</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
        <span className="text-emerald-900 dark:text-emerald-200">Total estimated weekly bandwidth:</span>
        <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">
          ~{weeklyEstimatedHours} hrs/week
        </span>
      </div>
    </div>
  );
}
