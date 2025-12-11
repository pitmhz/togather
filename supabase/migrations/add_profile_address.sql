-- Migration: Add address fields to profiles table
-- Run this in your Supabase SQL editor

ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS maps_link TEXT;
