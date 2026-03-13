"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ToastProvider } from "@/components/toast";
import ThemeToggle from "@/components/ThemeToggle";
import { TIER_DISPLAY } from "@/lib/stripe-config";

const TIER_BADGE: Record<string, string> = {
  free: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  starter: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  pro: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.25)]",
  agency: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-[0_0_8px_rgba(139,92,246,0.25)]",
};

const TRIAL_PRICES: Record<string, string> = {
  starter: "$19",
  pro: "$39",
  agency: "$79",
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    activeMatch: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
      </svg>
    ),
  },
  {
    label: "New Analysis",
    href: "/analyze",
    activeMatch: "/analyze",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "History",
    href: "/history",
    activeMatch: "/history",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "AI Improver",
    href: "/improve",
    activeMatch: "/improve",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    label: "A/B Compare",
    href: "/compare",
    activeMatch: "/compare",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    label: "Competitor Spy",
    href: "/spy",
    activeMatch: "/spy",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: "Generate from URL",
    href: "/generate",
    activeMatch: "/generate",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    label: "Swipe File",
    href: "/swipe-file",
    activeMatch: "/swipe-file",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v1H3V7zm0 4h18M3 15h18M3 19h18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 11v8a2 2 0 002 2h14a2 2 0 002-2v-8" />
      </svg>
    ),
  },
  {
    label: "Pricing",
    href: "/pricing",
    activeMatch: "/pricing",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    activeMatch: "/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

interface ProfileData {
  subscription_tier: string;
  subscription_status: string;
  current_period_end: string | null;
}

function TrialBanner({
  tier,
  periodEnd,
  onDismiss,
}: {
  tier: string;
  periodEnd: string | null;
  onDismiss: () => void;
}) {
  const daysLeft = periodEnd
    ? Math.max(0, Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 3;

  const chargeDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "in 3 days";

  return (
    <div className="relative bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 px-4 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[12px] text-blue-700 dark:text-blue-300 truncate">
          <span className="font-semibold">
            {daysLeft === 0 ? "Trial ends today" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left on your free trial`}
          </span>
          {" — "}
          Your card will be charged{" "}
          <span className="font-semibold">{TRIAL_PRICES[tier] ?? "$39"}</span> on {chargeDate}.{" "}
          <Link href="/settings" className="underline underline-offset-2 hover:text-blue-900 dark:hover:text-blue-100">
            Manage
          </Link>
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 transition"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function isWithinTrial(periodEnd: string | null): boolean {
  if (!periodEnd) return false;
  const end = new Date(periodEnd);
  const start = new Date(end.getTime() - 3 * 24 * 60 * 60 * 1000);
  const now = new Date();
  return now < end && now >= start;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [trialDismissed, setTrialDismissed] = useState(false);

  useEffect(() => {
    // Check if trial banner was dismissed this session
    if (typeof window !== "undefined") {
      setTrialDismissed(sessionStorage.getItem("trial_banner_dismissed") === "1");
    }

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserEmail(user.email ?? "");

      const { data: p } = await supabase
        .from("profiles")
        .select("subscription_tier, subscription_status, current_period_end")
        .eq("id", user.id)
        .single();

      if (p) setProfile(p as ProfileData);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDismissTrialBanner() {
    setTrialDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("trial_banner_dismissed", "1");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const tier = profile?.subscription_tier ?? "free";
  const showTrialBanner =
    !trialDismissed &&
    profile?.subscription_status === "active" &&
    tier !== "free" &&
    isWithinTrial(profile?.current_period_end ?? null);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        {/* Trial banner */}
        {showTrialBanner && (
          <TrialBanner
            tier={tier}
            periodEnd={profile?.current_period_end ?? null}
            onDismiss={handleDismissTrialBanner}
          />
        )}

        <div className="flex flex-1">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    AdScore AI
                  </span>
                </Link>
              </div>

              {/* Nav */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.activeMatch ||
                    (item.activeMatch !== "/dashboard" && pathname.startsWith(item.activeMatch));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-600/10 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User section */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">{userEmail}</span>
                  {tier && (
                    <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TIER_BADGE[tier] ?? TIER_BADGE.free}`}>
                      {TIER_DISPLAY[tier]?.label ?? "Free"}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top bar */}
            <header className="h-14 sm:h-16 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden lg:block" />
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</span>
                  {tier && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TIER_BADGE[tier] ?? TIER_BADGE.free}`}>
                      {TIER_DISPLAY[tier]?.label ?? "Free"}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition hidden sm:block"
                >
                  Log out
                </button>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
