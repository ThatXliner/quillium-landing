/**
 * middleware.ts -- Socket.io authentication middleware.
 *
 * Validates JWT on connection handshake and checks document permissions.
 * Per D-33: Invalid/expired JWTs rejected immediately with error code.
 * Per D-34: Permissions checked once on connect, cached for session.
 */
import type { Socket } from "socket.io";
import { supabase, supabaseConfigured } from "./supabase.js";
import { HandshakeAuthSchema, AuthErrorCode } from "../schemas.js";

/**
 * Extended socket data with user info.
 */
export interface AuthenticatedSocketData {
    userId: string;
    documentId: string;
    isAnonymous: boolean;
}

/**
 * Authentication middleware for Socket.io.
 * Validates JWT and checks document access permissions.
 *
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

        console.log(
            `[auth] User ${user.user.id.slice(0, 8)}... connected to document ${documentId.slice(0, 8)}...`,
        );

        next();
    } catch (err) {
        console.error("[auth] Unexpected error:", err);
        return next(new Error(`${AuthErrorCode.AUTH_INVALID}`));
    }
}
