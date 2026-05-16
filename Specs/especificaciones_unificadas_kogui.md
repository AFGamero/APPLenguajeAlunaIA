# 📘 Especificaciones Unificadas — Aplicación de Aprendizaje de Lengua Kogui con IA

| Versión | Fecha       | Autor | Cambios realizados |
|---------|-------------|-------|---------------------|
| 2.0     | 2026-05-16  | Equipo | Unificación, estandarización de CU, adición de criterios de aceptación, nuevos requisitos, glosario y matriz de trazabilidad |

---

## Glosario de términos

- **XP (Experience Points):** Puntos de experiencia que acumula el usuario por completar actividades.
- **Racha diaria:** Número de días consecutivos en que el usuario realiza al menos una lección.
- **Repetición espaciada:** Técnica de revisión de vocabulario en intervalos crecientes para optimizar la memoria.
- **JWT (JSON Web Token):** Token de autenticación usado para mantener sesiones seguras.
- **Módulo:** Conjunto de lecciones agrupadas por tema o nivel.
- **Lección:** Unidad mínima de contenido educativo con vocabulario, ejercicios y audio.
- **Audio nativo:** Grabación de un hablante Kogui auténtico.
- **Validador cultural:** Experto lingüístico o miembro de la comunidad Kogui que aprueba el contenido.

---

## 👤 Estudiante / Usuario

### CU-01 — Registrarse en la app

**Descripción:** El usuario crea una cuenta con nombre, correo y contraseña.

- **Precondición:** No tener cuenta existente.
- **Flujo principal:** Ingresar datos → validar → crear perfil → onboarding inicial.
- **Alternativas:**
  - Email duplicado → mostrar error.
  - Sin conexión → registro local (se completa cuando hay red).
- **Postcondición:** Cuenta creada y perfil inicializado.
- **Criterios de aceptación:**
  - El usuario puede registrarse en menos de 2 minutos.
  - Los datos se almacenan de forma segura.
- **Requisitos Funcionales (RF):**
  - **RF-01:** El sistema debe permitir el registro de usuarios con nombre, email y contraseña.
  - **RF-04:** El sistema debe asignar roles: estudiante, experto, administrador.
- **Requisitos No Funcionales (RNF):**
  - **RNF-01:** Interfaz intuitiva con curva de aprendizaje menor a 5 minutos.
  - **RNF-02:** Diseño accesible para personas con baja alfabetización digital.
  - **RNF-09:** Autenticación mediante JWT con rotación de refresh tokens.
  - **RNF-11:** Uso obligatorio de HTTPS en todas las comunicaciones.
  - **RNF-12:** Protección de datos personales y política de privacidad explícita.

---

### CU-02 — Iniciar sesión

**Descripción:** Acceso mediante credenciales.

- **Precondición:** Cuenta registrada.
- **Flujo principal:** Email + contraseña → autenticación → home.
- **Alternativa:** Modo offline con token cacheado (solo si se ha iniciado sesión previamente).
- **Postcondición:** Sesión activa.
- **Criterios de aceptación:**
  - El usuario accede en menos de 3 segundos con buena conexión.
  - Tras 5 intentos fallidos, se bloquea temporalmente.
- **Requisitos Funcionales (RF):**
  - **RF-02:** El sistema debe autenticar usuarios mediante JWT con refresh token.
  - **RF-03:** El sistema debe permitir recuperación de contraseña por correo electrónico.
- **Requisitos No Funcionales (RNF):**
  - **RNF-09:** Autenticación mediante JWT con rotación de refresh tokens.
  - **RNF-11:** Uso obligatorio de HTTPS en todas las comunicaciones.

---

### CU-03 — Realizar una lección

**Descripción:** Acceso a contenido educativo.

- **Precondición:** Sesión activa.
- **Flujo principal:** Seleccionar lección → completar ejercicios → ver resultado.
- **Alternativa:** Sin audio → mostrar transcripción fonética.
- **Postcondición:** Progreso actualizado.
- **Criterios de aceptación:**
  - El usuario puede completar una lección de principio a fin sin errores técnicos.
  - El progreso se refleja en la base de datos en menos de 5 segundos.
