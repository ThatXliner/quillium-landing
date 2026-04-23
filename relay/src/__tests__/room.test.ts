/**
 * room.test.ts -- Tests for Yjs room lifecycle management.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as Y from "yjs";

vi.mock("../persistence/yjsUpdates.js", () => ({
    loadYjsState: vi.fn(async () => ({ ydoc: new Y.Doc(), stateVector: null })),
    persistYjsState: vi.fn(async () => ({ success: true })),
    clearYjsUpdates: vi.fn(async () => undefined),
}));

vi.mock("../persistence/debouncedUpdates.js", () => ({
    flushDocumentUpdates: vi.fn(async () => undefined),
}));

import {
    getOrCreateYjsRoom,
    getYjsRoom,
    scheduleRoomCleanup,
    cancelRoomCleanup,
    getRoomCount,
    clearRoomState,
    _clearAllRooms,
} from "../yjs/rooms.js";
import {
    loadYjsState,
    persistYjsState,
    clearYjsUpdates,
} from "../persistence/yjsUpdates.js";
import { flushDocumentUpdates } from "../persistence/debouncedUpdates.js";

describe("Yjs room manager", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
        _clearAllRooms();
    });

    afterEach(() => {
        vi.useRealTimers();
        _clearAllRooms();
    });

    it("creates a Yjs room and loads persisted state once", async () => {
        const room = await getOrCreateYjsRoom("doc-1");

        expect(room.documentId).toBe("doc-1");
        expect(room.clients.size).toBe(0);
        expect(room.isOwnerConnected).toBe(false);
        expect(getRoomCount()).toBe(1);
        expect(loadYjsState).toHaveBeenCalledTimes(1);
    });

    it("returns the same in-memory room on repeated calls", async () => {
        const room1 = await getOrCreateYjsRoom("doc-2");
        const room2 = await getOrCreateYjsRoom("doc-2");

        expect(room1).toBe(room2);
        expect(loadYjsState).toHaveBeenCalledTimes(1);
    });

    it("getYjsRoom returns undefined for unknown rooms", () => {
        expect(getYjsRoom("missing-doc")).toBeUndefined();
    });

    it("cancels pending cleanup when the room is reused", async () => {
        vi.useFakeTimers();
        const room = await getOrCreateYjsRoom("doc-cleanup");

        scheduleRoomCleanup(room);
        expect(room.cleanupTimer).not.toBeNull();

        await getOrCreateYjsRoom("doc-cleanup");
        expect(room.cleanupTimer).toBeNull();
    });

    it("can cancel cleanup directly", async () => {
        vi.useFakeTimers();
        const room = await getOrCreateYjsRoom("doc-cancel");

        scheduleRoomCleanup(room);
        cancelRoomCleanup(room);

        expect(room.cleanupTimer).toBeNull();
    });

    it("flushes pending updates, snapshots, clears update log, and removes empty rooms on cleanup", async () => {
        vi.useFakeTimers();
        const room = await getOrCreateYjsRoom("doc-empty");
        room.ydoc.getText("document").insert(0, "hello");

        scheduleRoomCleanup(room);
        await vi.advanceTimersByTimeAsync(45_000);

        expect(flushDocumentUpdates).toHaveBeenCalledWith("doc-empty");
        expect(persistYjsState).toHaveBeenCalledWith("doc-empty", room.ydoc);
        expect(clearYjsUpdates).toHaveBeenCalledWith("doc-empty");
        expect(getYjsRoom("doc-empty")).toBeUndefined();
    });

    it("does not remove rooms that receive a client before cleanup fires", async () => {
        vi.useFakeTimers();
        const room = await getOrCreateYjsRoom("doc-active");
        room.clients.add({} as any);

        scheduleRoomCleanup(room);
        await vi.advanceTimersByTimeAsync(45_000);

        expect(persistYjsState).not.toHaveBeenCalled();
        expect(getYjsRoom("doc-active")).toBe(room);
    });

    it("clears document text, annotations, and awareness state", async () => {
        const room = await getOrCreateYjsRoom("doc-clear");
        room.ydoc.getText("document").insert(0, "hello");
        room.ydoc.getMap("annotations").set("a1", { text: "note" });
        room.awareness.setLocalState({ user: "owner" });

        clearRoomState(room);

        expect(room.ydoc.getText("document").toString()).toBe("");
        expect(room.ydoc.getMap("annotations").size).toBe(0);
        expect(room.awareness.getStates().size).toBe(0);
    });
});
