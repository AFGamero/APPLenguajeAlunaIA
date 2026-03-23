# Especificación de Requisitos del Sistema
## Prototipo IA — Lengua Kogui

---

# Requisitos Funcionales (RF)

## 1. Autenticación y usuarios

- **RF-01:** El sistema debe permitir el registro de usuarios con nombre, email y contraseña.
- **RF-02:** El sistema debe autenticar usuarios mediante JWT con refresh token.
- **RF-03:** El sistema debe permitir recuperación de contraseña por correo electrónico.
- **RF-04:** El sistema debe asignar roles: estudiante, experto, administrador.

---

## 2. Lecciones y contenido

- **RF-05:** El sistema debe organizar el contenido en módulos temáticos y lecciones con niveles de dificultad.
- **RF-06:** Cada lección debe incluir vocabulario, audio nativo, imagen ilustrativa y contexto cultural.
- **RF-07:** El sistema debe ofrecer ejercicios de selección múltiple, emparejamiento y escritura.
- **RF-08:** El sistema debe reproducir audio de hablantes nativos con control de velocidad (normal / lento).
- **RF-09:** El sistema debe mostrar transcripción fonética cuando no haya audio disponible.
- **RF-10:** El sistema debe proporcionar retroalimentación inmediata tras cada respuesta.

---

## 3. Progreso y gamificación

- **RF-11:** El sistema debe registrar XP, racha diaria, lecciones completadas y avance por módulo.
- **RF-12:** El sistema debe otorgar insignias por logros alcanzados.
- **RF-13:** El sistema debe enviar recordatorios de práctica mediante notificaciones push.
- **RF-14:** El sistema debe mostrar estadísticas de desempeño semanal y mensual.

---

## 4. Inteligencia artificial

- **RF-15:** El motor de IA debe adaptar la dificultad según el desempeño del usuario.
- **RF-16:** El sistema debe implementar repetición espaciada para la revisión de vocabulario.
- **RF-17:** El sistema debe generar una ruta de aprendizaje personalizada tras un diagnóstico inicial.
- **RF-18:** El sistema debe identificar debilidades del usuario y priorizar contenido de refuerzo.

---

## 5. Offline y sincronización

- **RF-19:** El sistema debe permitir descargar módulos completos para uso sin internet.
- **RF-20:** El progreso offline debe sincronizarse automáticamente al restaurar la conexión.
- **RF-21:** El sistema debe manejar conflictos de sincronización preservando el progreso más reciente.
- **RF-22:** El sistema debe mostrar el estado de conectividad y sincronización.

---

## 6. Administración y validación cultural

- **RF-23:** El administrador debe poder crear, editar y eliminar lecciones, módulos y usuarios.
- **RF-24:** El experto lingüístico debe aprobar o rechazar contenido antes de su publicación.
- **RF-25:** El sistema debe mantener un registro de auditoría de acciones administrativas.
- **RF-26:** El sistema debe proporcionar un panel con métricas de uso y contenido.

---

# Requisitos No Funcionales (RNF)

## 1. Usabilidad

- **RNF-01:** Interfaz intuitiva con curva de aprendizaje menor a 5 minutos.
- **RNF-02:** Diseño accesible para personas con baja alfabetización digital.
- **RNF-03:** Uso de iconografía visual para reducir dependencia del texto.
- **RNF-04:** Modo de alto contraste para accesibilidad visual.

---

## 2. Rendimiento

- **RNF-05:** Tiempo de carga de lecciones menor a 2 segundos con conexión.
- **RNF-06:** Reproducción de audio con latencia imperceptible (< 200 ms).
- **RNF-07:** Sincronización en segundo plano sin afectar la experiencia de usuario.
- **RNF-08:** Compatibilidad con Android 8+ y iOS 13+.

---

## 3. Seguridad

- **RNF-09:** Autenticación mediante JWT con rotación de refresh tokens.
- **RNF-10:** Cifrado AES-256 para datos sensibles almacenados localmente.
- **RNF-11:** Uso obligatorio de HTTPS en todas las comunicaciones.
- **RNF-12:** Protección de datos personales y política de privacidad explícita.

---

## 4. Disponibilidad offline

- **RNF-13:** El contenido descargado debe funcionar completamente sin conexión.
- **RNF-14:** El progreso offline debe persistir incluso tras cierre de la app.
- **RNF-15:** Sincronización automática al detectar conectividad.
- **RNF-16:** Indicador visual del estado de conexión.

---

## 5. Escalabilidad

- **RNF-17:** Backend preparado para soportar al menos 10,000 usuarios concurrentes.
- **RNF-18:** Sistema extensible a otras lenguas indígenas.
- **RNF-19:** API versionada para futuras actualizaciones.

---

## 6. Consideraciones éticas y culturales

- **RNF-20:** Validación obligatoria del contenido por la comunidad kogui.
- **RNF-21:** Propiedad intelectual del contenido pertenece a la comunidad.
- **RNF-22:** Prohibido el uso del contenido para entrenar IA externa sin consentimiento.
- **RNF-23:** Posibilidad de marcar contenido como restringido según normas culturales.

---