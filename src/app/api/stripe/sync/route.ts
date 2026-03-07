import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, subscription_status")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ status: "free", message: "No Stripe customer found" });
    }

    // Fetch active subscriptions from Stripe directly
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "active",
      limit: 1,
    });

    const isActive = subscriptions.data.length > 0;

    if (isActive && profile.subscription_status !== "active") {
      await supabase
        .from("profiles")
        .update({
          subscription_status: "active",
          credits_remaining: 999999,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      return NextResponse.json({ status: "active", synced: true });
    }

    if (!isActive && profile.subscription_status === "active") {
      // Check for cancelled/past_due subscriptions
      const allSubs = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        limit: 1,
      });

      const stripeStatus = allSubs.data[0]?.status ?? "none";
      const newStatus =
        stripeStatus === "canceled" || stripeStatus === "unpaid" ? "cancelled" : "free";

      await supabase
        .from("profiles")
        .update({
          subscription_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      return NextResponse.json({ status: newStatus, synced: true });
    }

    return NextResponse.json({ status: profile.subscription_status, synced: false });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
