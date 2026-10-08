'use client';

import React from 'react';
import { SubtopicNode, SubtopicUserProgress } from '@/types/syllabus';
import { X, BookOpen, BookText, FileCheck, CheckCircle2, RotateCw, ExternalLink } from 'lucide-react';

export interface QuickSubtopicModalProps {
  isOpen: boolean;
  subtopic: SubtopicNode | null;
  progress: SubtopicUserProgress;
  onClose: () => void;
  onUpdate: (updates: Partial<SubtopicUserProgress>) => void;
  onOpenFullDetails?: () => void;
}

export function QuickSubtopicModal({
  isOpen,
  subtopic,
  progress,
  onClose,
  onUpdate,
  onOpenFullDetails,
}: QuickSubtopicModalProps) {
  if (!isOpen || !subtopic) return null;

  const handleToggleNcert = () => {
    onUpdate({ ncertRead: !progress.ncertRead });
  };

  const handleToggleBook = () => {
    onUpdate({ standardBookRead: !progress.standardBookRead });
  };

  const handleToggleNotes = () => {
    onUpdate({ notesMade: !progress.notesMade });
  };

  const handleTogglePyq = () => {
    const nextState = !progress.mcqPracticeDone;
    onUpdate({
      mcqPracticeDone: nextState,
      pyqSolvedCount: nextState ? (progress.pyqSolvedCount > 0 ? progress.pyqSolvedCount : 15) : 0,
    });
  };

  const handleCycleRevision = () => {
    const nextCount = (progress.revisionCount + 1) % 4; // 0 -> 1 -> 2 -> 3 -> 0
    onUpdate({
      revisionCount: nextCount,
      lastRevisedAt: nextCount > 0 ? new Date().toISOString() : null,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-update-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-start justify-between bg-[var(--surface-raised)]">
          <div className="pr-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
              2-Tap Quick Update
            </span>
            <h3 id="quick-update-title" className="text-sm font-bold text-[var(--foreground)] line-clamp-2 mt-0.5 leading-snug">
              {subtopic.title}
            </h3>
            <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
              Est. {subtopic.estimated_hours}h • Weight {subtopic.weight}x
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <span className="text-base font-extrabold text-[var(--primary)] font-mono">
                {progress.completionPercentage}%
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick update"
              className="p-1.5 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Tap Interactive Action Cards */}
        <div className="p-4 space-y-2.5">
          <p className="text-xs text-[var(--foreground-muted)]">
            Tap to mark completion or cycle revision:
          </p>

          <div className="space-y-2">
            {/* 1. NCERT Read */}
            <button
              type="button"
              onClick={handleToggleNcert}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                progress.ncertRead
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>NCERT Reading (15%)</span>
              </div>
              <span className="font-bold font-mono">
                {progress.ncertRead ? '✓ Done' : '+ Mark'}
              </span>
            </button>

            {/* 2. Standard Reference Book */}
            <button
              type="button"
              onClick={handleToggleBook}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                progress.standardBookRead
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookText className="w-4 h-4" />
                <span>Standard Book (25%)</span>
              </div>
              <span className="font-bold font-mono">
                {progress.standardBookRead ? '✓ Done' : '+ Mark'}
              </span>
            </button>

            {/* 3. Short Revision Notes */}
            <button
              type="button"
              onClick={handleToggleNotes}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                progress.notesMade
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                <span>Revision Notes (10%)</span>
              </div>
              <span className="font-bold font-mono">
                {progress.notesMade ? '✓ Made' : '+ Mark'}
              </span>
            </button>

            {/* 4. PYQ Practice */}
            <button
              type="button"
              onClick={handleTogglePyq}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                progress.mcqPracticeDone || progress.pyqSolvedCount > 0
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>PYQs Solved (20%)</span>
              </div>
              <span className="font-bold font-mono">
                {progress.mcqPracticeDone || progress.pyqSolvedCount > 0 ? '✓ Done' : '+ Mark'}
              </span>
            </button>

            {/* 5. Revision Count Cycle */}
            <button
              type="button"
              onClick={handleCycleRevision}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                progress.revisionCount > 0
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                <span>Spaced Revision (20%)</span>
              </div>
              <span className="font-bold font-mono">
                {progress.revisionCount > 0 ? `Rev ${progress.revisionCount}x` : '0x (+1)'}
              </span>
            </button>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-[var(--border)] mt-3">
            {onOpenFullDetails && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullDetails();
                }}
                className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] flex items-center gap-1 font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Checklist</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
