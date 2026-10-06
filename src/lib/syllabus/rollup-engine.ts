import type { SubjectNode, SubtopicUserProgress, SubjectRollup } from '@/types/syllabus';
import { calculateSubtopicCompletion, calculateWeightedRollup } from '@/lib/planner/completion-formula';

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

  const pct = calculateSubtopicCompletion({
    ncertRead: merged.ncertRead,
    standardBookRead: merged.standardBookRead,
    notesMadeOrClassAttended: merged.notesMade || merged.coachingAttended,
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
  return subjects.map((subject) => {
    let totalSubtopics = 0;
    const topicRollups = subject.topics.map((topic) => {
      totalSubtopics += topic.subtopics.length;

      const subtopicRollupList = topic.subtopics.map((sub) => {
        const p = progressMap[sub.id] || getDefaultSubtopicProgress(sub.id);
        return {
          completionPercentage: p.completionPercentage,
          weight: sub.weight,
        };
      });

      const topicPercentage = calculateWeightedRollup(subtopicRollupList);
      const completedCount = topic.subtopics.filter((sub) => {
        const p = progressMap[sub.id];
        return p && p.completionPercentage >= 70;
      }).length;

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
    const completedHours = Math.round(((subjectPercentage / 100) * subject.estimated_study_hours) * 10) / 10;

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
