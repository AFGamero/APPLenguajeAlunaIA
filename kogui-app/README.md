# Kogui App — Prototipo Web

Aplicación web de aprendizaje de la lengua Kogui de la Sierra Nevada de Santa Marta.

**Stack:** React 18 + Vite + TypeScript · Supabase · Vercel

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.local.example .env.local
# → Edita .env.local con tus credenciales de Supabase

# 3. Arrancar servidor de desarrollo
npm run dev
```

La app estará en `http://localhost:5173`.

---

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **Settings → API** y copia:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
3. Pégalos en tu `.env.local`

### Crear tablas + RLS

En **SQL Editor** de Supabase, ejecuta en orden:

```
supabase/migrations/001_initial_schema.sql
supabase/seed/001_seed_data.sql
```

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en localhost:5173 |
| `npm run build` | Build de producción (carpeta `dist/`) |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Linting con ESLint |
| `npm run format` | Formateo con Prettier |

---

## Estructura del proyecto

```
src/
├── contexts/      AuthContext — estado reactivo de sesión
├── hooks/         useAuth — acceso fácil al contexto
├── lib/           supabaseClient.ts — cliente tipado
├── pages/         Home, Login, Register, Profile, Lesson, NotFound
├── router/        AppRouter.tsx — rutas protegidas
├── styles/        tokens.css (design system) + global.css
└── types/         supabase.ts — tipos TypeScript de la DB

supabase/
├── migrations/    001_initial_schema.sql
└── seed/          001_seed_data.sql
```

---

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. En **Settings → Environment Variables**, agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. El build command es `npm run build`, output directory `dist`
4. Vercel detecta automáticamente Vite — sin configuración extra

---

## Sprint actual

- ✅ **Sprint 0** — Infraestructura (Feature 001)
- ⬜ **Sprint 1** — Auth + Perfil (Feature 002)
- ⬜ **Sprint 2** — Lección completa + Persistencia (Feature 003)

---

## Contenido Kogui

El vocabulario incluido en el seed ha sido recopilado con respeto por la tradición oral Kogui.
Todo el contenido debe ser validado por miembros de la comunidad antes de la publicación pública.

> La Sierra Nevada es el corazón del mundo. — Tradición Kogui
