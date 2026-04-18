-- Migration: yjs_tables
-- Per D-73: Tables for Yjs state persistence
-- Created: 2026-04-17

-- Full document state snapshots
CREATE TABLE IF NOT EXISTS yjs_documents (
    document_id UUID PRIMARY KEY REFERENCES sync_documents(id) ON DELETE CASCADE,
    state_update TEXT NOT NULL, -- base64 encoded Uint8Array
    state_vector TEXT, -- base64 encoded state vector for incremental sync
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Incremental updates between snapshots (for crash recovery)
CREATE TABLE IF NOT EXISTS yjs_updates (
    id BIGSERIAL PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES sync_documents(id) ON DELETE CASCADE,
    update_data TEXT NOT NULL, -- base64 encoded Uint8Array
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient update retrieval
CREATE INDEX IF NOT EXISTS idx_yjs_updates_document_id ON yjs_updates(document_id, created_at);

-- Comment on tables
COMMENT ON TABLE yjs_documents IS 'Yjs full document state snapshots (base64 encoded)';
COMMENT ON TABLE yjs_updates IS 'Incremental Yjs updates between snapshots';
