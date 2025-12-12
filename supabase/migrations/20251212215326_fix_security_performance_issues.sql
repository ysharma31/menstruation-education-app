/*
  # Fix Security and Performance Issues

  1. Index Changes
    - Add index on `chat_messages.session_id` for foreign key performance
    - Drop unused index `idx_messages_conversation_id` on messages table
    - Drop unused index `idx_messages_created_at` on messages table
    - Drop unused index `idx_conversations_updated_at` on conversations table

  2. Function Security
    - Fix `update_conversation_timestamp` function to use immutable search_path

  3. Notes
    - Auth DB connection strategy must be changed in Supabase dashboard settings
*/

-- Add index for chat_messages foreign key
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);

-- Drop unused indexes
DROP INDEX IF EXISTS public.idx_messages_conversation_id;
DROP INDEX IF EXISTS public.idx_messages_created_at;
DROP INDEX IF EXISTS public.idx_conversations_updated_at;

-- Fix function with mutable search_path
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;
