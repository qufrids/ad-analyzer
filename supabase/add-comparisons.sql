-- Add comparisons_remaining to profiles (default 1 for free users)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS comparisons_remaining INTEGER DEFAULT 1;

UPDATE profiles SET comparisons_remaining = 1 WHERE comparisons_remaining IS NULL;

-- Create comparisons table
CREATE TABLE IF NOT EXISTS comparisons (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_a_url   TEXT NOT NULL,
  image_b_url   TEXT NOT NULL,
  platform      TEXT NOT NULL,
  niche         TEXT NOT NULL,
  result        JSONB NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own comparisons"
  ON comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own comparisons"
  ON comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);
