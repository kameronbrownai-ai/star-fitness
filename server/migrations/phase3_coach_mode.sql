-- ─────────────────────────────────────────────────────────────────────────────
-- COACH MODE: running a testing session with many athletes on one account.
--
-- Deliberately separate from public.assessments. An assessment is one person's
-- own Star Score and belongs to their account and their progress chart. These
-- are research captures taken BY a coach ABOUT other people, and must never
-- appear in the coach's own history or count against their allowance.
--
-- Safe to run more than once.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.test_sessions (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  location   text,
  notes      text,
  created_at timestamptz not null default now()
);
alter table public.test_sessions enable row level security;
create index if not exists idx_test_sessions_owner on public.test_sessions(owner_id, created_at desc);

create table if not exists public.test_captures (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid references public.test_sessions(id) on delete cascade not null,

  -- Identify the athlete without storing their name. A jersey number or
  -- initials is enough to pair a retest, and keeps this out of personal-data
  -- territory for a group of minors on a school team.
  athlete_ref text not null,
  sport       text,
  sex         text,
  age_band    text,

  -- What the app measured.
  overall   int not null,
  level     text not null,
  mobility  int,
  balance   int,
  control   int,
  symmetry  int,

  -- Share of moves the camera tracked confidently, 0–1. A capture with poor
  -- quality should be excluded from calibration rather than silently averaged.
  capture_quality real,

  -- The independent judgement the whole exercise depends on: a coach's own
  -- 1–5 read of movement quality, recorded without seeing the score.
  -- Calibration is the question of whether these two agree.
  coach_rating int check (coach_rating between 1 and 5),

  -- Marks the second capture of the same athlete in one session, which is how
  -- run-to-run measurement error is estimated.
  is_retest  boolean not null default false,

  notes      text,
  created_at timestamptz not null default now()
);
alter table public.test_captures enable row level security;
create index if not exists idx_test_captures_session on public.test_captures(session_id, created_at);
create index if not exists idx_test_captures_athlete on public.test_captures(session_id, athlete_ref);

-- All reads and writes go through the API with the service key, which checks
-- that the caller owns the session. Direct client access stays closed.

notify pgrst, 'reload schema';
