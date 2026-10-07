/**
 * Spaced Repetition Revision Manager Engine
 *
 * Tracks retention cycles across 1, 7, 21, and 45 days.
 * Surfaces urgent revisions, calculates retention freshness,
 * and triggers human-in-the-loop recovery proposals when backlogs exceed threshold.
 */

import { SubtopicUserProgress } from '@/types/syllabus';
import { RevisionItem, RevisionHealthSummary, RevisionStatus } from '@/types/revision';
import { ALL_SYLLABUS_SUBJECTS } from '@/lib/syllabus/seed-loader';
import { evaluateRevisionHealth, DEFAULT_REVISION_INTERVALS_DAYS } from '@/lib/planner/spaced-repetition';
import { generateRecoveryProposal } from './recovery-planner';
import { computeSubtopicProgress } from '@/lib/syllabus/rollup-engine';

export interface RevisionEngineOptions {
  progressMap: Record<string, SubtopicUserProgress>;
  examMode?: 'prelims' | 'mains' | 'combined';
  currentDate?: Date;
  backlogThreshold?: number; // default 3 overdue items triggers recovery proposal
}

export function getAllRevisionItems(options: RevisionEngineOptions): RevisionItem[] {
  const { progressMap, examMode = 'combined', currentDate = new Date() } = options;

  const relevantSubjects = ALL_SYLLABUS_SUBJECTS.filter((s) => {
    if (examMode === 'prelims') return s.stage === 'prelims' || s.stage === 'csat';
    if (examMode === 'mains') return s.stage === 'mains';
    return true;
  });

  const items: RevisionItem[] = [];

  for (const subject of relevantSubjects) {
    for (const topic of subject.topics) {
      for (const sub of topic.subtopics) {
        const prog = progressMap[sub.id];
        // Topic qualifies for revision tracking if standard book or NCERT has been completed
        if (prog && (prog.standardBookRead || prog.ncertRead)) {
          const revCount = prog.revisionCount || 0;

          if (revCount >= 3) {
            items.push({
              id: `rev-${sub.id}`,
              subtopicId: sub.id,
              subtopicTitle: sub.title,
              subjectId: subject.id,
              subjectName: subject.subject,
              topicId: topic.id,
              topicTitle: topic.title,
              stageNumber: 4,
              scheduledDate: prog.lastRevisedAt ? prog.lastRevisedAt.split('T')[0] : '',
              dueDate: '',
              status: 'completed',
              daysOverdue: 0,
              confidenceScore: prog.confidenceScore || 4,
              weight: sub.weight,
              lastRevisedAt: prog.lastRevisedAt,
            });
          } else {
            const intervalDays = DEFAULT_REVISION_INTERVALS_DAYS[revCount] || 45;
            const baseDate = prog.lastRevisedAt ? new Date(prog.lastRevisedAt) : new Date(currentDate);
            const dueDate = new Date(baseDate);
            dueDate.setDate(dueDate.getDate() + intervalDays);

            const health = evaluateRevisionHealth(dueDate, currentDate);
            const status: RevisionStatus = health.status === 'due_today'
              ? 'due_today'
              : health.status === 'overdue'
              ? 'overdue'
              : 'upcoming';

            items.push({
              id: `rev-${sub.id}`,
              subtopicId: sub.id,
              subtopicTitle: sub.title,
              subjectId: subject.id,
              subjectName: subject.subject,
              topicId: topic.id,
              topicTitle: topic.title,
              stageNumber: revCount + 1,
              scheduledDate: baseDate.toISOString().split('T')[0],
              dueDate: dueDate.toISOString().split('T')[0],
              status,
              daysOverdue: health.daysOverdue,
              confidenceScore: prog.confidenceScore || 3,
              weight: sub.weight,
              lastRevisedAt: prog.lastRevisedAt,
            });
          }
        }
      }
    }
  }

  return items;
}

export function getRevisionHealthSummary(options: RevisionEngineOptions): RevisionHealthSummary {
  const { backlogThreshold = 3 } = options;
  const items = getAllRevisionItems(options);

  const dueToday = items.filter((i) => i.status === 'due_today');
  const overdue = items.filter((i) => i.status === 'overdue');
  const upcoming = items.filter((i) => i.status === 'upcoming');
  const completed = items.filter((i) => i.status === 'completed');

  // Sort urgent items: overdue (descending by days overdue), then due today
  const urgentItems = [
    ...overdue.sort((a, b) => b.daysOverdue - a.daysOverdue),
    ...dueToday,
  ];

  // Retention freshness score (% of studied material currently not overdue)
  const totalTracked = items.length;
  const retentionFreshnessPercent =
    totalTracked > 0
      ? Math.round(((totalTracked - overdue.length) / totalTracked) * 100)
      : 100;

  // Auto-generate recovery proposal if backlog exceeds threshold
  let recoveryProposal = null;
  if (overdue.length >= backlogThreshold) {
    recoveryProposal = generateRecoveryProposal({
      overdueItems: overdue,
      preferredStrategy: 'redistribute_spread',
    });
  }

  return {
    dueTodayCount: dueToday.length,
    overdueCount: overdue.length,
    upcomingCount: upcoming.length,
    completedCyclesCount: completed.length,
    retentionFreshnessPercent,
    urgentItems,
    recoveryProposal,
  };
}

export function incrementSubtopicRevision(
  progressMap: Record<string, SubtopicUserProgress>,
  subtopicId: string,
  newConfidence?: number
): Record<string, SubtopicUserProgress> {
  const current = progressMap[subtopicId];
  if (!current) return progressMap;

  const nextRevCount = Math.min(3, (current.revisionCount || 0) + 1);
  const updatedProgress = computeSubtopicProgress(current, {
    revisionCount: nextRevCount,
    lastRevisedAt: new Date().toISOString(),
    confidenceScore: newConfidence !== undefined ? newConfidence : current.confidenceScore,
  });

  const nextMap = {
    ...progressMap,
    [subtopicId]: updatedProgress,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('upsc_syllabus_progress', JSON.stringify(nextMap));
  }

  return nextMap;
}
