-- Phase 4: profiles + saved_properties
-- Run after initial schema.sql in Supabase SQL Editor

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'buyer' check (role in ('admin', 'buyer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Set admin role manually, e.g.:
-- insert into public.profiles (id, role) values ('your-user-uuid', 'admin')
-- on conflict (id) do update set role = 'admin';

create table if not exists public.saved_properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

alter table public.saved_properties enable row level security;

create policy "Users can read own saved properties"
  on public.saved_properties for select
  using (auth.uid() = user_id);

create policy "Users can save properties"
  on public.saved_properties for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave properties"
  on public.saved_properties for delete
  using (auth.uid() = user_id);
