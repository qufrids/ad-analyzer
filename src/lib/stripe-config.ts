export const STRIPE_PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro: process.env.STRIPE_PRICE_PRO,
  agency: process.env.STRIPE_PRICE_AGENCY,
};

export const TIER_FROM_PRICE: Record<string, string> = {};
if (process.env.STRIPE_PRICE_STARTER) TIER_FROM_PRICE[process.env.STRIPE_PRICE_STARTER] = 'starter';
if (process.env.STRIPE_PRICE_PRO) TIER_FROM_PRICE[process.env.STRIPE_PRICE_PRO] = 'pro';
if (process.env.STRIPE_PRICE_AGENCY) TIER_FROM_PRICE[process.env.STRIPE_PRICE_AGENCY] = 'agency';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'agency';

export const TIER_DISPLAY: Record<string, { label: string; price: string }> = {
  free: { label: 'Free', price: '$0' },
  starter: { label: 'Starter', price: '$19/mo' },
  pro: { label: 'Pro', price: '$39/mo' },
  agency: { label: 'Agency', price: '$79/mo' },
};

export const TIER_ORDER = ['free', 'starter', 'pro', 'agency'];

export function hasAccess(userTier: string, requiredTier: string): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(requiredTier);
}
