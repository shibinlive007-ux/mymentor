'use client';

import React, { useState } from 'react';
import { RevisionItem, RevisionHealthSummary, RecoveryProposal } from '@/types/revision';
import { SubtopicUserProgress } from '@/types/syllabus';
import { incrementSubtopicRevision } from '@/lib/revision/revision-engine';
import { RecoveryProposalCard } from './RecoveryProposalCard';
import {
  X,
  RotateCcw,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface RevisionManagerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  healthSummary: RevisionHealthSummary;
  progressMap: Record<string, SubtopicUserProgress>;
  onProgressMapUpdated: (updatedMap: Record<string, SubtopicUserProgress>) => void;
  onAcceptRecoveryProposal?: (proposal: RecoveryProposal) => void;
  onSelectTopicForTimer?: (subtopicId: string, subtopicTitle: string, subjectName: string) => void;
}

type RevisionTab = 'urgent' | 'upcoming' | 'completed';

export function RevisionManagerSheet({
  isOpen,
  onClose,
  healthSummary,
  progressMap,
  onProgressMapUpdated,
  onAcceptRecoveryProposal,
  onSelectTopicForTimer,
}: RevisionManagerSheetProps) {
  const [activeTab, setActiveTab] = useState<RevisionTab>('urgent');
  const [dismissedProposalId, setDismissedProposalId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMarkRevised = (subtopicId: string) => {
    const updated = incrementSubtopicRevision(progressMap, subtopicId);
    onProgressMapUpdated(updated);
  };

  const handleStartTimer = (item: RevisionItem) => {
    if (onSelectTopicForTimer) {
      onSelectTopicForTimer(item.subtopicId, item.subtopicTitle, item.subjectName);
    }
    onClose();
  };

  const urgentList = healthSummary.urgentItems;
  const showRecoveryProposal =
    healthSummary.recoveryProposal &&
    healthSummary.recoveryProposal.id !== dismissedProposalId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-raised)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                Spaced Revision Manager
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                1, 7, 21 &amp; 45-day retention rhythm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {healthSummary.retentionFreshnessPercent}% Fresh
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Recovery Proposal Banner if Backlog exists */}
          {showRecoveryProposal && healthSummary.recoveryProposal && (
            <RecoveryProposalCard
              proposal={healthSummary.recoveryProposal}
              overdueItems={healthSummary.urgentItems.filter((i) => i.status === 'overdue')}
              onAccept={(prop) => {
                if (onAcceptRecoveryProposal) {
                  onAcceptRecoveryProposal(prop);
                }
                setDismissedProposalId(prop.id);
              }}
              onDismiss={(id) => setDismissedProposalId(id)}
            />
          )}

          {/* Retention Stats Bar */}
          <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div>
              <span className="text-base font-mono font-extrabold text-amber-600 dark:text-amber-400">
                {healthSummary.overdueCount}
              </span>
              <p className="text-[10px] text-[var(--foreground-muted)]">Overdue</p>
            </div>
            <div>
              <span className="text-base font-mono font-extrabold text-[var(--primary)]">
                {healthSummary.dueTodayCount}
              </span>
              <p className="text-[10px] text-[var(--foreground-muted)]">Due Today</p>
            </div>
            <div>
              <span className="text-base font-mono font-extrabold text-blue-600 dark:text-blue-400">
                {healthSummary.upcomingCount}
              </span>
              <p className="text-[10px] text-[var(--foreground-muted)]">Upcoming</p>
            </div>
            <div>
              <span className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {healthSummary.completedCyclesCount}
              </span>
              <p className="text-[10px] text-[var(--foreground-muted)]">Mastered</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[var(--surface-raised)] p-1 rounded-xl border border-[var(--border)] text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('urgent')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'urgent'
                  ? 'bg-[var(--surface)] text-[var(--primary)] shadow-xs'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              Urgent ({urgentList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[var(--surface)] text-[var(--primary)] shadow-xs'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              Upcoming ({healthSummary.upcomingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'completed'
                  ? 'bg-[var(--surface)] text-[var(--primary)] shadow-xs'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              Mastered ({healthSummary.completedCyclesCount})
            </button>
          </div>

          {/* List Content */}
          <div className="space-y-2">
            {activeTab === 'urgent' && (
              <>
                {urgentList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--foreground-muted)] bg-[var(--surface-raised)]/50 rounded-2xl border border-dashed border-[var(--border)]">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                    <p className="font-semibold text-[var(--foreground)]">No Overdue Revisions!</p>
                    <p className="mt-0.5">Your spaced repetition schedule is completely on track.</p>
                  </div>
                ) : (
                  urgentList.map((item) => {
                    const isOverdue = item.status === 'overdue';
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isOverdue
                            ? 'bg-amber-500/5 border-amber-500/30'
                            : 'bg-emerald-500/5 border-emerald-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-md">
                                {item.subjectName}
                              </span>
                              <span className="text-[10px] text-[var(--foreground-muted)]">
                                Cycle #{item.stageNumber} of 3
                              </span>
                              {isOverdue ? (
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-md">
                                  ⚠️ {item.daysOverdue}d overdue
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
                                  Due today
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-[var(--foreground)] leading-snug">
                              {item.subtopicTitle}
                            </h4>
                            <p className="text-[11px] text-[var(--foreground-muted)] truncate mt-0.5">
                              {item.topicTitle}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartTimer(item)}
                              className="px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[11px] font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors shadow-xs"
                              title="Start focus timer on this revision"
                            >
                              Revise Now
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkRevised(item.subtopicId)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs active:scale-98"
                              title="Mark this cycle completed"
                            >
                              Mark Done
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {activeTab === 'upcoming' && (
              <div className="p-4 text-center text-xs text-[var(--foreground-muted)] bg-[var(--surface-raised)]/50 rounded-2xl border border-[var(--border)]">
                <Calendar className="w-6 h-6 text-[var(--primary)] mx-auto mb-1.5 opacity-80" />
                <p className="font-semibold text-[var(--foreground)]">Next Scheduled Revisions</p>
                <p className="mt-0.5 text-[11px]">
                  {healthSummary.upcomingCount} subtopics will enter their 7, 21, or 45-day review windows soon.
                </p>
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="p-4 text-center text-xs text-[var(--foreground-muted)] bg-[var(--surface-raised)]/50 rounded-2xl border border-[var(--border)]">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5 opacity-80" />
                <p className="font-semibold text-[var(--foreground)]">3-Cycle Mastery Achieved</p>
                <p className="mt-0.5 text-[11px]">
                  {healthSummary.completedCyclesCount} topics have completed 3 spaced revision cycles and are consolidated in long-term memory.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
