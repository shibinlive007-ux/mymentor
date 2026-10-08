/**
 * Single Source of Truth for UPSC CSE Syllabus Completion & Study Hours
 *
 * Implements weighted rollups:
 * Subtopic % -> Topic % -> Subject % -> Paper % -> Overall %
 *
 * Default weights from config:
 * - NCERT: 15%
 * - Standard Textbook: 25%
 * - Class / Notes: 10%
 * - Current Affairs: 10%
 * - PYQ / Practice: 20%
 * - Revisions (capped at 3): 20%
 * Total = 100%
 */

import { COMPLETION_WEIGHTS, CompletionWeightsConfig } from '@/config/planner-config';
import { SubjectNode, SubtopicUserProgress, SubjectRollup } from '@/types/syllabus';
import { StudySession } from '@/types/session';

export interface SubtopicInput {
  ncertRead?: boolean;
  standardBookRead?: boolean;
  notesMade?: boolean;
  coachingAttended?: boolean;
  currentAffairsLinked?: boolean;
  pyqPracticeDone?: boolean;
  mcqPracticeDone?: boolean;
  pyqSolvedCount?: number;
  revisionCount?: number;
}

/**
 * Calculates completion percentage for a single subtopic
 */
export function calculateSubtopicCompletion(
  progress: SubtopicInput,
  weights: CompletionWeightsConfig = COMPLETION_WEIGHTS
): number {
  let score = 0;

  if (progress.ncertRead) {
    score += weights.ncert;
  }

  if (progress.standardBookRead) {
    score += weights.standardBook;
  }

  if (progress.notesMade || progress.coachingAttended) {
    score += weights.notesOrClass;
  }

  if (progress.currentAffairsLinked) {
    score += weights.currentAffairs;
  }

  if (progress.pyqPracticeDone || progress.mcqPracticeDone || (progress.pyqSolvedCount && progress.pyqSolvedCount > 0)) {
    score += weights.pyqPractice;
  }

  const effectiveRevisions = Math.min(progress.revisionCount || 0, weights.maxRevisionCount);
  const revisionFraction = effectiveRevisions / weights.maxRevisionCount;
  score += revisionFraction * weights.revisions;

  return Math.min(100, Math.round(score * 10) / 10);
}

export interface WeightedNode {
  completionPercentage: number;
  weight?: number;
}

/**
 * Rolls up child node percentages into parent percentage weighted by node importance
 */
export function calculateWeightedRollup(nodes: WeightedNode[]): number {
  if (!nodes || nodes.length === 0) return 0;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const node of nodes) {
    const w = node.weight && node.weight > 0 ? node.weight : 1.0;
    totalWeightedScore += node.completionPercentage * w;
    totalWeight += w;
  }

  if (totalWeight === 0) return 0;

  const rolledUp = totalWeightedScore / totalWeight;
  return Math.min(100, Math.round(rolledUp * 10) / 10);
}

/**
 * Aggregates actual logged study hours from study_sessions by subject and subtopic
 */
export function aggregateLoggedHours(sessions: StudySession[] = []) {
  const bySubject: Record<string, number> = {};
  const bySubtopic: Record<string, number> = {};

  for (const s of sessions) {
    const hours = (s.durationMinutes || 0) / 60;
    if (s.subjectId) {
      bySubject[s.subjectId] = (bySubject[s.subjectId] || 0) + hours;
    }
    if (s.subjectName) {
      bySubject[s.subjectName] = (bySubject[s.subjectName] || 0) + hours;
    }
    if (s.subtopicId) {
      bySubtopic[s.subtopicId] = (bySubtopic[s.subtopicId] || 0) + hours;
    }
  }

  return { bySubject, bySubtopic };
}

/**
 * Generates subject rollups and links logged study hours directly to subtopics & subjects
 */
