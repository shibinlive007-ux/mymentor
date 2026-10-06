'use client';

import React from 'react';
import { OnboardingBasics } from '@/types/onboarding';
import { User, Calendar, Award, BookOpen } from 'lucide-react';

interface Step1BasicsProps {
  data: OnboardingBasics;
  onChange: (updated: Partial<OnboardingBasics>) => void;
}

const POPULAR_OPTIONALS = [
  'PSIR (Political Science)',
  'Geography',
  'Sociology',
  'History',
  'Public Administration',
  'Anthropology',
  'Philosophy',
  'Literature',
];

export function Step1Basics({ data, onChange }: Step1BasicsProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-1.5">
          <User className="w-4 h-4 text-[var(--primary)]" />
          What is your name?
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="e.g. Aditya Sharma"
          className="w-full px-3.5 py-2.5 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:bg-[var(--surface)] focus:border-[var(--primary)] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[var(--primary)]" />
          Target Attempt Year
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[2026, 2027, 2028].map((year) => {
            const isSelected = data.targetYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => onChange({ targetYear: year })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground)] hover:border-slate-300'
                }`}
              >
                {year}
                {year === 2027 && (
                  <span className="block text-[10px] font-normal text-[var(--primary)]">Default</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[var(--primary)]" />
          Attempt Number
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((attempt) => {
            const label = attempt === 1 ? '1st Attempt' : attempt === 2 ? '2nd Attempt' : '3rd+ Attempt';
            const isSelected = data.attemptNumber === attempt;
            return (
              <button
                key={attempt}
                type="button"
                onClick={() => onChange({ attemptNumber: attempt })}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground)] hover:border-slate-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[var(--primary)]" />
          Optional Subject
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {POPULAR_OPTIONALS.map((opt) => {
            const isSelected = data.optionalSubject === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ optionalSubject: opt })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                  isSelected
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface-raised)] text-[var(--foreground)] border-[var(--border)] hover:border-slate-400'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={data.optionalSubject}
          onChange={(e) => onChange({ optionalSubject: e.target.value })}
          placeholder="Or type custom optional subject..."
          className="w-full px-3.5 py-2 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:bg-[var(--surface)] focus:border-[var(--primary)] transition-all"
        />
      </div>
    </div>
  );
}
