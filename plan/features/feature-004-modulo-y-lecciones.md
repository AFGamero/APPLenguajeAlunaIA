# Feature 004 — Módulo y Listado de Lecciones (Sprint 2)

| Campo | Valor |
|-------|-------|
| ID | F-004 |
| Sprint | 2 — Lección + Progreso |
| Prioridad MoSCoW | Must |
| Dependencias | F-001, F-002 |
| Estimación | 3.5 pt |
| CU relacionados | CU-P04 |
| RF relacionados | RF-P05, RF-P06 |

## Descripción

El usuario visualiza el módulo 1 con sus lecciones ordenadas, cada una mostrando su estado: completada, disponible o bloqueada. Las lecciones se desbloquean progresivamente.

## Tareas

| ID | Descripción | Tipo | Estimación |
|----|-------------|------|------------|
| T-02-01 | Página /home: módulo 1 con estado de lecciones | Frontend | 2 pt |
| T-02-02 | Lógica de desbloqueo: lección N disponible solo si lección N-1 está en user_progress | Frontend | 1.5 pt |

## Caso de uso

### CU-P04 — Ver módulo y lista de lecciones
1. Home muestra el módulo 1
2. Se listan las lecciones con estado (completada / disponible / bloqueada)
3. Usuario selecciona una lección disponible
4. Lección bloqueada → mensaje "Completa la lección anterior primero"

## Estados visuales

| Estado | Color | Ícono | Comportamiento |
|--------|-------|-------|----------------|
| Completada | Verde | ✓ check | Accesible, permite repaso |
| Disponible | Azul/Activo | ► play | Clic para iniciar |
| Bloqueada | Gris | 🔒 candado | No clicable, muestra mensaje |

## Criterios de aceptación

1. Lecciones bloqueadas no son accesibles
2. Estado completada se refleja visualmente con ícono y color diferenciado
3. Al completar lección N, la lección N+1 se desbloquea automáticamente
4. La página carga en menos de 2 segundos

## Definition of Done

- [ ] Página /home con listado de lecciones del módulo 1
- [ ] Lógica de desbloqueo progresivo implementada
- [ ] Estados visuales diferenciados (completada/disponible/bloqueada)
- [ ] Navegación a lección seleccionada funciona
