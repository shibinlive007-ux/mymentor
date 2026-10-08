'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth-context';
import { SubtopicUserProgress } from '@/types/syllabus';
import { getRevisionHealthSummary } from '@/lib/revision/revision-engine';
import { RevisionManagerSheet } from '@/components/revision/RevisionManagerSheet';
import { WeeklyHoursChart, DayHourData } from '@/components/analytics/WeeklyHoursChart';
import { SubjectBalanceCard } from '@/components/analytics/SubjectBalanceCard';
import { StageProgressCards } from '@/components/analytics/StageProgressCards';
import { ConsistencyHeatmap } from '@/components/analytics/ConsistencyHeatmap';
import { WeeklyStrategicReviewCard } from '@/components/analytics/WeeklyStrategicReviewCard';
import {
  computeSubjectBalance,
  computeStageRollups,
  generateStrategicWeeklyReview,
  SubjectHourInput,
} from '@/lib/analytics/weekly-review-engine';
import { getAllSessions } from '@/lib/sessions/session-manager';
import { calculateStreakAndConsistency } from '@/lib/sessions/streak-calculator';
import { PyqTrackingSummary } from '@/types/analytics';
import {
  RotateCcw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from 'lucide-react';

const mockWeeklyHours = [
  { day: 'Mon', planned: 7.0, actual: 7.5 },
  { day: 'Tue', planned: 7.0, actual: 6.5 },
  { day: 'Wed', planned: 7.0, actual: 8.0 },
  { day: 'Thu', planned: 7.0, actual: 5.5 },
  { day: 'Fri', planned: 7.0, actual: 7.0 },
  { day: 'Sat', planned: 8.0, actual: 8.5 },
  { day: 'Sun', planned: 5.0, actual: 5.0 },
];

const mockSubjectHours: SubjectHourInput[] = [
  { subjectId: 'p-hist', subjectName: 'Modern History', stage: 'prelims', actualHours: 18.5 },
  { subjectId: 'p-pol', subjectName: 'Polity & Governance', stage: 'prelims', actualHours: 14.0 },
  { subjectId: 'p-eco', subjectName: 'Economy (GS3)', stage: 'prelims', actualHours: 9.5 },
  { subjectId: 'p-geo', subjectName: 'Geography', stage: 'prelims', actualHours: 6.0 },
  { subjectId: 'm-eth', subjectName: 'Ethics (GS IV)', stage: 'mains', actualHours: 0.0 },
  { subjectId: 'csat', subjectName: 'CSAT Quant & Reasoning', stage: 'csat', actualHours: 0.0 },
];

const mockPyqSummary: PyqTrackingSummary = {
  prelimsMcqsSolvedThisWeek: 75,
  prelimsMcqsSolvedTotal: 345,
  prelimsMcqsTarget: 1500,
  mainsAnswersThisWeek: 7,
  mainsAnswersTotal: 28,
  mainsAnswersTarget: 120,
};

const DEFAULT_SAMPLE_PROGRESS: Record<string, SubtopicUserProgress> = {
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
    lastRevisedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
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
    lastRevisedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    confidenceScore: 3,
    completionPercentage: 70,
  },
  'p-geo-1': {
    subtopicId: 'p-geo-1',
    ncertRead: true,
    standardBookRead: true,
    standardBookName: 'GC Leong',
    coachingAttended: false,
    extraSources: '',
    notesMade: true,
    currentAffairsLinked: false,
    pyqSolvedCount: 8,
    mcqPracticeDone: true,
    revisionCount: 0,
    lastRevisedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    confidenceScore: 3,
    completionPercentage: 65,
  },
};

