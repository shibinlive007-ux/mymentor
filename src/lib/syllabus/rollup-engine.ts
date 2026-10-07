/**
 * Syllabus Rollup Engine
 * Delegates to single source of truth in @/lib/completion.ts
 */

import type { SubjectNode, SubtopicUserProgress, SubjectRollup } from '@/types/syllabus';
import {
  calculateSubtopicCompletion as calcSubtopic,
  calculateSubjectRollups as calcSubjectRollups,
  calculateWeightedRollup
} from '@/lib/completion';

export { calculateWeightedRollup } from '@/lib/completion';

export function getDefaultSubtopicProgress(subtopicId: string): SubtopicUserProgress {
  return {
    subtopicId,
    ncertRead: false,
    standardBookRead: false,
    standardBookName: '',
    coachingAttended: false,
    extraSources: '',
    notesMade: false,
    currentAffairsLinked: false,
    pyqSolvedCount: 0,
    mcqPracticeDone: false,
    revisionCount: 0,
    lastRevisedAt: null,
    confidenceScore: 1,
    completionPercentage: 0,
  };
}

export function computeSubtopicProgress(
  current: SubtopicUserProgress,
  updates: Partial<SubtopicUserProgress>
): SubtopicUserProgress {
  const merged: SubtopicUserProgress = { ...current, ...updates };

  const pct = calcSubtopic({
    ncertRead: merged.ncertRead,
    standardBookRead: merged.standardBookRead,
    notesMade: merged.notesMade,
    coachingAttended: merged.coachingAttended,
    currentAffairsLinked: merged.currentAffairsLinked,
    pyqPracticeDone: merged.mcqPracticeDone || merged.pyqSolvedCount > 0,
    revisionCount: merged.revisionCount,
  });

  return {
    ...merged,
    completionPercentage: pct,
  };
}

export function calculateSubjectRollups(
  subjects: SubjectNode[],
  progressMap: Record<string, SubtopicUserProgress>
): SubjectRollup[] {
  return calcSubjectRollups(subjects, progressMap);
}
