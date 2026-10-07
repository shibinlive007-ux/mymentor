/**
 * Types for Revision Manager & Backlog Recovery Proposals
 */

export type RevisionStatus = 'due_today' | 'overdue' | 'upcoming' | 'completed';

export interface RevisionItem {
  id: string;
  subtopicId: string;
  subtopicTitle: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicTitle: string;
  stageNumber: number; // 1 to 4 (representing 1d, 7d, 21d, 45d intervals)
  scheduledDate: string; // YYYY-MM-DD
  dueDate: string;       // YYYY-MM-DD
  status: RevisionStatus;
  daysOverdue: number;
  confidenceScore: number; // 1 to 5
  weight: number;
  lastRevisedAt: string | null;
}

export type RecoveryStrategy = 'buffer_catchup' | 'redistribute_spread' | 'prune_low_weight';

export interface ProposedPlanAdjustment {
  description: string;
  affectedSubject: string;
  adjustedMinutes: number;
}

export interface RecoveryProposal {
  id: string;
  title: string;
  reason: string;
  backlogCount: number;
  overdueMinutes: number;
  strategy: RecoveryStrategy;
  proposedChanges: ProposedPlanAdjustment[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface RevisionHealthSummary {
  dueTodayCount: number;
  overdueCount: number;
  upcomingCount: number;
  completedCyclesCount: number;
  retentionFreshnessPercent: number;
  urgentItems: RevisionItem[];
  recoveryProposal?: RecoveryProposal | null;
}
