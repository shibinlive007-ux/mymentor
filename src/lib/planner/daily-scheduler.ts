/**
 * Deterministic Daily Planner Engine for UPSC 2027 AI Mentor
 *
 * Implements strict, mathematically sound scheduling rules:
 * - Spaced repetition priority (due revisions at 1, 7, 21, 45 days)
 * - 35% weekly subject cap guardrail
 * - Anti-stuck warning (>5 days on same subject)
 * - Anti-burnout "Minimum Viable Day" mode on low energy or tight time
 * - Guaranteed daily Current Affairs slot
 * - Mains answer writing / mock test integration
 */

import { CheckinInput, DailyPlan, PlannerTask } from '@/types/planner';
import { SubtopicUserProgress } from '@/types/syllabus';
import { determineDayCapacity, checkSubjectWeeklyCap, checkStuckOnSubject } from './rules';
import { evaluateRevisionHealth } from './spaced-repetition';
import { ALL_SYLLABUS_SUBJECTS } from '@/lib/syllabus/seed-loader';

export interface GeneratePlanOptions {
  checkin: CheckinInput;
  examMode: 'prelims' | 'mains' | 'combined';
  progressMap?: Record<string, SubtopicUserProgress>;
  recentSubjectHours?: Record<string, number>;
  consecutiveDaysOnSubject?: Record<string, number>;
  dateString?: string;
}

/**
 * Deterministically generates today's daily plan based on candidate syllabus items,
 * spaced repetition queue, and the user's morning check-in state.
 */
