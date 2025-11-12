-- Add INSERT policy for tables
-- This allows authenticated users (especially admins) to insert new tables

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated users to insert tables" ON tables;

-- Create INSERT policy for tables
CREATE POLICY "Allow authenticated users to insert tables"
ON tables
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Optional: If you want to restrict to admins only, use this instead:
-- CREATE POLICY "Allow admins to insert tables"
-- ON tables
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM users
--     WHERE users.id = auth.uid()
--     AND users.role = 'admin'
--   )
-- );
