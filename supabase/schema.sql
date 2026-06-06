-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text not null default '',
  price numeric not null check (price >= 0),
  location text not null,
  bedrooms integer not null default 0 check (bedrooms >= 0),
  bathrooms integer not null default 0 check (bathrooms >= 0),
  image_url text not null default ''
);

alter table public.listings enable row level security;

create policy "Allow public read access"
  on public.listings for select
  using (true);

create policy "Allow public insert"
  on public.listings for insert
  with check (true);

create policy "Allow public delete"
  on public.listings for delete
  using (true);

-- Optional seed data
insert into public.listings (title, description, price, location, bedrooms, bathrooms, image_url)
values
  (
    'Sector 17 Premium Apartment',
    'Bright 4 BHK near Elante Mall with modular kitchen and covered parking.',
    12500000,
    'Sector 17, Chandigarh',
    4,
    3,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
  ),
  (
    'Mohali Independent Floor',
    'Spacious 2 BHK independent floor near Phase 7 with 24×7 security.',
    7500000,
    'Sector 70, Mohali',
    2,
    2,
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
  );

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'buyer',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Allow public read access"
  on public.profiles for select
  using (true);

create policy "Allow public insert"
  on public.profiles for insert
  with check (true);
  

  insert into public.profiles (id, role)
values
('297fdd9b-c1dd-4fa3-a654-4e2617a54bfc', 'admin'),
('18af28cb-bd58-4534-a153-a41629735138', 'admin'),
('4589a6f4-d892-4eea-9573-b9e498098dbd', 'admin')
on conflict (id)
do update set role = excluded.role;

insert into public.profiles (id, role)
values
  ('ae96068f-cb15-4b9e-a36b-a68ad726b19b', 'buyer')
on conflict (id)
do update set role = excluded.role;
