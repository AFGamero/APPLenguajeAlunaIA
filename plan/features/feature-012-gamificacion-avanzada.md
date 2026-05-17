# Feature 012 — Gamificación Avanzada

| Campo | Valor |
|-------|-------|
| ID | F-012 |
| Sprint | Futuro — Sistema Completo |
| Prioridad MoSCoW | Could (prototipo) |
| Dependencias | F-003, F-007 |
| CU relacionados | CU-06 |
| RF relacionados | RF-12, RF-14 |

## Descripción

Sistema avanzado de gamificación con insignias, logros, estadísticas semanales/mensuales y elementos de motivación para el estudiante.

## Subfeatures

### F-012-A — Insignias y logros (RF-12)
- Insignias por hitos: primera lección, racha de 7 días, 1000 XP, etc.
- Notificación al obtener nueva insignia
- Visualización en perfil
- Categorías: progreso, dedicación, maestría

### F-012-B — Estadísticas de desempeño (RF-14)
- Gráficos semanales y mensuales
- Progreso por módulo
- Tiempo de estudio
- Comparativa con períodos anteriores

## Insignias propuestas

| Insignia | Requisito | Tipo |
|----------|-----------|------|
| 🌱 Principiante | Completar 1ª lección | Progreso |
| 🔥 Racha de 3 días | 3 días consecutivos | Dedicación |
| 🔥 Racha de 7 días | 7 días consecutivos | Dedicación |
| 🔥 Racha de 30 días | 30 días consecutivos | Dedicación |
| ⭐ Aprendiz | 100 XP | Progreso |
| ⭐ Estudiante | 500 XP | Progreso |
| ⭐ Sabio | 2000 XP | Progreso |
| 🏆 Módulo completo | 100% del módulo 1 | Maestría |
| 🏆 Políglota | Completar todos los módulos | Maestría |

## Modelo de datos adicional

### badges
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| name | TEXT | Nombre de la insignia |
| description | TEXT | Descripción |
| icon | TEXT | Ícono/emoji |
| requirement_type | TEXT | Tipo: xp, streak, lessons |
| requirement_value | INTEGER | Valor requerido |

### user_badges
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| user_id | UUID FK → profiles | Usuario |
| badge_id | UUID FK → badges | Insignia |
| earned_at | TIMESTAMPTZ | Fecha de obtención |

## Criterios de aceptación

1. Insignias se otorgan automáticamente al cumplir requisitos
2. Animación/notificación al obtener nueva insignia
3. Estadísticas semanales y mensuales precisas
4. Datos se actualizan en tiempo real

## Definition of Done

- [ ] Sistema de insignias implementado
- [ ] Asignación automática al cumplir requisitos
- [ ] Visualización en perfil del usuario
- [ ] Página de estadísticas con gráficos semanales/mensuales
- [ ] Animaciones de logro
