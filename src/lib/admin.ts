// =============================================================================
// Admin authorization
//
// SECURITY BOUNDARY → immutable Supabase user IDs (ADMIN_USER_IDS).
// A user's id (auth.users.id / a UUID) can never be changed by the user, and is
// unaffected by email changes, OAuth provider linking, or metadata edits — so it
// is the only safe basis for granting admin. Set this server-side only.
//
//   ADMIN_USER_IDS="<uuid-1>,<uuid-2>"   (NOT prefixed with NEXT_PUBLIC_)
//
// To find the IDs: have each admin sign in once, then in the Supabase SQL editor
// run `select id, email from auth.users;` and paste the two ids.
// =============================================================================
export const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export function isAdminUserId(id?: string | null): boolean {
  return Boolean(id && ADMIN_USER_IDS.includes(id));
}

// COSMETIC ONLY → decides whether the client renders the "Admin" nav link.
// This is NOT a security boundary (a user can spoof their email): every
// privileged action is enforced server-side by isAdminUserId. If a non-admin
// forces the link to appear, the server still returns 403 / redirects.
const DEFAULT_ADMIN_EMAILS = "drvhall@crossroadsitg.com,adhityasundar@gmail.com";

export const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? DEFAULT_ADMIN_EMAILS)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}
