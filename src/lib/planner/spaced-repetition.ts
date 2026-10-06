/**
 * Spaced Repetition Rules for UPSC Preparation
 * Intervals: 1 day, 7 days, 21 days, 45 days
 */

export const DEFAULT_REVISION_INTERVALS_DAYS = [1, 7, 21, 45];

export interface RevisionScheduleItem {
  stageNumber: number; // 1 to 4
  scheduledDate: Date;
  isOverdue: boolean;
  daysDiff: number; // negative = overdue, positive = days left
}

export function calculateRevisionDueDates(
  initialStudyDate: Date,
  intervals: number[] = DEFAULT_REVISION_INTERVALS_DAYS
): Date[] {
  return intervals.map((interval) => {
    const dueDate = new Date(initialStudyDate);
    dueDate.setDate(dueDate.getDate() + interval);
    return dueDate;
  });
}

export function evaluateRevisionHealth(
  scheduledDate: Date,
  currentDate: Date = new Date()
): { status: 'due_today' | 'overdue' | 'upcoming'; daysOverdue: number } {
  // Normalize dates to midnight UTC/Local
  const schedMidnight = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate());
  const curMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  const diffMs = curMidnight.getTime() - schedMidnight.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { status: 'due_today', daysOverdue: 0 };
  } else if (diffDays > 0) {
    return { status: 'overdue', daysOverdue: diffDays };
  } else {
    return { status: 'upcoming', daysOverdue: 0 };
  }
}
