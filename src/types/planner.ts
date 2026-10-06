/**
 * Planner & Daily Scheduler Types for UPSC 2027 AI Mentor
 */

export type EnergyMoodLevel = 1 | 2 | 3 | 4 | 5;

export type DisruptionTag =
  | 'office_rush'
  | 'travel'
  | 'unwell'
  | 'class_today'
  | 'free_day'
  | 'test_series'
  | 'family_event';

export interface CheckinInput {
  energyMood: EnergyMoodLevel;
  availableHours: number;
  disruptions: string[];
  notes?: string;
  hasTestToday?: boolean;
  testName?: string;
}

export type TaskType =
  | 'new_study'
  | 'revision'
  | 'pyq'
  | 'current_affairs'
  | 'answer_writing'
  | 'mock_test'
  | 'break';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface PlannerTask {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  subtopicId?: string;
  subtopicTitle?: string;
  taskType: TaskType;
  durationMinutes: number;
  completedMinutes: number;
  status: TaskStatus;
  reason: string;
  orderIndex: number;
}

export type PlanStatus = 'proposed' | 'accepted' | 'completed';

export interface DailyPlan {
  id: string;
  date: string; // YYYY-MM-DD
  checkin: CheckinInput;
  tasks: PlannerTask[];
  status: PlanStatus;
  isMinimumViableDay: boolean;
  targetHours: number;
  totalPlannedMinutes: number;
  totalCompletedMinutes: number;
  mentorRationale: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerContextInput {
  checkin: CheckinInput;
  examMode: 'prelims' | 'mains' | 'combined';
  recentSubjectHours?: Record<string, number>;
  consecutiveDaysOnSubject?: Record<string, number>;
}
