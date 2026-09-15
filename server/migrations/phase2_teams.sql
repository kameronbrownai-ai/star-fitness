-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE 2: teams and team leaderboards
-- Requires phase1_progress.sql. Safe to run more than once.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sport       text,
  -- Short code athletes share to let others join. Rotated by the owner.
  invite_code text not null unique,
  owner_id    uuid references auth.users(id) on delete cascade not null,
  -- 'members': only people on the team can see the board.
  -- 'public':  anyone with the link can see it (display names only).
  visibility  text not null default 'members' check (visibility in ('members', 'public')),
  created_at  timestamptz not null default now()
);
alter table public.teams enable row level security;
create index if not exists idx_teams_owner on public.teams(owner_id);

create table if not exists public.team_members (
  team_id   uuid references public.teams(id) on delete cascade not null,
  user_id   uuid references auth.users(id) on delete cascade not null,
  role      text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);
alter table public.team_members enable row level security;
create index if not exists idx_team_members_user on public.team_members(user_id);

-- All reads and writes go through the API with the service key, which is how
-- cross-user visibility is controlled. Direct client access stays closed.

notify pgrst, 'reload schema';
