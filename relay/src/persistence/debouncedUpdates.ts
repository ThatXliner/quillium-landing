/**
 * debouncedUpdates.ts -- Coalesce high-frequency Yjs update writes.
 */
import { persistYjsUpdates } from "./yjsUpdates.js";
import { createLogger } from "../logger.js";

const DEFAULT_DEBOUNCE_MS = 500;
const debounceMs = parseInt(process.env.PERSIST_DEBOUNCE_MS ?? String(DEFAULT_DEBOUNCE_MS), 10);
const logger = createLogger("persistence");

interface PendingBatch {
    updates: Uint8Array[];
    timer: NodeJS.Timeout | null;
}

const pending = new Map<string, PendingBatch>();

export function queueYjsUpdate(documentId: string, update: Uint8Array): void {
    let batch = pending.get(documentId);

    if (!batch) {
        batch = { updates: [], timer: null };
        pending.set(documentId, batch);
    }

    batch.updates.push(update);

    if (!batch.timer) {
        batch.timer = setTimeout(() => {
            flushDocumentUpdates(documentId).catch((e) => {
                logger.warn("Debounced flush failed:", e);
            });
        }, Number.isFinite(debounceMs) && debounceMs >= 0 ? debounceMs : DEFAULT_DEBOUNCE_MS);
    }
}

export async function flushDocumentUpdates(documentId: string): Promise<void> {
    const batch = pending.get(documentId);

    if (!batch) {
        return;
    }

    if (batch.timer) {
        clearTimeout(batch.timer);
    }

    pending.delete(documentId);

    const result = await persistYjsUpdates(documentId, batch.updates);
    if (!result.success) {
        logger.warn(`Failed to flush updates for ${documentId.slice(0, 8)}...`);
    }
}

export async function flushAllDocumentUpdates(): Promise<void> {
    await Promise.all(Array.from(pending.keys()).map((documentId) => flushDocumentUpdates(documentId)));
}