- **Requisitos Funcionales (RF):**
  - **RF-05:** El sistema debe organizar el contenido en módulos temáticos y lecciones con niveles de dificultad.
  - **RF-06:** Cada lección debe incluir vocabulario, audio nativo, imagen ilustrativa y contexto cultural.
- **Requisitos No Funcionales (RNF):**
  - **RNF-03:** Uso de iconografía visual para reducir dependencia del texto.
  - **RNF-05:** Tiempo de carga de lecciones menor a 2 segundos con conexión.
  - **RNF-13:** El contenido descargado debe funcionar completamente sin conexión.

---

### CU-04 — Completar ejercicios interactivos

**Descripción:** Responder preguntas educativas.

- **Precondición:** Lección en curso.
- **Flujo principal:** Mostrar pregunta → responder → evaluar → feedback.
- **Alternativa:** Error → pista (opcional) → reintento.
- **Postcondición:** Puntuación registrada.
- **Criterios de aceptación:**
  - El usuario recibe retroalimentación inmediata (menos de 1 segundo).
  - Las pistas están disponibles tras el primer error.
- **Requisitos Funcionales (RF):**
  - **RF-07:** El sistema debe ofrecer ejercicios de selección múltiple, emparejamiento y escritura.
  - **RF-10:** El sistema debe proporcionar retroalimentación inmediata tras cada respuesta.
  - **RF-29:** El sistema debe ofrecer una pista opcional después de un primer error en un ejercicio.
- **Requisitos No Funcionales (RNF):**
  - **RNF-01:** Interfaz intuitiva con curva de aprendizaje menor a 5 minutos.

---

### CU-05 — Reproducir audio nativo

**Descripción:** Escuchar pronunciación de hablantes nativos.

- **Precondición:** Audio disponible.
- **Flujo principal:** Reproducir → repetir.
- **Alternativa:** Sin audio → mostrar transcripción fonética (IPA si está disponible).
- **Postcondición:** Reproducción registrada (para métricas).
- **Criterios de aceptación:**
  - El audio se inicia en menos de 200 ms.
  - El control de velocidad permite 0.5x, 1x, 1.5x y 2x.
- **Requisitos Funcionales (RF):**
  - **RF-08:** El sistema debe reproducir audio de hablantes nativos con control de velocidad (normal / lento).
  - **RF-09:** El sistema debe mostrar transcripción fonética cuando no haya audio disponible.
  - **RF-30:** El reproductor de audio debe incluir control de velocidad (0.5x, 1x, 1.5x, 2x).
- **Requisitos No Funcionales (RNF):**
  - **RNF-06:** Reproducción de audio con latencia imperceptible (< 200 ms).

---

### CU-06 — Ver progreso de aprendizaje

**Descripción:** Consultar estadísticas personales.

- **Precondición:** Haber completado al menos una lección.
- **Flujo principal:** Abrir sección → ver métricas (XP, racha, lecciones, insignias).
- **Postcondición:** Ninguna.
- **Criterios de aceptación:**
  - Las métricas se actualizan en tiempo real tras completar una lección.
  - Las insignias se otorgan automáticamente al cumplir los logros.
- **Requisitos Funcionales (RF):**
  - **RF-11:** El sistema debe registrar XP, racha diaria, lecciones completadas y avance por módulo.
  - **RF-12:** El sistema debe otorgar insignias por logros alcanzados.
  - **RF-14:** El sistema debe mostrar estadísticas de desempeño semanal y mensual.
- **Requisitos No Funcionales (RNF):**
  - **RNF-01:** Interfaz intuitiva con curva de aprendizaje menor a 5 minutos.

---

### CU-07 — Descargar contenido offline

**Descripción:** Guardar módulos para uso sin internet.

- **Precondición:** Conexión disponible.
- **Flujo principal:** Seleccionar módulo → descargar → guardar localmente.
- **Alternativa:** Espacio insuficiente → mostrar advertencia y cancelar.
- **Postcondición:** Contenido disponible offline.
- **Criterios de aceptación:**
  - Un módulo completo de 50 MB se descarga en menos de 3 minutos con Wi-Fi.
  - El contenido offline se abre sin necesidad de conexión.
- **Requisitos Funcionales (RF):**
  - **RF-19:** El sistema debe permitir descargar módulos completos para uso sin internet.
