-- Update profiles table with new subscription fields
ALTER TABLE profiles DROP COLUMN IF EXISTS credits_remaining;
ALTER TABLE profiles DROP COLUMN IF EXISTS improvements_remaining;
ALTER TABLE profiles DROP COLUMN IF EXISTS comparisons_remaining;
ALTER TABLE profiles DROP COLUMN IF EXISTS spy_credits_remaining;
ALTER TABLE profiles DROP COLUMN IF EXISTS generations_remaining;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'agency'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;

-- Monthly usage tracking table
CREATE TABLE IF NOT EXISTS monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  analyses_used INTEGER DEFAULT 0,
  improvements_used INTEGER DEFAULT 0,
  comparisons_used INTEGER DEFAULT 0,
  spy_used INTEGER DEFAULT 0,
  url_generations_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

ALTER TABLE monthly_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own usage" ON monthly_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON monthly_usage;
CREATE POLICY "Users can read own usage" ON monthly_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON monthly_usage FOR ALL USING (auth.uid() = user_id);
