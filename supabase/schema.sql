-- ============================================================
-- Disktorget – databaseskjema for Supabase (Postgres)
-- Kjør dette i Supabase Dashboard -> SQL Editor
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
create type disc_type as enum ('putter', 'midrange', 'fairway_driver', 'distance_driver', 'annet');
create type disc_condition as enum ('ny', 'som_ny', 'brukt', 'slitt');
create type listing_type as enum ('salg', 'bytte', 'salg_eller_bytte');
create type listing_status as enum ('aktiv', 'reservert', 'solgt');

-- ---------- PROFILES ----------
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  location text,
  contact_email text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiler er synlige for alle"
  on profiles for select using (true);

create policy "Brukere kan opprette egen profil"
  on profiles for insert with check (auth.uid() = id);

create policy "Brukere kan oppdatere egen profil"
  on profiles for update using (auth.uid() = id);

-- Opprett automatisk en profilrad når en ny bruker registrerer seg
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- LISTINGS ----------
create table listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  brand text not null,
  mold text,
  plastic text,
  color text,
  disc_type disc_type not null default 'annet',
  condition disc_condition not null default 'brukt',
  speed numeric,
  glide numeric,
  turn numeric,
  fade numeric,
  weight_grams integer,
  price_nok integer,
  listing_type listing_type not null default 'salg',
  status listing_status not null default 'aktiv',
  description text,
  image_urls text[] not null default '{}',
  location text,
  created_at timestamptz default now()
);

alter table listings enable row level security;

create policy "Annonser er synlige for alle"
  on listings for select using (true);

create policy "Brukere kan opprette egne annonser"
  on listings for insert with check (auth.uid() = user_id);

create policy "Brukere kan oppdatere egne annonser"
  on listings for update using (auth.uid() = user_id);

create policy "Brukere kan slette egne annonser"
  on listings for delete using (auth.uid() = user_id);

create index listings_created_at_idx on listings (created_at desc);
create index listings_brand_idx on listings (brand);
create index listings_disc_type_idx on listings (disc_type);
create index listings_search_idx on listings
  using gin (to_tsvector('simple', title || ' ' || brand || ' ' || coalesce(mold, '')));

-- ---------- STORAGE (bilder av disker) ----------
insert into storage.buckets (id, name, public)
values ('disc-images', 'disc-images', true)
on conflict (id) do nothing;

create policy "Bilder er synlige for alle"
  on storage.objects for select using (bucket_id = 'disc-images');

create policy "Innloggede brukere kan laste opp bilder"
  on storage.objects for insert
  with check (bucket_id = 'disc-images' and auth.role() = 'authenticated');

create policy "Eiere kan slette egne bilder"
  on storage.objects for delete
  using (bucket_id = 'disc-images' and auth.uid() = owner);
