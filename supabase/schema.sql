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


-- Create locations reference table
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  locality text not null,
  sector text,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  display_name text not null, -- "Sector 60, Chandigarh" format
  created_at timestamptz default now(),
  unique(city, locality, sector)
);

alter table public.locations enable row level security;

create policy "Allow public read"
  on public.locations for select using (true);

-- Create index for faster searches
create index if not exists locations_city_idx on public.locations(city);
create index if not exists locations_display_name_idx on public.locations using gin(to_tsvector('english', display_name));

-- Seed initial data for Tricity
insert into public.locations (city, locality, sector, latitude, longitude, display_name)
values
  ('Chandigarh', 'Sector 17', 'Sector 17', 30.7333, 76.7794, 'Sector 17, Chandigarh'),
  ('Chandigarh', 'Sector 35', 'Sector 35', 30.7260, 76.7945, 'Sector 35, Chandigarh'),
  ('Chandigarh', 'Sector 60', 'Sector 60', 30.6833, 76.7567, 'Sector 60, Chandigarh'),
  ('Mohali', 'Phase 3B2', 'Phase 3B2', 30.7050, 76.7180, 'Phase 3B2, Mohali'),
  ('Mohali', 'Sector 70', 'Sector 70', 30.6900, 76.7200, 'Sector 70, Mohali'),
  ('Panchkula', 'Sector 5', 'Sector 5', 30.6943, 76.8606, 'Sector 5, Panchkula'),
  ('Zirakpur', 'VIP Road', NULL, 30.6426, 76.8173, 'VIP Road, Zirakpur')
on conflict do nothing;

-- Add location_id reference to listings (optional, for normalization)
alter table public.listings add column location_id uuid references public.locations(id);
alter table public.listings add column latitude numeric(9,6);
alter table public.listings add column longitude numeric(9,6);

-- Create index for proximity queries
create index if not exists listings_coords_idx on public.listings(latitude, longitude);

create table if not exists public.property_types (
  id text primary key,               -- 'flat', 'agri_land', 'villa' etc. (used for filtering)
  label text not null,               -- 'Flat / Apartment', 'Agricultural Land' (used for UI dropdowns)
  is_active boolean default true,     -- Allows admins to easily disable a type without deleting data
  created_at timestamptz default now()
);
alter table public.property_types enable row level security;
create policy "Allow public read access" 
  on public.property_types for select using (true);

insert into public.property_types (id, label)
values
  ('unknown', 'Unknown'),
  ('flat', 'Flat / Apartment'),
  ('house', 'House'),
  ('independent_floor', 'Independent Floor'),
  ('residential_plot', 'Residential Plot'),
  ('villa', 'Villa'),
  ('commercial', 'Commercial Property'),
  ('agri_land', 'Agricultural Land')
on conflict (id) do update set label = excluded.label;

alter table public.listings 
add column property_type_id text not null default 'unknown' 
references public.property_types(id) on delete set default;

create index if not exists listings_property_type_idx on public.listings(property_type_id);
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS ai_crux TEXT DEFAULT '';