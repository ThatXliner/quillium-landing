/**
 * ot.ts -- OT transformation following the canonical CodeMirror collab example.
 *
 * Key invariant: version === updates.length
 * The document is always the result of applying all updates to the initial empty doc.
 */
import { rebaseUpdates, type Update } from "@codemirror/collab";
import { ChangeSet, Text } from "@codemirror/state";
import type { DocumentRoom } from "./types.js";

/**
 * Result of processing client updates.
 */
export interface ProcessResult {
    success: boolean;
    version: number;
    updates: Update[];
    error?: string;
}

/**
 * Process client updates with OT transformation.
 *
 * Follows the canonical CodeMirror collab example exactly:
 * - version === updates.length (always)
 * - If client version doesn't match, rebase their changes over concurrent updates
 * - Apply rebased changes to doc
 */
export function processUpdates(
    room: DocumentRoom,
    clientVersion: number,
    clientUpdates: Update[],
): ProcessResult {
    // Log full state for debugging
    console.log(
        `[ot] processUpdates: clientVersion=${clientVersion}, ` +
        `updates.length=${room.updates.length}, doc.length=${room.doc.length}, ` +
        `clientUpdates[0].changes.length=${clientUpdates[0]?.changes.length}`,
    );

    try {
        let received = clientUpdates;

        // Canonical pattern: if (data.version != updates.length)
        if (clientVersion !== room.updates.length) {
            if (clientVersion > room.updates.length) {
                return {
                    success: false,
                    version: room.updates.length,
                    updates: [],
                    error: `Client version ${clientVersion} ahead of server ${room.updates.length}`,
                };
            }
            // Rebase: received = rebaseUpdates(received, updates.slice(data.version))
            const concurrent = room.updates.slice(clientVersion);
            console.log(
                `[ot] Rebasing ${received.length} client updates over ${concurrent.length} concurrent updates`,
            );
            received = [...rebaseUpdates(received, concurrent)];
        }

        // Apply each update to doc (canonical pattern)
        for (const update of received) {
            console.log(
                `[ot] Applying update: changes.length=${update.changes.length}, doc.length=${room.doc.length}`,
            );
            room.updates.push(update);
            room.doc = update.changes.apply(room.doc);
        }

        // Version is always updates.length (canonical invariant)
        room.version = room.updates.length;

        console.log(
            `[ot] Applied ${received.length} updates, now at v${room.version}, doc.length=${room.doc.length}`,
        );

        return {
            success: true,
            version: room.version,
            updates: received,
        };
    } catch (err) {
        console.error("[ot] Error:", err);
        return {
            success: false,
            version: room.updates.length,
            updates: [],
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

/**
 * Get updates since a given version.
 * Canonical pattern: updates.slice(version)
 */
export function getUpdatesSince(room: DocumentRoom, version: number): Update[] {
    if (version >= room.updates.length) {
        return [];
    }
    return room.updates.slice(version);
}

/**
 * Serialize Update for transmission.
 */
export function serializeUpdate(
    update: Update,
    version: number,
): { version: number; clientID: string; changes: unknown } {
    return {
        version,
        clientID: update.clientID,
        changes: update.changes.toJSON(),
    };
}

/**
 * Deserialize Update from JSON.
 */
export function deserializeUpdate(
    data: { clientID: string; changes: unknown },
): Update {
    return {
        clientID: data.clientID,
        changes: ChangeSet.fromJSON(data.changes),
    };
}
