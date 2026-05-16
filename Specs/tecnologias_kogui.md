# Tecnologías y Riesgos — Prototipo IA Lengua Kogui

---

# 🧩 Stack Tecnológico

## 📱 Frontend móvil

- **Flutter 3.x:** Desarrollo multiplataforma para Android e iOS.
- **Riverpod 2.x:** Gestión de estado reactiva.
- **GoRouter:** Navegación declarativa.
- **Drift (SQLite):** Base de datos local para modo offline.
- **Just Audio:** Reproducción de audio nativo.
- **Connectivity Plus:** Detección de conectividad en tiempo real.
- **flutter_secure_storage:** Almacenamiento seguro de tokens (JWT).
- **Lottie:** Animaciones para gamificación.

---

## 🖥️ Backend (FastAPI / Serverless)

- **FastAPI:** API REST principal (Rápida, tipado estático, ideal para Vercel Serverless Functions).
- **Pydantic:** Validación de datos y esquemas.
- **SQLAlchemy / SQLModel:** ORM para persistencia de datos.
- **Alembic:** Migraciones de base de datos.
- **PyJWT & Passlib:** Autenticación y encriptación de contraseñas.
- **Background Tasks:** Tareas en segundo plano ligeras provistas por FastAPI.

---

## 🗄️ Base de datos e infraestructura (Capa Gratuita / Prototipo)

- **Neon o Supabase Database:** PostgreSQL Serverless con capa gratuita ideal para prototipos.
- **Upstash Redis:** Caché y gestión de sesiones Serverless (capa gratuita en Vercel).
- **Vercel Blob o Supabase Storage:** Almacenamiento gratuito de audios e imágenes sin costo inicial.
- **Vercel Hosting:** Despliegue de funciones serverless (Python) a coste cero.
- **Firebase Cloud Messaging:** Notificaciones push.

---

## 🤖 Inteligencia Artificial y NLP (Integrada)

*Al ser un backend en Python, la IA se integra directamente en la misma API sin requerir microservicios adicionales, reduciendo complejidad para el prototipo.*
- **Integración Directa:** Lógica de IA y NLP convive con el backend en FastAPI.
- **Algoritmo SM-2:** Repetición espaciada para aprendizaje.
- **scikit-learn:** Modelos ligeros de recomendación.
- **TensorFlow Lite:** Inferencia local en el dispositivo (móvil).
- **Whisper (local):** Reconocimiento de voz para ejercicios de pronunciación (versión futura).

---

# ⚠️ Riesgos y Desafíos del Proyecto

## 🔴 Riesgos altos

### Limitaciones de Serverless en Vercel (Prototipo)
Las funciones gratuitas tienen un límite de tiempo de ejecución (10s) y un límite de tamaño de empaquetado (250MB), lo cual puede ser restrictivo si se usan bibliotecas de IA muy pesadas.

**Mitigación:**
- Usar versiones ligeras de librerías.
- Pre-calcular modelos o realizar inferencia del lado del cliente (TensorFlow Lite).
- Optimizar consultas pesadas.

---

### Acceso a la comunidad kogui
La comunidad puede no permitir el acceso o retirar su colaboración.

**Mitigación:**
- Involucrar líderes comunitarios desde el inicio
- Acuerdos de colaboración formales
- Participación activa de la comunidad

---

### Escasez de hablantes nativos
Número limitado de hablantes activos para grabación de audios.

**Mitigación:**
- Talleres de grabación con hablantes mayores
- Priorizar vocabulario esencial
- Crear archivo digital sostenible

---

### Complejidad de sincronización offline
La sincronización bidireccional es técnicamente compleja.

**Mitigación:**
- Arquitectura offline-first
- Cola local de eventos
- Pruebas exhaustivas

---

### Exactitud lingüística del contenido
Errores pueden enseñar información incorrecta o generar conflictos culturales.

**Mitigación:**
- Validación por lingüistas y líderes culturales
- Aprobación obligatoria antes de publicación
- Sistema de reporte de errores

---

## 🟠 Riesgos medios

### Limitaciones del NLP para lengua kogui
No existen modelos preentrenados adecuados.

**Mitigación:**
- Uso de audio grabado por nativos en el MVP
- Entrenamiento futuro con datos propios

---

### Conectividad limitada
Zonas de la Sierra Nevada tienen acceso muy restringido a internet.

**Mitigación:**
- Diseño offline desde el inicio
- Descarga completa de módulos
- Pruebas en campo

---

### Dispositivos de gama baja
Usuarios potenciales pueden tener smartphones con pocos recursos.

**Mitigación:**
- Optimización para Android 8+
- Audio comprimido
- Pruebas en dispositivos económicos

---

### Sostenibilidad del proyecto
Riesgo de abandono tras la fase académica.

**Mitigación:**
- Documentación completa
- Transferencia a institución u ONG
- Posible liberación como software open-source

---

### Propiedad intelectual del contenido
Conflictos sobre la titularidad del material cultural.

**Mitigación:**
- Acuerdo legal claro
- Propiedad para la comunidad
- Licencias adecuadas

---

## 🟢 Riesgos bajos

### Adopción tecnológica limitada
Personas mayores pueden no usar smartphones con facilidad.

**Mitigación:**
- Interfaz simple e intuitiva
- Uso de iconos visuales
- Talleres de alfabetización digital
- Enfoque inicial en jóvenes

---

# 📌 Conclusión

El proyecto combina tecnologías modernas con un enfoque social y cultural sensible.  
La identificación temprana de riesgos permite diseñar estrategias que aumenten la viabilidad y el impacto positivo del prototipo.