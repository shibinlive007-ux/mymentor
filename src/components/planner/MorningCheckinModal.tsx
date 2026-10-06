'use client';

import React, { useState } from 'react';
import { CheckinInput, EnergyMoodLevel } from '@/types/planner';
import {
  X,
  Sparkles,
  Zap,
  Coffee,
  BatteryLow,
  Smile,
  Flame,
  Clock,
  AlertCircle
} from 'lucide-react';

interface MorningCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGeneratePlan: (checkin: CheckinInput) => Promise<void>;
  initialCheckin?: CheckinInput;
}

const ENERGY_OPTIONS: Array<{
  level: EnergyMoodLevel;
  emoji: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}> = [
  { level: 1, emoji: '🥱', label: 'Drained', desc: 'Rest & light recovery', icon: BatteryLow },
  { level: 2, emoji: '🌧️', label: 'Low Energy', desc: 'Minimum viable day', icon: Coffee },
  { level: 3, emoji: '⚖️', label: 'Steady', desc: 'Normal balanced pace', icon: Smile },
  { level: 4, emoji: '⚡', label: 'High Focus', desc: 'Ready for deep work', icon: Zap },
  { level: 5, emoji: '🚀', label: 'Peak Flow', desc: 'Maximum momentum', icon: Flame },
];

const DISRUPTION_CHIPS = [
  { id: 'office_rush', label: '🏃 Office Rush' },
  { id: 'travel', label: '🚗 Travel' },
  { id: 'unwell', label: '🤒 Unwell' },
  { id: 'class_today', label: '🏫 Coaching Class' },
  { id: 'test_series', label: '📝 Mock Test Today' },
  { id: 'free_day', label: '🏖️ Full Free Day' },
];

export function MorningCheckinModal({
  isOpen,
  onClose,
  onGeneratePlan,
  initialCheckin,
}: MorningCheckinModalProps) {
  const [energyMood, setEnergyMood] = useState<EnergyMoodLevel>(initialCheckin?.energyMood || 3);
  const [availableHours, setAvailableHours] = useState<number>(initialCheckin?.availableHours || 6);
  const [disruptions, setDisruptions] = useState<string[]>(initialCheckin?.disruptions || []);
  const [notes, setNotes] = useState<string>(initialCheckin?.notes || '');
  const [hasTestToday, setHasTestToday] = useState<boolean>(initialCheckin?.hasTestToday || false);
  const [testName, setTestName] = useState<string>(initialCheckin?.testName || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleDisruption = (id: string) => {
    setDisruptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (id === 'test_series') {
      setHasTestToday((prev) => !prev);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onGeneratePlan({
        energyMood,
        availableHours,
        disruptions,
        notes: notes.trim() || undefined,
        hasTestToday,
        testName: testName.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error('Error generating plan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLowCapacity = energyMood <= 2 || availableHours < 3.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slideUp">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-raised)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                Morning Check-in (20s)
              </h2>
              <p className="text-xs text-[var(--foreground-muted)]">
                Calibrate today&apos;s adaptive study rhythm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* 1. Energy & Mood Selector */}
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-2 uppercase tracking-wide">
              1. How is your energy &amp; mental bandwidth today?
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {ENERGY_OPTIONS.map((opt) => {
                const isSelected = energyMood === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setEnergyMood(opt.level)}
                    className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-xs scale-102'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl mb-1">{opt.emoji}</span>
                    <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Available Hours Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                2. Realistic study hours available today
              </label>
              <span className="text-sm font-extrabold text-[var(--primary)] font-mono bg-[var(--primary-light)] px-2 py-0.5 rounded-md">
                {availableHours} hrs
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={availableHours}
              onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
              className="w-full accent-[var(--primary)] cursor-pointer h-2 bg-[var(--ring-track)] rounded-lg"
            />

            {/* Quick Preset Buttons */}
            <div className="flex items-center justify-between mt-2 text-xs">
              {[2, 4, 6, 8, 10].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAvailableHours(preset)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                    availableHours === preset
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                      : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {preset}h
                </button>
              ))}
            </div>
          </div>

          {/* Low Capacity Banner Notice */}
          {isLowCapacity && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Minimum Viable Day triggered:</span>
                <p className="text-[11px] mt-0.5 opacity-90">
                  We will prioritize 2 essential tasks (key revision + editorial) without burnout. Momentum over perfection!
                </p>
              </div>
            </div>
          )}

          {/* 3. Disruption Chips */}
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-2 uppercase tracking-wide">
              3. Any disruptions or fixed commitments?
            </label>
            <div className="flex flex-wrap gap-2">
              {DISRUPTION_CHIPS.map((chip) => {
                const isActive = disruptions.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => toggleDisruption(chip.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isActive
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                        : 'bg-[var(--surface-raised)] text-[var(--foreground-muted)] border-[var(--border)] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mock Test details if selected */}
          {hasTestToday && (
            <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-2 animate-fadeIn">
              <label className="block text-xs font-semibold text-[var(--foreground)]">
                Test / Mock Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. ForumIAS Prelims Simulator Test 3"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
              />
            </div>
          )}

          {/* 4. Notes & Specific Aspirant Priorities */}
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1 uppercase tracking-wide">
              4. Specific focus or notes (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Want to finish Laxmikanth Parliament chapter today"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)] placeholder:text-[var(--foreground-muted)]/70"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Adaptive Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Today&apos;s Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
