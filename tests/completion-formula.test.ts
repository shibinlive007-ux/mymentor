import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtopicCompletion,
  calculateWeightedRollup
} from '../src/lib/planner/completion-formula.ts';

describe('Completion Formula Logic', () => {
  test('calculates 0% when no activities are completed', () => {
    const result = calculateSubtopicCompletion({
      ncertRead: false,
      standardBookRead: false,
      notesMadeOrClassAttended: false,
      currentAffairsLinked: false,
      pyqPracticeDone: false,
      revisionCount: 0,
    });
    assert.equal(result, 0);
  });

  test('calculates 100% when all activities and 3 revisions are completed', () => {
    const result = calculateSubtopicCompletion({
      ncertRead: true, // 15
      standardBookRead: true, // 25
      notesMadeOrClassAttended: true, // 10
      currentAffairsLinked: true, // 10
      pyqPracticeDone: true, // 20
      revisionCount: 3, // 20
    });
    assert.equal(result, 100);
  });

  test('revisions are capped at maxRevisionCount (3 revisions = 20%)', () => {
    const result3 = calculateSubtopicCompletion({
      ncertRead: false,
      standardBookRead: false,
      notesMadeOrClassAttended: false,
      currentAffairsLinked: false,
      pyqPracticeDone: false,
      revisionCount: 3,
    });
    const result5 = calculateSubtopicCompletion({
      ncertRead: false,
      standardBookRead: false,
      notesMadeOrClassAttended: false,
      currentAffairsLinked: false,
      pyqPracticeDone: false,
      revisionCount: 5,
    });
    assert.equal(result3, 20);
    assert.equal(result5, 20);
  });

  test('correctly calculates weighted rollup of topics', () => {
    const childNodes = [
      { completionPercentage: 100, weight: 1.0 },
      { completionPercentage: 50, weight: 1.0 },
    ];
    const rollup = calculateWeightedRollup(childNodes);
    assert.equal(rollup, 75);
  });

  test('respects custom topic weights during rollup', () => {
    const childNodes = [
      { completionPercentage: 100, weight: 3.0 },
      { completionPercentage: 0, weight: 1.0 },
    ];
    const rollup = calculateWeightedRollup(childNodes);
    assert.equal(rollup, 75);
  });
});
