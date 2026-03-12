"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/toast";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_status: string;
  subscription_tier: string;
}

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [syncing, setSyncing] = useState(false);

  async function syncSubscription(silent = false) {
    setSyncing(true);
    try {
      const res = await fetch("/api/stripe/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");

      if (data.synced) {
        // Reload profile from DB
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: p } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          if (p) {
            setProfile({ ...p, email: user.email ?? "" });
            setFullName(p.full_name ?? "");
          }
        }
        if (!silent) toast("Subscription synced — you're now on Pro!", "success");
        // Clean up URL param
        router.replace("/settings");
      } else if (!silent) {
        toast("Already up to date.", "info");
      }
    } catch (err) {
      if (!silent) toast(err instanceof Error ? err.message : "Sync failed", "error");
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({ ...data, email: user.email ?? "" });
        setFullName(data.full_name ?? "");
      }

      // Auto-sync if returning from Stripe checkout
      if (searchParams.get("upgraded") === "true") {
        await syncSubscription(true);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", profile.id);

    setSaving(false);
    if (updateErr) {
      toast("Failed to save profile. Please try again.", "error");
      return;
    }
    setSaved(true);
    toast("Profile saved successfully.", "success");
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleUpgrade(tier: string = 'pro') {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to start checkout");
      }
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start checkout";
      toast(msg, "error");
      setStripeLoading(false);
    }
  }

  async function handleManageSubscription() {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to open billing portal");
      }
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to open billing portal";
      toast(msg, "error");
      setStripeLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      toast("Failed to delete account. Please try again.", "error");
      setDeleting(false);
    }
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-40 bg-gray-100 dark:bg-gray-900 rounded-xl" />
          <div className="h-40 bg-gray-100 dark:bg-gray-900 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and subscription.</p>
      </div>

      {/* Profile */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Your name"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {saved && (
              <span className="text-sm text-green-400">Saved successfully</span>
            )}
          </div>
        </form>
      </section>

      {/* Subscription */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription</h2>

        {/* Current plan badge */}
        <div className="flex items-center gap-3 mb-5">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
            profile.subscription_tier === 'agency'
              ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-400/10 border-purple-200 dark:border-purple-400/20'
              : profile.subscription_tier === 'pro'
              ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20'
              : profile.subscription_tier === 'starter'
              ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-400/10 border-cyan-200 dark:border-cyan-400/20'
              : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
          }`}>
            {(profile.subscription_tier || 'free').charAt(0).toUpperCase() + (profile.subscription_tier || 'free').slice(1)}
          </span>
          <span className="text-sm text-gray-500">
            {profile.subscription_tier === 'agency' ? 'Unlimited everything'
              : profile.subscription_tier === 'pro' ? '200 analyses, 40 improvements/month'
              : profile.subscription_tier === 'starter' ? '50 analyses, 10 improvements/month'
              : '3 analyses, 1 improvement per month'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {profile.subscription_tier !== 'free' ? (
            <button
              onClick={handleManageSubscription}
              disabled={stripeLoading}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-750 transition disabled:opacity-50"
            >
              {stripeLoading ? "Loading..." : "Manage Subscription"}
            </button>
          ) : null}

          {/* Upgrade options for non-agency tiers */}
          {profile.subscription_tier !== 'agency' && (
            <div className="flex items-center gap-2 flex-wrap">
              {profile.subscription_tier === 'free' && (
                <button onClick={() => handleUpgrade('starter')} disabled={stripeLoading}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50">
                  {stripeLoading ? "..." : "Starter — $19/mo"}
                </button>
              )}
              {(profile.subscription_tier === 'free' || profile.subscription_tier === 'starter') && (
                <button onClick={() => handleUpgrade('pro')} disabled={stripeLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition disabled:opacity-50">
                  {stripeLoading ? "Loading..." : "Pro — $39/mo ⭐"}
                </button>
              )}
              <button onClick={() => handleUpgrade('agency')} disabled={stripeLoading}
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition disabled:opacity-50">
                {stripeLoading ? "..." : "Agency — $79/mo"}
              </button>
            </div>
          )}
        </div>

        {profile.subscription_tier === 'free' && (
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">7-day free trial on all paid plans. Cancel anytime.</p>
        )}
      </section>

      {/* Danger Zone */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-red-200 dark:border-red-900/50 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-400 text-sm font-medium rounded-lg hover:bg-red-600/20 transition"
        >
          Delete account
        </button>
      </section>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete account</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This will permanently delete your account, all analyses, and data. This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Type <span className="text-gray-900 dark:text-white font-mono">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="DELETE"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || deleting}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete my account"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:text-gray-900 dark:hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
