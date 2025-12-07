-- Migración: Sistema de evaluación asíncrona con IA
-- Fecha: 2025-12-07
-- Descripción: Agrega columnas para procesamiento asíncrono de solicitudes con IA

-- PASO 0: Eliminar vista que depende de adoption_applications.status
DROP VIEW IF EXISTS v_tracking_tasks_details CASCADE;

-- Modificar columna status para incluir nuevos estados
ALTER TABLE adoption_applications 
DROP CONSTRAINT IF EXISTS adoption_applications_status_check;

ALTER TABLE adoption_applications
ALTER COLUMN status TYPE VARCHAR(50);

ALTER TABLE adoption_applications
ADD CONSTRAINT adoption_applications_status_check 
CHECK (status IN ('processing', 'pending_review', 'auto_rejected', 'pendiente', 'aprobada', 'rechazada'));

-- Cambiar default a 'processing' para nuevas solicitudes
ALTER TABLE adoption_applications
ALTER COLUMN status SET DEFAULT 'processing';

-- Agregar columnas de evaluación IA
ALTER TABLE adoption_applications
ADD COLUMN IF NOT EXISTS ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
ADD COLUMN IF NOT EXISTS ai_feedback TEXT,
ADD COLUMN IF NOT EXISTS ai_flags TEXT[],
ADD COLUMN IF NOT EXISTS ai_evaluated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS ai_error TEXT;

-- Crear índice para optimizar consultas del worker
CREATE INDEX IF NOT EXISTS idx_applications_processing 
ON adoption_applications(status, created_at) 
WHERE status = 'processing';

-- Crear índice para dashboard de rescatistas
CREATE INDEX IF NOT EXISTS idx_applications_pending_review 
ON adoption_applications(status, ai_score DESC) 
WHERE status = 'pending_review';

-- Comentarios para documentación
COMMENT ON COLUMN adoption_applications.status IS 'Estado: processing (evaluando), pending_review (requiere revisión humana), auto_rejected (rechazado por IA), pendiente (legacy), aprobada, rechazada';
COMMENT ON COLUMN adoption_applications.ai_score IS 'Puntuación de compatibilidad 0-100 calculada por IA';
COMMENT ON COLUMN adoption_applications.ai_feedback IS 'Explicación corta de la decisión de la IA';
COMMENT ON COLUMN adoption_applications.ai_flags IS 'Array de etiquetas: Casa Segura, Pro-Esterilización, Riesgo Venta, etc.';
COMMENT ON COLUMN adoption_applications.ai_evaluated_at IS 'Timestamp de cuándo la IA completó la evaluación';
COMMENT ON COLUMN adoption_applications.ai_error IS 'Mensaje de error si la evaluación falló';

-- PASO FINAL: Recrear vista de tracking que fue eliminada
CREATE OR REPLACE VIEW v_tracking_tasks_details AS
SELECT 
    tt.id,
    tt.application_id,
    tt.task_type,
    tt.due_date,
    tt.status,
    tt.description,
    tt.notes,
    tt.certificate_url,
    tt.created_at,
    tt.updated_at,
    -- Información del gato
    c.id as cat_id,
    c.name as cat_name,
    c.photos_url as cat_photos,
    c.sterilization_status,
    -- Información del adoptante (Alias para coincidir con frontend)
    u_adoptante.id as applicant_id,
    u_adoptante.full_name as applicant_name,
    u_adoptante.email as applicant_email,
    u_adoptante.phone as applicant_phone,
    -- Información del rescatista (owner del gato)
    c.owner_id,
    u_rescatista.full_name as owner_name,
    u_rescatista.email as owner_email,
    -- Información de la solicitud
    aa.status as application_status,
    aa.created_at as application_date
FROM tracking_tasks tt
JOIN adoption_applications aa ON tt.application_id = aa.id
JOIN cats c ON aa.cat_id = c.id
JOIN users u_adoptante ON aa.applicant_id = u_adoptante.id
LEFT JOIN users u_rescatista ON c.owner_id = u_rescatista.id;

COMMENT ON VIEW v_tracking_tasks_details IS 'Vista consolidada con todos los detalles de tareas de seguimiento (recreada después de modificar adoption_applications.status)';
