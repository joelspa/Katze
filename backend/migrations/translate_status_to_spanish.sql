-- Migración: Traducir estados de adopción a español
-- Fecha: 2025-12-07
-- Descripción: Convierte los estados en inglés a español para coherencia

-- PASO 1: Eliminar vista que depende de adoption_applications.status
DROP VIEW IF EXISTS v_tracking_tasks_details CASCADE;

-- PASO 2: Actualizar datos existentes
UPDATE adoption_applications 
SET status = 'procesando' 
WHERE status = 'processing';

UPDATE adoption_applications 
SET status = 'revision_pendiente' 
WHERE status = 'pending_review';

UPDATE adoption_applications 
SET status = 'rechazada_automaticamente' 
WHERE status = 'auto_rejected';

-- PASO 3: Eliminar constraint antiguo
ALTER TABLE adoption_applications 
DROP CONSTRAINT IF EXISTS adoption_applications_status_check;

-- PASO 4: Agregar nuevo constraint con valores en español (permite inglés temporalmente)
ALTER TABLE adoption_applications
ADD CONSTRAINT adoption_applications_status_check 
CHECK (status IN ('procesando', 'revision_pendiente', 'rechazada_automaticamente', 'pendiente', 'aprobada', 'rechazada', 'processing', 'pending_review', 'auto_rejected', 'completada'));

-- PASO 5: Cambiar default a 'procesando'
ALTER TABLE adoption_applications
ALTER COLUMN status SET DEFAULT 'procesando';

-- PASO 6: Actualizar índices
DROP INDEX IF EXISTS idx_applications_processing;
DROP INDEX IF EXISTS idx_applications_pending_review;

CREATE INDEX idx_applications_procesando 
ON adoption_applications(status, created_at) 
WHERE status = 'procesando';

CREATE INDEX idx_applications_revision_pendiente 
ON adoption_applications(status, ai_score DESC) 
WHERE status = 'revision_pendiente';

-- PASO 7: Actualizar comentarios
COMMENT ON COLUMN adoption_applications.status IS 'Estado: procesando (evaluando con IA), revision_pendiente (requiere revisión humana), rechazada_automaticamente (rechazado por IA), pendiente (legacy), aprobada, rechazada';
COMMENT ON COLUMN adoption_applications.ai_score IS 'Puntuación de compatibilidad 0-100 calculada por IA';
COMMENT ON COLUMN adoption_applications.ai_feedback IS 'Explicación corta de la decisión de la IA';
COMMENT ON COLUMN adoption_applications.ai_flags IS 'Array de etiquetas en español: Casa Segura, Pro-Esterilización, Riesgo Venta, etc.';

-- PASO 8: Recrear vista de tracking
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
    -- Información del adoptante
    u_adoptante.id as applicant_id,
    u_adoptante.full_name as applicant_name,
    u_adoptante.email as applicant_email,
    u_adoptante.phone as applicant_phone,
    -- Información del rescatista
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

COMMENT ON VIEW v_tracking_tasks_details IS 'Vista consolidada con todos los detalles de tareas de seguimiento (con estados en español)';
