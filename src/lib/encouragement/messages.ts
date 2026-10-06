/**
 * Gentle, Authentic Encouragement Engine for UPSC 2027 Aspirants
 *
 * Grounding, calm, non-preachy messages tailored to task completions,
 * milestones, consistency streaks, and guilt-free returns after missed days.
 */

import { PlannerTask } from '@/types/planner';

export interface EncouragementMessage {
  title: string;
  body: string;
  category: 'task_complete' | 'all_complete' | 'streak' | 'milestone' | 'comeback' | 'rest';
}

const TASK_COMPLETE_MESSAGES: Record<string, string[]> = {
  revision: [
    'Spaced revision locked in. Active recall is what separates recognition from retention.',
    'Another revision cycle completed. Memory pathways get sharper each time.',
    'Solid review session. Reinforcing past topics prevents the forgotten backlog.',
  ],
  new_study: [
    'Deep focus block completed. Consistent syllabus progress compounds quietly.',
    'Fresh concepts covered. Remember to link these with current affairs and PYQs later.',
    'Good work navigating new ground. One topic closer to full syllabus coverage.',
  ],
  current_affairs: [
    'Daily editorial analysis done. Issues-based understanding is the cornerstone of GS.',
    'Current affairs logged. Connecting daily developments to the static syllabus builds rank.',
    'Clean editorial session. Consistent daily reading makes Mains analysis natural.',
  ],
  pyq: [
    'PYQ analysis completed. Deconstructing UPSC wording is the highest-ROI practice.',
    'Option elimination honed. Real exam intuition comes from wrestling with past questions.',
    'Good drill on PYQs. Learning what UPSC asks helps prioritize what to read next.',
  ],
  answer_writing: [
    'Answer writing slot complete. Structure, speed, and diagrams improve with every page.',
    'Mains practice banked. Articulating thoughts under time pressure is true preparation.',
    'Great job putting pen to paper. Ideas mean little until structured into an answer.',
  ],
  default: [
    'Task completed with focus. One solid block in the bag today.',
    'Steady execution. Keep this calm rhythm for the rest of the session.',
    'Focus block logged. Take a deep breath and stretch before the next step.',
  ],
};

export function getTaskCompletionMessage(
  task: PlannerTask,
  completedCount: number,
  totalTasks: number
): EncouragementMessage {
  if (completedCount >= totalTasks && totalTasks > 0) {
    return {
      title: '🌟 Day’s Planned Blocks Completed',
      body: 'You completed all scheduled tasks for today. Outstanding discipline. Wind down, rest well, and protect your energy for tomorrow.',
      category: 'all_complete',
    };
  }

  const pool = TASK_COMPLETE_MESSAGES[task.taskType] || TASK_COMPLETE_MESSAGES.default;
  const randomIndex = Math.floor(Math.random() * pool.length);
  const body = pool[randomIndex];

  return {
    title: `✓ ${task.subjectName} Block Completed`,
    body,
    category: 'task_complete',
  };
}

export function getMilestoneMessage(subjectName: string, percentage: number): EncouragementMessage {
  if (percentage >= 100) {
    return {
      title: `🏆 ${subjectName} 100% Covered!`,
      body: `You have completed the syllabus tree for ${subjectName}. Transition into cyclic spaced revisions and full-length sectional mocks.`,
      category: 'milestone',
    };
  }
  if (percentage >= 75) {
    return {
      title: `⚡ ${subjectName} Reached 75%`,
      body: `Over three quarters of ${subjectName} is complete. The finish line for this subject is within clear reach.`,
      category: 'milestone',
    };
  }
  if (percentage >= 50) {
    return {
      title: `🎯 Halfway Mark: ${subjectName} at 50%`,
      body: `You have crossed the halfway mark in ${subjectName}. The foundation is solid; keep the revision cycles active.`,
      category: 'milestone',
    };
  }
  return {
    title: `🌱 First Quarter in ${subjectName}`,
    body: `${subjectName} has passed 25% coverage. Early momentum established.`,
    category: 'milestone',
  };
}

export function getStreakMessage(streakDays: number): EncouragementMessage {
  if (streakDays >= 30) {
    return {
      title: `🔥 30-Day Preparation Streak`,
      body: 'A full month of non-negotiable daily showing up. This quiet consistency is what clears this examination.',
      category: 'streak',
    };
  }
  if (streakDays >= 14) {
    return {
      title: `✨ Two Weeks Consistent`,
      body: '14 consecutive days of study rhythm. Habit formation complete.',
      category: 'streak',
    };
  }
  if (streakDays >= 7) {
    return {
      title: `🌿 7-Day Rhythm Maintained`,
      body: 'A solid week of daily consistency. You are pacing yourself like an officer.',
      category: 'streak',
    };
  }
  return {
    title: `🌱 Day ${streakDays} Streak`,
    body: 'Another day of showing up for your goal. Small daily steps build rank.',
    category: 'streak',
  };
}

export function getComebackMessage(): EncouragementMessage {
  const comebacks = [
    'Welcome back. No guilt over days missed — preparation is a long marathon, and starting today with calm focus is all that counts.',
    'Glad to see you back at the desk. We adjusted today’s plan so you don’t carry backlog stress. Just focus on today.',
    'Breaks and interruptions happen to every topper. What matters is the calm return. Let’s do one solid session today.',
  ];
  const idx = Math.floor(Math.random() * comebacks.length);
  return {
    title: '🌿 Welcome Back',
    body: comebacks[idx],
    category: 'comeback',
  };
}
