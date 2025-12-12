-- Add privacy_masked column to members table
-- This controls whether sensitive data (email, phone, address) is obscured in UI

ALTER TABLE members 
ADD COLUMN IF NOT EXISTS privacy_masked boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN members.privacy_masked IS 'When true, sensitive personal data is masked in the UI for privacy';
