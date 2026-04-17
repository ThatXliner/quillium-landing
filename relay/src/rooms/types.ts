/**
 * types.ts -- Room and update type definitions.
 *
 * Per D-35: Full document + version kept in memory per room (Google Docs pattern).
 */
import { Text } from "@codemirror/state";
import type { Update } from "@codemirror/collab";

/**
 * In-memory document room state.
 * Per D-35: enables fast OT transforms without DB round-trips.
 */
export interface DocumentRoom {
    /** Document UUID */
    documentId: string;

    /** Current document content */
    doc: Text;

    /** Current version number (monotonically increasing) */
    version: number;

    /** Update history since room creation */
    updates: Update[];

    /** Pending pullUpdates callbacks waiting for new updates */
    pending: Map<string, (updates: Update[]) => void>;

    /** Cleanup timer scheduled when last client leaves (per D-37) */
    cleanupTimer: NodeJS.Timeout | null;

    /** Version at last snapshot (for threshold tracking) */
    lastSnapshotVersion: number;

    /** Timestamp of last snapshot (for time-based threshold) */
    lastSnapshotTime: number;
}

/**
 * Update with version metadata for broadcasting.
 */
export interface VersionedUpdate {
    version: number;
    clientID: string;
    changes: ReturnType<typeof import("@codemirror/state").ChangeSet.prototype.toJSON>;
}
