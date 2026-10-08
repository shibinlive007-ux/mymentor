import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { computeSubtopicProgress, getDefaultSubtopicProgress } from '../src/lib/syllabus/seed-loader';

describe('Task 12: Subtopic Tracking & 2-Tap Quick Update Engine', () => {
  test('default subtopic starts with zero completion and clean state', () => {
    const initial = getDefaultSubtopicProgress('test-sub-1');
    assert.equal(initial.completionPercentage, 0);
    assert.equal(initial.ncertRead, false);
    assert.equal(initial.standardBookRead, false);
    assert.equal(initial.notesMade, false);
    assert.equal(initial.mcqPracticeDone, false);
    assert.equal(initial.revisionCount, 0);
  });

  test('single tap on NCERT marks it read and yields exactly 15%', () => {
    const initial = getDefaultSubtopicProgress('test-sub-1');
    const updated = computeSubtopicProgress(initial, { ncertRead: true });
    assert.equal(updated.ncertRead, true);
    assert.equal(updated.completionPercentage, 15);
  });

  test('toggling Standard Book adds 25% to existing progress', () => {
    const initial = getDefaultSubtopicProgress('test-sub-1');
    const withNcert = computeSubtopicProgress(initial, { ncertRead: true });
    const withBook = computeSubtopicProgress(withNcert, { standardBookRead: true });
    assert.equal(withBook.standardBookRead, true);
    assert.equal(withBook.completionPercentage, 40); // 15 + 25
  });

  test('toggling Notes (10%) and PYQs (20%) increments completion systematically', () => {
    const initial = getDefaultSubtopicProgress('test-sub-1');
    const step1 = computeSubtopicProgress(initial, { ncertRead: true, standardBookRead: true });
    const step2 = computeSubtopicProgress(step1, { notesMade: true });
    assert.equal(step2.completionPercentage, 50); // 40 + 10

    const step3 = computeSubtopicProgress(step2, { mcqPracticeDone: true, pyqSolvedCount: 15 });
    assert.equal(step3.completionPercentage, 70); // 50 + 20
  });

  test('revision cycle updates revision count and spaced repetition credit', () => {
    const initial = getDefaultSubtopicProgress('test-sub-1');
    // First revision gives 1/3 of 20% = 6.7%
    const with1Rev = computeSubtopicProgress(initial, {
      ncertRead: true,
      standardBookRead: true,
      notesMade: true,
      mcqPracticeDone: true,
      revisionCount: 1,
    });
    // 70 + 6.7 = 76.7%
    assert.equal(with1Rev.completionPercentage, 76.7);

    // Full 3 revisions gives complete 20%
    const with3Rev = computeSubtopicProgress(initial, {
      ncertRead: true,
      standardBookRead: true,
      notesMade: true,
      mcqPracticeDone: true,
      revisionCount: 3,
    });
    // 15 + 25 + 10 + 20 + 20 = 90%
    assert.equal(with3Rev.completionPercentage, 90);

    const withCA = computeSubtopicProgress(with3Rev, {
      currentAffairsLinked: true,
    });
    // 90 + 10 = 100%
    assert.equal(withCA.completionPercentage, 100);
  });
});