export function calculateSubjectRollups(
  subjects: SubjectNode[],
  progressMap: Record<string, SubtopicUserProgress> = {},
  sessions: StudySession[] = []
): SubjectRollup[] {
  const { bySubject, bySubtopic } = aggregateLoggedHours(sessions);

  return subjects.map((subject) => {
    let totalSubtopics = 0;

    const topicRollups = subject.topics.map((topic) => {
      totalSubtopics += topic.subtopics.length;

      const subtopicRollupList = topic.subtopics.map((sub) => {
        const p = progressMap[sub.id];
        const pct = p
          ? (typeof p.completionPercentage === 'number' && p.completionPercentage > 0
              ? p.completionPercentage
              : calculateSubtopicCompletion({
                  ncertRead: p.ncertRead,
                  standardBookRead: p.standardBookRead,
                  notesMade: p.notesMade,
                  coachingAttended: p.coachingAttended,
                  currentAffairsLinked: p.currentAffairsLinked,
                  pyqPracticeDone: p.mcqPracticeDone || (p.pyqSolvedCount !== undefined && p.pyqSolvedCount > 0),
                  revisionCount: p.revisionCount,
                }))
          : 0;

        return {
          completionPercentage: pct,
          weight: sub.weight || 1.0,
          loggedHours: bySubtopic[sub.id] || 0,
        };
      });

      const topicPercentage = calculateWeightedRollup(subtopicRollupList);
      const completedCount = subtopicRollupList.filter((s) => s.completionPercentage >= 70).length;

      return {
        topicId: topic.id,
        title: topic.title,
        subtopicsCount: topic.subtopics.length,
        completedSubtopicsCount: completedCount,
        completionPercentage: topicPercentage,
      };
    });

    const subjectWeightedList = subject.topics.map((topic, i) => ({
      completionPercentage: topicRollups[i].completionPercentage,
      weight: 1.0,
    }));

    const subjectPercentage = calculateWeightedRollup(subjectWeightedList);

    // Actual hours logged from study sessions if available, else proportional estimate
    const loggedSubjectHours = bySubject[subject.id] || bySubject[subject.subject] || 0;
    const completedHours =
      loggedSubjectHours > 0
        ? Math.round(loggedSubjectHours * 10) / 10
        : Math.round(((subjectPercentage / 100) * subject.estimated_study_hours) * 10) / 10;

    return {
      subjectId: subject.id,
      name: subject.subject,
      paper: subject.paper,
      stage: subject.stage,
      totalTopics: subject.topics.length,
      totalSubtopics,
      completionPercentage: subjectPercentage,
      estimatedStudyHours: subject.estimated_study_hours,
      completedStudyHours: completedHours,
      topics: topicRollups,
    };
  });
}

export interface StageRollupsResult {
  prelims: { percentage: number; coveredTopics: number; totalTopics: number };
  csat: { percentage: number; coveredTopics: number; totalTopics: number };
  mains: { percentage: number; coveredTopics: number; totalTopics: number };
  optional: { percentage: number; coveredTopics: number; totalTopics: number; name?: string };
  overall: { percentage: number; coveredTopics: number; totalTopics: number };
}

/**
 * Filters syllabus subjects to only include the user's selected optional subject
 */
export function filterUserSyllabusSubjects(
  allSubjects: SubjectNode[],
  selectedOptional?: string | null
): SubjectNode[] {
  return allSubjects.filter((s) => {
    if (s.stage !== 'optional') return true;
    if (!selectedOptional) return true; // if not set, include available
    const optLower = selectedOptional.toLowerCase().trim();
    const optCodeLower = (s.optional_code || '').toLowerCase().trim();
    return (
      s.subject.toLowerCase().includes(optLower) ||
      s.id.toLowerCase().includes(optLower) ||
      (optCodeLower !== '' && (optLower.includes(optCodeLower) || optCodeLower.includes(optLower)))
    );
  });
}

/**
 * Computes stage rollups for Prelims, CSAT, Mains, Optional, and Overall
 * Ensures only the user's selected optional subject is included in totals
 */
export function calculateStageRollups(
  allSubjects: SubjectNode[],
  progressMap: Record<string, SubtopicUserProgress> = {},
  selectedOptional?: string | null
): StageRollupsResult {
  const filteredSubjects = filterUserSyllabusSubjects(allSubjects, selectedOptional);
  const rollups = calculateSubjectRollups(filteredSubjects, progressMap);

  const getStageStats = (stage: 'prelims' | 'csat' | 'mains' | 'optional') => {
    const stageItems = rollups.filter((r) => r.stage === stage);
    if (stageItems.length === 0) return { percentage: 0, coveredTopics: 0, totalTopics: 0 };

    const totalTopics = stageItems.reduce((sum, r) => sum + r.totalTopics, 0);
    const coveredTopics = stageItems.reduce(
      (sum, r) => sum + r.topics.filter((t) => t.completionPercentage >= 70).length,
      0
    );

    const weightedList = stageItems.map((r) => ({
      completionPercentage: r.completionPercentage,
      weight: r.estimatedStudyHours || 1.0,
    }));

    return {
      percentage: calculateWeightedRollup(weightedList),
      coveredTopics,
      totalTopics,
    };
  };

  const prelims = getStageStats('prelims');
  const csat = getStageStats('csat');
  const mains = getStageStats('mains');
  const optional = getStageStats('optional');

  // Overall is the weighted rollup across Prelims, CSAT, Mains, and Optional
  const overallWeighted = [
    { completionPercentage: prelims.percentage, weight: 2.0 },
    { completionPercentage: csat.percentage, weight: 1.0 },
    { completionPercentage: mains.percentage, weight: 3.5 },
    { completionPercentage: optional.percentage, weight: 2.5 },
  ];

  const totalTopics = prelims.totalTopics + csat.totalTopics + mains.totalTopics + optional.totalTopics;
  const coveredTopics = prelims.coveredTopics + csat.coveredTopics + mains.coveredTopics + optional.coveredTopics;

  return {
    prelims,
    csat,
    mains,
    optional: { ...optional, name: selectedOptional || undefined },
    overall: {
      percentage: calculateWeightedRollup(overallWeighted),
      coveredTopics,
      totalTopics,
    },
  };
}
