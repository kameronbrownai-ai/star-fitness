create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  overall int not null,
  level text not null,
  mobility int, balance int, control int, symmetry int,
  created_at timestamptz default now()
);
alter table public.assessments enable row level security;
drop policy if exists "read own assessments" on public.assessments;
create policy "read own assessments" on public.assessments
  for select using (auth.uid() = user_id);
create index if not exists idx_assessments_user on public.assessments(user_id, created_at desc);
