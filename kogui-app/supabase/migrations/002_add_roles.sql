-- ============================================================
-- Migración: Añadir Roles a perfiles
-- ============================================================

alter table public.profiles 
add column if not exists role text not null default 'estudiante' check (role in ('estudiante', 'admin', 'experto'));

-- Actualizar a admin el perfil existente para poder hacer pruebas
update public.profiles set role = 'admin';
