'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserProfile } from '@/lib/supabase/auth-context';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { Step1Basics } from '@/components/onboarding/Step1Basics';
import { Step2Status } from '@/components/onboarding/Step2Status';
import { Step3Schedule } from '@/components/onboarding/Step3Schedule';
import { Step4Resources } from '@/components/onboarding/Step4Resources';
import { Step5Position } from '@/components/onboarding/Step5Position';
import { Step6Goals } from '@/components/onboarding/Step6Goals';
import { CompleteOnboardingData } from '@/types/onboarding';
import { extractMentorMemories } from '@/lib/onboarding/memory-extractor';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const DEFAULT_ONBOARDING_DATA: CompleteOnboardingData = {
  basics: {
    fullName: '',
    targetYear: 2027,
    attemptNumber: 1,
    optionalSubject: 'PSIR (Political Science)',
  },
  status: {
    employmentStatus: 'full_time',
    weekdayHours: 7.0,
    weekendHours: 8.5,
  },
  schedule: {
    wakeTime: '06:00',
    sleepTime: '23:30',
    bestFocusTime: 'morning',
    fixedCommitments: ['Daily Newspaper & Notes', 'Evening Revision Walk'],
    weeklyOffDay: 'Sunday',
  },
  resources: {
    coachingType: 'self_study',
    coachingName: '',
    testSeries: ['Prelims Test Series'],
    preferredBooks: [
      'M. Laxmikanth (Indian Polity)',
      'Rajiv Ahir / Spectrum (Modern History)',
      'GC Leong / NCERTs (Physical Geography)',
    ],
  },
  position: {
    ratings: {
      'Modern Indian History': 'basic',
      'Indian Polity & Constitution': 'intermediate',
      'Physical & Human Geography': 'not_started',
      'Economy & Agriculture': 'not_started',
      'Environment & Ecology': 'basic',
      'Ethics & Integrity (GS IV)': 'not_started',
      'CSAT (Aptitude & Comprehension)': 'intermediate',
    },
  },
  goals: {
    dailyTargetHoursMin: 6.0,
    dailyTargetHoursMax: 8.5,
    prelimsDate: '2027-05-23',
    mainsDate: '2027-09-17',
  },
};

const STEP_TITLES = [
  { step: 1, title: 'Basics & Identity', sub: 'Let’s set up your profile and 2027 target.' },
  { step: 2, title: 'Your Current Status', sub: 'How much study bandwidth do you realistically have?' },
  { step: 3, title: 'Daily Schedule & Rhythm', sub: 'Aligning your study schedule with your biological peak hours.' },
  { step: 4, title: 'Books & Resources', sub: 'Which standard books and coaching materials are you using?' },
  { step: 5, title: 'Current Position', sub: 'Honest self-assessment so the AI can allocate focus.' },
  { step: 6, title: 'Goals & Targets', sub: 'Your non-negotiable daily hours and exam countdown.' },
];

function getInitialOnboardingData(userProfile: UserProfile | null): CompleteOnboardingData {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('upsc_onboarding_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (userProfile?.full_name && !parsed.basics?.fullName) {
          parsed.basics.fullName = userProfile.full_name;
        }
        return parsed;
      } catch {
        // fallback
      }
    }
  }

  const base = { ...DEFAULT_ONBOARDING_DATA };
  if (userProfile?.full_name) {
    base.basics = { ...base.basics, fullName: userProfile.full_name };
  }
  return base;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CompleteOnboardingData>(() => getInitialOnboardingData(profile));

  const updateSection = <K extends keyof CompleteOnboardingData>(
    section: K,
    updated: Partial<CompleteOnboardingData[K]>
  ) => {
    setData((prev) => {
      const next = {
        ...prev,
        [section]: { ...prev[section], ...updated },
      };
      localStorage.setItem('upsc_onboarding_draft', JSON.stringify(next));
      return next;
    });
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    // 1. Extract mentor memories
    const memories = extractMentorMemories(data);
    localStorage.setItem('upsc_mentor_memories', JSON.stringify(memories));

    // 2. Update user profile
    updateProfile({
      full_name: data.basics.fullName || 'Aspirant',
      target_year: data.basics.targetYear,
      attempt_number: data.basics.attemptNumber,
      optional_subject: data.basics.optionalSubject,
      daily_target_hours_min: data.goals.dailyTargetHoursMin,
      daily_target_hours_max: data.goals.dailyTargetHoursMax,
      is_onboarded: true,
    });

    // 3. Clear draft and navigate to Today
    localStorage.removeItem('upsc_onboarding_draft');
    router.push('/today');
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentMeta = STEP_TITLES[currentStep - 1];

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col px-5 py-6">
        {/* Top Progress & Header */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}
            <span className="font-semibold text-[var(--primary)] font-mono">
              Step {currentStep} of 6
            </span>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] underline transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Stepper progress bar */}
          <div className="h-1.5 w-full bg-[var(--ring-track)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-[var(--foreground)] tracking-tight">
              {currentMeta.title}
            </h1>
            <p className="text-xs text-[var(--foreground-muted)] mt-0.5 leading-relaxed">
              {currentMeta.sub}
            </p>
          </div>
        </div>

        {/* Step Body */}
        <div className="flex-1">
          {currentStep === 1 && (
            <Step1Basics
              data={data.basics}
              onChange={(upd) => updateSection('basics', upd)}
            />
          )}
          {currentStep === 2 && (
            <Step2Status
              data={data.status}
              onChange={(upd) => updateSection('status', upd)}
            />
          )}
          {currentStep === 3 && (
            <Step3Schedule
              data={data.schedule}
              onChange={(upd) => updateSection('schedule', upd)}
            />
          )}
          {currentStep === 4 && (
            <Step4Resources
              data={data.resources}
              onChange={(upd) => updateSection('resources', upd)}
            />
          )}
          {currentStep === 5 && (
            <Step5Position
              data={data.position}
              onChange={(upd) => updateSection('position', upd)}
            />
          )}
          {currentStep === 6 && (
            <Step6Goals
              data={data.goals}
              onChange={(upd) => updateSection('goals', upd)}
            />
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 mt-4 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {currentStep === 6 ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Finalize My 2027 Study System
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </MobileContainer>
  );
}