export default function ProgressPage() {
  const { examMode, profile } = useAuth();
  const [isRevisionSheetOpen, setIsRevisionSheetOpen] = useState(false);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  // User syllabus progress map
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
      const isDemo = localStorage.getItem('upsc_demo_mode') === 'true';
      if (isDemo) {
        return DEFAULT_SAMPLE_PROGRESS;
      }
    }
    return {};
  });

  // Compute live revision health summary
  const healthSummary = getRevisionHealthSummary({
    progressMap,
    examMode,
  });

  // Real session analytics (eliminates streak and heatmap contradiction)
  const [sessions] = useState(() => (typeof window !== 'undefined' ? getAllSessions() : []));
  const [plannedRestDates] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc_planned_rest_days');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });
  const streakAnalytics = calculateStreakAndConsistency(sessions, new Date(), 1, plannedRestDates);
  const activityGrid = streakAnalytics.activityGrid;
  const streakDays = streakAnalytics.currentStreakDays;
  const consistencyPercent = streakAnalytics.consistencyPercent30d;

  const isDemo = typeof window !== 'undefined' && localStorage.getItem('upsc_demo_mode') === 'true';
  const dailyTargetHours = profile?.daily_target_hours_min || 6.0;

  const weeklyChartData: DayHourData[] = isDemo
    ? mockWeeklyHours
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
        const found = streakAnalytics.weeklyHours.find((w) => w.day === day);
        // Realistic weekly target: 6 active study days per week, planned rest on Sunday
        return {
          day,
          planned: day === 'Sun' ? 0 : dailyTargetHours,
          actual: found ? found.actualHours : 0,
        };
      });

  const totalActualWeek = weeklyChartData.reduce((sum, d) => sum + d.actual, 0);
  const totalPlannedWeek = weeklyChartData.reduce((sum, d) => sum + d.planned, 0);

  // Phase 7 Analytics Engines
  const subjectBalances = computeSubjectBalance(mockSubjectHours, totalActualWeek);
  const stageRollups = computeStageRollups(progressMap, profile?.optional_subject, sessions);
  const [weeklyReview, setWeeklyReview] = useState(() =>
    generateStrategicWeeklyReview({
      plannedHours: totalPlannedWeek,
      actualHours: totalActualWeek,
      streakDays: streakDays,
      subjectBalances,
      pyqSummary: mockPyqSummary,
    })
  );

  const handleProgressMapUpdated = (updatedMap: Record<string, SubtopicUserProgress>) => {
    setProgressMap(updatedMap);
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc_syllabus_progress', JSON.stringify(updatedMap));
    }
  };

  const handleRefreshReview = () => {
    const updated = generateStrategicWeeklyReview({
      plannedHours: totalPlannedWeek,
      actualHours: totalActualWeek,
      streakDays: streakDays,
      subjectBalances,
      pyqSummary: mockPyqSummary,
    });
    setWeeklyReview(updated);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-10 animate-fadeIn">
      {/* 1. Primary Card 1: Weekly Volume & Target Ring Overview */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
              Weekly Performance Overview
            </span>
            <div className="text-2xl font-black text-[var(--foreground)] mt-0.5 font-mono">
              {totalActualWeek.toFixed(1)} / {totalPlannedWeek.toFixed(1)} hrs
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">
              Consistency rate is {consistencyPercent}% • {streakDays}-day study streak active
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
              {consistencyPercent}% on track
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">
              Avg {(totalActualWeek / 7).toFixed(1)} hrs / day
            </span>
          </div>
        </div>

        {/* Recharts Planned vs Actual Chart */}
        <WeeklyHoursChart data={weeklyChartData} targetAverage={dailyTargetHours} />
      </div>

      {/* 2. Primary Card 2: 30-Day Consistency Heatmap & Routine */}
      <ConsistencyHeatmap
        activityGrid={activityGrid}
        streakDays={streakDays}
        consistencyPercent={consistencyPercent}
        pyqSummary={mockPyqSummary}
      />

      {/* 3. Primary Card 3: Stage-Wise Syllabus Progress Rollups */}
      <StageProgressCards stages={stageRollups} />

      {/* 4. Primary Card 4: Spaced Revision Health Card (Interactive Trigger) */}
      <div
        onClick={() => setIsRevisionSheetOpen(true)}
        className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs hover:border-[var(--primary)]/60 cursor-pointer transition-all space-y-2.5 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
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

      {/* 5. Progressive Disclosure: Secondary Metrics Tucked Behind "See More" */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDetailedAnalytics(!showDetailedAnalytics)}
          aria-expanded={showDetailedAnalytics}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]/70 hover:bg-[var(--surface-raised)] transition-all shadow-xs text-xs font-semibold text-[var(--foreground)] active:scale-99"
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-[var(--primary)]" />
            <span>Detailed Analytics &amp; Strategic Review</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--foreground-muted)] text-[11px]">
            <span>{showDetailedAnalytics ? 'Hide' : 'See More'}</span>
            {showDetailedAnalytics ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        {/* Secondary Metrics Accordion Body */}
        {showDetailedAnalytics && (
          <div className="mt-4 space-y-4 sm:space-y-5 animate-fadeIn">
            {/* Subject Balance & 35% Cap Guardrail Card */}
            <SubjectBalanceCard metrics={subjectBalances} />

            {/* Grounded Weekly Strategic Mentor Review */}
            <WeeklyStrategicReviewCard
              review={weeklyReview}
              onRefreshReview={handleRefreshReview}
            />
          </div>
        )}
      </div>

      {/* Spaced Revision Sheet Modal */}
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
