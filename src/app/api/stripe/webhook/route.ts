import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { TIER_FROM_PRICE } from "@/lib/stripe-config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const tier = (session.metadata?.tier ?? 'pro') as string;
        const userId = session.metadata?.user_id;

        await supabase
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_status: "active",
            stripe_subscription_id: session.subscription as string,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        // Ensure monthly_usage row exists for this month
        if (userId) {
          await supabase
            .from("monthly_usage")
            .upsert(
              { user_id: userId, month_year: getMonthYear(), analyses_used: 0, improvements_used: 0, comparisons_used: 0, spy_used: 0, url_generations_used: 0 },
              { onConflict: 'user_id,month_year', ignoreDuplicates: true }
            );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        const subStatus =
          status === "active" || status === "trialing"
            ? "active"
            : status === "past_due"
            ? "past_due"
            : status === "canceled" || status === "unpaid"
            ? "cancelled"
            : "active";

        // Determine tier from price
        const priceId = subscription.items.data[0]?.price?.id;
        const tier = priceId ? (TIER_FROM_PRICE[priceId] ?? 'pro') : 'pro';

        const updates: Record<string, unknown> = {
          subscription_status: subStatus,
          updated_at: new Date().toISOString(),
        };

        if (subStatus === "active" || subStatus === "past_due") {
          updates.subscription_tier = tier;
        }

        const sub = subscription as unknown as Record<string, unknown>;
        if (sub.current_period_start) {
          updates.current_period_start = new Date((sub.current_period_start as number) * 1000).toISOString();
        }
        if (sub.current_period_end) {
          updates.current_period_end = new Date((sub.current_period_end as number) * 1000).toISOString();
        }

        await supabase.from("profiles").update(updates).eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_status: "cancelled",
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabase
          .from("profiles")
          .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
