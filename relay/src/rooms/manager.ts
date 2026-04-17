/**
 * manager.ts -- Room lifecycle management.
 *
 * Per D-35: Rooms hold full document + version in memory.
 * Per D-37: Room kept alive 45 seconds after last client leaves.
 */
import { Text } from "@codemirror/state";
import type { Server } from "socket.io";
import type { DocumentRoom } from "./types.js";

/** Per D-37: Room cleanup delay (45 seconds, within 30-60s range) */
const ROOM_CLEANUP_DELAY_MS = 45_000;

/** In-memory room storage */
const rooms = new Map<string, DocumentRoom>();

/**
 * Get or create a document room.
 * Per D-35: Creates room with empty document for Phase 4.
 * Phase 5 will add DB loading on room creation.
 */
export function getOrCreateRoom(documentId: string): DocumentRoom {
    let room = rooms.get(documentId);

    if (!room) {
        room = {
            documentId,
            doc: Text.of([""]), // Empty doc for Phase 4; Phase 5 loads from DB
            version: 0,
            updates: [],
            pending: new Map(),
            cleanupTimer: null,
        };
        rooms.set(documentId, room);
        console.log(`[rooms] Created room ${documentId.slice(0, 8)}...`);
    }

    // Cancel any pending cleanup
    cancelRoomCleanup(room);

    return room;
}

/**
 * Get an existing room (returns undefined if not exists).
 */
export function getRoom(documentId: string): DocumentRoom | undefined {
    return rooms.get(documentId);
}

/**
 * Schedule room cleanup after delay.
 * Per D-37: Prevents thrashing during brief network hiccups.
 */
export function scheduleRoomCleanup(room: DocumentRoom, io: Server): void {
    if (room.cleanupTimer) {
        clearTimeout(room.cleanupTimer);
    }

    room.cleanupTimer = setTimeout(() => {
        // Verify room is still empty
        const socketCount = io.sockets.adapter.rooms.get(room.documentId)?.size ?? 0;

        if (socketCount === 0) {
            rooms.delete(room.documentId);
            console.log(`[rooms] Cleaned up room ${room.documentId.slice(0, 8)}...`);
        } else {
            console.log(
                `[rooms] Skipped cleanup for ${room.documentId.slice(0, 8)}... (${socketCount} clients)`,
            );
        }
    }, ROOM_CLEANUP_DELAY_MS);
}

/**
 * Cancel pending room cleanup.
 */
export function cancelRoomCleanup(room: DocumentRoom): void {
    if (room.cleanupTimer) {
        clearTimeout(room.cleanupTimer);
        room.cleanupTimer = null;
    }
}

/**
 * Get all active rooms (for debugging/monitoring).
 */
export function getRoomCount(): number {
    return rooms.size;
}

/**
 * Get room stats (for debugging/monitoring).
 */
export function getRoomStats(documentId: string): { version: number; updateCount: number } | null {
    const room = rooms.get(documentId);
    if (!room) return null;
    return {
        version: room.version,
        updateCount: room.updates.length,
    };
}

/**
 * Clear all rooms (for testing).
 */
export function _clearAllRooms(): void {
    for (const room of rooms.values()) {
        if (room.cleanupTimer) {
            clearTimeout(room.cleanupTimer);
        }
    }
    rooms.clear();
}
