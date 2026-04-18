/**
 * middleware.ts -- JWT validation for WebSocket upgrade.
 *
 * Per D-71: Auth in WebSocket upgrade handler (not Socket.io middleware).
 * Validates JWT and document permissions.
 */
import type { Socket } from "socket.io";
import { supabase, supabaseConfigured } from "./supabase.js";
import { HandshakeAuthSchema, AuthErrorCode } from "../schemas.js";
import type { YjsClientData } from "../yjs/types.js";

/**
 * Extended socket data with user info.
 * @deprecated Use YjsClientData for native WebSocket
 */
export interface AuthenticatedSocketData {
    userId: string;
    documentId: string;
    isAnonymous: boolean;
    isOwner: boolean;
}

/**
 * Authentication result for WebSocket upgrade.
 */
export interface AuthResult {
    success: boolean;
    data?: YjsClientData;
    error?: string;
}

/**
 * Validate JWT and document permissions for WebSocket upgrade.
 *
 * @param token - JWT access token
 * @param documentId - Document ID being accessed
 */
export async function authenticateWebSocket(
    token: string | null,
    documentId: string,
): Promise<AuthResult> {
    if (!token) {
        return { success: false, error: "Missing auth token" };
    }

    if (!documentId) {
        return { success: false, error: "Missing document ID" };
    }

    if (!supabaseConfigured || !supabase) {
        console.error("[auth] Supabase not configured");
        return { success: false, error: "Server misconfigured" };
    }

    try {
        // Verify JWT with Supabase
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return { success: false, error: "Invalid token" };
        }

        // Check document access
        const { data: doc, error: docError } = await supabase
            .from("sync_documents")
            .select("owner_id")
            .eq("id", documentId)
            .maybeSingle();

        if (docError) {
            return { success: false, error: "Database error" };
        }

        const isOwner = doc?.owner_id === user.id;
        const isAnonymous = user.is_anonymous ?? false;

        // For now, allow access if document exists or user is creating it
        // (Per D-57: Live Room mode, owner must be connected)
        // TODO: Check shares table for non-owner access

        return {
            success: true,
            data: {
                userId: user.id,
                documentId,
                isOwner,
                isAnonymous,
            },
        };
    } catch (e) {
        console.error("[auth] Error:", e);
        return { success: false, error: "Auth error" };
    }
}

/**
 * Authentication middleware for Socket.io.
 * Validates JWT and checks document access permissions.
 *
 * @deprecated Use authenticateWebSocket for native WebSocket
 * @param socket - Socket.io socket instance
 * @param next - Callback to continue or reject connection
 */
export async function authMiddleware(
    socket: Socket,
    next: (err?: Error) => void,
): Promise<void> {
    // Check Supabase configuration
    if (!supabaseConfigured || !supabase) {
        console.error("[auth] Supabase not configured");
        return next(new Error(`${AuthErrorCode.AUTH_REQUIRED}`));
    }

    // Validate handshake data
    const parseResult = HandshakeAuthSchema.safeParse(socket.handshake.auth);
    if (!parseResult.success) {
        console.warn("[auth] Invalid handshake data:", parseResult.error.message);
        return next(new Error(`${AuthErrorCode.AUTH_REQUIRED}`));
    }

    const { token, documentId } = parseResult.data;

    try {
        // Validate JWT via Supabase Admin SDK
        // getUser validates signature, expiration, and returns user
        const { data: user, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user?.user) {
            console.warn("[auth] JWT validation failed:", userError?.message ?? "No user");
            // Per D-33: expired/invalid tokens get specific error
            if (userError?.message?.includes("expired")) {
                return next(new Error(`${AuthErrorCode.AUTH_EXPIRED}`));
            }
            return next(new Error(`${AuthErrorCode.AUTH_INVALID}`));
        }

        // Per D-34: Check permissions once on connect
        // For prototype per D-09 (zero RLS), skip strict permission check
        // Just verify document exists in sync_documents
        const { data: doc, error: docError } = await supabase
            .from("sync_documents")
            .select("id, owner_id")
            .eq("id", documentId)
            .single();

        if (docError || !doc) {
            console.warn("[auth] Document not found:", documentId);
            return next(new Error(`${AuthErrorCode.PERMISSION_DENIED}`));
        }

        // For prototype: owner always has access
        // TODO: Check shares table for non-owner access in production
        const isOwner = doc.owner_id === user.user.id;

        // For now, allow any authenticated user (prototype per D-09)
        // Production would check shares table here

        // Attach user data to socket for handlers
        socket.data.userId = user.user.id;
        socket.data.documentId = documentId;
        socket.data.isAnonymous = user.user.is_anonymous ?? false;
        socket.data.isOwner = isOwner;

        console.log(
            `[auth] User ${user.user.id.slice(0, 8)}... connected to document ${documentId.slice(0, 8)}...`,
        );

        next();
    } catch (err) {
        console.error("[auth] Unexpected error:", err);
        return next(new Error(`${AuthErrorCode.AUTH_INVALID}`));
    }
}
