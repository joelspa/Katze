-- SCHEMA COMPLETO PARA KATZE
-- Base de datos PostgreSQL para plataforma de adopción de gatos

-- Eliminar tablas si existen (para recreación limpia)
DROP TABLE IF EXISTS tracking_tasks CASCADE;
DROP TABLE IF EXISTS adoption_applications CASCADE;
DROP TABLE IF EXISTS educational_posts CASCADE;
DROP TABLE IF EXISTS cats CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. TABLA DE USUARIOS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('adoptante', 'rescatista', 'admin')),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE GATOS
CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    age INTEGER,
    health_status VARCHAR(100),
    sterilization_status VARCHAR(50) CHECK (sterilization_status IN ('esterilizado', 'no_esterilizado', 'pendiente')),
    photos_url TEXT[],
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    approval_status VARCHAR(50) DEFAULT 'pendiente' CHECK (approval_status IN ('aprobado', 'rechazado', 'pendiente')),
    adoption_status VARCHAR(50) DEFAULT 'disponible' CHECK (adoption_status IN ('disponible', 'en_proceso', 'adoptado')),
    story TEXT,
    breed VARCHAR(100),
    living_space_requirement VARCHAR(50) CHECK (living_space_requirement IN ('casa_grande', 'departamento', 'cualquiera')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA DE SOLICITUDES DE ADOPCIÓN
CREATE TABLE adoption_applications (
    id SERIAL PRIMARY KEY,
    cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
    applicant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'procesando' CHECK (status IN ('procesando', 'revision_pendiente', 'rechazada_automaticamente', 'pendiente', 'aprobada', 'rechazada')),
    form_responses JSONB,
    ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_feedback TEXT,
    ai_flags TEXT[],
    ai_evaluated_at TIMESTAMP,
    ai_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA DE SEGUIMIENTO (TRACKING)
CREATE TABLE tracking_tasks (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES adoption_applications(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('Seguimiento de Bienestar', 'Seguimiento de Esterilización', 'bienestar', 'esterilizacion')),
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'completada', 'atrasada')),
    description TEXT,
    notes TEXT,
    certificate_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA DE POSTS EDUCATIVOS
CREATE TABLE educational_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100),
    image_url TEXT,
    content_type VARCHAR(50),
    event_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_cats_owner ON cats(owner_id);
CREATE INDEX idx_cats_status ON cats(approval_status, adoption_status);
CREATE INDEX idx_applications_cat ON adoption_applications(cat_id);
CREATE INDEX idx_applications_applicant ON adoption_applications(applicant_id);
CREATE INDEX idx_tracking_application ON tracking_tasks(application_id);
CREATE INDEX idx_tracking_status_date ON tracking_tasks(status, due_date);
CREATE INDEX idx_posts_author ON educational_posts(author_id);

-- FUNCIONES Y VISTAS PARA SEGUIMIENTO

-- Función para marcar tareas atrasadas automáticamente
CREATE OR REPLACE FUNCTION mark_overdue_tasks() RETURNS void AS $$
BEGIN
    UPDATE tracking_tasks 
    SET status = 'atrasada'
    WHERE status = 'pendiente' 
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Vista con detalles completos de las tareas de seguimiento
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

-- Confirmar creación exitosa
SELECT 'Schema creado exitosamente' AS status;
