import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/subscriptions/provider';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { PlanTier } from '@/types/subscription';

export async function POST(req: NextRequest) {
  // IP or client identification for rate limiting
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = checkRateLimit(`checkout_${ip}`, { limit: 10, windowMs: 60000 });
  const headers = getRateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many checkout requests. Please wait a moment.' },
      { status: 429, headers }
    );
  }

  try {
    const body = await req.json();
    const planTier: PlanTier = body.planTier || 'pro_monthly';

    if (planTier !== 'pro_monthly' && planTier !== 'pro_annual') {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400, headers }
      );
    }

    const provider = getPaymentProvider();
    const result = await provider.createCheckoutOrder(planTier, {
      id: body.userId || 'aspirant_user',
      email: body.email || 'aspirant@example.com',
      name: body.name || 'UPSC 2027 Aspirant',
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { headers }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed';
    return NextResponse.json(
      { error: message },
      { status: 500, headers }
    );
  }
}
