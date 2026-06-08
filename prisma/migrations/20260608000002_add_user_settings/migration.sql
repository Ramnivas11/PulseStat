-- Add settings JSON column to users for storing preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='"User"'::text OR table_name='user'
    AND column_name='settings'
  ) THEN
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS settings jsonb;
  ELSE
    -- If column already exists, do nothing
    RAISE NOTICE 'settings column already exists on "User"';
  END IF;
END$$;
