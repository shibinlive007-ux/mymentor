/**
 * Session, Timer and Wrap-up Types for UPSC 2027 AI Mentor
 */

import { TaskType } from './planner';

export type TimerMode = 'stopwatch' | 'pomodoro';

export type PomodoroPhase = 'focus' | 'short_break' | 'long_break';

export interface StudySession {
  id: string;
  taskId?: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  subtopicId?: string;
  subtopicTitle?: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  sessionType: TaskType;
  notes?: string;
}

export type DayFeelRating = 1 | 2 | 3 | 4 | 5;

export interface EndOfDayWrapup {
  id: string;
  date: string; // YYYY-MM-DD
  completedTaskIds: string[];
  pendingTaskIds: string[];
  pendingAction: 'roll_forward' | 'drop' | 'reschedule';
  feelRating: DayFeelRating;
  notesForTomorrow: string;
  totalHoursStudied: number;
  completedTasksCount: number;
  submittedAt: string;
}

export interface PomodoroSettings {
  focusDurationMinutes: number; // e.g. 25 or 50
  shortBreakMinutes: number;    // e.g. 5 or 10
  longBreakMinutes: number;     // e.g. 15
  cyclesBeforeLongBreak: number;// e.g. 4
}