- **Requisitos No Funcionales (RNF):**
  - **RNF-07:** Sincronización en segundo plano sin afectar la experiencia de usuario.
  - **RNF-10:** Cifrado AES-256 para datos sensibles almacenados localmente.
  - **RNF-13:** El contenido descargado debe funcionar completamente sin conexión.

---

### CU-08 — Sincronizar progreso con servidor

**Descripción:** Envío automático de datos al backend.

- **Precondición:** Conexión disponible.
- **Flujo principal:** Detectar red → enviar datos → confirmar.
- **Alternativa:** Conflicto de versión → resolver preservando el progreso más reciente.
- **Postcondición:** Datos actualizados.
- **Criterios de aceptación:**
  - La sincronización ocurre sin intervención del usuario.
  - El progreso offline nunca se pierde al cerrar la app.
- **Requisitos Funcionales (RF):**
  - **RF-20:** El progreso offline debe sincronizarse automáticamente al restaurar la conexión.
  - **RF-21:** El sistema debe manejar conflictos de sincronización preservando el progreso más reciente.
  - **RF-22:** El sistema debe mostrar el estado de conectividad y sincronización.
- **Requisitos No Funcionales (RNF):**
  - **RNF-07:** Sincronización en segundo plano sin afectar la experiencia de usuario.
  - **RNF-14:** El progreso offline debe persistir incluso tras cierre de la app.
  - **RNF-15:** Sincronización automática al detectar conectividad.
  - **RNF-16:** Indicador visual del estado de conexión.

---

## 👨‍💻 Administrador del Sistema

### CU-09 — Gestionar usuarios

**Descripción:** Crear, editar, suspender o eliminar cuentas.

- **Precondición:** Sesión de administrador activa.
- **Flujo principal:** Buscar usuario → seleccionar acción → confirmar → auditar.
- **Alternativa:** Intentar eliminar su propia cuenta → bloqueado.
- **Postcondición:** La base de datos refleja los cambios.
- **Criterios de aceptación:**
  - Las acciones quedan registradas en el log de auditoría.
  - Un usuario suspendido no puede iniciar sesión.
- **Requisitos Funcionales (RF):**
  - **RF-23:** El administrador debe poder crear, editar y eliminar lecciones, módulos y usuarios.
  - **RF-25:** El sistema debe mantener un registro de auditoría de acciones administrativas.

---

### CU-10 — Creación Dinámica de Lecciones (Gestor de Contenido)

**Descripción:** El administrador utiliza una interfaz visual (builder) para ensamblar nuevas lecciones de forma dinámica (agregando bloques de texto, audio, y ejercicios interactivos) sin necesidad de escribir código.

- **Precondición:** Sesión de administrador activa.
- **Flujo principal:** Seleccionar módulo → crear nueva lección → arrastrar/añadir componentes (vocabulario, audios nativos, preguntas) → guardar borrador → enviar a revisión lingüística.
- **Alternativas:**
  - Falta de campos obligatorios → mostrar alerta.
- **Postcondición:** Lección creada y en estado "Pendiente de Validación".
- **Criterios de aceptación:**
  - Un administrador sin conocimientos técnicos puede crear una lección en menos de 15 minutos.
  - El constructor permite añadir al menos 5 tipos de componentes.
- **Requisitos Funcionales (RF):**
  - **RF-23:** El administrador debe poder crear, editar y eliminar lecciones mediante un sistema de gestión dinámica modular (CMS).
  - **RF-25:** El sistema debe mantener un registro de auditoría de acciones administrativas.
  - **RF-27:** El sistema debe proporcionar un constructor visual para ensamblar ejercicios y contenido multimedia de forma modular.
- **Requisitos No Funcionales (RNF):**
  - **RNF-01:** Interfaz intuitiva y fácil de usar para administradores no técnicos.
- **Requisitos de Dominio (RD):**
  - **RD-01:** El contenido creado debe pasar por un flujo de aprobación (Expertos Lingüísticos) antes de publicarse.

---

### CU-11 — Ver métricas del sistema

**Descripción:** Acceder a estadísticas de uso.

- **Precondición:** Sesión de administrador activa.
- **Flujo principal:** Seleccionar panel → filtrar por fecha → visualizar gráficos.
- **Postcondición:** Ninguna.
- **Criterios de aceptación:**
  - Las métricas se actualizan al menos cada hora.
  - Se pueden exportar a CSV.
