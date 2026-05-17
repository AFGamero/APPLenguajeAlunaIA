# Feature 005 — Vocabulario y Audio Nativo (Sprint 2)

| Campo | Valor |
|-------|-------|
| ID | F-005 |
| Sprint | 2 — Lección + Progreso |
| Prioridad MoSCoW | Must |
| Dependencias | F-001, F-004 |
| Estimación | 3.5 pt |
| CU relacionados | CU-P05, CU-P06 |
| RF relacionados | RF-P07 |

## Descripción

Cada lección incluye una pantalla de vocabulario con la palabra Kogui, transcripción fonética, traducción al español, nota cultural y un botón para reproducir audio nativo.

## Tareas

| ID | Descripción | Tipo | Estimación |
|----|-------------|------|------------|
| T-02-03 | Componente LessonPage: orquesta los pasos de la lección | Frontend | 2 pt |
| T-02-04 | Componente VocabScreen: palabra, fonética, traducción, nota cultural, botón audio | Frontend | 2 pt |
| T-02-05 | Integración de audio: Supabase Storage con fallback a Web Speech API | Frontend | 1.5 pt |

## Caso de uso

### CU-P06 — Reproducir audio nativo
1. Usuario presiona botón de audio en la pantalla de vocabulario
2. Se reproduce el archivo desde Supabase Storage
3. Opción de repetir disponible
4. Si audio no disponible → fallback a Web Speech API

## Estructura del contenido JSONB (lessons.content)

```json
{
  "vocabulary": [
    {
      "word": "Palabra en Kogui",
      "phonetic": "/transcripción/",
      "translation": "Traducción al español",
      "cultural_note": "Contexto cultural",
      "audio_url": "url_en_storage_o_null"
    }
  ],
  "exercises": { ... }
}
```

## Criterios de aceptación

1. Audio inicia en menos de 500 ms
2. Fallback por síntesis de voz funciona sin error visible
3. Transcripción fonética visible siempre
4. Nota cultural se muestra en formato legible
5. Botón de repetir visible tras reproducción

## Definition of Done

- [ ] VocabScreen implementado con todos los campos
- [ ] Integración de audio con Supabase Storage
- [ ] Fallback a Web Speech API funcional
- [ ] LessonPage orquesta correctamente los pasos
- [ ] Botón de repetir audio funcional
