# Base de Datos - Katze

Ingeniería inversa de la estructura de la base de datos PostgreSQL utilizada por la plataforma de adopción de gatos Katze.

## Resumen General

- **Motor**: PostgreSQL
- **Total de Tablas**: 5
- **Total de Vistas**: 1
- **Total de Funciones**: 1
- **Relaciones**: 8 Foreign Keys

---

## Tablas

### 1. `users` - Usuarios del Sistema

Almacena información de todos los usuarios registrados en la plataforma.

**Columnas:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email del usuario |
| `password_hash` | VARCHAR(255) | NOT NULL | Contraseña hasheada |
| `full_name` | VARCHAR(255) | NOT NULL | Nombre completo |
| `role` | VARCHAR(50) | NOT NULL, CHECK | Rol: `adoptante`, `rescatista`, `admin` |
| `phone` | VARCHAR(50) | - | Teléfono de contacto |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de registro |

**Índices:**
- `idx_posts_author` en `id` (usado por educational_posts)

**Relaciones:**
- 1:N con `cats` (owner_id)
- 1:N con `adoption_applications` (applicant_id)
- 1:N con `educational_posts` (author_id)

---

### 2. `cats` - Gatos en Adopción

Almacena información detallada de los gatos disponibles para adopción.

**Columnas:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único |
| `name` | VARCHAR(255) | NOT NULL | Nombre del gato |
| `description` | TEXT | - | Descripción detallada |
| `age` | INTEGER | - | Edad en años |
| `health_status` | VARCHAR(100) | - | Estado de salud |
| `sterilization_status` | VARCHAR(50) | CHECK | `esterilizado`, `no_esterilizado`, `pendiente` |
| `photos_url` | TEXT[] | - | Array de URLs de fotos |
| `owner_id` | INTEGER | FK → users(id), ON DELETE CASCADE | ID del rescatista |
| `approval_status` | VARCHAR(50) | CHECK, DEFAULT 'pendiente' | `aprobado`, `rechazado`, `pendiente` |
| `adoption_status` | VARCHAR(50) | CHECK, DEFAULT 'disponible' | `disponible`, `en_proceso`, `adoptado` |
| `story` | TEXT | - | Historia del gato |
| `breed` | VARCHAR(100) | DEFAULT 'Mestizo' | Raza del gato |
| `living_space_requirement` | VARCHAR(50) | CHECK, DEFAULT 'cualquiera' | `casa_grande`, `departamento`, `cualquiera` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

**Índices:**
- `idx_cats_owner` en `owner_id`
- `idx_cats_status` en `(approval_status, adoption_status)`
- `idx_cats_living_space` en `living_space_requirement`
- `idx_cats_breed` en `breed`

**Relaciones:**
- N:1 con `users` (owner_id)
- 1:N con `adoption_applications` (cat_id)

**Migración**: Se agregaron `breed` y `living_space_requirement` en `add_living_space_and_breed.sql`

---

### 3. `adoption_applications` - Solicitudes de Adopción

Almacena todas las solicitudes de adopción con evaluación de IA.

**Columnas:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único |
| `cat_id` | INTEGER | FK → cats(id), ON DELETE CASCADE | ID del gato |
| `applicant_id` | INTEGER | FK → users(id), ON DELETE CASCADE | ID del solicitante |
| `status` | VARCHAR(50) | CHECK, DEFAULT 'procesando' | Estado de la solicitud |
| `form_responses` | JSONB | - | Respuestas del formulario |
| `ai_score` | INTEGER | CHECK (0-100) | Puntuación de compatibilidad IA |
| `ai_feedback` | TEXT | - | Explicación de la decisión IA |
| `ai_flags` | TEXT[] | - | Etiquetas: Casa Segura, Pro-Esterilización, etc. |
| `ai_evaluated_at` | TIMESTAMP | - | Timestamp de evaluación IA |
| `ai_error` | TEXT | - | Mensaje de error si falló |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

**Estados Posibles:**
- `procesando` - La IA está evaluando la solicitud
- `revision_pendiente` - Requiere revisión humana
- `rechazada_automaticamente` - Rechazada por IA
- `pendiente` - Legacy, esperando decisión
- `aprobada` - Aprobada por rescatista
- `rechazada` - Rechazada por rescatista
- `completada` - Proceso finalizado

