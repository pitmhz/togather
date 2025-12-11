-- Migration: Update RLS policies for Public Read, Owner Write
-- Run this in your Supabase SQL editor

-- ============================================
-- EVENTS TABLE
-- ============================================
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own events" ON events;
DROP POLICY IF EXISTS "Users can create their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- New policies: Public Read for all authenticated, Owner Write
CREATE POLICY "Authenticated users can view all events" 
  ON events FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create their own events" 
  ON events FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" 
  ON events FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" 
  ON events FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- ============================================
-- MEMBERS TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view their own members" ON members;
DROP POLICY IF EXISTS "Users can create their own members" ON members;
DROP POLICY IF EXISTS "Users can update their own members" ON members;
DROP POLICY IF EXISTS "Users can delete their own members" ON members;

CREATE POLICY "Authenticated users can view all members" 
  ON members FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create their own members" 
  ON members FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own members" 
  ON members FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own members" 
  ON members FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- ============================================
-- EVENT_ROLES TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view roles for their events" ON event_roles;
DROP POLICY IF EXISTS "Users can create roles for their events" ON event_roles;
DROP POLICY IF EXISTS "Users can update roles for their events" ON event_roles;
DROP POLICY IF EXISTS "Users can delete roles from their events" ON event_roles;

CREATE POLICY "Authenticated users can view all roles" 
  ON event_roles FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create roles for their events" 
  ON event_roles FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_roles.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update roles for their events" 
  ON event_roles FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_roles.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete roles from their events" 
  ON event_roles FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_roles.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- ============================================
-- EVENT_ATTENDANCE TABLE
-- ============================================
DROP POLICY IF EXISTS "Users can view attendance for their events" ON event_attendance;
DROP POLICY IF EXISTS "Users can manage attendance for their events" ON event_attendance;

CREATE POLICY "Authenticated users can view all attendance" 
  ON event_attendance FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can manage attendance for their events" 
  ON event_attendance FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attendance.event_id 
      AND events.user_id = auth.uid()
    )
  );
