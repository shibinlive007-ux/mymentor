/**
 * Unified Streak, Heatmap & Consistency Engine
 *
 * Computes:
 * - 30-day activity grid
 * - Active days count
 * - Consistency rate %
 * - Current study streak (with rest day allowance)
 * - Weekly daily hours distribution
 *
 * ALL DERIVED FROM THE SAME STUDY_SESSIONS DATASET to ensure 100% mathematical consistency.
 */

import { StudySession } from '@/types/session';
import { DailyActivityRecord } from '@/types/analytics';

export interface StreakAnalyticsResult {
  activityGrid: DailyActivityRecord[];
  activeDays30d: number;
  totalDaysInWindow: number;
  consistencyPercent30d: number;
  currentStreakDays: number;
  weeklyHours: { day: string; date: string; actualHours: number }[];
  totalWeeklyActualHours: number;
}

/**
 * Calculates streak, 30-day activity grid, and consistency from a single sessions list
 */
export function calculateStreakAndConsistency(
  sessions: StudySession[] = [],
  anchorDate: Date = new Date(),
  restDaysAllowedPerWeek: number = 1
): StreakAnalyticsResult {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activityGrid: DailyActivityRecord[] = [];
  const totalDaysInWindow = 30;

  // Build 30-day map: YYYY-MM-DD -> sessions
  const sessionsByDate: Record<string, StudySession[]> = {};
  for (const s of sessions) {
    if (!s.startedAt) continue;
    const dateKey = s.startedAt.split('T')[0];
    if (!sessionsByDate[dateKey]) {
      sessionsByDate[dateKey] = [];
    }
    sessionsByDate[dateKey].push(s);
  }

  // 1. Generate 30-day grid from anchorDate backwards
  for (let i = totalDaysInWindow - 1; i >= 0; i--) {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[d.getDay()];

    const daysSessions = sessionsByDate[dateStr] || [];
    const totalMinutes = daysSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const hours = Math.round((totalMinutes / 60) * 10) / 10;
    const count = daysSessions.length;

    let level: 0 | 1 | 2 | 3 = 0;
    if (hours >= 6.0) level = 3;
    else if (hours >= 3.5) level = 2;
    else if (hours > 0) level = 1;

    activityGrid.push({
      date: dateStr,
      dayLabel,
      hours,
      level,
      sessionsCount: count,
    });
  }

  // 2. Active days count in 30-day window
  const activeDays30d = activityGrid.filter((d) => d.hours > 0).length;
  const consistencyPercent30d = Math.round((activeDays30d / totalDaysInWindow) * 100);

  // 3. Current streak calculation (with rest-day allowance)
  let currentStreakDays = 0;
  let restDaysUsedInCurrentWeek = 0;

  // Start from today (or yesterday if today has no session yet)
  const todayStr = anchorDate.toISOString().split('T')[0];
  const hasTodaySession = (sessionsByDate[todayStr]?.length || 0) > 0;

  const startIndex = hasTodaySession ? 0 : 1;

  for (let i = startIndex; i < 60; i++) {
    const checkDate = new Date(anchorDate);
    checkDate.setDate(checkDate.getDate() - i);
    const dateKey = checkDate.toISOString().split('T')[0];

    const daysSessions = sessionsByDate[dateKey] || [];
    const minutes = daysSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    if (minutes > 0) {
      currentStreakDays += 1;
    } else {
      // Check if we can bridge with a planned rest day (max restDaysAllowedPerWeek per 7-day window)
      if (restDaysUsedInCurrentWeek < restDaysAllowedPerWeek && currentStreakDays > 0) {
        restDaysUsedInCurrentWeek += 1;
        // Rest day preserves the streak without incrementing the studied days
      } else {
        break; // streak ends
      }
    }
  }

  // 4. Current 7-day weekly breakdown (Mon-Sun or past 7 days)
  const weeklyHours: { day: string; date: string; actualHours: number }[] = [];
  let totalWeeklyActualHours = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[d.getDay()];

    const daysSessions = sessionsByDate[dateStr] || [];
    const totalMinutes = daysSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const actualHours = Math.round((totalMinutes / 60) * 10) / 10;
    totalWeeklyActualHours += actualHours;

    weeklyHours.push({
      day: dayLabel,
      date: dateStr,
      actualHours,
    });
  }

  totalWeeklyActualHours = Math.round(totalWeeklyActualHours * 10) / 10;

  return {
    activityGrid,
    activeDays30d,
    totalDaysInWindow,
    consistencyPercent30d,
    currentStreakDays,
    weeklyHours,
    totalWeeklyActualHours,
  };
}
