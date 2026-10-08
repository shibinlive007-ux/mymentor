import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStreakAndConsistency } from '../src/lib/sessions/streak-calculator';
import { StudySession } from '../src/types/session';
import { DayHourData } from '../src/components/analytics/WeeklyHoursChart';

describe('Task 6: Weekly Study Volume & Chart Data Integrity', () => {
  test('returns 0 actual hours across all days when no sessions are logged', () => {
    const emptySessions: StudySession[] = [];
    const analytics = calculateStreakAndConsistency(emptySessions, new Date('2026-10-07T12:00:00Z'));

    const dailyTarget = 7.0;
    const weeklyData: DayHourData[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
      const found = analytics.weeklyHours.find((w) => w.day === day);
      return {
        day,
        planned: dailyTarget,
        actual: found ? found.actualHours : 0,
      };
    });

    const totalActual = weeklyData.reduce((sum, d) => sum + d.actual, 0);
    assert.equal(totalActual, 0);
    assert.equal(weeklyData.length, 7);
    weeklyData.forEach((d) => {
      assert.equal(d.actual, 0);
      assert.equal(d.planned, 7.0);
    });
  });

  test('correctly maps logged study sessions to matching day buckets in weekly volume', () => {
    const anchor = new Date('2026-10-07T12:00:00Z'); // Wednesday
    const sessions: StudySession[] = [
      {
        id: 's-1',
        startedAt: '2026-10-07T08:00:00Z', // Wed
        endedAt: '2026-10-07T10:00:00Z',
        durationMinutes: 120, // 2.0 hrs
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
        startedAt: '2026-10-06T14:00:00Z', // Tue
        endedAt: '2026-10-06T15:30:00Z',
        durationMinutes: 90, // 1.5 hrs
        completedMinutes: 90,
        subjectId: 'p-hist',
        subjectName: 'History',
        topicId: 'p-hist-1',
        topicTitle: '1857 Revolt',
        sessionType: 'revision',
        isSynced: true,
      },
    ];

    const analytics = calculateStreakAndConsistency(sessions, anchor);
    const wedHours = analytics.weeklyHours.find((w) => w.day === 'Wed')?.actualHours || 0;
    const tueHours = analytics.weeklyHours.find((w) => w.day === 'Tue')?.actualHours || 0;

    assert.equal(wedHours, 2.0);
    assert.equal(tueHours, 1.5);
    assert.equal(analytics.totalWeeklyActualHours, 3.5);
  });
});
