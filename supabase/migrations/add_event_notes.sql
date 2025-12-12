-- ============================================
-- EVENT NOTES FEATURE
-- Run this in Supabase SQL Editor
-- ============================================

-- Add notes column for meeting notes
ALTER TABLE events ADD COLUMN IF NOT EXISTS notes TEXT;

-- Verify
SELECT COUNT(*) as events_count FROM events;
