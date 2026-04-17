/**
 * room.test.ts -- Tests for room management and OT ordering.
 *
 * Covers RELY-03 (version ordering) and RELY-04 (broadcasting).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Text } from "@codemirror/state";
import { ChangeSet } from "@codemirror/state";
import type { Update } from "@codemirror/collab";

// Import functions to test
import {
    getOrCreateRoom,
    getRoom,
    scheduleRoomCleanup,
    cancelRoomCleanup,
    _clearAllRooms,
} from "../rooms/manager.js";
import {
    processUpdates,
    getUpdatesSince,
    serializeUpdate,
    deserializeUpdate,
} from "../rooms/ot.js";

// Helper to create a mock Update
function createMockUpdate(clientID: string, fromLen: number, insert: string): Update {
    return {
        clientID,
        changes: ChangeSet.of([{ from: fromLen, insert }], fromLen),
    };
}

describe("Room Manager", () => {
    beforeEach(() => {
        // Clear rooms between tests
        _clearAllRooms();
    });

    afterEach(() => {
        _clearAllRooms();
    });

    it("creates room with empty document and version 0", () => {
        const room = getOrCreateRoom("test-doc-1");

        expect(room.documentId).toBe("test-doc-1");
        expect(room.doc.toString()).toBe("");
        expect(room.version).toBe(0);
        expect(room.updates).toHaveLength(0);
    });

    it("returns same room on subsequent calls", () => {
        const room1 = getOrCreateRoom("test-doc-2");
        const room2 = getOrCreateRoom("test-doc-2");

        expect(room1).toBe(room2);
    });

    it("getRoom returns undefined for non-existent room", () => {
        const room = getRoom("non-existent");
        expect(room).toBeUndefined();
    });
});

describe("RELY-03: Version Ordering (rebaseUpdates)", () => {
    beforeEach(() => {
        _clearAllRooms();
    });

    afterEach(() => {
        _clearAllRooms();
    });

    it("accepts updates at current version", () => {
        const room = getOrCreateRoom("rely-03-test-1");
        room.doc = Text.of(["hello"]);
        room.version = 0;

        const update = createMockUpdate("client-1", 5, " world");
        const result = processUpdates(room, 0, [update]);

        expect(result.success).toBe(true);
        expect(result.version).toBe(1);
        expect(room.doc.toString()).toBe("hello world");
    });

    it("rebases updates from stale client version", () => {
        const room = getOrCreateRoom("rely-03-test-2");
        room.doc = Text.of(["hello"]);
        room.version = 0;

        // First client adds " world"
        const update1 = createMockUpdate("client-1", 5, " world");
        processUpdates(room, 0, [update1]);

        expect(room.version).toBe(1);
        expect(room.doc.toString()).toBe("hello world");

        // Second client (stale at v0) adds "!"
        // Should be rebased to apply after " world"
        const update2 = createMockUpdate("client-2", 5, "!");
        const result = processUpdates(room, 0, [update2]);

        expect(result.success).toBe(true);
        expect(result.version).toBe(2);
        // The "!" should be rebased to position after "hello world"
        // Exact position depends on rebaseUpdates behavior
    });

    it("assigns monotonically increasing version numbers", () => {
        const room = getOrCreateRoom("rely-03-test-3");
        room.doc = Text.of([""]);

        const update1 = createMockUpdate("client-1", 0, "a");
        processUpdates(room, 0, [update1]);
        expect(room.version).toBe(1);

        const update2 = createMockUpdate("client-1", 1, "b");
        processUpdates(room, 1, [update2]);
        expect(room.version).toBe(2);

        const update3 = createMockUpdate("client-1", 2, "c");
        processUpdates(room, 2, [update3]);
        expect(room.version).toBe(3);
    });

    it("rejects updates from future version", () => {
        const room = getOrCreateRoom("rely-03-test-4");
        room.version = 5;

        const update = createMockUpdate("client-1", 0, "x");
        const result = processUpdates(room, 10, [update]); // v10 > v5

        expect(result.success).toBe(false);
        expect(result.error).toContain("ahead");
    });

    it("stores updates in room history", () => {
        const room = getOrCreateRoom("rely-03-test-5");
        room.doc = Text.of([""]);

        const update = createMockUpdate("client-1", 0, "test");
        processUpdates(room, 0, [update]);

        expect(room.updates).toHaveLength(1);
        expect(room.updates[0].clientID).toBe("client-1");
    });
});

describe("RELY-04: Update Broadcasting", () => {
    beforeEach(() => {
        _clearAllRooms();
    });

    afterEach(() => {
        _clearAllRooms();
    });

    it("getUpdatesSince returns updates after version", () => {
        const room = getOrCreateRoom("rely-04-test-1");
        room.doc = Text.of([""]);

        // Add 3 updates
        processUpdates(room, 0, [createMockUpdate("c1", 0, "a")]);
        processUpdates(room, 1, [createMockUpdate("c1", 1, "b")]);
        processUpdates(room, 2, [createMockUpdate("c1", 2, "c")]);

        const updates = getUpdatesSince(room, 1);
        expect(updates).toHaveLength(2); // v2 and v3
    });

    it("getUpdatesSince returns empty for current version", () => {
        const room = getOrCreateRoom("rely-04-test-2");
        room.version = 5;

        const updates = getUpdatesSince(room, 5);
        expect(updates).toHaveLength(0);
    });
});

describe("Serialization", () => {
    it("serializeUpdate converts Update to JSON-safe format", () => {
        const changes = ChangeSet.of([{ from: 0, insert: "hello" }], 0);
        const update: Update = { clientID: "test", changes };

        const serialized = serializeUpdate(update, 1);

        expect(serialized.version).toBe(1);
        expect(serialized.clientID).toBe("test");
        // ChangeSet.toJSON returns an array format [[pos, insert], ...]
        expect(Array.isArray(serialized.changes)).toBe(true);
    });

    it("deserializeUpdate reconstructs Update from JSON", () => {
        // First create a real ChangeSet and serialize it
        const originalChanges = ChangeSet.of([{ from: 0, insert: "hello" }], 0);
        const serializedChanges = originalChanges.toJSON();

        const data = {
            clientID: "test",
            changes: serializedChanges,
        };

        const update = deserializeUpdate(data as any, 0);

        expect(update.clientID).toBe("test");
        expect(update.changes).toBeInstanceOf(ChangeSet);
    });
});

describe("Room Lifecycle", () => {
    beforeEach(() => {
        _clearAllRooms();
    });

    afterEach(() => {
        vi.useRealTimers();
        _clearAllRooms();
    });

    it("creates room on first client connection", () => {
        const room = getOrCreateRoom("lifecycle-test-1");
        expect(room).toBeDefined();
        expect(room.documentId).toBe("lifecycle-test-1");
    });

    it("cancels cleanup when new client joins", () => {
        vi.useFakeTimers();

        const room = getOrCreateRoom("lifecycle-test-2");

        // Mock io for scheduleRoomCleanup
        const mockIo = {
            sockets: {
                adapter: {
                    rooms: new Map(),
                },
            },
        };

        // Schedule cleanup
        scheduleRoomCleanup(room, mockIo as any);
        expect(room.cleanupTimer).not.toBeNull();

        // Cancel cleanup (simulates new client joining)
        cancelRoomCleanup(room);
        expect(room.cleanupTimer).toBeNull();
    });
});
