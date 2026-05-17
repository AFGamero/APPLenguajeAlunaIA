# Feature 001 — Infraestructura Base (Sprint 0)

| Campo | Valor |
|-------|-------|
| ID | F-001 |
| Sprint | 0 — Configuración |
| Prioridad MoSCoW | Must |
| Dependencias | Ninguna |
| Estimación | 10.5 pt |

## Descripción

Configuración inicial del proyecto: Vite + React + TypeScript, Supabase, estructura de carpetas, diseño tokens y primer deploy en Vercel.

## Tareas

| ID | Descripción | Tipo | Estimación |
|----|-------------|------|------------|
| T-00-01 | Inicializar proyecto Vite + React + TypeScript | Config | 1 pt |
| T-00-02 | Configurar ESLint, Prettier y estructura de carpetas | Config | 1 pt |
| T-00-03 | Instalar y configurar React Router v6 con rutas protegidas | Frontend | 1 pt |
| T-00-04 | Crear proyecto en Supabase y obtener credenciales | Config | 0.5 pt |
| T-00-05 | Instalar supabase-js y configurar cliente | Config | 0.5 pt |
| T-00-06 | Crear tablas en Supabase: profiles, modules, lessons, user_progress | Backend/DB | 2 pt |
| T-00-07 | Configurar RLS policies en Supabase para cada tabla | Backend/DB | 1 pt |
| T-00-08 | Seed inicial: módulo 1 + 2 lecciones con contenido JSONB | Backend/DB | 2 pt |
| T-00-09 | Configurar variables de entorno en Vercel y primer deploy | Config | 0.5 pt |
| T-00-10 | Definir tokens de diseño: colores, tipografía, espaciado (CSS variables) | Frontend | 1 pt |

## Modelo de datos

### profiles
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | FK → auth.users |
| display_name | TEXT NOT NULL | Nombre visible |
| xp_total | INTEGER DEFAULT 0 | XP acumulado |
| streak_days | INTEGER DEFAULT 0 | Racha diaria |
| last_activity | TIMESTAMPTZ NULLABLE | Última actividad |
| created_at | TIMESTAMPTZ DEFAULT now() | Fecha de registro |

### modules
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| title | TEXT NOT NULL | Nombre del módulo |
| order_index | INTEGER NOT NULL UNIQUE | Orden |
| description | TEXT NULLABLE | Descripción |

### lessons
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| module_id | UUID FK → modules | Módulo |
| title | TEXT NOT NULL | Título |
| order_index | INTEGER NOT NULL | Orden |
| xp_reward | INTEGER DEFAULT 30 | XP al completar |
| content | JSONB NOT NULL | Vocabulario y ejercicios |

### user_progress
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| user_id | UUID FK → profiles | Usuario |
| lesson_id | UUID FK → lessons | Lección |
| completed_at | TIMESTAMPTZ DEFAULT now() | Fecha |
| score | INTEGER NOT NULL | Correctas/total |
| xp_earned | INTEGER NOT NULL | XP ganado |

## Criterios de aceptación

1. Proyecto corre localmente con `npm run dev`
2. Supabase responde a consultas desde el frontend
3. RLS policies impiden acceso cruzado entre usuarios
4. Deploy en Vercel con preview URL funcional
5. Variables de diseño consistentes en toda la app

## Definition of Done

- [ ] Repositorio con estructura de carpetas definida
- [ ] ESLint + Prettier configurados y funcionando
- [ ] React Router con layout base y rutas placeholder
- [ ] Cliente Supabase conectado y autenticado
- [ ] Tablas creadas en Supabase con RLS activo
- [ ] Seed data cargada (módulo 1 + 2 lecciones)
- [ ] Deploy automático en Vercel desde main branch
- [ ] Design tokens documentados en :root CSS
