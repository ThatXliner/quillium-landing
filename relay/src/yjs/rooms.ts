/**
 * rooms.ts -- Yjs room lifecycle management.
 *
 * Per D-71: Rooms hold Y.Doc instead of @codemirror/state Text.
 * Per D-37: Room cleanup delay (45 seconds after last client leaves).
 */
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import type { YjsRoom } from "./types.js";
import { loadYjsState, persistYjsState, clearYjsUpdates } from "../persistence/yjsUpdates.js";

/** Per D-37: Room cleanup delay (45 seconds) */
const ROOM_CLEANUP_DELAY_MS = 45_000;

/** In-memory room storage */
const rooms = new Map<string, YjsRoom>();

/**
 * Get or create a Yjs room.
 * Loads state from database if room doesn't exist in memory.
 *
 * @param documentId - Document ID (room name)
 */
export async function getOrCreateYjsRoom(documentId: string): Promise<YjsRoom> {
    let room = rooms.get(documentId);

    if (!room) {
        // Load state from DB
        const { ydoc } = await loadYjsState(documentId);
        const awareness = new Awareness(ydoc);

        room = {
            documentId,
            ydoc,
            awareness,
            clients: new Set(),
            cleanupTimer: null,
            isOwnerConnected: false,
            ownerId: null,
        };

        rooms.set(documentId, room);
        console.log(`[yjs/rooms] Created room ${documentId.slice(0, 8)}...`);
    }

    // Cancel any pending cleanup
    cancelRoomCleanup(room);

    return room;
}

/**
 * Get existing room (or undefined).
 */
export function getYjsRoom(documentId: string): YjsRoom | undefined {
    return rooms.get(documentId);
}

/**
 * Schedule room cleanup after delay.
 * Per D-37: Prevents thrashing during brief network hiccups.
 */
export function scheduleRoomCleanup(room: YjsRoom): void {
    if (room.cleanupTimer) {
        clearTimeout(room.cleanupTimer);
    }

    room.cleanupTimer = setTimeout(async () => {
        // Verify room is still empty
        if (room.clients.size === 0) {
            // Persist final state before cleanup
            await persistYjsState(room.documentId, room.ydoc);
            await clearYjsUpdates(room.documentId);

            // Cleanup Y.Doc and Awareness
            room.awareness.destroy();
            room.ydoc.destroy();

            rooms.delete(room.documentId);
            console.log(`[yjs/rooms] Cleaned up room ${room.documentId.slice(0, 8)}...`);
        } else {
            console.log(
                `[yjs/rooms] Skipped cleanup for ${room.documentId.slice(0, 8)}... (${room.clients.size} clients)`,
            );
        }
    }, ROOM_CLEANUP_DELAY_MS);
}

/**
 * Cancel pending room cleanup.
 */
export function cancelRoomCleanup(room: YjsRoom): void {
    if (room.cleanupTimer) {
        clearTimeout(room.cleanupTimer);
        room.cleanupTimer = null;
    }
}

/**
 * Get room count (for health check).
 */
export function getRoomCount(): number {
    return rooms.size;
}

/**
 * Clear all rooms (for testing).
 */
export function _clearAllRooms(): void {
    for (const room of rooms.values()) {
        if (room.cleanupTimer) {
            clearTimeout(room.cleanupTimer);
        }
        room.awareness.destroy();
        room.ydoc.destroy();
    }
    rooms.clear();
}
