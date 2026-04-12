import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const { priceId, userId, email } = await request.json();

    if (!stripe) {
      // Demo Mode: Mock successful checkout
      return NextResponse.json({ 
        sessionId: "demo_session_" + Date.now(), 
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?session_id=mock_demo` 
      });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      customer_email: email,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
