-- Migration: Add member availability status columns
-- Run this in your Supabase SQL editor

ALTER TABLE members 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable')),
  ADD COLUMN IF NOT EXISTS unavailable_reason TEXT,
  ADD COLUMN IF NOT EXISTS unavailable_until DATE;

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
