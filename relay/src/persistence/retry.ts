/**
 * retry.ts -- Retry wrapper with exponential backoff for persistence operations.
 *
 * Per D-42: Retry up to MAX_RETRIES times with exponential backoff.
 * Non-transient errors (constraint violations) are not retried.
 */

/** Maximum retry attempts before giving up */
export const MAX_RETRIES = 3;

/** Base delay in milliseconds for exponential backoff */
export const BASE_DELAY_MS = 100;

/** Maximum delay cap to prevent excessive waits */
export const MAX_DELAY_MS = 2000;

/** Result type for retry-wrapped operations */
export interface RetryResult<T> {
    success: boolean;
    data: T | null;
    error: string | null;
}

/** Sleep helper for backoff delays */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an error is non-transient and should not be retried.
 * Non-transient errors are permanent failures that won't succeed on retry.
 */
function isNonTransientError(error: { message?: string }): boolean {
    const message = error.message?.toLowerCase() ?? "";
    return (
        message.includes("unique constraint") ||
        message.includes("foreign key") ||
        message.includes("not null") ||
        message.includes("invalid")
    );
}

/**
 * Wrap an async operation with exponential backoff retry logic.
 *
 * @param operation - Async function returning { data, error } (Supabase pattern)
 * @param operationName - Human-readable name for logging
 * @returns RetryResult with success status and data or error
 */
export async function withRetry<T>(
    operation: () => Promise<{ data: T | null; error: { message?: string } | null }>,
    operationName: string,
): Promise<RetryResult<T>> {
    let lastError: string | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const result = await operation();

        if (!result.error) {
            return { success: true, data: result.data, error: null };
        }

        lastError = result.error.message ?? "Unknown error";

        // Don't retry non-transient errors
        if (isNonTransientError(result.error)) {
            console.error(`[persistence] ${operationName} failed with non-transient error: ${lastError}`);
            return { success: false, data: null, error: lastError };
        }

        // Log retry attempt (except for the last attempt, which logs as error)
        if (attempt < MAX_RETRIES - 1) {
            const delay = Math.min(BASE_DELAY_MS * (2 ** attempt) + Math.random() * 100, MAX_DELAY_MS);
            console.warn(`[persistence] Retry ${attempt + 1}/${MAX_RETRIES} for ${operationName} after ${Math.round(delay)}ms: ${lastError}`);
            await sleep(delay);
        }
    }

    console.error(`[persistence] ${operationName} failed after ${MAX_RETRIES} attempts: ${lastError}`);
    return { success: false, data: null, error: lastError };
}
