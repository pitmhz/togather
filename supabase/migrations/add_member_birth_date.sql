-- ============================================
-- BIRTHDAY TRACKING FEATURE
-- Run this in Supabase SQL Editor
-- ============================================

-- Add birth_date column for birthday tracking
ALTER TABLE members ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Verify
SELECT 
  COUNT(*) as total_members,
  COUNT(CASE WHEN birth_date IS NOT NULL THEN 1 END) as with_birthday
FROM members;
