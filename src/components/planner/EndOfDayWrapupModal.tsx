'use client';

import React, { useState } from 'react';
import { DailyPlan } from '@/types/planner';
import { EndOfDayWrapup, DayFeelRating } from '@/types/session';
import {
  X,
  Moon,
  Sparkles,
  CheckCircle2,
  Circle
} from 'lucide-react';

interface EndOfDayWrapupModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: DailyPlan;
  onWrapupCompleted: (wrapup: EndOfDayWrapup) => void;
}

const FEEL_RATINGS: Array<{
  rating: DayFeelRating;
  emoji: string;
  label: string;
  desc: string;
}> = [
  { rating: 1, emoji: '🥱', label: 'Exhausted', desc: 'Heavy fatigue' },
  { rating: 2, emoji: '🌪️', label: 'Distracted', desc: 'Broken focus' },
  { rating: 3, emoji: '⚖️', label: 'Steady', desc: 'Consistent day' },
  { rating: 4, emoji: '⚡', label: 'Productive', desc: 'High quality work' },
  { rating: 5, emoji: '🚀', label: 'Deep Flow', desc: 'Exceptional clarity' },
];

const TOMORROW_PRESET_CHIPS = [
  'Continue same subject chapter',
  'Revise today’s notes first thing',
  'Focus more on PYQs / MCQs',
  'Need a lighter day tomorrow',
  'Test series / Mock test scheduled',
];

export function EndOfDayWrapupModal({
  isOpen,
  onClose,
  plan,
  onWrapupCompleted,
}: EndOfDayWrapupModalProps) {
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() =>
    plan.tasks.filter((t) => t.status === 'completed').map((t) => t.id)
  );
  const [pendingAction, setPendingAction] = useState<'roll_forward' | 'drop' | 'reschedule'>('roll_forward');
  const [feelRating, setFeelRating] = useState<DayFeelRating>(3);
  const [notesForTomorrow, setNotesForTomorrow] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSummaryCelebration, setShowSummaryCelebration] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleTaskCompleted = (id: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const pendingTasks = plan.tasks.filter((t) => !completedTaskIds.includes(t.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const wrapup: EndOfDayWrapup = {
      id: `wrapup-${plan.date}-${Date.now()}`,
      date: plan.date,
      completedTaskIds,
      pendingTaskIds: pendingTasks.map((t) => t.id),
      pendingAction,
      feelRating,
      notesForTomorrow: notesForTomorrow.trim(),
      totalHoursStudied: Math.round((plan.totalCompletedMinutes / 60) * 10) / 10,
      completedTasksCount: completedTaskIds.length,
      submittedAt: new Date().toISOString(),
    };

    // Save wrap-up to localStorage
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('upsc_wrapup_logs');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('upsc_wrapup_logs', JSON.stringify([wrapup, ...list]));
    }

    setShowSummaryCelebration(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onWrapupCompleted(wrapup);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slideUp">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-raised)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                End-of-Day Wrap-up (30s)
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                Reflect, close today’s loop, and draft tomorrow
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {showSummaryCelebration ? (
          <div className="p-8 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)]">
              Day Closed with Calm Focus
            </h3>
            <p className="text-xs text-[var(--foreground-muted)] max-w-xs mx-auto leading-relaxed">
              &quot;Sleep is where memory consolidation happens. Rest well tonight knowing you showed up today.&quot;
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-5">
            {/* 1. Review Today's Tasks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide">
                  1. What got completed today?
                </label>
                <span className="text-xs font-mono text-[var(--primary)] font-semibold">
                  {completedTaskIds.length} of {plan.tasks.length} done
                </span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {plan.tasks.map((task) => {
                  const isDone = completedTaskIds.includes(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskCompleted(task.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-500/5 text-[var(--foreground)]'
                          : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[var(--foreground-muted)] shrink-0" />
                        )}
                        <span className={`text-xs font-medium truncate ${isDone ? 'line-through text-[var(--foreground-muted)]' : ''}`}>
                          {task.topicTitle}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--foreground-muted)] shrink-0 ml-2">
                        {task.durationMinutes}m
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action for uncompleted tasks */}
              {pendingTasks.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-2">
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    Handle {pendingTasks.length} uncompleted task(s):
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPendingAction('roll_forward')}
                      className={`px-2.5 py-1 rounded-lg border transition-colors ${
                        pendingAction === 'roll_forward'
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)] font-semibold'
                          : 'border-[var(--border)] text-[var(--foreground-muted)]'
                      }`}
                    >
                      Roll forward to tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingAction('drop')}
                      className={`px-2.5 py-1 rounded-lg border transition-colors ${
                        pendingAction === 'drop'
                          ? 'bg-[var(--primary)] text-white border-[var(--primary)] font-semibold'
                          : 'border-[var(--border)] text-[var(--foreground-muted)]'
                      }`}
                    >
                      Drop without guilt
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. How did today feel? */}
            <div>
              <label className="block text-xs font-bold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                2. How did your study session feel overall?
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {FEEL_RATINGS.map((feel) => {
                  const isSelected = feelRating === feel.rating;
                  return (
                    <button
                      key={feel.rating}
                      type="button"
                      onClick={() => setFeelRating(feel.rating)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-xs scale-102 font-bold'
                          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)] hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl mb-1">{feel.emoji}</span>
                      <span className="text-[10px] leading-tight">{feel.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Notes & Tomorrow Priorities */}
            <div>
              <label className="block text-xs font-bold text-[var(--foreground)] mb-1.5 uppercase tracking-wide">
                3. Anything to prioritize tomorrow?
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {TOMORROW_PRESET_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      setNotesForTomorrow((prev) => (prev ? `${prev}; ${chip}` : chip))
                    }
                    className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[11px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="e.g. Start with Economy PYQs before 10 AM..."
                value={notesForTomorrow}
                onChange={(e) => setNotesForTomorrow(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] rounded-xl"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-98"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Wrap Up Day &amp; Draft Tomorrow</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
