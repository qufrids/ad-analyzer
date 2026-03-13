import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getTierLimits } from "@/lib/usage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer", "payment_intent"],
    });

    console.log("=== VERIFY SESSION ===", {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
    });

    // Verify the session is valid (completed or trialing)
    const isValid =
      session.status === "complete" ||
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required"; // trial

    if (!isValid) {
      return NextResponse.json({ error: "Session not completed" }, { status: 400 });
    }

    const userId = session.metadata?.user_id;
    const tier = (session.metadata?.tier ?? "pro") as string;

    if (!userId) {
      return NextResponse.json({ error: "No user_id in session metadata" }, { status: 400 });
    }

    // Calculate trial end date (3 days from now)
    const subscription = session.subscription as Stripe.Subscription | null;
    let trialEndsAt: string | null = null;
    let periodEnd: string | null = null;

    if (subscription && typeof subscription === "object") {
      const subRecord = subscription as unknown as Record<string, unknown>;
      if (subRecord.trial_end) {
        trialEndsAt = new Date((subRecord.trial_end as number) * 1000).toISOString();
      }
      if (subRecord.current_period_end) {
        periodEnd = new Date((subRecord.current_period_end as number) * 1000).toISOString();
      }
    }

    // If no trial_end from subscription, calculate 3 days from now
    if (!trialEndsAt) {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      trialEndsAt = d.toISOString();
    }

    // Get customer payment method details (for display)
    let cardBrand: string | null = null;
    let cardLast4: string | null = null;

    if (subscription && typeof subscription === "object" && subscription.default_payment_method) {
      try {
        const pm = await stripe.paymentMethods.retrieve(
          subscription.default_payment_method as string
        );
        cardBrand = pm.card?.brand ?? null;
        cardLast4 = pm.card?.last4 ?? null;
      } catch {
        // non-critical
      }
    }

    // Update the profiles table immediately (don't wait for webhook)
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_tier: tier,
        subscription_status: "active",
        stripe_customer_id:
          typeof session.customer === "string"
            ? session.customer
            : (session.customer as Stripe.Customer)?.id ?? null,
        stripe_subscription_id:
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription as Stripe.Subscription)?.id ?? null,
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd ?? trialEndsAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("=== VERIFY SESSION: Profile update error ===", updateError);
    }

    // Ensure monthly_usage row exists for current month
    await supabase.from("monthly_usage").upsert(
      {
        user_id: userId,
        month_year: getMonthYear(),
        analyses_used: 0,
        improvements_used: 0,
        comparisons_used: 0,
        spy_used: 0,
        url_generations_used: 0,
      },
      { onConflict: "user_id,month_year", ignoreDuplicates: true }
    );

    const tierPrices: Record<string, string> = {
      starter: "$19/month",
      pro: "$39/month",
      agency: "$79/month",
    };

    return NextResponse.json({
      success: true,
      tier,
      trial_ends_at: trialEndsAt,
      period_end: periodEnd,
      price: tierPrices[tier] ?? "$39/month",
      card_brand: cardBrand,
      card_last4: cardLast4,
      features: getTierLimits(tier),
    });
  } catch (err) {
    console.error("=== VERIFY SESSION ERROR ===", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 }
    );
  }
}
