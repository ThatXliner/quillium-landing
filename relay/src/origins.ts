/**
 * origins.ts -- WebSocket Origin allowlist helpers.
 */
import { createLogger } from "./logger.js";

const logger = createLogger("origin");

const DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:1420",
    "tauri://localhost",
];

function parseAllowedOrigins(): Set<string> | null {
    const raw = process.env.ALLOWED_ORIGINS;

    if (!raw) {
        return null;
    }

    const origins = raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return new Set(origins);
}

export const allowedOrigins = parseAllowedOrigins();

if (!allowedOrigins) {
    logger.warn("ALLOWED_ORIGINS is not set; WebSocket origin checks are disabled");
}

/**
 * Validate browser WebSocket Origin headers when ALLOWED_ORIGINS is set.
 * Non-browser clients may omit Origin; allow that path for native app clients.
 */
export function isOriginAllowed(origin: string | undefined): boolean {
    if (!allowedOrigins) {
        return true;
    }

    if (!origin) {
        return true;
    }

    return allowedOrigins.has(origin) || DEFAULT_ALLOWED_ORIGINS.includes(origin);
}
