'use client';

import React from 'react';
import { StageProgressSummary } from '@/types/analytics';
import { BookOpen, Layers, Award, Target } from 'lucide-react';

interface StageProgressCardsProps {
  stages: StageProgressSummary[];
}

const STAGE_ICONS = {
  prelims: Target,
  csat: Layers,
  mains: BookOpen,
  optional: Award,
};

const STAGE_ACCENTS = {
  prelims: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  csat: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  mains: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  optional: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const STAGE_BAR_COLORS = {
  prelims: 'bg-emerald-600',
  csat: 'bg-blue-600',
  mains: 'bg-indigo-600',
  optional: 'bg-purple-600',
};

export function StageProgressCards({ stages }: StageProgressCardsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
          Syllabus Coverage by Exam Stage
        </h3>
        <span className="text-[11px] text-[var(--foreground-muted)]">
          Target: UPSC CSE 2027
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {stages.map((stage) => {
          const Icon = STAGE_ICONS[stage.stage] || Target;
          const accentClass = STAGE_ACCENTS[stage.stage] || STAGE_ACCENTS.prelims;
          const barColor = STAGE_BAR_COLORS[stage.stage] || 'bg-emerald-600';

          return (
            <div
              key={stage.stage}
              className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl shrink-0 ${accentClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)] leading-tight">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-[var(--foreground-muted)] line-clamp-1 mt-0.5">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-extrabold font-mono text-[var(--foreground)] shrink-0">
                  {stage.completionPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--border)]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                    style={{ width: `${stage.completionPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--foreground-muted)] pt-0.5">
                  <span>
                    {stage.completedHours} / {stage.totalEstimatedHours} hrs
                  </span>
                  <span>
                    {stage.topicsCompletedCount} / {stage.topicsTotalCount} topics
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
