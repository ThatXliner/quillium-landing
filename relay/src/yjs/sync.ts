/**
 * sync.ts -- Yjs sync protocol handler.
 *
 * Per D-71: Implements y-websocket server pattern.
 * Handles sync and awareness message types.
 *
 * Message types:
 * 0 = sync (Y.Doc state)
 * 1 = awareness (cursor/presence)
 * 3 = custom (owner disconnect, etc.)
 */
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import type { WebSocket as WsWebSocket } from "ws";

// Use ws package WebSocket type
type WebSocket = WsWebSocket;
import type { YjsRoom, YjsClientData } from "./types.js";

// Message type constants
export const MESSAGE_SYNC = 0;
export const MESSAGE_AWARENESS = 1;
export const MESSAGE_CUSTOM = 3;

// Custom message subtypes
export const CUSTOM_OWNER_LEFT = 1;
export const CUSTOM_CLIENT_LEFT = 2;

/**
 * Setup Yjs connection for a WebSocket.
 * Sends initial sync step and registers message handler.
 *
 * @param ws - WebSocket connection
 * @param room - Yjs room
 * @param clientData - Authenticated client data
 * @param onUpdate - Callback when Y.Doc is updated (for persistence)
 */
export function setupYjsConnection(
    ws: WebSocket,
    room: YjsRoom,
    clientData: YjsClientData,
    onUpdate?: (update: Uint8Array) => void,
): void {
    const { ydoc, awareness, clients } = room;

    // Add client to room
    clients.add(ws);

    // Track owner connection for D-57
    if (clientData.isOwner) {
        room.isOwnerConnected = true;
        room.ownerId = clientData.userId;
    }

    console.log(
        `[yjs] Client ${clientData.userId.slice(0, 8)}... joined room ${room.documentId.slice(0, 8)}...`,
    );

    // Send sync step 1 (state vector)
    const syncEncoder = encoding.createEncoder();
    encoding.writeVarUint(syncEncoder, MESSAGE_SYNC);
    syncProtocol.writeSyncStep1(syncEncoder, ydoc);
    ws.send(encoding.toUint8Array(syncEncoder));

    // Send current awareness states
    const awarenessEncoder = encoding.createEncoder();
    encoding.writeVarUint(awarenessEncoder, MESSAGE_AWARENESS);
    encoding.writeVarUint8Array(
        awarenessEncoder,
        awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(awareness.getStates().keys())),
    );
    if (encoding.length(awarenessEncoder) > 1) {
        ws.send(encoding.toUint8Array(awarenessEncoder));
    }

    // Handle Y.Doc updates (broadcast to other clients)
    const updateHandler = (update: Uint8Array, origin: unknown) => {
        // Don't broadcast back to the originating client
        if (origin === ws) return;

        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_SYNC);
        syncProtocol.writeUpdate(encoder, update);
        const message = encoding.toUint8Array(encoder);

        // Broadcast to all other clients
        for (const client of clients) {
            if (client !== ws && client.readyState === 1) {
                client.send(message);
            }
        }

        // Trigger persistence callback
        if (onUpdate) {
            onUpdate(update);
        }
    };
    ydoc.on("update", updateHandler);

    // Handle awareness updates (broadcast to all)
    const awarenessHandler = (
        { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
        _origin: unknown,
    ) => {
        const changedClients = added.concat(updated, removed);
        if (changedClients.length === 0) return;

        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(
            encoder,
            awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients),
        );
        const message = encoding.toUint8Array(encoder);

        // Broadcast to all clients
        for (const client of clients) {
            if (client.readyState === 1) {
                client.send(message);
            }
        }
    };
    awareness.on("update", awarenessHandler);

    // Handle incoming messages
    ws.on("message", (data: ArrayBuffer) => {
        try {
            handleMessage(ws, room, clientData, new Uint8Array(data));
        } catch (e) {
            console.error("[yjs] Message handling error:", e);
        }
    });

    // Handle disconnect
    ws.on("close", () => {
        clients.delete(ws);
        ydoc.off("update", updateHandler);
        awareness.off("update", awarenessHandler);

        // Remove client's awareness state
        awarenessProtocol.removeAwarenessStates(
            awareness,
            [/* client awareness ID would go here */],
            "disconnect",
        );

        // Broadcast client left
        broadcastCustomMessage(clients, CUSTOM_CLIENT_LEFT, { userId: clientData.userId });

        console.log(
            `[yjs] Client ${clientData.userId.slice(0, 8)}... left room ${room.documentId.slice(0, 8)}...`,
        );

        // Handle owner disconnect (D-57, D-61)
        if (clientData.isOwner) {
            room.isOwnerConnected = false;
            console.log(
                `[yjs] Owner left, kicking all clients from room ${room.documentId.slice(0, 8)}...`,
            );

            // Send ownerLeft message to all remaining clients
            broadcastCustomMessage(clients, CUSTOM_OWNER_LEFT, {});

            // Close all client connections
            for (const client of clients) {
                client.close(1000, "Owner left");
            }
        }
    });
}

/**
 * Handle incoming Yjs protocol message.
 */
function handleMessage(
    ws: WebSocket,
    room: YjsRoom,
    _clientData: YjsClientData,
    data: Uint8Array,
): void {
    const { ydoc, awareness } = room;
    const decoder = decoding.createDecoder(data);
    const messageType = decoding.readVarUint(decoder);

    switch (messageType) {
        case MESSAGE_SYNC: {
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, MESSAGE_SYNC);

            // Read sync message and write response
            // Wrap in try-catch per T-07.5-07: malformed data mitigation
            try {
                syncProtocol.readSyncMessage(decoder, encoder, ydoc, ws);
            } catch (e) {
                console.error("[yjs] Malformed sync message, disconnecting client:", e);
                ws.close(1003, "Malformed sync message");
                return;
            }

            // Send response if any
            if (encoding.length(encoder) > 1) {
                ws.send(encoding.toUint8Array(encoder));
            }
            break;
        }

        case MESSAGE_AWARENESS: {
            // Wrap in try-catch per T-07.5-07: malformed data mitigation
            try {
                awarenessProtocol.applyAwarenessUpdate(
                    awareness,
                    decoding.readVarUint8Array(decoder),
                    ws,
                );
            } catch (e) {
                console.error("[yjs] Malformed awareness message:", e);
                // Don't disconnect for awareness issues, just log
            }
            break;
        }

        default:
            console.warn(`[yjs] Unknown message type: ${messageType}`);
    }
}

/**
 * Broadcast custom message to all clients.
 */
function broadcastCustomMessage(
    clients: Set<WebSocket>,
    subtype: number,
    payload: Record<string, unknown>,
): void {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MESSAGE_CUSTOM);
    encoding.writeVarUint(encoder, subtype);
    encoding.writeVarString(encoder, JSON.stringify(payload));
    const message = encoding.toUint8Array(encoder);

    for (const client of clients) {
        if (client.readyState === 1) {
            client.send(message);
        }
    }
}
