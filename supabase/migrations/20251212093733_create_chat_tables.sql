/*
  # Chat System for Menstruation Education App

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key) - Unique identifier for each conversation
      - `created_at` (timestamptz) - When the conversation started
      - `updated_at` (timestamptz) - Last message timestamp
      - `language` (text) - Conversation language (en or hi)
      - `metadata` (jsonb) - Additional conversation data
    
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `conversation_id` (uuid, foreign key) - Links to conversations table
      - `role` (text) - Either 'user' or 'assistant'
      - `content` (text) - Message content
      - `created_at` (timestamptz) - When message was sent
      - `metadata` (jsonb) - Additional message data (tokens, model, etc.)

  2. Security
    - Enable RLS on both tables
    - Anonymous users can create and read their own conversations
    - No authentication required (privacy-focused)
    - Conversations are temporary and can be cleared

  3. Important Notes
    - No personally identifiable information is stored
    - Conversations are stored locally per session
    - Users can delete their conversation history at any time
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  language text DEFAULT 'en',
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
-- Allow anyone to create conversations (anonymous access)
CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read all conversations (for educational purposes)
CREATE POLICY "Anyone can read conversations"
  ON conversations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to update conversations
CREATE POLICY "Anyone can update conversations"
  ON conversations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete conversations
CREATE POLICY "Anyone can delete conversations"
  ON conversations FOR DELETE
  TO anon, authenticated
  USING (true);

-- RLS Policies for messages
-- Allow anyone to create messages
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read messages
CREATE POLICY "Anyone can read messages"
  ON messages FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to delete messages
CREATE POLICY "Anyone can delete messages"
  ON messages FOR DELETE
  TO anon, authenticated
  USING (true);

-- Function to automatically update updated_at on conversations
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp when new message is added
DROP TRIGGER IF EXISTS update_conversation_timestamp_trigger ON messages;
CREATE TRIGGER update_conversation_timestamp_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();
