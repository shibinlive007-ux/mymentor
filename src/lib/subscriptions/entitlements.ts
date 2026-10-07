import {
  PlanTier,
  SubscriptionPlan,
  SubscriptionStatus,
  UserSubscription,
  FeatureKey
} from '@/types/subscription';

export const SUBSCRIPTION_PLANS: Record<PlanTier, SubscriptionPlan> = {
  trial: {
    id: 'trial',
    name: '7-Day Free Trial',
    priceINR: 0,
    intervalText: '7 days',
    billingPeriod: 'trial',
    description: 'Complete unrestricted access to experience the UPSC 2027 preparation system.',
    features: [
      'Full Prelims & Mains Syllabus Coverage Tracker',
      'Deterministic Adaptive Daily Planner Engine',
      'Zero-Cost UPSC 2027 Grounded Mentor',
      'Spaced Revision Engine (1, 7, 21, 45-day cycles)',
      'Resilient Study Timer with Session Logging',
      'Subject Balance Guardrails (35% weekly cap)',
    ],
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'My Mentor Pro (Monthly)',
    priceINR: 499,
    intervalText: '₹499 / month',
    billingPeriod: 'month',
    description: 'Flexible monthly mentorship for self-paced UPSC 2027 aspirants.',
    features: [
      'Everything in Free Trial',
      'Unlimited Plan Recalibrations & MVD Recoveries',
      'Continuous Spaced Repetition Priority Queue',
      'Advanced Subject Balance & Stage Analytics',
      'Data Portability & Full JSON Archival',
      'PWA Offline Capability & Multi-device Sync',
    ],
  },
  pro_annual: {
    id: 'pro_annual',
    name: 'UPSC CSE 2027 Complete Prep',
    priceINR: 3999,
    intervalText: '₹3,999 / year',
    billingPeriod: 'year',
    badge: 'Save 33% • Best for CSE 2027',
    description: 'Single payment covering your entire preparation journey through Prelims & Mains 2027.',
    features: [
      'Everything in Pro Monthly',
      'Covers entire 2026-2027 UPSC Exam Cycle',
      'Annual GS I–IV & Optional Strategy Roadmap',
      'Priority Offline-First Synchronization',
      'Guaranteed ₹0 AI Token Fees forever',
      'Dedicated Aspirant Support',
    ],
  },
};

/**
 * Calculates remaining days in a trial.
 */
export function getTrialDaysRemaining(trialEndsAt: string | Date): number {
  const end = new Date(trialEndsAt).getTime();
  const now = Date.now();
  const diffMs = end - now;
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Evaluates whether a user has active access (either active subscription or active trial).
 */
export function hasActiveSubscription(sub?: Partial<UserSubscription> | null): boolean {
  if (!sub) return true; // Default fallback to allow access
  if (sub.status === 'active') return true;
  if (sub.status === 'trialing') {
    if (!sub.trialEndsAt) return true;
    return new Date(sub.trialEndsAt).getTime() > Date.now();
  }
  return false;
}

/**
 * Checks whether a particular feature is permitted under current subscription state.
 */
export function isFeatureAllowed(
  sub: Partial<UserSubscription> | null | undefined,
  _feature: FeatureKey
): boolean {
  // During active trial or active paid plan, all features are completely accessible
  return hasActiveSubscription(sub);
}

/**
 * Mock subscription state generator for client-side local testing or demonstration
 */
export function getDefaultUserSubscription(userId: string = 'demo-user'): UserSubscription {
  const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  return {
    id: `sub_${userId}`,
    userId,
    planTier: 'trial',
    status: 'trialing',
    provider: 'razorpay',
    trialEndsAt: trialEndDate,
    currentPeriodStart: now,
    currentPeriodEnd: trialEndDate,
    cancelAtPeriodEnd: false,
    razorpayCustomerId: null,
    razorpaySubscriptionId: null,
  };
}
