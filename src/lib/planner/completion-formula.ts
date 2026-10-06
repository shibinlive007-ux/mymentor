/**
 * Configurable weights for UPSC Syllabus Completion Formula
 * Default:
 * - NCERT read: 15%
 * - Standard textbook read: 25%
 * - Coaching / Notes made: 10%
 * - Current affairs linked: 10%
 * - PYQs solved & practice: 20%
 * - Spaced revisions done (capped at 3): 20%
 * Total = 100%
 */

export interface CompletionWeights {
  ncert: number;
  standardBook: number;
  notesOrClass: number;
  currentAffairs: number;
  pyqPractice: number;
  revisions: number;
  maxRevisionCount: number;
}

export const DEFAULT_COMPLETION_WEIGHTS: CompletionWeights = {
  ncert: 15,
  standardBook: 25,
  notesOrClass: 10,
  currentAffairs: 10,
  pyqPractice: 20,
  revisions: 20,
  maxRevisionCount: 3,
};

export interface SubtopicProgressInput {
  ncertRead: boolean;
  standardBookRead: boolean;
  notesMadeOrClassAttended: boolean;
  currentAffairsLinked: boolean;
  pyqPracticeDone: boolean;
  revisionCount: number;
}

/**
 * Calculates subtopic completion percentage based on configurable weights
 */
export function calculateSubtopicCompletion(
  progress: SubtopicProgressInput,
  weights: CompletionWeights = DEFAULT_COMPLETION_WEIGHTS
): number {
  let score = 0;

  if (progress.ncertRead) {
    score += weights.ncert;
  }

  if (progress.standardBookRead) {
    score += weights.standardBook;
  }

  if (progress.notesMadeOrClassAttended) {
    score += weights.notesOrClass;
  }

  if (progress.currentAffairsLinked) {
    score += weights.currentAffairs;
  }

  if (progress.pyqPracticeDone) {
    score += weights.pyqPractice;
  }

  const effectiveRevisions = Math.min(progress.revisionCount, weights.maxRevisionCount);
  const revisionFraction = effectiveRevisions / weights.maxRevisionCount;
  score += revisionFraction * weights.revisions;

  return Math.min(100, Math.round(score * 10) / 10);
}

export interface WeightedChildNode {
  completionPercentage: number;
  weight?: number;
}

/**
 * Rolls up child nodes (e.g. subtopics -> topic, topics -> subject, subjects -> paper)
 * weighted by each child's importance weight.
 */
export function calculateWeightedRollup(nodes: WeightedChildNode[]): number {
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
