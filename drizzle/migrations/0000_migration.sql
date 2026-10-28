create extension if not exists btree_gist;

create type public.app_role as enum ('admin','staff');
create type public.appointment_status as enum ('pending','confirmed','completed','cancelled','no_show');

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, created_at timestamptz not null default now());
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create or replace function public.is_team(_user_id uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.user_roles where user_id=_user_id) $$;

create table public.service_categories (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, sort int not null default 0);
create table public.services (id uuid primary key default gen_random_uuid(), category_id uuid references public.service_categories(id) on delete set null, name text not null, description text, duration_min int not null check (duration_min between 5 and 600), buffer_min int not null default 10, price numeric(10,2), image_key text, is_published boolean not null default true, sort int not null default 0, created_at timestamptz not null default now());
create table public.staff (id uuid primary key default gen_random_uuid(), user_id uuid, full_name text not null, title text, bio text, photo_key text, is_active boolean not null default true, sort int not null default 0);
create table public.staff_services (staff_id uuid references public.staff(id) on delete cascade, service_id uuid references public.services(id) on delete cascade, primary key(staff_id, service_id));
create table public.staff_working_hours (id uuid primary key default gen_random_uuid(), staff_id uuid not null references public.staff(id) on delete cascade, weekday int not null check (weekday between 0 and 6), start_time time not null, end_time time not null, break_start time, break_end time, unique(staff_id, weekday));
create table public.staff_time_off (id uuid primary key default gen_random_uuid(), staff_id uuid references public.staff(id) on delete cascade, starts_at timestamptz not null, ends_at timestamptz not null, reason text);
create table public.customers (id uuid primary key default gen_random_uuid(), first_name text not null, last_name text not null, phone text not null unique, email text, notes text, marketing_consent boolean not null default false, kvkk_accepted_at timestamptz, created_at timestamptz not null default now());
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null default upper(substr(md5(gen_random_uuid()::text),1,8)),
  customer_id uuid not null references public.customers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  staff_id uuid not null references public.staff(id) on delete restrict,
  starts_at timestamptz not null, ends_at timestamptz not null, block_ends_at timestamptz not null,
  status appointment_status not null default 'pending',
  price numeric(10,2), customer_note text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (ends_at > starts_at and block_ends_at >= ends_at),
  constraint no_overlap exclude using gist (staff_id with =, tstzrange(starts_at, block_ends_at) with &&) where (status in ('pending','confirmed'))
);
create index on public.appointments(starts_at);
create index on public.appointments(customer_id);
create table public.business_settings (id int primary key default 1 check (id=1), min_lead_minutes int not null default 120, max_advance_days int not null default 60, slot_step_min int not null default 30, closed_dates date[] not null default '{}', phone text, whatsapp text, instagram text, email text, address text, maps_url text, hours_text text);
create table public.gallery_images (id uuid primary key default gen_random_uuid(), image_key text not null, alt text not null, sort int not null default 0);
create table public.content_sections (key text primary key, value jsonb not null default '{}', updated_at timestamptz not null default now());
create table public.notification_logs (id uuid primary key default gen_random_uuid(), appointment_id uuid references public.appointments(id) on delete cascade, channel text not null, status text not null, detail text, created_at timestamptz not null default now());

-- grants
grant select on public.service_categories, public.services, public.staff, public.staff_services, public.staff_working_hours, public.business_settings, public.gallery_images, public.content_sections to anon, authenticated;
grant insert, update, delete on public.service_categories, public.services, public.staff, public.staff_services, public.staff_working_hours, public.staff_time_off, public.business_settings, public.gallery_images, public.content_sections, public.customers, public.appointments to authenticated;
grant select on public.staff_time_off, public.customers, public.appointments, public.notification_logs, public.profiles, public.user_roles to authenticated;
grant update on public.profiles to authenticated;
grant all on all tables in schema public to service_role;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.staff_services enable row level security;
alter table public.staff_working_hours enable row level security;
alter table public.staff_time_off enable row level security;
alter table public.customers enable row level security;
alter table public.appointments enable row level security;
alter table public.business_settings enable row level security;
alter table public.gallery_images enable row level security;
alter table public.content_sections enable row level security;
alter table public.notification_logs enable row level security;

