ALTER TABLE members 
ADD COLUMN locale TEXT DEFAULT 'id-ID';

-- Add check constraint for allowed locales
ALTER TABLE members 
ADD CONSTRAINT members_locale_check 
CHECK (locale IN ('id-ID', 'en-US', 'en-AU'));
