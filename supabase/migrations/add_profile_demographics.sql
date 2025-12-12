-- ============================================
-- PROFILE DEMOGRAPHICS
-- Run this in Supabase SQL Editor
-- ============================================

-- Add gender and birth_date to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('L', 'P'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Verify
SELECT COUNT(*) as total_profiles FROM profiles;
