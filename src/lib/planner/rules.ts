/**
 * Deterministic Planning & Guardrail Rules for UPSC Preparation
 * Adheres to centralized configuration in src/config/planner-config.ts
 */

import { PLANNER_CONFIG } from '@/config/planner-config';

export interface SubjectAllocation {
  subject: string;
  hours: number;
}

export interface WeeklyAllocationCheck {
  isSubjectCapped: boolean;
  subjectSharePercent: number;
  exceedsCapByHours: number;
}

export const MAX_WEEKLY_SUBJECT_SHARE_PERCENT = PLANNER_CONFIG.SUBJECT_WEEKLY_CAP_PERCENT;

/**
 * Validates whether a single subject exceeds the weekly cap (default 35%) of total study time.
 */
export function checkSubjectWeeklyCap(
  subjectHours: number,
  totalWeeklyHours: number,
  maxCapPercent: number = PLANNER_CONFIG.SUBJECT_WEEKLY_CAP_PERCENT
): WeeklyAllocationCheck {
  if (totalWeeklyHours <= 0) {
    return { isSubjectCapped: false, subjectSharePercent: 0, exceedsCapByHours: 0 };
  }

  const sharePercent = (subjectHours / totalWeeklyHours) * 100;
  const maxAllowedHours = (maxCapPercent / 100) * totalWeeklyHours;

  const isSubjectCapped = sharePercent > maxCapPercent;
  const exceedsCapByHours = isSubjectCapped ? Math.round((subjectHours - maxAllowedHours) * 10) / 10 : 0;

  return {
    isSubjectCapped,
    subjectSharePercent: Math.round(sharePercent * 10) / 10,
    exceedsCapByHours,
  };
}

/**
 * Checks if the user has been studying the exact same subject for > MAX_CONSECUTIVE_DAYS_ON_SUBJECT days.
 */
export function checkStuckOnSubject(
  consecutiveDaysOnSameSubject: number,
  maxAllowedDays: number = PLANNER_CONFIG.MAX_CONSECUTIVE_DAYS_ON_SUBJECT
): boolean {
  return consecutiveDaysOnSameSubject > maxAllowedDays;
}

export interface DayCapacityInput {
  energyMood: number; // 1 to 5 (1 = lowest, 5 = highest)
  availableHours: number;
  hasDisruptions: boolean;
}

export interface DayPlanRecommendation {
  isMinimumViableDay: boolean;
  targetHours: number;
  maxTasks: number;
  focusType: 'recovery_and_revision' | 'standard_balanced' | 'deep_work_heavy';
}

/**
 * Evaluates whether to switch to a 'minimum viable day' when fatigue or time constraints occur.
 */
export function determineDayCapacity(input: DayCapacityInput): DayPlanRecommendation {
  // If energy is low (mood <= 2) or available time is under 3.5 hours, switch to Minimum Viable Day
  if (
    input.energyMood <= PLANNER_CONFIG.LOW_ENERGY_MOOD_MAX ||
    input.availableHours < PLANNER_CONFIG.LOW_HOURS_MVD_MAX ||
    input.hasDisruptions
  ) {
    return {
      isMinimumViableDay: true,
      targetHours: Math.min(input.availableHours, PLANNER_CONFIG.MVD_TARGET_HOURS_MAX),
      maxTasks: PLANNER_CONFIG.MVD_MAX_TASKS,
      focusType: 'recovery_and_revision',
    };
  }

  if (input.energyMood === 5 && input.availableHours >= 7.5) {
    return {
      isMinimumViableDay: false,
      targetHours: input.availableHours,
      maxTasks: PLANNER_CONFIG.STANDARD_MAX_TASKS,
      focusType: 'deep_work_heavy',
    };
  }

  return {
    isMinimumViableDay: false,
    targetHours: input.availableHours,
    maxTasks: 4,
    focusType: 'standard_balanced',
  };
}