create policy "own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create policy "public read" on public.service_categories for select using (true);
create policy "public read published" on public.services for select using (is_published or public.is_team(auth.uid()));
create policy "public read active" on public.staff for select using (is_active or public.is_team(auth.uid()));
create policy "public read" on public.staff_services for select using (true);
create policy "public read" on public.staff_working_hours for select using (true);
create policy "public read" on public.business_settings for select using (true);
create policy "public read" on public.gallery_images for select using (true);
create policy "public read" on public.content_sections for select using (true);

create policy "admin write" on public.service_categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.staff for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.staff_services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.staff_working_hours for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.business_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.gallery_images for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.content_sections for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "team read" on public.staff_time_off for select to authenticated using (public.is_team(auth.uid()));
create policy "admin write" on public.staff_time_off for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "team read" on public.customers for select to authenticated using (public.is_team(auth.uid()));
create policy "team write" on public.customers for update to authenticated using (public.is_team(auth.uid()));
create policy "admin all" on public.customers for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "team read" on public.appointments for select to authenticated using (public.is_team(auth.uid()));
create policy "team update" on public.appointments for update to authenticated using (public.is_team(auth.uid())) with check (public.is_team(auth.uid()));
create policy "admin all" on public.appointments for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin read" on public.notification_logs for select to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at = now(); return new; end $$;
create trigger appointments_touch before update on public.appointments for each row execute function public.touch_updated_at();

-- signup: profile + first user ever becomes admin (bootstrap only)
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- availability core
create or replace function public.staff_free(_staff uuid, _start timestamptz, _block_end timestamptz, _ignore uuid default null) returns boolean language plpgsql stable security definer set search_path=public as $$
declare d date := (_start at time zone 'Europe/Istanbul')::date; wh record; st time := (_start at time zone 'Europe/Istanbul')::time; en time := (_block_end at time zone 'Europe/Istanbul')::time;
begin
  if (_block_end at time zone 'Europe/Istanbul')::date <> d then return false; end if;
  if d = any((select closed_dates from business_settings where id=1)) then return false; end if;
  select * into wh from staff_working_hours where staff_id=_staff and weekday=extract(dow from d)::int;
  if not found then return false; end if;
  if st < wh.start_time or en > wh.end_time then return false; end if;
  if wh.break_start is not null and st < wh.break_end and en > wh.break_start then return false; end if;
  if exists (select 1 from staff_time_off o where (o.staff_id=_staff or o.staff_id is null) and o.starts_at < _block_end and o.ends_at > _start) then return false; end if;
  if exists (select 1 from appointments a where a.staff_id=_staff and a.status in ('pending','confirmed') and (_ignore is null or a.id<>_ignore) and a.starts_at < _block_end and a.block_ends_at > _start) then return false; end if;
  return true;
end $$;

create or replace function public.get_availability(_service uuid, _staff uuid, _day date)
returns table(slot text, starts_at timestamptz, available boolean, staff_id uuid)
language plpgsql stable security definer set search_path=public as $$
declare s record; bs record; t time; dstart time; dend time; ts timestamptz; free_staff uuid;
begin
  select * into s from services where id=_service and is_published; if not found then return; end if;
  select * into bs from business_settings where id=1;
  if _day > ((now() at time zone 'Europe/Istanbul')::date + bs.max_advance_days) then return; end if;
  select min(h.start_time), max(h.end_time) into dstart, dend from staff_working_hours h join staff_services ss on ss.staff_id=h.staff_id join staff st on st.id=h.staff_id
    where ss.service_id=_service and st.is_active and h.weekday=extract(dow from _day)::int and (_staff is null or h.staff_id=_staff);
  if dstart is null then return; end if;
  t := dstart;
  while t + make_interval(mins => s.duration_min) <= dend loop
    ts := (_day + t) at time zone 'Europe/Istanbul';
    free_staff := null;
    if ts >= now() + make_interval(mins => bs.min_lead_minutes) then
      select st.id into free_staff from staff st join staff_services ss on ss.staff_id=st.id
        where ss.service_id=_service and st.is_active and (_staff is null or st.id=_staff)
          and public.staff_free(st.id, ts, ts + make_interval(mins => s.duration_min + s.buffer_min))
        order by st.sort limit 1;
    end if;
    slot := to_char(t,'HH24:MI'); starts_at := ts; available := free_staff is not null; staff_id := free_staff;
    return next;
    t := t + make_interval(mins => bs.slot_step_min);
  end loop;
