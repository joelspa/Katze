# Solución al Error 500 en el Panel de Seguimiento

## Problema Identificado

El error 500 ocurre porque el código intenta consultar la vista `v_tracking_tasks_details` y ejecutar la función `mark_overdue_tasks()` que no existen en la base de datos.

## Solución

### Opción 1: Ejecutar la migración (Recomendado)

1. **Desde tu máquina local**, conectado a la base de datos de Render:

```bash
cd backend
node run-migration.js
```

Esto ejecutará automáticamente todas las migraciones, incluyendo la nueva `add_tracking_view_and_functions.sql`.

### Opción 2: Ejecutar manualmente en Render

1. Ve al dashboard de Render
2. Accede a tu base de datos PostgreSQL
3. Abre el "Shell" o conéctate vía psql
4. Copia y pega el contenido del archivo `backend/migrations/add_tracking_view_and_functions.sql`

### Opción 3: Desde tu aplicación local

Si tienes la base de datos configurada localmente:

```bash
cd backend
psql -h [TU_HOST_DE_RENDER] -U [TU_USUARIO] -d [TU_DATABASE] -f migrations/add_tracking_view_and_functions.sql
```

## Cambios Realizados

### 1. Nueva Migración: `add_tracking_view_and_functions.sql`

Esta migración agrega:

- ✅ Actualiza el constraint de `task_type` para incluir los valores correctos: `'Seguimiento de Bienestar'` y `'Seguimiento de Esterilización'`
- ✅ Actualiza el constraint de `status` para incluir `'atrasada'`
- ✅ Agrega columnas faltantes: `certificate_url` y `updated_at`
- ✅ Crea la función `mark_overdue_tasks()` para marcar automáticamente tareas vencidas
- ✅ Crea la vista `v_tracking_tasks_details` con toda la información necesaria para el panel de seguimiento

### 2. Schema Actualizado: `schema.sql`

El schema principal ahora incluye todos estos elementos para instalaciones nuevas.

## Verificación

Después de ejecutar la migración, puedes verificar que todo funciona correctamente:

```sql
-- Verificar que la vista existe
SELECT * FROM v_tracking_tasks_details LIMIT 1;

-- Verificar que la función existe
SELECT mark_overdue_tasks();

-- Verificar las columnas de la tabla
\d tracking_tasks
```

## Problema Resuelto

Una vez aplicada la migración:

- ✅ El endpoint `/api/tracking` funcionará correctamente
- ✅ El panel de seguimiento del admin cargará sin errores
- ✅ Las tareas atrasadas se marcarán automáticamente
- ✅ Se mostrará información completa del adoptante, gato y rescatista

## Notas Adicionales

- La migración es segura y no perderá datos existentes
- Los constraints se actualizan usando `DROP IF EXISTS` para evitar errores si ya existen
- La vista usa `LEFT JOIN` para manejar casos donde no hay rescatista asignado
