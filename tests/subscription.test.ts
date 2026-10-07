import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import {
  getTrialDaysRemaining,
  hasActiveSubscription,
  isFeatureAllowed,
  SUBSCRIPTION_PLANS,
  getDefaultUserSubscription
} from '../src/lib/subscriptions/entitlements';
import {
  MockPaymentProvider,
  RazorpayPaymentProvider
} from '../src/lib/subscriptions/provider';

describe('Phase 9 Subscription & Entitlements Engine', () => {
  test('correctly calculates remaining trial days', () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    const days = getTrialDaysRemaining(futureDate);
    assert.strictEqual(days, 5);

    const pastDate = new Date(Date.now() - 1000).toISOString();
    assert.strictEqual(getTrialDaysRemaining(pastDate), 0);
  });

  test('recognizes active trial and active paid memberships', () => {
    const activeSub = getDefaultUserSubscription('test_user_1');
    assert.strictEqual(hasActiveSubscription(activeSub), true);

    const paidSub = {
      ...activeSub,
      planTier: 'pro_annual' as const,
      status: 'active' as const,
    };
    assert.strictEqual(hasActiveSubscription(paidSub), true);

    const expiredSub = {
      ...activeSub,
      status: 'expired' as const,
      trialEndsAt: new Date(Date.now() - 1000).toISOString(),
    };
    assert.strictEqual(hasActiveSubscription(expiredSub), false);
  });

  test('authorizes core preparation features under active subscription', () => {
    const sub = getDefaultUserSubscription('test_user_2');
    assert.strictEqual(isFeatureAllowed(sub, 'daily_plan'), true);
    assert.strictEqual(isFeatureAllowed(sub, 'spaced_repetition'), true);
    assert.strictEqual(isFeatureAllowed(sub, 'mentor_chat'), true);
    assert.strictEqual(isFeatureAllowed(sub, 'analytics_deep_dive'), true);
  });

  test('catalog contains Free Trial, Pro Monthly, and Pro Annual plans', () => {
    assert.ok(SUBSCRIPTION_PLANS.trial);
    assert.ok(SUBSCRIPTION_PLANS.pro_monthly);
    assert.ok(SUBSCRIPTION_PLANS.pro_annual);

    assert.strictEqual(SUBSCRIPTION_PLANS.pro_monthly.priceINR, 499);
    assert.strictEqual(SUBSCRIPTION_PLANS.pro_annual.priceINR, 3999);
  });

  test('MockPaymentProvider generates deterministic checkout orders', async () => {
    const provider = new MockPaymentProvider();
    const result = await provider.createCheckoutOrder('pro_annual', {
      id: 'usr_123',
      email: 'aspirant@example.com',
    });

    assert.strictEqual(result.provider, 'mock');
    assert.strictEqual(result.amount, 399900); // 3,999 in paise
    assert.strictEqual(result.currency, 'INR');
    assert.ok(result.orderId.startsWith('mock_order_pro_annual_'));
  });

  test('Razorpay cryptographic webhook signature verification', () => {
    const secret = 'super_secret_webhook_key';
    const payload = JSON.stringify({ event: 'subscription.charged', id: 'evt_123' });
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const provider = new RazorpayPaymentProvider('rzp_test_123', 'mock_secret');
    
    // Valid signature matches
    assert.strictEqual(provider.verifyWebhookSignature(payload, signature, secret), true);

    // Tampered payload fails
    assert.strictEqual(provider.verifyWebhookSignature(payload + 'extra', signature, secret), false);

    // Wrong secret fails
    assert.strictEqual(provider.verifyWebhookSignature(payload, signature, 'wrong_secret'), false);
  });
});
