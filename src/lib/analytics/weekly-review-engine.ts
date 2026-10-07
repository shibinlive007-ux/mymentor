/**
 * Weekly Review & Strategic Analytics Engine
 *
 * Implements:
 * 1. 35% subject weekly cap guardrails and neglected subject alerts
 * 2. Stage-wise syllabus progress rollups (Prelims, CSAT, Mains, Optional)
 * 3. 30-day consistency heatmap data generation
 * 4. Grounded, authentic weekly strategic mentor reviews
 */

import {
  SubjectBalanceMetric,
  StageProgressSummary,
  DailyActivityRecord,
  WeeklyReviewSummary,
  PyqTrackingSummary,
} from '@/types/analytics';
import { SubtopicUserProgress } from '@/types/syllabus';
import { StudySession } from '@/types/session';
import { PRELIMS_SUBJECTS_SEED } from '@/data/prelims-seed';
import { MAINS_SUBJECTS_SEED } from '@/data/mains-seed';
import { OPTIONALS_SUBJECTS_SEED } from '@/data/optionals-seed';
import { getDefaultSubtopicProgress } from '@/lib/syllabus/rollup-engine';
import { calculateStageRollups, calculateSubjectRollups } from '@/lib/completion';

export const WEEKLY_SUBJECT_CAP_PERCENT = 35;

export interface SubjectHourInput {
  subjectId: string;
  subjectName: string;
  stage: 'prelims' | 'csat' | 'mains' | 'optional';
  actualHours: number;
}

/**
 * Evaluates subject balance against the 35% weekly cap guardrail
 */
export function computeSubjectBalance(
  subjectHours: SubjectHourInput[],
  totalWeeklyHours: number
): SubjectBalanceMetric[] {
  const safeTotal = Math.max(totalWeeklyHours, 1);

  return subjectHours.map((item) => {
    const percentageOfTotal = Math.round((item.actualHours / safeTotal) * 100);

    if (item.actualHours > 0 && percentageOfTotal > WEEKLY_SUBJECT_CAP_PERCENT) {
      return {
        ...item,
        percentageOfTotal,
        status: 'over_indexed',
        statusMessage: `${item.subjectName} takes ${percentageOfTotal}% of weekly hours (cap is 35%). Rebalance to prevent neglected papers.`,
      };
    }

    if (item.actualHours === 0) {
      return {
        ...item,
        percentageOfTotal: 0,
        status: 'neglected',
        statusMessage: `No study logged for ${item.subjectName} this week. Schedule a 45-min foundational slot.`,
      };
    }

    return {
      ...item,
      percentageOfTotal,
      status: 'balanced',
      statusMessage: `Healthy allocation (${percentageOfTotal}% of total).`,
    };
  });
}

/**
 * Computes syllabus progress rolled up across stages (Prelims GS1, CSAT, Mains GS, Optional)
 * Powered by unified @/lib/completion.ts
 */
export function computeStageRollups(
  progressMap: Record<string, SubtopicUserProgress>,
  selectedOptional?: string | null,
  sessions: StudySession[] = []
): StageProgressSummary[] {
  const allSeedSubjects = [
    ...PRELIMS_SUBJECTS_SEED,
    ...MAINS_SUBJECTS_SEED,
    ...OPTIONALS_SUBJECTS_SEED,
  ];

  const rollups = calculateStageRollups(allSeedSubjects, progressMap, selectedOptional);
  const subjectRollups = calculateSubjectRollups(allSeedSubjects, progressMap, sessions);

  const getCompletedHours = (stage: 'prelims' | 'csat' | 'mains' | 'optional') => {
    return Math.round(
      subjectRollups
        .filter((s) => s.stage === stage)
        .reduce((sum, s) => sum + s.completedStudyHours, 0) * 10
    ) / 10;
  };

  const getTotalHours = (stage: 'prelims' | 'csat' | 'mains' | 'optional') => {
    return subjectRollups
      .filter((s) => s.stage === stage)
      .reduce((sum, s) => sum + s.estimatedStudyHours, 0);
  };

  const prelimsSummary: StageProgressSummary = {
    stage: 'prelims',
    title: 'Prelims GS-I',
    subtitle: 'History, Polity, Geography, Economy, Env',
    completionPercentage: rollups.prelims.percentage,
    completedHours: getCompletedHours('prelims'),
    totalEstimatedHours: getTotalHours('prelims'),
    topicsCompletedCount: rollups.prelims.coveredTopics,
    topicsTotalCount: rollups.prelims.totalTopics,
  };

  const csatSummary: StageProgressSummary = {
    stage: 'csat',
    title: 'CSAT (Paper II)',
    subtitle: 'Reasoning, Quant & Reading Comprehension',
    completionPercentage: rollups.csat.percentage,
    completedHours: getCompletedHours('csat'),
    totalEstimatedHours: getTotalHours('csat'),
    topicsCompletedCount: rollups.csat.coveredTopics,
    topicsTotalCount: rollups.csat.totalTopics,
  };

  const mainsSummary: StageProgressSummary = {
    stage: 'mains',
    title: 'Mains GS (I-IV)',
    subtitle: 'Heritage, Governance, Economy, Ethics',
    completionPercentage: rollups.mains.percentage,
    completedHours: getCompletedHours('mains'),
    totalEstimatedHours: getTotalHours('mains'),
    topicsCompletedCount: rollups.mains.coveredTopics,
    topicsTotalCount: rollups.mains.totalTopics,
  };

  const optionalSummary: StageProgressSummary = {
    stage: 'optional',
    title: selectedOptional ? `Optional (${selectedOptional})` : 'Optional Subject',
    subtitle: 'Papers I & II Deep Conceptual Mastery',
    completionPercentage: rollups.optional.percentage,
    completedHours: getCompletedHours('optional'),
    totalEstimatedHours: getTotalHours('optional'),
    topicsCompletedCount: rollups.optional.coveredTopics,
    topicsTotalCount: rollups.optional.totalTopics,
  };

  return [prelimsSummary, csatSummary, mainsSummary, optionalSummary];
}

