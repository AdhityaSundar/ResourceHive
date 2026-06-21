-- =============================================================================
-- Row Level Security lockdown for the Prisma-created tables.
--
-- WHY: Supabase auto-exposes every table in the `public` schema through its REST
-- API (PostgREST). Tables created by `prisma db push` have RLS DISABLED, and the
-- default `anon` / `authenticated` grants would let ANYONE with the public
-- publishable key read/insert/update/delete rows directly — bypassing all of the
-- app's admin checks. Enabling RLS with no policies (plus revoking grants) blocks
-- the public REST roles entirely.
--
-- SAFE FOR THE APP: Prisma connects as the privileged `postgres` role, which owns
-- the table and has BYPASSRLS, so the application keeps full read/write access.
--
-- RUN after every `prisma db push`:  npm run db:secure
-- (idempotent — safe to run repeatedly)
-- =============================================================================

alter table public.resources enable row level security;
revoke all on table public.resources from anon, authenticated;
