-- Add liturgy details columns to events table
-- For worship/service information

-- Sermon passage (e.g., "Yohanes 3:16-17")
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS sermon_passage text;

-- Benediction/devotional verse (e.g., "Bilangan 6:24-26")
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS benediction text;

-- Songs array with label (hymnbook prefix) and details
-- Schema: Array<{ label: 'BE' | 'KJ' | 'BN' | 'PKJ' | 'Lainnya', number: string, title: string }>
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS songs jsonb DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN events.sermon_passage IS 'Bible passage for the sermon/khotbah (e.g., Yohanes 3:16-17)';
COMMENT ON COLUMN events.benediction IS 'Benediction/devotional verse for the week (e.g., Bilangan 6:24-26)';
COMMENT ON COLUMN events.songs IS 'Array of songs with label (BE/KJ/BN/PKJ/Lainnya), number, and title';
