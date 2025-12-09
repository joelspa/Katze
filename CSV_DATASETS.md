# Datasets CSV - Documentación

## 📋 Descripción

El sistema genera automáticamente 3 archivos CSV que se almacenan en Firebase Storage en la carpeta `datasets/`. Estos archivos se actualizan en tiempo real cada vez que ocurre un cambio relevante en la base de datos.

---

## 📂 Archivos Generados

### 1. **cats.csv**
Contiene información de todos los gatos publicados en la plataforma.

**Columnas**:
- `id`: ID único del gato
- `name`: Nombre del gato
- `age`: Edad (numérica)
- `breed`: Raza (ej. Mestizo, Siamés)
- `description`: Descripción del gato
- `health_status`: Estado de salud
- `sterilization_status`: Estado de esterilización (esterilizado, pendiente, no_aplica)
- `living_space_requirement`: Tipo de vivienda recomendada
- `adoption_status`: Estado de adopción (disponible, en_proceso, adoptado)
- `approval_status`: Estado de aprobación (pendiente, aprobado, rechazado)
- `story`: Historia del gato
- `created_at`: Fecha de creación
- `owner_name`: Nombre del rescatista
- `owner_email`: Email del rescatista
- `owner_role`: Rol del rescatista

**Actualización automática**:
- ✅ Al crear un nuevo gato
- ✅ Al aprobar/rechazar un gato (admin)
- ✅ Al editar detalles de un gato
- ✅ Al completar una adopción

---

### 2. **adoption_applications.csv**
Contiene todas las solicitudes de adopción del sistema.

**Columnas**:
- `id`: ID de la solicitud
- `created_at`: Fecha de creación
- `status`: Estado (procesando, revision_pendiente, aprobada, rechazada, rechazada_automaticamente)
- `cat_id`, `cat_name`, `cat_breed`, `cat_age`: Información del gato
- `applicant_id`, `applicant_name`, `applicant_email`, `applicant_phone`: Información del adoptante
- `home_type`: Tipo de hogar (casa/apartamento)
- `living_space_size`: Tamaño del espacio
- `has_nets`: Tiene redes de protección
- `has_other_pets`: Tiene otras mascotas
- `has_children`: Tiene niños
- `pet_experience`: Experiencia con mascotas
- `sterilization_agreement`: Compromiso de esterilización
- `time_availability`: Disponibilidad de tiempo
- `financial_capacity`: Capacidad financiera
- `motivation`: Motivación para adoptar
- `ai_score`: Puntaje de IA (0-100)
- `ai_feedback`: Retroalimentación de IA
- `ai_flags`: Banderas detectadas por IA
- `ai_evaluated_at`: Fecha de evaluación
- `rescuer_name`, `rescuer_email`: Información del rescatista

**Actualización automática**:
- ✅ Al crear una nueva solicitud
- ✅ Al evaluar con IA (automático en background)
- ✅ Al aprobar/rechazar solicitud (rescatista/admin)

---

### 3. **tracking_tasks.csv**
Contiene todas las tareas de seguimiento post-adopción.

**Columnas**:
- `id`: ID de la tarea
- `task_type`: Tipo (Seguimiento de Bienestar, Seguimiento de Esterilización)
- `due_date`: Fecha límite
- `status`: Estado (pendiente, completada)
- `completed_at`: Fecha de completado
- `notes`: Notas del rescatista
- `created_at`: Fecha de creación
- `application_id`: ID de solicitud relacionada
- `cat_id`, `cat_name`: Información del gato
- `adopter_name`, `adopter_email`, `adopter_phone`: Información del adoptante
- `rescuer_name`, `rescuer_email`: Información del rescatista
- `days_overdue`: Días de retraso (si aplica)

**Actualización automática**:
- ✅ Al aprobar una solicitud (crea tareas automáticamente)
- ✅ Al completar una tarea de seguimiento
- ✅ Al completar esterilización (crea tarea de bienestar automáticamente)

---

## 🚀 Uso

### Generación Manual

**Desde terminal**:
```bash
cd backend
npm run generate-csv
```

**Desde API (solo admin)**:
```bash
POST https://katze-nwc0.onrender.com/api/admin/datasets/regenerate
Authorization: Bearer <admin-token>
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Datasets CSV regenerados exitosamente",
  "data": {
    "files": ["cats.csv", "adoption_applications.csv", "tracking_tasks.csv"],
    "location": "Firebase Storage > datasets/"
  }
}
```

---

## 📍 Ubicación en Firebase

Los archivos se guardan en:
```
Firebase Storage
└── datasets/
    ├── cats.csv
    ├── adoption_applications.csv
    └── tracking_tasks.csv
```

**Acceso**:
- Los archivos son **privados** por defecto
- Solo accesibles con credenciales de Firebase Admin
- Se pueden descargar desde la consola de Firebase o mediante el SDK

---

## 🔄 Actualización Automática

Los CSVs se actualizan **automáticamente** en background (sin bloquear las peticiones) cada vez que:

1. Se crea, edita o elimina un gato
2. Se envía una nueva solicitud de adopción
3. La IA evalúa una solicitud
4. Se aprueba o rechaza una solicitud
5. Se completa una tarea de seguimiento
6. Se crea una tarea de seguimiento automática

**Ventajas**:
- ✅ Historial completo siempre disponible
- ✅ Formato CSV fácil de importar a Excel/Google Sheets
- ✅ Backup automático en Firebase Storage
- ✅ Análisis de datos fuera de la plataforma
- ✅ Sin impacto en el rendimiento (ejecución en background)

---

## 🛠️ Implementación Técnica

**Servicio**: `backend/services/csvDatasetService.js`

**Métodos principales**:
- `updateCatsDataset()`: Regenera cats.csv
- `updateApplicationsDataset()`: Regenera adoption_applications.csv
- `updateTrackingDataset()`: Regenera tracking_tasks.csv
- `updateAllDatasets()`: Regenera todos los CSVs

**Integración**: Los métodos se llaman automáticamente desde:
- `catController.js`
- `applicationController.js`
- `trackingController.js`
- `processApplicationQueue.js` (worker de IA)

---

## 📝 Notas

- Los CSVs usan codificación **UTF-8**
- Los campos con comas, comillas o saltos de línea se escapan correctamente
- Los valores `null` se convierten a strings vacíos
- Los arrays (como `ai_flags`) se convierten a strings separados por `;`
- Las fechas se guardan en formato ISO 8601

---

**Última actualización**: Diciembre 2025
