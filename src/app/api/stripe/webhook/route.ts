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
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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
    console.error("=== WEBHOOK: Signature verification failed ===", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`=== WEBHOOK EVENT: ${event.type} ===`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const tier = (session.metadata?.tier ?? "pro") as string;
        const userId = session.metadata?.user_id;

        console.log("=== CHECKOUT COMPLETE ===", { userId, tier, customerId });

        await supabase
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_status: "active",
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        // Ensure monthly_usage row exists
        if (userId) {
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

        const priceId = subscription.items.data[0]?.price?.id;
        const tier = priceId ? (TIER_FROM_PRICE[priceId] ?? "pro") : "pro";

        console.log("=== SUBSCRIPTION UPDATED ===", { status, subStatus, tier, customerId });

        const updates: Record<string, unknown> = {
          subscription_status: subStatus,
          updated_at: new Date().toISOString(),
        };

        if (subStatus === "active" || subStatus === "past_due") {
          updates.subscription_tier = tier;
        }

        const subRecord = subscription as unknown as Record<string, unknown>;
        if (subRecord.current_period_start) {
          updates.current_period_start = new Date((subRecord.current_period_start as number) * 1000).toISOString();
        }
        if (subRecord.current_period_end) {
          updates.current_period_end = new Date((subRecord.current_period_end as number) * 1000).toISOString();
        }

        await supabase.from("profiles").update(updates).eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log("=== SUBSCRIPTION CANCELLED ===", { customerId });

        await supabase
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_status: "cancelled",
            stripe_subscription_id: null,
            current_period_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        console.log("=== PAYMENT SUCCEEDED ===", { customerId, amount: invoice.amount_paid });

        const updates: Record<string, unknown> = {
          subscription_status: "active",
          updated_at: new Date().toISOString(),
        };

        // Update billing period from invoice
        const invoiceRecord = invoice as unknown as Record<string, unknown>;
        const periodStart = invoiceRecord.period_start as number | undefined;
        const periodEnd = invoiceRecord.period_end as number | undefined;
        if (periodStart) updates.current_period_start = new Date(periodStart * 1000).toISOString();
        if (periodEnd) updates.current_period_end = new Date(periodEnd * 1000).toISOString();

        await supabase.from("profiles").update(updates).eq("stripe_customer_id", customerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        console.log("=== PAYMENT FAILED ===", { customerId });

        // Mark past_due but don't immediately downgrade — give time to fix
        await supabase
          .from("profiles")
          .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        // Fires 3 days before trial ends — log for now, send email later
        console.log("=== TRIAL ENDING SOON ===", { customerId, trialEnd: subscription.trial_end });
        break;
      }

      default:
        console.log(`=== WEBHOOK: Unhandled event type ${event.type} ===`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("=== WEBHOOK HANDLER ERROR ===", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
