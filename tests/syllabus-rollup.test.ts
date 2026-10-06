import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSubtopicProgress,
  calculateSubjectRollups,
  getDefaultSubtopicProgress
} from '../src/lib/syllabus/seed-loader.ts';
import type { SubjectNode, SubtopicUserProgress } from '../src/types/syllabus.ts';

const mockSubject: SubjectNode = {
  id: 'test.subj.history',
  paper: 'GS Paper I',
  stage: 'prelims',
  subject: 'Modern History Test',
  node_type: 'subject',
  weight: 1.0,
  estimated_study_hours: 10,
  order_index: 1,
  topics: [
    {
      id: 'test.top.1',
      title: '1857 Revolt',
      subtopics: [
        { id: 'sub-1', title: 'Causes', weight: 1.0, estimated_hours: 2 },
        { id: 'sub-2', title: 'Consequences', weight: 1.0, estimated_hours: 2 },
      ],
    },
  ],
};

describe('Syllabus Seed & Hierarchical Rollup Engine', () => {
  test('returns 0% for default subtopic progress', () => {
    const initial = getDefaultSubtopicProgress('sub-1');
    assert.equal(initial.completionPercentage, 0);
  });

  test('computes subtopic progress correctly when activities are toggled', () => {
    const initial = getDefaultSubtopicProgress('sub-1');

    // Toggle NCERT (15%) + Standard Book (25%) = 40%
    const step1 = computeSubtopicProgress(initial, {
      ncertRead: true,
      standardBookRead: true,
    });
    assert.equal(step1.completionPercentage, 40);

    // Add 1 revision (1/3 of 20% = 6.7%) + notes (10%) = 56.7%
    const step2 = computeSubtopicProgress(step1, {
      notesMade: true,
      revisionCount: 1,
    });
    assert.equal(step2.completionPercentage, 56.7);
  });

  test('calculates accurate rollups from subtopics to topic and subject', () => {
    const progressMap: Record<string, SubtopicUserProgress> = {
      'sub-1': {
        ...getDefaultSubtopicProgress('sub-1'),
        completionPercentage: 100,
      },
      'sub-2': {
        ...getDefaultSubtopicProgress('sub-2'),
        completionPercentage: 50,
      },
    };

    const rollups = calculateSubjectRollups([mockSubject], progressMap);
    assert.equal(rollups.length, 1);

    const subjectRollup = rollups[0];
    assert.equal(subjectRollup.totalSubtopics, 2);
    // Topic percentage should be average of sub-1 (100) and sub-2 (50) = 75%
    assert.equal(subjectRollup.topics[0].completionPercentage, 75);
    // Subject percentage should equal topic percentage = 75%
    assert.equal(subjectRollup.completionPercentage, 75);
    // Completed hours should be 75% of 10 hours = 7.5 hrs
    assert.equal(subjectRollup.completedStudyHours, 7.5);
  });
});
