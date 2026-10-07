import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Database, Trash2 } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — My Mentor',
  description: 'How My Mentor protects your UPSC CSE 2027 preparation data with zero-data-selling and local storage privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-10 px-4 sm:px-6 max-w-3xl mx-auto">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Settings
      </Link>

      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
            India DPDP Act 2023 &amp; Global Privacy
          </span>
          <h1 className="text-2xl font-black mt-1 text-[var(--foreground)]">
            Privacy Policy &amp; Data Ethics
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Last Updated: October 2026 • Effective for UPSC CSE 2027 Aspirants
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--foreground)] leading-relaxed">
            <strong>Core Promise:</strong> We do not sell your personal study data, study habits, notes, or mock scores to test-prep coaching institutes, advertisers, or third parties. Your preparation remains private to you.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)]">
            <Lock className="w-4 h-4 text-[var(--primary)]" /> 1. Data We Collect
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            To provide adaptive scheduling, spaced repetition, and mentorship, we store:
          </p>
          <ul className="text-xs text-[var(--foreground-muted)] list-disc pl-5 space-y-1">
            <li><strong>Account Identifiers:</strong> Your email address and optional full name for authentication.</li>
            <li><strong>Preparation Context:</strong> Target attempt year (2027), optional subject, employment status, baseline strengths, and daily target hours.</li>
            <li><strong>Study History:</strong> Timers completed, daily check-in ratings (energy/mood), and syllabus topic completion percentages.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)]">
            <Database className="w-4 h-4 text-[var(--primary)]" /> 2. Storage &amp; Encryption
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            Data is stored using PostgreSQL protected by <strong>Row Level Security (RLS)</strong>. Under RLS, no user can query or view another user&apos;s study progress or personal check-in notes. Ephemeral session state is cached in your browser&apos;s encrypted local storage for rapid offline response times.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)]">
            <Trash2 className="w-4 h-4 text-[var(--primary)]" /> 3. Your Rights (Export &amp; Erasure)
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            In compliance with India&apos;s Digital Personal Data Protection Act (DPDP) 2023:
          </p>
          <ul className="text-xs text-[var(--foreground-muted)] list-disc pl-5 space-y-1">
            <li><strong>Right to Portability:</strong> You can export 100% of your preparation history as a clean JSON archive anytime from Settings.</li>
            <li><strong>Right to Erasure:</strong> You can permanently wipe all local study data and request total database profile deletion in one click.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[var(--foreground)]">4. Payment Processing</h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            Payments are securely routed via Razorpay (India). My Mentor never stores or handles your debit/credit card numbers or UPI PINs. All transactions comply with RBI tokenization regulations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[var(--foreground)]">5. Contact Grievance Officer</h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            For questions or grievance redressal regarding your data, reach out to our team at <code className="text-[var(--primary)]">privacy@mymentor.prep</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
