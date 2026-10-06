import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkSubjectWeeklyCap,
  checkStuckOnSubject,
  determineDayCapacity,
  MAX_WEEKLY_SUBJECT_SHARE_PERCENT
} from '../src/lib/planner/rules.ts';

describe('Planner Rules & Guardrails', () => {
  test('flags when a subject exceeds 35% of weekly hours', () => {
    // 16 hours out of 40 hours = 40% (exceeds 35%)
    const check = checkSubjectWeeklyCap(16, 40, MAX_WEEKLY_SUBJECT_SHARE_PERCENT);

    assert.equal(check.isSubjectCapped, true);
    assert.equal(check.subjectSharePercent, 40);
    // 35% of 40 = 14 hours. 16 - 14 = 2 hours exceeded
    assert.equal(check.exceedsCapByHours, 2);
  });

  test('passes when subject is within 35% cap', () => {
    // 10 hours out of 40 hours = 25%
    const check = checkSubjectWeeklyCap(10, 40, MAX_WEEKLY_SUBJECT_SHARE_PERCENT);

    assert.equal(check.isSubjectCapped, false);
    assert.equal(check.subjectSharePercent, 25);
    assert.equal(check.exceedsCapByHours, 0);
  });

  test('flags when stuck on same subject for more than 5 days', () => {
    assert.equal(checkStuckOnSubject(4), false);
    assert.equal(checkStuckOnSubject(5), false);
    assert.equal(checkStuckOnSubject(6), true);
  });

  test('triggers minimum viable day when energy is low (mood <= 2)', () => {
    const recommendation = determineDayCapacity({
      energyMood: 2,
      availableHours: 6.0,
      hasDisruptions: false,
    });

    assert.equal(recommendation.isMinimumViableDay, true);
    assert.equal(recommendation.maxTasks, 3);
    assert.equal(recommendation.focusType, 'recovery_and_revision');
  });

  test('triggers minimum viable day when available hours are under 3.5 hours', () => {
    const recommendation = determineDayCapacity({
      energyMood: 4,
      availableHours: 2.5,
      hasDisruptions: false,
    });

    assert.equal(recommendation.isMinimumViableDay, true);
    assert.equal(recommendation.maxTasks, 3);
  });

  test('recommends standard balanced day under normal conditions', () => {
    const recommendation = determineDayCapacity({
      energyMood: 4,
      availableHours: 7.0,
      hasDisruptions: false,
    });

    assert.equal(recommendation.isMinimumViableDay, false);
    assert.equal(recommendation.maxTasks, 4);
    assert.equal(recommendation.focusType, 'standard_balanced');
  });
});
