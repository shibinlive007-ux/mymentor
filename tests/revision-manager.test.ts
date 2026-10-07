import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllRevisionItems,
  getRevisionHealthSummary,
  incrementSubtopicRevision,
} from '../src/lib/revision/revision-engine.ts';
import { generateRecoveryProposal } from '../src/lib/revision/recovery-planner.ts';
import { SubtopicUserProgress } from '../src/types/syllabus.ts';
import { RevisionItem } from '../src/types/revision.ts';

describe('Spaced Repetition & Revision Manager Engine', () => {
  const mockCurrentDate = new Date('2026-10-15T10:00:00Z');

  test('identifies and categorizes revision items across retention cycles', () => {
    const progressMap: Record<string, SubtopicUserProgress> = {
      // Studied 10 days ago with 1 revision done (7d interval -> due 3 days ago = overdue)
      'p-pol-2': {
        subtopicId: 'p-pol-2',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Laxmikanth',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 20,
        mcqPracticeDone: true,
        revisionCount: 1,
        lastRevisedAt: '2026-10-05T10:00:00Z', // 10 days before Oct 15
        confidenceScore: 4,
        completionPercentage: 86.7,
      },
      // Studied yesterday with 0 revisions (1d interval -> due today)
      'p-hist-mod-1': {
        subtopicId: 'p-hist-mod-1',
        ncertRead: true,
        standardBookRead: false,
        standardBookName: '',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: false,
        pyqSolvedCount: 10,
        mcqPracticeDone: true,
        revisionCount: 0,
        lastRevisedAt: '2026-10-14T10:00:00Z', // 1 day before Oct 15 -> due today
        confidenceScore: 3,
        completionPercentage: 50,
      },
      // Completed 3 revisions -> mastered
      'p-hist-anc-1': {
        subtopicId: 'p-hist-anc-1',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'RS Sharma',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 30,
        mcqPracticeDone: true,
        revisionCount: 3,
        lastRevisedAt: '2026-10-01T10:00:00Z',
        confidenceScore: 5,
        completionPercentage: 100,
      },
    };

    const items = getAllRevisionItems({
      progressMap,
      examMode: 'combined',
      currentDate: mockCurrentDate,
    });

    assert.equal(items.length, 3);

    const polItem = items.find((i) => i.subtopicId === 'p-pol-2');
    assert.ok(polItem);
    assert.equal(polItem.status, 'overdue');
    assert.equal(polItem.daysOverdue, 3);

    const histItem = items.find((i) => i.subtopicId === 'p-hist-mod-1');
    assert.ok(histItem);
    assert.equal(histItem.status, 'due_today');
    assert.equal(histItem.daysOverdue, 0);

    const masteredItem = items.find((i) => i.subtopicId === 'p-hist-anc-1');
    assert.ok(masteredItem);
    assert.equal(masteredItem.status, 'completed');
  });

  test('calculates retention freshness percent and aggregates health metrics', () => {
    const progressMap: Record<string, SubtopicUserProgress> = {
      'p-pol-2': {
        subtopicId: 'p-pol-2',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Laxmikanth',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 20,
        mcqPracticeDone: true,
        revisionCount: 1,
        lastRevisedAt: '2026-10-05T10:00:00Z', // overdue
        confidenceScore: 4,
        completionPercentage: 86.7,
      },
      'p-hist-mod-1': {
        subtopicId: 'p-hist-mod-1',
        ncertRead: true,
        standardBookRead: false,
        standardBookName: '',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: false,
        pyqSolvedCount: 10,
        mcqPracticeDone: true,
        revisionCount: 0,
        lastRevisedAt: '2026-10-14T10:00:00Z', // due today
        confidenceScore: 3,
        completionPercentage: 50,
      },
    };

    const summary = getRevisionHealthSummary({
      progressMap,
      examMode: 'combined',
      currentDate: mockCurrentDate,
      backlogThreshold: 3,
    });

    assert.equal(summary.overdueCount, 1);
    assert.equal(summary.dueTodayCount, 1);
    assert.equal(summary.completedCyclesCount, 0);
    // 1 of 2 is overdue, so freshness = 50%
    assert.equal(summary.retentionFreshnessPercent, 50);
    // Overdue is below backlogThreshold (1 < 3), so no proposal
    assert.equal(summary.recoveryProposal, null);
  });

  test('auto-triggers human-in-the-loop recovery proposal when overdue items >= threshold', () => {
    const progressMap: Record<string, SubtopicUserProgress> = {
      'p-pol-2': {
        subtopicId: 'p-pol-2',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Laxmikanth',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 20,
        mcqPracticeDone: true,
        revisionCount: 1,
        lastRevisedAt: '2026-10-01T10:00:00Z', // overdue
        confidenceScore: 4,
        completionPercentage: 86.7,
      },
      'p-hist-mod-1': {
        subtopicId: 'p-hist-mod-1',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Spectrum',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: false,
        pyqSolvedCount: 10,
        mcqPracticeDone: true,
        revisionCount: 0,
        lastRevisedAt: '2026-10-01T10:00:00Z', // overdue
        confidenceScore: 3,
        completionPercentage: 50,
      },
      'p-geo-1': {
        subtopicId: 'p-geo-1',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'GC Leong',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: false,
        pyqSolvedCount: 8,
        mcqPracticeDone: true,
        revisionCount: 0,
        lastRevisedAt: '2026-10-02T10:00:00Z', // overdue
        confidenceScore: 3,
        completionPercentage: 60,
      },
    };

    const summary = getRevisionHealthSummary({
      progressMap,
      examMode: 'combined',
      currentDate: mockCurrentDate,
      backlogThreshold: 3,
    });

    assert.equal(summary.overdueCount, 3);
    assert.ok(summary.recoveryProposal !== null);
    assert.equal(summary.recoveryProposal?.backlogCount, 3);
    assert.equal(summary.recoveryProposal?.status, 'pending'); // Human-in-the-loop pending approval
    assert.equal(summary.recoveryProposal?.strategy, 'redistribute_spread');
  });

  test('generates all three intelligent recovery strategies without guilt', () => {
    const overdueMockItems: RevisionItem[] = [
      {
        id: 'rev-1',
        subtopicId: 'p-pol-2',
        subtopicTitle: 'Fundamental Rights',
        subjectId: 'p-pol',
        subjectName: 'Polity',
        topicId: 'top-1',
        topicTitle: 'Constitution',
        stageNumber: 2,
        scheduledDate: '2026-10-05',
        dueDate: '2026-10-12',
        status: 'overdue',
        daysOverdue: 3,
        confidenceScore: 3,
        weight: 1.4,
        lastRevisedAt: '2026-10-05T10:00:00Z',
      },
      {
        id: 'rev-2',
        subtopicId: 'p-hist-anc-1',
        subtopicTitle: 'Harappan Town Planning',
        subjectId: 'p-hist',
        subjectName: 'History',
        topicId: 'top-2',
        topicTitle: 'Ancient',
        stageNumber: 1,
        scheduledDate: '2026-10-01',
        dueDate: '2026-10-02',
        status: 'overdue',
        daysOverdue: 13,
        confidenceScore: 2,
        weight: 0.9,
        lastRevisedAt: '2026-10-01T10:00:00Z',
      },
      {
        id: 'rev-3',
        subtopicId: 'p-geo-3',
        subtopicTitle: 'Monsoon Dynamics & IOD',
        subjectId: 'p-geo',
        subjectName: 'Geography',
        topicId: 'top-3',
        topicTitle: 'Physical Geo',
        stageNumber: 1,
        scheduledDate: '2026-10-08',
        dueDate: '2026-10-09',
        status: 'overdue',
        daysOverdue: 6,
        confidenceScore: 3,
        weight: 1.3,
        lastRevisedAt: '2026-10-08T10:00:00Z',
      },
    ];

    // 1. Gentle Spread Strategy
    const spreadProposal = generateRecoveryProposal({
      overdueItems: overdueMockItems,
      preferredStrategy: 'redistribute_spread',
    });
    assert.ok(spreadProposal);
    assert.equal(spreadProposal.strategy, 'redistribute_spread');
    assert.equal(spreadProposal.proposedChanges.length, 3);
    assert.ok(spreadProposal.title.includes('Redistribution'));

    // 2. Weekend Buffer Catch-Up Strategy
    const bufferProposal = generateRecoveryProposal({
      overdueItems: overdueMockItems,
      preferredStrategy: 'buffer_catchup',
    });
    assert.ok(bufferProposal);
    assert.equal(bufferProposal.strategy, 'buffer_catchup');
    assert.ok(bufferProposal.title.includes('Weekend'));
    assert.ok(bufferProposal.reason.includes('Sunday'));

    // 3. High-Yield Core Priority Strategy
    const pruneProposal = generateRecoveryProposal({
      overdueItems: overdueMockItems,
      preferredStrategy: 'prune_low_weight',
    });
    assert.ok(pruneProposal);
    assert.equal(pruneProposal.strategy, 'prune_low_weight');
    // High-yield (weight >= 1.2): Fundamental Rights (1.4), Monsoon (1.3)
    // Low-yield (weight < 1.2): Harappan (0.9) deferred
    const deferred = pruneProposal.proposedChanges.find((c) => c.adjustedMinutes === 0);
    assert.ok(deferred);
    assert.ok(deferred.description.includes('Defer'));
  });

  test('incrementSubtopicRevision advances revision cycle and updates metrics', () => {
    const initialMap: Record<string, SubtopicUserProgress> = {
      'p-pol-2': {
        subtopicId: 'p-pol-2',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Laxmikanth',
        coachingAttended: false,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 20,
        mcqPracticeDone: true,
        revisionCount: 1,
        lastRevisedAt: '2026-10-01T10:00:00Z',
        confidenceScore: 3,
        completionPercentage: 70,
      },
    };

    const updatedMap = incrementSubtopicRevision(initialMap, 'p-pol-2', 5);
    const updated = updatedMap['p-pol-2'];

    assert.equal(updated.revisionCount, 2);
    assert.equal(updated.confidenceScore, 5);
    assert.ok(updated.lastRevisedAt !== '2026-10-01T10:00:00Z');
    // Completion percentage increased with additional revision
    assert.ok(updated.completionPercentage > 70);
  });
});