end $$;

create or replace function public.get_open_weekdays(_service uuid, _staff uuid) returns int[] language sql stable security definer set search_path=public as $$
  select coalesce(array_agg(distinct h.weekday), '{}') from staff_working_hours h join staff_services ss on ss.staff_id=h.staff_id join staff st on st.id=h.staff_id
  where ss.service_id=_service and st.is_active and (_staff is null or h.staff_id=_staff)
$$;

create or replace function public.create_booking(_service uuid, _staff uuid, _starts_at timestamptz, _first text, _last text, _phone text, _email text, _note text, _marketing boolean, _kvkk boolean)
returns table(reference text, staff_name text, starts_at timestamptz, ends_at timestamptz)
language plpgsql volatile security definer set search_path=public as $$
declare s record; bs record; chosen uuid; cust uuid; appt record; blk timestamptz; fin timestamptz;
begin
  if not coalesce(_kvkk,false) then raise exception 'KVKK_REQUIRED'; end if;
  if length(trim(coalesce(_first,''))) < 2 or length(trim(coalesce(_last,''))) < 2 then raise exception 'INVALID_NAME'; end if;
  if regexp_replace(coalesce(_phone,''),'\D','','g') !~ '^(90)?0?5\d{9}$' then raise exception 'INVALID_PHONE'; end if;
  if length(coalesce(_note,'')) > 500 or length(coalesce(_first,''))>60 or length(coalesce(_last,''))>60 or length(coalesce(_email,''))>255 then raise exception 'TOO_LONG'; end if;
  select * into s from services where id=_service and is_published; if not found then raise exception 'SERVICE_NOT_FOUND'; end if;
  select * into bs from business_settings where id=1;
  if _starts_at < now() + make_interval(mins => bs.min_lead_minutes) then raise exception 'SLOT_TAKEN'; end if;
  if (_starts_at at time zone 'Europe/Istanbul')::date > (now() at time zone 'Europe/Istanbul')::date + bs.max_advance_days then raise exception 'SLOT_TAKEN'; end if;
  fin := _starts_at + make_interval(mins => s.duration_min);
  blk := fin + make_interval(mins => s.buffer_min);
  select st.id into chosen from staff st join staff_services ss on ss.staff_id=st.id
    where ss.service_id=_service and st.is_active and (_staff is null or st.id=_staff) and public.staff_free(st.id, _starts_at, blk)
    order by st.sort limit 1;
  if chosen is null then raise exception 'SLOT_TAKEN'; end if;
  insert into customers(first_name,last_name,phone,email,marketing_consent,kvkk_accepted_at)
    values (trim(_first),trim(_last),regexp_replace(_phone,'\D','','g'),nullif(trim(_email),''),coalesce(_marketing,false),now())
    on conflict (phone) do update set first_name=excluded.first_name,last_name=excluded.last_name,email=coalesce(excluded.email,customers.email),marketing_consent=excluded.marketing_consent,kvkk_accepted_at=now()
    returning id into cust;
  begin
    insert into appointments(customer_id,service_id,staff_id,starts_at,ends_at,block_ends_at,price,customer_note)
      values (cust,_service,chosen,_starts_at,fin,blk,s.price,nullif(trim(_note),'')) returning * into appt;
  exception when exclusion_violation then raise exception 'SLOT_TAKEN'; end;
  insert into notification_logs(appointment_id,channel,status,detail) values (appt.id,'sms','skipped','Bildirim sağlayıcısı bağlı değil');
  return query select appt.reference, (select full_name from staff where id=chosen), appt.starts_at, appt.ends_at;
end $$;

revoke execute on function public.staff_free(uuid,timestamptz,timestamptz,uuid) from public, anon;
grant execute on function public.staff_free(uuid,timestamptz,timestamptz,uuid) to authenticated;
grant execute on function public.get_availability(uuid,uuid,date), public.get_open_weekdays(uuid,uuid), public.create_booking(uuid,uuid,timestamptz,text,text,text,text,text,boolean,boolean) to anon, authenticated;

