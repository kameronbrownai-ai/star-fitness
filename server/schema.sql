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
  status                  text default 'inactive',  -- 'active' | 'inactive' | 'canceled' | 'past_due'
  plan                    text default 'free',       -- 'free' | 'pro'
  current_period_end      timestamptz,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

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
