-- ============================================
-- RBAC MIGRATION: Add Role Column to Members
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Add role column with enum type
DO $$ 
BEGIN
  -- Create enum if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_role') THEN
    CREATE TYPE member_role AS ENUM ('admin', 'member');
  END IF;
END $$;

-- Add role column to members table
ALTER TABLE members 
  ADD COLUMN IF NOT EXISTS role member_role DEFAULT 'member';

-- Step 2: Set existing owner as admin
-- Find group owner and set their member record (if exists) to admin
UPDATE members m
SET role = 'admin'
FROM groups g
WHERE m.group_id = g.id
  AND m.email = (
    SELECT email FROM auth.users WHERE id = g.owner_id
  );

-- Also set the hardcoded owner email as admin (fallback)
UPDATE members 
SET role = 'admin' 
WHERE email = 'pietermardi@gmail.com';

-- ============================================
-- STEP 3: OVERHAUL RLS POLICIES
-- ============================================

-- Helper function to check if user is admin in their group
CREATE OR REPLACE FUNCTION is_group_admin(check_group_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM members 
    WHERE members.group_id = check_group_id
      AND members.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND members.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MEMBERS TABLE POLICIES
-- ============================================
DROP POLICY IF EXISTS "read_members" ON members;
DROP POLICY IF EXISTS "write_members" ON members;
DROP POLICY IF EXISTS "update_members" ON members;
DROP POLICY IF EXISTS "delete_members" ON members;

-- Anyone authenticated can read members (for role assignment dropdowns)
CREATE POLICY "members_select" ON members 
  FOR SELECT TO authenticated 
  USING (true);

-- Only admins can insert members into their group
CREATE POLICY "members_insert" ON members 
  FOR INSERT TO authenticated 
  WITH CHECK (
    is_group_admin(group_id) OR 
    -- Allow first member insert (bootstrap case - group owner adding themselves)
    auth.uid() = (SELECT owner_id FROM groups WHERE id = group_id)
  );

-- Only admins can update members in their group
CREATE POLICY "members_update" ON members 
  FOR UPDATE TO authenticated 
  USING (
    is_group_admin(group_id) OR
    -- Allow users to update their own record (e.g., profile updates)
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Only admins can delete members from their group
CREATE POLICY "members_delete" ON members 
  FOR DELETE TO authenticated 
  USING (is_group_admin(group_id));

-- ============================================
-- EVENTS TABLE POLICIES  
-- ============================================
DROP POLICY IF EXISTS "read_events" ON events;
DROP POLICY IF EXISTS "write_events" ON events;
DROP POLICY IF EXISTS "update_events" ON events;
DROP POLICY IF EXISTS "delete_events" ON events;

-- Anyone authenticated can read events
CREATE POLICY "events_select" ON events 
  FOR SELECT TO authenticated 
  USING (true);

-- Only admins can create events in their group
CREATE POLICY "events_insert" ON events 
  FOR INSERT TO authenticated 
  WITH CHECK (is_group_admin(group_id));

-- Only admins can update events in their group
CREATE POLICY "events_update" ON events 
  FOR UPDATE TO authenticated 
  USING (is_group_admin(group_id));

-- Only admins can delete events from their group
CREATE POLICY "events_delete" ON events 
  FOR DELETE TO authenticated 
  USING (is_group_admin(group_id));

-- ============================================
-- EVENT_ROLES TABLE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can view all roles" ON event_roles;
DROP POLICY IF EXISTS "Users can create roles for their events" ON event_roles;
DROP POLICY IF EXISTS "Users can update roles for their events" ON event_roles;
DROP POLICY IF EXISTS "Users can delete roles from their events" ON event_roles;

CREATE POLICY "event_roles_select" ON event_roles 
  FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "event_roles_insert" ON event_roles 
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
      AND is_group_admin(e.group_id)
    )
  );

CREATE POLICY "event_roles_update" ON event_roles 
  FOR UPDATE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
      AND is_group_admin(e.group_id)
    )
  );

CREATE POLICY "event_roles_delete" ON event_roles 
  FOR DELETE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
      AND is_group_admin(e.group_id)
    )
  );

-- ============================================
-- EVENT_ATTENDANCE TABLE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can view all attendance" ON event_attendance;
DROP POLICY IF EXISTS "Users can manage attendance for their events" ON event_attendance;

CREATE POLICY "event_attendance_select" ON event_attendance 
  FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "event_attendance_all" ON event_attendance 
  FOR ALL TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = event_id 
      AND is_group_admin(e.group_id)
    )
  );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT 'Members with roles' as check_name, COUNT(*) as count FROM members WHERE role IS NOT NULL;
SELECT 'Admins' as check_name, COUNT(*) as count FROM members WHERE role = 'admin';
SELECT 'Regular Members' as check_name, COUNT(*) as count FROM members WHERE role = 'member';
