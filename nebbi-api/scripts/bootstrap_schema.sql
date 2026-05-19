-- ============================================================
-- Nebbi API — Bootstrap manual del esquema en Neon
-- Ejecutar en el SQL Editor de Neon si no quieres usar shell.
-- ============================================================

begin;

create table if not exists public.modules (
    id uuid primary key,
    title varchar not null,
    order_index integer not null unique,
    description varchar null
);

create table if not exists public.users (
    id uuid primary key,
    email varchar not null unique,
    hashed_password varchar not null,
    created_at timestamptz default now()
);

create unique index if not exists ix_users_email on public.users (email);

create table if not exists public.lessons (
    id uuid primary key,
    module_id uuid not null references public.modules(id) on delete cascade,
    title varchar not null,
    order_index integer not null,
    xp_reward integer not null default 30,
    content json not null,
    constraint uq_lesson_module_order unique (module_id, order_index)
);

create table if not exists public.profiles (
    id uuid primary key references public.users(id) on delete cascade,
    display_name varchar not null,
    role varchar not null default 'estudiante',
    xp_total integer not null default 0,
    streak_days integer not null default 0,
    last_activity timestamptz null,
    created_at timestamptz default now()
);

create table if not exists public.user_progress (
    id uuid primary key,
    user_id uuid not null references public.profiles(id) on delete cascade,
    lesson_id uuid not null references public.lessons(id) on delete cascade,
    completed_at timestamptz default now(),
    score integer not null,
    xp_earned integer not null,
    constraint uq_progress_user_lesson unique (user_id, lesson_id)
);

create table if not exists public.alembic_version (
    version_num varchar(32) primary key
);

insert into public.alembic_version (version_num)
values ('001_initial_schema')
on conflict (version_num) do nothing;

commit;
