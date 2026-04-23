/**
 * server.ts -- Native WebSocket server with Yjs sync protocol.
 *
 * Per D-71: Replace Socket.io with native WebSocket + Yjs.
 * Uses 'ws' package for WebSocket server.
 *
 * Connection flow:
 * 1. HTTP upgrade request with JWT in params
 * 2. Auth validation in upgrade handler
 * 3. WebSocket accepted, Yjs sync established
 */
import { createServer, type Server as HttpServer, type IncomingMessage } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import type { Duplex } from "stream";
import { authenticateWebSocket } from "./auth/middleware.js";
import { getOrCreateYjsRoom, scheduleRoomCleanup, getRoomCount } from "./yjs/rooms.js";
import { setupYjsConnection } from "./yjs/sync.js";
import { queueYjsUpdate } from "./persistence/debouncedUpdates.js";
import { isOriginAllowed } from "./origins.js";
import { createLogger } from "./logger.js";

const logger = createLogger("server");

/**
 * Create and configure the Yjs relay server.
 */
export function createRelayServer(): { wss: WebSocketServer; httpServer: HttpServer } {
    const httpServer = createServer((req, res) => {
        // Health check endpoint
        if (req.url === "/health") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    status: "ok",
                    timestamp: Date.now(),
                    rooms: getRoomCount(),
                    protocol: "yjs",
                }),
            );
            return;
        }
        res.writeHead(404);
        res.end("Not found");
    });

    const wss = new WebSocketServer({ noServer: true });

    // Handle WebSocket upgrade with auth
    httpServer.on("upgrade", async (request: IncomingMessage, socket: Duplex, head: Buffer) => {
        try {
            if (!isOriginAllowed(request.headers.origin)) {
                socket.write("HTTP/1.1 403 Forbidden\r\n\r\nOrigin not allowed");
                socket.destroy();
                return;
            }

            // Parse URL for auth params
            const url = new URL(request.url!, `http://${request.headers.host}`);
            const token = url.searchParams.get("auth");
            const pathParts = url.pathname.split("/").filter(Boolean);
            const documentId = pathParts[0] === "relay" ? pathParts[1] : pathParts[0];

            // Skip non-document paths
            if (!documentId || documentId === "health") {
                socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
                socket.destroy();
                return;
            }

            // Authenticate
            const authResult = await authenticateWebSocket(token, documentId);

            if (!authResult.success || !authResult.data) {
                logger.info(`Auth failed: ${authResult.error}`);
                socket.write(`HTTP/1.1 401 Unauthorized\r\n\r\n${authResult.error || ""}`);
                socket.destroy();
                return;
            }

            // Upgrade to WebSocket
            wss.handleUpgrade(request, socket, head, async (ws: WebSocket) => {
                const room = await getOrCreateYjsRoom(documentId);

                // Setup Yjs connection with persistence callback
                setupYjsConnection(ws, room, authResult.data!, (update) => {
                    queueYjsUpdate(documentId, update);
                });

                // Schedule cleanup when client disconnects
                ws.on("close", () => {
                    if (room.clients.size === 0) {
                        scheduleRoomCleanup(room);
                    }
                });
            });
        } catch (e) {
            logger.error("Upgrade error:", e);
            socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
            socket.destroy();
        }
    });

    return { wss, httpServer };
}

// Export for types
export type { WebSocketServer, WebSocket };
