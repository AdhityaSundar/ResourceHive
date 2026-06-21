import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isAdminUserId } from "@/lib/admin";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

// When true, the ENTIRE site requires sign-in — anonymous visitors are sent to
// /login first. Set to false to restore open browsing of the directory/map
// (the original product decision: never gate crisis users behind a signup wall).
const REQUIRE_LOGIN_TO_BROWSE = true;

// Pages that must stay reachable while signed out (otherwise nobody could log in).
const PUBLIC_PREFIXES = ["/login", "/signup", "/auth"];

// Routes that require a signed-in user even when REQUIRE_LOGIN_TO_BROWSE is off.
const PROTECTED_PREFIXES = ["/dashboard", "/preferences", "/admin"];
// Routes that additionally require an admin account.
const ADMIN_PREFIXES = ["/admin"];

export async function updateSession(request: NextRequest) {
  // Until Supabase is configured, do nothing so the app keeps working as-is.
  if (!isSupabaseConfigured) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: getUser() refreshes the session; do not run code between
  // createServerClient and getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix));
  const isProtected = PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix));
  const isAdminRoute = ADMIN_PREFIXES.some((prefix) => path.startsWith(prefix));

  // Gate the whole site (or just the protected routes) for signed-out visitors.
  const needsAuth = (REQUIRE_LOGIN_TO_BROWSE && !isPublic) || isProtected;
  if (!user && needsAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (user && isAdminRoute && !isAdminUserId(user.id)) {
    const url = request.nextUrl.clone();
    url.pathname = "/preferences";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
