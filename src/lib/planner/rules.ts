/**
 * Deterministic Planning & Guardrail Rules for UPSC Preparation
 */

export interface SubjectAllocation {
  subject: string;
  hours: number;
}

export interface WeeklyAllocationCheck {
  isSubjectCapped: boolean;
  subjectSharePercent: number;
  exceedsCapByHours: number;
}

export const MAX_WEEKLY_SUBJECT_SHARE_PERCENT = 35; // Default 35% weekly cap

/**
 * Validates that no single subject exceeds 35% of total study time in a week.
 */
export function checkSubjectWeeklyCap(
  subjectHours: number,
  totalWeeklyHours: number,
  maxCapPercent: number = MAX_WEEKLY_SUBJECT_SHARE_PERCENT
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
 * Checks if the user has been studying the exact same subject for > 5 consecutive days.
 */
export function checkStuckOnSubject(consecutiveDaysOnSameSubject: number): boolean {
  return consecutiveDaysOnSameSubject > 5;
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
  // If energy is low (1 or 2) or available time is under 3.5 hours, switch to Minimum Viable Day
  if (input.energyMood <= 2 || input.availableHours < 3.5 || input.hasDisruptions) {
    return {
      isMinimumViableDay: true,
      targetHours: Math.min(input.availableHours, 3.0),
      maxTasks: 3,
      focusType: 'recovery_and_revision',
    };
  }

  if (input.energyMood === 5 && input.availableHours >= 7.5) {
    return {
      isMinimumViableDay: false,
      targetHours: input.availableHours,
      maxTasks: 5,
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
