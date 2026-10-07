/**
 * Types for My Mentor Conversational Strategy Engine
 */

export interface MentorCitation {
  label: string;
  paper?: string;
  sourceNote?: string;
}

export type MentorProposalActionType =
  | 'minimum_viable_day'
  | 'lighten_day'
  | 'add_ethics_slot'
  | 'add_revision_slot'
  | 'weekend_buffer';

export interface MentorPlanProposal {
  id: string;
  title: string;
  reason: string;
  actionType: MentorProposalActionType;
  status: 'pending' | 'accepted' | 'rejected';
  adjustedMinutes?: number;
}

export interface MentorMessage {
  id: string;
  sender: 'mentor' | 'user';
  text: string;
  timestamp: string;
  citations?: MentorCitation[];
  proposal?: MentorPlanProposal;
}

export interface MentorUserContext {
  fullName: string;
  examMode: 'prelims' | 'mains' | 'combined';
  streakDays: number;
  overdueCount: number;
  retentionPercent: number;
  overIndexedSubject?: string;
  neglectedSubject?: string;
}
