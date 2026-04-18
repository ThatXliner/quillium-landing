/**
 * yjsUpdates.ts -- Yjs state persistence to Supabase.
 *
 * Per D-73: Store Yjs state using Y.encodeStateAsUpdate() / Y.applyUpdate().
 * Uses a new yjs_documents table (or adapts collab_updates).
 *
 * Storage format:
 * - state_update: Uint8Array encoded as base64 (bytea in Postgres)
 * - state_vector: Uint8Array encoded as base64 (for incremental sync)
 */
import * as Y from "yjs";
import { supabase } from "../auth/supabase.js";

export interface YjsPersistenceResult {
    success: boolean;
    error?: string;
}

export interface YjsLoadResult {
    ydoc: Y.Doc;
    stateVector: Uint8Array | null;
}

/**
 * Persist full Y.Doc state to Supabase.
 * Called periodically or on room cleanup.
 *
 * @param documentId - Document ID
 * @param ydoc - Y.Doc to persist
 */
export async function persistYjsState(
    documentId: string,
    ydoc: Y.Doc,
): Promise<YjsPersistenceResult> {
    if (!supabase) {
        return { success: false, error: "Supabase not configured" };
    }

    try {
        const update = Y.encodeStateAsUpdate(ydoc);
        const stateVector = Y.encodeStateVector(ydoc);

        // Store as base64 (Supabase JS client handles bytea better with base64)
        const updateBase64 = Buffer.from(update).toString("base64");
        const vectorBase64 = Buffer.from(stateVector).toString("base64");

        const { error } = await supabase.from("yjs_documents").upsert(
            {
                document_id: documentId,
                state_update: updateBase64,
                state_vector: vectorBase64,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "document_id" },
        );

        if (error) {
            console.error(`[persistence] Failed to persist Yjs state:`, error);
            return { success: false, error: error.message };
        }

        console.log(
            `[persistence] Persisted Yjs state for ${documentId.slice(0, 8)}..., ` +
                `update size: ${update.length} bytes`,
        );
        return { success: true };
    } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        console.error(`[persistence] Error persisting Yjs state:`, error);
        return { success: false, error };
    }
}

/**
 * Persist incremental update to Supabase.
 * Called on each Y.Doc update for durability.
 *
 * Note: For high-frequency updates, consider batching or debouncing.
 *
 * @param documentId - Document ID
 * @param update - Yjs update (from ydoc.on('update'))
 */
export async function persistYjsUpdate(
    documentId: string,
    update: Uint8Array,
): Promise<YjsPersistenceResult> {
    if (!supabase) {
        return { success: false, error: "Supabase not configured" };
    }

    try {
        const updateBase64 = Buffer.from(update).toString("base64");

        // Append to updates log (for recovery)
        const { error } = await supabase.from("yjs_updates").insert({
            document_id: documentId,
            update_data: updateBase64,
            created_at: new Date().toISOString(),
        });

        if (error) {
            // Table might not exist yet, log but don't fail
            console.warn(`[persistence] Failed to persist Yjs update:`, error.message);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        console.warn(`[persistence] Error persisting Yjs update:`, error);
        return { success: false, error };
    }
}

/**
 * Load Y.Doc state from Supabase.
 * Called when room is created.
 *
 * @param documentId - Document ID
 * @returns Y.Doc with loaded state, or empty Y.Doc if not found
 */
export async function loadYjsState(documentId: string): Promise<YjsLoadResult> {
    const ydoc = new Y.Doc();

    if (!supabase) {
        return { ydoc, stateVector: null };
    }

    try {
        // First try to load full state snapshot
        const { data: snapshot, error: snapshotError } = await supabase
            .from("yjs_documents")
            .select("state_update, state_vector")
            .eq("document_id", documentId)
            .maybeSingle();

        if (snapshotError) {
            console.warn(`[persistence] Error loading Yjs snapshot:`, snapshotError.message);
        }

        if (snapshot?.state_update) {
            const update = new Uint8Array(Buffer.from(snapshot.state_update, "base64"));
            Y.applyUpdate(ydoc, update);
            console.log(
                `[persistence] Loaded Yjs state for ${documentId.slice(0, 8)}..., ` +
                    `update size: ${update.length} bytes`,
            );
        }

        // Then apply any incremental updates since the snapshot
        const stateVector = snapshot?.state_vector
            ? new Uint8Array(Buffer.from(snapshot.state_vector, "base64"))
            : null;

        // If we have incremental updates table, load those too
        // (This is for crash recovery between snapshots)
        const { data: updates, error: updatesError } = await supabase
            .from("yjs_updates")
            .select("update_data")
            .eq("document_id", documentId)
            .order("created_at", { ascending: true });

        if (!updatesError && updates && updates.length > 0) {
            for (const row of updates) {
                const update = new Uint8Array(Buffer.from(row.update_data, "base64"));
                Y.applyUpdate(ydoc, update);
            }
            console.log(
                `[persistence] Applied ${updates.length} incremental updates for ${documentId.slice(0, 8)}...`,
            );
        }

        return { ydoc, stateVector };
    } catch (e) {
        console.error(`[persistence] Error loading Yjs state:`, e);
        // Return empty doc on error
        return { ydoc, stateVector: null };
    }
}

/**
 * Clear incremental updates after snapshot.
 * Called after successful snapshot to prevent unbounded growth.
 *
 * @param documentId - Document ID
 */
export async function clearYjsUpdates(documentId: string): Promise<void> {
    if (!supabase) {
        return;
    }

    try {
        await supabase.from("yjs_updates").delete().eq("document_id", documentId);
        console.log(`[persistence] Cleared incremental updates for ${documentId.slice(0, 8)}...`);
    } catch (e) {
        console.warn(`[persistence] Error clearing Yjs updates:`, e);
    }
}
