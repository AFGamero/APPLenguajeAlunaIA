# 📘 Casos de Uso — Aplicación de Aprendizaje de Lengua Kogui con IA

## 👤 Estudiante / Usuario

### CU-01 — Registrarse en la app
**Descripción:** El usuario crea una cuenta con nombre, correo y contraseña.

- **Precondición:** No tener cuenta existente.
- **Flujo principal:** Ingresar datos → validar → crear perfil → onboarding inicial.
- **Alternativas:**
    - Email duplicado → mostrar error
    - Sin conexión → registro local
- **Postcondición:** Cuenta creada y perfil inicializado.

---

### CU-02 — Iniciar sesión
**Descripción:** Acceso mediante credenciales.

- **Precondición:** Cuenta registrada.
- **Flujo:** Email + contraseña → autenticación → home.
- **Alternativa:** Modo offline con token cacheado.
- **Postcondición:** Sesión activa.

---

### CU-03 — Realizar una lección
**Descripción:** Acceso a contenido educativo.

- **Precondición:** Sesión activa.
- **Flujo:** Seleccionar lección → completar ejercicios → ver resultado.
- **Alternativa:** Sin audio → mostrar texto.
- **Postcondición:** Progreso actualizado.

---

### CU-04 — Completar ejercicios interactivos
**Descripción:** Responder preguntas educativas.

- **Precondición:** Lección en curso.
- **Flujo:** Mostrar pregunta → responder → evaluar → feedback.
- **Alternativa:** Error → pista → reintento.
- **Postcondición:** Puntuación registrada.

---

### CU-05 — Reproducir audio nativo
**Descripción:** Escuchar pronunciación de hablantes nativos.

- **Precondición:** Audio disponible.
- **Flujo:** Reproducir → repetir.
- **Alternativa:** Sin audio → transcripción.
- **Postcondición:** Reproducción registrada.

---

### CU-06 — Ver progreso de aprendizaje
**Descripción:** Consultar estadísticas personales.

- **Precondición:** Haber completado al menos una lección.
- **Flujo:** Abrir sección → ver métricas.
- **Postcondición:** Ninguna.

---

### CU-07 — Descargar contenido offline
**Descripción:** Guardar módulos para uso sin internet.

- **Precondición:** Conexión disponible.
- **Flujo:** Seleccionar módulo → descargar → guardar localmente.
- **Alternativa:** Espacio insuficiente.
- **Postcondición:** Contenido disponible offline.

---

### CU-08 — Sincronizar progreso con servidor
**Descripción:** Envío automático de datos al backend.

- **Precondición:** Conexión disponible.
- **Flujo:** Detectar red → enviar datos → confirmar.
- **Alternativa:** Conflicto de versión.
- **Postcondición:** Datos actualizados.

---

## 👨‍💻 Administrador del Sistema

### CU-09 — Gestionar usuarios
Crear, editar, suspender o eliminar cuentas.

---

### CU-10 — Gestionar contenido educativo
Crear, editar y publicar lecciones.

---

### CU-11 — Ver métricas del sistema
Acceder a estadísticas de uso.

---

### CU-12 — Configurar el sistema de IA
Ajustar parámetros de personalización.

---

## 🏛️ Experto Lingüístico / Comunidad Kogui

### CU-13 — Validar contenido cultural
Revisar y aprobar material antes de publicarlo.

---

### CU-14 — Aportar grabaciones de audio
Subir pronunciaciones nativas.

---

### CU-15 — Agregar conocimiento cultural
Añadir contexto y notas culturales.

---

### CU-16 — Reportar errores culturales
Informar inconsistencias o problemas.

---

## 🤖 Sistema de Inteligencia Artificial

### CU-17 — Personalizar ruta de aprendizaje
Adaptar lecciones según desempeño.

---

### CU-18 — Aplicar repetición espaciada
Programar revisiones de vocabulario.

---

### CU-19 — Detectar dificultades del estudiante
Identificar áreas débiles.

---

### CU-20 — Generar retroalimentación adaptada
Proveer mensajes personalizados.