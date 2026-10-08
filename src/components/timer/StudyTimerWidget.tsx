'use client';

import React from 'react';
import { formatSecondsToTimer } from '@/lib/utils';
import { PlannerTask } from '@/types/planner';
import { StudySession } from '@/types/session';
import { useStudyTimer } from '@/lib/timer/useStudyTimer';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  Flame,
  Coffee
} from 'lucide-react';

interface StudyTimerWidgetProps {
  activeTask?: PlannerTask | null;
  onSessionLogged?: (session: StudySession) => void;
  onTaskCompleted?: (taskId: string, sessionMinutes: number) => void;
}

export function StudyTimerWidget({
  activeTask,
  onSessionLogged,
  onTaskCompleted,
}: StudyTimerWidgetProps) {
  const {
    mode,
    isRunning,
    seconds,
    rawElapsedSeconds,
    pomodoroDuration,
    pomodoroProgressPercent,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setPomodoroPreset,
    logSession,
  } = useStudyTimer({ activeTask, onSessionLogged });

  const handleFinishAndLog = () => {
    const session = logSession();
    if (session && activeTask && onTaskCompleted) {
      onTaskCompleted(activeTask.id, session.durationMinutes);
    }
  };

  return (
    <div className="rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] p-4 sm:p-5 shadow-xs space-y-3.5 transition-all">
      {/* Header with Mode Toggle & Task Label */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-muted)]">
          <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Active Study Session</span>
        </div>

        {/* Mode Selector (Stopwatch vs Pomodoro) */}
        <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)] text-xs">
          <button
            type="button"
            onClick={() => switchMode('stopwatch')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              mode === 'stopwatch'
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            ⏱️ Stopwatch
          </button>
          <button
            type="button"
            onClick={() => switchMode('pomodoro')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              mode === 'pomodoro'
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
            }`}
          >
            🍅 Pomodoro
          </button>
        </div>
      </div>

      {/* Active Task Name */}
      {activeTask && (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-md">
              {activeTask.subjectName}
            </span>
            <p className="text-sm font-bold text-[var(--foreground)] truncate mt-1">
              {activeTask.topicTitle}
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--foreground-muted)] shrink-0">
            Target: {activeTask.durationMinutes}m
          </span>
        </div>
      )}

      {/* Main Timer Display Box */}
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Digital Time & Progress */}
        <div className="flex items-center gap-3">
          {mode === 'pomodoro' && (
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[var(--ring-track)]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--primary)] transition-all duration-300 ease-out"
                  strokeDasharray={`${pomodoroProgressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-[var(--primary)]">
                {pomodoroProgressPercent}%
              </span>
            </div>
          )}

          <div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              {formatSecondsToTimer(seconds)}
            </div>
            {mode === 'pomodoro' ? (
              <span className="text-[11px] text-[var(--foreground-muted)]">
                Focus remaining ({Math.round(pomodoroDuration / 60)} min block)
              </span>
            ) : (
              <span className="text-[11px] text-[var(--foreground-muted)]">
                Time studied this session
              </span>
            )}
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              type="button"
              onClick={pauseTimer}
              aria-label="Pause study timer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold text-xs transition-colors hover:bg-amber-500/20 active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startTimer}
              aria-label="Start study timer"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs shadow-md transition-all active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start</span>
            </button>
          )}

          <button
            type="button"
            onClick={resetTimer}
            aria-label="Reset study timer"
            title="Reset timer"
            className="p-2 rounded-xl border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Log / Finish Session Button */}
          {rawElapsedSeconds >= 30 && (
            <button
              type="button"
              onClick={handleFinishAndLog}
              aria-label="Save session and credit minutes"
              title="Save session and credit minutes"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors active:scale-98 animate-fadeIn focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Log &amp; Done</span>
            </button>
          )}
        </div>
      </div>

      {/* Pomodoro Presets if in Pomodoro Mode */}
      {mode === 'pomodoro' && (
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <span className="text-[11px] text-[var(--foreground-muted)] flex items-center gap-1">
            <Coffee className="w-3 h-3 text-[var(--primary)]" />
            Presets:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPomodoroPreset(25)}
              className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                pomodoroDuration === 25 * 60
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--foreground-muted)]'
              }`}
            >
              25m / 5m (Standard)
            </button>
            <button
              type="button"
              onClick={() => setPomodoroPreset(50)}
              className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                pomodoroDuration === 50 * 60
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--foreground-muted)]'
              }`}
            >
              <Flame className="w-3 h-3 inline mr-1 text-amber-500" />
              50m / 10m (Deep Block)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
