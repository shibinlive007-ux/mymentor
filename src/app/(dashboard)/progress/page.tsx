'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth-context';
import { SubtopicUserProgress } from '@/types/syllabus';
import { getRevisionHealthSummary } from '@/lib/revision/revision-engine';
import { RevisionManagerSheet } from '@/components/revision/RevisionManagerSheet';
import {
  AlertTriangle,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight
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
  const [isRevisionSheetOpen, setIsRevisionSheetOpen] = useState(false);

  // User progress state loaded lazily
  const [progressMap, setProgressMap] = useState<Record<string, SubtopicUserProgress>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc_syllabus_progress');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    // Baseline sample
    return {
      'p-pol-2': {
        subtopicId: 'p-pol-2',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Laxmikanth Ch 7',
        coachingAttended: true,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 25,
        mcqPracticeDone: true,
        revisionCount: 1,
        lastRevisedAt: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 days ago (overdue)
        confidenceScore: 4,
        completionPercentage: 86.7,
      },
      'p-hist-mod-1': {
        subtopicId: 'p-hist-mod-1',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Spectrum',
        coachingAttended: true,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 15,
        mcqPracticeDone: true,
        revisionCount: 2,
        lastRevisedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        confidenceScore: 4,
        completionPercentage: 93.3,
      },
      'p-hist-anc-1': {
        subtopicId: 'p-hist-anc-1',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'RS Sharma',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: false,
        pyqSolvedCount: 10,
        mcqPracticeDone: true,
        revisionCount: 0,
        lastRevisedAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago (overdue for 1d interval)
        confidenceScore: 3,
        completionPercentage: 70,
      },
    };
  });

  const totalActualWeek = mockWeeklyHours.reduce((sum, d) => sum + d.actual, 0);
  const totalPlannedWeek = mockWeeklyHours.reduce((sum, d) => sum + d.planned, 0);

  // Compute live revision health summary
  const healthSummary = getRevisionHealthSummary({
    progressMap,
    examMode,
  });

  const handleProgressMapUpdated = (updatedMap: Record<string, SubtopicUserProgress>) => {
    setProgressMap(updatedMap);
  };

  return (
    <div className="space-y-4 pb-8 animate-fadeIn">
      {/* 1. Weekly Study Hours Summary */}
      <div className="rounded-2xl p-4 bg-[var(--surface-raised)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
              Weekly Study Volume
            </span>
            <div className="text-xl font-extrabold text-[var(--foreground)] mt-0.5 font-mono">
              {totalActualWeek.toFixed(1)} / {totalPlannedWeek.toFixed(1)} hrs
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Minimal Bar Representation */}
        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {mockWeeklyHours.map((d) => {
            const heightPercent = Math.min(100, Math.round((d.actual / 10) * 100));
            const isToday = d.day === 'Tue';
            return (
              <div key={d.day} className="flex flex-col items-center gap-1.5">
                <div className="h-16 w-full bg-[var(--surface)] rounded-lg flex items-end p-1 border border-[var(--border)]">
                  <div
                    className={`w-full rounded-sm transition-all duration-300 ${
                      isToday ? 'bg-[var(--primary)]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span
                  className={`text-[10px] font-mono ${
                    isToday ? 'font-bold text-[var(--primary)]' : 'text-[var(--foreground-muted)]'
                  }`}
                >
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Spaced Revision Health Card (Interactive Revision Manager Trigger) */}
      <div
        onClick={() => setIsRevisionSheetOpen(true)}
        className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:border-[var(--primary)]/60 cursor-pointer transition-all space-y-2.5 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--foreground)]">
                Spaced Revision Health
              </span>
              <p className="text-[10px] text-[var(--foreground-muted)]">
                1, 7, 21 &amp; 45-day retention rhythm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {healthSummary.retentionFreshnessPercent}% Fresh
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors" />
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[var(--border)] text-xs">
          <div>
            <span className="font-extrabold font-mono text-amber-600 dark:text-amber-400 block">
              {healthSummary.overdueCount}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">Overdue</span>
          </div>
          <div>
            <span className="font-extrabold font-mono text-[var(--primary)] block">
              {healthSummary.dueTodayCount}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">Due Today</span>
          </div>
          <div>
            <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block">
              {healthSummary.completedCyclesCount}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">Mastered</span>
          </div>
        </div>
      </div>

      {/* 3. Neglected Subjects Alert */}
      <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-900 dark:text-amber-200">
            Neglected Subject Warning: Ethics (GS IV)
          </h4>
          <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
            You haven&apos;t revised Case Studies or Ethics theory in 7 days. My Mentor will propose a lightweight 45-minute slot tomorrow.
          </p>
        </div>
      </div>

      {/* 4. Weekly Mentor Review Summary */}
      <div className="rounded-2xl p-4 bg-[var(--surface-raised)] border border-[var(--border)] shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Weekly Strategic Mentor Review</span>
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
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] space-y-2 animate-fadeIn">
          <h4 className="font-semibold text-[var(--foreground)]">30-Day Consistency Heatmap</h4>
          <p>
            You have maintained a 14-day study streak. Consistency rate is currently 93.3% across scheduled hours.
          </p>
        </div>
      )}

      {/* Revision Manager Sheet */}
      <RevisionManagerSheet
        isOpen={isRevisionSheetOpen}
        onClose={() => setIsRevisionSheetOpen(false)}
        healthSummary={healthSummary}
        progressMap={progressMap}
        onProgressMapUpdated={handleProgressMapUpdated}
      />
    </div>
  );
}
