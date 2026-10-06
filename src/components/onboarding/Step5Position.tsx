'use client';

import React from 'react';
import { OnboardingPosition, SubjectProficiency } from '@/types/onboarding';
import { BarChart2 } from 'lucide-react';

interface Step5PositionProps {
  data: OnboardingPosition;
  onChange: (updated: Partial<OnboardingPosition>) => void;
}

const CORE_SUBJECTS = [
  'Modern Indian History',
  'Indian Polity & Constitution',
  'Physical & Human Geography',
  'Economy & Agriculture',
  'Environment & Ecology',
  'Ethics & Integrity (GS IV)',
  'CSAT (Aptitude & Comprehension)',
];

const RATING_LEVELS: { id: SubjectProficiency; label: string }[] = [
  { id: 'not_started', label: 'Not Started' },
  { id: 'basic', label: 'Basic' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'strong', label: 'Strong' },
];

export function Step5Position({ data, onChange }: Step5PositionProps) {
  const setSubjectRating = (subject: string, rating: SubjectProficiency) => {
    const updated = {
      ...data.ratings,
      [subject]: rating,
    };
    onChange({ ratings: updated });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] flex items-start gap-2">
        <BarChart2 className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
        <p>
          Quickly rate your baseline. This seeds your initial syllabus coverage and lets the AI allocate study time to weak areas first.
        </p>
      </div>

      <div className="space-y-3">
        {CORE_SUBJECTS.map((subject) => {
          const currentRating = data.ratings?.[subject] || 'not_started';

          return (
            <div
              key={subject}
              className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2"
            >
              <div className="text-xs font-semibold text-[var(--foreground)]">{subject}</div>

              <div className="grid grid-cols-4 gap-1.5">
                {RATING_LEVELS.map((lvl) => {
                  const isSelected = currentRating === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSubjectRating(subject, lvl.id)}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border text-center transition-all ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-bold shadow-xs'
                          : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:border-slate-300'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
