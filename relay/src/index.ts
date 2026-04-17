/**
 * index.ts -- Relay server entry point.
 *
 * WebSocket relay server for Quillium Omni real-time collaboration.
 * Handles JWT authentication, permission validation, OT ordering,
 * and update broadcasting between connected clients.
 *
 * See: .planning/phases/04-relay-core/04-RESEARCH.md for architecture.
 */
import "dotenv/config";
import { createRelayServer } from "./server.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

const { httpServer, io } = createRelayServer();

httpServer.listen(PORT, () => {
    console.log(`[relay] WebSocket relay listening on port ${PORT}`);
    console.log(`[relay] Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("[relay] SIGTERM received, closing server...");
    io.close(() => {
        console.log("[relay] Server closed");
        process.exit(0);
    });
});
