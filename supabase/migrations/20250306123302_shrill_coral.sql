/*
  # Add avatar URL to profiles table

  1. Changes
    - Add `avatar_url` column to `profiles` table for storing user profile images
    - Column is nullable since not all users will have an avatar
    - Default value is NULL

  2. Security
    - Maintains existing RLS policies
    - No additional policies needed for this column
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
END $$;