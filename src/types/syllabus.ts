export interface SubtopicNode {
  id: string;
  title: string;
  weight: number;
  estimated_hours: number;
}

export interface TopicNode {
  id: string;
  title: string;
  subtopics: SubtopicNode[];
}

export interface SubjectNode {
  id: string;
  paper: string;
  stage: 'prelims' | 'mains' | 'csat' | 'optional';
  subject: string;
  node_type: 'subject';
  weight: number;
  estimated_study_hours: number;
  order_index: number;
  optional_code?: string;
  topics: TopicNode[];
}

export interface SubtopicUserProgress {
  subtopicId: string;
  ncertRead: boolean;
  standardBookRead: boolean;
  standardBookName: string;
  coachingAttended: boolean;
  extraSources: string;
  notesMade: boolean;
  currentAffairsLinked: boolean;
  pyqSolvedCount: number;
  mcqPracticeDone: boolean;
  revisionCount: number;
  lastRevisedAt: string | null;
  confidenceScore: number; // 1 to 5
  completionPercentage: number;
}

export interface TopicRollup {
  topicId: string;
  title: string;
  subtopicsCount: number;
  completedSubtopicsCount: number;
  completionPercentage: number;
}

export interface SubjectRollup {
  subjectId: string;
  name: string;
  paper: string;
  stage: 'prelims' | 'mains' | 'csat' | 'optional';
  totalTopics: number;
  totalSubtopics: number;
  completionPercentage: number;
  estimatedStudyHours: number;
  completedStudyHours: number;
  topics: TopicRollup[];
}