-- seed
insert into business_settings(id, phone, whatsapp, instagram, email, address, maps_url, hours_text) values (1,'+90 212 555 01 23','905325550123','lumebeauty','merhaba@lumebeauty.com','Abdi İpekçi Cd. No:12, Nişantaşı, İstanbul','https://maps.google.com/?q=Nisantasi+Istanbul','Salı – Cumartesi 10:00 – 20:00 · Pazar 11:00 – 18:00');
insert into service_categories(name, slug, sort) values ('Cilt Bakımı','cilt-bakimi',1),('Manikür & Pedikür','manikur-pedikur',2),('İpek Kirpik','ipek-kirpik',3),('Kaş & Kirpik Tasarımı','kas-kirpik',4),('Profesyonel Makyaj','makyaj',5),('Diğer Uygulamalar','diger',6);
insert into services(category_id,name,description,duration_min,buffer_min,price,image_key,sort)
select c.id, v.name, v.descr, v.dur, 10, v.price, v.img, v.sort from (values
 ('cilt-bakimi','Signature Cilt Bakımı','Cildinize özel analizle başlayan, derin temizlik ve yoğun nem ritüeli.',90,2400,'skincare',1),
 ('manikur-pedikur','Manikür & Pedikür','Bakım, şekillendirme ve kalıcı oje ile kusursuz eller ve ayaklar.',75,1200,'nails',2),
 ('ipek-kirpik','İpek Kirpik','Doğal ya da hacimli; göz yapınıza göre tel tel uygulama.',120,1800,'lashes',3),
 ('kas-kirpik','Kaş & Kirpik Tasarımı','Yüz oranlarınıza uygun kaş tasarımı, laminasyon ve lifting.',45,900,'brows',4),
 ('makyaj','Profesyonel Makyaj','Gün, gece ve özel davetler için kalıcı, ışıltılı makyaj.',60,2200,'makeup',5),
 ('diger','Işıltı Ritüeli','Kısa sürede tazelenmek isteyenler için yüz masajı ve maske.',45,1100,'salon',6)
) v(cat,name,descr,dur,price,img,sort) join service_categories c on c.slug=v.cat;
insert into staff(full_name,title,bio,photo_key,sort) values
 ('Elif Aydın','Cilt Bakım Uzmanı','On yılı aşkın deneyimiyle cildi dinleyerek bakım planlar.','staff1',1),
 ('Selin Kaya','Kirpik & Kaş Sanatçısı','Detaya tutkulu; doğal görünen dönüşümlerin ustası.','staff2',2),
 ('Deniz Arslan','Makyaj & Tırnak Uzmanı','Editoryal çekimlerden gelinlere uzanan bir portfolyo.','staff3',3);
insert into staff_services select st.id, sv.id from staff st, services sv where
 (st.full_name='Elif Aydın' and sv.image_key in ('skincare','salon')) or
 (st.full_name='Selin Kaya' and sv.image_key in ('lashes','brows')) or
 (st.full_name='Deniz Arslan' and sv.image_key in ('makeup','nails','salon'));
insert into staff_working_hours(staff_id,weekday,start_time,end_time,break_start,break_end)
select st.id, d, case when d=0 then '11:00'::time else '10:00'::time end, case when d=0 then '18:00'::time else '20:00'::time end, '13:30','14:30' from staff st, generate_series(0,6) d where d <> 1;
insert into gallery_images(image_key, alt, sort) values ('salon','Salonun aydınlık bakım odası',1),('skincare','Cilt bakımı uygulaması',2),('nails','Nude manikür',3),('lashes','İpek kirpik detayı',4),('makeup','Makyaj uygulaması',5),('brows','Kaş tasarımı',6),('hero','Doğal ışıkta portre',7);
insert into content_sections(key, value) values ('hero', '{"eyebrow":"YOUR BEAUTY, YOUR RITUAL","title":"Kendine ayırdığın\nen güzel an.","subtitle":"Güzelliğinize özenle dokunduğumuz, kendinizi yeniden keşfedeceğiniz özel bir deneyim."}');
