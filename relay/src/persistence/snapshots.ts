/**
 * snapshots.ts -- Document snapshots for fast state reconstruction per D-41.
 *
 * Periodic snapshots allow fast state loading: latest snapshot + updates since.
 * Thresholds match local Quillium: 50 updates OR 2 minutes.
 */
import { supabase } from "../auth/supabase.js";
import type { DocumentRoom } from "../rooms/types.js";

/** Match local Quillium: 50 events threshold */
export const SNAPSHOT_UPDATE_THRESHOLD = 50;

/** Match local Quillium: 2 minutes */
export const SNAPSHOT_TIME_THRESHOLD_MS = 120_000;

/**
 * Check if room has reached snapshot threshold.
 *
 * @param room - Document room to check
 * @returns true if snapshot should be created
 */
export function checkSnapshotThreshold(room: DocumentRoom): boolean {
    const updatesSinceSnapshot = room.version - room.lastSnapshotVersion;
    const timeSinceSnapshot = Date.now() - room.lastSnapshotTime;

    return (
        updatesSinceSnapshot >= SNAPSHOT_UPDATE_THRESHOLD ||
        timeSinceSnapshot >= SNAPSHOT_TIME_THRESHOLD_MS
    );
}

/**
 * Create a document snapshot.
 * Non-critical operation - failures are logged but don't throw.
 *
 * @param room - Document room to snapshot
 */
export async function createSnapshot(room: DocumentRoom): Promise<void> {
    if (!supabase) {
        console.warn("[persistence] Supabase not configured, skipping snapshot");
        return;
    }

    const { error } = await supabase.from("collab_snapshots").insert({
        document_id: room.documentId,
        version: room.version,
        state_json: room.doc.toString(),
    });

    if (error) {
        console.error("[persistence] Snapshot creation failed:", error);
        return;
    }

    console.log(
        `[persistence] Created snapshot for ${room.documentId.slice(0, 8)}... at v${room.version}`,
    );

    // Update room tracking
    room.lastSnapshotVersion = room.version;
    room.lastSnapshotTime = Date.now();
}

/**
 * Create snapshot if threshold reached.
 * Safe to call after every persist - checks threshold first.
 *
 * @param room - Document room to potentially snapshot
 */
export async function maybeCreateSnapshot(room: DocumentRoom): Promise<void> {
    if (checkSnapshotThreshold(room)) {
        await createSnapshot(room);
    }
}
