-- Add spy_credits_remaining to profiles (default 1 for free users)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS spy_credits_remaining INTEGER DEFAULT 1;

UPDATE profiles SET spy_credits_remaining = 1 WHERE spy_credits_remaining IS NULL;

-- Create spy_analyses table
CREATE TABLE IF NOT EXISTS spy_analyses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url    TEXT NOT NULL,
  platform     TEXT NOT NULL,
  niche        TEXT NOT NULL,
  user_product TEXT,
  result       JSONB NOT NULL,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE spy_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own spy analyses"
  ON spy_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spy analyses"
  ON spy_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