**Índices:**
- `idx_applications_cat` en `cat_id`
- `idx_applications_applicant` en `applicant_id`
- `idx_applications_procesando` en `(status, created_at)` WHERE status = 'procesando'
- `idx_applications_revision_pendiente` en `(status, ai_score DESC)` WHERE status = 'revision_pendiente'

**Relaciones:**
- N:1 con `cats` (cat_id)
- N:1 con `users` (applicant_id)
- 1:N con `tracking_tasks` (application_id)

**Migraciones**: 
- Columnas de IA agregadas en `add_ai_async_evaluation.sql`
- Estados traducidos al español en `translate_status_to_spanish.sql`

---

### 4. `tracking_tasks` - Tareas de Seguimiento Post-Adopción

Seguimiento de bienestar y esterilización después de adopción aprobada.

**Columnas:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único |
| `application_id` | INTEGER | FK → adoption_applications(id), ON DELETE CASCADE | ID de solicitud |
| `task_type` | VARCHAR(50) | CHECK, NOT NULL | Tipo de seguimiento |
| `due_date` | DATE | NOT NULL | Fecha límite |
| `status` | VARCHAR(50) | CHECK, DEFAULT 'pendiente' | `pendiente`, `completada`, `atrasada` |
| `description` | TEXT | - | Descripción de la tarea |
| `notes` | TEXT | - | Notas adicionales |
| `certificate_url` | TEXT | - | URL del certificado (esterilización) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Última actualización |

**Tipos de Tareas:**
- `Seguimiento de Bienestar` / `bienestar`
- `Seguimiento de Esterilización` / `esterilizacion`

**Índices:**
- `idx_tracking_application` en `application_id`
- `idx_tracking_status_date` en `(status, due_date)`

**Relaciones:**
- N:1 con `adoption_applications` (application_id)

---

### 5. `educational_posts` - Contenido Educativo

Almacena artículos, noticias y contenido educativo sobre el cuidado de gatos.

**Columnas:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Identificador único |
| `title` | VARCHAR(255) | NOT NULL | Título del post |
| `content` | TEXT | NOT NULL | Contenido completo |
| `author_id` | INTEGER | FK → users(id), ON DELETE SET NULL | ID del autor |
| `category` | VARCHAR(100) | - | Categoría del post |
| `image_url` | TEXT | - | URL de imagen destacada |
| `content_type` | VARCHAR(50) | - | Tipo de contenido |
| `event_date` | TIMESTAMP | - | Fecha del evento (si aplica) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de publicación |

**Índices:**
- `idx_posts_author` en `author_id`

**Relaciones:**
- N:1 con `users` (author_id)

---

## Vistas

### `v_tracking_tasks_details`

Vista consolidada que combina información de tareas de seguimiento con datos relacionados.

**Columnas Retornadas:**

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `id` | tracking_tasks | ID de la tarea |
| `application_id` | tracking_tasks | ID de solicitud |
| `task_type` | tracking_tasks | Tipo de tarea |
| `due_date` | tracking_tasks | Fecha límite |
| `status` | tracking_tasks | Estado de la tarea |
| `description` | tracking_tasks | Descripción |
| `notes` | tracking_tasks | Notas |
| `certificate_url` | tracking_tasks | URL certificado |
| `created_at` | tracking_tasks | Fecha creación |
| `updated_at` | tracking_tasks | Última actualización |
| **Información del Gato** |||
| `cat_id` | cats | ID del gato |
| `cat_name` | cats | Nombre del gato |
| `cat_photos` | cats | Fotos del gato |
| `sterilization_status` | cats | Estado esterilización |
| **Información del Adoptante** |||
| `applicant_id` | users (adoptante) | ID del adoptante |
| `applicant_name` | users (adoptante) | Nombre completo |
| `applicant_email` | users (adoptante) | Email |
| `applicant_phone` | users (adoptante) | Teléfono |
| **Información del Rescatista** |||
| `owner_id` | cats | ID del rescatista |
| `owner_name` | users (rescatista) | Nombre del rescatista |
| `owner_email` | users (rescatista) | Email |
| **Información de Solicitud** |||
| `application_status` | adoption_applications | Estado de solicitud |
| `application_date` | adoption_applications | Fecha de solicitud |

**JOINs:**
```sql
tracking_tasks → adoption_applications → cats → users (adoptante)
                                              → users (rescatista)
```

---

## Funciones

### `mark_overdue_tasks()`

Marca automáticamente tareas atrasadas.

**Descripción**: Actualiza el estado de tareas de seguimiento a 'atrasada' cuando la fecha límite ha pasado.

