-- Migration for Roles & Demographics
-- 1. Ensure 'role' column exists in 'members' table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'role') THEN
        CREATE TYPE member_role AS ENUM ('admin', 'member');
        ALTER TABLE members ADD COLUMN role member_role DEFAULT 'member';
    END IF;
END $$;


-- 2. Ensure 'birth_date' column exists in 'members' table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'birth_date') THEN
        ALTER TABLE members ADD COLUMN birth_date DATE;
    END IF;
END $$;

-- 3. Ensure 'email' column exists in 'members' table (Required for self-update RLS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'email') THEN
        ALTER TABLE members ADD COLUMN email TEXT;
        -- Optional: Add unique constraint if needed, but for now just allow text
        -- ALTER TABLE members ADD CONSTRAINT members_email_key UNIQUE (email);
    END IF;
END $$;

-- 4. RLS Policies

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin in the group
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

-- MEMBERS Table Policies
DROP POLICY IF EXISTS "read_members" ON members;
CREATE POLICY "read_members" ON members FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_members" ON members;
CREATE POLICY "insert_members" ON members FOR INSERT TO authenticated 
WITH CHECK (
  is_group_admin(group_id) OR
  auth.uid() = (SELECT owner_id FROM groups WHERE id = group_id)
);

DROP POLICY IF EXISTS "update_members" ON members;
CREATE POLICY "update_members" ON members FOR UPDATE TO authenticated
USING (
  -- Allow admins to update anyone in their group
  is_group_admin(group_id) OR
  -- Allow users to update themselves
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "delete_members" ON members;
CREATE POLICY "delete_members" ON members FOR DELETE TO authenticated
USING (
  is_group_admin(group_id)
);

-- EVENTS Table Policies
DROP POLICY IF EXISTS "read_events" ON events;
CREATE POLICY "read_events" ON events FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_events" ON events;
CREATE POLICY "insert_events" ON events FOR INSERT TO authenticated
WITH CHECK (
  is_group_admin(group_id) OR
  auth.uid() = (SELECT owner_id FROM groups WHERE id = group_id)
);

DROP POLICY IF EXISTS "update_events" ON events;
CREATE POLICY "update_events" ON events FOR UPDATE TO authenticated
USING (
  is_group_admin(group_id)
);

DROP POLICY IF EXISTS "delete_events" ON events;
CREATE POLICY "delete_events" ON events FOR DELETE TO authenticated
USING (
  is_group_admin(group_id)
);
