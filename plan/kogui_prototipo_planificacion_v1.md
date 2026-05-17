# App de Aprendizaje de Lengua Kogui — Prototipo Web

| Campo | Valor |
|-------|-------|
| Versión | 1.0 — Prototipo |
| Fecha | Mayo 2026 |
| Stack | React (Vite) + Supabase + Vercel |
| Alcance | Auth completo + 2–3 lecciones + progreso persistido |

---

## Tabla de contenido

1. [Contexto y objetivo del prototipo](#1-contexto-y-objetivo-del-prototipo)
2. [Casos de uso — Prototipo Web](#2-casos-de-uso--prototipo-web)
3. [Requisitos funcionales — Prototipo Web](#3-requisitos-funcionales--prototipo-web)
4. [Priorización MoSCoW](#4-priorización-moscow)
5. [Modelo de datos — Supabase](#5-modelo-de-datos--supabase)
6. [Planificación de features — Sprints](#6-planificación-de-features--sprints)
7. [Resumen ejecutivo](#7-resumen-ejecutivo)

---

## 1. Contexto y objetivo del prototipo

Este documento define el alcance técnico y funcional de la Fase 1 del proyecto: un prototipo web desplegado en Vercel que permita validar el flujo de aprendizaje y la experiencia de usuario antes de migrar al stack completo (React Native + FastAPI + microservicios).

El prototipo no reemplaza el sistema final. Su propósito es validar hipótesis de diseño e interacción con costo mínimo de infraestructura.

### 1.1 Decisiones de arquitectura para el prototipo

- **Frontend:** React (Vite) desplegado en Vercel — sin costo.
- **Backend:** Supabase — PostgreSQL + Auth + Storage gratuito. Sin servidor propio.
- **Persistencia:** Progreso del usuario almacenado en Supabase en tiempo real.
- **Sin IA:** La personalización de ruta (CU-17 al CU-20 del sistema completo) queda fuera de este prototipo.
- **Sin offline:** La sincronización offline (CU-07, CU-08) queda fuera de este prototipo.

---

## 2. Casos de uso — Prototipo Web

> Los CU del sistema completo (IA, offline, validación cultural, administración avanzada) se documentan en el documento de especificaciones unificadas v2.0. Aquí se incluyen únicamente los realizables en el prototipo web con React + Supabase.

---

### CU-P01 — Registrarse en la aplicación

| Campo | Detalle |
|-------|---------|
| **Actor** | Usuario no autenticado |
| **Descripción** | El usuario crea una cuenta con nombre, correo electrónico y contraseña. |
| **Precondición** | No tener una cuenta existente en Supabase Auth. |
| **Flujo principal** | 1. Accede a `/register` → 2. Ingresa nombre, email y contraseña → 3. Supabase Auth crea el usuario → 4. Se crea registro en tabla `profiles` → 5. Redirige al home. |
| **Flujo alternativo** | Email ya registrado → se muestra error "El correo ya está en uso". |
| **Postcondición** | Cuenta creada, perfil inicializado, sesión activa. |
| **Criterios de aceptación** | 1. El registro se completa en menos de 2 minutos. 2. El perfil aparece en Supabase inmediatamente tras el registro. |
| **RF relacionados** | RF-P01, RF-P02 |

---

### CU-P02 — Iniciar sesión

| Campo | Detalle |
|-------|---------|
| **Actor** | Usuario registrado |
| **Descripción** | El usuario accede a su cuenta mediante email y contraseña. |
| **Precondición** | Cuenta previamente registrada. |
| **Flujo principal** | 1. Accede a `/login` → 2. Ingresa email y contraseña → 3. Supabase valida credenciales → 4. JWT generado y almacenado → 5. Redirige al home. |
| **Flujo alternativo** | Credenciales incorrectas → error "Email o contraseña incorrectos". Tras 5 intentos fallidos → bloqueo temporal por Supabase. |
| **Postcondición** | Sesión activa con JWT válido. |
| **Criterios de aceptación** | 1. Acceso en menos de 3 segundos con buena conexión. 2. Redirección automática si ya hay sesión activa. |
| **RF relacionados** | RF-P03, RF-P04 |

---

### CU-P03 — Ver perfil y progreso

| Campo | Detalle |
|-------|---------|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario consulta su nombre, XP acumulado, racha diaria y lecciones completadas. |
| **Precondición** | Sesión activa. Haber completado al menos una lección. |
| **Flujo principal** | 1. Navega a `/profile` → 2. Se consultan datos de tablas `profiles` y `user_progress` → 3. Se muestran métricas: XP, racha, lecciones completadas. |
| **Postcondición** | Ninguna (solo lectura). |
| **Criterios de aceptación** | 1. Los datos se cargan en menos de 2 segundos. 2. El XP refleja el progreso acumulado correctamente. |
| **RF relacionados** | RF-P09, RF-P10 |

---

### CU-P04 — Ver módulo y lista de lecciones

| Campo | Detalle |
|-------|---------|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario navega al módulo disponible y ve el listado de lecciones con su estado (completada / disponible / bloqueada). |
| **Precondición** | Sesión activa. |
| **Flujo principal** | 1. Home muestra el módulo 1 → 2. Se listan las lecciones con estado → 3. El usuario selecciona una lección disponible. |
| **Flujo alternativo** | Lección bloqueada → mensaje "Completa la lección anterior primero". |
| **Postcondición** | El usuario inicia la lección seleccionada. |
| **Criterios de aceptación** | 1. Las lecciones bloqueadas no son accesibles. 2. El estado de completada se refleja visualmente con ícono y color diferenciado. |
| **RF relacionados** | RF-P05, RF-P06 |

---

### CU-P05 — Realizar una lección

| Campo | Detalle |
|-------|---------|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario completa una lección compuesta por pantalla de vocabulario, ejercicio de selección múltiple, emparejamiento y escritura. |
| **Precondición** | Sesión activa. Lección disponible (no bloqueada). |
| **Flujo principal** | 1. Pantalla de vocabulario con audio y nota cultural → 2. Ejercicio selección múltiple → 3. Ejercicio emparejamiento → 4. Ejercicio escritura → 5. Pantalla de resultado con XP ganado. |
| **Flujo alternativo** | Respuesta incorrecta → feedback inmediato → opción de pista tras primer error. |
| **Postcondición** | Progreso guardado en Supabase: lección marcada como completada, XP actualizado, racha revisada. |
| **Criterios de aceptación** | 1. El flujo completo funciona sin errores técnicos. 2. El progreso se guarda en Supabase en menos de 5 segundos tras completar la lección. 3. El feedback aparece en menos de 1 segundo tras cada respuesta. |
| **RF relacionados** | RF-P05, RF-P06, RF-P07, RF-P08, RF-P09, RF-P10 |

---

### CU-P06 — Reproducir audio nativo

| Campo | Detalle |
|-------|---------|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario reproduce la pronunciación de una palabra Kogui durante la pantalla de vocabulario. |
| **Precondición** | Audio disponible en Supabase Storage (o síntesis de voz como fallback). |
| **Flujo principal** | 1. Presiona botón de audio → 2. Se reproduce el archivo desde Storage → 3. Opción de repetir. |
| **Flujo alternativo** | Audio no disponible → se usa síntesis de voz del navegador (Web Speech API) como fallback. |
| **Postcondición** | Reproducción registrada en métricas de la lección. |
| **Criterios de aceptación** | 1. El audio inicia en menos de 500 ms. 2. El fallback por síntesis funciona sin error visible para el usuario. |
| **RF relacionados** | RF-P07 |

---

### CU-P07 — Cerrar sesión

| Campo | Detalle |
|-------|---------|
| **Actor** | Usuario autenticado |
| **Descripción** | El usuario finaliza su sesión activa. |
| **Precondición** | Sesión activa. |
| **Flujo principal** | 1. Presiona "Cerrar sesión" en el perfil → 2. Supabase invalida el JWT → 3. Redirige a `/login`. |
| **Postcondición** | Sesión terminada. Rutas protegidas redirigen a `/login`. |
| **Criterios de aceptación** | Tras cerrar sesión, el acceso a rutas protegidas redirige a `/login` inmediatamente. |
| **RF relacionados** | RF-P04 |

---

## 3. Requisitos funcionales — Prototipo Web

> La numeración `RF-Pxx` es independiente de los RF del sistema completo (RF-01 al RF-30) para evitar colisiones en la trazabilidad.

### 3.1 Autenticación y sesión

| ID | CU relacionado | Descripción |
|----|----------------|-------------|
| RF-P01 | CU-P01 | El sistema debe permitir el registro de usuarios con nombre, email y contraseña mediante Supabase Auth. |
| RF-P02 | CU-P01 | Al registrarse, el sistema debe crear automáticamente un registro en la tabla `profiles` con nombre y XP inicial en 0. |
| RF-P03 | CU-P02 | El sistema debe autenticar usuarios con email y contraseña. El JWT es gestionado por Supabase. |
| RF-P04 | CU-P02, CU-P07 | El sistema debe proteger todas las rutas excepto `/login` y `/register`. Usuarios no autenticados son redirigidos a `/login`. |

### 3.2 Navegación y contenido

| ID | CU relacionado | Descripción |
|----|----------------|-------------|
| RF-P05 | CU-P04, CU-P05 | El sistema debe mostrar el módulo 1 con sus lecciones ordenadas. La segunda lección solo se desbloquea al completar la primera. |
| RF-P06 | CU-P04 | Cada lección debe mostrar su estado visualmente: completada (verde + ícono check), disponible (activa), bloqueada (gris + candado). |
| RF-P07 | CU-P05, CU-P06 | Cada lección debe incluir pantalla de vocabulario con palabra Kogui, transcripción fonética, traducción, nota cultural y botón de audio. |
| RF-P08 | CU-P05 | Cada lección debe incluir los tres tipos de ejercicio: selección múltiple, emparejamiento y escritura, en ese orden. |
| RF-P09 | CU-P05 | El sistema debe proporcionar feedback inmediato (< 1 segundo) tras cada respuesta, indicando si es correcta o incorrecta y mostrando la respuesta correcta en caso de error. |
| RF-P10 | CU-P05 | El sistema debe ofrecer una pista opcional tras el primer error en cada ejercicio. |

### 3.3 Progreso y gamificación

| ID | CU relacionado | Descripción |
|----|----------------|-------------|
| RF-P11 | CU-P05 | Al completar una lección, el sistema debe guardar en Supabase: lección marcada como completada, XP ganado y fecha de completion. |
| RF-P12 | CU-P03 | El sistema debe mostrar en el perfil: XP total acumulado, número de lecciones completadas y racha diaria. |
| RF-P13 | CU-P03 | El sistema debe calcular la racha diaria comparando la última fecha de actividad con la fecha actual. |
| RF-P14 | CU-P05 | La pantalla de resultado de cada lección debe mostrar XP ganado, precisión (% respuestas correctas) y vocabulario aprendido en la sesión. |

---

## 4. Priorización MoSCoW

| Prioridad | ID | Requisito |
|-----------|----|-----------|
| **Must** | RF-P01 | Registro de usuario con Supabase Auth |
| **Must** | RF-P02 | Creación automática de perfil en tabla `profiles` |
| **Must** | RF-P03 | Login con email y contraseña |
| **Must** | RF-P04 | Rutas protegidas con redirección a `/login` |
| **Must** | RF-P05 | Módulo con lecciones ordenadas y desbloqueo progresivo |
| **Must** | RF-P07 | Pantalla de vocabulario con audio y nota cultural |
| **Must** | RF-P08 | Tres tipos de ejercicio por lección |
| **Must** | RF-P09 | Feedback inmediato tras cada respuesta |
| **Must** | RF-P11 | Persistencia de progreso en Supabase al completar lección |
| **Should** | RF-P06 | Estado visual de lecciones (completada / disponible / bloqueada) |
| **Should** | RF-P10 | Pista opcional tras primer error |
| **Should** | RF-P12 | Perfil con XP, lecciones y racha |
| **Should** | RF-P13 | Cálculo de racha diaria |
| **Should** | RF-P14 | Pantalla de resultado con precisión y vocabulario aprendido |
| **Must** | — | Panel de administración y constructor de lecciones (CMS) |
| **Could** | — | Animaciones de transición entre ejercicios |
| **Could** | — | Control de velocidad del audio (0.5x, 1x, 1.5x) |
| **Could** | — | Modo oscuro |
| **Won't** | — | IA / personalización de ruta de aprendizaje |
| **Won't** | — | Sincronización offline |
| **Won't** | — | Validación cultural por experto |

---

## 5. Modelo de datos — Supabase

Las políticas RLS (Row Level Security) garantizan que cada usuario solo accede a sus propios datos.

### 5.1 `profiles`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PK, FK → auth.users | ID del usuario (Supabase Auth) |
| `display_name` | TEXT | NOT NULL | Nombre visible del usuario |
| `xp_total` | INTEGER | DEFAULT 0 | XP acumulado total |
| `streak_days` | INTEGER | DEFAULT 0 | Racha diaria actual |
| `last_activity` | TIMESTAMPTZ | NULLABLE | Última vez que completó una lección |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Fecha de registro |

### 5.2 `modules`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PK | Identificador del módulo |
| `title` | TEXT | NOT NULL | Nombre del módulo (ej. "Naturaleza y territorio") |
| `order_index` | INTEGER | NOT NULL, UNIQUE | Orden de aparición |
| `description` | TEXT | NULLABLE | Descripción breve del módulo |

### 5.3 `lessons`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PK | Identificador de la lección |
| `module_id` | UUID | FK → modules | Módulo al que pertenece |
| `title` | TEXT | NOT NULL | Título de la lección |
| `order_index` | INTEGER | NOT NULL | Orden dentro del módulo |
| `xp_reward` | INTEGER | DEFAULT 30 | XP otorgado al completar |
| `content` | JSONB | NOT NULL | Vocabulario y ejercicios en JSON |

### 5.4 `user_progress`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | UUID | PK | Identificador del registro |
| `user_id` | UUID | FK → profiles | Usuario |
| `lesson_id` | UUID | FK → lessons | Lección completada |
| `completed_at` | TIMESTAMPTZ | DEFAULT now() | Fecha y hora de completion |
| `score` | INTEGER | NOT NULL | Respuestas correctas sobre total |
| `xp_earned` | INTEGER | NOT NULL | XP ganado en esta sesión |

---

## 6. Planificación de features — Sprints

Estimaciones en puntos de historia. **1 pt ≈ 2–3 horas de trabajo efectivo.** Total: 3 semanas.

---

### Sprint 0 — Configuración de infraestructura (Semana 1)

**Objetivo:** Tener el proyecto React corriendo localmente y en Vercel, con Supabase configurado y las tablas creadas. Sin pantallas de usuario final.

| ID Tarea | Descripción | Tipo | Estimación |
|----------|-------------|------|------------|
| T-00-01 | Inicializar proyecto Vite + React + TypeScript | Config | 1 pt |
| T-00-02 | Configurar ESLint, Prettier y estructura de carpetas | Config | 1 pt |
| T-00-03 | Instalar y configurar React Router v6 con rutas protegidas | Frontend | 1 pt |
| T-00-04 | Crear proyecto en Supabase y obtener credenciales | Config | 0.5 pt |
| T-00-05 | Instalar `supabase-js` y configurar cliente en el proyecto | Config | 0.5 pt |
| T-00-06 | Crear tablas en Supabase: `profiles`, `modules`, `lessons`, `user_progress` | Backend/DB | 2 pt |
| T-00-07 | Configurar RLS policies en Supabase para cada tabla | Backend/DB | 1 pt |
| T-00-08 | Seed inicial: módulo 1 + 2 lecciones con contenido en JSONB | Backend/DB | 2 pt |
| T-00-09 | Configurar variables de entorno en Vercel y primer deploy exitoso | Config | 0.5 pt |
| T-00-10 | Definir tokens de diseño: colores, tipografía, espaciado (CSS variables) | Frontend | 1 pt |

**Total Sprint 0: 10.5 puntos de historia**

---

### Sprint 1 — Autenticación + Perfil (Semana 2)

**Objetivo:** El usuario puede registrarse, iniciar sesión, ver su perfil y cerrar sesión. Las rutas están protegidas.

Cubre: CU-P01, CU-P02, CU-P03, CU-P07 / RF-P01 al RF-P04, RF-P12, RF-P13.

| ID Tarea | Descripción | Tipo | Estimación |
|----------|-------------|------|------------|
| T-01-01 | Componente `RegisterForm` con validación de campos | Frontend | 2 pt |
| T-01-02 | Integrar Supabase Auth: `signUp` + creación automática de perfil | Backend/DB | 2 pt |
| T-01-03 | Componente `LoginForm` con manejo de errores | Frontend | 2 pt |
| T-01-04 | Integrar Supabase Auth: `signInWithPassword` + almacenamiento de sesión | Backend/DB | 1 pt |
| T-01-05 | Hook `useAuth`: estado de sesión reactivo, loading state, user object | Frontend | 2 pt |
| T-01-06 | `ProtectedRoute` HOC: redirige a `/login` si no hay sesión | Frontend | 1 pt |
| T-01-07 | Página `/profile`: XP total, lecciones completadas, racha diaria | Frontend | 2 pt |
| T-01-08 | Lógica de racha diaria: comparar `last_activity` con today, actualizar `streak_days` | Backend/DB | 2 pt |
| T-01-09 | Botón de logout: `signOut` + redirect a `/login` | Frontend | 0.5 pt |
| T-01-10 | Layout general: navbar con avatar, nombre y botón de perfil/logout | Frontend | 1.5 pt |
| T-01-11 | Testing manual del flujo completo de auth en Vercel preview | Config | 1 pt |

**Total Sprint 1: 17 puntos de historia**

---

### Sprint 2 — Lección completa + Persistencia (Semana 3)

**Objetivo:** El usuario puede completar una lección de principio a fin y el progreso queda guardado en Supabase.

Cubre: CU-P04, CU-P05, CU-P06 / RF-P05 al RF-P11, RF-P14.

| ID Tarea | Descripción | Tipo | Estimación |
|----------|-------------|------|------------|
| T-02-01 | Página `/home`: módulo 1 con estado de lecciones (completada / disponible / bloqueada) | Frontend | 2 pt |
| T-02-02 | Lógica de desbloqueo: lección N disponible solo si lección N-1 está en `user_progress` | Frontend | 1.5 pt |
| T-02-03 | Componente `LessonPage`: orquesta los pasos (vocab → MC → match → write → result) | Frontend | 2 pt |
| T-02-04 | Componente `VocabScreen`: palabra Kogui, fonética, traducción, nota cultural, botón audio | Frontend | 2 pt |
| T-02-05 | Integración de audio: Supabase Storage con fallback a Web Speech API | Frontend | 1.5 pt |
| T-02-06 | Componente `MultipleChoice`: 4 opciones, selección, feedback inmediato | Frontend | 2 pt |
| T-02-07 | Componente `MatchExercise`: columnas kogui/español, detección de errores, pista tras 3 fallos | Frontend | 3 pt |
| T-02-08 | Componente `WriteExercise`: input de texto, validación case-insensitive, pista automática a los 6s | Frontend | 2 pt |
| T-02-09 | Componente `ResultScreen`: XP ganado, precisión %, palabras aprendidas, botón repetir | Frontend | 1.5 pt |
| T-02-10 | Servicio `saveProgress`: insertar en `user_progress` y actualizar `xp_total` + `last_activity` | Backend/DB | 2 pt |
| T-02-11 | Barra de progreso animada durante la lección (% de pasos completados) | Frontend | 1 pt |
| T-02-12 | Seed de lección 2 y lección 3 en Supabase con vocabulario diferente | Backend/DB | 1.5 pt |
| T-02-13 | Testing end-to-end del flujo completo en Vercel: registro → lección → perfil | Config | 1 pt |

**Total Sprint 2: 23.5 puntos de historia**

---

### Sprint 3 — Panel de Administración (CMS) (Semana 4)

**Objetivo:** Proveer una interfaz administrativa para crear módulos, lecciones y ejercicios interactivos directamente desde la aplicación sin tocar código SQL.

Cubre: CU-10 / RF-23, RF-27.

| ID Tarea | Descripción | Tipo | Estimación |
|----------|-------------|------|------------|
| T-03-01 | Roles: agregar campo `role` a `profiles` y proteger ruta `/admin` | Backend/Front | 2 pt |
| T-03-02 | Vista `/admin/modules`: Crear, editar y listar Módulos | Frontend | 2 pt |
| T-03-03 | Vista `/admin/lessons`: Creador de lecciones con ordenamiento | Frontend | 2.5 pt |
| T-03-04 | Builder de Ejercicios: Interfaz visual (JSON editor o GUI) para agregar contenido | Frontend | 4 pt |
| T-03-05 | Lógica de subida de audio a Supabase Storage desde el admin | Backend/Front | 2 pt |

**Total Sprint 3: 12.5 puntos de historia**

---

## 7. Resumen ejecutivo

### Resumen de sprints

| Sprint | Semana | Puntos | Entregable |
|--------|--------|--------|------------|
| Sprint 0 — Infraestructura | Semana 1 | 10.5 pt | Proyecto en Vercel + DB lista |
| Sprint 1 — Auth + Perfil | Semana 2 | 17 pt | Login / Registro / Perfil funcional |
| Sprint 2 — Lección + Progreso | Semana 3 | 23.5 pt | Lección completa con persistencia |
| Sprint 3 — Panel Admin | Semana 4 | 12.5 pt | CMS para crear lecciones |
| **TOTAL** | **4 semanas** | **63.5 pt** | **Prototipo + Admin deployado** |

### 7.1 Criterios de éxito del prototipo

- Un usuario nuevo puede registrarse, completar las 3 lecciones del módulo y ver su progreso en el perfil sin intervención técnica.
- El prototipo está accesible públicamente en una URL de Vercel.
- El progreso persiste entre sesiones (Supabase).
- El tiempo de carga inicial de la lección es menor a 3 segundos en red 4G.

### 7.2 Fuera del alcance de este prototipo

- Motor de IA y personalización de ruta de aprendizaje (CU-17 al CU-20).
- Sincronización offline y descarga de módulos (CU-07, CU-08).
- Validación cultural por experto lingüístico (CU-13).
- App móvil en React Native.
- Microservicios FastAPI.
