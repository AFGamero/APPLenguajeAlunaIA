# Feature 008 — IA y Personalización del Aprendizaje

| Campo | Valor |
|-------|-------|
| ID | F-008 |
| Sprint | Futuro — Sistema Completo |
| Prioridad MoSCoW | Won't (prototipo) |
| Dependencias | F-007 |
| CU relacionados | CU-17, CU-18, CU-19, CU-20 |
| RF relacionados | RF-15, RF-16, RF-17, RF-18 |

## Descripción

Módulo de inteligencia artificial que personaliza la ruta de aprendizaje del usuario, aplica repetición espaciada (SM-2), detecta dificultades y genera retroalimentación adaptada.

## Subfeatures

### F-008-A — Personalizar ruta de aprendizaje (CU-17)
- Evaluar desempeño del usuario tras cada lección
- Ajustar dificultad de siguientes lecciones
- Recomendar contenido según fortalezas/debilidades
- **RF-15, RF-17**

### F-008-B — Repetición espaciada (CU-18)
- Implementar algoritmo SM-2 para revisión de vocabulario
- Programar revisiones en intervalos: 1, 3, 7, 14 días
- Presentar palabras vencidas para repaso diario
- **RF-16**

### F-008-C — Detección de dificultades (CU-19)
- Analizar patrones de error cada 5 respuestas incorrectas
- Identificar categorías problemáticas
- Priorizar contenido de refuerzo automáticamente
- **RF-18**

### F-008-D — Retroalimentación adaptada (CU-20)
- Mensajes de feedback personalizados según error
- Plantillas de feedback según tipo de error
- Mencionar el error concreto, no mensaje genérico
- **RF-10, RF-18**

## Stack técnico sugerido

- Python FastAPI (serverless en Vercel)
- scikit-learn para modelos ligeros de recomendación
- Algoritmo SM-2 implementado en Python
- TensorFlow Lite para inferencia en dispositivo (futuro)

## Modelo de datos adicional

### user_vocabulary_review
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID PK | Identificador |
| user_id | UUID FK | Usuario |
| word_id | TEXT | Palabra a repasar |
| easiness | FLOAT | Facilidad (SM-2) |
| interval | INTEGER | Días hasta próxima revisión |
| repetitions | INTEGER | Número de repeticiones |
| next_review | DATE | Próxima fecha de revisión |

## Criterios de aceptación

1. Precisión de recomendación mínima del 70%
2. Intervalos SM-2 respetados: 1, 3, 7, 14 días
3. Detección de dificultades con tasa de acierto > 80%
4. Feedback menciona el error concreto
5. Motor de IA responde en menos de 1 segundo

## Definition of Done

- [ ] Algoritmo SM-2 implementado en FastAPI
- [ ] API de recomendación de siguiente lección
- [ ] Servicio de detección de dificultades
- [ ] Sistema de plantillas de feedback personalizado
- [ ] Integración con frontend para mostrar recomendaciones
