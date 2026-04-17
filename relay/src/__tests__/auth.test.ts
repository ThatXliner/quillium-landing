/**
 * auth.test.ts -- Tests for JWT authentication and permission validation.
 *
 * Covers RELY-01 (JWT auth) and RELY-02 (permission validation).
 * Uses mocked Supabase client to test middleware logic.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authMiddleware } from "../auth/middleware.js";
import { AuthErrorCode } from "../schemas.js";
import type { Socket } from "socket.io";

// Mock Supabase module
vi.mock("../auth/supabase.js", () => ({
    supabaseConfigured: true,
    supabase: {
        auth: {
            getUser: vi.fn(),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(),
                })),
            })),
        })),
    },
}));

// Import mocked module
import { supabase } from "../auth/supabase.js";

// Helper to create mock socket
function createMockSocket(auth: Record<string, unknown> = {}): Socket {
    return {
        handshake: { auth },
        data: {},
    } as unknown as Socket;
}

describe("RELY-01: JWT Authentication", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects connection without token", async () => {
        const socket = createMockSocket({});
        const next = vi.fn();

        await authMiddleware(socket, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe(`${AuthErrorCode.AUTH_REQUIRED}`);
    });

    it("rejects connection with invalid token", async () => {
        const socket = createMockSocket({
            token: "invalid-token",
            documentId: "123e4567-e89b-12d3-a456-426614174000",
        });
        const next = vi.fn();

        vi.mocked(supabase!.auth.getUser).mockResolvedValue({
            data: { user: null },
            error: { message: "Invalid token", status: 401 } as any,
        });

        await authMiddleware(socket, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe(`${AuthErrorCode.AUTH_INVALID}`);
    });

    it("rejects connection with expired token", async () => {
        const socket = createMockSocket({
            token: "expired-token",
            documentId: "123e4567-e89b-12d3-a456-426614174000",
        });
        const next = vi.fn();

        vi.mocked(supabase!.auth.getUser).mockResolvedValue({
            data: { user: null },
            error: { message: "Token has expired", status: 401 } as any,
        });

        await authMiddleware(socket, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe(`${AuthErrorCode.AUTH_EXPIRED}`);
    });

    it("accepts connection with valid Supabase JWT", async () => {
        const socket = createMockSocket({
            token: "valid-token",
            documentId: "123e4567-e89b-12d3-a456-426614174000",
        });
        const next = vi.fn();

        vi.mocked(supabase!.auth.getUser).mockResolvedValue({
            data: { user: { id: "user-123", is_anonymous: false } as any },
            error: null,
        });

        // Mock document exists
        const mockSingle = vi.fn().mockResolvedValue({
            data: { id: "123e4567-e89b-12d3-a456-426614174000", owner_id: "user-123" },
            error: null,
        });
        vi.mocked(supabase!.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: mockSingle,
                }),
            }),
        } as any);

        await authMiddleware(socket, next);

        expect(next).toHaveBeenCalledWith();
        expect(next.mock.calls[0][0]).toBeUndefined();
    });

    it("extracts user ID from valid token", async () => {
        const socket = createMockSocket({
            token: "valid-token",
            documentId: "123e4567-e89b-12d3-a456-426614174000",
        });
        const next = vi.fn();

        vi.mocked(supabase!.auth.getUser).mockResolvedValue({
            data: { user: { id: "user-456", is_anonymous: true } as any },
            error: null,
        });

        const mockSingle = vi.fn().mockResolvedValue({
            data: { id: "123e4567-e89b-12d3-a456-426614174000", owner_id: "other" },
            error: null,
        });
        vi.mocked(supabase!.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: mockSingle,
                }),
            }),
        } as any);

        await authMiddleware(socket, next);

        expect(socket.data.userId).toBe("user-456");
        expect(socket.data.isAnonymous).toBe(true);
    });
});

describe("RELY-02: Permission Validation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects connection when document does not exist", async () => {
        const socket = createMockSocket({
            token: "valid-token",
            documentId: "123e4567-e89b-12d3-a456-426614174000",
        });
        const next = vi.fn();

        vi.mocked(supabase!.auth.getUser).mockResolvedValue({
            data: { user: { id: "user-123" } as any },
            error: null,
        });

        const mockSingle = vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Not found", code: "PGRST116" },
        });
        vi.mocked(supabase!.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: mockSingle,
                }),
            }),
        } as any);

        await authMiddleware(socket, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe(`${AuthErrorCode.PERMISSION_DENIED}`);
    });

    it("accepts connection when user is document owner", async () => {
        const socket = createMockSocket({
            token: "valid-token",
            documentId: "123e4567-e89b-12d3-a456-426614174000",
        });
        const next = vi.fn();

        vi.mocked(supabase!.auth.getUser).mockResolvedValue({
            data: { user: { id: "owner-user" } as any },
            error: null,
        });

        const mockSingle = vi.fn().mockResolvedValue({
            data: { id: "123e4567-e89b-12d3-a456-426614174000", owner_id: "owner-user" },
            error: null,
        });
        vi.mocked(supabase!.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: mockSingle,
                }),
            }),
        } as any);

        await authMiddleware(socket, next);

        expect(next).toHaveBeenCalledWith();
        expect(socket.data.documentId).toBe("123e4567-e89b-12d3-a456-426614174000");
    });

    it("stores documentId in socket data on success", async () => {
        const docId = "123e4567-e89b-12d3-a456-426614174000";
        const socket = createMockSocket({
            token: "valid-token",
            documentId: docId,
        });
        const next = vi.fn();

        vi.mocked(supabase!.auth.getUser).mockResolvedValue({
            data: { user: { id: "user-123" } as any },
            error: null,
        });

        const mockSingle = vi.fn().mockResolvedValue({
            data: { id: docId, owner_id: "user-123" },
            error: null,
        });
        vi.mocked(supabase!.from).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: mockSingle,
                }),
            }),
        } as any);

        await authMiddleware(socket, next);

        expect(socket.data.documentId).toBe(docId);
    });
});
