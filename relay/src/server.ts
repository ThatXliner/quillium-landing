/**
 * server.ts -- Socket.io server setup.
 *
 * WebSocket server for Quillium Omni real-time collaboration.
 * Per D-30: Uses Socket.io for built-in rooms, reconnection, fallback.
 * Per RESEARCH.md: perMessageDeflate disabled to prevent memory issues.
 */
import { createServer, type Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import { authMiddleware } from "./auth/middleware.js";

/**
 * Create and configure the Socket.io server.
 */
export function createRelayServer(): { io: Server; httpServer: HttpServer } {
    const httpServer = createServer((req, res) => {
        // Health check endpoint for Fly.io
        if (req.url === "/health") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", timestamp: Date.now() }));
            return;
        }
        res.writeHead(404);
        res.end("Not found");
    });

    const io = new Server(httpServer, {
        cors: {
            // Tauri app origins
            origin: [
                "tauri://localhost",
                "http://localhost:1420", // Vite dev server
                "http://localhost:5173", // Alternate Vite port
            ],
            credentials: true,
        },
        // Per RESEARCH.md pitfall 6: disable perMessageDeflate
        perMessageDeflate: false,
        // Socket.io configuration (Claude's discretion per CONTEXT.md)
        pingInterval: 25000,
        pingTimeout: 20000,
        // Connection options
        connectionStateRecovery: {
            // Allow client to recover connection within 2 minutes
            maxDisconnectionDuration: 2 * 60 * 1000,
            // Skip middleware on recovery (auth already validated)
            skipMiddlewares: false,
        },
    });

    // Register auth middleware
    io.use(authMiddleware);

    // Connection handler (handlers added in Plan 03)
    io.on("connection", (socket: Socket) => {
        const { userId, documentId } = socket.data;
        console.log(`[server] Socket ${socket.id} joined room ${documentId}`);

        // Join document room
        socket.join(documentId);

        // Placeholder handlers (implemented in Plan 03)
        socket.on("pullUpdates", (data, callback) => {
            console.log("[server] pullUpdates not yet implemented");
            callback({ error: "NOT_IMPLEMENTED" });
        });

        socket.on("pushUpdates", (data, callback) => {
            console.log("[server] pushUpdates not yet implemented");
            callback({ error: "NOT_IMPLEMENTED" });
        });

        socket.on("disconnect", (reason) => {
            console.log(`[server] Socket ${socket.id} disconnected: ${reason}`);
        });
    });

    return { io, httpServer };
}

// Export types for other modules
export type { Server, Socket };
