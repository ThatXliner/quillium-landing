-- Migration: base_tables
-- Sets up users table (synced from auth.users) and sync_documents table
-- Must run before yjs_tables migration

-- Users table that mirrors auth.users
-- This allows foreign keys from application tables to user IDs
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user record on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync existing auth users to public.users
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Sync documents table for collab
CREATE TABLE IF NOT EXISTS public.sync_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sync_documents ENABLE ROW LEVEL SECURITY;

-- Owner can do anything with their documents
CREATE POLICY "Owner full access" ON public.sync_documents
    FOR ALL USING (auth.uid() = owner_id);

-- Anyone can read documents (for joining collab sessions)
CREATE POLICY "Documents are readable" ON public.sync_documents
    FOR SELECT USING (true);

-- Index for owner lookups
CREATE INDEX IF NOT EXISTS idx_sync_documents_owner ON public.sync_documents(owner_id);

COMMENT ON TABLE public.users IS 'User profiles synced from auth.users';
COMMENT ON TABLE public.sync_documents IS 'Documents registered for real-time sync';
