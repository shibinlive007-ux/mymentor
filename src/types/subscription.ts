export type PlanTier = 'trial' | 'pro_monthly' | 'pro_annual';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'expired';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  priceINR: number;
  intervalText: string;
  billingPeriod: 'month' | 'year' | 'trial';
  description: string;
  badge?: string;
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planTier: PlanTier;
  status: SubscriptionStatus;
  provider: 'razorpay' | 'mock';
  trialEndsAt: string; // ISO string
  currentPeriodStart: string; // ISO string
  currentPeriodEnd: string; // ISO string
  cancelAtPeriodEnd: boolean;
  razorpayCustomerId?: string | null;
  razorpaySubscriptionId?: string | null;
}

export type FeatureKey =
  | 'daily_plan'
  | 'spaced_repetition'
  | 'mentor_chat'
  | 'analytics_deep_dive'
  | 'data_export'
  | 'offline_pwa_sync';

export interface CheckoutSessionRequest {
  planTier: 'pro_monthly' | 'pro_annual';
  currency?: 'INR';
}

export interface CheckoutSessionResponse {
  provider: 'razorpay' | 'mock';
  orderId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  keyId: string;
  user: {
    name?: string;
    email?: string;
    phone?: string;
  };
}
