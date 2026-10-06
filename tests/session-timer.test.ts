import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  getTaskCompletionMessage,
  getMilestoneMessage,
  getStreakMessage,
  getComebackMessage
} from '../src/lib/encouragement/messages';
import {
  calculateTotalStudyMinutes,
  aggregateMinutesBySubject,
  aggregateMinutesByType
} from '../src/lib/sessions/session-manager';
import { StudySession } from '../src/types/session';
import { PlannerTask } from '../src/types/planner';

describe('Study Session & Encouragement System', () => {
  const mockTask: PlannerTask = {
    id: 't-1',
    subjectId: 'p-pol',
    subjectName: 'Polity & Governance',
    topicId: 'p-pol-t1',
    topicTitle: 'Fundamental Rights Articles 14-18',
    taskType: 'revision',
    durationMinutes: 60,
    completedMinutes: 60,
    status: 'completed',
    reason: 'Day 7 revision',
    orderIndex: 1,
  };

  test('generates genuine task completion encouragement for revision', () => {
    const msg = getTaskCompletionMessage(mockTask, 1, 4);
    assert.strictEqual(msg.category, 'task_complete');
    assert.ok(msg.title.includes('Polity & Governance'));
    assert.ok(msg.body.length > 10);
  });

  test('generates special celebration message when all tasks of the day are completed', () => {
    const msg = getTaskCompletionMessage(mockTask, 4, 4);
    assert.strictEqual(msg.category, 'all_complete');
    assert.ok(msg.title.includes('Day’s Planned Blocks Completed'));
  });

  test('generates milestone messages for 50% and 100% syllabus progress', () => {
    const msg50 = getMilestoneMessage('Modern History', 50);
    assert.strictEqual(msg50.category, 'milestone');
    assert.ok(msg50.title.includes('Halfway Mark'));

    const msg100 = getMilestoneMessage('Polity', 100);
    assert.strictEqual(msg100.category, 'milestone');
    assert.ok(msg100.title.includes('100% Covered'));
  });

  test('generates streak encouragement for consistency milestones', () => {
    const msg7 = getStreakMessage(7);
    assert.strictEqual(msg7.category, 'streak');
    assert.ok(msg7.title.includes('7-Day'));

    const msg30 = getStreakMessage(30);
    assert.strictEqual(msg30.category, 'streak');
    assert.ok(msg30.title.includes('30-Day'));
  });

  test('generates guilt-free comeback message after missed days', () => {
    const msg = getComebackMessage();
    assert.strictEqual(msg.category, 'comeback');
    assert.ok(msg.title.includes('Welcome Back'));
    assert.ok(msg.body.length > 20);
  });

  test('calculates total study minutes and aggregates by subject and type', () => {
    const sessions: StudySession[] = [
      {
        id: 's-1',
        subjectId: 'p-pol',
        subjectName: 'Polity',
        topicId: 'p-1',
        topicTitle: 'Preamble',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationMinutes: 45,
        sessionType: 'revision',
      },
      {
        id: 's-2',
        subjectId: 'p-pol',
        subjectName: 'Polity',
        topicId: 'p-2',
        topicTitle: 'Fundamental Rights',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationMinutes: 60,
        sessionType: 'new_study',
      },
      {
        id: 's-3',
        subjectId: 'ca',
        subjectName: 'Current Affairs',
        topicId: 'ca-1',
        topicTitle: 'The Hindu',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationMinutes: 45,
        sessionType: 'current_affairs',
      },
    ];

    const totalMins = calculateTotalStudyMinutes(sessions);
    assert.strictEqual(totalMins, 150);

    const bySubject = aggregateMinutesBySubject(sessions);
    assert.strictEqual(bySubject['Polity'], 105);
    assert.strictEqual(bySubject['Current Affairs'], 45);

    const byType = aggregateMinutesByType(sessions);
    assert.strictEqual(byType['revision'], 45);
    assert.strictEqual(byType['new_study'], 60);
    assert.strictEqual(byType['current_affairs'], 45);
  });
});
