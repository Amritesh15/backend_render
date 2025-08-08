// src/services/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config(); // loads .env from project root in dev
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
// We must have URL + SERVICE key for backend usage
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment.");
}
/**
 * Admin client — server-only, full privileges.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});
/**
 * Public client — uses ANON key if provided.
 * If ANON is missing (e.g., you haven’t set it locally yet), we fall back to
 * the service key so your backend can still run. Do NOT expose this client to browsers.
 */
if (!SUPABASE_ANON_KEY) {
    // Safe generic warning (does not print secrets)
    console.warn("[supabase] SUPABASE_ANON_KEY missing; using service key for backend-only 'supabase' client.");
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY);
