/**
 * pull.ts -- pullUpdates handler.
 *
 * Per D-36: Client-driven catchup. Client tracks version, requests missing updates.
 */
import type { Socket } from "socket.io";
import type { DocumentRoom } from "../rooms/types.js";
import { getUpdatesSince, serializeUpdate } from "../rooms/ot.js";
import { PullUpdatesRequestSchema } from "../schemas.js";

/**
 * Handle pullUpdates request from client.
 * Returns all updates since client's version.
 */
export function handlePullUpdates(
    socket: Socket,
    room: DocumentRoom,
    data: unknown,
    callback: (response: unknown) => void,
): void {
    // Validate request
    const parseResult = PullUpdatesRequestSchema.safeParse(data);
    if (!parseResult.success) {
        console.warn("[pull] Invalid request:", parseResult.error.message);
        callback({ error: "INVALID_REQUEST" });
        return;
    }

    const { version } = parseResult.data;

    // If client is at current version, add to pending list
    if (version >= room.version) {
        // Client is up to date, wait for new updates
        const pendingId = socket.id;

        // Store callback for when new updates arrive
        room.pending.set(pendingId, (updates) => {
            const serialized = updates.map((u, i) => serializeUpdate(u, version + i + 1));
            callback({ updates: serialized });
        });

        // Clean up on disconnect
        socket.once("disconnect", () => {
            room.pending.delete(pendingId);
        });

        console.log(`[pull] Client ${socket.id.slice(0, 8)}... waiting at v${version}`);
        return;
    }

    // Client is behind, send updates immediately
    const updates = getUpdatesSince(room, version);
    const serialized = updates.map((u, i) => serializeUpdate(u, version + i + 1));

    console.log(
        `[pull] Sending ${updates.length} updates to ${socket.id.slice(0, 8)}... (v${version} -> v${room.version})`,
    );

    callback({ updates: serialized });
}
