import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRevisionDueDates,
  evaluateRevisionHealth,
  DEFAULT_REVISION_INTERVALS_DAYS,
} from '../src/lib/planner/spaced-repetition.ts';

describe('Spaced Repetition System', () => {
  test('generates expected revision dates for 1, 7, 21, 45 days', () => {
    const studyDate = new Date('2026-10-01T10:00:00Z');
    const dueDates = calculateRevisionDueDates(studyDate, DEFAULT_REVISION_INTERVALS_DAYS);

    assert.equal(dueDates.length, 4);

    // Day 1
    assert.equal(dueDates[0].toISOString().split('T')[0], '2026-10-02');
    // Day 7
    assert.equal(dueDates[1].toISOString().split('T')[0], '2026-10-08');
    // Day 21
    assert.equal(dueDates[2].toISOString().split('T')[0], '2026-10-22');
    // Day 45
    assert.equal(dueDates[3].toISOString().split('T')[0], '2026-11-15');
  });

  test('flags revisions due today', () => {
    const today = new Date('2026-10-15T08:00:00Z');
    const scheduled = new Date('2026-10-15T14:00:00Z');

    const result = evaluateRevisionHealth(scheduled, today);
    assert.equal(result.status, 'due_today');
    assert.equal(result.daysOverdue, 0);
  });

  test('flags overdue revisions with accurate overdue day count', () => {
    const today = new Date('2026-10-20T08:00:00Z');
    const scheduled = new Date('2026-10-15T08:00:00Z'); // 5 days ago

    const result = evaluateRevisionHealth(scheduled, today);
    assert.equal(result.status, 'overdue');
    assert.equal(result.daysOverdue, 5);
  });

  test('flags upcoming revisions', () => {
    const today = new Date('2026-10-10T08:00:00Z');
    const scheduled = new Date('2026-10-15T08:00:00Z');

    const result = evaluateRevisionHealth(scheduled, today);
    assert.equal(result.status, 'upcoming');
  });
});