- **Requisitos Funcionales (RF):**
  - **RF-26:** El sistema debe proporcionar un panel con métricas de uso y contenido.

---

### CU-12 — Configurar el sistema de IA

**Descripción:** Ajustar parámetros de personalización.

- **Precondición:** Sesión de administrador activa.
- **Flujo principal:** Acceder a configuración → modificar pesos de algoritmos (dificultad, repetición espaciada) → guardar.
- **Postcondición:** Nuevos parámetros activos.
- **Criterios de aceptación:** Los cambios se aplican sin reiniciar el sistema.
- **Requisitos Funcionales (RF):**
  - **RF-15:** El motor de IA debe adaptar la dificultad según el desempeño del usuario.

---

## 🏛️ Experto Lingüístico / Comunidad Kogui

### CU-13 — Validar contenido cultural

**Descripción:** Revisar y aprobar material antes de publicarlo.

- **Precondición:** Sesión de experto activa, contenido pendiente.
- **Flujo principal:** Ver lección → revisar componentes → aprobar o rechazar con comentarios.
- **Alternativa:** Rechazar → notificar al administrador.
- **Postcondición:** La lección cambia a "Publicada" o "Rechazada".
- **Criterios de aceptación:** El contenido no se publica sin una validación explícita.
- **Requisitos Funcionales (RF):**
  - **RF-24:** El experto lingüístico debe aprobar o rechazar contenido antes de su publicación.
- **Requisitos de Dominio (RD):**
  - **RD-01:** Validación obligatoria del contenido por la comunidad kogui.
  - **RD-02:** Propiedad intelectual del contenido pertenece a la comunidad.
  - **RD-04:** Posibilidad de marcar contenido como restringido según normas culturales.

---

### CU-14 — Aportar grabaciones de audio

**Descripción:** Subir pronunciaciones nativas.

- **Precondición:** Sesión de experto activa.
- **Flujo principal:** Seleccionar palabra/frase → subir archivo → etiquetar → enviar.
- **Postcondición:** Audio disponible para asociar a lecciones.
- **Criterios de aceptación:** El audio se indexa y puede ser usado por el constructor de lecciones.
- **Requisitos Funcionales (RF):**
  - **RF-06:** Cada lección debe incluir vocabulario, audio nativo, imagen ilustrativa y contexto cultural.
- **Requisitos de Dominio (RD):**
  - **RD-02:** Propiedad intelectual del contenido pertenece a la comunidad.

---

### CU-15 — Agregar conocimiento cultural

**Descripción:** Añadir contexto y notas culturales.

- **Precondición:** Sesión de experto activa.
- **Flujo principal:** Seleccionar lección → añadir texto/imagen cultural → guardar.
- **Postcondición:** El contenido cultural queda vinculado a la lección.
- **Criterios de aceptación:** Las notas culturales se muestran en la lección correspondiente.
- **Requisitos Funcionales (RF):**
  - **RF-06:** Cada lección debe incluir vocabulario, audio nativo, imagen ilustrativa y contexto cultural.
- **Requisitos de Dominio (RD):**
  - **RD-01:** Validación obligatoria del contenido por la comunidad kogui.

---

### CU-16 — Reportar errores culturales

**Descripción:** Informar inconsistencias o problemas.

- **Precondición:** Sesión de experto o usuario autenticado.
- **Flujo principal:** Seleccionar contenido → abrir reporte → describir error → enviar.
- **Postcondición:** Se crea un ticket en el sistema de moderación.
- **Criterios de aceptación:** El reporte llega al administrador y al experto asignado.
- **Requisitos Funcionales (RF):**
  - **RF-28:** El sistema debe permitir al usuario reportar errores culturales o lingüísticos.
- **Requisitos de Dominio (RD):**
  - **RD-01:** Validación obligatoria del contenido por la comunidad kogui.

---

## 🤖 Módulo de IA (automático)

### CU-17 — Personalizar ruta de aprendizaje

**Descripción:** Adaptar lecciones según desempeño.

