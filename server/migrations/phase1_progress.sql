-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE 1: progress tracking, workout logging, shareable scores
-- Paste the whole file into Supabase → SQL Editor → Run.
-- Safe to run more than once.
-- ─────────────────────────────────────────────────────────────────────────────

-- Public-facing athlete profile. Real names stay in auth.users; this is what
-- other people are allowed to see on leaderboards and share cards. Every field
-- except user_id is optional and only shown when leaderboard_opt_in is true.
create table if not exists public.profiles (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  display_name       text,
  sport              text,
  position           text,
  sex                text,       -- self-reported, optional, used only as a leaderboard filter
  area               text,       -- city or region, optional, used only as a leaderboard filter
  leaderboard_opt_in boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (auth.uid() = user_id);
drop policy if exists "write own profile" on public.profiles;
create policy "write own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Every training day. One row per (user, day, source, ref) so pressing play on
-- the same class twice in a day does not double count, but a class and a coach
-- session on the same day both record. Streaks count distinct days.
create table if not exists public.workouts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null,
  workout_date date not null,
  source       text not null check (source in ('class', 'coach', 'manual', 'assessment')),
  ref          text not null default '',
  created_at   timestamptz not null default now(),
  unique (user_id, workout_date, source, ref)
);
alter table public.workouts enable row level security;
drop policy if exists "read own workouts" on public.workouts;
create policy "read own workouts" on public.workouts
  for select using (auth.uid() = user_id);
create index if not exists idx_workouts_user_date on public.workouts(user_id, workout_date desc);

-- A score only becomes visible on a public share link once its owner chooses
-- to share it. Default is private.
alter table public.assessments add column if not exists shared boolean not null default false;
