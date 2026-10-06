'use client';

import React from 'react';
import { OnboardingSchedule, FocusTimeSlot } from '@/types/onboarding';
import { Sun, Moon, Sunrise, Sunset, CalendarDays } from 'lucide-react';

interface Step3ScheduleProps {
  data: OnboardingSchedule;
  onChange: (updated: Partial<OnboardingSchedule>) => void;
}

const FOCUS_SLOTS: { id: FocusTimeSlot; label: string; time: string; icon: React.ElementType }[] = [
  { id: 'early_morning', label: 'Early Riser', time: '5:00 AM – 9:00 AM', icon: Sunrise },
  { id: 'morning', label: 'Morning Peak', time: '9:00 AM – 1:00 PM', icon: Sun },
  { id: 'evening', label: 'Evening Focused', time: '4:00 PM – 8:00 PM', icon: Sunset },
  { id: 'late_night', label: 'Night Owl', time: '9:00 PM – 1:30 AM', icon: Moon },
];

const COMMON_COMMITMENT_CHIPS = [
  'Office (9 AM - 6 PM)',
  'Daily Commute (1-2 hrs)',
  'Weekend Coaching Batch',
  'Sunday Mock Test',
  'College Lectures',
];

export function Step3Schedule({ data, onChange }: Step3ScheduleProps) {
  const toggleCommitment = (chip: string) => {
    const current = data.fixedCommitments || [];
    if (current.includes(chip)) {
      onChange({ fixedCommitments: current.filter((c) => c !== chip) });
    } else {
      onChange({ fixedCommitments: [...current, chip] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Best Focus Window */}
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-2">
          When is your natural peak focus time?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FOCUS_SLOTS.map((slot) => {
            const Icon = slot.icon;
            const isSelected = data.bestFocusTime === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onChange({ bestFocusTime: slot.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]/60 shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'}`} />
                  <span className="text-xs font-bold text-[var(--foreground)]">{slot.label}</span>
                </div>
                <span className="text-[10px] text-[var(--foreground-muted)]">{slot.time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sleep & Wake Times */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3 bg-[var(--surface-raised)] border border-[var(--border)]">
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
            <Sunrise className="w-3.5 h-3.5 text-[var(--primary)]" />
            Typical Wake Time
          </label>
          <input
            type="time"
            value={data.wakeTime}
            onChange={(e) => onChange({ wakeTime: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
          />
        </div>

        <div className="rounded-xl p-3 bg-[var(--surface-raised)] border border-[var(--border)]">
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-[var(--primary)]" />
            Typical Sleep Time
          </label>
          <input
            type="time"
            value={data.sleepTime}
            onChange={(e) => onChange({ sleepTime: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
          />
        </div>
      </div>

      {/* Fixed Commitments */}
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
          Fixed Weekly Commitments (Tap to toggle)
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {COMMON_COMMITMENT_CHIPS.map((chip) => {
            const isSelected = data.fixedCommitments?.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggleCommitment(chip)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                  isSelected
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface-raised)] text-[var(--foreground)] border-[var(--border)] hover:border-slate-400'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Off Day */}
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5 flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-[var(--primary)]" />
          Preferred Rest / Light Revision Day
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['Sunday', 'Saturday', 'Monday', 'No Off Day'].map((day) => {
            const isSelected = data.weeklyOffDay === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onChange({ weeklyOffDay: day })}
                className={`py-2 text-[11px] font-semibold rounded-xl border transition-all ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground)]'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
