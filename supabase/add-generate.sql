-- Add generations_remaining to profiles (default 1 for free users)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS generations_remaining INTEGER DEFAULT 1;

UPDATE profiles SET generations_remaining = 1 WHERE generations_remaining IS NULL;

-- Create generated_ads table
CREATE TABLE IF NOT EXISTS generated_ads (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_url  TEXT NOT NULL,
  platforms    TEXT[] NOT NULL,
  tone         TEXT NOT NULL,
  product_info JSONB,
  result       JSONB NOT NULL,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE generated_ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own generated ads"
  ON generated_ads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated ads"
  ON generated_ads FOR INSERT
  WITH CHECK (auth.uid() = user_id);
