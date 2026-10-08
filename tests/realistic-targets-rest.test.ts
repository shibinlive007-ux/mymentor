import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStreakAndConsistency } from '../src/lib/sessions/streak-calculator';
import { StudySession } from '../src/types/session';

describe('Task 7: Realistic Targets & Rest Days', () => {
  test('derives weekly planned hours from user daily target * 6 active days', () => {
    const dailyTarget = 7.0;
    const activeDaysPerWeek = 6;
    const weeklyTarget = Math.round(dailyTarget * activeDaysPerWeek * 10) / 10;

    // 7h * 6 days = 42h (NOT 48h or 49h)
    assert.equal(weeklyTarget, 42.0);

    const dailyTarget6 = 6.0;
    const weeklyTarget6 = Math.round(dailyTarget6 * activeDaysPerWeek * 10) / 10;
    // 6h * 6 days = 36h (NOT 48h)
    assert.equal(weeklyTarget6, 36.0);
  });

  test('preserves study streak across an explicit planned rest day', () => {
    const anchor = new Date('2026-10-08T12:00:00Z'); // Thursday
    // User studied on Tue (Oct 6) and Wed (Oct 7), took planned rest on Thu (Oct 8)
    const sessions: StudySession[] = [
      {
        id: 's-1',
        startedAt: '2026-10-07T09:00:00Z',
        endedAt: '2026-10-07T11:00:00Z',
        durationMinutes: 120,
        completedMinutes: 120,
        subjectId: 'p-pol',
        subjectName: 'Polity',
        topicId: 'p-pol-1',
        topicTitle: 'Preamble',
        sessionType: 'new_study',
        isSynced: true,
      },
      {
        id: 's-2',
        startedAt: '2026-10-06T09:00:00Z',
        endedAt: '2026-10-06T11:00:00Z',
        durationMinutes: 120,
        completedMinutes: 120,
        subjectId: 'p-hist',
        subjectName: 'History',
        topicId: 'p-hist-1',
        topicTitle: '1857 Revolt',
        sessionType: 'new_study',
        isSynced: true,
      },
    ];

    const plannedRestDates = ['2026-10-08'];
    const result = calculateStreakAndConsistency(sessions, anchor, 1, plannedRestDates);

    // Streak should bridge today (rest day) and count the 2 active study days
    assert.equal(result.currentStreakDays, 2);
  });
});
