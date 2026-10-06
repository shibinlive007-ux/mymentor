'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth-context';
import { UPSC_2027_DATES, getDaysUntil } from '@/lib/utils';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Plus,
  Check,
  ShieldCheck,
  History,
  X
} from 'lucide-react';
import Link from 'next/link';
import { DailyPlan, PlannerTask, CheckinInput, TaskStatus } from '@/types/planner';
import { StudySession, EndOfDayWrapup } from '@/types/session';
import { generateDailyPlan } from '@/lib/planner/daily-scheduler';
import { MorningCheckinModal } from '@/components/planner/MorningCheckinModal';
import { TaskEditModal } from '@/components/planner/TaskEditModal';
import { StudyTimerWidget } from '@/components/timer/StudyTimerWidget';
import { EndOfDayWrapupModal } from '@/components/planner/EndOfDayWrapupModal';
import {
  getTaskCompletionMessage,
  EncouragementMessage
} from '@/lib/encouragement/messages';
import { getTodaySessions } from '@/lib/sessions/session-manager';

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

  // Sessions list
  const [todaySessions, setTodaySessions] = useState<StudySession[]>(() => {
    return typeof window !== 'undefined' ? getTodaySessions() : [];
  });
  const [showSessionsLog, setShowSessionsLog] = useState<boolean>(false);

  // Modals state
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [isWrapupOpen, setIsWrapupOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<PlannerTask | null>(null);

  // Encouragement notification banner
  const [encouragement, setEncouragement] = useState<EncouragementMessage | null>(null);

  // Active task state
  const [activeTaskId, setActiveTaskId] = useState<string>('task-2');

  // Countdown calculations
  const daysToPrelims = getDaysUntil(UPSC_2027_DATES.PRELIMS);

  // Save plan to localStorage whenever updated
  const updatePlan = (newPlan: DailyPlan) => {
    setPlan(newPlan);
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc_today_plan', JSON.stringify(newPlan));
    }
  };

  // Handlers for Plan Generation via Morning Check-in
  const handleGeneratePlan = async (checkin: CheckinInput) => {
    try {
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
    const task = plan.tasks.find((t) => t.id === id);
    if (!task) return;

    const nextStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTasks = plan.tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: nextStatus,
          completedMinutes: nextStatus === 'completed' ? t.durationMinutes : 0,
        };
      }
      return t;
    });

    const totalDone = updatedTasks.reduce((acc, t) => acc + t.completedMinutes, 0);
    const completedCount = updatedTasks.filter((t) => t.status === 'completed').length;

    updatePlan({
      ...plan,
      tasks: updatedTasks,
      totalCompletedMinutes: totalDone,
      updatedAt: new Date().toISOString(),
    });

    // Trigger genuine encouragement if task completed
    if (nextStatus === 'completed') {
      const msg = getTaskCompletionMessage(task, completedCount, updatedTasks.length);
      setEncouragement(msg);
    }
  };

  // Session Completed / Logged via Timer Widget
  const handleSessionLogged = (session: StudySession) => {
    setTodaySessions((prev) => [session, ...prev]);
  };

  const handleTaskTimerCompleted = (taskId: string, sessionMinutes: number) => {
    const target = plan.tasks.find((t) => t.id === taskId);
    if (!target) return;

    const updatedTasks = plan.tasks.map((t) => {
      if (t.id === taskId) {
        const newCompleted = Math.min(t.durationMinutes, t.completedMinutes + sessionMinutes);
        return {
          ...t,
          completedMinutes: newCompleted,
          status: (newCompleted >= t.durationMinutes ? 'completed' : 'in_progress') as TaskStatus,
        };
      }
      return t;
    });

    const totalDone = updatedTasks.reduce((acc, t) => acc + t.completedMinutes, 0);
    const completedCount = updatedTasks.filter((t) => t.status === 'completed').length;

    updatePlan({
      ...plan,
      tasks: updatedTasks,
      totalCompletedMinutes: totalDone,
      updatedAt: new Date().toISOString(),
    });

    const msg = getTaskCompletionMessage(target, completedCount, updatedTasks.length);
    setEncouragement(msg);
  };

  // Reorder Tasks (Move Up / Down)
  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...plan.tasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTasks.length) return;

    const [moved] = newTasks.splice(index, 1);
    newTasks.splice(targetIndex, 0, moved);

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

  // Wrap-up Completion Handler
  const handleWrapupCompleted = (wrapup: EndOfDayWrapup) => {
    if (wrapup.pendingAction === 'roll_forward') {
      // In next day's draft, roll forward uncompleted tasks
    }
    setEncouragement({
      title: '🌙 Day Wrapped Successfully',
      body: 'Today’s loops are closed. Get restorative sleep to consolidate what you learned today.',
      category: 'rest',
    });
  };

  // Calculations
  const totalPlannedMinutes = plan.tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalCompletedMinutes = plan.tasks.reduce((sum, t) => sum + t.completedMinutes, 0);
  const completionPercent =
    totalPlannedMinutes > 0 ? Math.round((totalCompletedMinutes / totalPlannedMinutes) * 100) : 0;
  const activeTask = plan.tasks.find((t) => t.id === activeTaskId) || plan.tasks[0];

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 animate-fadeIn">
      {/* 1. Calm Top Banner: Days Countdown & Actions */}
      <div className="rounded-2xl bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface-hover)] border border-[var(--border)] p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Good day, {profile?.full_name?.split(' ')[0] || 'Aspirant'}
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
            <button
              type="button"
              onClick={() => setIsWrapupOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 transition-colors shadow-xs"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Wrap Up</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Genuine Encouragement Banner (Appears on task finish / milestones) */}
      {encouragement && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-950 dark:text-emerald-200 flex items-start justify-between gap-3 shadow-xs animate-slideUp">
          <div className="space-y-0.5">
            <span className="font-bold block text-emerald-900 dark:text-emerald-300">
              {encouragement.title}
            </span>
            <p className="opacity-90 leading-relaxed">{encouragement.body}</p>
          </div>
          <button
            type="button"
            onClick={() => setEncouragement(null)}
            className="p-1 rounded-full text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Proposal State Banner (Human-in-the-Loop Principle) */}
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

      {/* 4. Primary Focus: Single Progress Ring & Today's Target */}
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

      {/* 5. Phase 5 Study Timer Widget (Stopwatch, Pomodoro & Session Logging) */}
      <StudyTimerWidget
        activeTask={activeTask}
        onSessionLogged={handleSessionLogged}
        onTaskCompleted={handleTaskTimerCompleted}
      />

      {/* 6. Today's Plan (3-6 tasks, uncluttered, interactive) */}
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

                  {/* Task Actions */}
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

      {/* 7. Study Session Log (Progressive Disclosure) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowSessionsLog(!showSessionsLog)}
          className="flex items-center justify-between w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]/60 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
        >
          <span className="flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Today&apos;s Focus Sessions ({todaySessions.length} logged)</span>
          </span>
          <span className="text-[11px] text-[var(--foreground-muted)]">
            {showSessionsLog ? 'Hide' : 'View'}
          </span>
        </button>

        {showSessionsLog && (
          <div className="mt-2 space-y-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs animate-fadeIn">
            {todaySessions.length === 0 ? (
              <p className="text-center text-[var(--foreground-muted)] py-2">
                No individual sessions logged yet today. Start the timer above to record deep work.
              </p>
            ) : (
              todaySessions.map((sess) => (
                <div
                  key={sess.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-[var(--foreground)] truncate block">
                      {sess.topicTitle}
                    </span>
                    <span className="text-[10px] text-[var(--foreground-muted)]">
                      {sess.subjectName} • {sess.sessionType.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--primary)] shrink-0 ml-2">
                    {sess.durationMinutes} min
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 8. End of Day Wrap-up Prompt Banner */}
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-center bg-[var(--surface-raised)]/60">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
          <Moon className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-semibold text-[var(--foreground)]">Ready to close today?</h4>
        <p className="text-xs text-[var(--foreground-muted)] max-w-xs mx-auto mt-0.5">
          Take 30 seconds to reflect on what got done and pre-draft tomorrow&apos;s baseline plan.
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={() => setIsWrapupOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-98"
          >
            Start Evening Wrap-up
          </button>
          <Link
            href="/mentor"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            Ask AI Mentor <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Modals */}
      <MorningCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        onGeneratePlan={handleGeneratePlan}
        initialCheckin={plan.checkin}
      />

      <TaskEditModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditedTask}
      />

      <EndOfDayWrapupModal
        isOpen={isWrapupOpen}
        onClose={() => setIsWrapupOpen(false)}
        plan={plan}
        onWrapupCompleted={handleWrapupCompleted}
      />
    </div>
  );
}
