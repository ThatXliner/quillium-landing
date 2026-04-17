/**
 * room.test.ts -- Tests for room management and OT ordering.
 *
 * Covers RELY-03 (version ordering) and RELY-04 (broadcasting).
 */
import { describe, it, expect } from "vitest";

describe("RELY-03: Version Ordering (rebaseUpdates)", () => {
    it.todo("accepts updates at current version");
    it.todo("rebases updates from stale client version");
    it.todo("assigns monotonically increasing version numbers");
    it.todo("applies rebased changes to document state");
});

describe("RELY-04: Update Broadcasting", () => {
    it.todo("broadcasts accepted updates to all room members");
    it.todo("excludes sender from broadcast");
    it.todo("includes version number in broadcast");
});

describe("Room Lifecycle", () => {
    it.todo("creates room on first client connection");
    it.todo("schedules cleanup when last client disconnects");
    it.todo("cancels cleanup when new client joins before timeout");
    it.todo("deletes room after cleanup timeout with no clients");
});
