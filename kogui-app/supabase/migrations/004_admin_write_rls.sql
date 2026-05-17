-- ============================================================
-- Migración: Añadir políticas RLS de edición para administradores en lecciones
-- ============================================================

-- 1. Políticas para lessons (Insert, Update, Delete)
drop policy if exists "lessons: insert for admins" on public.lessons;
create policy "lessons: insert for admins"
  on public.lessons for insert
  with check (public.is_admin());

drop policy if exists "lessons: update for admins" on public.lessons;
create policy "lessons: update for admins"
  on public.lessons for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "lessons: delete for admins" on public.lessons;
create policy "lessons: delete for admins"
  on public.lessons for delete
  using (public.is_admin());

-- 2. Políticas para modules (Insert, Update, Delete)
drop policy if exists "modules: insert for admins" on public.modules;
create policy "modules: insert for admins"
  on public.modules for insert
  with check (public.is_admin());

drop policy if exists "modules: update for admins" on public.modules;
create policy "modules: update for admins"
  on public.modules for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "modules: delete for admins" on public.modules;
create policy "modules: delete for admins"
  on public.modules for delete
  using (public.is_admin());
