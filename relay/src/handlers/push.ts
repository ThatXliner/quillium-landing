/**
 * push.ts -- pushUpdates handler.
 *
 * Per RELY-03: Assigns version numbers and orders changes via rebaseUpdates.
 * Per RELY-04: Broadcasts updates to all room members except sender.
 */
import type { Server, Socket } from "socket.io";
import type { Update } from "@codemirror/collab";
import type { DocumentRoom } from "../rooms/types.js";
import { processUpdates, serializeUpdate, deserializeUpdate } from "../rooms/ot.js";
import { PushUpdatesRequestSchema } from "../schemas.js";

/**
 * Handle pushUpdates request from client.
 * Processes updates via OT and broadcasts to room.
 */
export function handlePushUpdates(
    io: Server,
    socket: Socket,
    room: DocumentRoom,
    data: unknown,
    callback: (response: unknown) => void,
): void {
    // Validate request
    const parseResult = PushUpdatesRequestSchema.safeParse(data);
    if (!parseResult.success) {
        console.warn("[push] Invalid request:", parseResult.error.message);
        callback({ error: "INVALID_REQUEST" });
        return;
    }

    const { version: clientVersion, updates: rawUpdates } = parseResult.data;

    // Deserialize updates from JSON
    let clientUpdates: Update[];
    try {
        clientUpdates = rawUpdates.map((u) => deserializeUpdate(u, room.doc.length));
    } catch (err) {
        console.error("[push] Failed to deserialize updates:", err);
        callback({ error: "INVALID_UPDATES" });
        return;
    }

    // Process updates with OT
    const result = processUpdates(room, clientVersion, clientUpdates);

    if (!result.success) {
        console.warn("[push] Processing failed:", result.error);
        callback({ error: result.error ?? "PROCESSING_FAILED" });
        return;
    }

    console.log(
        `[push] Accepted ${result.updates.length} updates from ${socket.id.slice(0, 8)}... ` +
            `(v${clientVersion} -> v${result.version})`,
    );

    // Acknowledge to sender
    callback({ version: result.version });

    // Per RELY-04: Broadcast to all room members except sender
    const serialized = result.updates.map((u, i) => serializeUpdate(u, clientVersion + i + 1));

    socket.to(room.documentId).emit("updates", {
        updates: serialized,
    });

    // Notify pending pullUpdates
    for (const [pendingId, pendingCallback] of room.pending) {
        if (pendingId !== socket.id) {
            pendingCallback(result.updates);
            room.pending.delete(pendingId);
        }
    }
}
