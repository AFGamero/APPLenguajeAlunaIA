# Feature 009 — Modo Offline-First y Sincronización

| Campo | Valor |
|-------|-------|
| ID | F-009 |
| Sprint | Futuro — Sistema Completo |
| Prioridad MoSCoW | Won't (prototipo) |
| Dependencias | F-007 |
| CU relacionados | CU-07, CU-08 |
| RF relacionados | RF-19, RF-20, RF-21, RF-22 |

## Descripción

El sistema permite descargar módulos completos para uso sin internet, guardar progreso localmente y sincronizar automáticamente cuando haya conexión.

## Subfeatures

### F-009-A — Descarga de contenido offline (CU-07)
- Seleccionar módulo para descarga
- Almacenar en IndexedDB (web) o SQLite (móvil)
- Mostrar progreso de descarga
- Advertencia si espacio insuficiente
- **RF-19**

### F-009-B — Sincronización automática (CU-08)
- Detectar conectividad automáticamente
- Cola local de eventos (progreso pendiente de sincronizar)
- Envío automático al restaurar conexión
- Resolver conflictos preservando progreso más reciente
- **RF-20, RF-21, RF-22**

## Stack técnico

- IndexedDB (via Dexie.js) para web
- SQLite (Drift) para Flutter
- Cola de eventos con estado (pending/synced/failed)
- Connectivity API para detección de red
- Service Workers para cache de contenido

## Modelo de datos local

### sync_queue
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT PK | UUID local |
| action | TEXT | Tipo: save_progress, update_profile |
| payload | JSONB | Datos a sincronizar |
| status | TEXT | pending / syncing / failed |
| created_at | TIMESTAMP | Fecha de creación |
| retries | INTEGER | Intentos de sincronización |

## Criterios de aceptación

1. Módulo de 50MB se descarga en menos de 3 minutos con Wi-Fi
2. Contenido offline funciona sin conexión
3. Sincronización automática sin intervención del usuario
4. Progreso offline nunca se pierde al cerrar la app
5. Indicador visual del estado de conexión

## Definition of Done

- [ ] Sistema de descarga de módulos implementado
- [ ] Base de datos local funcional (IndexedDB/SQLite)
- [ ] Cola de sincronización con reintentos
- [ ] Sincronización automática al detectar conectividad
- [ ] Indicador visual de conectividad en UI
- [ ] Pruebas exhaustivas de sincronización bidireccional
