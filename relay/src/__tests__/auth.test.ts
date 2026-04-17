/**
 * auth.test.ts -- Tests for JWT authentication and permission validation.
 *
 * Covers RELY-01 (JWT auth) and RELY-02 (permission validation).
 */
import { describe, it, expect } from "vitest";

describe("RELY-01: JWT Authentication", () => {
    it.todo("rejects connection without token");
    it.todo("rejects connection with invalid token");
    it.todo("rejects connection with expired token");
    it.todo("accepts connection with valid Supabase JWT");
    it.todo("extracts user ID from valid token");
});

describe("RELY-02: Permission Validation", () => {
    it.todo("rejects connection when user has no access to document");
    it.todo("accepts connection when user has share access");
    it.todo("accepts connection when user is document owner");
    it.todo("caches permission check for session duration");
});
