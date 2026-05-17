# Feature 010 — Panel de Administración

| Campo | Valor |
|-------|-------|
| ID | F-010 |
| Sprint | 3 — Panel Admin (Prototipo) |
| Prioridad MoSCoW | Must (Para creación de contenido) |
| Dependencias | F-001, F-002 |
| CU relacionados | CU-09, CU-10, CU-11, CU-12 |
| RF relacionados | RF-23, RF-25, RF-26, RF-27, RF-15 |

## Descripción

Panel de administración para gestionar usuarios, contenido educativo, métricas del sistema y configuración del motor de IA.

## Subfeatures

### F-010-A — Gestión de usuarios (CU-09)
- CRUD de usuarios (crear, editar, suspender, eliminar)
- Asignación de roles: estudiante, experto, administrador
- Registro de auditoría de acciones administrativas
- **RF-23, RF-25**

### F-010-B — Constructor de lecciones / CMS (CU-10)
- Interfaz visual tipo builder para crear lecciones
- Bloques modulares: vocabulario, audio, ejercicios
- Arrastrar y soltar componentes
- Guardar borrador y enviar a revisión
- **RF-23, RF-27**

### F-010-C — Métricas del sistema (CU-11)
- Dashboard con estadísticas de uso
- Usuarios activos, lecciones completadas, XP acumulado
- Exportación a CSV
- Filtros por fecha
- **RF-26**

### F-010-D — Configuración de IA (CU-12)
- Ajustar parámetros de personalización
- Pesos de algoritmos (dificultad, repetición espaciada)
- Configuración en caliente (sin reiniciar)
- **RF-15**

## Modelo de datos adicional

### audit_log
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| admin_id | UUID FK → profiles | Administrador |
| action | TEXT | Acción realizada |
| target_type | TEXT | Tipo de recurso |
| target_id | UUID | ID del recurso |
| details | JSONB | Detalles del cambio |
| created_at | TIMESTAMPTZ | Fecha |

## Criterios de aceptación

1. Admin sin conocimientos técnicos crea lección en < 15 minutos
2. Acciones administrativas quedan registradas en audit_log
3. Usuario suspendido no puede iniciar sesión
4. Métricas exportables a CSV
5. Cambios de IA aplicados sin reiniciar sistema

## Definition of Done

- [ ] CRUD de usuarios con roles
- [ ] Constructor visual de lecciones funcional
- [ ] Dashboard de métricas con filtros
- [ ] Exportación a CSV
- [ ] Configuración de IA en caliente
- [ ] Registro de auditoría implementado
