# Nebbi — Plan de Migración a FastAPI + Neon PostgreSQL

**Rama:** `feature/fastapi-backend`  
**Objetivo:** Reemplazar Supabase (RAM agotada, latencia alta) con un backend propio en FastAPI conectado a Neon PostgreSQL serverless.

**Resultado esperado:**
- Latencia: 800-2000ms → 80-200ms
- RAM del servidor: 500 MB (agotado) → ~50 MB
- Control total sobre autenticación, lógica de negocio y base de datos

---

## Stack Tecnológico

| Capa | Tecnología | Descripción |
|------|-----------|-------------|
| Frontend | React + Vite + TypeScript | Sin cambios en la UI |
| API | FastAPI (Python 3.11+) | Backend propio, reemplaza Supabase |
| Auth | JWT con `python-jose` + `passlib` | Sin dependencia externa de auth |
| ORM | SQLAlchemy 2.0 + Alembic | Migraciones controladas |
| Base de datos | Neon PostgreSQL (serverless) | Escala a 0, gratis, ~100ms cold start |
| Deploy API | Railway | ~50 MB RAM, desde GitHub |
| Deploy Frontend | Vercel | Sin cambios |

---

## Estructura de Archivos Final

```
APPLenguajeAlunaIA/
├── kogui-app/                    ← Frontend (adaptado)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── apiClient.ts      ← NUEVO (reemplaza supabaseClient.ts)
│   │   │   └── supabaseClient.ts ← ELIMINADO
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx   ← MODIFICADO (JWT propio)
│   │   ├── pages/
│   │   │   ├── Home.tsx          ← MODIFICADO (usa api.modules.list)
│   │   │   ├── Profile.tsx       ← MODIFICADO (usa api.profile.get)
│   │   │   └── lesson/
│   │   │       ├── LessonPage.tsx     ← MODIFICADO
│   │   │       └── ResultScreen.tsx   ← MODIFICADO
│   │   └── types/
│   │       └── api.ts            ← NUEVO (tipos del backend propio)
│   └── .env.local                ← MODIFICADO (agrega VITE_API_URL)
│
└── nebbi-api/                    ← NUEVO directorio
    ├── app/
    │   ├── main.py
    │   ├── database.py
    │   ├── models.py
    │   ├── schemas.py
    │   ├── core/
    │   │   ├── security.py
    │   │   └── dependencies.py
    │   └── routers/
    │       ├── auth.py
    │       ├── modules.py
    │       ├── lessons.py
    │       ├── progress.py
    │       └── profile.py
    ├── alembic/
    │   └── versions/
    │       └── 001_initial_schema.py
    ├── scripts/
    │   └── seed.py
    ├── requirements.txt
    ├── .env.example
    ├── .gitignore
    └── railway.json
```

---

## Sprint 0 — Preparación e Infraestructura (1-2 horas)

**Objetivo:** Tener el entorno listo para desarrollar antes de escribir una línea de código.

### Tareas manuales (el desarrollador las hace)

