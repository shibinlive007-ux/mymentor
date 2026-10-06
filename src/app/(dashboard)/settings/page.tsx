'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/auth-context';
import {
  User,
  Clock,
  CreditCard,
  LogOut,
  Check,
  BrainCircuit,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { ExtractedMentorFact } from '@/lib/onboarding/memory-extractor';

const DEFAULT_MEMORIES: ExtractedMentorFact[] = [
  {
    category: 'goal',
    fact_key: 'target_attempt_year',
    fact_value: '2027 (Attempt #1)',
    confidence: 1.0,
    source: 'onboarding',
  },
  {
    category: 'preference',
    fact_key: 'optional_subject',
    fact_value: 'PSIR (Political Science)',
    confidence: 1.0,
    source: 'onboarding',
  },
  {
    category: 'constraint',
    fact_key: 'aspirant_employment_status',
    fact_value: 'Working Professional',
    confidence: 1.0,
    source: 'onboarding',
  },
  {
    category: 'habit',
    fact_key: 'peak_focus_window',
    fact_value: 'EARLY MORNING (5-9 AM)',
    confidence: 1.0,
    source: 'onboarding',
  },
  {
    category: 'strength',
    fact_key: 'baseline_polity',
    fact_value: 'Indian Polity: Self-rated STRONG',
    confidence: 0.85,
    source: 'onboarding',
  },
  {
    category: 'weakness',
    fact_key: 'baseline_geography',
    fact_value: 'Geography: Self-rated NOT STARTED (Needs foundational NCERTs)',
    confidence: 0.85,
    source: 'onboarding',
  },
];

function getInitialMemories(): ExtractedMentorFact[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('upsc_mentor_memories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_MEMORIES;
      }
    }
  }
  return DEFAULT_MEMORIES;
}

export default function SettingsPage() {
  const { profile, updateProfile, signOut } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [showMentorMemory, setShowMentorMemory] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(profile?.full_name || 'Aditya Sharma');
  const [optionalSubject, setOptionalSubject] = useState(profile?.optional_subject || 'PSIR (Political Science)');
  const [minHours, setMinHours] = useState(profile?.daily_target_hours_min || 6.0);
  const [maxHours, setMaxHours] = useState(profile?.daily_target_hours_max || 8.0);
  const [attemptNumber, setAttemptNumber] = useState(profile?.attempt_number || 1);

  // Mentor memory facts state initialized lazily
  const [memories, setMemories] = useState<ExtractedMentorFact[]>(getInitialMemories);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      optional_subject: optionalSubject,
      attempt_number: Number(attemptNumber),
      daily_target_hours_min: Number(minHours),
      daily_target_hours_max: Number(maxHours),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const deleteMemory = (key: string) => {
    const updated = memories.filter((m) => m.fact_key !== key);
    setMemories(updated);
    localStorage.setItem('upsc_mentor_memories', JSON.stringify(updated));
  };

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--foreground)]">Profile &amp; Settings</h2>
          <p className="text-xs text-[var(--foreground-muted)]">Configure your preparation system</p>
        </div>
        {isSaved && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Profile Card */}
        <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
            <User className="w-4 h-4" />
            <span>Aspirant Details</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">
                Target Attempt
              </label>
              <input
                type="text"
                disabled
                value="UPSC CSE 2027"
                className="w-full px-3 py-2 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)] opacity-75 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">
                Attempt Number
              </label>
              <select
                value={attemptNumber}
                onChange={(e) => setAttemptNumber(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)]"
              >
                <option value={1}>1st Attempt</option>
                <option value={2}>2nd Attempt</option>
                <option value={3}>3rd+ Attempt</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">
              Optional Subject
            </label>
            <input
              type="text"
              value={optionalSubject}
              onChange={(e) => setOptionalSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)]"
            />
          </div>
        </div>

        {/* Daily Study Targets */}
        <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
            <Clock className="w-4 h-4" />
            <span>Daily Study Target Range</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">
                Min Non-negotiable (hrs)
              </label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="14"
                value={minHours}
                onChange={(e) => setMinHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1">
                Max Stretch Target (hrs)
              </label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="16"
                value={maxHours}
                onChange={(e) => setMaxHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          Save Changes
        </button>
      </form>

      {/* AI Mentor Memory Section */}
      <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
        <div
          onClick={() => setShowMentorMemory(!showMentorMemory)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--foreground)]">AI Mentor Memory</h3>
              <p className="text-[11px] text-[var(--foreground-muted)]">
                {memories.length} facts remembered across your prep
              </p>
            </div>
          </div>
          {showMentorMemory ? (
            <ChevronUp className="w-4 h-4 text-[var(--foreground-muted)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)]" />
          )}
        </div>

        {showMentorMemory && (
          <div className="pt-2 space-y-2 border-t border-[var(--border)]">
            <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
              These facts guide the AI when generating daily plans and mentoring advice. You can remove any fact at any time:
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {memories.map((m) => (
                <div
                  key={m.fact_key}
                  className="p-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[var(--primary)] tracking-wider block">
                      {m.category}
                    </span>
                    <p className="text-[11px] font-medium text-[var(--foreground)] truncate">
                      {m.fact_value}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMemory(m.fact_key)}
                    className="p-1 rounded-md text-[var(--foreground-muted)] hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                    title="Remove from mentor memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Re-run Onboarding Link */}
      <div className="rounded-2xl p-4 bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-[var(--foreground)]">Re-calibrate Preparation</h4>
          <p className="text-[11px] text-[var(--foreground-muted)]">Re-run the full 6-step onboarding wizard</p>
        </div>
        <Link
          href="/onboarding"
          className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Launch
        </Link>
      </div>

      {/* Subscription status */}
      <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--foreground)]">7-Day Free Trial Active</h4>
            <p className="text-[11px] text-[var(--foreground-muted)]">Full access to AI Planner &amp; Mentorship</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-1 rounded-full">
          Active
        </span>
      </div>

      {/* Account Actions: Sign Out */}
      <div className="pt-2 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
