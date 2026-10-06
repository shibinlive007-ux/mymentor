import type { CompleteOnboardingData } from '../../types/onboarding.ts';

export interface ExtractedMentorFact {
  category: 'strength' | 'weakness' | 'constraint' | 'habit' | 'preference' | 'goal';
  fact_key: string;
  fact_value: string;
  confidence: number;
  source: 'onboarding';
}

/**
 * Transforms completed onboarding wizard answers into permanent mentor memories.
 * The AI Mentor accesses these facts during planning, chat, and recovery routines.
 */
export function extractMentorMemories(data: CompleteOnboardingData): ExtractedMentorFact[] {
  const memories: ExtractedMentorFact[] = [];

  // 1. Basics & Aspirant Identity
  memories.push({
    category: 'goal',
    fact_key: 'target_attempt_year',
    fact_value: `${data.basics.targetYear} (Attempt #${data.basics.attemptNumber})`,
    confidence: 1.0,
    source: 'onboarding',
  });

  if (data.basics.optionalSubject) {
    memories.push({
      category: 'preference',
      fact_key: 'optional_subject',
      fact_value: data.basics.optionalSubject,
      confidence: 1.0,
      source: 'onboarding',
    });
  }

  // 2. Status & Availability Constraints
  const statusLabel =
    data.status.employmentStatus === 'working'
      ? 'Working Professional'
      : data.status.employmentStatus === 'student'
      ? 'College Student'
      : 'Full-time UPSC Aspirant';

  memories.push({
    category: 'constraint',
    fact_key: 'aspirant_employment_status',
    fact_value: statusLabel,
    confidence: 1.0,
    source: 'onboarding',
  });

  memories.push({
    category: 'constraint',
    fact_key: 'weekly_study_bandwidth',
    fact_value: `Weekday: ${data.status.weekdayHours} hrs/day | Weekend: ${data.status.weekendHours} hrs/day`,
    confidence: 1.0,
    source: 'onboarding',
  });

  // 3. Daily Rhythm & Focus Habits
  memories.push({
    category: 'habit',
    fact_key: 'peak_focus_window',
    fact_value: data.schedule.bestFocusTime.replace('_', ' ').toUpperCase(),
    confidence: 1.0,
    source: 'onboarding',
  });

  memories.push({
    category: 'habit',
    fact_key: 'sleep_wake_schedule',
    fact_value: `Wakes up at ${data.schedule.wakeTime}, sleeps at ${data.schedule.sleepTime}`,
    confidence: 0.9,
    source: 'onboarding',
  });

  if (data.schedule.fixedCommitments && data.schedule.fixedCommitments.length > 0) {
    memories.push({
      category: 'constraint',
      fact_key: 'fixed_daily_commitments',
      fact_value: data.schedule.fixedCommitments.join(', '),
      confidence: 1.0,
      source: 'onboarding',
    });
  }

  // 4. Resources
  if (data.resources.coachingType && data.resources.coachingType !== 'self_study') {
    memories.push({
      category: 'preference',
      fact_key: 'coaching_enrollment',
      fact_value: data.resources.coachingName || data.resources.coachingType,
      confidence: 1.0,
      source: 'onboarding',
    });
  }

  // 5. Subject Strengths & Weaknesses (Baseline Seeding)
  for (const [subject, rating] of Object.entries(data.position.ratings)) {
    if (rating === 'strong' || rating === 'intermediate') {
      memories.push({
        category: 'strength',
        fact_key: `baseline_${subject.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        fact_value: `${subject}: Self-rated ${rating.toUpperCase()}`,
        confidence: 0.85,
        source: 'onboarding',
      });
    } else {
      memories.push({
        category: 'weakness',
        fact_key: `baseline_${subject.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        fact_value: `${subject}: Self-rated ${rating.toUpperCase()} (Needs foundational coverage)`,
        confidence: 0.85,
        source: 'onboarding',
      });
    }
  }

  // 6. Goals
  memories.push({
    category: 'goal',
    fact_key: 'daily_study_target_range',
    fact_value: `${data.goals.dailyTargetHoursMin} - ${data.goals.dailyTargetHoursMax} hours/day`,
    confidence: 1.0,
    source: 'onboarding',
  });

  return memories;
}
