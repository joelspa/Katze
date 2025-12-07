-- Migración: Agregar vista y funciones para el sistema de seguimiento
-- Fecha: 2025-12-07
-- Descripción: Crea la vista v_tracking_tasks_details y la función mark_overdue_tasks()
--              para soportar el panel de seguimiento del administrador

-- PASO 0: Eliminar vistas existentes que puedan causar conflictos
DROP VIEW IF EXISTS v_tracking_tasks_details CASCADE;

-- PASO 1: Actualizar datos existentes antes de cambiar constraints
-- Convertir valores antiguos a los nuevos formatos
UPDATE tracking_tasks 
SET task_type = 'Seguimiento de Bienestar' 
WHERE task_type = 'bienestar';

UPDATE tracking_tasks 
SET task_type = 'Seguimiento de Esterilización' 
WHERE task_type IN ('esterilizacion', 'Verificación de Esterilización');

-- PASO 2: Actualizar los valores de task_type para que coincidan con el código
ALTER TABLE tracking_tasks 
DROP CONSTRAINT IF EXISTS tracking_tasks_task_type_check;

ALTER TABLE tracking_tasks 
ADD CONSTRAINT tracking_tasks_task_type_check 
CHECK (task_type IN ('Seguimiento de Bienestar', 'Seguimiento de Esterilización'));

-- PASO 3: Actualizar el constraint de status para incluir 'atrasada' (ya existe, no es necesario)
-- El status ya tiene los valores correctos según el diagnóstico

-- PASO 4: Agregar columnas faltantes si no existen (certificate_url y updated_at ya existen según diagnóstico)
-- Verificar y agregar solo si faltan
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='tracking_tasks' AND column_name='certificate_url') THEN
        ALTER TABLE tracking_tasks ADD COLUMN certificate_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='tracking_tasks' AND column_name='updated_at') THEN
        ALTER TABLE tracking_tasks ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Crear función para marcar tareas atrasadas automáticamente
CREATE OR REPLACE FUNCTION mark_overdue_tasks() RETURNS void AS $$
BEGIN
    UPDATE tracking_tasks 
    SET status = 'atrasada'
    WHERE status = 'pendiente' 
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Crear vista con detalles completos de las tareas de seguimiento
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
    u_adoptante.id as adoptante_id,
    u_adoptante.full_name as adoptante_name,
    u_adoptante.email as adoptante_email,
    u_adoptante.phone as adoptante_phone,
    -- Información del rescatista (owner del gato)
    c.owner_id,
    u_rescatista.full_name as rescatista_name,
    u_rescatista.email as rescatista_email,
    -- Información de la solicitud
    aa.status as application_status,
    aa.created_at as application_date
FROM tracking_tasks tt
JOIN adoption_applications aa ON tt.application_id = aa.id
JOIN cats c ON aa.cat_id = c.id
JOIN users u_adoptante ON aa.applicant_id = u_adoptante.id
LEFT JOIN users u_rescatista ON c.owner_id = u_rescatista.id;

-- Comentarios para documentación
COMMENT ON VIEW v_tracking_tasks_details IS 'Vista consolidada con todos los detalles de tareas de seguimiento, incluyendo información del gato, adoptante y rescatista';
COMMENT ON FUNCTION mark_overdue_tasks() IS 'Actualiza automáticamente el status de tareas pendientes con fecha vencida a "atrasada"';
COMMENT ON COLUMN tracking_tasks.certificate_url IS 'URL del certificado de esterilización o documento de bienestar subido a Firebase Storage';
COMMENT ON COLUMN tracking_tasks.updated_at IS 'Timestamp de la última actualización de la tarea';

-- Crear índice para mejorar el rendimiento de la vista
CREATE INDEX IF NOT EXISTS idx_tracking_status_date ON tracking_tasks(status, due_date);

-- Mensaje de confirmación
SELECT 'Vista v_tracking_tasks_details y función mark_overdue_tasks() creadas exitosamente' AS status;
