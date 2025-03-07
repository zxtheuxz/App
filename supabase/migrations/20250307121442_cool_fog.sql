/*
  # Create Bible Bookmarks Table

  1. New Tables
    - `bible_bookmarks`
      - `id` (text, primary key) - Composite ID of userId:verseId
      - `user_id` (uuid, references auth.users)
      - `verse_id` (text) - Composite ID of translation:reference
      - `reference` (text) - Bible verse reference
      - `note` (text, nullable) - Optional user note
      - `tags` (text[]) - Array of tags
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own bookmarks
*/

CREATE TABLE IF NOT EXISTS bible_bookmarks (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  verse_id text NOT NULL,
  reference text NOT NULL,
  note text,
  tags text[],
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bible_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own bookmarks"
  ON bible_bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookmarks"
  ON bible_bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON bible_bookmarks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bible_bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX bible_bookmarks_user_id_idx ON bible_bookmarks (user_id);
CREATE INDEX bible_bookmarks_verse_id_idx ON bible_bookmarks (verse_id);
CREATE INDEX bible_bookmarks_reference_idx ON bible_bookmarks (reference);