-- Create invite_codes table for beta access
CREATE TABLE IF NOT EXISTS invite_codes (
  code TEXT PRIMARY KEY,
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id),
  assigned_role TEXT DEFAULT 'leader',
  quota_limit INT DEFAULT 1,
  used_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- Add is_demo column to profiles for identifying demo users
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Insert initial invite codes for beta
INSERT INTO invite_codes (code, assigned_role, quota_limit) VALUES
  ('BETA2024', 'leader', 100),
  ('EARLYVIP', 'leader', 50),
  ('TOGATHER', 'leader', 100),
  ('TESTCODE', 'leader', 10)
ON CONFLICT (code) DO NOTHING;

-- Add index for faster code lookups
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);

-- Add comment for documentation
COMMENT ON TABLE invite_codes IS 'Beta invite codes for sandbox demo access';
COMMENT ON COLUMN profiles.is_demo IS 'True if this is a demo/sandbox user for easy cleanup';
