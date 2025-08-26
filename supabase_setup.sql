-- Enable extension
create extension if not exists "uuid-ossp";

-- === Enum types for role & account status ===
do $$ begin
  create type public.user_role as enum ('seller','admin','customer');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.account_status as enum ('pending','completed','suspended');
exception
  when duplicate_object then null;
end $$;

-- === PROFILES (1-1 with auth.users) ===
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,

  -- Personal
  first_name     text,
  last_name      text,
  phone          text,

  -- Business
  business_name  text,
  gst_number     text,

  -- NEW: account control fields
  role           public.user_role      not null default 'seller',
  account_status public.account_status not null default 'pending',
  is_verified    boolean               not null default false,

  avatar_url     text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- === ADDRESSES (1-many) ===
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text default 'Home',
  line1 text not null,
  line2 text,
  state text not null,
  city text not null,
  pincode text not null,
  country text not null default 'IN',
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- === Helper: admin check used in RLS (moved after profiles table) ===
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role = 'admin'
  );
$$;

-- === Updated-at trigger ===
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger addresses_set_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

-- === RLS (Row Level Security) ===
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;

-- Allow users to see/update their own rows; admins can access all
drop policy if exists "profiles select self or admin" on public.profiles;
create policy "profiles select self or admin" on public.profiles
for select using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles update self or admin" on public.profiles;
create policy "profiles update self or admin" on public.profiles
for update using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "addresses owner or admin" on public.addresses;
create policy "addresses owner or admin" on public.addresses
for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

-- === Triggers on auth.users ===
-- Seed profiles (and default address) from signup metadata
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  _first text := coalesce(new.raw_user_meta_data->>'first_name','');
  _last  text := coalesce(new.raw_user_meta_data->>'last_name','');
  _phone text := coalesce(new.raw_user_meta_data->>'phone','');
  _biz   text := coalesce(new.raw_user_meta_data->>'business_name','');
  _gst   text := coalesce(new.raw_user_meta_data->>'gst_number','');
  _role  public.user_role := coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'seller');
  _status public.account_status := coalesce((new.raw_user_meta_data->>'account_status')::public.account_status, 'pending');
  _verified boolean := (new.email_confirmed_at is not null);
begin
  insert into public.profiles (
    id, email, first_name, last_name, phone, business_name, gst_number,
    role, account_status, is_verified, avatar_url
  ) values (
    new.id,
    new.email,
    nullif(_first,''), nullif(_last,''), nullif(_phone,''), nullif(_biz,''), nullif(_gst,''),
    _role, _status, _verified, null
  );

  if (new.raw_user_meta_data ? 'address') then
    insert into public.addresses (user_id, label, line1, line2, state, city, pincode, country, is_default)
    values (
      new.id,
      coalesce((new.raw_user_meta_data->'address'->>'label'),'Home'),
      (new.raw_user_meta_data->'address'->>'line1'),
      (new.raw_user_meta_data->'address'->>'line2'),
      (new.raw_user_meta_data->'address'->>'state'),
      (new.raw_user_meta_data->'address'->>'city'),
      (new.raw_user_meta_data->'address'->>'pincode'),
      coalesce((new.raw_user_meta_data->'address'->>'country'),'IN'),
      coalesce((new.raw_user_meta_data->'address'->>'is_default')::boolean, true)
    );
  end if;

  return new;
end;
$$;

-- Keep seed trigger up to date
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Sync profile.is_verified if Supabase confirms email later
create or replace function public.sync_email_verified()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
  set is_verified = (new.email_confirmed_at is not null),
      updated_at   = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email_confirmed_at on auth.users
for each row execute function public.sync_email_verified();
