-- ============================================================
-- Migración: Añadir políticas RLS para administradores
-- ============================================================

-- 1. Crear función segura (bypasses RLS para no causar recursión infinita)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2. Políticas para profiles
drop policy if exists "profiles: select all for admins" on public.profiles;
create policy "profiles: select all for admins"
  on public.profiles for select
  using (public.is_admin());

-- 3. Políticas para user_progress
drop policy if exists "user_progress: select all for admins" on public.user_progress;
create policy "user_progress: select all for admins"
  on public.user_progress for select
  using (public.is_admin());
