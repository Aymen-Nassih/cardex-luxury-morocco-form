-- Apply accessibility needs migration to additional_travelers table
ALTER TABLE additional_travelers
ADD COLUMN IF NOT EXISTS accessibility_needs JSONB DEFAULT '[]'::jsonb;

-- Update existing records to have empty accessibility_needs array if NULL
UPDATE additional_travelers 
SET accessibility_needs = '[]'::jsonb 
WHERE accessibility_needs IS NULL;