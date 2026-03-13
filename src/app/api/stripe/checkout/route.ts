import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_PRICES } from "@/lib/stripe-config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

  console.log("=== CHECKOUT API HIT ===");
  console.log("Stripe key exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("Stripe prices:", {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
    agency: process.env.STRIPE_PRICE_AGENCY,
  });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("=== CHECKOUT: No authenticated user ===");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    console.log("=== CHECKOUT BODY ===", body);

    const tier = (body.tier as "starter" | "pro" | "agency") ?? "pro";
    const priceId = STRIPE_PRICES[tier];

    if (!priceId) {
      console.error(`=== CHECKOUT ERROR: No price for tier ${tier} ===`);
      return NextResponse.json(
        { error: `No price configured for tier: ${tier}` },
        { status: 400 }
      );
    }

    console.log(`=== CHECKOUT: tier=${tier}, priceId=${priceId} ===`);

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? profile?.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
      console.log("=== CHECKOUT: Created Stripe customer", customerId);
    } else {
      console.log("=== CHECKOUT: Existing Stripe customer", customerId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 3,
        metadata: { tier, user_id: user.id },
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: { tier, user_id: user.id },
      allow_promotion_codes: true,
    });

    console.log("=== CHECKOUT: Session created", session.id, "URL:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("=== CHECKOUT ERROR ===", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
