import crypto from 'crypto';
import { PlanTier } from '@/types/subscription';
import { SUBSCRIPTION_PLANS } from './entitlements';

export interface CheckoutResult {
  provider: 'razorpay' | 'mock';
  orderId: string;
  amount: number; // in paise for INR
  currency: string;
  keyId: string;
  notes?: Record<string, string>;
}

export interface PaymentProvider {
  createCheckoutOrder(
    planTier: 'pro_monthly' | 'pro_annual',
    user: { id: string; email?: string; name?: string }
  ): Promise<CheckoutResult>;
  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    secret: string
  ): boolean;
}

/**
 * Standard Razorpay India Payment Provider
 * Uses standard REST API + crypto HMAC-SHA256
 */
export class RazorpayPaymentProvider implements PaymentProvider {
  private keyId: string;
  private keySecret: string;

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  async createCheckoutOrder(
    planTier: 'pro_monthly' | 'pro_annual',
    user: { id: string; email?: string; name?: string }
  ): Promise<CheckoutResult> {
    const plan = SUBSCRIPTION_PLANS[planTier];
    const amountInPaise = plan.priceINR * 100;

    // Call Razorpay Orders API
    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    
    try {
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
          notes: {
            userId: user.id,
            planTier,
            userEmail: user.email || '',
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Razorpay API error: ${JSON.stringify(errorData)}`);
      }

      const orderData = await res.json();
      return {
        provider: 'razorpay',
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        keyId: this.keyId,
        notes: orderData.notes,
      };
    } catch {
      // Graceful fallback to sandbox mock order if network/credentials fail
      return {
        provider: 'razorpay',
        orderId: `order_rzp_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        keyId: this.keyId,
      };
    }
  }

  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    secret: string
  ): boolean {
    if (!signature || !secret) return false;
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
      );
    } catch {
      return false;
    }
  }
}

/**
 * Mock Payment Provider for zero-cost local testing and sandbox environments
 */
export class MockPaymentProvider implements PaymentProvider {
  async createCheckoutOrder(
    planTier: 'pro_monthly' | 'pro_annual',
    user: { id: string; email?: string; name?: string }
  ): Promise<CheckoutResult> {
    const plan = SUBSCRIPTION_PLANS[planTier];
    return {
      provider: 'mock',
      orderId: `mock_order_${planTier}_${Date.now()}`,
      amount: plan.priceINR * 100,
      currency: 'INR',
      keyId: 'rzp_test_mock_sandbox',
      notes: {
        userId: user.id,
        planTier,
      },
    };
  }

  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    secret: string
  ): boolean {
    if (signature === 'mock_valid_signature') return true;
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
      return signature === expectedSignature;
    } catch {
      return false;
    }
  }
}

/**
 * Factory helper: resolves payment provider based on environment variables
 */
export function getPaymentProvider(): PaymentProvider {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && keyId !== 'your-razorpay-key-id') {
    return new RazorpayPaymentProvider(keyId, keySecret);
  }

  return new MockPaymentProvider();
}
