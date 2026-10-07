import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStreakAndConsistency } from '../src/lib/sessions/streak-calculator';
import { StudySession } from '../src/types/session';

describe('Task 3: Heatmap & Streak Consistency (No Contradictions)', () => {
  test('returns 0 streak and 0 active days when sessions list is empty', () => {
    const result = calculateStreakAndConsistency([], new Date('2026-10-07T12:00:00Z'));

    assert.strictEqual(result.activeDays30d, 0);
    assert.strictEqual(result.totalDaysInWindow, 30);
    assert.strictEqual(result.consistencyPercent30d, 0);
    assert.strictEqual(result.currentStreakDays, 0);
    assert.strictEqual(result.totalWeeklyActualHours, 0);

    // All 30 grid cells have hours = 0 and level = 0
    const nonZeroCells = result.activityGrid.filter((c) => c.hours > 0);
    assert.strictEqual(nonZeroCells.length, 0);
  });

  test('computes streak, active days, and consistency from exact same sessions', () => {
    const anchor = new Date('2026-10-07T12:00:00Z');
    const sessions: StudySession[] = [];

    // Create 5 consecutive days of study ending today (Oct 3, 4, 5, 6, 7)
    for (let i = 0; i < 5; i++) {
      const d = new Date(anchor);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      sessions.push({
        id: `sess-${i}`,
        subjectId: 'p-pol',
        subjectName: 'Polity',
        topicId: 't1',
        topicTitle: 'Constitution',
        durationMinutes: 120, // 2 hours each day
        startedAt: `${dateStr}T10:00:00Z`,
        endedAt: `${dateStr}T12:00:00Z`,
        sessionType: 'new_study',
      });
    }

    const result = calculateStreakAndConsistency(sessions, anchor);

    // Exact consistency:
    assert.strictEqual(result.activeDays30d, 5);
    assert.strictEqual(result.currentStreakDays, 5);
    // 5 active days out of 30 days = round(5/30 * 100) = 17%
    assert.strictEqual(result.consistencyPercent30d, 17);

    // Activity grid has exactly 5 active days
    const activeGridDays = result.activityGrid.filter((d) => d.hours > 0).length;
    assert.strictEqual(activeGridDays, 5);
    assert.strictEqual(activeGridDays, result.activeDays30d);
  });

  test('preserves study streak across a planned rest day allowance', () => {
    const anchor = new Date('2026-10-07T12:00:00Z');
    const sessions: StudySession[] = [];

    // Studied Oct 7 (today), Oct 6 (yesterday)
    // Oct 5 was a planned rest day (no session)
    // Studied Oct 4, Oct 3
    const studyOffsets = [0, 1, 3, 4]; // skipped offset 2 (Oct 5)

    for (const offset of studyOffsets) {
      const d = new Date(anchor);
      d.setDate(d.getDate() - offset);
      const dateStr = d.toISOString().split('T')[0];

      sessions.push({
        id: `sess-${offset}`,
        subjectId: 'p-hist',
        subjectName: 'History',
        topicId: 't1',
        topicTitle: '1857 Revolt',
        durationMinutes: 90,
        startedAt: `${dateStr}T10:00:00Z`,
        endedAt: `${dateStr}T11:30:00Z`,
        sessionType: 'new_study',
      });
    }

    // With 1 rest day allowed per week, the streak bridges Oct 5:
    const withRest = calculateStreakAndConsistency(sessions, anchor, 1);
    assert.strictEqual(withRest.currentStreakDays, 4); // 4 days studied, streak unbroken
    assert.strictEqual(withRest.activeDays30d, 4);

    // Without rest day allowed (0), the streak would break at offset 2 (streak = 2):
    const withoutRest = calculateStreakAndConsistency(sessions, anchor, 0);
    assert.strictEqual(withoutRest.currentStreakDays, 2);
  });
});
