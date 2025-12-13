-- ============================================
-- ONBOARDING SCHEMA MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: UPDATE PROFILES TABLE
-- ============================================

-- Add onboarding status flag
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT FALSE;

-- Add phone field (for WhatsApp contact)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add community_id (FK will be added after communities table)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS community_id UUID;

-- ============================================
-- STEP 2: CREATE COMMUNITIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  church_type TEXT,
  location TEXT,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for invite_code lookups
CREATE INDEX IF NOT EXISTS idx_communities_invite_code ON communities(invite_code);

-- ============================================
-- STEP 3: ADD FOREIGN KEY TO PROFILES
-- ============================================

-- Add FK constraint for community_id (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_community_id_fkey'
  ) THEN
    ALTER TABLE profiles 
      ADD CONSTRAINT profiles_community_id_fkey 
      FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================
-- STEP 4: ENABLE RLS ON COMMUNITIES
-- ============================================

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "read_communities" ON communities;
DROP POLICY IF EXISTS "manage_communities" ON communities;
DROP POLICY IF EXISTS "insert_communities" ON communities;

-- All authenticated users can read communities
CREATE POLICY "read_communities" ON communities 
  FOR SELECT TO authenticated 
  USING (true);

-- Leaders can manage their own communities
CREATE POLICY "manage_communities" ON communities 
  FOR ALL TO authenticated 
  USING (auth.uid() = leader_id);

-- Authenticated users can create communities (for onboarding)
CREATE POLICY "insert_communities" ON communities 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- ============================================
-- STEP 5: VERIFICATION
-- ============================================

-- Check profiles columns
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('is_onboarded', 'phone', 'community_id');

-- Check communities table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'communities';

-- Count existing data
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'communities' as table_name, COUNT(*) FROM communities;
