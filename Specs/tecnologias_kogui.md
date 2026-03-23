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

## 🖥️ Backend

- **Spring Boot 3.x:** API REST principal.
- **Spring Security + JWT:** Autenticación y autorización.
- **Spring Data JPA (Hibernate):** Persistencia de datos.
- **Flyway:** Migraciones de base de datos.
- **Spring Batch:** Procesos de sincronización.
- **WebSocket (STOMP):** Sincronización en tiempo real (versión futura).

---

## 🗄️ Base de datos e infraestructura

- **PostgreSQL 16:** Base de datos relacional principal.
- **Redis 7:** Caché y gestión de sesiones.
- **AWS S3 / Cloud Storage:** Almacenamiento de audios e imágenes.
- **Docker + Docker Compose:** Contenedores para desarrollo y despliegue.
- **Railway / Render:** Hosting rápido para prototipos.
- **Firebase Cloud Messaging:** Notificaciones push.

---

## 🤖 Inteligencia Artificial y NLP

- **Python + FastAPI:** Microservicio independiente de IA.
- **Algoritmo SM-2:** Repetición espaciada para aprendizaje.
- **scikit-learn:** Modelos ligeros de recomendación.
- **TensorFlow Lite:** Inferencia local en el dispositivo.
- **Whisper (local):** Reconocimiento de voz para ejercicios de pronunciación (versión futura).

---

# ⚠️ Riesgos y Desafíos del Proyecto

## 🔴 Riesgos altos

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