**Lógica:**
```sql
UPDATE tracking_tasks 
SET status = 'atrasada'
WHERE status = 'pendiente' 
AND due_date < CURRENT_DATE;
```

**Uso**: Debe ejecutarse periódicamente (cronjob o trigger) para mantener estados actualizados.

---

## Diagrama de Relaciones (ERD Simplificado)

```
┌─────────────┐
│   users     │
│─────────────│
│ id (PK)     │◄────────┐
│ email       │         │
│ role        │         │ owner_id
│ ...         │         │
└─────────────┘         │
       │                │
       │ author_id      │
       │                │
       ▼                │
┌──────────────────┐    │         ┌────────────────────┐
│ educational_posts│    └─────────│       cats         │
│──────────────────│              │────────────────────│
│ id (PK)          │              │ id (PK)            │
│ title            │              │ name               │
│ author_id (FK)   │              │ owner_id (FK)      │
│ ...              │              │ approval_status    │
└──────────────────┘              │ breed              │
                                  │ living_space_req   │
                                  └────────────────────┘
                                         │
                                         │ cat_id
                                         ▼
┌─────────────┐            ┌────────────────────────────┐
│   users     │            │  adoption_applications     │
│─────────────│            │────────────────────────────│
│ id (PK)     │◄───────────│ id (PK)                    │
└─────────────┘            │ cat_id (FK)                │
  applicant_id             │ applicant_id (FK)          │
                           │ status                     │
                           │ ai_score                   │
                           │ ai_feedback                │
                           │ ai_flags                   │
                           └────────────────────────────┘
                                         │
                                         │ application_id
                                         ▼
                           ┌────────────────────────────┐
                           │     tracking_tasks         │
                           │────────────────────────────│
                           │ id (PK)                    │
                           │ application_id (FK)        │
                           │ task_type                  │
                           │ due_date                   │
                           │ status                     │
                           └────────────────────────────┘
```

---

## Tipos de Datos y Restricciones

### CHECK Constraints Detallados

**users.role:**
- `'adoptante'` - Usuario que busca adoptar
- `'rescatista'` - Usuario que rescata/publica gatos
- `'admin'` - Administrador del sistema

**cats.sterilization_status:**
- `'esterilizado'` - Gato ya esterilizado
- `'no_esterilizado'` - No esterilizado
- `'pendiente'` - Pendiente de esterilización

**cats.approval_status:**
- `'aprobado'` - Aprobado por admin
- `'rechazado'` - Rechazado por admin
- `'pendiente'` - Esperando aprobación

**cats.adoption_status:**
- `'disponible'` - Disponible para adopción
- `'en_proceso'` - Solicitud en proceso
- `'adoptado'` - Ya adoptado

**cats.living_space_requirement:**
- `'casa_grande'` - Requiere casa grande
- `'departamento'` - Apto para departamento
- `'cualquiera'` - Adaptable a cualquier espacio

**adoption_applications.status:**
- `'procesando'` - IA evaluando
- `'revision_pendiente'` - Requiere revisión humana
- `'rechazada_automaticamente'` - IA rechazó
- `'pendiente'` - Legacy
- `'aprobada'` - Aprobada por rescatista
- `'rechazada'` - Rechazada por rescatista
- `'completada'` - Finalizada

**tracking_tasks.status:**
- `'pendiente'` - Tarea pendiente
- `'completada'` - Tarea completada
- `'atrasada'` - Pasó la fecha límite

**tracking_tasks.task_type:**
- `'Seguimiento de Bienestar'` / `'bienestar'`
- `'Seguimiento de Esterilización'` / `'esterilizacion'`

---

## Políticas de Borrado (ON DELETE)

| Tabla | FK | Política | Efecto |
|-------|----|-----------| ------|
| cats | owner_id → users(id) | CASCADE | Si se borra el rescatista, se borran sus gatos |
| adoption_applications | cat_id → cats(id) | CASCADE | Si se borra el gato, se borran sus solicitudes |
| adoption_applications | applicant_id → users(id) | CASCADE | Si se borra el usuario, se borran sus solicitudes |
| tracking_tasks | application_id → adoption_applications(id) | CASCADE | Si se borra la solicitud, se borran sus tareas |
| educational_posts | author_id → users(id) | SET NULL | Si se borra el autor, el post queda sin autor |

---

## Historial de Migraciones

