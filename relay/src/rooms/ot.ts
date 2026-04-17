/**
 * ot.ts -- OT transformation wrapper using @codemirror/collab.
 *
 * Per RELY-03: Relay assigns version numbers and orders changes.
 * Per RESEARCH.md anti-pattern: NEVER reject stale versions, always rebase.
 */
import { rebaseUpdates, type Update } from "@codemirror/collab";
import { ChangeSet } from "@codemirror/state";
import type { DocumentRoom } from "./types.js";

/**
 * Result of processing client updates.
 */
export interface ProcessResult {
    /** Whether updates were successfully processed */
    success: boolean;

    /** New version after applying updates */
    version: number;

    /** Updates to broadcast (rebased if needed) */
    updates: Update[];

    /** Error message if success is false */
    error?: string;
}

/**
 * Process client updates with OT transformation.
 *
 * Per RELY-03: Assigns version numbers and orders changes.
 * Per RESEARCH.md: Uses rebaseUpdates for stale versions, never rejects.
 *
 * @param room - Document room with current state
 * @param clientVersion - Client's version number
 * @param clientUpdates - Updates from client
 * @returns ProcessResult with success status and updates to broadcast
 */
export function processUpdates(
    room: DocumentRoom,
    clientVersion: number,
    clientUpdates: Update[],
): ProcessResult {
    try {
        // Validate version is not from the future
        if (clientVersion > room.version) {
            return {
                success: false,
                version: room.version,
                updates: [],
                error: `Client version ${clientVersion} ahead of server ${room.version}`,
            };
        }

        let updatesToApply = clientUpdates;

        // If client is behind, rebase their updates against server changes
        // Per RESEARCH.md: NEVER reject stale versions, always rebase
        if (clientVersion < room.version) {
            const updatesSinceClient = room.updates.slice(clientVersion);
            updatesToApply = [...rebaseUpdates(clientUpdates, updatesSinceClient)];
            console.log(
                `[ot] Rebased ${clientUpdates.length} updates from v${clientVersion} over ${updatesSinceClient.length} concurrent changes`,
            );
        }

        // Apply each update to room document
        const appliedUpdates: Update[] = [];
        for (const update of updatesToApply) {
            // Apply changes to document
            room.doc = update.changes.apply(room.doc);
            room.version++;

            // Store update in history
            const storedUpdate: Update = {
                clientID: update.clientID,
                changes: update.changes,
            };
            room.updates.push(storedUpdate);
            appliedUpdates.push(storedUpdate);
        }

        console.log(
            `[ot] Applied ${appliedUpdates.length} updates, room now at v${room.version}`,
        );

        return {
            success: true,
            version: room.version,
            updates: appliedUpdates,
        };
    } catch (err) {
        console.error("[ot] Error processing updates:", err);
        return {
            success: false,
            version: room.version,
            updates: [],
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

/**
 * Get updates since a given version.
 * Used by pullUpdates handler.
 */
export function getUpdatesSince(room: DocumentRoom, version: number): Update[] {
    if (version >= room.version) {
        return [];
    }
    return room.updates.slice(version);
}

/**
 * Serialize Update for transmission over WebSocket.
 * ChangeSet needs to be converted to JSON-serializable format.
 */
export function serializeUpdate(
    update: Update,
    version: number,
): {
    version: number;
    clientID: string;
    changes: ReturnType<ChangeSet["toJSON"]>;
} {
    return {
        version,
        clientID: update.clientID,
        changes: update.changes.toJSON(),
    };
}

/**
 * Deserialize Update from WebSocket message.
 * ChangeSet needs to be reconstructed from JSON.
 */
export function deserializeUpdate(
    data: { clientID: string; changes: ReturnType<ChangeSet["toJSON"]> },
    _docLength: number,
): Update {
    return {
        clientID: data.clientID,
        changes: ChangeSet.fromJSON(data.changes),
    };
}
