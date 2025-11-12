-- Add capacity column to tables
ALTER TABLE tables ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 4;

-- Update existing tables to have proper capacity values
UPDATE tables SET capacity = 4 WHERE capacity IS NULL;

-- Add a check constraint to ensure capacity is valid (2, 4, 6, or 8)
ALTER TABLE tables ADD CONSTRAINT valid_capacity CHECK (capacity IN (2, 4, 6, 8));

-- Add comment to the column
COMMENT ON COLUMN tables.capacity IS 'Number of people the table can accommodate (2, 4, 6, or 8)';
