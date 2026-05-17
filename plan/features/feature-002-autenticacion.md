# Feature 002 — Autenticación de Usuarios (Sprint 1)

| Campo | Valor |
|-------|-------|
| ID | F-002 |
| Sprint | 1 — Auth + Perfil |
| Prioridad MoSCoW | Must |
| Dependencias | F-001 (Infraestructura) |
| Estimación | 9.5 pt |
| CU relacionados | CU-P01, CU-P02, CU-P07 |
| RF relacionados | RF-P01, RF-P02, RF-P03, RF-P04 |

## Descripción

El usuario puede registrarse, iniciar sesión y cerrar sesión. Las rutas están protegidas y los usuarios no autenticados son redirigidos al login.

## Tareas

| ID | Descripción | Tipo | Estimación |
|----|-------------|------|------------|
| T-01-01 | Componente RegisterForm con validación de campos | Frontend | 2 pt |
| T-01-02 | Integrar Supabase Auth: signUp + creación automática de perfil | Backend/DB | 2 pt |
| T-01-03 | Componente LoginForm con manejo de errores | Frontend | 2 pt |
| T-01-04 | Integrar Supabase Auth: signInWithPassword + almacenamiento de sesión | Backend/DB | 1 pt |
| T-01-05 | Hook useAuth: estado de sesión reactivo, loading state, user object | Frontend | 2 pt |
| T-01-06 | ProtectedRoute HOC: redirige a /login si no hay sesión | Frontend | 1 pt |
| T-01-09 | Botón de logout: signOut + redirect a /login | Frontend | 0.5 pt |
| T-01-10 | Layout general: navbar con avatar, nombre y botón perfil/logout | Frontend | 1.5 pt |

## Casos de uso

### CU-P01 — Registrarse
1. Usuario accede a `/register`
2. Ingresa nombre, email y contraseña
3. Supabase Auth crea el usuario
4. Se crea registro en tabla `profiles`
5. Redirige al home

### CU-P02 — Iniciar sesión
1. Usuario accede a `/login`
2. Ingresa email y contraseña
3. Supabase valida credenciales
4. JWT generado y almacenado
5. Redirige al home

### CU-P07 — Cerrar sesión
1. Usuario presiona "Cerrar sesión"
2. Supabase invalida el JWT
3. Redirige a `/login`

## Flujos alternativos
- Email ya registrado → error "El correo ya está en uso"
- Credenciales incorrectas → error "Email o contraseña incorrectos"
- 5 intentos fallidos → bloqueo temporal por Supabase
- Sesión expirada → redirección automática a `/login`

## Criterios de aceptación

1. Registro completo en menos de 2 minutos
2. Perfil aparece en Supabase inmediatamente tras registro
3. Login en menos de 3 segundos con buena conexión
4. Redirección automática si ya hay sesión activa
5. Tras cerrar sesión, rutas protegidas redirigen a `/login`

## Definition of Done

- [ ] RegisterForm funcional con validación
- [ ] LoginForm funcional con manejo de errores
- [ ] useAuth hook implementado y probado
- [ ] ProtectedRoute bloquea rutas no autenticadas
- [ ] Logout funciona y redirige correctamente
- [ ] Layout con navbar responsive
- [ ] Testing manual del flujo completo en Vercel preview
