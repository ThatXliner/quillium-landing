/**
 * index.ts -- Relay server entry point.
 *
 * WebSocket relay server for Quillium Omni real-time collaboration.
 * Per D-71: Uses native WebSocket + Yjs sync protocol.
 *
 * See: .planning/phases/07.5-yjs-migration/07.5-RESEARCH.md for architecture.
 */
import "dotenv/config";
import { createRelayServer } from "./server.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

const { httpServer, wss } = createRelayServer();

httpServer.listen(PORT, () => {
    console.log(`[relay] Yjs WebSocket relay listening on port ${PORT}`);
    console.log(`[relay] Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("[relay] SIGTERM received, closing server...");
    wss.close(() => {
        httpServer.close(() => {
            console.log("[relay] Server closed");
            process.exit(0);
        });
    });
});
