-- ============================================
-- SEED DE PRODUCCIÓN PARA KATZE - VERSIÓN SIMPLIFICADA
-- Demostración completa de todas las funcionalidades
-- ============================================

BEGIN;

-- 1. LIMPIAR DATOS EXISTENTES (en orden para respetar foreign keys)
TRUNCATE TABLE tracking_tasks CASCADE;
TRUNCATE TABLE adoption_applications CASCADE;
TRUNCATE TABLE cats CASCADE;
TRUNCATE TABLE educational_posts CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE cats_id_seq RESTART WITH 1;
ALTER SEQUENCE adoption_applications_id_seq RESTART WITH 1;
ALTER SEQUENCE tracking_tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE educational_posts_id_seq RESTART WITH 1;

-- 2. INSERTAR USUARIOS
-- Nota: Password '123' hasheado con bcrypt (rounds=10)
-- Hash: $2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm

-- Admin (ID: 1)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'María Rodríguez', '0999123456', 'admin');

-- Rescatistas (IDs: 2, 3, 4)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('ana.garcia@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Ana García', '0998765432', 'rescatista'),
('carlos.lopez@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Carlos López', '0987654321', 'rescatista'),
('lucia.martinez@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Lucía Martínez', '0976543210', 'rescatista');

-- Adoptantes (IDs: 5-11)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('juan.perez@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Juan Pérez', '0965432109', 'adoptante'),
('sofia.ramirez@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Sofía Ramírez', '0954321098', 'adoptante'),
('miguel.torres@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Miguel Torres', '0943210987', 'adoptante'),
('valentina.castro@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Valentina Castro', '0932109876', 'adoptante'),
('diego.morales@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Diego Morales', '0921098765', 'adoptante'),
('daniela.vega@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Daniela Vega', '0910987654', 'adoptante'),
('andres.silva@katze.com', '$2b$10$rBV2kM5zIJVT7hFqG.5fKO9L8zXJZ.8sQJ0QqxN8YQ2X5nJ6ZYvQm', 'Andrés Silva', '0909876543', 'adoptante');

-- 3. INSERTAR GATOS CON MÚLTIPLES IMÁGENES
INSERT INTO cats (name, description, age, breed, health_status, sterilization_status, photos_url, approval_status, owner_id, story, living_space_requirement) VALUES
-- Gatos aprobados (IDs: 1-8)
('Luna', 'Gatita juguetona y muy cariñosa, ideal para familias', 0, 'Mestizo', 'saludable', 'pendiente', 
 ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800', 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800'], 
 'aprobado', 2, 'Luna fue encontrada en un parque junto a sus hermanos. Es muy activa y le encanta jugar.', 'cualquiera'),

('Mishi', 'Gato tranquilo y elegante, perfecto para apartamento', 1, 'Siamés', 'saludable', 'esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800'], 
 'aprobado', 2, 'Mishi es un gato muy educado que disfruta de las caricias y los lugares tranquilos.', 'departamento'),

('Pelusa', 'Gata independiente pero cariñosa', 4, 'Persa', 'saludable', 'esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1573865526739-10c1d3a1f0ed?w=800', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800', 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800'], 
 'aprobado', 3, 'Pelusa fue rescatada de una situación de abandono. Perfecta para hogares tranquilos.', 'casa_grande'),

('Tigre', 'Gato activo y juguetón, necesita espacio', 4, 'Bengalí', 'saludable', 'esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800', 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800'], 
 'aprobado', 3, 'Tigre es un gato muy energético que necesita estimulación mental y física.', 'casa_grande'),

('Nieve', 'Gatita senior, muy tranquila y amorosa', 9, 'Angora', 'necesita_atencion', 'esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1493406300581-484b937cdc41?w=800', 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=800', 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800'], 
 'aprobado', 4, 'Nieve busca un hogar tranquilo para sus últimos años. Necesita medicación para artritis.', 'cualquiera'),

('Garfield', 'Gato naranja muy sociable y glotón', 4, 'Común Europeo', 'saludable', 'esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800', 'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=800', 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?w=800'], 
 'aprobado', 4, 'Garfield adora comer y dormir. Es muy sociable. Necesita control de peso.', 'cualquiera'),

('Shadow', 'Gato negro elegante y misterioso', 1, 'Común Europeo', 'saludable', 'esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800', 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800', 'https://images.unsplash.com/photo-1507984211203-76701d7bb120?w=800'], 
 'aprobado', 2, 'Shadow es muy inteligente y curioso. Le encanta explorar.', 'departamento'),

