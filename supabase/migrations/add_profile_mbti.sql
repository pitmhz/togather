-- ============================================
-- MBTI PERSONALITY PROFILER
-- Run this in Supabase SQL Editor
-- ============================================

-- Add MBTI columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mbti TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mbti_summary TEXT;

-- Verify
SELECT COUNT(*) as total_profiles FROM profiles;
