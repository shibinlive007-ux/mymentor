'use client';

import React, { useState } from 'react';
import { WeeklyReviewSummary } from '@/types/analytics';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface WeeklyStrategicReviewCardProps {
  review: WeeklyReviewSummary;
  onRefreshReview?: () => Promise<void> | void;
}

export function WeeklyStrategicReviewCard({
  review,
  onRefreshReview,
}: WeeklyStrategicReviewCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefreshReview || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefreshReview();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[var(--surface-raised)] via-[var(--surface)] to-emerald-500/5 border border-[var(--border)] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--foreground)]">
                Weekly Strategic Mentor Review
              </h3>
              <span className="text-[10px] font-semibold text-[var(--primary)] bg-[var(--surface-raised)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                {review.weekLabel}
              </span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
              Grounded AI assessment of pacing, paper balance, and next week priorities
            </p>
          </div>
        </div>

        {onRefreshReview && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors disabled:opacity-50"
            title="Regenerate Review"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Key Stats Bar */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)] text-center text-xs">
        <div>
          <span className="text-[10px] text-[var(--foreground-muted)] block">Volume</span>
          <span className="font-extrabold font-mono text-[var(--foreground)] mt-0.5">
            {review.actualHours.toFixed(1)} / {review.plannedHours.toFixed(1)} hrs
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[var(--foreground-muted)] block">Consistency</span>
          <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {review.consistencyPercent}%
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[var(--foreground-muted)] block">Streak</span>
          <span className="font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
            {review.streakDays} days
          </span>
        </div>
      </div>

      {/* 1. What Went Well */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>What Went Well</span>
        </div>
        <div className="space-y-1 bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--foreground)]">
          {review.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <p className="leading-relaxed">{h}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Bottlenecks & Balance Alerts */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Bottlenecks &amp; Imbalances</span>
        </div>
        <div className="space-y-1 bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--foreground)]">
          {review.bottlenecks.map((b, i) => (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Next Week Strategic Focus */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--primary)]">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Strategic Focus for Next Week</span>
        </div>
        <div className="space-y-1 bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--foreground)]">
          {review.strategicRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 shrink-0" />
              <p className="leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