('Canela', 'Gatita bebé, necesita cuidados especiales', 0, 'Mestizo', 'saludable', 'pendiente', 
 ARRAY['https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800'], 
 'aprobado', 3, 'Canela tiene apenas 2 meses. Necesita adoptante con experiencia en cachorros.', 'casa_grande'),

-- Gatos pendientes (IDs: 9-10)
('Manchas', 'Gato con manchas únicas, muy cariñoso', 2, 'Mestizo', 'saludable', 'esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800', 'https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?w=800'], 
 'pendiente', 2, 'Manchas fue rescatado de la calle. Es muy amigable y busca un hogar definitivo.', 'cualquiera'),

('Peludo', 'Gato de pelo largo que necesita cepillado regular', 3, 'Maine Coon', 'saludable', 'esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1518288774672-b94e808873ff?w=800', 'https://images.unsplash.com/photo-1592652426689-4162d60ec11a?w=800'], 
 'pendiente', 3, 'Peludo requiere cuidados especiales para su pelaje pero es muy cariñoso.', 'casa_grande'),

-- Gato rechazado (ID: 11)
('Tom', 'Gato que necesita tratamiento médico especializado', 5, 'Mestizo', 'necesita_atencion', 'no_esterilizado', 
 ARRAY['https://images.unsplash.com/photo-1547955922-85912e223015?w=800'], 
 'rechazado', 4, 'Tom necesita atención veterinaria especializada.', 'casa_grande');

-- 4. INSERTAR SOLICITUDES DE ADOPCIÓN
INSERT INTO adoption_applications (applicant_id, cat_id, form_responses, status, ai_evaluated_at, ai_score, ai_feedback) VALUES
-- Aprobadas (IDs: 1-3)
(5, 1, '{"message": "Tengo experiencia con gatos cachorros y un hogar ideal para Luna. Tengo jardín amplio y mucho tiempo para dedicarle.", "housing_type": "casa", "has_experience": true}'::jsonb, 
 'aprobada', NOW() - INTERVAL '5 days', 85, 'Adoptante con experiencia y espacio adecuado'),

(6, 2, '{"message": "Vivo sola en un departamento tranquilo y trabajo desde casa. Busco compañía y Mishi parece perfecto.", "housing_type": "departamento", "has_experience": false}'::jsonb, 
 'aprobada', NOW() - INTERVAL '3 days', 75, 'Buen ambiente pero falta experiencia. Requiere seguimiento'),

(7, 3, '{"message": "Familia con casa grande, experiencia con gatos persas. Pelusa sería perfecta para nosotros.", "housing_type": "casa", "has_experience": true}'::jsonb, 
 'aprobada', NOW() - INTERVAL '7 days', 90, 'Excelente compatibilidad familiar y experiencia'),

-- Procesando (IDs: 4-6)
(8, 4, '{"message": "Me encantan los gatos activos. Tengo jardín y tiempo para jugar con Tigre todos los días.", "housing_type": "casa", "has_experience": true}'::jsonb, 
 'procesando', NULL, NULL, NULL),

(9, 5, '{"message": "Soy jubilado y busco compañía tranquila. Nieve y yo haríamos buena pareja. Tengo experiencia cuidando gatos seniors.", "housing_type": "casa", "has_experience": true}'::jsonb, 
 'procesando', NULL, NULL, NULL),

(10, 6, '{"message": "Familia con niños, queremos enseñarles responsabilidad. Garfield parece perfecto.", "housing_type": "casa", "has_experience": false}'::jsonb, 
 'procesando', NULL, NULL, NULL),

