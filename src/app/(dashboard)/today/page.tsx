'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/auth-context';
import { UPSC_2027_DATES, getDaysUntil, formatSecondsToTimer } from '@/lib/utils';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Sun,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Plus,
  Check,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { DailyPlan, PlannerTask, CheckinInput, TaskStatus } from '@/types/planner';
import { generateDailyPlan } from '@/lib/planner/daily-scheduler';
import { MorningCheckinModal } from '@/components/planner/MorningCheckinModal';
import { TaskEditModal } from '@/components/planner/TaskEditModal';

const DEFAULT_INITIAL_PLAN: DailyPlan = {
  id: 'plan-default',
  date: new Date().toISOString().split('T')[0],
  checkin: {
    energyMood: 4,
    availableHours: 6,
    disruptions: [],
    notes: '',
  },
  tasks: [
    {
      id: 'task-1',
      subjectId: 'p-hist-mod',
      subjectName: 'Modern History',
      topicId: 'p-hist-mod-t1',
      topicTitle: '1857 Revolt: Causes, Regional Leaders & Aftermath',
      taskType: 'new_study',
      durationMinutes: 90,
      completedMinutes: 90,
      status: 'completed',
      reason: 'High-frequency Prelims & Mains topic; core foundation for Modern India',
      orderIndex: 1,
    },
    {
      id: 'task-2',
      subjectId: 'p-pol',
      subjectName: 'Polity & Governance',
      topicId: 'p-pol-t2',
      topicTitle: 'Fundamental Rights (Articles 14-18) Revision & PYQs',
      taskType: 'revision',
      durationMinutes: 60,
      completedMinutes: 30,
      status: 'in_progress',
      reason: 'Day 7 spaced revision cycle; 12 PYQs in last 10 years',
      orderIndex: 2,
    },
    {
      id: 'task-3',
      subjectId: 'ca-daily',
      subjectName: 'Current Affairs',
      topicId: 'ca-editorial',
      topicTitle: 'The Hindu Editorial + RBI Monetary Policy Notes',
      taskType: 'current_affairs',
      durationMinutes: 45,
      completedMinutes: 0,
      status: 'pending',
      reason: 'Daily GS3 Macro-economy linkage and analytical prep',
      orderIndex: 3,
    },
    {
      id: 'task-4',
      subjectId: 'p-geo',
      subjectName: 'Geography',
      topicId: 'p-geo-t1',
      topicTitle: 'Monsoon Dynamics & Indian Ocean Dipole (IOD)',
      taskType: 'new_study',
      durationMinutes: 75,
      completedMinutes: 0,
      status: 'pending',
      reason: 'Physical Geography syllabus gap identified during last weekly review',
      orderIndex: 4,
    },
  ],
  status: 'accepted',
  isMinimumViableDay: false,
  targetHours: 6,
  totalPlannedMinutes: 270,
  totalCompletedMinutes: 120,
  mentorRationale:
    'Balanced schedule balancing spaced revision on Fundamental Rights, deep work on Modern History, and mandatory Current Affairs.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function TodayPage() {
  const { profile, examMode } = useAuth();

  // Plan state
  const [plan, setPlan] = useState<DailyPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc_today_plan');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_INITIAL_PLAN;
  });

  // Modals state
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<PlannerTask | null>(null);

  // Active task & Timer state
  const [activeTaskId, setActiveTaskId] = useState<string>('task-2');
  const [timerSeconds, setTimerSeconds] = useState<number>(1800); // 30 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Countdown calculations
  const daysToPrelims = getDaysUntil(UPSC_2027_DATES.PRELIMS);

  // Save plan to localStorage whenever updated
  const updatePlan = (newPlan: DailyPlan) => {
    setPlan(newPlan);
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc_today_plan', JSON.stringify(newPlan));
    }
  };

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Handlers for Plan Generation via Morning Check-in
  const handleGeneratePlan = async (checkin: CheckinInput) => {
    try {
      // Call Next.js AI Plan Generator route
      const res = await fetch('/api/ai/plan-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkin,
          examMode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.plan) {
          updatePlan(data.plan);
          if (data.plan.tasks.length > 0) {
            setActiveTaskId(data.plan.tasks[0].id);
            setTimerSeconds(0);
            setIsTimerRunning(false);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('API route call threw error, using client-side deterministic fallback:', err);
    }

    // Pure deterministic client fallback
    const fallback = generateDailyPlan({
      checkin,
      examMode,
    });
    updatePlan(fallback);
    if (fallback.tasks.length > 0) {
      setActiveTaskId(fallback.tasks[0].id);
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  };

  // Accept Plan Handler (Human-in-the-loop confirmation)
  const handleAcceptPlan = () => {
    const updated: DailyPlan = {
      ...plan,
      status: 'accepted',
      updatedAt: new Date().toISOString(),
    };
    updatePlan(updated);
  };

  // Task Completion Toggle
  const toggleTaskStatus = (id: string) => {
    const updatedTasks = plan.tasks.map((t) => {
      if (t.id === id) {
        const nextStatus: TaskStatus = t.status === 'completed' ? 'pending' : 'completed';
        return {
          ...t,
          status: nextStatus,
          completedMinutes: nextStatus === 'completed' ? t.durationMinutes : 0,
        };
      }
      return t;
    });

    const totalDone = updatedTasks.reduce((acc, t) => acc + t.completedMinutes, 0);
    updatePlan({
      ...plan,
      tasks: updatedTasks,
      totalCompletedMinutes: totalDone,
      updatedAt: new Date().toISOString(),
    });
  };

  // Reorder Tasks (Move Up / Down)
  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...plan.tasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTasks.length) return;

    const [moved] = newTasks.splice(index, 1);
    newTasks.splice(targetIndex, 0, moved);

    // Re-index
    const reindexed = newTasks.map((t, idx) => ({ ...t, orderIndex: idx + 1 }));
    updatePlan({ ...plan, tasks: reindexed });
  };

  // Delete Task
  const deleteTask = (id: string) => {
    const filtered = plan.tasks.filter((t) => t.id !== id);
    const reindexed = filtered.map((t, idx) => ({ ...t, orderIndex: idx + 1 }));
    updatePlan({
      ...plan,
      tasks: reindexed,
      totalPlannedMinutes: reindexed.reduce((s, t) => s + t.durationMinutes, 0),
    });
  };

  // Save Edited Task
  const handleSaveEditedTask = (updatedTask: PlannerTask) => {
    const updated = plan.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    updatePlan({
      ...plan,
      tasks: updated,
      totalPlannedMinutes: updated.reduce((s, t) => s + t.durationMinutes, 0),
    });
  };

  // Add Quick Task
  const handleAddCustomTask = () => {
    const newTask: PlannerTask = {
      id: `task-${Date.now()}`,
      subjectId: 'custom-study',
      subjectName: 'Self Study / Custom',
      topicId: 'custom-topic',
      topicTitle: 'Additional Study Session',
      taskType: 'new_study',
      durationMinutes: 45,
      completedMinutes: 0,
      status: 'pending',
      reason: 'User created task',
      orderIndex: plan.tasks.length + 1,
    };
    const updated = [...plan.tasks, newTask];
    updatePlan({
      ...plan,
      tasks: updated,
      totalPlannedMinutes: updated.reduce((s, t) => s + t.durationMinutes, 0),
    });
    setEditingTask(newTask);
  };

  // Math summary
  const totalPlannedMinutes = plan.tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalCompletedMinutes = plan.tasks.reduce((sum, t) => sum + t.completedMinutes, 0);
  const completionPercent =
    totalPlannedMinutes > 0 ? Math.round((totalCompletedMinutes / totalPlannedMinutes) * 100) : 0;
  const activeTask = plan.tasks.find((t) => t.id === activeTaskId) || plan.tasks[0];

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 animate-fadeIn">
      {/* 1. Calm Top Banner: Days Countdown & Encouragement */}
      <div className="rounded-2xl bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface-hover)] border border-[var(--border)] p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Good morning, {profile?.full_name?.split(' ')[0] || 'Aspirant'}
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                {daysToPrelims} days to Prelims 2027 • Consistency over intensity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCheckinOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Check-in</span>
            </button>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-1 rounded-full hidden sm:inline-block">
              {examMode} mode
            </span>
          </div>
        </div>
      </div>

      {/* 2. Proposal State Banner (Human-in-the-Loop Principle) */}
      {plan.status === 'proposed' && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 border border-emerald-500/30 shadow-xs space-y-3 animate-slideUp">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  AI Plan Proposal Ready
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                  The AI manages and proposes the schedule, but you approve every decision. Review, reorder, or edit below.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAcceptPlan}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-98 whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              Accept Plan
            </button>
          </div>

          {/* Mentor Rationale */}
          <div className="p-3 rounded-xl bg-[var(--surface)]/90 border border-[var(--border)] text-xs text-[var(--foreground)]">
            <span className="font-semibold text-[var(--primary)] mr-1.5">Mentor Note:</span>
            {plan.mentorRationale}
          </div>
        </div>
      )}

      {/* Minimum Viable Day Indicator */}
      {plan.isMinimumViableDay && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Minimum Viable Day Active:</strong> Focused on essential continuity with zero guilt.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
            {plan.tasks.length} tasks • {(totalPlannedMinutes / 60).toFixed(1)} hrs
          </span>
        </div>
      )}

      {/* 3. Primary Focus: Single Progress Ring & Today's Target */}
      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-xs flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide">
            Today&apos;s Target
          </span>
          <div className="text-2xl font-bold tracking-tight text-[var(--foreground)] mt-0.5 font-mono">
            {(totalCompletedMinutes / 60).toFixed(1)} / {(totalPlannedMinutes / 60).toFixed(1)} hrs
          </div>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            {plan.tasks.filter((t) => t.status === 'completed').length} of {plan.tasks.length} tasks completed
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[var(--ring-track)]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[var(--primary)] transition-all duration-500 ease-out"
              strokeDasharray={`${completionPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-sm font-bold text-[var(--foreground)] font-mono">
              {completionPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Study Session Timer */}
      {activeTask && (
        <div className="rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground-muted)]">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Active Study Session</span>
            </div>
            <span className="text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-md">
              {activeTask.subjectName}
            </span>
          </div>

          <p className="text-sm font-semibold text-[var(--foreground)] truncate mb-3">
            {activeTask.topicTitle}
          </p>

          <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3">
            <div className="font-mono text-2xl font-bold tracking-tight text-[var(--foreground)]">
              {formatSecondsToTimer(timerSeconds)}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" /> Start
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setTimerSeconds(0)}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                title="Reset session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Today's Plan (3-6 tasks, uncluttered, interactive) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              Today&apos;s Plan
              <span className="text-xs font-normal text-[var(--foreground-muted)]">
                ({plan.tasks.length} tasks)
              </span>
            </h3>
            {plan.status === 'proposed' && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Proposed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddCustomTask}
              className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {plan.tasks.map((task, index) => {
            const isComplete = task.status === 'completed';
            const isActive = task.id === activeTaskId;

            return (
              <div
                key={task.id}
                onClick={() => setActiveTaskId(task.id)}
                className={`group cursor-pointer rounded-xl p-3.5 border transition-all duration-150 ${
                  isActive
                    ? 'border-[var(--primary)] bg-[var(--surface)] shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Complete Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskStatus(task.id);
                    }}
                    className="mt-0.5 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors shrink-0"
                    title={isComplete ? 'Mark pending' : 'Mark completed'}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--foreground-muted)]" />
                    )}
                  </button>

                  {/* Task Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wider">
                          {task.subjectName}
                        </span>
                        <span className="text-[10px] text-[var(--foreground-muted)] bg-[var(--surface-raised)] px-1.5 py-0.5 rounded-md border border-[var(--border)]">
                          {task.taskType.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[var(--foreground-muted)] shrink-0">
                        {task.durationMinutes}m
                      </span>
                    </div>

                    <p
                      className={`text-sm font-medium mt-1 leading-snug ${
                        isComplete
                          ? 'line-through text-[var(--foreground-muted)]'
                          : 'text-[var(--foreground)]'
                      }`}
                    >
                      {task.topicTitle}
                    </p>

                    <p className="text-xs text-[var(--foreground-muted)] mt-1 line-clamp-1 italic">
                      {task.reason}
                    </p>
                  </div>

                  {/* Task Actions (Reorder, Edit, Delete) */}
                  <div
                    className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveTask(index, 'up')}
                      className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === plan.tasks.length - 1}
                      onClick={() => moveTask(index, 'down')}
                      className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTask(task)}
                      className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded text-[var(--foreground-muted)] hover:text-red-500 hover:bg-red-500/10"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Mentor Re-plan & Check-in Nudge */}
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-center bg-[var(--surface-raised)]/60">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-light)] text-[var(--primary)] mb-2">
          <Sparkles className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-semibold text-[var(--foreground)]">Need an adaptive adjustment?</h4>
        <p className="text-xs text-[var(--foreground-muted)] max-w-xs mx-auto mt-0.5">
          Did unexpected meetings or fatigue arise? Update your check-in to reschedule remaining hours.
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={() => setIsCheckinOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)] shadow-xs transition-colors"
          >
            Adjust Morning Check-in
          </button>
          <Link
            href="/mentor"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            Ask AI Mentor <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Morning Check-in Modal */}
      <MorningCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        onGeneratePlan={handleGeneratePlan}
        initialCheckin={plan.checkin}
      />

      {/* Task Edit Modal */}
      <TaskEditModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditedTask}
      />
    </div>
  );
}