- **Precondición:** El usuario ha completado al menos 3 lecciones.
- **Disparador automático:** Al terminar una lección o al inicio de sesión.
- **Flujo principal:** Evaluar desempeño → ajustar dificultad → recomendar siguiente lección.
- **Postcondición:** La ruta de aprendizaje del usuario queda actualizada.
- **Criterios de aceptación:** La recomendación tiene una precisión mínima del 70% medida por éxito del usuario.
- **Requisitos Funcionales (RF):**
  - **RF-15:** El motor de IA debe adaptar la dificultad según el desempeño del usuario.
  - **RF-17:** El sistema debe generar una ruta de aprendizaje personalizada tras un diagnóstico inicial.

---

### CU-18 — Aplicar repetición espaciada

**Descripción:** Programar revisiones de vocabulario.

- **Precondición:** El usuario ha aprendido al menos 5 palabras.
- **Disparador automático:** Diariamente (basado en algoritmo SM-2).
- **Flujo principal:** Seleccionar palabras vencidas → presentar ejercicio de repaso → actualizar intervalo.
- **Postcondición:** Las palabras se programan para próxima revisión.
- **Criterios de aceptación:** El algoritmo respeta los intervalos calculados (ej. 1, 3, 7, 14 días).
- **Requisitos Funcionales (RF):**
  - **RF-16:** El sistema debe implementar repetición espaciada para la revisión de vocabulario.

---

### CU-19 — Detectar dificultades del estudiante

**Descripción:** Identificar áreas débiles.

- **Precondición:** El usuario ha completado al menos 10 ejercicios.
- **Disparador automático:** Cada 5 respuestas incorrectas.
- **Flujo principal:** Analizar patrones de error → identificar categorías problemáticas → priorizar contenido de refuerzo.
- **Postcondición:** Se genera una lista de ítems recomendados para repaso.
- **Criterios de aceptación:** La detección tiene una tasa de acierto > 80% (comparada con evaluación experta).
- **Requisitos Funcionales (RF):**
  - **RF-18:** El sistema debe identificar debilidades del usuario y priorizar contenido de refuerzo.

---

### CU-20 — Generar retroalimentación adaptada

**Descripción:** Proveer mensajes personalizados.

- **Precondición:** El usuario acaba de responder un ejercicio.
- **Disparador automático:** Inmediatamente después de evaluar la respuesta.
- **Flujo principal:** Evaluar respuesta → seleccionar plantilla de feedback según error/tipo de acierto → personalizar → mostrar.
- **Postcondición:** El usuario recibe retroalimentación específica.
- **Criterios de aceptación:** El feedback no es genérico; menciona el error concreto.
- **Requisitos Funcionales (RF):**
  - **RF-10:** El sistema debe proporcionar retroalimentación inmediata tras cada respuesta.
  - **RF-18:** El sistema debe identificar debilidades del usuario y priorizar contenido de refuerzo.

---

## Requisitos funcionales completos (RF)

| ID     | Descripción |
|--------|-------------|
| RF-01  | El sistema debe permitir el registro de usuarios con nombre, email y contraseña. |
| RF-02  | El sistema debe autenticar usuarios mediante JWT con refresh token. |
| RF-03  | El sistema debe permitir recuperación de contraseña por correo electrónico. |
| RF-04  | El sistema debe asignar roles: estudiante, experto, administrador. |
| RF-05  | El sistema debe organizar el contenido en módulos temáticos y lecciones con niveles de dificultad. |
| RF-06  | Cada lección debe incluir vocabulario, audio nativo, imagen ilustrativa y contexto cultural. |
| RF-07  | El sistema debe ofrecer ejercicios de selección múltiple, emparejamiento y escritura. |
| RF-08  | El sistema debe reproducir audio de hablantes nativos con control de velocidad (normal / lento). |
| RF-09  | El sistema debe mostrar transcripción fonética cuando no haya audio disponible. |
| RF-10  | El sistema debe proporcionar retroalimentación inmediata tras cada respuesta. |
| RF-11  | El sistema debe registrar XP, racha diaria, lecciones completadas y avance por módulo. |
| RF-12  | El sistema debe otorgar insignias por logros alcanzados. |
| RF-14  | El sistema debe mostrar estadísticas de desempeño semanal y mensual. |
| RF-15  | El motor de IA debe adaptar la dificultad según el desempeño del usuario. |
| RF-16  | El sistema debe implementar repetición espaciada para la revisión de vocabulario. |
| RF-17  | El sistema debe generar una ruta de aprendizaje personalizada tras un diagnóstico inicial. |
| RF-18  | El sistema debe identificar debilidades del usuario y priorizar contenido de refuerzo. |
| RF-19  | El sistema debe permitir descargar módulos completos para uso sin internet. |
| RF-20  | El progreso offline debe sincronizarse automáticamente al restaurar la conexión. |
| RF-21  | El sistema debe manejar conflictos de sincronización preservando el progreso más reciente. |
| RF-22  | El sistema debe mostrar el estado de conectividad y sincronización. |
| RF-23  | El administrador debe poder crear, editar y eliminar lecciones, módulos y usuarios. |
| RF-24  | El experto lingüístico debe aprobar o rechazar contenido antes de su publicación. |
| RF-25  | El sistema debe mantener un registro de auditoría de acciones administrativas. |
| RF-26  | El sistema debe proporcionar un panel con métricas de uso y contenido. |
| RF-27  | El sistema debe proporcionar un constructor visual para ensamblar ejercicios y contenido multimedia de forma modular. |
| RF-28  | El sistema debe permitir al usuario reportar errores culturales o lingüísticos. |
| RF-29  | El sistema debe ofrecer una pista opcional después de un primer error en un ejercicio. |
| RF-30  | El reproductor de audio debe incluir control de velocidad (0.5x, 1x, 1.5x, 2x). |