-- Revisión pendiente (ID: 7)
(11, 7, '{"message": "Trabajo de noche y estoy en casa de día. Shadow me haría compañía. Tengo experiencia con gatos negros.", "housing_type": "departamento", "has_experience": true}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '2 days', 68, 'Horario compatible pero espacio limitado. Revisar condiciones'),

-- Rechazadas automáticamente (IDs: 8-9)
(8, 8, '{"message": "Quiero un gato"}'::jsonb, 
 'rechazada_automaticamente', NOW() - INTERVAL '1 day', 25, 'Mensaje muy breve, falta información sobre experiencia y hogar'),

(10, 1, '{"message": "Viajo mucho por trabajo pero quiero un gato en casa", "housing_type": "departamento"}'::jsonb, 
 'rechazada_automaticamente', NOW() - INTERVAL '2 days', 30, 'No puede proporcionar cuidado constante debido a viajes frecuentes'),

-- Rechazada manualmente (ID: 10)
(9, 2, '{"message": "Mi departamento es pequeño pero tengo buenas intenciones. No tengo experiencia.", "housing_type": "departamento", "has_experience": false}'::jsonb, 
 'rechazada', NOW() - INTERVAL '4 days', 60, 'Espacio reducido para las necesidades del gato');

-- 5. INSERTAR TAREAS DE SEGUIMIENTO  
INSERT INTO tracking_tasks (application_id, task_type, due_date, status, description) VALUES
(1, 'bienestar', NOW() - INTERVAL '4 days', 'completada', 'Primera visita veterinaria post-adopción'),
(1, 'bienestar', NOW() - INTERVAL '2 days', 'completada', 'Verificar adaptación al nuevo hogar'),
(1, 'bienestar', NOW() + INTERVAL '5 days', 'pendiente', 'Llamada de seguimiento general'),
(2, 'bienestar', NOW() - INTERVAL '2 days', 'completada', 'Chequeo veterinario inicial'),
(2, 'bienestar', NOW() + INTERVAL '1 day', 'pendiente', 'Visita domiciliaria para verificar adaptación'),
(2, 'bienestar', NOW() + INTERVAL '7 days', 'pendiente', 'Seguimiento de comportamiento'),
(3, 'bienestar', NOW() - INTERVAL '6 days', 'completada', 'Control veterinario completo'),
(3, 'bienestar', NOW() - INTERVAL '3 days', 'completada', 'Primera visita de seguimiento'),
(3, 'bienestar', NOW() - INTERVAL '1 day', 'atrasada', 'Evaluación de integración familiar'),
(3, 'bienestar', NOW() + INTERVAL '10 days', 'pendiente', 'Seguimiento final');

-- 6. INSERTAR POSTS EDUCATIVOS
INSERT INTO educational_posts (title, content, category, image_url, author_id) VALUES
('Guía Completa: Cómo Cuidar a tu Gato Recién Adoptado', 'Los primeros días con tu nuevo gato son cruciales. Preparación del hogar, alimentación, litter box, y más.', 'cuidados_basicos', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200', 1),
('Nutrición Felina: Qué Debe Comer tu Gato', 'Una dieta balanceada es fundamental. Los gatos son carnívoros obligados y necesitan taurina en su dieta.', 'cuidados_basicos', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200', 1),
('Cómo Mantener la Higiene de tu Gato', 'El cepillado regular, el cuidado dental, y el corte de uñas son esenciales.', 'cuidados_basicos', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1200', 1),
('Vacunas Esenciales para Gatos: Calendario Completo', 'Las vacunas protegen a tu gato de enfermedades graves. Conoce el calendario completo.', 'salud', 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=1200', 1),
('Señales de Alerta: Cuándo Llevar a tu Gato al Veterinario', 'Aprende a identificar síntomas de enfermedad: cambios en el apetito, letargo, vómitos, diarrea.', 'salud', 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=1200', 1),
('Parásitos en Gatos: Prevención y Tratamiento', 'Pulgas, garrapatas, y parásitos internos pueden afectar la salud de tu gato.', 'salud', 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0ed?w=1200', 1),
('Entendiendo el Lenguaje Corporal Felino', 'Los gatos se comunican principalmente a través de su cuerpo. Posición de orejas, cola, pupilas.', 'comportamiento', 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=1200', 1),
('Cómo Solucionar Problemas de Comportamiento', 'Arañazos inapropiados, marcaje con orina, agresividad. Descubre las causas y soluciones.', 'comportamiento', 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=1200', 1),
('Juegos y Enriquecimiento para Gatos de Interior', 'Los gatos de interior necesitan estimulación mental y física. Ideas de juguetes y actividades.', 'comportamiento', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200', 1),
('Antes de Adoptar: ¿Estás Listo para un Gato?', 'Adoptar un gato es un compromiso a largo plazo. Evalúa tu estilo de vida, presupuesto, tiempo, y espacio.', 'adopcion_responsable', 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=1200', 1),
('Preparando tu Hogar para la Llegada de un Gato', 'Lista completa de suministros y cómo hacer tu hogar seguro eliminando peligros.', 'adopcion_responsable', 'https://images.unsplash.com/photo-1518288774672-b94e808873ff?w=1200', 1),
('Adoptando un Gato Senior: Beneficios y Consideraciones', 'Los gatos mayores son excelentes compañeros. Personalidad establecida, menos energía, mucho amor por dar.', 'adopcion_responsable', 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=1200', 1);

COMMIT;

-- RESUMEN: 11 usuarios | 11 gatos | 10 solicitudes | 10 tareas | 12 posts
-- Password: 123 para todos | Emails: @katze.com
