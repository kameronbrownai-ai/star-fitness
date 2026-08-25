-- ─────────────────────────────────────────────────────────────────────────────
-- Star Fitness — Supabase Schema
-- Run this entire file in: Supabase Dashboard > SQL Editor > New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- Coach profiles (one per user, replaces localStorage sf_coach_v1.profile)
create table if not exists public.coach_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null unique,
  sport           text,
  position        text,
  level           text,
  goal            text,
  injuries        text,
  equipment       text[]   default '{}',
  metrics         jsonb    default '{}',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Session history (multiple per user, replaces localStorage sf_coach_v1.sessionHistory)
create table if not exists public.coach_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  date            date default current_date,
  note            text not null,
  session_number  integer,
  created_at      timestamptz default now()
);

-- Subscriptions (Stripe data, replaces localStorage free-session counter)
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  status                  text default 'inactive',  -- 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing'
  plan                    text default 'free',       -- 'free' | 'trial' | 'tier2' | 'tier3' | 'comp'
  current_period_end      timestamptz,
  trial_ends_at           timestamptz,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- Backfill for existing rows created before trial_ends_at existed
alter table public.subscriptions add column if not exists trial_ends_at timestamptz;
alter table public.subscriptions add column if not exists subscriber_number bigint;

-- ─── Universal tiered trial (30 days for the first 5,000 subscribers, 14 after) ─
-- Assigns each new account a permanent, monotonically increasing number.
-- Sequences are lock-free and race-safe under concurrent inserts.
create sequence if not exists public.subscriber_seq start 1;

-- Fires for every new auth.users row, however it was created (normal signup,
-- or admin.inviteUserByEmail from the mat-purchase webhook) and grants the
-- trial length that's active for that signup order — no per-product logic.
create or replace function public.handle_new_subscriber()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  seq_num bigint;
  trial_days int;
begin
  seq_num := nextval('public.subscriber_seq');
  trial_days := case when seq_num <= 5000 then 30 else 14 end;
  insert into public.subscriptions (user_id, plan, status, trial_ends_at, subscriber_number)
  values (new.id, 'trial', 'trialing', now() + (trial_days || ' days')::interval, seq_num)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_subscriber();

-- Read-only peek at the current count, without consuming a number
-- (calling nextval() just to check would waste a slot).
create or replace function public.get_subscriber_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select last_value from public.subscriber_seq;
$$;

grant execute on function public.get_subscriber_count() to service_role;

-- NOTE: code_redemptions and redemption_codes tables (used by POST /redeem in
-- server/index.js) already exist in production but were never added to this
-- file — pull their live definitions from Supabase Table Editor > Copy as SQL
-- and add them here to stop this schema from drifting further.

-- Idempotency ledger: one row per processed Stripe webhook event id, so a
-- Stripe retry of the same event can never double-process (e.g. invite the
-- same buyer twice or grant a trial twice).
create table if not exists public.stripe_events (
  id          text primary key,
  created_at  timestamptz default now()
);

-- auth.users isn't exposed via PostgREST — this lets the webhook (service
-- role only) look up an existing account by the email Stripe Checkout
-- collected, without a service-role-only RPC being callable by end users.
create or replace function public.get_user_id_by_email(lookup_email text)
returns uuid
language sql
security definer
set search_path = public
as $$
  select id from auth.users where lower(email) = lower(lookup_email) limit 1;
$$;

revoke execute on function public.get_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.get_user_id_by_email(text) to service_role;

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.coach_profiles  enable row level security;
alter table public.coach_sessions  enable row level security;
alter table public.subscriptions   enable row level security;

-- coach_profiles: users read/write their own row only
create policy "profiles: own row select" on public.coach_profiles
  for select using (auth.uid() = user_id);

create policy "profiles: own row insert" on public.coach_profiles
  for insert with check (auth.uid() = user_id);

create policy "profiles: own row update" on public.coach_profiles
  for update using (auth.uid() = user_id);

-- coach_sessions: users read/write their own rows only
create policy "sessions: own rows select" on public.coach_sessions
  for select using (auth.uid() = user_id);

create policy "sessions: own rows insert" on public.coach_sessions
  for insert with check (auth.uid() = user_id);

-- subscriptions: users can read their own row; service role writes (webhooks)
create policy "subscriptions: own row select" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists idx_coach_sessions_user_id   on public.coach_sessions(user_id);
create index if not exists idx_subscriptions_customer   on public.subscriptions(stripe_customer_id);
create index if not exists idx_subscriptions_sub_id     on public.subscriptions(stripe_subscription_id);
