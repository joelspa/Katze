-- SEED SIMPLIFICADO - KATZE
-- Datos básicos para demostración

-- Clean previous data
TRUNCATE TABLE tracking_tasks CASCADE;
TRUNCATE TABLE adoption_applications CASCADE;
TRUNCATE TABLE educational_posts CASCADE;
TRUNCATE TABLE cats CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE cats_id_seq RESTART WITH 1;
ALTER SEQUENCE adoption_applications_id_seq RESTART WITH 1;
ALTER SEQUENCE tracking_tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE educational_posts_id_seq RESTART WITH 1;

-- USUARIOS
-- PASSWORD PARA TODOS: "123"
-- Bcrypt hash: $2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu

INSERT INTO users (email, password_hash, full_name, role, phone, created_at) VALUES
('admin@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Admin Usuario', 'admin', '+591 7000 0001', NOW() - INTERVAL '1 year'),
('rescatista1@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'María Rescatista', 'rescatista', '+591 7000 0002', NOW() - INTERVAL '10 months'),
('rescatista2@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Juan Rescatista', 'rescatista', '+591 7000 0003', NOW() - INTERVAL '8 months'),
('adoptante1@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Ana Adoptante', 'adoptante', '+591 7000 0004', NOW() - INTERVAL '3 months'),
('adoptante2@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Carlos Adoptante', 'adoptante', '+591 7000 0005', NOW() - INTERVAL '2 months');

-- GATOS
INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, adoption_status, story, breed, living_space_requirement, created_at) VALUES
('Michi', 'Gato atigrado muy cariñoso', 2, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'], 2, 'aprobado', 'disponible', 'Rescatado de la calle', 'Mestizo', 'mediano', NOW() - INTERVAL '60 days'),
('Luna', 'Gatita blanca juguetona', 1, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1573865526739-10c1dd34340c'], 2, 'aprobado', 'disponible', 'Abandonada de pequeña', 'Mestizo', 'pequeño', NOW() - INTERVAL '45 days'),
('Felix', 'Gato negro elegante', 3, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1529778873920-4da4926a72c2'], 3, 'aprobado', 'disponible', 'Rescatado de refugio', 'Mestizo', 'mediano', NOW() - INTERVAL '30 days'),
('Nala', 'Gatita tricolor tímida', 2, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1533738363-b7f9aef128ce'], 2, 'aprobado', 'en_proceso', 'En proceso de adaptación', 'Mestizo', 'pequeño', NOW() - INTERVAL '20 days'),
('Simba', 'Gato naranja aventurero', 4, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13'], 3, 'aprobado', 'adoptado', 'Adoptado recientemente', 'Mestizo', 'grande', NOW() - INTERVAL '90 days');

-- SOLICITUDES DE ADOPCIÓN
INSERT INTO adoption_applications (cat_id, applicant_id, status, experience, living_space, has_other_pets, lifestyle, ai_score, ai_recommendation, created_at) VALUES
(1, 4, 'pendiente', 'Tengo experiencia con gatos', 'Departamento mediano', false, 'Trabajo desde casa', 85, 'Excelente candidato', NOW() - INTERVAL '5 days'),
(2, 5, 'aprobada', 'Primera vez con mascotas', 'Casa con jardín', false, 'Horario flexible', 78, 'Buen candidato', NOW() - INTERVAL '10 days'),
(4, 4, 'pendiente', 'He tenido gatos antes', 'Departamento', true, 'Trabajo medio tiempo', 90, 'Candidato ideal', NOW() - INTERVAL '2 days'),
(5, 5, 'completada', 'Experiencia amplia', 'Casa grande', true, 'Familia estable', 95, 'Adopción exitosa', NOW() - INTERVAL '60 days');

-- TAREAS DE SEGUIMIENTO
INSERT INTO tracking_tasks (application_id, task_type, due_date, completed, notes, created_at) VALUES
(4, 'bienestar', CURRENT_DATE + INTERVAL '30 days', false, 'Primera visita de seguimiento', NOW()),
(4, 'esterilizacion', CURRENT_DATE + INTERVAL '180 days', false, 'Verificar esterilización', NOW());

-- POSTS EDUCATIVOS
INSERT INTO educational_posts (title, content, author_id, category, image_url, created_at) VALUES
('Cómo Preparar tu Hogar para un Gato', 'Consejos básicos para adaptar tu hogar antes de adoptar un gato...', 1, 'Preparación', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', NOW() - INTERVAL '30 days'),
('Alimentación Felina: Guía Completa', 'Todo lo que necesitas saber sobre la alimentación de tu gato...', 2, 'Salud', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131', NOW() - INTERVAL '20 days'),
('Primeros Días con tu Nuevo Gato', 'Cómo ayudar a tu gato a adaptarse a su nuevo hogar...', 2, 'Adaptación', 'https://images.unsplash.com/photo-1511044568932-338cba0ad803', NOW() - INTERVAL '10 days');

-- Confirmar carga exitosa
SELECT 'Seed ejecutado exitosamente' AS status;
SELECT COUNT(*) AS total_usuarios FROM users;
SELECT COUNT(*) AS total_gatos FROM cats;
SELECT COUNT(*) AS total_solicitudes FROM adoption_applications;
