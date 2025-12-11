-- ===================================================================
-- SCRIPT COMPLETO DE BASE DE DATOS - KATZE
-- Base de datos PostgreSQL para plataforma de adopción de gatos
-- Incluye schema base + todas las migraciones aplicadas
-- ===================================================================

-- Eliminar objetos existentes para recreación limpia
DROP VIEW IF EXISTS v_tracking_tasks_details CASCADE;
DROP TABLE IF EXISTS tracking_tasks CASCADE;
DROP TABLE IF EXISTS adoption_applications CASCADE;
DROP TABLE IF EXISTS educational_posts CASCADE;
DROP TABLE IF EXISTS cats CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS mark_overdue_tasks() CASCADE;

-- ===================================================================
-- 1. TABLA DE USUARIOS
-- ===================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('adoptante', 'rescatista', 'admin')),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Usuarios del sistema: adoptantes, rescatistas y administradores';
COMMENT ON COLUMN users.role IS 'Rol del usuario: adoptante (busca adoptar), rescatista (publica gatos), admin (administrador)';

-- ===================================================================
-- 2. TABLA DE GATOS
-- ===================================================================
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
    breed VARCHAR(100) DEFAULT 'Mestizo',
    living_space_requirement VARCHAR(50) DEFAULT 'cualquiera' CHECK (living_space_requirement IN ('casa_grande', 'departamento', 'cualquiera')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE cats IS 'Gatos disponibles para adopción con toda su información';
COMMENT ON COLUMN cats.breed IS 'Raza del gato (ej: Siamés, Persa, Mestizo, etc.)';
COMMENT ON COLUMN cats.living_space_requirement IS 'Tipo de vivienda requerida: casa_grande, departamento, o cualquiera';
COMMENT ON COLUMN cats.sterilization_status IS 'Estado de esterilización: esterilizado, no_esterilizado, pendiente';
COMMENT ON COLUMN cats.approval_status IS 'Estado de aprobación por admin: aprobado, rechazado, pendiente';
COMMENT ON COLUMN cats.adoption_status IS 'Estado de adopción: disponible, en_proceso, adoptado';

-- ===================================================================
-- 3. TABLA DE SOLICITUDES DE ADOPCIÓN
-- ===================================================================
CREATE TABLE adoption_applications (
    id SERIAL PRIMARY KEY,
    cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
    applicant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'procesando' CHECK (status IN ('procesando', 'revision_pendiente', 'rechazada_automaticamente', 'pendiente', 'aprobada', 'rechazada', 'completada')),
    form_responses JSONB,
    ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_feedback TEXT,
    ai_flags TEXT[],
    ai_evaluated_at TIMESTAMP,
    ai_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE adoption_applications IS 'Solicitudes de adopción con evaluación automática por IA';
COMMENT ON COLUMN adoption_applications.status IS 'Estado: procesando (evaluando con IA), revision_pendiente (requiere revisión humana), rechazada_automaticamente (rechazado por IA), pendiente (legacy), aprobada, rechazada, completada';
COMMENT ON COLUMN adoption_applications.ai_score IS 'Puntuación de compatibilidad 0-100 calculada por IA';
COMMENT ON COLUMN adoption_applications.ai_feedback IS 'Explicación corta de la decisión de la IA';
COMMENT ON COLUMN adoption_applications.ai_flags IS 'Array de etiquetas en español: Casa Segura, Pro-Esterilización, Riesgo Venta, etc.';
COMMENT ON COLUMN adoption_applications.ai_evaluated_at IS 'Timestamp de cuándo la IA completó la evaluación';
COMMENT ON COLUMN adoption_applications.ai_error IS 'Mensaje de error si la evaluación falló';

-- ===================================================================
-- 4. TABLA DE SEGUIMIENTO POST-ADOPCIÓN
-- ===================================================================
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

COMMENT ON TABLE tracking_tasks IS 'Tareas de seguimiento post-adopción: bienestar y esterilización';
COMMENT ON COLUMN tracking_tasks.task_type IS 'Tipo de seguimiento: bienestar o esterilización';
COMMENT ON COLUMN tracking_tasks.status IS 'Estado de la tarea: pendiente, completada, atrasada';
COMMENT ON COLUMN tracking_tasks.certificate_url IS 'URL del certificado de esterilización (si aplica)';

-- ===================================================================
-- 5. TABLA DE CONTENIDO EDUCATIVO
-- ===================================================================
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

COMMENT ON TABLE educational_posts IS 'Artículos, noticias y contenido educativo sobre cuidado de gatos';
COMMENT ON COLUMN educational_posts.content_type IS 'Tipo de contenido: artículo, noticia, evento, etc.';

-- ===================================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
-- ===================================================================

-- Índices para tabla users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Índices para tabla cats
CREATE INDEX idx_cats_owner ON cats(owner_id);
CREATE INDEX idx_cats_status ON cats(approval_status, adoption_status);
CREATE INDEX idx_cats_living_space ON cats(living_space_requirement);
CREATE INDEX idx_cats_breed ON cats(breed);

-- Índices para tabla adoption_applications
CREATE INDEX idx_applications_cat ON adoption_applications(cat_id);
CREATE INDEX idx_applications_applicant ON adoption_applications(applicant_id);
CREATE INDEX idx_applications_procesando ON adoption_applications(status, created_at) WHERE status = 'procesando';
CREATE INDEX idx_applications_revision_pendiente ON adoption_applications(status, ai_score DESC) WHERE status = 'revision_pendiente';

-- Índices para tabla tracking_tasks
CREATE INDEX idx_tracking_application ON tracking_tasks(application_id);
CREATE INDEX idx_tracking_status_date ON tracking_tasks(status, due_date);

-- Índices para tabla educational_posts
CREATE INDEX idx_posts_author ON educational_posts(author_id);
CREATE INDEX idx_posts_category ON educational_posts(category);
CREATE INDEX idx_posts_created ON educational_posts(created_at DESC);

-- ===================================================================
-- FUNCIÓN: Marcar tareas atrasadas automáticamente
-- ===================================================================
CREATE OR REPLACE FUNCTION mark_overdue_tasks() RETURNS void AS $$
BEGIN
    UPDATE tracking_tasks 
    SET status = 'atrasada'
    WHERE status = 'pendiente' 
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mark_overdue_tasks() IS 'Marca automáticamente como atrasadas las tareas pendientes cuya fecha límite ya pasó. Ejecutar diariamente.';

-- ===================================================================
-- VISTA: Detalles completos de tareas de seguimiento
-- ===================================================================
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

COMMENT ON VIEW v_tracking_tasks_details IS 'Vista consolidada con todos los detalles de tareas de seguimiento, incluyendo información del gato, adoptante y rescatista';

-- ===================================================================
-- DATOS DE EJEMPLO (OPCIONAL - COMENTAR SI NO SE NECESITAN)
-- ===================================================================

-- Usuario Admin
INSERT INTO users (email, password_hash, full_name, role, phone) VALUES
('admin@katze.com', '$2b$10$example.hash.for.admin.password', 'Administrador Katze', 'admin', '+56912345678');

-- Usuario Rescatista
INSERT INTO users (email, password_hash, full_name, role, phone) VALUES
('rescatista@example.com', '$2b$10$example.hash.for.rescuer.password', 'María Rescatista', 'rescatista', '+56987654321');

-- Usuario Adoptante
INSERT INTO users (email, password_hash, full_name, role, phone) VALUES
('adoptante@example.com', '$2b$10$example.hash.for.adopter.password', 'Juan Adoptante', 'adoptante', '+56999999999');

-- Gato de ejemplo
INSERT INTO cats (name, description, age, health_status, sterilization_status, owner_id, approval_status, breed, living_space_requirement, story) VALUES
('Michi', 'Gato cariñoso y juguetón', 2, 'Sano', 'esterilizado', 2, 'aprobado', 'Mestizo', 'cualquiera', 'Rescatado de la calle en invierno');

-- ===================================================================
-- CONFIRMACIÓN DE CREACIÓN
-- ===================================================================
SELECT 'Base de datos Katze creada exitosamente' AS status,
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') AS total_tablas,
       (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') AS total_vistas,
       (SELECT COUNT(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace) AS total_funciones;