/**
 * Generates a 30-day activity record grid for consistency heatmaps
 */
export function generate30DayActivityGrid(
  sessions: StudySession[],
  anchorDate: Date = new Date()
): DailyActivityRecord[] {
  const records: DailyActivityRecord[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[d.getDay()];

    const matching = sessions.filter((s) => s.startedAt && s.startedAt.startsWith(dateStr));
    const totalMinutes = matching.reduce((sum, s) => sum + s.durationMinutes, 0);
    const hours = Math.round((totalMinutes / 60) * 10) / 10;
    const count = matching.length;

    let level: 0 | 1 | 2 | 3 = 0;
    if (hours >= 7.0) level = 3;
    else if (hours >= 4.0) level = 2;
    else if (hours > 0) level = 1;

    records.push({
      date: dateStr,
      dayLabel,
      hours,
      sessionsCount: count,
      level,
    });
  }

  return records;
}

/**
 * Generates grounded, strategic weekly review
 */
export interface GenerateWeeklyReviewOptions {
  plannedHours: number;
  actualHours: number;
  streakDays: number;
  subjectBalances: SubjectBalanceMetric[];
  pyqSummary: PyqTrackingSummary;
}

export function generateStrategicWeeklyReview({
  plannedHours,
  actualHours,
  streakDays,
  subjectBalances,
  pyqSummary,
}: GenerateWeeklyReviewOptions): WeeklyReviewSummary {
  const consistencyPercent = plannedHours > 0 ? Math.min(100, Math.round((actualHours / plannedHours) * 100)) : 100;

  const highlights: string[] = [];
  const bottlenecks: string[] = [];
  const strategicRecommendations: string[] = [];

  // Highlights
  if (consistencyPercent >= 85) {
    highlights.push(
      `Outstanding focus consistency: Completed ${actualHours.toFixed(1)} hrs of study (${consistencyPercent}% of target).`
    );
  } else {
    highlights.push(
      `Steady baseline maintained: Logged ${actualHours.toFixed(1)} productive study hours despite schedule disruptions.`
    );
  }

  if (streakDays >= 7) {
    highlights.push(`Sustained a strong ${streakDays}-day active learning streak without breaking rhythm.`);
  }

  if (pyqSummary.prelimsMcqsSolvedThisWeek >= 30) {
    highlights.push(`Solved ${pyqSummary.prelimsMcqsSolvedThisWeek} Prelims MCQs and consolidated tricky options.`);
  }

  // Bottlenecks
  const overIndexed = subjectBalances.find((s) => s.status === 'over_indexed');
  if (overIndexed) {
    bottlenecks.push(
      `${overIndexed.subjectName} absorbed ${overIndexed.percentageOfTotal}% of study hours, exceeding the 35% weekly balance limit.`
    );
  }

  const neglected = subjectBalances.find((s) => s.status === 'neglected');
  if (neglected) {
    bottlenecks.push(
      `${neglected.subjectName} had 0 hours logged this week, creating an avoidable retention lag.`
    );
  }

  if (consistencyPercent < 75) {
    bottlenecks.push('Weekday fatigue caused an accumulation of uncompleted study sessions towards evening.');
  }

  // Recommendations
  if (overIndexed) {
    strategicRecommendations.push(
      `Cap ${overIndexed.subjectName} at 25-30% next week to free bandwidth for neglected areas.`
    );
  }

  if (neglected) {
    strategicRecommendations.push(
      `Schedule a dedicated 45-minute foundational session for ${neglected.subjectName} on Tuesday morning.`
    );
  } else {
    strategicRecommendations.push('Maintain even distribution between static syllabus reading and active revision.');
  }

  strategicRecommendations.push(
    `Target ${Math.min(pyqSummary.prelimsMcqsTarget, pyqSummary.prelimsMcqsSolvedThisWeek + 20)} Prelims PYQs with timed 15-minute drills.`
  );

  return {
    id: `rev-week-${Date.now()}`,
    weekLabel: 'Week of Oct 1 - Oct 7',
    plannedHours,
    actualHours,
    consistencyPercent,
    streakDays,
    pyqsCompleted: pyqSummary.prelimsMcqsSolvedThisWeek,
    mainsAnswersWritten: pyqSummary.mainsAnswersThisWeek,
    highlights,
    bottlenecks: bottlenecks.length > 0 ? bottlenecks : ['No major imbalances detected this week.'],
    strategicRecommendations,
    createdAt: new Date().toISOString(),
  };
}
