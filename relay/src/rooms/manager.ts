/**
 * manager.ts -- Room lifecycle management.
 *
 * Per D-35: Rooms hold full document + version in memory.
 * Per D-37: Room kept alive 45 seconds after last client leaves.
 */
import { Text } from "@codemirror/state";
import type { Server } from "socket.io";
import type { DocumentRoom } from "./types.js";
import { loadRoomState } from "../persistence/index.js";

/** Per D-37: Room cleanup delay (45 seconds, within 30-60s range) */
const ROOM_CLEANUP_DELAY_MS = 45_000;

/** In-memory room storage */
const rooms = new Map<string, DocumentRoom>();

/**
 * Get or create a document room (async for DB loading).
 * Per D-35: Creates room with document state from DB.
 * Per RELY-06: Loads state on server restart.
 */
export async function getOrCreateRoomAsync(documentId: string): Promise<DocumentRoom> {
    let room = rooms.get(documentId);

    if (!room) {
        // Load state from DB per RELY-06
        const loaded = await loadRoomState(documentId);

        room = {
            documentId,
            doc: loaded.doc,
            version: loaded.version,
            updates: loaded.updates,
            pending: new Map(),
            cleanupTimer: null,
            lastSnapshotVersion: loaded.snapshotVersion,
            lastSnapshotTime: Date.now(),
        };
        rooms.set(documentId, room);
        console.log(
            `[rooms] Created room ${documentId.slice(0, 8)}... with ${loaded.updates.length} updates at v${loaded.version}`,
        );
    }

    // Cancel any pending cleanup
    cancelRoomCleanup(room);

    return room;
}

/**
 * Get or create a document room (sync version for tests).
 * @deprecated Use getOrCreateRoomAsync for DB-backed rooms
 */
export function getOrCreateRoom(documentId: string): DocumentRoom {
    let room = rooms.get(documentId);

    if (!room) {
        room = {
            documentId,
            doc: Text.of([""]),
            version: 0,
            updates: [],
            pending: new Map(),
            cleanupTimer: null,
            lastSnapshotVersion: 0,
            lastSnapshotTime: Date.now(),
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
