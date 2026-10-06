import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { extractMentorMemories } from '../src/lib/onboarding/memory-extractor.ts';
import type { CompleteOnboardingData } from '../src/types/onboarding.ts';

const mockCompleteOnboarding: CompleteOnboardingData = {
  basics: {
    fullName: 'Aditya Sharma',
    targetYear: 2027,
    attemptNumber: 1,
    optionalSubject: 'PSIR',
  },
  status: {
    employmentStatus: 'working',
    weekdayHours: 5.0,
    weekendHours: 9.0,
  },
  schedule: {
    wakeTime: '06:00',
    sleepTime: '23:30',
    bestFocusTime: 'early_morning',
    fixedCommitments: ['Office 9 AM - 6 PM', 'Metro Commute 1 hr'],
    weeklyOffDay: 'Sunday',
  },
  resources: {
    coachingType: 'coaching_enrolled',
    coachingName: 'Vision IAS Weekend Batch',
    testSeries: ['Vision IAS Prelims', 'Forum IAS Simulator'],
    preferredBooks: ['Laxmikanth Polity', 'Spectrum Modern India'],
  },
  position: {
    ratings: {
      'Modern History': 'intermediate',
      'Polity': 'strong',
      'Economy': 'not_started',
      'Geography': 'basic',
    },
  },
  goals: {
    dailyTargetHoursMin: 6.0,
    dailyTargetHoursMax: 8.0,
    prelimsDate: '2027-05-23',
    mainsDate: '2027-09-17',
  },
};

describe('Onboarding Mentor Memory Extractor', () => {
  test('extracts basic goals and optional subject preference', () => {
    const facts = extractMentorMemories(mockCompleteOnboarding);

    const targetYearFact = facts.find((f) => f.fact_key === 'target_attempt_year');
    assert.ok(targetYearFact);
    assert.equal(targetYearFact.category, 'goal');
    assert.match(targetYearFact.fact_value, /2027/);

    const optionalFact = facts.find((f) => f.fact_key === 'optional_subject');
    assert.ok(optionalFact);
    assert.equal(optionalFact.category, 'preference');
    assert.equal(optionalFact.fact_value, 'PSIR');
  });

  test('extracts work status and bandwidth constraints', () => {
    const facts = extractMentorMemories(mockCompleteOnboarding);

    const statusFact = facts.find((f) => f.fact_key === 'aspirant_employment_status');
    assert.ok(statusFact);
    assert.equal(statusFact.category, 'constraint');
    assert.equal(statusFact.fact_value, 'Working Professional');

    const bandwidthFact = facts.find((f) => f.fact_key === 'weekly_study_bandwidth');
    assert.ok(bandwidthFact);
    assert.equal(bandwidthFact.category, 'constraint');
    assert.match(bandwidthFact.fact_value, /Weekday: 5 hrs\/day/);
  });

  test('correctly categorizes subject baseline ratings into strengths and weaknesses', () => {
    const facts = extractMentorMemories(mockCompleteOnboarding);

    // Polity was rated strong -> category strength
    const polityFact = facts.find((f) => f.fact_key === 'baseline_polity');
    assert.ok(polityFact);
    assert.equal(polityFact.category, 'strength');

    // Economy was rated not_started -> category weakness
    const economyFact = facts.find((f) => f.fact_key === 'baseline_economy');
    assert.ok(economyFact);
    assert.equal(economyFact.category, 'weakness');
    assert.match(economyFact.fact_value, /Needs foundational coverage/);
  });

  test('extracts sleep schedule and peak focus habits', () => {
    const facts = extractMentorMemories(mockCompleteOnboarding);

    const focusFact = facts.find((f) => f.fact_key === 'peak_focus_window');
    assert.ok(focusFact);
    assert.equal(focusFact.category, 'habit');

    const sleepFact = facts.find((f) => f.fact_key === 'sleep_wake_schedule');
    assert.ok(sleepFact);
    assert.equal(sleepFact.category, 'habit');
    assert.match(sleepFact.fact_value, /06:00/);
  });
});
