# Feature 007 — Persistencia de Progreso y Resultados (Sprint 2)

| Campo | Valor |
|-------|-------|
| ID | F-007 |
| Sprint | 2 — Lección + Progreso |
| Prioridad MoSCoW | Must |
| Dependencias | F-001, F-002, F-006 |
| Estimación | 4.5 pt |
| CU relacionados | CU-P05 |
| RF relacionados | RF-P11, RF-P14 |

## Descripción

Al completar una lección, el progreso se guarda en Supabase. El usuario ve una pantalla de resultado con XP ganado, precisión y vocabulario aprendido.

## Tareas

| ID | Descripción | Tipo | Estimación |
|----|-------------|------|------------|
| T-02-09 | Componente ResultScreen: XP ganado, precisión %, palabras aprendidas, botón repetir | Frontend | 1.5 pt |
| T-02-10 | Servicio saveProgress: insertar en user_progress y actualizar xp_total + last_activity | Backend/DB | 2 pt |

## Caso de uso

### CU-P05 — Realizar una lección (paso final)
1. Usuario completa todos los ejercicios
2. Sistema calcula: XP ganado, precisión %, palabras aprendidas
3. Se guarda en Supabase: user_progress + actualización de profiles
4. Se muestra pantalla de resultados

## Servicio saveProgress

```
saveProgress(userId, lessonId, score, total):
  1. Calcular xpEarned = (score/total) * xpReward
  2. Insertar en user_progress { userId, lessonId, score, xpEarned }
  3. Actualizar profiles:
     - xp_total += xpEarned
     - last_activity = now()
     - recalcular streak_days
```

## Pantalla de resultado (ResultScreen)

| Elemento | Descripción |
|----------|-------------|
| XP Ganado | Puntos obtenidos en la lección |
| Precisión | Porcentaje de respuestas correctas |
| Palabras aprendidas | Lista de vocabulario de la lección |
| Botón Repetir | Vuelve a iniciar la lección |
| Botón Siguiente | Navega a siguiente lección (si disponible) |

## Criterios de aceptación

1. Progreso guardado en Supabase en menos de 5 segundos
2. XP actualizado en perfil inmediatamente
3. Pantalla de resultado muestra datos correctos
4. Racha diaria se actualiza si corresponde

## Definition of Done

- [ ] ResultScreen implementado con todas las métricas
- [ ] Servicio saveProgress funcional
- [ ] user_progress se inserta correctamente
- [ ] profiles se actualiza (xp_total, last_activity, streak)
- [ ] Botones de repetir y siguiente funcionan
