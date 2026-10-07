import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateDailyPlan } from '../src/lib/planner/daily-scheduler';
import { PLANNER_CONFIG } from '../src/config/planner-config';
import { SubtopicUserProgress } from '../src/types/syllabus';

describe('Task 1: Planner Guardrails & Config Enforcement', () => {
  test('constants in planner config match specified values', () => {
    assert.strictEqual(PLANNER_CONFIG.SUBJECT_WEEKLY_CAP_PERCENT, 35);
    assert.deepStrictEqual(PLANNER_CONFIG.REVISION_INTERVALS_DAYS, [1, 7, 21, 45]);
    assert.strictEqual(PLANNER_CONFIG.MAX_CONSECUTIVE_DAYS_ON_SUBJECT, 5);
    assert.strictEqual(PLANNER_CONFIG.LOW_ENERGY_MOOD_MAX, 2);
    assert.strictEqual(PLANNER_CONFIG.LOW_HOURS_MVD_MAX, 3.5);
  });

  test('over-cap subject (39% share) is strictly excluded from new study', () => {
    // Exact scenario from bug report:
    // Modern History at 18.5 hours / 47.0 total hours = 39.36% (exceeds 35% cap)
    // Polity at 14.0h, Economy at 9.5h, Geography at 5.0h
    const recentSubjectHours = {
      'Modern History': 18.5,
      'Polity & Governance': 14.0,
      'Economy (GS3)': 9.5,
      'Geography': 5.0,
    };

    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 6.0,
        disruptions: [],
      },
      examMode: 'prelims',
      recentSubjectHours,
    });

    // Check all new study tasks in the plan
    const newStudyTasks = plan.tasks.filter((t) => t.taskType === 'new_study');
    assert.ok(newStudyTasks.length > 0, 'Expected at least one new study slot');

    for (const task of newStudyTasks) {
      assert.notStrictEqual(
        task.subjectName,
        'History of India & Indian National Movement',
        'History must not receive new study slot when over 35% weekly cap'
      );
      assert.notStrictEqual(
        task.subjectName,
        'Modern History',
        'Modern History must not receive new study slot when over 35% weekly cap'
      );
    }
  });

  test('allows revision for over-cap subject when revision is due', () => {
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const progressMap: Record<string, SubtopicUserProgress> = {
      'p-hist-mod-1': {
        subtopicId: 'p-hist-mod-1',
        ncertRead: true,
        standardBookRead: true,
        standardBookName: 'Spectrum',
        coachingAttended: true,
        extraSources: '',
        notesMade: true,
        currentAffairsLinked: true,
        pyqSolvedCount: 15,
        mcqPracticeDone: true,
        revisionCount: 1,
        lastRevisedAt: eightDaysAgo.toISOString(),
        confidenceScore: 4,
        completionPercentage: 90,
      },
    };

    const recentSubjectHours = {
      'Modern History': 20.0,
      'Polity & Governance': 10.0,
    };

    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 6.0,
        disruptions: [],
      },
      examMode: 'prelims',
      progressMap,
      recentSubjectHours,
    });

    // Revision should still be scheduled to preserve retention
    const revTask = plan.tasks.find((t) => t.taskType === 'revision');
    assert.ok(revTask, 'Revision must still be allowed to preserve retention');
    assert.strictEqual(revTask.subtopicId, 'p-hist-mod-1');

    // But NO new study for Modern History
    const newStudyTasks = plan.tasks.filter((t) => t.taskType === 'new_study');
    for (const task of newStudyTasks) {
      assert.notStrictEqual(task.subjectName, 'Modern History');
    }
  });

  test('neglected subject with 0 weekly hours is promoted for new study', () => {
    // Modern History (18.5h, over cap), Polity (14h), Economy (9.5h), Geography (6h)
    // CSAT has 0 hours this week
    const recentSubjectHours = {
      'Modern History': 18.5,
      'Polity & Governance': 14.0,
      'Economy (GS3)': 9.5,
      'Geography': 6.0,
      'CSAT: Aptitude, Reasoning & Reading Comprehension': 0.0,
    };

    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 6.0,
        disruptions: [],
      },
      examMode: 'prelims',
      recentSubjectHours,
    });

    const newStudyTasks = plan.tasks.filter((t) => t.taskType === 'new_study');
    assert.ok(newStudyTasks.length > 0);

    // The chosen subject must be one with 0 hours or lowest hours, never Modern History
    const chosen = newStudyTasks[0];
    assert.notStrictEqual(chosen.subjectName, 'Modern History');
    assert.ok(chosen.reason.includes('Priority rotation') || chosen.reason.includes('balancing'));
  });

  test('triggers minimum viable day when energy is low (mood <= 2)', () => {
    const plan = generateDailyPlan({
      checkin: {
        energyMood: 2,
        availableHours: 6.0,
        disruptions: ['headache'],
      },
      examMode: 'prelims',
    });

    assert.strictEqual(plan.isMinimumViableDay, true);
    assert.ok(plan.tasks.length <= 3, `Expected <= 3 tasks, got ${plan.tasks.length}`);
    assert.ok(plan.totalPlannedMinutes <= 180, `Expected <= 180 mins, got ${plan.totalPlannedMinutes}`);
    assert.ok(plan.mentorRationale.includes('Minimum Viable Day Active'));

    // Should not have any heavy new study tasks
    const newStudy = plan.tasks.filter((t) => t.taskType === 'new_study');
    assert.strictEqual(newStudy.length, 0, 'No heavy new study on Minimum Viable Day');
  });

  test('triggers minimum viable day when available hours < 3.5h', () => {
    const plan = generateDailyPlan({
      checkin: {
        energyMood: 4,
        availableHours: 2.5,
        disruptions: [],
      },
      examMode: 'combined',
    });

    assert.strictEqual(plan.isMinimumViableDay, true);
    assert.ok(plan.tasks.length <= 3);
    assert.ok(plan.totalPlannedMinutes <= 180);
  });
});
