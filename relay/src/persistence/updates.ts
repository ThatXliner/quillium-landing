/**
 * updates.ts -- Persist collab updates to Supabase Postgres per D-40.
 *
 * Every update is persisted BEFORE broadcasting to clients.
 * Uses retry wrapper for transient failure recovery.
 */
import type { Update } from "@codemirror/collab";
import { supabase } from "../auth/supabase.js";
import { withRetry } from "./retry.js";

/** Result of a persistence operation */
export interface PersistResult {
    success: boolean;
    error?: string;
}

/**
 * Persist updates to collab_updates table.
 * Per D-40: Updates must be persisted before broadcasting.
 *
 * @param documentId - Document UUID
 * @param updates - Array of updates to persist
 * @param startVersion - Version after these updates (used to calculate individual versions)
 */
export async function persistUpdates(
    documentId: string,
    updates: Update[],
    startVersion: number,
): Promise<PersistResult> {
    if (!supabase) {
        return { success: false, error: "Supabase not configured" };
    }

    // Build rows with correct version numbers
    // startVersion is the version AFTER all updates, so we work backwards
    const rows = updates.map((update, i) => ({
        document_id: documentId,
        version: startVersion - updates.length + i + 1,
        client_id: update.clientID,
        changes: update.changes.toJSON(), // CRITICAL: use toJSON() for proper serialization
    }));

    // Capture supabase in local const to satisfy TypeScript narrowing
    const client = supabase;
    const result = await withRetry(
        async () => {
            const res = await client.from("collab_updates").insert(rows);
            return { data: null, error: res.error };
        },
        `persistUpdates(${documentId.slice(0, 8)}..., ${updates.length} updates)`,
    );

    return { success: result.success, error: result.error ?? undefined };
}

/**
 * Get the maximum version for a document.
 * Used to determine starting version when loading room from DB.
 *
 * @param documentId - Document UUID
 * @returns Maximum version, or 0 if no updates exist
 */
export async function getMaxVersion(documentId: string): Promise<number> {
    if (!supabase) {
        return 0;
    }

    const { data, error } = await supabase
        .from("collab_updates")
        .select("version")
        .eq("document_id", documentId)
        .order("version", { ascending: false })
        .limit(1)
        .single();

    if (error || !data) {
        return 0;
    }

    return data.version ?? 0;
}