| # | Tarea | Dónde |
|---|-------|-------|
| S0-01 | Crear cuenta en [neon.tech](https://neon.tech) | Navegador |
| S0-02 | Crear proyecto `nebbi` en Neon | Dashboard Neon |
| S0-03 | Copiar la **connection string** de Neon | Dashboard Neon → Connection Details |
| S0-04 | Verificar Python 3.11+ instalado (`python --version`) | Terminal |
| S0-05 | Crear cuenta en [railway.app](https://railway.app) | Navegador |
| S0-06 | Verificar que la rama `feature/fastapi-backend` está activa | Terminal: `git branch` |

### Entregable
- Connection string de Neon disponible para configurar el `.env`
- Python 3.11+ instalado localmente
- Rama `feature/fastapi-backend` activa ✅

---

## Sprint 1 — Backend: Fundamentos (2-3 horas)

**Objetivo:** Tener el proyecto FastAPI funcionando localmente con base de datos conectada.

### T1-01: Estructura del proyecto y dependencias

**Archivo:** `nebbi-api/requirements.txt`
```
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
alembic==1.13.3
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
python-dotenv==1.0.1
pydantic[email]==2.9.2
```

**Archivo:** `nebbi-api/.env.example`
```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/nebbi?sslmode=require
SECRET_KEY=genera-una-clave-de-32-caracteres-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
FRONTEND_URL=https://app-lenguaje-aluna-ia-3w1t.vercel.app
```

**Archivo:** `nebbi-api/.gitignore`
```
__pycache__/
*.pyc
.env
.venv/
venv/
*.egg-info/
dist/
```

---

### T1-02: Configuración de la base de datos

**Archivo:** `nebbi-api/app/database.py`
- Crea el `engine` de SQLAlchemy apuntando a Neon
- Define `SessionLocal` y `Base`
- Expone `get_db()` como dependency de FastAPI

---

### T1-03: Modelos SQLAlchemy

**Archivo:** `nebbi-api/app/models.py`

Replica exacta de las tablas actuales del schema de Supabase:

```python
class User:
    id: UUID (PK, default uuid4)
    email: str (unique, indexed)
    hashed_password: str
    created_at: datetime

class Profile:
    id: UUID (PK, FK → users.id, cascade delete)
    display_name: str
    role: str (default "estudiante")  # "estudiante" | "admin"
    xp_total: int (default 0)
    streak_days: int (default 0)
    last_activity: datetime (nullable)
    created_at: datetime

class Module:
    id: UUID (PK, default uuid4)
    title: str
    order_index: int (unique)
    description: str (nullable)

class Lesson:
    id: UUID (PK, default uuid4)
    module_id: UUID (FK → modules.id, cascade delete)
    title: str
    order_index: int
    xp_reward: int (default 30)
    content: JSON  # { vocab: [], exercises: [] }
    # UNIQUE (module_id, order_index)

class UserProgress:
    id: UUID (PK, default uuid4)
    user_id: UUID (FK → profiles.id, cascade delete)
    lesson_id: UUID (FK → lessons.id, cascade delete)
    completed_at: datetime
    score: int
    xp_earned: int
    # UNIQUE (user_id, lesson_id)
```

---

### T1-04: Migraciones con Alembic

```bash
cd nebbi-api
alembic init alembic
# Configurar alembic.ini con DATABASE_URL
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

**Resultado:** Tablas creadas en Neon PostgreSQL.

---

### T1-05: Schemas Pydantic

**Archivo:** `nebbi-api/app/schemas.py`

```python
# ── Auth ──────────────────────────────────────────
class RegisterRequest: email, password, display_name
class LoginRequest: email, password
class UserOut: id, email, display_name, role
class TokenResponse: access_token, token_type, user: UserOut

# ── Modules ───────────────────────────────────────
class LessonSummary: id, title, order_index, xp_reward
class ModuleResponse: id, title, order_index, description, lessons: list[LessonSummary]

# ── Lessons ───────────────────────────────────────
class LessonDetailResponse: id, title, xp_reward, content: dict

# ── Progress ──────────────────────────────────────
class ProgressCreate: lesson_id, score, xp_earned
class ProgressItem: id, lesson_id, lesson_title, completed_at, score, xp_earned
class ProgressListResponse: items: list[ProgressItem]

# ── Profile ───────────────────────────────────────
class ProfileResponse: display_name, role, xp_total, streak_days, last_activity
class ProfileUpdate: display_name
```

---

### T1-06: Seguridad y JWT

**Archivo:** `nebbi-api/app/core/security.py`
- `hash_password(plain_password) → str`
- `verify_password(plain, hashed) → bool`
- `create_access_token(data: dict, expires_delta) → str`
- `decode_token(token: str) → dict`

**Archivo:** `nebbi-api/app/core/dependencies.py`
- `get_current_user(token: HTTPAuthorizationCredentials, db: Session) → Profile`
- Extrae el `user_id` del JWT, carga el perfil de la BD

### Entregable Sprint 1
- `uvicorn app.main:app --reload` arranca sin errores
- Tablas creadas en Neon
- `http://localhost:8000/docs` muestra Swagger UI vacío

---

## Sprint 2 — Backend: Endpoints Auth y Contenido (2-3 horas)

**Objetivo:** Tener el login, registro y la carga de contenido funcionando.

### T2-01: Router de Autenticación

**Archivo:** `nebbi-api/app/routers/auth.py`

```
POST /auth/register
  Body: { email, password, display_name }
  → Crea User + Profile en transacción
  → Devuelve TokenResponse (JWT + datos del usuario)
  → Error 409 si el email ya existe

POST /auth/login
  Body: { email, password }
  → Verifica credenciales
  → Devuelve TokenResponse
  → Error 401 si son incorrectas

GET /auth/me
  Headers: Authorization: Bearer <token>
  → Devuelve UserOut del usuario autenticado
```

---

### T2-02: Router de Módulos

**Archivo:** `nebbi-api/app/routers/modules.py`

```
GET /modules
  Headers: Authorization: Bearer <token>
  → Query: SELECT modules con JOIN a lessons (solo id, title, order_index, xp_reward)
  → Ordenado por modules.order_index, lessons.order_index
  → Devuelve list[ModuleResponse]
```

---

### T2-03: Router de Lecciones

**Archivo:** `nebbi-api/app/routers/lessons.py`

```
GET /lessons/{lesson_id}
  Headers: Authorization: Bearer <token>
  → Devuelve LessonDetailResponse con el campo content completo (vocab + exercises)
  → Error 404 si no existe
```

---

### T2-04: App principal con CORS

**Archivo:** `nebbi-api/app/main.py`

```python
app = FastAPI(title="Nebbi API", version="1.0.0")

app.add_middleware(CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router, prefix="/auth")
app.include_router(modules.router, prefix="/modules")
app.include_router(lessons.router, prefix="/lessons")

@app.get("/health")
def health(): return {"status": "ok", "version": "1.0.0"}
```

---

### T2-05: Seed de datos

**Archivo:** `nebbi-api/scripts/seed.py`

Inserta el Módulo 1 completo con las 3 lecciones de vocabulario Kogui:
- Lección 1: El sol, el agua y la montaña (Zaku, Nyui, Teyuna)
- Lección 2: El árbol, el río y la piedra (Kai, Duina, Kaku)
- Lección 3: El viento, la lluvia y la tierra (Seiku, Uga, Zhigoneshi)

```bash
cd nebbi-api
python scripts/seed.py
```

### Verificación Sprint 2 (con Swagger en `/docs`)

```
✅ POST /auth/register → devuelve token
✅ POST /auth/login → devuelve token
✅ GET /auth/me → devuelve datos usuario
✅ GET /modules → devuelve lista con lecciones
✅ GET /lessons/{id} → devuelve vocab + ejercicios
```

---

## Sprint 3 — Backend: Progreso y Perfil (1-2 horas)

**Objetivo:** Completar el flujo de aprendizaje: guardar resultados y calcular estadísticas.

### T3-01: Router de Progreso

**Archivo:** `nebbi-api/app/routers/progress.py`

```
GET /progress
  → Devuelve historial del usuario: list[ProgressItem]
  → JOIN con lessons para obtener el título

POST /progress
  Body: { lesson_id, score, xp_earned }
  → UPSERT en user_progress (si la lección ya existe, actualiza)
  → ACTUALIZA profiles en la misma transacción:
      xp_total += xp_earned
      last_activity = now()
      streak_days = calcular_racha(last_activity_anterior)
  → Devuelve el ProgressItem guardado
```

**Lógica de racha dentro del backend:**
```python
def calcular_racha(old_activity, current_streak):
    if old_activity is None: return 1
    diff = (date.today() - old_activity.date()).days
    if diff == 0: return current_streak      # Ya estudió hoy
    if diff == 1: return current_streak + 1  # Día consecutivo
    return 1                                  # Racha perdida → reinicia
```

---

### T3-02: Router de Perfil

**Archivo:** `nebbi-api/app/routers/profile.py`

```
GET /profile
  → Devuelve ProfileResponse: display_name, role, xp_total, streak_days, last_activity

PATCH /profile
  Body: { display_name }
  → Actualiza display_name del perfil
  → Devuelve ProfileResponse actualizado
```

---

### T3-03: Deploy config Railway

**Archivo:** `nebbi-api/railway.json`
```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health"
  }
}
```

### Verificación Sprint 3

```
✅ POST /progress → guarda resultado y actualiza XP
✅ GET /progress → historial correcto
✅ GET /profile → XP y racha actualizados
✅ PATCH /profile → actualiza nombre
✅ GET /health → status ok
```

---

## Sprint 4 — Frontend: apiClient y AuthContext (2-3 horas)

**Objetivo:** Conectar el frontend a la nueva API sin cambiar la UI.

### T4-01: Cliente de API centralizado

**Archivo:** `kogui-app/src/lib/apiClient.ts`

```typescript
const API_URL = import.meta.env.VITE_API_URL as string;

// Función base con JWT automático
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('nebbi_token');
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Error en la API');
  }
  return res.json();
}

export const api = {
  auth: {
    register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => apiFetch('/auth/me'),
  },
  modules: {
    list: () => apiFetch('/modules'),
  },
  lessons: {
    get: (id: string) => apiFetch(`/lessons/${id}`),
  },
  progress: {
    list: () => apiFetch('/progress'),
    save: (body) => apiFetch('/progress', { method: 'POST', body: JSON.stringify(body) }),
  },
  profile: {
    get: () => apiFetch('/profile'),
    update: (body) => apiFetch('/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  },
};
```

---

### T4-02: Tipos TypeScript para la API propia

**Archivo:** `kogui-app/src/types/api.ts`

```typescript
export interface ApiUser {
  id: string;
  email: string;
  display_name: string;
  role: 'estudiante' | 'admin';
}

export interface ApiModule {
  id: string;
  title: string;
  order_index: number;
  description: string | null;
  lessons: ApiLessonSummary[];
}

export interface ApiLessonSummary {
  id: string;
  title: string;
  order_index: number;
  xp_reward: number;
}

export interface ApiLessonDetail {
  id: string;
  title: string;
  xp_reward: number;
  content: {
    vocab: VocabItem[];
    exercises: Exercise[];
  };
}

export interface ApiProfile {
  display_name: string;
  role: string;
  xp_total: number;
  streak_days: number;
  last_activity: string | null;
}

export interface ApiProgressItem {
  id: string;
  lesson_id: string;
  lesson_title: string;
  completed_at: string;
  score: number;
  xp_earned: number;
}
```

---

### T4-03: AuthContext actualizado

**Archivo:** `kogui-app/src/contexts/AuthContext.tsx`

Cambios:
- `user` es `ApiUser | null` (no `User` de Supabase)
- `signIn` llama a `api.auth.login()` → guarda token en `localStorage`
- `signUp` llama a `api.auth.register()` → guarda token en `localStorage`
- `signOut` borra `nebbi_token` de `localStorage`
- Al montar, si hay `nebbi_token` en `localStorage`, llama a `api.auth.me()` para restaurar la sesión
- `loading` es `false` por defecto, se pone `true` solo durante la verificación del token

---

### T4-04: Variables de entorno del frontend

**Archivo:** `kogui-app/.env.local`
```env
VITE_API_URL=http://localhost:8000
```

**Archivo:** `kogui-app/.env.local.example`
```env
# Backend FastAPI
VITE_API_URL=http://localhost:8000
# En producción: VITE_API_URL=https://nebbi-api.up.railway.app
```

### Verificación Sprint 4

```
✅ npm run build → 0 errores TypeScript
✅ Register funciona en localhost:5173
✅ Login funciona y persiste sesión al recargar
✅ Logout limpia el token
```

---

## Sprint 5 — Frontend: Páginas y flujo completo (2-3 horas)

**Objetivo:** Adaptar todas las páginas que usan Supabase directamente.

### T5-01: Home.tsx

Reemplaza:
```typescript
// ANTES
const { data } = await supabase.from('modules').select(`id, title, ...`);

// DESPUÉS
const data = await api.modules.list();
```

---

### T5-02: LessonPage.tsx

Reemplaza:
```typescript
// ANTES
const { data } = await supabase.from('lessons').select(...).eq('id', id).single();

// DESPUÉS
const data = await api.lessons.get(id);
```

---

### T5-03: ResultScreen.tsx

Reemplaza la llamada de Supabase para guardar progreso:
```typescript
// ANTES
await supabase.from('user_progress').upsert({...});
await supabase.from('profiles').update({ xp_total: ... });

// DESPUÉS
await api.progress.save({ lesson_id, score, xp_earned });
```

---

### T5-04: Profile.tsx

Reemplaza las dos queries de Supabase:
```typescript
// ANTES
await supabase.from('profiles').select(...).eq('id', user.id).single();
await supabase.from('user_progress').select(`..., lessons(title)`).eq('user_id', user.id);

// DESPUÉS
const profile = await api.profile.get();
const { items } = await api.progress.list();
```

---

### T5-05: Eliminar dependencia de Supabase JS

Una vez que todas las páginas usen `apiClient.ts`:
```bash
cd kogui-app
npm uninstall @supabase/supabase-js
```

Esto reduce el bundle de **426 KB → ~280 KB** (ahorro del ~34%).

### Verificación Sprint 5 — Flujo completo

```
✅ Home: muestra módulos y lecciones
✅ Lesson: carga vocab y ejercicios
✅ ResultScreen: guarda progreso, actualiza XP
✅ Profile: muestra XP, racha e historial
✅ npm run build → 0 errores, bundle más liviano
```

---

## Sprint 6 — Despliegue en Producción (1-2 horas)

**Objetivo:** La nueva API corre en Railway y el frontend apunta a ella.

### T6-01: Deploy del backend en Railway

**Pasos:**
1. Ir a [railway.app](https://railway.app) → New Project
2. "Deploy from GitHub repo" → seleccionar `APPLenguajeAlunaIA`
3. Configurar **Root Directory**: `nebbi-api`
4. Agregar variables de entorno en Railway:
   ```
   DATABASE_URL=<connection string de Neon>
   SECRET_KEY=<clave segura de 32+ chars>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   FRONTEND_URL=https://app-lenguaje-aluna-ia-3w1t.vercel.app
   ```
5. Railway detecta Python y usa `railway.json` automáticamente
6. Esperar el primer despliegue (~3 min)

---

### T6-02: Ejecutar migraciones y seed en Railway

```bash
# Desde Railway Shell o localmente apuntando a Neon
alembic upgrade head
python scripts/seed.py
```

---

### T6-03: Actualizar variables en Vercel

En el panel de Vercel → Settings → Environment Variables:
```
VITE_API_URL = https://nebbi-api.up.railway.app
```
(La URL exacta la da Railway después del primer deploy)

Luego: **Redeploy** el proyecto en Vercel.

---

### T6-04: Merge a main

Una vez verificado en producción:
```bash
git checkout main
git merge feature/fastapi-backend
git push origin main
```

### Verificación Sprint 6

```
✅ GET https://nebbi-api.up.railway.app/health → {"status": "ok"}
✅ App en Vercel usa la nueva API
✅ Register, Login, Lecciones y Perfil funcionan en producción
✅ Tiempo de respuesta < 300ms (primera carga) y < 100ms (siguientes)
```

---

## Resumen de Sprints

| Sprint | Foco | Tiempo estimado | Entregable |
|--------|------|-----------------|------------|
| Sprint 0 | Preparación e infraestructura | 1-2 h | Neon + Python listos |
| Sprint 1 | Backend: fundamentos | 2-3 h | FastAPI + BD conectada |
| Sprint 2 | Backend: Auth y contenido | 2-3 h | Login + módulos + lecciones |
| Sprint 3 | Backend: Progreso y perfil | 1-2 h | Flujo de XP completo |
| Sprint 4 | Frontend: apiClient + Auth | 2-3 h | Login integrado con nueva API |
| Sprint 5 | Frontend: páginas | 2-3 h | Flujo completo sin Supabase |
| Sprint 6 | Despliegue en producción | 1-2 h | App en Railway + Vercel |
| **Total** | | **11-18 horas** | **Migración completa** |

---

## Variables de Entorno Completas

### Backend (`nebbi-api/.env`)
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/nebbi?sslmode=require
SECRET_KEY=<32 caracteres aleatorios>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
FRONTEND_URL=https://app-lenguaje-aluna-ia-3w1t.vercel.app
```

### Frontend (`kogui-app/.env.local`)
```env
VITE_API_URL=http://localhost:8000   # desarrollo
# VITE_API_URL=https://nebbi-api.up.railway.app  # producción
```

### Vercel (panel de configuración)
```
VITE_API_URL = https://nebbi-api.up.railway.app
```

---

## Comandos de Referencia Rápida

```bash
# ── Backend ─────────────────────────────────────────────────
cd nebbi-api
python -m venv .venv
.venv\Scripts\activate                    # Windows
pip install -r requirements.txt
cp .env.example .env                      # Completar con credenciales de Neon
alembic upgrade head                      # Crear tablas en Neon
python scripts/seed.py                    # Insertar datos Kogui
uvicorn app.main:app --reload             # Servidor de desarrollo
# → http://localhost:8000/docs            # Swagger UI

# ── Frontend ────────────────────────────────────────────────
cd kogui-app
npm install
npm run dev                               # → http://localhost:5173
npm run build                             # Verificar TypeScript

# ── Git ─────────────────────────────────────────────────────
git status
git add .
git commit -m "feat: sprint X - descripción"
git push origin feature/fastapi-backend
```
