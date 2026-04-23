/**
 * persistence.test.ts -- Tests for Yjs persistence and retry helpers.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as Y from "yjs";

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
import {
    persistYjsState,
    persistYjsUpdate,
    persistYjsUpdates,
    loadYjsState,
    clearYjsUpdates,
} from "../persistence/yjsUpdates.js";
import {
    queueYjsUpdate,
    flushDocumentUpdates,
    flushAllDocumentUpdates,
} from "../persistence/debouncedUpdates.js";

describe("Retry wrapper", () => {
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

    it("retries transient errors", async () => {
        const operation = vi.fn()
            .mockResolvedValueOnce({ data: null, error: { message: "connection timeout" } })
            .mockResolvedValueOnce({ data: null, error: { message: "connection timeout" } })
            .mockResolvedValueOnce({ data: "result", error: null });

        const result = await withRetry(operation, "test-op");

        expect(result.success).toBe(true);
        expect(operation).toHaveBeenCalledTimes(3);
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

    it("exports expected backoff constants", () => {
        expect(MAX_RETRIES).toBe(3);
        expect(BASE_DELAY_MS).toBe(100);
        expect(MAX_DELAY_MS).toBe(2000);
    });
});

describe("Yjs persistence", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    afterEach(async () => {
        await flushAllDocumentUpdates();
        vi.useRealTimers();
    });

    it("persists full Yjs state snapshots", async () => {
        const upsert = vi.fn().mockResolvedValue({ error: null });
        vi.mocked(supabase!.from).mockReturnValue({ upsert } as any);

        const ydoc = new Y.Doc();
        ydoc.getText("document").insert(0, "hello");

        const result = await persistYjsState("doc-123", ydoc);

        expect(result.success).toBe(true);
        expect(supabase!.from).toHaveBeenCalledWith("yjs_documents");
        expect(upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                document_id: "doc-123",
                state_update: expect.any(String),
                state_vector: expect.any(String),
                updated_at: expect.any(String),
            }),
            { onConflict: "document_id" },
        );
    });

    it("persists a single incremental Yjs update", async () => {
        const insert = vi.fn().mockResolvedValue({ error: null });
        vi.mocked(supabase!.from).mockReturnValue({ insert } as any);

        const result = await persistYjsUpdate("doc-123", new Uint8Array([1, 2, 3]));

        expect(result.success).toBe(true);
        expect(supabase!.from).toHaveBeenCalledWith("yjs_updates");
        expect(insert).toHaveBeenCalledWith({
            document_id: "doc-123",
            update_data: Buffer.from([1, 2, 3]).toString("base64"),
            created_at: expect.any(String),
        });
    });

    it("persists batched incremental updates", async () => {
        const insert = vi.fn().mockResolvedValue({ error: null });
        vi.mocked(supabase!.from).mockReturnValue({ insert } as any);

        const result = await persistYjsUpdates("doc-123", [
            new Uint8Array([1]),
            new Uint8Array([2]),
        ]);

        expect(result.success).toBe(true);
        expect(insert).toHaveBeenCalledWith([
            expect.objectContaining({ document_id: "doc-123", update_data: "AQ==" }),
            expect.objectContaining({ document_id: "doc-123", update_data: "Ag==" }),
        ]);
    });

    it("loads snapshot plus incremental updates into a Y.Doc", async () => {
        const snapshotDoc = new Y.Doc();
        snapshotDoc.getText("document").insert(0, "hello");
        const snapshotUpdate = Y.encodeStateAsUpdate(snapshotDoc);
        const snapshotVector = Y.encodeStateVector(snapshotDoc);

        const incrementalDoc = new Y.Doc();
        Y.applyUpdate(incrementalDoc, snapshotUpdate);
        let incrementalUpdate: Uint8Array | null = null;
        incrementalDoc.on("update", (update) => {
            incrementalUpdate = update;
        });
        incrementalDoc.getText("document").insert(5, " world");

        const snapshotQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
                data: {
                    state_update: Buffer.from(snapshotUpdate).toString("base64"),
                    state_vector: Buffer.from(snapshotVector).toString("base64"),
                },
                error: null,
            }),
        };
        const updatesQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({
                data: [
                    { update_data: Buffer.from(incrementalUpdate!).toString("base64") },
                ],
                error: null,
            }),
        };

        vi.mocked(supabase!.from).mockImplementation((table) => {
            if (table === "yjs_documents") return snapshotQuery as any;
            if (table === "yjs_updates") return updatesQuery as any;
            throw new Error(`Unexpected table: ${table}`);
        });

        const result = await loadYjsState("doc-123");

        expect(result.ydoc.getText("document").toString()).toBe("hello world");
        expect(result.stateVector).toEqual(snapshotVector);
    });

    it("clears incremental update log after snapshot", async () => {
        const eq = vi.fn().mockResolvedValue({ error: null });
        const deleteFn = vi.fn().mockReturnValue({ eq });
        vi.mocked(supabase!.from).mockReturnValue({ delete: deleteFn } as any);

        await clearYjsUpdates("doc-123");

        expect(supabase!.from).toHaveBeenCalledWith("yjs_updates");
        expect(deleteFn).toHaveBeenCalled();
        expect(eq).toHaveBeenCalledWith("document_id", "doc-123");
    });

    it("debounces high-frequency update persistence and flushes manually", async () => {
        vi.useFakeTimers();
        const insert = vi.fn().mockResolvedValue({ error: null });
        vi.mocked(supabase!.from).mockReturnValue({ insert } as any);

        queueYjsUpdate("doc-batch", new Uint8Array([1]));
        queueYjsUpdate("doc-batch", new Uint8Array([2]));

        expect(insert).not.toHaveBeenCalled();

        await flushDocumentUpdates("doc-batch");

        expect(insert).toHaveBeenCalledTimes(1);
        expect(insert).toHaveBeenCalledWith([
            expect.objectContaining({ update_data: "AQ==" }),
            expect.objectContaining({ update_data: "Ag==" }),
        ]);
    });
});
