-- Migration: Add avatar_url column to members table
-- Run this in your Supabase SQL editor

ALTER TABLE members ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- No RLS changes needed - existing policies apply
