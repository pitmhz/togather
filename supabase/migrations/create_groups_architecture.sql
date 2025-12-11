-- ============================================
-- SAAS GROUP ARCHITECTURE MIGRATION
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- Step 1: Create groups table (if not exists)
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  join_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add group_id columns (if not exists)
ALTER TABLE members ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id);

-- Step 3: Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: DROP ALL OLD POLICIES (Clean Slate)
-- ============================================
-- Groups
DROP POLICY IF EXISTS "Authenticated can view groups" ON groups;
DROP POLICY IF EXISTS "Owner can manage groups" ON groups;
DROP POLICY IF EXISTS "Users can view groups" ON groups;

-- Members
DROP POLICY IF EXISTS "Users can view their own members" ON members;
DROP POLICY IF EXISTS "Users can create their own members" ON members;
DROP POLICY IF EXISTS "Users can update their own members" ON members;
DROP POLICY IF EXISTS "Users can delete their own members" ON members;
DROP POLICY IF EXISTS "Authenticated users can view all members" ON members;
DROP POLICY IF EXISTS "Owner can create members" ON members;
DROP POLICY IF EXISTS "Owner can update members" ON members;
DROP POLICY IF EXISTS "Owner can delete members" ON members;

-- Events
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can create their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;
DROP POLICY IF EXISTS "Authenticated users can view all events" ON events;

-- ============================================
-- STEP 5: CREATE MVP POLICIES (Public Read)
-- ============================================
-- Groups: All authenticated can read, owner manages
CREATE POLICY "read_groups" ON groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage_groups" ON groups FOR ALL TO authenticated USING (auth.uid() = owner_id);

-- Members: All authenticated can read (MVP - will tighten later)
CREATE POLICY "read_members" ON members FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_members" ON members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_members" ON members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "delete_members" ON members FOR DELETE TO authenticated USING (true);

-- Events: All authenticated can read (MVP - will tighten later)
CREATE POLICY "read_events" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "write_events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_events" ON events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "delete_events" ON events FOR DELETE TO authenticated USING (true);

-- ============================================
-- STEP 6: DATA RESCUE SCRIPT
-- ============================================
DO $$
DECLARE
  owner_uuid UUID;
  new_group_id UUID;
BEGIN
  -- Find or create owner
  SELECT id INTO owner_uuid FROM auth.users WHERE email = 'pietermardi@gmail.com' LIMIT 1;
  
  IF owner_uuid IS NULL THEN
    -- Fallback to first user
    SELECT id INTO owner_uuid FROM auth.users LIMIT 1;
    RAISE NOTICE 'Owner email not found, using first user: %', owner_uuid;
  END IF;
  
  IF owner_uuid IS NULL THEN
    RAISE EXCEPTION 'No users found in auth.users';
  END IF;

  -- Check if group exists
  SELECT id INTO new_group_id FROM groups WHERE owner_id = owner_uuid LIMIT 1;
  
  IF new_group_id IS NULL THEN
    -- Create the group
    INSERT INTO groups (name, owner_id, join_code) 
    VALUES ('Komsel Serlie', owner_uuid, 'SERLIE01')
    RETURNING id INTO new_group_id;
    
    RAISE NOTICE 'Created group "Komsel Serlie" with id: % and code: SERLIE01', new_group_id;
  ELSE
    RAISE NOTICE 'Group already exists with id: %', new_group_id;
  END IF;
  
  -- Assign ALL orphaned members to this group (regardless of user_id)
  UPDATE members SET group_id = new_group_id WHERE group_id IS NULL;
  RAISE NOTICE 'Updated members with group_id';
  
  -- Assign ALL orphaned events to this group
  UPDATE events SET group_id = new_group_id WHERE group_id IS NULL;
  RAISE NOTICE 'Updated events with group_id';
  
END $$;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Groups' as table_name, COUNT(*) as count FROM groups
UNION ALL
SELECT 'Members' as table_name, COUNT(*) FROM members
UNION ALL
SELECT 'Members with group_id' as table_name, COUNT(*) FROM members WHERE group_id IS NOT NULL
UNION ALL
SELECT 'Events' as table_name, COUNT(*) FROM events
UNION ALL
SELECT 'Events with group_id' as table_name, COUNT(*) FROM events WHERE group_id IS NOT NULL;

-- Show the group
SELECT id, name, join_code, owner_id FROM groups LIMIT 5;
