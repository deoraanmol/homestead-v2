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
    'Modern Hillside Retreat',
    'Sun-drenched contemporary home with floor-to-ceiling windows and a private deck.',
    875000,
    'Byron Bay, NSW',
    4,
    3,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
  ),
  (
    'Coastal Apartment',
    'Walk to the beach from this bright two-bedroom apartment with ocean glimpses.',
    620000,
    'Bondi, NSW',
    2,
    2,
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
  );
