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
  Trash2,
  Download,
  Shield,
  Sparkles,
  X,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { ExtractedMentorFact } from '@/lib/onboarding/memory-extractor';
import { SUBSCRIPTION_PLANS, getTrialDaysRemaining } from '@/lib/subscriptions/entitlements';
import { compileUserDataForExport, triggerJsonDownload, purgeAllUserData } from '@/lib/privacy/data-management';
import { PlanTier } from '@/types/subscription';

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

  // Subscriptions & Billing state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<PlanTier>('pro_annual');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [activePlan, setActivePlan] = useState<'trial' | 'pro_monthly' | 'pro_annual'>('trial');

  // Privacy & Data state
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(profile?.full_name || 'Aditya Sharma');
  const [optionalSubject, setOptionalSubject] = useState(profile?.optional_subject || 'PSIR (Political Science)');
  const [minHours, setMinHours] = useState(profile?.daily_target_hours_min || 6.0);
  const [maxHours, setMaxHours] = useState(profile?.daily_target_hours_max || 8.0);
  const [attemptNumber, setAttemptNumber] = useState(profile?.attempt_number || 1);

  // Mentor memory facts state
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

  // Export User Preparation Archive
  const handleExportData = () => {
    setIsExporting(true);
    try {
      const data = compileUserDataForExport(profile as Record<string, unknown> | null);
      triggerJsonDownload(data);
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  // Data Purge / Delete Account
  const handlePurgeData = () => {
    setIsDeleting(true);
    try {
      purgeAllUserData();
      signOut();
      window.location.href = '/onboarding';
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle plan upgrade trigger
  const handleProceedCheckout = async () => {
    if (selectedPlanTier === 'trial') return;
    setIsUpgrading(true);

    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier: selectedPlanTier,
          userId: profile?.id || 'aspirant_user',
          name: fullName,
        }),
      });

      if (!res.ok) {
        throw new Error('Checkout request failed');
      }

      const data = await res.json();
      if (data.success) {
        setActivePlan(selectedPlanTier);
        setUpgradeSuccess(true);
        setTimeout(() => {
          setUpgradeSuccess(false);
          setShowUpgradeModal(false);
        }, 1800);
      }
    } catch {
      // Fallback: update client state in mock/demo
      setActivePlan(selectedPlanTier);
      setUpgradeSuccess(true);
      setTimeout(() => {
        setUpgradeSuccess(false);
        setShowUpgradeModal(false);
      }, 1800);
    } finally {
      setIsUpgrading(false);
    }
  };

  const trialDaysRemaining = getTrialDaysRemaining(
    new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
  );

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

      {/* Subscription & Commercialization Section */}
      <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
            <CreditCard className="w-4 h-4" />
            <span>Membership &amp; Subscription</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {activePlan === 'trial' ? `${trialDaysRemaining} Days Trial Left` : 'Pro Member'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
              {activePlan === 'trial' ? (
                <>7-Day Free Trial Active</>
              ) : activePlan === 'pro_annual' ? (
                <>UPSC CSE 2027 Annual Pass <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" /></>
              ) : (
                <>My Mentor Pro (Monthly)</>
              )}
            </h4>
            <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
              {activePlan === 'trial'
                ? 'Full access to Adaptive Planner, Grounded Mentor & Spaced Repetition'
                : 'Unlimited plan recalibrations, full offline capability & priority access'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {activePlan === 'trial' ? 'Upgrade to Pro' : 'Change Plan'}
          </button>
        </div>
      </div>

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
              <h3 className="text-xs font-bold text-[var(--foreground)]">My Mentor Memory</h3>
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

      {/* Data Privacy & Portability (DPDP Act 2023) */}
      <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
          <Shield className="w-4 h-4" />
          <span>Data Privacy &amp; Portability (DPDP Act)</span>
        </div>

        <p className="text-[11px] text-[var(--foreground-muted)] leading-relaxed">
          You own 100% of your study data. Export your preparation archive anytime or permanently wipe all records.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="py-2 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--foreground)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>{isExporting ? 'Exporting...' : 'Export JSON'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="py-2 px-3 rounded-xl border border-rose-500/20 text-rose-600 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Data</span>
          </button>
        </div>
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

      {/* Legal & Regulatory Links */}
      <div className="text-center pt-2 pb-4 space-x-3 text-[11px] text-[var(--foreground-muted)]">
        <Link href="/privacy" className="hover:text-[var(--primary)] hover:underline inline-flex items-center gap-0.5">
          Privacy Policy <ExternalLink className="w-2.5 h-2.5 inline" />
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-[var(--primary)] hover:underline inline-flex items-center gap-0.5">
          Terms of Service <ExternalLink className="w-2.5 h-2.5 inline" />
        </Link>
        <span>•</span>
        <span>UPSC CSE 2027</span>
      </div>

      {/* Upgrade Subscription Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                  Investment in Consistency
                </span>
                <h3 className="text-base font-black text-[var(--foreground)]">Upgrade to My Mentor Pro</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="p-1 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Pro Annual */}
              <div
                onClick={() => setSelectedPlanTier('pro_annual')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlanTier === 'pro_annual'
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] ring-1 ring-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[var(--foreground)]">
                      {SUBSCRIPTION_PLANS.pro_annual.name}
                    </h4>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      Save 33%
                    </span>
                  </div>
                  <span className="text-xs font-black text-[var(--primary)]">
                    {SUBSCRIPTION_PLANS.pro_annual.intervalText}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                  {SUBSCRIPTION_PLANS.pro_annual.description}
                </p>
              </div>

              {/* Pro Monthly */}
              <div
                onClick={() => setSelectedPlanTier('pro_monthly')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlanTier === 'pro_monthly'
                    ? 'border-[var(--primary)] bg-[var(--primary-light)] ring-1 ring-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--border-hover)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[var(--foreground)]">
                    {SUBSCRIPTION_PLANS.pro_monthly.name}
                  </h4>
                  <span className="text-xs font-black text-[var(--primary)]">
                    {SUBSCRIPTION_PLANS.pro_monthly.intervalText}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                  {SUBSCRIPTION_PLANS.pro_monthly.description}
                </p>
              </div>
            </div>

            {/* India-first Payment badges */}
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--foreground-muted)]">
              <span>Supported via Razorpay:</span>
              <span className="font-semibold text-[var(--foreground)]">
                UPI (GPay / PhonePe) • RuPay • Cards • NetBanking
              </span>
            </div>

            {upgradeSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Membership Activated Successfully!
              </div>
            ) : (
              <button
                type="button"
                onClick={handleProceedCheckout}
                disabled={isUpgrading}
                className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {isUpgrading
                    ? 'Connecting Payment Gateway...'
                    : `Proceed with ${
                        selectedPlanTier === 'pro_annual' ? '₹3,999 (Annual)' : '₹499 (Monthly)'
                      }`}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete / Purge Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-rose-500/30 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-[var(--foreground)]">Purge All Preparation Data?</h3>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              This action is permanent and cannot be undone. It will delete all logged study timers, daily plans, mentor memory facts, syllabus tracking progress, and completed check-ins.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-raised)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePurgeData}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
