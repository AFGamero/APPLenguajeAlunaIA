-- ============================================================
-- Kogui App — Migración inicial (T-00-06 + T-00-07)
-- Tablas: profiles, modules, lessons, user_progress
-- RLS policies incluidas
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Extensiones ───────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ============================================================
-- Tabla: profiles
-- Una fila por usuario autenticado en Supabase Auth
-- ============================================================
create table if not exists public.profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  display_name  text        not null,
  xp_total      integer     not null default 0,
  streak_days   integer     not null default 0,
  last_activity timestamptz,
  created_at    timestamptz not null default now()
);

comment on table public.profiles is 'Perfil público de cada usuario de Kogui.';

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── RLS: profiles ─────────────────────────────────────────────
alter table public.profiles enable row level security;

-- El usuario solo puede leer y actualizar su propio perfil
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- Tabla: modules
-- Módulos temáticos del curso (datos de contenido, no por usuario)
-- ============================================================
create table if not exists public.modules (
  id          uuid    primary key default gen_random_uuid(),
  title       text    not null,
  order_index integer not null unique,
  description text
);

comment on table public.modules is 'Módulos temáticos del curso de lengua Kogui.';

-- ── RLS: modules ──────────────────────────────────────────────
alter table public.modules enable row level security;

-- Lectura pública para usuarios autenticados
create policy "modules: select authenticated"
  on public.modules for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- Tabla: lessons
-- Lecciones dentro de cada módulo, contenido en JSONB
-- ============================================================
create table if not exists public.lessons (
  id          uuid    primary key default gen_random_uuid(),
  module_id   uuid    not null references public.modules(id) on delete cascade,
  title       text    not null,
  order_index integer not null,
  xp_reward   integer not null default 30,
  content     jsonb   not null,
  unique (module_id, order_index)
);

comment on table public.lessons is 'Lecciones del curso. El campo content (JSONB) contiene vocabulario y ejercicios.';
comment on column public.lessons.content is
  'Estructura: { "vocab": VocabItem[], "exercises": Exercise[] }. Ver tipos en src/types/supabase.ts';

-- ── RLS: lessons ──────────────────────────────────────────────
alter table public.lessons enable row level security;

create policy "lessons: select authenticated"
  on public.lessons for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- Tabla: user_progress
-- Registro de lecciones completadas por usuario
-- ============================================================
create table if not exists public.user_progress (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  lesson_id    uuid        not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  score        integer     not null check (score >= 0),
  xp_earned    integer     not null check (xp_earned >= 0),
  -- Una sola entrada por usuario/lección (upsert en la app)
  unique (user_id, lesson_id)
);

comment on table public.user_progress is 'Progreso del usuario: lecciones completadas, score y XP ganado.';

-- ── RLS: user_progress ────────────────────────────────────────
alter table public.user_progress enable row level security;

-- El usuario solo puede ver y gestionar su propio progreso
create policy "user_progress: select own"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "user_progress: insert own"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "user_progress: update own"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Índices de rendimiento ────────────────────────────────────
create index if not exists idx_lessons_module_id       on public.lessons(module_id);
create index if not exists idx_lessons_order           on public.lessons(module_id, order_index);
create index if not exists idx_user_progress_user_id   on public.user_progress(user_id);
create index if not exists idx_user_progress_lesson_id on public.user_progress(lesson_id);
create index if not exists idx_modules_order           on public.modules(order_index);
