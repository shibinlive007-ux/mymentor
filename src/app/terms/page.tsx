import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — My Mentor',
  description: 'Terms of Service and UPSC CSE preparation guidance disclaimer for My Mentor.',
};

export default function TermsOfServicePage() {
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
            Aspirant Agreement
          </span>
          <h1 className="text-2xl font-black mt-1 text-[var(--foreground)]">
            Terms of Service
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Last Updated: October 2026 • Effective for UPSC CSE 2027 Aspirants
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--foreground)] leading-relaxed">
            <strong>Important Academic Disclaimer:</strong> My Mentor is an intelligent study assistant, scheduling engine, and consistency companion. It is NOT affiliated with the Union Public Service Commission (UPSC). Success in the Civil Services Examination depends entirely on individual dedication, hard work, and exam-day execution.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)]">
            <BookOpen className="w-4 h-4 text-[var(--primary)]" /> 1. Syllabus &amp; Seed Data Verification
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            The syllabus hierarchies and seed topics included in the app are structured based on official UPSC CSE notifications. Aspirants must verify micro-topic wordings against the official UPSC notification for their specific attempt year when released.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold flex items-center gap-2 text-[var(--foreground)]">
            <RefreshCw className="w-4 h-4 text-[var(--primary)]" /> 2. Subscriptions &amp; Billing
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            All users receive an initial 7-Day Free Trial with complete access to all planner, mentor, timer, and syllabus features. Upgrades to Pro Monthly (₹499/mo) or Pro Annual (₹3,999/yr) are billed via Razorpay. You may cancel your renewal at any time directly through Settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[var(--foreground)]">3. Fair Usage &amp; Community Norms</h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            Users agree not to reverse engineer, scrape, or flood the API endpoints with automated bots. Accounts exhibiting abnormal automated traffic may be rate-limited to preserve service stability for the entire aspirant community.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[var(--foreground)]">4. Governing Law</h2>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>
      </div>
    </div>
  );
}
