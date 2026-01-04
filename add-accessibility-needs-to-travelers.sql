-- Add accessibility_needs column to additional_travelers table
ALTER TABLE additional_travelers
ADD COLUMN accessibility_needs JSONB DEFAULT '[]'::jsonb;