-- ============================================
-- EVENT COVER PHOTO FEATURE
-- Run this in Supabase SQL Editor
-- ============================================

-- Add cover_url column for event cover photos
ALTER TABLE events ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Verify
SELECT COUNT(*) as events_count FROM events;
