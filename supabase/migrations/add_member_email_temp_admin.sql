-- Migration: Add email and temp admin fields to members table
-- Run this in your Supabase SQL editor

ALTER TABLE members 
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS temp_admin_until TIMESTAMPTZ;

-- Index for efficient temp admin lookups
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_temp_admin ON members(temp_admin_until) WHERE temp_admin_until IS NOT NULL;
