-- ============================================
-- PHASE 2: MEMBER MANAGEMENT ENHANCEMENTS
-- Run this in Supabase SQL Editor
-- ============================================

-- Add gender column (L = Laki-laki, P = Perempuan)
ALTER TABLE members ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('L', 'P'));

-- Add is_active column for soft delete
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Set all existing members to active
UPDATE members SET is_active = true WHERE is_active IS NULL;

-- Verify
SELECT 
  COUNT(*) as total_members,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_members,
  COUNT(CASE WHEN gender = 'L' THEN 1 END) as male,
  COUNT(CASE WHEN gender = 'P' THEN 1 END) as female
FROM members;
