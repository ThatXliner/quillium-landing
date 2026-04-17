/**
 * connection.ts -- Socket connection and disconnection handlers.
 *
 * Per D-35: Initializes room with document state on first connection.
 * Per D-37: Schedules cleanup when last client disconnects.
 */
import type { Server, Socket } from "socket.io";
import { getOrCreateRoom, getRoom, scheduleRoomCleanup } from "../rooms/manager.js";
import { handlePullUpdates } from "./pull.js";
import { handlePushUpdates } from "./push.js";

/**
 * Handle new socket connection.
 * Called after auth middleware has validated JWT and permissions.
 */
export function handleConnection(io: Server, socket: Socket): void {
    const { userId, documentId, isAnonymous } = socket.data;

    // Get or create room (cancels any pending cleanup)
    const room = getOrCreateRoom(documentId);

    // Join Socket.io room
    socket.join(documentId);

    console.log(
        `[handlers] User ${userId.slice(0, 8)}... joined room ${documentId.slice(0, 8)}... ` +
            `(anon: ${isAnonymous}, v${room.version})`,
    );

    // Send initial state to client
    socket.emit("init", {
        version: room.version,
        doc: room.doc.toString(),
    });

    // Register message handlers
    socket.on("pullUpdates", (data, callback) => {
        handlePullUpdates(socket, room, data, callback);
    });

    socket.on("pushUpdates", (data, callback) => {
        handlePushUpdates(io, socket, room, data, callback);
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
