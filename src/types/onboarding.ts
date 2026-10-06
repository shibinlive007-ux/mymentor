export type EmploymentStatus = 'working' | 'full_time' | 'student';
export type FocusTimeSlot = 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'late_night';
export type SubjectProficiency = 'not_started' | 'basic' | 'intermediate' | 'strong';

export interface OnboardingBasics {
  fullName: string;
  targetYear: number;
  attemptNumber: number;
  optionalSubject: string;
}

export interface OnboardingStatus {
  employmentStatus: EmploymentStatus;
  weekdayHours: number;
  weekendHours: number;
}

export interface OnboardingSchedule {
  wakeTime: string;
  sleepTime: string;
  bestFocusTime: FocusTimeSlot;
  fixedCommitments: string[];
  weeklyOffDay: string;
}

export interface OnboardingResources {
  coachingType: string;
  coachingName?: string;
  testSeries: string[];
  preferredBooks: string[];
}

export interface OnboardingPosition {
  ratings: Record<string, SubjectProficiency>;
}

export interface OnboardingGoals {
  dailyTargetHoursMin: number;
  dailyTargetHoursMax: number;
  prelimsDate: string;
  mainsDate: string;
}

export interface CompleteOnboardingData {
  basics: OnboardingBasics;
  status: OnboardingStatus;
  schedule: OnboardingSchedule;
  resources: OnboardingResources;
  position: OnboardingPosition;
  goals: OnboardingGoals;
}
