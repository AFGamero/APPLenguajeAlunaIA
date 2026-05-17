# Feature 006 — Ejercicios Interactivos (Sprint 2)

| Campo | Valor |
|-------|-------|
| ID | F-006 |
| Sprint | 2 — Lección + Progreso |
| Prioridad MoSCoW | Must |
| Dependencias | F-001, F-004, F-005 |
| Estimación | 9 pt |
| CU relacionados | CU-P05 |
| RF relacionados | RF-P08, RF-P09, RF-P10 |

## Descripción

Cada lección incluye tres tipos de ejercicio: selección múltiple, emparejamiento y escritura. Todos con feedback inmediato y pistas opcionales.

## Tareas

| ID | Descripción | Tipo | Estimación |
|----|-------------|------|------------|
| T-02-06 | Componente MultipleChoice: 4 opciones, selección, feedback inmediato | Frontend | 2 pt |
| T-02-07 | Componente MatchExercise: columnas kogui/español, detección de errores, pista tras 3 fallos | Frontend | 3 pt |
| T-02-08 | Componente WriteExercise: input de texto, validación case-insensitive, pista automática a los 6s | Frontend | 2 pt |
| T-02-11 | Barra de progreso animada durante la lección (% de pasos completados) | Frontend | 1 pt |

## Tipos de ejercicio

### Selección Múltiple
- 4 opciones de respuesta
- Selección única
- Feedback inmediato: correcto (verde) / incorrecto (rojo + respuesta correcta)
- Pista opcional tras primer error (highlight 50/50)

### Emparejamiento (Matching)
- Dos columnas: palabras Kogui ↔ traducciones español
- Arrastrar o click para emparejar
- Detección de errores al completar todos los pares
- Pista automática tras 3 errores: muestra un par correcto

### Escritura
- Input de texto libre
- Validación case-insensitive (sin acentos)
- Feedback inmediato
- Pista automática a los 6 segundos: muestra primera letra

## Flujo de la lección

```
VocabScreen → MultipleChoice → MatchExercise → WriteExercise → ResultScreen
```

## Criterios de aceptación

1. Feedback aparece en menos de 1 segundo tras cada respuesta
2. Pista disponible tras primer error (o en el momento definido)
3. Barra de progreso refleja avance real
4. Validación de escritura ignora mayúsculas/minúsculas
5. No es posible avanzar sin completar el ejercicio actual

## Definition of Done

- [ ] MultipleChoice con 4 opciones y feedback inmediato
- [ ] MatchExercise con arrastre/click y detección de errores
- [ ] WriteExercise con validación case-insensitive y pista automática
- [ ] Barra de progreso animada
- [ ] Todos los ejercicios tienen feedback visual inmediato
