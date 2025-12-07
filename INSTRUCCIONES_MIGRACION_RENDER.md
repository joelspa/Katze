# Instrucciones para Ejecutar Migraciones en Render

## Problema Actual
La conexión a la base de datos de Render desde tu máquina local está siendo bloqueada. Esto es común en planes gratuitos.

## Solución: Ejecutar desde Render Shell

### Opción 1: Usar Render Shell (Recomendado)

1. **Ve al dashboard de Render**: https://dashboard.render.com
2. **Selecciona tu servicio backend** (katze-backend o similar)
3. **Haz clic en "Shell" en el menú superior**
4. **Ejecuta estos comandos en orden**:

```bash
# 1. Ejecutar migraciones
node backend/run-migration.js

# 2. (OPCIONAL) Ejecutar seed (elimina datos existentes)
# Solo si quieres reiniciar con datos de prueba
node backend/seed-database.js
```

### Opción 2: Usar Variables de Entorno Locales

Si tienes acceso directo a la base de datos:

```powershell
# En PowerShell (Windows)
$env:DATABASE_URL = "postgresql://katze_88u4_user:KBijdmcP5FMvrxoZ5EXp1X2jDlVBXd8t@dpg-d4qdqerruibrs73djklg0-a.oregon-postgres.render.com:5432/katze_88u4"
node backend/run-migration.js
```

### Opción 3: Conectar desde Render Dashboard

1. Ve a tu base de datos en Render
2. Haz clic en "Connect" → "External Connection"
3. Copia la conexión string
4. Ve a tu servicio backend
5. Agrega un Deploy Hook o ejecuta manualmente

## Verificación

Después de ejecutar las migraciones, verifica que se aplicaron:

```sql
-- Conecta a tu base de datos con psql o desde Render Shell
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'adoption_applications'
ORDER BY ordinal_position;
```

Deberías ver estas columnas:
- `status` (varchar) con valores: procesando, revision_pendiente, rechazada_automaticamente, pendiente, aprobada, rechazada
- `ai_score` (integer)
- `ai_feedback` (text)
- `ai_flags` (text array)
- `ai_evaluated_at` (timestamp)
- `ai_error` (text)

## Migraciones Pendientes

Las siguientes migraciones deben ejecutarse en orden:

1. `add_ai_async_evaluation.sql` - Agrega columnas AI asíncronas
2. `add_living_space_and_breed.sql` - Agrega campos de espacio y raza
3. `add_tracking_view_and_functions.sql` - Crea vistas de seguimiento
4. `translate_status_to_spanish.sql` - Traduce estados a español

## Notas Importantes

⚠️ **ANTES de ejecutar el seed**: El seed eliminará TODOS los datos existentes. Haz backup si es necesario.

✅ **Las migraciones son seguras**: No eliminan datos, solo agregan columnas y actualizan constraints.

## Alternativa: Deploy Automático

Las migraciones se ejecutarán automáticamente en el próximo deploy si agregas esto a tu `package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "postdeploy": "node backend/run-migration.js"
  }
}
```

Luego haz commit y push:
```bash
git add .
git commit -m "feat: agregar sistema de evaluación IA asíncrona en español"
git push
```

Render ejecutará las migraciones automáticamente después del deploy.
