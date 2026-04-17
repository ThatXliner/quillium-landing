/**
 * load.ts -- Load room state from Supabase for server restart recovery per RELY-06.
 *
 * Reconstructs document state from: latest snapshot + updates since snapshot.
 * Mirrors local Quillium's load.rs pattern.
 */
import { Text, ChangeSet } from "@codemirror/state";
import type { Update } from "@codemirror/collab";
import { supabase } from "../auth/supabase.js";

/** Result of loading room state from database */
export interface LoadResult {
    /** Current document content */
    doc: Text;
    /** Current version number */
    version: number;
    /** Updates since snapshot (for catchup) */
    updates: Update[];
    /** Version of snapshot used (0 if none) */
    snapshotVersion: number;
}

/**
 * Load room state from database.
 * Per RELY-06: Enables relay to reconstruct state on restart.
 *
 * Algorithm:
 * 1. Get latest snapshot for document
 * 2. Get all updates since snapshot version
 * 3. Replay updates to reconstruct current state
 *
 * @param documentId - Document UUID to load
 * @returns LoadResult with reconstructed state
 */
export async function loadRoomState(documentId: string): Promise<LoadResult> {
    // Default empty result
    const emptyResult: LoadResult = {
        doc: Text.of([""]),
        version: 0,
        updates: [],
        snapshotVersion: 0,
    };

    if (!supabase) {
        console.warn("[persistence] Supabase not configured, starting with empty document");
        return emptyResult;
    }

    // 1. Get latest snapshot
    const { data: snapshot, error: snapError } = await supabase
        .from("collab_snapshots")
        .select("version, state_json")
        .eq("document_id", documentId)
        .order("version", { ascending: false })
        .limit(1)
        .single();

    // No snapshot is fine (new document)
    const snapshotVersion = snapshot?.version ?? 0;
    let doc = snapshot?.state_json
        ? Text.of([snapshot.state_json])
        : Text.of([""]);

    if (snapshot) {
        console.log(`[persistence] Found snapshot at v${snapshotVersion} for ${documentId.slice(0, 8)}...`);
    }

    // 2. Get updates since snapshot
    const { data: rows, error: updatesError } = await supabase
        .from("collab_updates")
        .select("version, client_id, changes")
        .eq("document_id", documentId)
        .gt("version", snapshotVersion)
        .order("version", { ascending: true });

    if (updatesError) {
        console.error("[persistence] Failed to load updates:", updatesError);
        // Return with snapshot state if we have it
        return { doc, version: snapshotVersion, updates: [], snapshotVersion };
    }

    // 3. Replay updates to reconstruct current state
    const replayedUpdates: Update[] = [];
    for (const row of rows ?? []) {
        try {
            const changes = ChangeSet.fromJSON(row.changes);
            doc = changes.apply(doc);
            replayedUpdates.push({
                clientID: row.client_id,
                changes,
            });
        } catch (err) {
            console.error(`[persistence] Failed to replay update v${row.version}:`, err);
            // Stop replaying on error to avoid corruption
            break;
        }
    }

    // Version = snapshot version + number of updates replayed.
    // This ensures room.version matches room.updates.length + snapshotVersion,
    // which is required for slice-based catchup to work correctly.
    const currentVersion = snapshotVersion + replayedUpdates.length;

    console.log(
        `[persistence] Loaded room ${documentId.slice(0, 8)}... ` +
        `from snapshot v${snapshotVersion}, replayed ${replayedUpdates.length} updates to v${currentVersion}`,
    );

    return {
        doc,
        version: currentVersion,
        updates: replayedUpdates,
        snapshotVersion,
    };
}
