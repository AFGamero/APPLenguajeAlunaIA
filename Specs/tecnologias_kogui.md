# Tecnologías y Riesgos — Prototipo Web Lengua Kogui

---

# 🧩 Stack Tecnológico (Prototipo Web)

Basado en la planificación del prototipo (`plan/kogui_prototipo_planificacion_v1.md`). El stack completo del sistema final (Flutter + FastAPI + microservicios) se define en la fase posterior.

---

## 🖥️ Frontend Web

- **React 18 + Vite:** Framework frontend con build rápido, desplegado en Vercel sin costo.
- **TypeScript:** Tipado estático para mayor robustez y mantenibilidad.
- **React Router v6:** Navegación SPA con rutas protegidas.
- **supabase-js:** Cliente oficial de Supabase para autenticación y consultas en tiempo real.
- **CSS Variables / Módulos CSS:** Sistema de diseño propio con tokens de colores, tipografía y espaciado.
- **Web Speech API:** Síntesis de voz como fallback cuando no hay audio nativo disponible en Storage.

---

## 🗄️ Backend y Base de Datos (Supabase)

*Sin servidor propio. Supabase cubre backend, base de datos, autenticación y almacenamiento.*

- **Supabase Auth:** Registro, login, JWT, RLS (Row Level Security). Manejo completo de sesiones.
- **Supabase Database (PostgreSQL):** Base de datos relacional con las tablas: `profiles`, `modules`, `lessons`, `user_progress`. Políticas RLS para aislamiento por usuario.
- **Supabase Storage:** Almacenamiento de archivos de audio nativo (MP3/WebM).
- **SQL (RLS Policies):** Reglas de seguridad a nivel de fila para garantizar que cada usuario solo accede a sus propios datos.

---

## 🚀 Despliegue e Infraestructura

- **Vercel:** Hosting del frontend SPA con deploys automáticos desde GitHub. Preview URLs por PR. Sin costo en capa gratuita.
- **GitHub:** Repositorio de código fuente con control de versiones.
- **ESLint + Prettier:** Calidad de código y formateo automático.

---

## ❌ Excluido del prototipo (futuras fases)

| Tecnología | Fase futura |
|------------|-------------|
| Flutter / React Native | App móvil nativa |
| FastAPI + Pydantic + SQLAlchemy | Backend serverless propio |
| Algoritmo SM-2 / scikit-learn | Módulo de IA y personalización |
| TensorFlow Lite / Whisper | Inferencia en dispositivo |
| IndexedDB / Drift (SQLite) | Modo offline |
| Upstash Redis | Caché y sesiones |
| Firebase Cloud Messaging | Notificaciones push |
| Lottie | Animaciones avanzadas |

---

# ⚠️ Riesgos y Desafíos del Prototipo

## 🔴 Riesgos altos

### Dependencia de conectividad a internet
El prototipo no tiene modo offline. Usuarios en zonas de la Sierra Nevada con conectividad limitada no podrán usarlo.

**Mitigación:**
- El prototipo es una validación inicial; el sistema completo incluirá offline-first.
- Priorizar pruebas en entornos con conexión estable.

### Contenido cultural sensible
El material educativo (vocabulario, audios, notas culturales) debe ser respetuoso con la comunidad Kogui.

**Mitigación:**
- Todo el contenido debe ser validado por miembros de la comunidad antes de publicarse.
- Incluir atribución y reconocimiento de propiedad intelectual.

---

## 🟠 Riesgos medios

### Limitaciones de Supabase Storage (capa gratuita)
Almacenamiento limitado en la capa gratuita (1 GB). Suficiente para audios del prototipo pero escalable mediante upgrade.

**Mitigación:**
- Comprimir audios (MP3 128kbps).
- Usar Web Speech API como fallback para minimizar Storage.

### Escasez de hablantes nativos para grabaciones
Número limitado de hablantes activos para grabación de audios auténticos.

**Mitigación:**
- Talleres de grabación con hablantes mayores.
- Priorizar vocabulario esencial para las 3 lecciones del prototipo.
- Usar síntesis de voz como fallback temporal.

---

## 🟢 Riesgos bajos

### Adopción tecnológica limitada
Usuarios mayores pueden no estar familiarizados con aplicaciones web.

**Mitigación:**
- Interfaz simple con iconografía visual.
- Feedback inmediato en cada interacción.
- Curva de aprendizaje menor a 5 minutos.

### Sostenibilidad del proyecto
Riesgo de abandono tras la fase académica.

**Mitigación:**
- Documentación completa del prototipo.
- Código modular y extensible para facilitar migración futura.
- Posible liberación como software open-source.

---

# 📌 Conclusión

El prototipo web con **React (Vite) + Supabase + Vercel** minimiza costos de infraestructura y acelera la validación del flujo de aprendizaje. Las tecnologías del sistema completo (FastAPI, Flutter, IA, offline) se adoptarán en fases posteriores según los aprendizajes de este prototipo.