1. **Schema Inicial** (`schema.sql`)
   - Creación de 5 tablas principales
   - Índices básicos
   - Vista `v_tracking_tasks_details`
   - Función `mark_overdue_tasks()`

2. **add_living_space_and_breed.sql** (2025-11-25)
   - Agregado `cats.breed` (VARCHAR 100, DEFAULT 'Mestizo')
   - Agregado `cats.living_space_requirement` (VARCHAR 20, DEFAULT 'cualquiera')
   - Índices en ambas columnas

3. **add_ai_async_evaluation.sql** (2025-12-07)
   - Agregado `adoption_applications.ai_score` (INTEGER 0-100)
   - Agregado `adoption_applications.ai_feedback` (TEXT)
   - Agregado `adoption_applications.ai_flags` (TEXT[])
   - Agregado `adoption_applications.ai_evaluated_at` (TIMESTAMP)
   - Agregado `adoption_applications.ai_error` (TEXT)
   - Nuevos estados: 'processing', 'pending_review', 'auto_rejected'
   - Índices para optimizar worker de IA

4. **translate_status_to_spanish.sql** (2025-12-07)
   - Traducción de estados de inglés a español
   - 'processing' → 'procesando'
   - 'pending_review' → 'revision_pendiente'
   - 'auto_rejected' → 'rechazada_automaticamente'
   - Actualización de índices y comentarios

---

## Resumen de Índices

Total: 12 índices

| Tabla | Índice | Columnas | Tipo |
|-------|--------|----------|------|
| cats | idx_cats_owner | owner_id | Regular |
| cats | idx_cats_status | approval_status, adoption_status | Compuesto |
| cats | idx_cats_living_space | living_space_requirement | Regular |
| cats | idx_cats_breed | breed | Regular |
| adoption_applications | idx_applications_cat | cat_id | Regular |
| adoption_applications | idx_applications_applicant | applicant_id | Regular |
| adoption_applications | idx_applications_procesando | status, created_at | Parcial (WHERE) |
| adoption_applications | idx_applications_revision_pendiente | status, ai_score DESC | Parcial (WHERE) |
| tracking_tasks | idx_tracking_application | application_id | Regular |
| tracking_tasks | idx_tracking_status_date | status, due_date | Compuesto |
| educational_posts | idx_posts_author | author_id | Regular |

---

## Notas de Implementación

### Evaluación con IA
- Las solicitudes se crean con estado `'procesando'`
- Un worker externo procesa la solicitud con Gemini AI
- Genera score (0-100), feedback y flags
- Cambia estado a `'revision_pendiente'` o `'rechazada_automaticamente'`

### Sistema de Seguimiento
- Se crean tareas automáticamente al aprobar adopción
- Tipos: Bienestar (30 días) y Esterilización (si no está esterilizado)
- La función `mark_overdue_tasks()` debe ejecutarse periódicamente
- Vista `v_tracking_tasks_details` consolida toda la información

### Datasets CSV
- Se generan 3 CSVs: cats.csv, applications.csv, tracking.csv
- Suben a Firebase Storage
- Usados para análisis y ML

### Seguridad
- Todas las contraseñas se almacenan como hash (bcrypt)
- Foreign Keys con CASCADE protegen integridad referencial
- CHECK constraints validan valores permitidos
- Roles controlan permisos en la aplicación

---

## Conexión

La aplicación se conecta mediante:
- **Host**: Render PostgreSQL
- **Credenciales**: Variables de entorno
- **Pool de conexiones**: `pg` library en Node.js
- **ORM**: Sin ORM, SQL directo con queries parametrizadas

---

## Mantenimiento

### Tareas Periódicas Recomendadas
1. Ejecutar `mark_overdue_tasks()` diariamente
2. Limpiar solicitudes antiguas rechazadas (opcional)
3. Archivar tareas completadas mayores a 6 meses (opcional)
4. VACUUM y ANALYZE en tablas grandes
5. Revisar slow queries y optimizar índices

### Backup
- Backup diario automático en Render
- Retención de 7 días
- Exportar manualmente para backups adicionales

---

## Estadísticas de Uso Típico

**Por Usuario:**
- Adoptante: 1 user → N applications
- Rescatista: 1 user → N cats → M applications
- Admin: acceso total

**Por Gato:**
- 1 cat → 0-N applications
- Promedio: 3-5 solicitudes por gato

**Por Solicitud:**
- 1 application → 0-2 tracking_tasks
- Si aprobada: 1 tarea bienestar + 0-1 tarea esterilización
