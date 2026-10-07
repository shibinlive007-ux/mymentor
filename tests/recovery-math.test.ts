import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateRecoveryProposal } from '../src/lib/revision/recovery-planner';
import { RevisionItem } from '../src/types/revision';

describe('Task 4: Recovery Plan Math & Strategy Discrepancy Checks', () => {
  const overdue3Items: RevisionItem[] = [
    {
      id: 'rev-1',
      subtopicId: 'p-pol-2',
      subtopicTitle: 'Fundamental Rights',
      subjectId: 'p-pol',
      subjectName: 'Polity',
      topicId: 't-1',
      topicTitle: 'Constitution',
      stageNumber: 2,
      scheduledDate: '2026-10-01',
      dueDate: '2026-10-02',
      status: 'overdue',
      daysOverdue: 5,
      confidenceScore: 3,
      weight: 1.0,
      lastRevisedAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'rev-2',
      subtopicId: 'p-hist-1',
      subtopicTitle: 'Modern History 1857 Revolt',
      subjectId: 'p-hist',
      subjectName: 'History',
      topicId: 't-2',
      topicTitle: 'Freedom Struggle',
      stageNumber: 2,
      scheduledDate: '2026-10-01',
      dueDate: '2026-10-02',
      status: 'overdue',
      daysOverdue: 5,
      confidenceScore: 3,
      weight: 1.0,
      lastRevisedAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'rev-3',
      subtopicId: 'p-geo-1',
      subtopicTitle: 'Physical Geography Geomorphology',
      subjectId: 'p-geo',
      subjectName: 'Geography',
      topicId: 't-3',
      topicTitle: 'Earth Systems',
      stageNumber: 1,
      scheduledDate: '2026-10-02',
      dueDate: '2026-10-03',
      status: 'overdue',
      daysOverdue: 4,
      confidenceScore: 3,
      weight: 1.0,
      lastRevisedAt: '2026-10-02T10:00:00Z',
    },
  ];

  test('eliminates +68m/day contradiction: title matches actual per-day minute allocations', () => {
    const proposal = generateRecoveryProposal({
      overdueItems: overdue3Items,
      preferredStrategy: 'redistribute_spread',
    });

    assert.ok(proposal !== null);
    // 3 items of 45m each = 135 total overdue minutes spread across 2 days
    assert.equal(proposal.overdueMinutes, 135);

    // MUST NOT contain the flawed "+68m/day" contradiction!
    assert.ok(!proposal.title.includes('+68m/day'));

    // Title MUST accurately state the daily breakdown
    assert.ok(
      proposal.title.includes('Day 1: +90m, Day 2: +45m') ||
      proposal.title.includes('Day 1: +45m, Day 2: +90m')
    );

    // Sum of items tagged Day +1 must equal the stated Day 1 minutes
    const day1Changes = proposal.proposedChanges.filter((c) => c.description.startsWith('Day +1:'));
    const day1Total = day1Changes.reduce((s, c) => s + c.adjustedMinutes, 0);
    assert.equal(day1Total, 90);

    // Sum of items tagged Day +2 must equal the stated Day 2 minutes
    const day2Changes = proposal.proposedChanges.filter((c) => c.description.startsWith('Day +2:'));
    const day2Total = day2Changes.reduce((s, c) => s + c.adjustedMinutes, 0);
    assert.equal(day2Total, 45);

    // Total minutes across all proposed changes must equal overdueMinutes
    const totalSlotted = proposal.proposedChanges.reduce((s, c) => s + c.adjustedMinutes, 0);
    assert.equal(totalSlotted, proposal.overdueMinutes);
  });

  test('reports clean uniform rate when items divide evenly across days', () => {
    const overdue2Items = overdue3Items.slice(0, 2);
    const proposal = generateRecoveryProposal({
      overdueItems: overdue2Items,
      preferredStrategy: 'redistribute_spread',
    });

    assert.ok(proposal !== null);
    assert.equal(proposal.overdueMinutes, 90);
    // 2 items over 2 days = 45m/day uniformly
    assert.ok(proposal.title.includes('+45m/day'));
  });

  test('generates 3 genuinely distinct recovery schedules and rationale', () => {
    const spread = generateRecoveryProposal({
      overdueItems: overdue3Items,
      preferredStrategy: 'redistribute_spread',
    });

    const buffer = generateRecoveryProposal({
      overdueItems: overdue3Items,
      preferredStrategy: 'buffer_catchup',
    });

    const core = generateRecoveryProposal({
      overdueItems: overdue3Items,
      preferredStrategy: 'prune_low_weight',
    });

    assert.ok(spread && buffer && core);

    // Strategies are distinct
    assert.equal(spread.strategy, 'redistribute_spread');
    assert.equal(buffer.strategy, 'buffer_catchup');
    assert.equal(core.strategy, 'prune_low_weight');

    // Titles are distinct
    assert.notEqual(spread.title, buffer.title);
    assert.notEqual(spread.title, core.title);
    assert.notEqual(buffer.title, core.title);

    // Buffer catchup targets weekend consolidation block
    assert.ok(buffer.title.includes('Weekend'));
    assert.ok(buffer.reason.includes('Sunday'));

    // Core priority has deferrals for low weight
    assert.ok(core.title.includes('High-Yield Priority Reset'));
  });
});
