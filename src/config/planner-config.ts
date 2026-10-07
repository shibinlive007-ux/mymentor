/**
 * Unified Planning & Guardrail Configuration for My Mentor (UPSC 2027)
 * Centralizes all thresholds, caps, intervals, and weights in one single config file.
 */

export const PLANNER_CONFIG = {
  // Maximum share of weekly study hours any single subject may occupy
  SUBJECT_WEEKLY_CAP_PERCENT: 35,

  // Minimum weekly hours logged before strictly enforcing the percentage cap
  MIN_WEEKLY_HOURS_FOR_CAP: 5,

  // Maximum consecutive days on the exact same subject before anti-stuck warning triggers
  MAX_CONSECUTIVE_DAYS_ON_SUBJECT: 5,

  // Spaced repetition review intervals in days
  REVISION_INTERVALS_DAYS: [1, 7, 21, 45] as const,

  // Low energy & fatigue thresholds
  LOW_ENERGY_MOOD_MAX: 2,
  LOW_HOURS_MVD_MAX: 3.5,

  // Minimum Viable Day parameters
  MVD_TARGET_HOURS_MAX: 3.0,
  MVD_MAX_TASKS: 3,

  // Standard day parameters
  STANDARD_MAX_TASKS: 5,

  // Task duration allocations in minutes
  DURATIONS: {
    CURRENT_AFFAIRS_STANDARD: 45,
    CURRENT_AFFAIRS_MVD: 30,
    REVISION_STANDARD: 60,
    REVISION_MVD: 45,
    NEW_STUDY_MAX: 90,
    NEW_STUDY_MIN: 60,
    MOCK_TEST_STANDARD: 90,
    MOCK_TEST_MVD: 60,
  },
} as const;

export type PlannerConfig = typeof PLANNER_CONFIG;
