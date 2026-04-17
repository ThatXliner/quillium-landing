/**
 * connection.ts -- Socket connection and disconnection handlers.
 *
 * Per D-35: Initializes room with document state on first connection.
 * Per D-37: Schedules cleanup when last client disconnects.
 */
import type { Server, Socket } from "socket.io";
import { Text, ChangeSet } from "@codemirror/state";
import { getOrCreateRoomAsync, getRoom, scheduleRoomCleanup } from "../rooms/manager.js";
import { handlePullUpdates } from "./pull.js";
import { handlePushUpdates } from "./push.js";
import { persistUpdates } from "../persistence/index.js";

/**
 * Handle new socket connection.
 * Called after auth middleware has validated JWT and permissions.
 */
export async function handleConnection(io: Server, socket: Socket): Promise<void> {
    const { userId, documentId, isAnonymous } = socket.data;

    // Get or create room with DB state loading (cancels any pending cleanup)
    const room = await getOrCreateRoomAsync(documentId);

    // Join Socket.io room
    socket.join(documentId);

    console.log(
        `[handlers] User ${userId.slice(0, 8)}... joined room ${documentId.slice(0, 8)}... ` +
            `(anon: ${isAnonymous}, v${room.version})`,
    );

    // Send initial state to client
    const docString = room.doc.toString();
    console.log(
        `[handlers] Sending init: version=${room.version}, doc.length=${docString.length}, ` +
        `updatesStartVersion=${room.updatesStartVersion}, updates.length=${room.updates.length}`,
    );
    socket.emit("init", {
        version: room.version,
        doc: docString,
    });

    // Register message handlers
    socket.on("pullUpdates", (data, callback) => {
        handlePullUpdates(socket, room, data, callback);
    });

    socket.on("pushUpdates", (data, callback) => {
        handlePushUpdates(io, socket, room, data, callback);
    });

    // Handle owner initializing room with their document content.
    // Creates a proper update (insert from empty) so version tracking works correctly.
    socket.on("initDocument", async (data: { content: string }, callback) => {
        // Only allow if room is empty (version 0, no content)
        if (room.version === 0 && room.doc.length === 0) {
            const content = data.content;
            // Create a ChangeSet that inserts all content into empty doc (length 0)
            const changes = ChangeSet.of({ from: 0, insert: content }, 0);

            const update = {
                clientID: "owner-init",
                changes: changes,
            };

            // Apply as a proper update so version tracking works
            room.doc = changes.apply(room.doc);
            room.updates.push(update);
            // Canonical invariant: version === updates.length
            room.version = room.updates.length;

            // Persist the initial update (same pattern as push.ts)
            const persistResult = await persistUpdates(documentId, [update], room.version);
            if (!persistResult.success) {
                // Rollback on persist failure
                room.updates.pop();
                room.doc = Text.of([""]);
                room.version = 0;
                console.error(`[handlers] initDocument persist failed:`, persistResult.error);
                callback({ ok: false, error: "Failed to persist initial content" });
                return;
            }

            console.log(
                `[handlers] Room ${documentId.slice(0, 8)}... initialized with ${room.doc.length} chars at v${room.version}`,
            );
            callback({ ok: true, version: room.version });
        } else {
            console.warn(`[handlers] initDocument rejected - room already has content (v${room.version})`);
            callback({ ok: false, error: "Room already initialized" });
        }
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
        handleDisconnection(io, socket, documentId, reason);
    });
}

/**
 * Handle socket disconnection.
 * Per D-37: Schedules room cleanup after delay if no clients remain.
 */
function handleDisconnection(
    io: Server,
    socket: Socket,
    documentId: string,
    reason: string,
): void {
    const room = getRoom(documentId);

    console.log(`[handlers] Socket ${socket.id.slice(0, 8)}... disconnected: ${reason}`);

    if (room) {
        // Check if room is now empty
        const socketCount = io.sockets.adapter.rooms.get(documentId)?.size ?? 0;

        if (socketCount === 0) {
            console.log(`[handlers] Room ${documentId.slice(0, 8)}... now empty, scheduling cleanup`);
            scheduleRoomCleanup(room, io);
        } else {
            console.log(
                `[handlers] Room ${documentId.slice(0, 8)}... has ${socketCount} remaining clients`,
            );
        }
    }
}
