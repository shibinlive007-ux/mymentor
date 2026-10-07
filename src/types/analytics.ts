/**
 * Analytics, Progress Rollups & Weekly Review Types
 */

export type SubjectBalanceStatus = 'balanced' | 'over_indexed' | 'neglected';

export interface SubjectBalanceMetric {
  subjectId: string;
  subjectName: string;
  stage: 'prelims' | 'csat' | 'mains' | 'optional';
  actualHours: number;
  percentageOfTotal: number;
  status: SubjectBalanceStatus;
  statusMessage?: string;
}

export interface StageProgressSummary {
  stage: 'prelims' | 'csat' | 'mains' | 'optional';
  title: string;
  subtitle: string;
  completionPercentage: number;
  completedHours: number;
  totalEstimatedHours: number;
  topicsCompletedCount: number;
  topicsTotalCount: number;
}

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue...
  hours: number;
  sessionsCount: number;
  level: 0 | 1 | 2 | 3; // 0=none, 1=1-3h, 2=4-6h, 3=7h+
}

export interface PyqTrackingSummary {
  prelimsMcqsSolvedThisWeek: number;
  prelimsMcqsSolvedTotal: number;
  prelimsMcqsTarget: number;
  mainsAnswersThisWeek: number;
  mainsAnswersTotal: number;
  mainsAnswersTarget: number;
}

export interface WeeklyReviewSummary {
  id: string;
  weekLabel: string;
  plannedHours: number;
  actualHours: number;
  consistencyPercent: number;
  streakDays: number;
  pyqsCompleted: number;
  mainsAnswersWritten: number;
  highlights: string[];
  bottlenecks: string[];
  strategicRecommendations: string[];
  createdAt: string;
}
