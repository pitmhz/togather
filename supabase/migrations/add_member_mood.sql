-- Add current_mood column to members table for mood tracking
ALTER TABLE members ADD COLUMN IF NOT EXISTS current_mood TEXT;

-- Add comment for documentation
COMMENT ON COLUMN members.current_mood IS 'Current mood status: sick, traveling, exam, mourning, happy, or null';
