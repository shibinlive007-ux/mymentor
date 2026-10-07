import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtopicCompletion,
  calculateWeightedRollup,
  calculateStageRollups,
  aggregateLoggedHours,
  calculateSubjectRollups,
} from '../src/lib/completion';
import { COMPLETION_WEIGHTS } from '../src/config/planner-config';
import { SubjectNode, SubtopicUserProgress } from '../src/types/syllabus';
import { StudySession } from '../src/types/session';

describe('Task 2: Single Source of Truth for Completion % & Logged Hours', () => {
  test('verifies completion formula weights match config (15/25/10/10/20/20)', () => {
    assert.strictEqual(COMPLETION_WEIGHTS.ncert, 15);
    assert.strictEqual(COMPLETION_WEIGHTS.standardBook, 25);
    assert.strictEqual(COMPLETION_WEIGHTS.notesOrClass, 10);
    assert.strictEqual(COMPLETION_WEIGHTS.currentAffairs, 10);
    assert.strictEqual(COMPLETION_WEIGHTS.pyqPractice, 20);
    assert.strictEqual(COMPLETION_WEIGHTS.revisions, 20);
    assert.strictEqual(COMPLETION_WEIGHTS.maxRevisionCount, 3);
  });

  test('calculates subtopic completion with exact known inputs', () => {
    // 0% when empty
    assert.strictEqual(calculateSubtopicCompletion({}), 0);

    // NCERT only = 15%
    assert.strictEqual(calculateSubtopicCompletion({ ncertRead: true }), 15);

    // Standard book only = 25%
    assert.strictEqual(calculateSubtopicCompletion({ standardBookRead: true }), 25);

    // NCERT + Standard book = 40%
    assert.strictEqual(calculateSubtopicCompletion({ ncertRead: true, standardBookRead: true }), 40);

    // All core readings done (NCERT 15 + Book 25 + Notes 10 + CA 10) = 60%
    assert.strictEqual(
      calculateSubtopicCompletion({
        ncertRead: true,
        standardBookRead: true,
        notesMade: true,
        currentAffairsLinked: true,
      }),
      60
    );

    // Core + PYQs = 80%
    assert.strictEqual(
      calculateSubtopicCompletion({
        ncertRead: true,
        standardBookRead: true,
        notesMade: true,
        currentAffairsLinked: true,
        pyqPracticeDone: true,
      }),
      80
    );

    // 1 revision = 80 + (1/3)*20 = 86.7%
    assert.strictEqual(
      calculateSubtopicCompletion({
        ncertRead: true,
        standardBookRead: true,
        notesMade: true,
        currentAffairsLinked: true,
        pyqPracticeDone: true,
        revisionCount: 1,
      }),
      86.7
    );

    // 2 revisions = 80 + (2/3)*20 = 93.3%
    assert.strictEqual(
      calculateSubtopicCompletion({
        ncertRead: true,
        standardBookRead: true,
        notesMade: true,
        currentAffairsLinked: true,
        pyqPracticeDone: true,
        revisionCount: 2,
      }),
      93.3
    );

    // 3 revisions = 100%
    assert.strictEqual(
      calculateSubtopicCompletion({
        ncertRead: true,
        standardBookRead: true,
        notesMade: true,
        currentAffairsLinked: true,
        pyqPracticeDone: true,
        revisionCount: 3,
      }),
      100
    );

    // Revision count is capped at 3 (e.g. 5 revisions does not exceed 100%)
    assert.strictEqual(
      calculateSubtopicCompletion({
        ncertRead: true,
        standardBookRead: true,
        notesMade: true,
        currentAffairsLinked: true,
        pyqPracticeDone: true,
        revisionCount: 5,
      }),
      100
    );
  });

  test('calculates weighted rollup with custom node importance weights', () => {
    // Equal weights
    const equalNodes = [
      { completionPercentage: 100, weight: 1.0 },
      { completionPercentage: 50, weight: 1.0 },
    ];
    assert.strictEqual(calculateWeightedRollup(equalNodes), 75);

    // Weighted importance: 100% on weight 2.0 and 50% on weight 1.0 => (200 + 50)/3 = 83.3%
    const weightedNodes = [
      { completionPercentage: 100, weight: 2.0 },
      { completionPercentage: 50, weight: 1.0 },
    ];
    assert.strictEqual(calculateWeightedRollup(weightedNodes), 83.3);
  });

  test('aggregates study hours and links them to subtopics and subjects', () => {
    const mockSessions: StudySession[] = [
      {
        id: 's1',
        userId: 'u1',
        taskType: 'new_study',
        subjectId: 'p-pol',
        subjectName: 'Polity & Governance',
        topicId: 't1',
        topicTitle: 'Constitution',
        subtopicId: 'sub-pol-1',
        subtopicTitle: 'Preamble',
        durationMinutes: 90,
        startedAt: '2026-10-06T10:00:00Z',
        endedAt: '2026-10-06T11:30:00Z',
      },
      {
        id: 's2',
        userId: 'u1',
        taskType: 'revision',
        subjectId: 'p-pol',
        subjectName: 'Polity & Governance',
        topicId: 't1',
        topicTitle: 'Constitution',
        subtopicId: 'sub-pol-1',
        subtopicTitle: 'Preamble',
        durationMinutes: 30,
        startedAt: '2026-10-06T14:00:00Z',
        endedAt: '2026-10-06T14:30:00Z',
      },
    ];

    const { bySubject, bySubtopic } = aggregateLoggedHours(mockSessions);
    assert.strictEqual(bySubtopic['sub-pol-1'], 2.0); // 90m + 30m = 2.0 hrs
    assert.strictEqual(bySubject['p-pol'], 2.0);
    assert.strictEqual(bySubject['Polity & Governance'], 2.0);
  });

  test('stage rollups only include the user-selected optional in totals', () => {
    const mockSubjects: SubjectNode[] = [
      {
        id: 'sub-prelims',
        subject: 'Indian Polity',
        paper: 'GS 1',
        stage: 'prelims',
        node_type: 'subject',
        weight: 1.0,
        estimated_study_hours: 50,
        topics: [
          {
            id: 't-pol',
            title: 'Polity Topics',
            subtopics: [{ id: 'st-pol-1', title: 'Preamble', weight: 1.0, estimated_hours: 10 }],
          },
        ],
      },
      {
        id: 'sub-opt-psir',
        subject: 'PSIR Optional Paper I',
        paper: 'Optional',
        stage: 'optional',
        node_type: 'subject',
        weight: 1.0,
        estimated_study_hours: 50,
        topics: [
          {
            id: 't-psir',
            title: 'PSIR Topics',
            subtopics: [{ id: 'st-psir-1', title: 'Western Thought', weight: 1.0, estimated_hours: 10 }],
          },
        ],
      },
      {
        id: 'sub-opt-geo',
        subject: 'Geography Optional Paper I',
        paper: 'Optional',
        stage: 'optional',
        node_type: 'subject',
        weight: 1.0,
        estimated_study_hours: 50,
        topics: [
          {
            id: 't-geo',
            title: 'Geo Topics',
            subtopics: [{ id: 'st-geo-1', title: 'Geomorphology', weight: 1.0, estimated_hours: 10 }],
          },
        ],
      },
    ];

    const progressMap: Record<string, SubtopicUserProgress> = {
      'st-pol-1': {
        subtopicId: 'st-pol-1',
        ncertRead: true,
        standardBookRead: true,
        notesMade: false,
        coachingAttended: false,
        extraSources: '',
        currentAffairsLinked: false,
        pyqSolvedCount: 0,
        mcqPracticeDone: false,
        revisionCount: 0,
        lastRevisedAt: null,
        confidenceScore: 3,
        completionPercentage: 40,
      },
      'st-psir-1': {
        subtopicId: 'st-psir-1',
        ncertRead: true,
        standardBookRead: true,
        notesMade: true,
        coachingAttended: false,
        extraSources: '',
        currentAffairsLinked: false,
        pyqSolvedCount: 0,
        mcqPracticeDone: false,
        revisionCount: 0,
        lastRevisedAt: null,
        confidenceScore: 3,
        completionPercentage: 50,
      },
    };

    // Aspirant chose PSIR: Geography Optional must NOT be in the totals
    const result = calculateStageRollups(mockSubjects, progressMap, 'PSIR');
    assert.strictEqual(result.prelims.percentage, 40);
    assert.strictEqual(result.optional.percentage, 50);
    assert.strictEqual(result.optional.name, 'PSIR');
    // Total optional topics should only be 1 (from PSIR), not 2
    assert.strictEqual(result.optional.totalTopics, 1);
  });
});
