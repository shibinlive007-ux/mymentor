import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSubjectBalance,
  computeStageRollups,
  generate30DayActivityGrid,
  generateStrategicWeeklyReview,
  SubjectHourInput,
} from '../src/lib/analytics/weekly-review-engine.ts';
import { SubtopicUserProgress } from '../src/types/syllabus.ts';
import { StudySession } from '../src/types/session.ts';

describe('Phase 7 Analytics & Weekly Review Engine', () => {
  test('flags subjects exceeding 35% weekly cap as over_indexed', () => {
    const input: SubjectHourInput[] = [
      { subjectId: 'hist', subjectName: 'Modern History', stage: 'prelims', actualHours: 20 },
      { subjectId: 'pol', subjectName: 'Polity', stage: 'prelims', actualHours: 15 },
      { subjectId: 'geo', subjectName: 'Geography', stage: 'prelims', actualHours: 10 },
      { subjectId: 'eth', subjectName: 'Ethics', stage: 'mains', actualHours: 0 },
    ];
    // Total hours = 45. History is 20 / 45 = 44.4% (> 35%)
    const results = computeSubjectBalance(input, 45);

    const history = results.find((r) => r.subjectId === 'hist');
    assert.ok(history);
    assert.equal(history.status, 'over_indexed');
    assert.equal(history.percentageOfTotal, 44);
    assert.ok(history.statusMessage?.includes('35%'));

    const polity = results.find((r) => r.subjectId === 'pol');
    assert.ok(polity);
    assert.equal(polity.status, 'balanced');
    assert.equal(polity.percentageOfTotal, 33);

    const ethics = results.find((r) => r.subjectId === 'eth');
    assert.ok(ethics);
    assert.equal(ethics.status, 'neglected');
    assert.equal(ethics.percentageOfTotal, 0);
  });

  test('computes stage-wise syllabus rollups across Prelims, CSAT, Mains, and Optional', () => {
    const mockProgress: Record<string, SubtopicUserProgress> = {
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
        revisionCount: 2,
        lastRevisedAt: '2026-10-01T10:00:00Z',
        confidenceScore: 4,
        completionPercentage: 90,
      },
    };

    const rollups = computeStageRollups(mockProgress);

    assert.equal(rollups.length, 4);

    const prelims = rollups.find((r) => r.stage === 'prelims');
    assert.ok(prelims);
    assert.equal(prelims.title, 'Prelims GS-I');
    assert.ok(prelims.totalEstimatedHours > 0);

    const csat = rollups.find((r) => r.stage === 'csat');
    assert.ok(csat);
    assert.equal(csat.title, 'CSAT (Paper II)');

    const mains = rollups.find((r) => r.stage === 'mains');
    assert.ok(mains);
    assert.ok(mains.title.includes('Mains'));

    const optional = rollups.find((r) => r.stage === 'optional');
    assert.ok(optional);
    assert.ok(optional.title.includes('Optional'));
  });

  test('generates 30-day activity grid with correct intensity mapping', () => {
    const mockSessions: StudySession[] = [
      {
        id: 'sess-1',
        subjectId: 'p-pol',
        subjectName: 'Polity',
        topicId: 'top-1',
        topicTitle: 'Constitution',
        sessionType: 'new_study',
        durationMinutes: 480, // 8 hours -> level 3
        startedAt: '2026-10-14T08:00:00Z',
        endedAt: '2026-10-14T16:00:00Z',
      },
      {
        id: 'sess-2',
        subjectId: 'p-hist',
        subjectName: 'History',
        topicId: 'top-2',
        topicTitle: 'Modern',
        sessionType: 'revision',
        durationMinutes: 120, // 2 hours -> level 1
        startedAt: '2026-10-13T08:00:00Z',
        endedAt: '2026-10-13T10:00:00Z',
      },
    ];

    const anchorDate = new Date('2026-10-15T12:00:00Z');
    const grid = generate30DayActivityGrid(mockSessions, anchorDate);

    assert.equal(grid.length, 30);

    const oct14 = grid.find((g) => g.date === '2026-10-14');
    assert.ok(oct14);
    assert.equal(oct14.hours, 8);
    assert.equal(oct14.level, 3);

    const oct13 = grid.find((g) => g.date === '2026-10-13');
    assert.ok(oct13);
    assert.equal(oct13.hours, 2);
    assert.equal(oct13.level, 1);

    const oct12 = grid.find((g) => g.date === '2026-10-12');
    assert.ok(oct12);
    assert.equal(oct12.hours, 0);
    assert.equal(oct12.level, 0);
  });

  test('generates grounded strategic weekly review with tailored highlights and bottlenecks', () => {
    const subjectBalances = [
      {
        subjectId: 'p-pol',
        subjectName: 'Polity',
        stage: 'prelims' as const,
        actualHours: 25,
        percentageOfTotal: 50,
        status: 'over_indexed' as const,
      },
      {
        subjectId: 'm-eth',
        subjectName: 'Ethics',
        stage: 'mains' as const,
        actualHours: 0,
        percentageOfTotal: 0,
        status: 'neglected' as const,
      },
    ];

    const review = generateStrategicWeeklyReview({
      plannedHours: 50,
      actualHours: 46,
      streakDays: 14,
      subjectBalances,
      pyqSummary: {
        prelimsMcqsSolvedThisWeek: 80,
        prelimsMcqsSolvedTotal: 300,
        prelimsMcqsTarget: 1500,
        mainsAnswersThisWeek: 5,
        mainsAnswersTotal: 20,
        mainsAnswersTarget: 100,
      },
    });

    assert.equal(review.consistencyPercent, 92);
    assert.equal(review.streakDays, 14);

    // Highlights should praise consistency and PYQs
    assert.ok(review.highlights.some((h) => h.includes('92%') || h.includes('consistency')));
    assert.ok(review.highlights.some((h) => h.includes('80 Prelims MCQs')));

    // Bottlenecks should diagnose Polity over-indexing and Ethics neglect
    assert.ok(review.bottlenecks.some((b) => b.includes('Polity') && b.includes('50%')));
    assert.ok(review.bottlenecks.some((b) => b.includes('Ethics') && b.includes('0 hours')));

    // Recommendations should propose cap and catchup
    assert.ok(review.strategicRecommendations.some((r) => r.includes('Polity')));
    assert.ok(review.strategicRecommendations.some((r) => r.includes('Ethics')));
  });
});
