import type { User } from "@supabase/supabase-js";

import { isAdminUserId } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// Server-side auth helpers. Use these in route handlers and server components to
// learn who is signed in and whether they are an admin. Never trust client input
// for identity — always derive ownerId/admin from here.

export async function getSessionUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getAuthContext(): Promise<{ user: User | null; isAdmin: boolean }> {
  const user = await getSessionUser();
  // Admin is decided by immutable user id, never by the (mutable) email.
  return { user, isAdmin: isAdminUserId(user?.id) };
}
