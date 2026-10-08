import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_SYLLABUS_SUBJECTS } from '../src/lib/syllabus/seed-loader';
import { filterUserSyllabusSubjects, calculateStageRollups } from '../src/lib/completion';

describe('Task 13: Stage Toggle (Prelims | Mains | Combined) Filtering & Rollups', () => {
  test('Prelims mode filters exclusively to Prelims and CSAT subjects', () => {
    const userFiltered = filterUserSyllabusSubjects(ALL_SYLLABUS_SUBJECTS, 'PSIR');
    const prelimsSubjects = userFiltered.filter((s) => s.stage === 'prelims' || s.stage === 'csat');

    assert.ok(prelimsSubjects.length >= 7, 'Must have at least 7 Prelims/CSAT subjects');
    assert.ok(prelimsSubjects.every((s) => s.stage === 'prelims' || s.stage === 'csat'));
    assert.ok(!prelimsSubjects.some((s) => s.stage === 'mains'));
    assert.ok(!prelimsSubjects.some((s) => s.stage === 'optional'));
  });

  test('Mains mode filters to Mains subjects plus the user selected optional', () => {
    const userFiltered = filterUserSyllabusSubjects(ALL_SYLLABUS_SUBJECTS, 'Geography');
    const mainsSubjects = userFiltered.filter((s) => s.stage === 'mains' || s.stage === 'optional');

    assert.ok(mainsSubjects.length >= 7, 'Must have Essay, GS1-4, Qualifying papers, and Geography');
    assert.ok(mainsSubjects.some((s) => s.id === 'mains.essay'));
    assert.ok(mainsSubjects.some((s) => s.id === 'mains.qualifying.language'));
    assert.ok(mainsSubjects.some((s) => s.id === 'mains.qualifying.english'));
    assert.ok(mainsSubjects.some((s) => s.id === 'optional.geography'));

    // Other optionals should not be present
    assert.ok(!mainsSubjects.some((s) => s.id === 'optional.psir'));
    assert.ok(!mainsSubjects.some((s) => s.id === 'optional.sociology'));
  });

  test('Combined mode includes Prelims, Mains, and the user selected optional', () => {
    const userFiltered = filterUserSyllabusSubjects(ALL_SYLLABUS_SUBJECTS, 'Sociology');
    const combinedSubjects = userFiltered;

    assert.ok(combinedSubjects.some((s) => s.stage === 'prelims'));
    assert.ok(combinedSubjects.some((s) => s.stage === 'csat'));
    assert.ok(combinedSubjects.some((s) => s.stage === 'mains'));
    assert.ok(combinedSubjects.some((s) => s.stage === 'optional' && s.id === 'optional.sociology'));
    assert.ok(!combinedSubjects.some((s) => s.stage === 'optional' && s.id !== 'optional.sociology'));
  });

  test('calculateStageRollups returns distinct metrics for Prelims, Mains, and Combined', () => {
    const progressMap = {
      'p-pol-1': {
        subtopicId: 'p-pol-1',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: '',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: false,
        pyqSolvedCount: 15,
        mcqPracticeDone: true,
        revisionCount: 1,
        lastRevisedAt: null,
        confidenceScore: 4,
        completionPercentage: 76.7,
      },
    };

    const stats = calculateStageRollups(ALL_SYLLABUS_SUBJECTS, progressMap, 'PSIR');

    // Prelims has progress, Mains does not yet
    assert.ok(stats.prelims.percentage > 0, 'Prelims percentage should be > 0');
    assert.equal(stats.mains.percentage, 0, 'Mains percentage should be 0');
    assert.ok(stats.overall.percentage > 0, 'Overall percentage should be > 0 and weighted');
    assert.ok(stats.overall.percentage < stats.prelims.percentage, 'Overall rollup should be dampened by 0% Mains');
  });
});
