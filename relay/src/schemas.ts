/**
 * schemas.ts -- Zod validation schemas for WebSocket messages.
 *
 * Validates client handshake data and collab protocol messages.
 * Per D-32/D-33: Validates JWT presence and document ID on connect.
 */
import { z } from "zod";

/**
 * Handshake auth data sent by client on connection.
 * Per RESEARCH.md: token in socket.handshake.auth
 */
export const HandshakeAuthSchema = z.object({
    token: z.string().min(1, "Token is required"),
    documentId: z.string().uuid("Document ID must be a valid UUID"),
});

export type HandshakeAuth = z.infer<typeof HandshakeAuthSchema>;

/**
 * Error codes returned to client on auth failure.
 * Per D-33: Invalid/expired JWTs rejected immediately.
 */
export const AuthErrorCode = {
    AUTH_REQUIRED: 4001,
    AUTH_INVALID: 4002,
    AUTH_EXPIRED: 4003,
    PERMISSION_DENIED: 4004,
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

/**
 * Error codes for persistence failures.
 * Per D-42: Client receives error code and can retry or surface to user.
 */
export const PersistErrorCode = {
    PERSIST_FAILED: 5001,
    PERSIST_TIMEOUT: 5002,
    PERSIST_CONFLICT: 5003,
} as const;

export type PersistErrorCode = (typeof PersistErrorCode)[keyof typeof PersistErrorCode];

/**
 * ChangeSet structure from @codemirror/state.
 * CodeMirror's ChangeSet.toJSON() returns an array, not an object.
 * Skip strict validation here — CodeMirror.fromJSON() does the real parsing.
 */
export const ChangeSetSchema = z.any();

/**
 * Update structure from @codemirror/collab.
 */
export const UpdateSchema = z.object({
    clientID: z.string(),
    changes: ChangeSetSchema,
});

export type Update = z.infer<typeof UpdateSchema>;

/**
 * pullUpdates request: client asks for updates since version.
 */
export const PullUpdatesRequestSchema = z.object({
    version: z.number().int().nonnegative(),
});

export type PullUpdatesRequest = z.infer<typeof PullUpdatesRequestSchema>;

/**
 * pushUpdates request: client sends new updates.
 */
export const PushUpdatesRequestSchema = z.object({
    version: z.number().int().nonnegative(),
    updates: z.array(UpdateSchema).min(1),
});

export type PushUpdatesRequest = z.infer<typeof PushUpdatesRequestSchema>;
