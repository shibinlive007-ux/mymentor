'use client';

import React from 'react';
import { DailyActivityRecord, PyqTrackingSummary } from '@/types/analytics';
import { Flame, CheckSquare, FileText, Calendar } from 'lucide-react';

interface ConsistencyHeatmapProps {
  activityGrid: DailyActivityRecord[];
  streakDays: number;
  consistencyPercent: number;
  pyqSummary: PyqTrackingSummary;
}

const LEVEL_COLORS = {
  0: 'bg-[var(--surface-raised)] border-[var(--border)]',
  1: 'bg-emerald-500/30 border-emerald-500/40',
  2: 'bg-emerald-500/60 border-emerald-500/70',
  3: 'bg-emerald-600 border-emerald-700',
};

export function ConsistencyHeatmap({
  activityGrid,
  streakDays,
  consistencyPercent,
  pyqSummary,
}: ConsistencyHeatmapProps) {
  const totalDaysActive = activityGrid.filter((d) => d.hours > 0).length;

  return (
    <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--foreground)]">
              30-Day Consistency Heatmap &amp; PYQs
            </h3>
            <p className="text-[10px] text-[var(--foreground-muted)]">
              Compounds quietly over 365+ days to build competitive stamina
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-500/20">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{streakDays}d Streak</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {consistencyPercent}%
          </span>
        </div>
      </div>

      {/* 30-Day Grid */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
          {activityGrid.map((day) => (
            <div
              key={day.date}
              className={`h-6 sm:h-7 rounded-lg border flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer group relative ${
                LEVEL_COLORS[day.level]
              }`}
              title={`${day.date} (${day.dayLabel}): ${day.hours}h (${day.sessionsCount} sessions)`}
            >
              <span className="text-[9px] font-mono text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]">
                {day.hours > 0 ? `${day.hours}h` : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] text-[var(--foreground-muted)] pt-1">
          <span>{totalDaysActive} of 30 days active</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/30" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/60" />
            <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
            <span>7h+</span>
          </div>
        </div>
      </div>

      {/* PYQ Volume Tracker Split */}
      <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-[var(--border)]">
        <div className="p-3 rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Prelims MCQs</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-extrabold font-mono text-[var(--foreground)]">
              {pyqSummary.prelimsMcqsSolvedThisWeek}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">
              +{pyqSummary.prelimsMcqsSolvedThisWeek} this week / {pyqSummary.prelimsMcqsSolvedTotal} total
            </span>
          </div>
          <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((pyqSummary.prelimsMcqsSolvedTotal / pyqSummary.prelimsMcqsTarget) * 100)
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Mains Answers</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-extrabold font-mono text-[var(--foreground)]">
              {pyqSummary.mainsAnswersThisWeek}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">
              +{pyqSummary.mainsAnswersThisWeek} this week / {pyqSummary.mainsAnswersTotal} total
            </span>
          </div>
          <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((pyqSummary.mainsAnswersTotal / pyqSummary.mainsAnswersTarget) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
