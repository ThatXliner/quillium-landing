/**
 * persistence.test.ts -- Unit tests for persistence layer.
 *
 * Tests RELY-05 (persist updates) and RELY-06 (reload state).
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChangeSet, Text } from "@codemirror/state";
import type { Update } from "@codemirror/collab";

// Mock Supabase before imports
vi.mock("../auth/supabase.js", () => ({
    supabaseConfigured: true,
    supabase: {
        from: vi.fn(),
    },
}));

import { supabase } from "../auth/supabase.js";
import {
    withRetry,
    MAX_RETRIES,
    BASE_DELAY_MS,
    MAX_DELAY_MS,
} from "../persistence/retry.js";
import { persistUpdates, getMaxVersion } from "../persistence/updates.js";
import { loadRoomState } from "../persistence/load.js";
import {
    checkSnapshotThreshold,
    SNAPSHOT_UPDATE_THRESHOLD,
    SNAPSHOT_TIME_THRESHOLD_MS,
} from "../persistence/snapshots.js";

describe("Retry Wrapper (D-42)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns success on first try", async () => {
        const operation = vi.fn().mockResolvedValue({ data: "result", error: null });

        const result = await withRetry(operation, "test-op");

        expect(result.success).toBe(true);
        expect(result.data).toBe("result");
        expect(operation).toHaveBeenCalledTimes(1);
    });

    it("retries on transient error", async () => {
        const operation = vi.fn()
            .mockResolvedValueOnce({ data: null, error: { message: "connection timeout" } })
            .mockResolvedValueOnce({ data: null, error: { message: "connection timeout" } })
            .mockResolvedValueOnce({ data: "result", error: null });

        const result = await withRetry(operation, "test-op");

        expect(result.success).toBe(true);
        expect(operation).toHaveBeenCalledTimes(3);
    });

    it("fails after MAX_RETRIES", async () => {
        const operation = vi.fn().mockResolvedValue({
            data: null,
            error: { message: "connection timeout" },
        });

        const result = await withRetry(operation, "test-op");

        expect(result.success).toBe(false);
        expect(result.error).toContain("connection timeout");
        expect(operation).toHaveBeenCalledTimes(MAX_RETRIES);
    });

    it("does not retry non-transient errors", async () => {
        const operation = vi.fn().mockResolvedValue({
            data: null,
            error: { message: "unique constraint violation" },
        });

        const result = await withRetry(operation, "test-op");

        expect(result.success).toBe(false);
        expect(operation).toHaveBeenCalledTimes(1);
    });

    it("exports correct constants", () => {
        expect(MAX_RETRIES).toBe(3);
        expect(BASE_DELAY_MS).toBe(100);
        expect(MAX_DELAY_MS).toBe(2000);
    });
});

describe("RELY-05: Update Persistence", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("persists updates to collab_updates table", async () => {
        const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
        vi.mocked(supabase!.from).mockReturnValue({
            insert: mockInsert,
        } as any);

        const updates: Update[] = [
            {
                clientID: "client-1",
                changes: ChangeSet.of([], 0),
            },
        ];

        const result = await persistUpdates("doc-123", updates, 1);

        expect(result.success).toBe(true);
        expect(supabase!.from).toHaveBeenCalledWith("collab_updates");
        expect(mockInsert).toHaveBeenCalled();
    });

    it("uses ChangeSet.toJSON() for serialization", async () => {
        const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
        vi.mocked(supabase!.from).mockReturnValue({
            insert: mockInsert,
        } as any);

        const changes = ChangeSet.of([{ insert: "hello" }], 0);
        const updates: Update[] = [{ clientID: "client-1", changes }];

        await persistUpdates("doc-123", updates, 1);

        const insertArg = mockInsert.mock.calls[0][0];
        expect(insertArg[0].changes).toEqual(changes.toJSON());
    });

    it("returns error on persistence failure", async () => {
        const mockInsert = vi.fn().mockResolvedValue({
            data: null,
            error: { message: "unique constraint violation" },
        });
        vi.mocked(supabase!.from).mockReturnValue({
            insert: mockInsert,
        } as any);

        const updates: Update[] = [
            { clientID: "client-1", changes: ChangeSet.of([], 0) },
        ];

        const result = await persistUpdates("doc-123", updates, 1);

        expect(result.success).toBe(false);
        expect(result.error).toContain("unique constraint");
    });
});

describe("RELY-06: State Loading", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("loads state from snapshot + updates", async () => {
        // Mock snapshot query
        const mockSnapshotQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: { version: 10, state_json: "Hello" },
                error: null,
            }),
        };

        // Mock updates query - chain gt -> order
        // Create a ChangeSet that inserts " World" at position 5 (end of "Hello")
        // ChangeSet.of takes specs and document length. { from: N, insert: str } inserts at position N
        const insertWorldChanges = ChangeSet.of([{ from: 5, insert: " World" }], 5);
        const mockUpdatesQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gt: vi.fn(() => ({
                order: vi.fn().mockResolvedValue({
                    data: [
                        {
                            version: 11,
                            client_id: "client-1",
                            changes: insertWorldChanges.toJSON(),
                        },
                    ],
                    error: null,
                }),
            })),
        };

        vi.mocked(supabase!.from).mockImplementation((table) => {
            if (table === "collab_snapshots") return mockSnapshotQuery as any;
            if (table === "collab_updates") return mockUpdatesQuery as any;
            throw new Error(`Unexpected table: ${table}`);
        });

        const result = await loadRoomState("doc-123");

        expect(result.version).toBe(11);
        expect(result.doc.toString()).toBe("Hello World");
        expect(result.updates.length).toBe(1);
        expect(result.snapshotVersion).toBe(10);
    });

    it("handles empty document (no snapshot, no updates)", async () => {
        const mockSnapshotQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: "PGRST116" }, // No rows
            }),
        };

        const mockUpdatesQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gt: vi.fn(() => ({
                order: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                }),
            })),
        };

        vi.mocked(supabase!.from).mockImplementation((table) => {
            if (table === "collab_snapshots") return mockSnapshotQuery as any;
            if (table === "collab_updates") return mockUpdatesQuery as any;
            throw new Error(`Unexpected table: ${table}`);
        });

        const result = await loadRoomState("doc-123");

        expect(result.version).toBe(0);
        expect(result.doc.toString()).toBe("");
        expect(result.updates.length).toBe(0);
    });
});

describe("Snapshot Thresholds (D-41)", () => {
    it("exports correct threshold constants", () => {
        expect(SNAPSHOT_UPDATE_THRESHOLD).toBe(50);
        expect(SNAPSHOT_TIME_THRESHOLD_MS).toBe(120_000);
    });

    it("triggers on update count threshold", () => {
        const room = {
            documentId: "doc-123",
            version: 60,
            lastSnapshotVersion: 5,
            lastSnapshotTime: Date.now(),
        } as any;

        expect(checkSnapshotThreshold(room)).toBe(true);
    });

    it("triggers on time threshold", () => {
        const room = {
            documentId: "doc-123",
            version: 10,
            lastSnapshotVersion: 5,
            lastSnapshotTime: Date.now() - 130_000, // > 2 minutes
        } as any;

        expect(checkSnapshotThreshold(room)).toBe(true);
    });

    it("does not trigger below thresholds", () => {
        const room = {
            documentId: "doc-123",
            version: 10,
            lastSnapshotVersion: 5,
            lastSnapshotTime: Date.now() - 60_000, // 1 minute
        } as any;

        expect(checkSnapshotThreshold(room)).toBe(false);
    });
});
