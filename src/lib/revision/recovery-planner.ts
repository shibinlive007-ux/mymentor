/**
 * Intelligent Backlog Recovery Proposal Generator
 *
 * Adheres strictly to the core product principle:
 * "The AI manages and adapts the preparation system, but the user approves every major decision."
 * When backlogs accumulate, never create an impossible schedule — propose calm recovery options.
 */

import { RecoveryProposal, RecoveryStrategy, RevisionItem } from '@/types/revision';

export interface GenerateRecoveryProposalOptions {
  overdueItems: RevisionItem[];
  preferredStrategy?: RecoveryStrategy;
}

export function generateRecoveryProposal({
  overdueItems,
  preferredStrategy = 'redistribute_spread',
}: GenerateRecoveryProposalOptions): RecoveryProposal | null {
  if (overdueItems.length === 0) return null;

  const backlogCount = overdueItems.length;
  const overdueMinutes = overdueItems.reduce((acc, item) => acc + (item.weight >= 1.5 ? 60 : 45), 0);

  if (preferredStrategy === 'buffer_catchup') {
    return {
      id: `prop-rec-buffer-${Date.now()}`,
      title: `Weekend 90-Min Catch-Up Block (${backlogCount} Topics)`,
      reason: `You have ${backlogCount} overdue revisions. Instead of cramming them into today's weekday schedule, this proposal allocates a calm 90-minute review block this Sunday morning.`,
      backlogCount,
      overdueMinutes,
      strategy: 'buffer_catchup',
      proposedChanges: overdueItems.slice(0, 4).map((item) => ({
        description: `Schedule ${item.subtopicTitle} into Sunday consolidation slot`,
        affectedSubject: item.subjectName,
        adjustedMinutes: item.weight >= 1.5 ? 50 : 35,
      })),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  if (preferredStrategy === 'prune_low_weight') {
    const highYieldItems = overdueItems.filter((i) => i.weight >= 1.2);
    const lowYieldItems = overdueItems.filter((i) => i.weight < 1.2);

    return {
      id: `prop-rec-prune-${Date.now()}`,
      title: `High-Yield Priority Reset (Core Topics First)`,
      reason: `Focus immediate energy on ${highYieldItems.length} high-frequency syllabus pillars and temporarily defer ${lowYieldItems.length} low-weight topic(s) to avoid cognitive fatigue.`,
      backlogCount,
      overdueMinutes,
      strategy: 'prune_low_weight',
      proposedChanges: [
        ...highYieldItems.map((item) => ({
          description: `Fast-track ${item.subtopicTitle} (Weight ${item.weight}x)`,
          affectedSubject: item.subjectName,
          adjustedMinutes: 45,
        })),
        ...lowYieldItems.map((item) => ({
          description: `Defer ${item.subtopicTitle} to next monthly sectional revision`,
          affectedSubject: item.subjectName,
          adjustedMinutes: 0,
        })),
      ],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  }

  // Default: Gentle 3-4 day redistribution
  const daysToSpread = Math.min(4, Math.max(2, Math.ceil(backlogCount / 1.5)));
  const minutesPerDay = Math.round(overdueMinutes / daysToSpread);

  return {
    id: `prop-rec-spread-${Date.now()}`,
    title: `Gentle ${daysToSpread}-Day Revision Redistribution (+${minutesPerDay}m/day)`,
    reason: `Accumulated ${backlogCount} overdue revision(s). Spreading them across the next ${daysToSpread} daily plans adds only ${minutesPerDay} mins/day, preventing burnout while protecting retention.`,
    backlogCount,
    overdueMinutes,
    strategy: 'redistribute_spread',
    proposedChanges: overdueItems.map((item, idx) => ({
      description: `Slot ${item.subtopicTitle} into Day +${(idx % daysToSpread) + 1}`,
      affectedSubject: item.subjectName,
      adjustedMinutes: Math.round(overdueMinutes / backlogCount),
    })),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}
