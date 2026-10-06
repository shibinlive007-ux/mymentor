import { test, describe } from 'node:test';
import assert from 'node:assert';
import { generateDailyPlan } from '../src/lib/planner/daily-scheduler';
import { SubtopicUserProgress } from '../src/types/syllabus';

describe('Deterministic Daily Planner Engine', () => {
  test('generates a balanced standard plan with 3-5 tasks fitting available hours', () => {
    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 6,
        disruptions: [],
      },
      examMode: 'prelims',
    });

    assert.strictEqual(plan.status, 'proposed');
    assert.strictEqual(plan.isMinimumViableDay, false);
    assert.ok(plan.tasks.length >= 3 && plan.tasks.length <= 5);

    // Checks that a Current Affairs slot is present
    const hasCA = plan.tasks.some((t) => t.taskType === 'current_affairs');
    assert.strictEqual(hasCA, true);

    // Total duration fits comfortably within available hours (within 1 hour variance)
    assert.ok(plan.totalPlannedMinutes <= 360);
    assert.ok(plan.totalPlannedMinutes >= 180);
  });

  test('triggers Minimum Viable Day when energy is low (mood <= 2)', () => {
    const plan = generateDailyPlan({
      checkin: {
        energyMood: 2,
        availableHours: 5,
        disruptions: ['unwell'],
      },
      examMode: 'prelims',
    });

    assert.strictEqual(plan.isMinimumViableDay, true);
    assert.ok(plan.tasks.length <= 3, `Expected <= 3 tasks on MVD, got ${plan.tasks.length}`);
    assert.ok(plan.totalPlannedMinutes <= 180, `Expected <= 180 mins, got ${plan.totalPlannedMinutes}`);
    assert.ok(plan.mentorRationale.includes('Minimum Viable Day Active'));
  });

  test('triggers Minimum Viable Day when available hours are under 3.5h', () => {
    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 2.5,
        disruptions: ['office_rush'],
      },
      examMode: 'prelims',
    });

    assert.strictEqual(plan.isMinimumViableDay, true);
    assert.ok(plan.tasks.length <= 3);
  });

  test('prioritizes overdue spaced revisions in top slots', () => {
    // Mock an overdue subtopic (Polity Fundamental Rights revised 8 days ago on a 7-day interval)
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const progressMap: Record<string, SubtopicUserProgress> = {
      'p-pol-2': {
        subtopicId: 'p-pol-2',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Laxmikanth',
        coachingAttended: true,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 20,
        mcqPracticeDone: true,
        revisionCount: 1,
        lastRevisedAt: eightDaysAgo.toISOString(),
        confidenceScore: 4,
        completionPercentage: 85,
      },
    };

    const plan = generateDailyPlan({
      checkin: {
        energyMood: 3,
        availableHours: 6,
        disruptions: [],
      },
      examMode: 'prelims',
      progressMap,
    });

    const revisionTask = plan.tasks.find((t) => t.taskType === 'revision');
    assert.ok(revisionTask, 'Expected a revision task to be scheduled');
    assert.strictEqual(revisionTask.subtopicId, 'p-pol-2');
    assert.ok(revisionTask.reason.includes('overdue'));
    // Front-loaded in early slots
    assert.ok(revisionTask.orderIndex <= 2);
  });

  test('schedules scheduled mock tests when indicated in morning check-in', () => {
    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 7,
        disruptions: ['test_series'],
        hasTestToday: true,
        testName: 'VisionIAS Prelims Mock 5',
      },
      examMode: 'prelims',
    });

    const mockTask = plan.tasks.find((t) => t.taskType === 'mock_test');
    assert.ok(mockTask);
    assert.strictEqual(mockTask.topicTitle, 'VisionIAS Prelims Mock 5');
  });

  test('slots answer writing practice in Mains or Combined exam mode', () => {
    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 6,
        disruptions: [],
      },
      examMode: 'mains',
    });

    const awTask = plan.tasks.find((t) => t.taskType === 'answer_writing');
    assert.ok(awTask, 'Expected answer writing task in mains mode');
    assert.strictEqual(awTask.subjectName, 'Answer Writing Practice');
  });

  test('respects the 35% subject weekly cap guardrail', () => {
    // If Modern History already has 25 hours out of 40 total hours (62.5% > 35%)
    const recentSubjectHours = {
      'Modern History': 25,
      'Polity & Governance': 10,
      'Geography': 5,
    };

    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 6,
        disruptions: [],
      },
      examMode: 'prelims',
      recentSubjectHours,
    });

    // New study task should not be Modern History because it is capped
    const newStudyTasks = plan.tasks.filter((t) => t.taskType === 'new_study');
    for (const task of newStudyTasks) {
      assert.notStrictEqual(
        task.subjectName,
        'Modern History',
        'Capped subject should not receive deep work new study slots'
      );
    }
  });
});
