import { createClient } from "@/lib/supabase/server";

export type ActionType = 'analyses' | 'improvements' | 'comparisons' | 'spy' | 'urlGenerations';

export const TIER_LIMITS = {
  free:    { analyses: 3,      improvements: 1,      comparisons: 0,   spy: 0,   urlGenerations: 0,      swipeFileGenerate: false, performanceTracker: false, performanceExport: false },
  starter: { analyses: 50,     improvements: 10,     comparisons: 5,   spy: 0,   urlGenerations: 0,      swipeFileGenerate: true,  performanceTracker: true,  performanceExport: false },
  pro:     { analyses: 200,    improvements: 40,     comparisons: 20,  spy: 10,  urlGenerations: 5,      swipeFileGenerate: true,  performanceTracker: true,  performanceExport: true  },
  agency:  { analyses: 999999, improvements: 999999, comparisons: 999999, spy: 999999, urlGenerations: 999999, swipeFileGenerate: true, performanceTracker: true, performanceExport: true  },
};

export function getMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getTierLimits(tier: string) {
  return TIER_LIMITS[tier as keyof typeof TIER_LIMITS] ?? TIER_LIMITS.free;
}

const ACTION_COLUMN: Record<ActionType, string> = {
  analyses: 'analyses_used',
  improvements: 'improvements_used',
  comparisons: 'comparisons_used',
  spy: 'spy_used',
  urlGenerations: 'url_generations_used',
};

export async function getCurrentUsage(userId: string) {
  const supabase = await createClient();
  const monthYear = getMonthYear();

  const { data: existing } = await supabase
    .from('monthly_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month_year', monthYear)
    .single();

  if (existing) return existing;

  const { data: created } = await supabase
    .from('monthly_usage')
    .insert({ user_id: userId, month_year: monthYear, analyses_used: 0, improvements_used: 0, comparisons_used: 0, spy_used: 0, url_generations_used: 0 })
    .select()
    .single();

  return created;
}

export async function canPerformAction(userId: string, action: ActionType, tierOverride?: string) {
  const supabase = await createClient();

  let tier: string = tierOverride ?? '';
  if (!tier) {
    const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', userId).single();
    tier = (profile?.subscription_tier as string | null) ?? 'free';
  }

  const limits = getTierLimits(tier);
  const limit = limits[action as keyof typeof limits] as number;

  if (limit === 0) {
    return { allowed: false, used: 0, limit: 0, remaining: 0, tier };
  }

  const usage = await getCurrentUsage(userId);
  const column = ACTION_COLUMN[action];
  const used = (usage as Record<string, number>)?.[column] ?? 0;
  const remaining = Math.max(0, limit - used);

  return { allowed: remaining > 0, used, limit, remaining, tier };
}

export async function incrementUsage(userId: string, action: ActionType) {
  const supabase = await createClient();
  const monthYear = getMonthYear();
  const column = ACTION_COLUMN[action];

  const usage = await getCurrentUsage(userId);
  const current = (usage as Record<string, number>)?.[column] ?? 0;

  await supabase
    .from('monthly_usage')
    .update({ [column]: current + 1 })
    .eq('user_id', userId)
    .eq('month_year', monthYear);
}