---

## Requisitos No Funcionales (RNF)

| ID     | Descripción |
|--------|-------------|
| RNF-01 | Interfaz intuitiva con curva de aprendizaje menor a 5 minutos. |
| RNF-02 | Diseño accesible para personas con baja alfabetización digital. |
| RNF-03 | Uso de iconografía visual para reducir dependencia del texto. |
| RNF-05 | Tiempo de carga de lecciones menor a 2 segundos con conexión. |
| RNF-06 | Reproducción de audio con latencia imperceptible (< 200 ms). |
| RNF-07 | Sincronización en segundo plano sin afectar la experiencia de usuario. |
| RNF-09 | Autenticación mediante JWT con rotación de refresh tokens. |
| RNF-10 | Cifrado AES-256 para datos sensibles almacenados localmente. |
| RNF-11 | Uso obligatorio de HTTPS en todas las comunicaciones. |
| RNF-12 | Protección de datos personales y política de privacidad explícita. |
| RNF-13 | El contenido descargado debe funcionar completamente sin conexión. |
| RNF-14 | El progreso offline debe persistir incluso tras cierre de la app. |
| RNF-15 | Sincronización automática al detectar conectividad. |
| RNF-16 | Indicador visual del estado de conexión. |
| RNF-24 | El sistema debe soportar al menos 1000 usuarios concurrentes sin degradación significativa. |
| RNF-25 | El motor de IA debe responder en menos de 1 segundo para recomendaciones. |
| RNF-26 | La aplicación debe funcionar en Android 8+ y iOS 13+. |

---

## Requisitos de Dominio / Culturales (RD)

| ID     | Descripción |
|--------|-------------|
| RD-01  | Validación obligatoria del contenido por la comunidad kogui (flujo de aprobación). |
| RD-02  | Propiedad intelectual del contenido pertenece a la comunidad. |
| RD-04  | Posibilidad de marcar contenido como restringido según normas culturales. |

---

## Matriz de trazabilidad (CU vs RF)

| CU   | RF relacionados |
|------|----------------|
| CU-01 | RF-01, RF-04 |
| CU-02 | RF-02, RF-03 |
| CU-03 | RF-05, RF-06 |
| CU-04 | RF-07, RF-10, RF-29 |
| CU-05 | RF-08, RF-09, RF-30 |
| CU-06 | RF-11, RF-12, RF-14 |
| CU-07 | RF-19 |
| CU-08 | RF-20, RF-21, RF-22 |
| CU-09 | RF-23, RF-25 |
| CU-10 | RF-23, RF-25, RF-27 |
| CU-11 | RF-26 |
| CU-12 | RF-15 |
| CU-13 | RF-24 |
| CU-14 | RF-06 |
| CU-15 | RF-06 |
| CU-16 | RF-28 |
| CU-17 | RF-15, RF-17 |
| CU-18 | RF-16 |
| CU-19 | RF-18 |
| CU-20 | RF-10, RF-18 |

---

*Fin del documento*