-- Audit Logs Table for tracking critical user actions
-- Enterprise-grade security: Who did What and When

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  action text NOT NULL,
  details text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index for efficient querying by user and time
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can insert their own logs
CREATE POLICY "Users can insert own logs" ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Only admins can view logs (using the admin role check)
-- This checks if the user has role='admin' in the members table
CREATE POLICY "Admins can view all logs" ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM members 
      WHERE members.user_id = auth.uid() 
      AND members.role = 'admin'
    )
  );

-- Comment for documentation
COMMENT ON TABLE audit_logs IS 'Audit trail for tracking critical user actions';
COMMENT ON COLUMN audit_logs.action IS 'Action type, e.g., CREATE_EVENT, UPDATE_PROFILE, DELETE_MEMBER';
COMMENT ON COLUMN audit_logs.details IS 'Human-readable description of what was done';
COMMENT ON COLUMN audit_logs.user_name IS 'Snapshot of user name at time of action (for historical accuracy)';
