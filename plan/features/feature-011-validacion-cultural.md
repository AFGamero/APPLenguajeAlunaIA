# Feature 011 — Validación Cultural y Comunitaria

| Campo | Valor |
|-------|-------|
| ID | F-011 |
| Sprint | Futuro — Sistema Completo |
| Prioridad MoSCoW | Won't (prototipo) |
| Dependencias | F-010 |
| CU relacionados | CU-13, CU-14, CU-15, CU-16 |
| RF relacionados | RF-06, RF-24, RF-28 |
| RD relacionados | RD-01, RD-02, RD-04 |

## Descripción

Flujo de aprobación de contenido por expertos lingüísticos y miembros de la comunidad Kogui. Incluye validación cultural, aporte de audios nativos, notas culturales y reporte de errores.

## Subfeatures

### F-011-A — Validar contenido cultural (CU-13)
- Experto revisa lecciones pendientes de aprobación
- Aprobar o rechazar con comentarios
- Cambio de estado: Pendiente → Publicada / Rechazada
- Notificación al admin sobre decisiones
- **RF-24, RD-01**

### F-011-B — Aportar grabaciones de audio (CU-14)
- Subir archivos de audio nativo
- Etiquetar con palabra/frase correspondiente
- Indexación automática para asociar a lecciones
- **RF-06, RD-02**

### F-011-C — Agregar conocimiento cultural (CU-15)
- Añadir notas culturales a lecciones existentes
- Texto e imágenes con contexto cultural
- Vinculación directa a lecciones
- **RF-06, RD-01**

### F-011-D — Reportar errores culturales (CU-16)
- Usuario o experto reporta inconsistencias
- Ticket de moderación automático
- Notificación a admin y experto asignado
- **RF-28, RD-01**

## Flujo de aprobación de contenido

```
Admin crea lección (borrador)
        ↓
Estado: Pendiente de Validación
        ↓
Experto lingüístico revisa
        ↓
    ┌───┴───┐
    │       │
Aprobado  Rechazado
    │       │
    │     Notificar admin + comentarios
    │       │
    │     Admin corrige → reenvía
    │
Estado: Publicada
```

## Modelo de datos adicional

### content_review
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| lesson_id | UUID FK → lessons | Lección revisada |
| reviewer_id | UUID FK → profiles | Experto revisor |
| status | TEXT | pending / approved / rejected |
| comments | TEXT | Comentarios del revisor |
| reviewed_at | TIMESTAMPTZ | Fecha de revisión |

### cultural_reports
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| user_id | UUID FK → profiles | Reportante |
| lesson_id | UUID FK → lessons | Lección con error |
| description | TEXT | Descripción del error |
| status | TEXT | open / in_review / resolved |
| created_at | TIMESTAMPTZ | Fecha del reporte |

## Criterios de aceptación

1. Contenido no se publica sin validación explícita
2. Audio se indexa y asocia correctamente a lecciones
3. Notas culturales se muestran en la lección correspondiente
4. Reporte de error llega al admin y experto asignado
5. Auditoría completa del flujo de aprobación

## Definition of Done

- [ ] Flujo de aprobación/rechazo de contenido implementado
- [ ] Sistema de subida y etiquetado de audio funcional
- [ ] Editor de notas culturales vinculado a lecciones
- [ ] Sistema de reporte de errores culturales
- [ ] Notificaciones automáticas en cada etapa
