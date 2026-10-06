'use client';

import React from 'react';
import { OnboardingResources } from '@/types/onboarding';
import { GraduationCap, Library } from 'lucide-react';

interface Step4ResourcesProps {
  data: OnboardingResources;
  onChange: (updated: Partial<OnboardingResources>) => void;
}

const COACHING_OPTIONS = [
  { id: 'self_study', label: 'Self-Study (Standard Books + YouTube)' },
  { id: 'vision_ias', label: 'Vision IAS' },
  { id: 'vajiram', label: 'Vajiram & Ravi' },
  { id: 'forum_ias', label: 'Forum IAS' },
  { id: 'next_ias', label: 'Next IAS' },
  { id: 'other', label: 'Other Coaching Institute' },
];

const STANDARD_BOOKS = [
  'M. Laxmikanth (Indian Polity)',
  'Rajiv Ahir / Spectrum (Modern History)',
  'PMF IAS / Shankar IAS (Environment)',
  'GC Leong / NCERTs (Physical Geography)',
  'Nitin Singhania (Art & Culture)',
  'Mrunal Patel / Vivek Singh (Economy)',
  'Subba Rao / Lexicon (Ethics GS IV)',
];

export function Step4Resources({ data, onChange }: Step4ResourcesProps) {
  const toggleBook = (book: string) => {
    const current = data.preferredBooks || [];
    if (current.includes(book)) {
      onChange({ preferredBooks: current.filter((b) => b !== book) });
    } else {
      onChange({ preferredBooks: [...current, book] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Coaching */}
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-[var(--primary)]" />
          Coaching Guidance
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {COACHING_OPTIONS.map((item) => {
            const isSelected = data.coachingType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ coachingType: item.id })}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]/70 text-[var(--foreground)] font-semibold shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Standard Books */}
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-1.5">
          <Library className="w-4 h-4 text-[var(--primary)]" />
          Your Primary Booklist (Tap what you use)
        </label>
        <div className="space-y-1.5">
          {STANDARD_BOOKS.map((book) => {
            const isSelected = data.preferredBooks?.includes(book);
            return (
              <button
                key={book}
                type="button"
                onClick={() => toggleBook(book)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)] font-semibold shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:border-slate-300'
                }`}
              >
                <span>{book}</span>
                <span className={`text-[11px] ${isSelected ? 'text-[var(--primary)] font-bold' : 'text-slate-400'}`}>
                  {isSelected ? '✓ In Library' : '+ Add'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