export function generateDailyPlan(options: GeneratePlanOptions): DailyPlan {
  const {
    checkin,
    examMode,
    progressMap = {},
    recentSubjectHours = {},
    consecutiveDaysOnSubject = {},
    dateString = new Date().toISOString().split('T')[0],
  } = options;

  // 1. Capacity & Fatigue Evaluation
  const hasDisruptions = checkin.disruptions.length > 0 && !checkin.disruptions.includes('free_day');
  const capacity = determineDayCapacity({
    energyMood: checkin.energyMood,
    availableHours: checkin.availableHours,
    hasDisruptions,
  });

  const isMVD = capacity.isMinimumViableDay;
  const targetMinutes = Math.round(capacity.targetHours * 60);

  // 2. Identify Weekly Hours Total for Subject Cap Check
  const totalWeeklyHours = Object.values(recentSubjectHours).reduce((a, b) => a + b, 0);

  // Helper to check if subject is capped
  const isSubjectOverCap = (subjectName: string): boolean => {
    if (totalWeeklyHours < 10) return false; // Grace period before enforcing cap
    const subHours = recentSubjectHours[subjectName] || 0;
    const check = checkSubjectWeeklyCap(subHours, totalWeeklyHours);
    return check.isSubjectCapped;
  };

  // Helper to check if user has been stuck on subject
  const isSubjectStuck = (subjectName: string): boolean => {
    const days = consecutiveDaysOnSubject[subjectName] || 0;
    return checkStuckOnSubject(days);
  };

  // 3. Find Filtered Subjects matching current exam mode
  const availableSubjects = ALL_SYLLABUS_SUBJECTS.filter((s) => {
    if (examMode === 'prelims') return s.stage === 'prelims' || s.stage === 'csat';
    if (examMode === 'mains') return s.stage === 'mains';
    return true;
  });

  // 4. Collect Spaced Repetition Due Tasks
  interface CandidateRevision {
    subtopicId: string;
    subtopicTitle: string;
    topicId: string;
    topicTitle: string;
    subjectId: string;
    subjectName: string;
    status: 'due_today' | 'overdue' | 'upcoming';
    daysOverdue: number;
    revisionCount: number;
  }

  const dueRevisions: CandidateRevision[] = [];

  for (const subject of availableSubjects) {
    for (const topic of subject.topics) {
      for (const sub of topic.subtopics) {
        const prog = progressMap[sub.id];
        if (prog && prog.standardBookRead && prog.revisionCount < 3) {
          if (prog.lastRevisedAt) {
            const health = evaluateRevisionHealth(new Date(prog.lastRevisedAt));
            if (health.status === 'due_today' || health.status === 'overdue') {
              dueRevisions.push({
                subtopicId: sub.id,
                subtopicTitle: sub.title,
                topicId: topic.id,
                topicTitle: topic.title,
                subjectId: subject.id,
                subjectName: subject.subject,
                status: health.status,
                daysOverdue: health.daysOverdue,
                revisionCount: prog.revisionCount,
              });
            }
          }
        }
      }
    }
  }

  // Sort revisions: overdue first, then by days overdue descending
  dueRevisions.sort((a, b) => b.daysOverdue - a.daysOverdue);

  // 5. Build Tasks Array
  const tasks: PlannerTask[] = [];
  let allocatedMinutes = 0;
  let orderIndex = 1;

  // STAPLE 1: Scheduled Mock Test / Assignment (if user indicated test today)
  if (checkin.hasTestToday) {
    const testMinutes = isMVD ? 60 : 90;
    tasks.push({
      id: `task-${orderIndex}`,
      subjectId: 'mock-test',
      subjectName: 'Test Series',
      topicId: 'mock-eval',
      topicTitle: checkin.testName || 'Scheduled Practice Mock / Assignment',
      taskType: 'mock_test',
      durationMinutes: testMinutes,
      completedMinutes: 0,
      status: 'pending',
      reason: 'Scheduled test commitment noted in morning check-in',
      orderIndex: orderIndex++,
    });
    allocatedMinutes += testMinutes;
  }

  // STAPLE 2: High-Priority Due Revision (Always front-loaded for memory retention)
  const topRevision = dueRevisions.find((r) => !isSubjectOverCap(r.subjectName)) || dueRevisions[0];
  if (topRevision) {
    const revDuration = isMVD ? 45 : 60;
    const revReason =
      topRevision.status === 'overdue'
        ? `⚠️ Spaced revision is ${topRevision.daysOverdue} days overdue (Cycle #${topRevision.revisionCount + 1})`
        : `Spaced revision cycle #${topRevision.revisionCount + 1} scheduled for today`;

    tasks.push({
      id: `task-${orderIndex}`,
      subjectId: topRevision.subjectId,
      subjectName: topRevision.subjectName,
      topicId: topRevision.topicId,
      topicTitle: topRevision.topicTitle,
      subtopicId: topRevision.subtopicId,
      subtopicTitle: topRevision.subtopicTitle,
      taskType: 'revision',
      durationMinutes: revDuration,
      completedMinutes: 0,
      status: 'pending',
      reason: revReason,
      orderIndex: orderIndex++,
    });
    allocatedMinutes += revDuration;
  }

  // STAPLE 3: Daily Current Affairs (Mandatory UPSC Pillar)
  const caDuration = isMVD ? 30 : 45;
  tasks.push({
    id: `task-${orderIndex}`,
    subjectId: 'ca-daily',
    subjectName: 'Current Affairs',
    topicId: 'ca-editorials',
    topicTitle: 'The Hindu / Indian Express Editorials & Monthly Compendium Linkage',
    taskType: 'current_affairs',
    durationMinutes: caDuration,
    completedMinutes: 0,
    status: 'pending',
    reason: 'Daily GS2 & GS3 analytical current affairs linkage (consistency staple)',
    orderIndex: orderIndex++,
  });
  allocatedMinutes += caDuration;

  // If Minimum Viable Day: Stop here (or add 1 light task if room remains)
  if (isMVD) {
    // If under target by > 30 mins, add one light PYQ solve
    if (targetMinutes - allocatedMinutes >= 40) {
      tasks.push({
        id: `task-${orderIndex}`,
        subjectId: 'p-pol',
        subjectName: 'Polity & Governance',
        topicId: 'p-pol-t1',
        topicTitle: 'Quick 15-MCQ Drill on Constitutional Framework',
        taskType: 'pyq',
        durationMinutes: 30,
        completedMinutes: 0,
        status: 'pending',
        reason: 'Low cognitive load micro-drill to maintain daily problem-solving feel',
        orderIndex: orderIndex++,
      });
      allocatedMinutes += 30;
    }
  } else {
    // 6. Deep Work / New Study Slot for Standard & Heavy Days
    // Select eligible subjects that are not capped and not stuck
    const eligibleSubjects = availableSubjects.filter(
      (s) => !isSubjectOverCap(s.subject) && !isSubjectStuck(s.subject)
    );
    const candidateSubject = eligibleSubjects.length > 0 ? eligibleSubjects[0] : availableSubjects[0];

    // Find next uncompleted subtopic in candidate subject
    let nextStudyItem: { topicTitle: string; topicId: string; subtopicTitle: string; subtopicId: string } | null = null;

    if (candidateSubject && candidateSubject.topics.length > 0) {
      for (const t of candidateSubject.topics) {
        for (const st of t.subtopics) {
          const p = progressMap[st.id];
          if (!p || !p.standardBookRead) {
            nextStudyItem = {
              topicTitle: t.title,
              topicId: t.id,
              subtopicTitle: st.title,
              subtopicId: st.id,
            };
            break;
          }
        }
        if (nextStudyItem) break;
      }
    }

    if (nextStudyItem && targetMinutes - allocatedMinutes >= 60) {
      const studyDuration = Math.min(90, targetMinutes - allocatedMinutes);
      tasks.push({
        id: `task-${orderIndex}`,
        subjectId: candidateSubject.id,
        subjectName: candidateSubject.subject,
        topicId: nextStudyItem.topicId,
        topicTitle: `${nextStudyItem.topicTitle}: ${nextStudyItem.subtopicTitle}`,
        subtopicId: nextStudyItem.subtopicId,
        subtopicTitle: nextStudyItem.subtopicTitle,
        taskType: 'new_study',
        durationMinutes: studyDuration,
        completedMinutes: 0,
        status: 'pending',
        reason: `High-yield syllabus progression; balancing study share within 35% weekly guideline`,
        orderIndex: orderIndex++,
      });
      allocatedMinutes += studyDuration;
    }

    // 7. Practice / Answer Writing Slot (for Mains/Combined) or PYQ Slot (Prelims)
    if (targetMinutes - allocatedMinutes >= 45) {
      const practiceDuration = Math.min(60, targetMinutes - allocatedMinutes);
      if (examMode === 'mains' || examMode === 'combined') {
        tasks.push({
          id: `task-${orderIndex}`,
          subjectId: 'mains-aw',
          subjectName: 'Answer Writing Practice',
          topicId: 'mains-aw-daily',
          topicTitle: '2 Mains 15-Marker Answers (Introduction-Body-Conclusion with Diagrams)',
          taskType: 'answer_writing',
          durationMinutes: practiceDuration,
          completedMinutes: 0,
          status: 'pending',
          reason: 'Daily answer structure & speed drill for GS Papers',
          orderIndex: orderIndex++,
        });
      } else {
        tasks.push({
          id: `task-${orderIndex}`,
          subjectId: 'prelims-pyq',
          subjectName: 'PYQ Practice',
          topicId: 'pyq-elimination',
          topicTitle: '25 Previous Years Questions (2018-2024 Elimination Analysis)',
          taskType: 'pyq',
          durationMinutes: practiceDuration,
          completedMinutes: 0,
          status: 'pending',
          reason: 'Active recall and option elimination drill',
          orderIndex: orderIndex++,
        });
      }
      allocatedMinutes += practiceDuration;
    }

    // 8. Secondary Spaced Revision if ample time remains
    if (dueRevisions.length > 1 && targetMinutes - allocatedMinutes >= 45) {
      const secondRev = dueRevisions[1];
      const rev2Duration = Math.min(45, targetMinutes - allocatedMinutes);
      tasks.push({
        id: `task-${orderIndex}`,
        subjectId: secondRev.subjectId,
        subjectName: secondRev.subjectName,
        topicId: secondRev.topicId,
        topicTitle: secondRev.topicTitle,
        subtopicId: secondRev.subtopicId,
        subtopicTitle: secondRev.subtopicTitle,
        taskType: 'revision',
        durationMinutes: rev2Duration,
        completedMinutes: 0,
        status: 'pending',
        reason: `Secondary spaced revision (${secondRev.status === 'overdue' ? 'overdue' : 'due today'})`,
        orderIndex: orderIndex++,
      });
      allocatedMinutes += rev2Duration;
    }
  }

  // 9. Formulate Calming Mentor Rationale
  let mentorRationale = '';
  if (isMVD) {
    mentorRationale =
      '🌱 Minimum Viable Day Active: Your energy or available hours are lower today. We have protected your streak with a gentle, high-impact plan focusing on essential current affairs and revision without burnout.';
  } else if (checkin.energyMood === 5) {
    mentorRationale =
      '🚀 Peak Energy Day: You are in high flow today. The plan slots a deep study block, timely spaced revision, and active practice to capitalize on your peak momentum.';
  } else {
    mentorRationale =
      '⚖️ Balanced Daily Rhythm: Today’s plan covers spaced retention, syllabus progress, and daily editorial analysis, respecting the 35% weekly subject cap.';
  }

  // Add guardrail warnings if applicable
  const overCappedSubjects = Object.keys(recentSubjectHours).filter((s) => isSubjectOverCap(s));
  if (overCappedSubjects.length > 0) {
    mentorRationale += ` (Note: ${overCappedSubjects.join(', ')} exceeded 35% weekly hours; rotating focus to balance preparation).`;
  }

  return {
    id: `plan-${dateString}-${Date.now()}`,
    date: dateString,
    checkin,
    tasks,
    status: 'proposed',
    isMinimumViableDay: isMVD,
    targetHours: capacity.targetHours,
    totalPlannedMinutes: tasks.reduce((sum, t) => sum + t.durationMinutes, 0),
    totalCompletedMinutes: 0,
    mentorRationale,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
