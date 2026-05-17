# Feature 003 — Perfil y Progreso del Usuario (Sprint 1)

| Campo | Valor |
|-------|-------|
| ID | F-003 |
| Sprint | 1 — Auth + Perfil |
| Prioridad MoSCoW | Should |
| Dependencias | F-001, F-002 |
| Estimación | 5 pt |
| CU relacionados | CU-P03 |
| RF relacionados | RF-P12, RF-P13 |

## Descripción

El usuario puede consultar su perfil con métricas de progreso: XP total acumulado, número de lecciones completadas, racha diaria y estadísticas de desempeño.

## Tareas

| ID | Descripción | Tipo | Estimación |
|----|-------------|------|------------|
| T-01-07 | Página /profile: XP total, lecciones completadas, racha diaria | Frontend | 2 pt |
| T-01-08 | Lógica de racha diaria: comparar last_activity con today, actualizar streak_days | Backend/DB | 2 pt |
| T-01-10 | Layout general: navbar con avatar, nombre y botón perfil/logout | Frontend | 1.5 pt |

## Caso de uso

### CU-P03 — Ver perfil y progreso
1. Usuario navega a `/profile`
2. Se consultan datos de tablas `profiles` y `user_progress`
3. Se muestran métricas: XP, racha, lecciones completadas

## Lógica de racha diaria

```
función calcularRacha(ultimaActividad, hoy):
  diferencia = hoy - ultimaActividad
  si diferencia == 1 día → streak_days += 1
  si diferencia == 0 días → no cambiar (mismo día)
  si diferencia > 1 día → streak_days = 0 (racha perdida)
```

## Criterios de aceptación

1. Los datos se cargan en menos de 2 segundos
2. El XP refleja el progreso acumulado correctamente
3. La racha diaria se calcula correctamente
4. El perfil muestra lecciones completadas con su respectivo score

## Definition of Done

- [ ] Página /profile implementada
- [ ] Lógica de racha diaria implementada y probada
- [ ] Navbar integrado con avatar y nombre de usuario
- [ ] Datos de progreso visibles y actualizados
