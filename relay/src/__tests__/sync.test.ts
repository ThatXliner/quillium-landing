/**
 * sync.test.ts -- Tests for Yjs sync protocol handler.
 *
 * Verifies that updates from one client are broadcast to OTHER clients
 * (and not echoed back to the sender, and not dropped).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as syncProtocol from "y-protocols/sync";
import { setupYjsConnection, MESSAGE_SYNC } from "../yjs/sync.js";
import type { YjsRoom, YjsClientData } from "../yjs/types.js";

/**
 * Minimal WebSocket mock that records sent messages and can simulate
 * incoming messages via `receive()`.
 */
class FakeWebSocket {
    public sent: Uint8Array[] = [];
    public readyState = 1; // OPEN
    private listeners: Record<string, Array<(...args: any[]) => void>> = {};

    send(data: Uint8Array): void {
        this.sent.push(data);
    }

    close(): void {
        this.readyState = 3;
        this.emit("close");
    }

    on(event: string, cb: (...args: any[]) => void): void {
        (this.listeners[event] ||= []).push(cb);
    }

    off(event: string, cb: (...args: any[]) => void): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter((f) => f !== cb);
    }

    emit(event: string, ...args: any[]): void {
        for (const cb of this.listeners[event] || []) cb(...args);
    }

    /** Simulate incoming message from the wire. */
    receive(data: Uint8Array): void {
        this.emit("message", data);
    }
}

function buildUpdateMessage(update: Uint8Array): Uint8Array {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MESSAGE_SYNC);
    syncProtocol.writeUpdate(encoder, update);
    return encoding.toUint8Array(encoder);
}

function makeRoom(): YjsRoom {
    const ydoc = new Y.Doc();
    const awareness = new Awareness(ydoc);
    return {
        documentId: "test-doc",
        ydoc,
        awareness,
        clients: new Set(),
        cleanupTimer: null,
        isOwnerConnected: false,
        ownerId: null,
    };
}

function makeClient(userId: string, isOwner = false): YjsClientData {
    return {
        userId,
        documentId: "test-doc",
        isOwner,
        isAnonymous: false,
    };
}

describe("Yjs sync broadcast", () => {
    let room: YjsRoom;
    let wsA: FakeWebSocket;
    let wsB: FakeWebSocket;

    beforeEach(() => {
        room = makeRoom();
        wsA = new FakeWebSocket();
        wsB = new FakeWebSocket();
        setupYjsConnection(wsA as any, room, makeClient("user-a", true));
        setupYjsConnection(wsB as any, room, makeClient("user-b", false));
        // Clear initial sync step 1/2 messages from the setup phase
        wsA.sent = [];
        wsB.sent = [];
    });

    afterEach(() => {
        wsA.close();
        wsB.close();
        room.ydoc.destroy();
        room.awareness.destroy();
    });

    it("broadcasts A's update to B (not back to A)", () => {
        // Simulate: Client A types "hi" locally. Its Y.Doc produces an update,
        // which the client sends to the server as a sync message with the update.
        const clientYdoc = new Y.Doc();
        const clientYtext = clientYdoc.getText("document");
        let producedUpdate: Uint8Array | null = null;
        clientYdoc.on("update", (u) => {
            producedUpdate = u;
        });
        clientYtext.insert(0, "hi");
        expect(producedUpdate).not.toBeNull();

        // Client A sends that update to the server
        wsA.receive(buildUpdateMessage(producedUpdate!));

        // B should have received the broadcast
        expect(wsB.sent.length).toBeGreaterThanOrEqual(1);

        // A should NOT have received an echo of its own update
        // (A may receive a trivial sync response with only a header, which is fine,
        // but it shouldn't receive the update broadcast payload itself.)
        const aReceivedBroadcast = wsA.sent.some((msg) => msg.length > 5);
        expect(aReceivedBroadcast).toBe(false);

        // The server's ydoc should reflect A's update
        expect(room.ydoc.getText("document").toString()).toBe("hi");
    });

    it("broadcasts B's update to A (not back to B)", () => {
        const clientYdoc = new Y.Doc();
        const clientYtext = clientYdoc.getText("document");
        let producedUpdate: Uint8Array | null = null;
        clientYdoc.on("update", (u) => {
            producedUpdate = u;
        });
        clientYtext.insert(0, "hello");
        expect(producedUpdate).not.toBeNull();

        wsB.receive(buildUpdateMessage(producedUpdate!));

        expect(wsA.sent.length).toBeGreaterThanOrEqual(1);
        const bReceivedBroadcast = wsB.sent.some((msg) => msg.length > 5);
        expect(bReceivedBroadcast).toBe(false);
        expect(room.ydoc.getText("document").toString()).toBe("hello");
    });

    it("with 3 clients, A's update reaches B and C exactly once each", () => {
        const wsC = new FakeWebSocket();
        setupYjsConnection(wsC as any, room, makeClient("user-c", false));
        wsA.sent = [];
        wsB.sent = [];
        wsC.sent = [];

        const clientYdoc = new Y.Doc();
        const clientYtext = clientYdoc.getText("document");
        let producedUpdate: Uint8Array | null = null;
        clientYdoc.on("update", (u) => {
            producedUpdate = u;
        });
        clientYtext.insert(0, "xyz");

        wsA.receive(buildUpdateMessage(producedUpdate!));

        const bBroadcasts = wsB.sent.filter((m) => m.length > 5);
        const cBroadcasts = wsC.sent.filter((m) => m.length > 5);
        const aBroadcasts = wsA.sent.filter((m) => m.length > 5);

        expect(bBroadcasts.length).toBe(1);
        expect(cBroadcasts.length).toBe(1);
        expect(aBroadcasts.length).toBe(0);

        wsC.close();
    });

    it("calls persistence callback once per update (not once per client)", () => {
        // Each client registers with the same persistence callback in prod.
        // Ensure the callback fires EXACTLY ONCE per update, not once per
        // connected client (which would mean 3x writes to Supabase per edit).
        const onUpdate = vi.fn();
        const freshRoom = makeRoom();
        const wsX = new FakeWebSocket();
        const wsY = new FakeWebSocket();
        const wsZ = new FakeWebSocket();
        setupYjsConnection(wsX as any, freshRoom, makeClient("x", true), onUpdate);
        setupYjsConnection(wsY as any, freshRoom, makeClient("y", false), onUpdate);
        setupYjsConnection(wsZ as any, freshRoom, makeClient("z", false), onUpdate);

        const clientYdoc = new Y.Doc();
        const clientYtext = clientYdoc.getText("document");
        let producedUpdate: Uint8Array | null = null;
        clientYdoc.on("update", (u) => {
            producedUpdate = u;
        });
        clientYtext.insert(0, "persist-me");

        wsX.receive(buildUpdateMessage(producedUpdate!));

        expect(onUpdate).toHaveBeenCalledTimes(1);

        wsX.close();
        wsY.close();
        wsZ.close();
        freshRoom.ydoc.destroy();
        freshRoom.awareness.destroy();
    });
});
