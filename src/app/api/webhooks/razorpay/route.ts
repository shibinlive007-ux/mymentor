import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/subscriptions/provider';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const rawBody = await req.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

    const provider = getPaymentProvider();

    // Verify webhook signature
    const isValid = provider.verifyWebhookSignature(rawBody, signature || '', webhookSecret);

    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    let eventData: Record<string, unknown> = {};
    try {
      eventData = JSON.parse(rawBody);
    } catch {
      // empty body
    }

    const event = (eventData.event as string) || 'payment.captured';

    // Handle different webhook events
    switch (event) {
      case 'subscription.charged':
      case 'payment.captured': {
        // In real production, update the user's row in public.subscriptions
        break;
      }
      case 'subscription.cancelled':
      case 'subscription.halted': {
        // In real production, set status = 'canceled' or 'past_due'
        break;
      }
      default:
        break;
    }

    return NextResponse.json({
      received: true,
      event,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
