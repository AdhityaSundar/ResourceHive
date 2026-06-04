// Supabase env + a guard so the whole app keeps working before keys are added.
// While these are empty, auth is simply inactive (everyone is "signed out") and
// the directory keeps running on the JSON fallback.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
