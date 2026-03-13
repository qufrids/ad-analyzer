import { createClient } from "@/lib/supabase/server";
export { TIER_LIMITS, getTierLimits } from "@/lib/tier-limits";
import { TIER_LIMITS, getTierLimits } from "@/lib/tier-limits";

export type ActionType = 'analyses' | 'improvements' | 'comparisons' | 'spy' | 'urlGenerations';

export function getMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
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
