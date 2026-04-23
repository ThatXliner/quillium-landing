/**
 * supabase.ts -- Supabase Admin client for relay server.
 *
 * Uses service_role key for JWT validation and permission queries.
 * No session persistence needed -- server-side only.
 *
 * Per D-32: Uses Supabase Admin SDK (@supabase/supabase-js with service_role key)
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "../logger.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const logger = createLogger("supabase");

export const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseConfigured) {
    logger.warn("Missing environment variables -- auth features will not work");
}

export const supabase: SupabaseClient | null = supabaseConfigured
    ? createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
          auth: {
              autoRefreshToken: false,
              persistSession: false,
          },
      })
    : null;
