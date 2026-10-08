'use client';

import React from 'react';
import { SubtopicNode, SubtopicUserProgress } from '@/types/syllabus';
import {
  X,
  BookOpen,
  Library,
  GraduationCap,
  FileText,
  Newspaper,
  CheckCircle2,
  RotateCcw,
  Star
} from 'lucide-react';

interface SubtopicDetailSheetProps {
  subtopic: SubtopicNode;
  progress: SubtopicUserProgress;
  onUpdate: (updates: Partial<SubtopicUserProgress>) => void;
  onClose: () => void;
}

export function SubtopicDetailSheet({
  subtopic,
  progress,
  onUpdate,
  onClose,
}: SubtopicDetailSheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-start justify-between gap-3 bg-[var(--surface-raised)]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-full">
                Weight: {subtopic.weight}x
              </span>
              <span className="text-[10px] text-[var(--foreground-muted)]">
                Est: {subtopic.estimated_hours} hrs
              </span>
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)] leading-snug">
              {subtopic.title}
            </h3>
          </div>

          {/* Mini Ring & Close */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-base font-extrabold text-[var(--primary)] font-mono">
                {progress.completionPercentage}%
              </span>
              <p className="text-[10px] text-[var(--foreground-muted)]">Completed</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close subtopic details"
              className="p-1.5 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Checklist Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. Core Reading Toggles */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              Primary Sources (40%)
            </h4>

            {/* NCERT */}
            <div
              onClick={() => onUpdate({ ncertRead: !progress.ncertRead })}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                progress.ncertRead
                  ? 'border-[var(--primary)] bg-[var(--primary-light)]/40 text-[var(--foreground)] font-semibold'
                  : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className={`w-4 h-4 ${progress.ncertRead ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                <div>
                  <span className="text-xs">NCERT Foundations Read</span>
                  <p className="text-[10px] text-[var(--foreground-muted)]">Class 11 &amp; 12 base chapters (15%)</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${progress.ncertRead ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                {progress.ncertRead ? '✓ Completed' : 'Pending'}
              </span>
            </div>

            {/* Standard Textbook */}
            <div className={`p-3 rounded-xl border transition-all space-y-2 ${
              progress.standardBookRead
                ? 'border-[var(--primary)] bg-[var(--primary-light)]/40'
                : 'border-[var(--border)] bg-[var(--surface-raised)]'
            }`}>
              <div
                onClick={() => onUpdate({ standardBookRead: !progress.standardBookRead })}
                className="cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Library className={`w-4 h-4 ${progress.standardBookRead ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-semibold text-[var(--foreground)]">Standard Textbook Read</span>
                    <p className="text-[10px] text-[var(--foreground-muted)]">In-depth reference coverage (25%)</p>
                  </div>
                </div>
                <span className={`text-xs font-bold ${progress.standardBookRead ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                  {progress.standardBookRead ? '✓ Completed' : 'Pending'}
                </span>
              </div>

              {progress.standardBookRead && (
                <input
                  type="text"
                  placeholder="Which book? (e.g. Laxmikanth Ch 12-14, Spectrum Ch 5)"
                  value={progress.standardBookName || ''}
                  onChange={(e) => onUpdate({ standardBookName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)]"
                />
              )}
            </div>
          </div>

          {/* 2. Coaching & Notes (20%) */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              Synthesizing &amp; Notes (20%)
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ coachingAttended: !progress.coachingAttended })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  progress.coachingAttended
                    ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)] font-semibold'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="text-xs">Class Attended</span>
                </div>
                <span className="text-[10px] text-[var(--foreground-muted)]">Lecture/coaching slot</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ notesMade: !progress.notesMade })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  progress.notesMade
                    ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)] font-semibold'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-xs">Notes Created</span>
                </div>
                <span className="text-[10px] text-[var(--foreground-muted)]">Short revision notes (10%)</span>
              </button>
            </div>

            {/* Current Affairs Linkage */}
            <div
              onClick={() => onUpdate({ currentAffairsLinked: !progress.currentAffairsLinked })}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                progress.currentAffairsLinked
                  ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)] font-semibold'
                  : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Newspaper className="w-3.5 h-3.5" />
                <span>Current Affairs &amp; Editorials Linked (10%)</span>
              </div>
              <span className="text-xs">{progress.currentAffairsLinked ? '✓' : 'Pending'}</span>
            </div>
          </div>

          {/* 3. PYQs, Practice & Revisions (40%) */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              Practice &amp; Revisions (40%)
            </h4>

            {/* PYQ Practice */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span className="font-semibold text-[var(--foreground)]">PYQs &amp; MCQ Practice (20%)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdate({ mcqPracticeDone: !progress.mcqPracticeDone })}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    progress.mcqPracticeDone
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {progress.mcqPracticeDone ? 'Done' : 'Mark Done'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-[var(--foreground-muted)]">PYQs Solved Count:</span>
                <div className="flex items-center gap-2">
                  {[0, 5, 10, 20].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => onUpdate({ pyqSolvedCount: count, mcqPracticeDone: count > 0 })}
                      className={`px-2 py-1 rounded-md border text-[10px] font-mono font-semibold ${
                        progress.pyqSolvedCount === count
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)]'
                      }`}
                    >
                      {count}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Spaced Revisions Counter */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span className="font-semibold text-[var(--foreground)]">Spaced Revisions (20%)</span>
                </div>
                <span className="text-[10px] text-[var(--foreground-muted)]">Max 3 cycles credited</span>
              </div>

              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() =>
                      onUpdate({
                        revisionCount: cycle,
                        lastRevisedAt: cycle > 0 ? new Date().toISOString() : null,
                      })
                    }
                    className={`w-7 h-7 rounded-lg border text-xs font-bold font-mono transition-all ${
                      progress.revisionCount >= cycle && cycle > 0
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                        : cycle === 0 && progress.revisionCount === 0
                        ? 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)]'
                    }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence Star Rating */}
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[var(--foreground)] block">Subject Confidence</span>
                <span className="text-[10px] text-[var(--foreground-muted)]">Your retention feel</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onUpdate({ confidenceScore: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        progress.confidenceScore >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-raised)]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Done &amp; Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}
