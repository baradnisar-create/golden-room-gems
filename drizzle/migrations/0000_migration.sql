create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- First account ever created becomes admin
create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.handle_first_admin();

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  room_type text not null,
  check_in date not null,
  check_out date not null,
  adults int not null default 2,
  children int not null default 0,
  message text,
  status text not null default 'pending'
);
grant insert on public.booking_requests to anon, authenticated;
grant select, update, delete on public.booking_requests to authenticated;
grant all on public.booking_requests to service_role;
alter table public.booking_requests enable row level security;
create policy "Anyone can submit booking" on public.booking_requests for insert to anon, authenticated
  with check (status = 'pending' and length(name) between 1 and 100 and length(phone) between 6 and 20 and check_out > check_in);
create policy "Admins read bookings" on public.booking_requests for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update bookings" on public.booking_requests for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete bookings" on public.booking_requests for delete to authenticated using (public.has_role(auth.uid(), 'admin'));