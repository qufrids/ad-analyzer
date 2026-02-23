-- Migration: Add AI Improver columns
-- Run this in the Supabase SQL editor

ALTER TABLE analyses
  ADD COLUMN IF NOT EXISTS improvement_result JSONB,
  ADD COLUMN IF NOT EXISTS improvement_generated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS improvements_remaining INTEGER DEFAULT 1;

-- Set existing users to 1 free improvement
UPDATE profiles
  SET improvements_remaining = 1
  WHERE improvements_remaining IS NULL;
