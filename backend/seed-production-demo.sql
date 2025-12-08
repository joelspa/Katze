-- SEED COMPLETO PARA DEMOSTRACIÓN EN PRODUCCIÓN
-- Incluye usuarios, gatos, solicitudes de adopción y posts educativos

-- ============================================
-- 1. USUARIOS (Admin, Rescatistas, Adoptantes)
-- ============================================
-- CONTRASEÑA PARA TODOS: 123

-- Admin
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@katze.com', '$2b$10$GjAyJ9PBh/BRLdrznH8mSO4SFfTr4m/81H1dkzIr9JnCHjVAVLjKG', 'Admin', '1234567890', 'admin');

-- Rescatistas
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('rescatista1@katze.com', '$2b$10$GjAyJ9PBh/BRLdrznH8mSO4SFfTr4m/81H1dkzIr9JnCHjVAVLjKG', 'Rescatista 1', '5551111111', 'rescatista'),
('rescatista2@katze.com', '$2b$10$GjAyJ9PBh/BRLdrznH8mSO4SFfTr4m/81H1dkzIr9JnCHjVAVLjKG', 'Rescatista 2', '5552222222', 'rescatista'),
('rescatista3@katze.com', '$2b$10$GjAyJ9PBh/BRLdrznH8mSO4SFfTr4m/81H1dkzIr9JnCHjVAVLjKG', 'Rescatista 3', '5553333333', 'rescatista');

-- Adoptantes
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('adoptante1@katze.com', '$2b$10$GjAyJ9PBh/BRLdrznH8mSO4SFfTr4m/81H1dkzIr9JnCHjVAVLjKG', 'Adoptante 1', '5554444444', 'adoptante'),
('adoptante2@katze.com', '$2b$10$GjAyJ9PBh/BRLdrznH8mSO4SFfTr4m/81H1dkzIr9JnCHjVAVLjKG', 'Adoptante 2', '5555555555', 'adoptante'),
('adoptante3@katze.com', '$2b$10$GjAyJ9PBh/BRLdrznH8mSO4SFfTr4m/81H1dkzIr9JnCHjVAVLjKG', 'Adoptante 3', '5556666666', 'adoptante'),
('adoptante4@katze.com', '$2b$10$GjAyJ9PBh/BRLdrznH8mSO4SFfTr4m/81H1dkzIr9JnCHjVAVLjKG', 'Adoptante 4', '5557777777', 'adoptante');

-- ============================================
-- 2. GATOS EN ADOPCIÓN
-- ============================================

-- Gatos de María López (rescatista ID 2) - APROBADOS Y DISPONIBLES
-- Nota: created_at se establece manualmente para simular diferentes tiempos de publicación
-- Los más antiguos aparecerán primero en el catálogo (ordenados por created_at ASC)

INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, adoption_status, story, breed, living_space_requirement, created_at) VALUES
('Whiskers', 'Gato adulto senior muy tranquilo. Ideal para personas mayores o solteros.', 8, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800'], 2, 'aprobado', 'disponible', 'Whiskers fue entregado al refugio cuando su dueño falleció. Es un compañero leal y cariñoso. Lleva más tiempo esperando adopción.', 'Mestizo', 'cualquiera', NOW() - INTERVAL '45 days'),

('Cleo', 'Gata negra misteriosa y cariñosa. Rompe todos los estereotipos sobre gatos negros.', 3, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800'], 2, 'aprobado', 'disponible', 'Cleo estuvo mucho tiempo en el refugio por ser negra. Es dulce, juguetona y merece una oportunidad.', 'Bombay', 'cualquiera', NOW() - INTERVAL '38 days'),

('Tigre', 'Gato rayado aventurero. Le gusta observar aves desde la ventana.', 4, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800'], 2, 'aprobado', 'disponible', 'Tigre fue rescatado de una colonia callejera. Está aprendiendo a confiar en los humanos nuevamente.', 'Tabby', 'cualquiera', NOW() - INTERVAL '30 days'),

('Luna', 'Gatita adorable y juguetona de color blanco con manchas grises. Le encanta perseguir juguetes y dormir al sol.', 2, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'], 2, 'aprobado', 'disponible', 'Luna fue rescatada de la calle cuando era una bebé. Ahora está completamente sana y busca un hogar lleno de amor.', 'Mestizo', 'cualquiera', NOW() - INTERVAL '25 days'),

('Simba', 'Gato naranja muy cariñoso y sociable. Excelente con niños y otras mascotas.', 3, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800'], 2, 'aprobado', 'disponible', 'Simba fue abandonado por su familia anterior. A pesar de eso, sigue siendo el gato más amoroso del refugio.', 'Naranja Tabby', 'cualquiera', NOW() - INTERVAL '20 days'),

('Pelusa', 'Gata tranquila y elegante de pelaje largo. Perfecta para departamentos.', 4, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800'], 2, 'aprobado', 'disponible', 'Pelusa fue rescatada de un refugio sobrepoblado. Es muy cariñosa y busca una familia tranquila.', 'Angora', 'departamento', NOW() - INTERVAL '15 days');

-- Gatos de Carlos Rodríguez (rescatista ID 3) - APROBADOS Y DISPONIBLES
INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, adoption_status, story, breed, living_space_requirement, created_at) VALUES
('Garfield', 'Gato grande y perezoso que ama comer y dormir. Muy tierno con su familia.', 5, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800'], 3, 'aprobado', 'disponible', 'Garfield fue encontrado en un restaurante donde lo alimentaban. Ahora busca un hogar donde pueda seguir siendo el rey.', 'Mestizo Naranja', 'cualquiera', NOW() - INTERVAL '12 days'),

('Nala', 'Gatita siamesa elegante y vocal. Le gusta conversar con sus humanos.', 2, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1573865526739-10c1dd7344f8?w=800'], 3, 'aprobado', 'disponible', 'Nala fue abandonada por mudanza. Es muy inteligente y aprende trucos rápidamente.', 'Siamés', 'cualquiera', NOW() - INTERVAL '8 days'),

('Milo', 'Gato joven muy activo. Necesita espacio para correr y jugar.', 2, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800'], 3, 'aprobado', 'disponible', 'Milo fue rescatado de una zona industrial. Le encantan los juegos interactivos y busca una familia activa.', 'Mestizo', 'casa_grande', NOW() - INTERVAL '5 days'),

('Michi', 'Gatito joven lleno de energía. Le encanta trepar y explorar.', 1, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800'], 3, 'aprobado', 'disponible', 'Michi fue encontrado en un parque, solo y asustado. Ahora es un gatito feliz que necesita un hogar activo.', 'Mestizo', 'cualquiera', NOW() - INTERVAL '2 days');

-- Gatos de Ana Martínez (rescatista ID 4)
INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, adoption_status, story, breed, living_space_requirement, created_at) VALUES
-- Gato PENDIENTE de aprobación (no aparecerá en catálogo público)
('Romeo', 'Gatito rescatado recientemente, en proceso de evaluación veterinaria.', 1, 'En evaluación', 'pendiente', ARRAY['https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=800'], 4, 'pendiente', 'disponible', 'Romeo acaba de ser rescatado y está recibiendo atención veterinaria.', 'Mestizo', 'cualquiera', NOW()),

-- Gato EN PROCESO de adopción (no aparecerá en catálogo como disponible)
('Max', 'Gato blanco de ojos azules, ya tiene adoptante en proceso.', 3, 'Saludable', 'esterilizado', ARRAY['https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800'], 4, 'aprobado', 'en_proceso', 'Max tiene una familia interesada que está completando el proceso de adopción.', 'Mestizo Blanco', 'cualquiera', NOW() - INTERVAL '10 days');

-- ============================================
-- 3. SOLICITUDES DE ADOPCIÓN
-- ============================================

-- Solicitud EXCELENTE (Juan Pérez adoptando a Luna) - REVISIÓN PENDIENTE
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(1, 5, 'revision_pendiente', 
'{
  "whyAdopt": "Resido en una casa amplia y segura, con espacios luminosos y un pequeño jardín donde los gatos pueden explorar sin riesgos. Tengo experiencia previa cuidando mascotas, incluyendo perros y un gato que vivió conmigo más de diez años. Deseo adoptar porque considero que brindar un hogar estable y afectuoso es una forma de devolver a los animales el amor y compañía que siempre nos ofrecen.",
  "hasExperience": true,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-05T10:30:00Z"
}',
95, 
'Candidato con motivación clara y positiva, acepta esterilización, espacio amplio y experiencia previa. Score 95/100.',
ARRAY['Motivación Genuina', 'Pro-Esterilización', 'Espacio Adecuado', 'Experiencia Previa', 'Casa'],
NOW() - INTERVAL '2 days');

-- Solicitud BUENA (Laura García adoptando a Simba) - REVISIÓN PENDIENTE
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(2, 6, 'revision_pendiente',
'{
  "whyAdopt": "Siempre he querido tener un gato. Trabajo desde casa y tengo tiempo para cuidarlo. Mi departamento es espacioso y tiene buena luz natural.",
  "hasExperience": false,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "apartamento",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-04T14:20:00Z"
}',
75,
'Candidato con acepta esterilización, espacio suficiente y tiempo disponible. Primer gato. Score 75/100.',
ARRAY['Pro-Esterilización', 'Espacio Adecuado', 'Primer Gato', 'Apartamento'],
NOW() - INTERVAL '3 days');

-- Solicitud PROBLEMÁTICA (Pedro Sánchez) - RECHAZADA AUTOMÁTICAMENTE
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(3, 7, 'rechazada_automaticamente',
'{
  "whyAdopt": "Quiero un gato porque se ven bonitos",
  "hasExperience": false,
  "hasSpace": false,
  "hasTime": false,
  "livingSpace": "apartamento",
  "hasOtherPets": false,
  "acceptsSterilization": false,
  "acceptsFollowUp": false,
  "submittedAt": "2024-12-03T09:15:00Z"
}',
20,
'Alerta: no acepta esterilización obligatoria. Motivación muy superficial. Score 20/100.',
ARRAY['Rechaza Esterilización', 'Primer Gato', 'Apartamento'],
NOW() - INTERVAL '4 days');

-- Solicitud APROBADA (Sofía Torres adoptando a Michi)
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(3, 8, 'aprobada',
'{
  "whyAdopt": "Tengo experiencia con gatos y busco darle un hogar a un gatito rescatado. Mi familia está emocionada de recibirlo y tenemos todo preparado: comederos, cama, juguetes y citas veterinarias programadas.",
  "hasExperience": true,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": true,
  "otherPetsDetails": "Tengo un perro golden retriever muy tranquilo que se lleva bien con gatos",
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-11-28T16:45:00Z"
}',
92,
'Candidato con motivación genuina, acepta esterilización, experiencia previa y espacio amplio. Score 92/100.',
ARRAY['Motivación Genuina', 'Pro-Esterilización', 'Espacio Adecuado', 'Experiencia Previa', 'Casa'],
NOW() - INTERVAL '9 days');

-- Solicitud PROCESANDO (Juan Pérez adoptando a Garfield)
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(5, 5, 'procesando',
'{
  "whyAdopt": "Me encantan los gatos grandes y tranquilos. Garfield sería perfecto para mí.",
  "hasExperience": true,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-06T11:00:00Z"
}',
NULL,
NULL,
NULL,
NULL);

-- Solicitud PENDIENTE (Laura García adoptando a Nala)
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(6, 6, 'pendiente',
'{
  "whyAdopt": "Los gatos siameses son hermosos e inteligentes. Tengo tiempo para dedicarle y enseñarle trucos.",
  "hasExperience": false,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "apartamento",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-05T08:30:00Z"
}',
70,
'Candidato acepta esterilización y tiene espacio. Primer gato. Score 70/100.',
ARRAY['Pro-Esterilización', 'Espacio Adecuado', 'Primer Gato', 'Apartamento'],
NOW() - INTERVAL '2 days');

-- ============================================
-- SOLICITUDES ADICIONALES (Más de 1 por gato)
-- ============================================

-- Whiskers (cat_id=1) - 3 solicitudes adicionales
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(1, 6, 'revision_pendiente',
'{
  "whyAdopt": "Busco un compañero tranquilo para mi jubilación. Whiskers parece perfecto para un estilo de vida relajado.",
  "hasExperience": true,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-04T09:00:00Z"
}',
88,
'Candidato con experiencia, acepta esterilización y busca gato senior. Score 88/100.',
ARRAY['Pro-Esterilización', 'Espacio Adecuado', 'Experiencia Previa', 'Casa'],
NOW() - INTERVAL '3 days'),

(1, 7, 'rechazada',
'{
  "whyAdopt": "Quiero un gato viejo porque son baratos",
  "hasExperience": false,
  "hasSpace": false,
  "hasTime": false,
  "livingSpace": "apartamento",
  "hasOtherPets": false,
  "acceptsSterilization": false,
  "acceptsFollowUp": false,
  "submittedAt": "2024-12-02T15:00:00Z"
}',
15,
'Motivación inapropiada y rechaza esterilización. Score 15/100.',
ARRAY['Rechaza Esterilización', 'Primer Gato'],
NOW() - INTERVAL '5 days');

-- Cleo (cat_id=2) - 2 solicitudes adicionales
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(2, 5, 'revision_pendiente',
'{
  "whyAdopt": "Me encantan los gatos negros y quiero romper el estigma. Cleo merece un hogar amoroso.",
  "hasExperience": true,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-01T10:00:00Z"
}',
93,
'Excelente candidato con motivación genuina para gato negro. Score 93/100.',
ARRAY['Motivación Genuina', 'Pro-Esterilización', 'Espacio Adecuado', 'Experiencia Previa', 'Casa'],
NOW() - INTERVAL '6 days'),

(2, 8, 'procesando',
'{
  "whyAdopt": "Siempre quise un gato negro. Son elegantes y misteriosos.",
  "hasExperience": false,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "apartamento",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-06T14:00:00Z"
}',
NULL,
NULL,
NULL,
NULL);

-- Luna (cat_id=4) - 2 solicitudes adicionales
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(4, 7, 'revision_pendiente',
'{
  "whyAdopt": "Luna parece una gatita dulce. Tengo experiencia con gatos y un hogar preparado.",
  "hasExperience": true,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-11-30T11:00:00Z"
}',
85,
'Buen candidato con experiencia y espacio adecuado. Score 85/100.',
ARRAY['Pro-Esterilización', 'Espacio Adecuado', 'Experiencia Previa', 'Casa'],
NOW() - INTERVAL '7 days'),

(4, 8, 'pendiente',
'{
  "whyAdopt": "Mi hija quiere un gato blanco. Luna es perfecta.",
  "hasExperience": false,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": true,
  "otherPetsDetails": "Un perro labrador",
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-05T16:00:00Z"
}',
72,
'Candidato acepta esterilización, tiene espacio y otras mascotas. Score 72/100.',
ARRAY['Pro-Esterilización', 'Espacio Adecuado', 'Primer Gato', 'Casa'],
NOW() - INTERVAL '2 days');

-- Simba (cat_id=5) - 3 solicitudes
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(5, 6, 'aprobada',
'{
  "whyAdopt": "Simba es perfecto para mi familia. Tenemos niños y necesitamos un gato sociable y paciente.",
  "hasExperience": true,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-11-25T09:00:00Z"
}',
94,
'Excelente familia para gato sociable. Score 94/100.',
ARRAY['Motivación Genuina', 'Pro-Esterilización', 'Espacio Adecuado', 'Experiencia Previa', 'Casa'],
NOW() - INTERVAL '12 days'),

(5, 7, 'revision_pendiente',
'{
  "whyAdopt": "Los gatos naranjas son amigables. Trabajo desde casa y puedo darle compañía.",
  "hasExperience": false,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "apartamento",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-03T12:00:00Z"
}',
78,
'Candidato con tiempo y espacio. Primer gato. Score 78/100.',
ARRAY['Pro-Esterilización', 'Espacio Adecuado', 'Primer Gato', 'Apartamento'],
NOW() - INTERVAL '4 days');

-- Garfield (cat_id=7) - 2 solicitudes adicionales
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(7, 8, 'revision_pendiente',
'{
  "whyAdopt": "Me gustan los gatos grandes y tranquilos como Garfield. Tengo un departamento espacioso.",
  "hasExperience": false,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "apartamento",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-04T10:00:00Z"
}',
76,
'Candidato acepta esterilización y tiene buen espacio. Score 76/100.',
ARRAY['Pro-Esterilización', 'Espacio Adecuado', 'Primer Gato', 'Apartamento'],
NOW() - INTERVAL '3 days');

-- Nala (cat_id=8) - 2 solicitudes adicionales
INSERT INTO adoption_applications (cat_id, applicant_id, status, form_responses, ai_score, ai_feedback, ai_flags, ai_evaluated_at) VALUES
(8, 5, 'revision_pendiente',
'{
  "whyAdopt": "Los siameses son inteligentes y comunicativos. Busco un gato con personalidad.",
  "hasExperience": true,
  "hasSpace": true,
  "hasTime": true,
  "livingSpace": "casa",
  "hasOtherPets": false,
  "acceptsSterilization": true,
  "acceptsFollowUp": true,
  "submittedAt": "2024-12-01T08:00:00Z"
}',
90,
'Excelente candidato con experiencia para gato siamés. Score 90/100.',
ARRAY['Pro-Esterilización', 'Espacio Adecuado', 'Experiencia Previa', 'Casa'],
NOW() - INTERVAL '6 days'),

(8, 7, 'rechazada_automaticamente',
'{
  "whyAdopt": "Quiero criar gatitos siameses para vender",
  "hasExperience": false,
  "hasSpace": true,
  "hasTime": false,
  "livingSpace": "casa",
  "hasOtherPets": false,
  "acceptsSterilization": false,
  "acceptsFollowUp": false,
  "submittedAt": "2024-11-29T14:00:00Z"
}',
10,
'Intención comercial detectada. Rechaza esterilización. Score 10/100.',
ARRAY['Rechaza Esterilización', 'Riesgo Venta'],
NOW() - INTERVAL '8 days');

-- ============================================
-- 4. POSTS EDUCATIVOS
-- ============================================

INSERT INTO educational_posts (title, content, author_id, category, image_url) VALUES
('Cuidados Básicos para Gatos', 
'Los gatos requieren cuidados específicos para mantener su salud y bienestar. Aquí te compartimos los puntos esenciales:

1. Alimentación balanceada
2. Agua fresca disponible 24/7
3. Caja de arena limpia
4. Visitas veterinarias regulares
5. Esterilización/castración
6. Tiempo de juego diario
7. Rascadores apropiados

Recuerda que un gato feliz es un gato saludable.',
1, 'cuidados', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'),

('¿Por qué Esterilizar a tu Gato?',
'La esterilización es fundamental para el bienestar de tu gato y para controlar la sobrepoblación felina.

Beneficios de la esterilización:
- Previene enfermedades reproductivas
- Reduce comportamientos agresivos
- Elimina el celo y maullidos nocturnos
- Evita camadas no deseadas
- Aumenta la esperanza de vida
- Reduce el instinto de escapar

La cirugía es segura y tu gato se recuperará rápidamente.',
1, 'salud', 'https://images.unsplash.com/photo-1573865526739-10c1dd7344f8?w=800'),

('Cómo Introducir un Gato a tu Hogar',
'Traer un gato nuevo a casa requiere preparación y paciencia. Sigue estos pasos:

1. Prepara una habitación segura inicial
2. Ten listos comederos, bebederos y caja de arena
3. Dale tiempo para explorar gradualmente
4. Respeta su espacio y ritmo de adaptación
5. Establece rutinas desde el primer día
6. Si tienes otras mascotas, introduce lentamente

Los primeros días son cruciales para establecer confianza.',
2, 'adopcion', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800'),

('Señales de que tu Gato está Enfermo',
'Aprende a identificar cuándo tu gato necesita atención veterinaria:

Señales de alerta:
- Pérdida de apetito por más de 24 horas
- Letargo o falta de energía
- Vómitos frecuentes
- Diarrea persistente
- Dificultad para respirar
- Cambios en el uso de la caja de arena
- Esconderse constantemente

Ante cualquier duda, consulta a tu veterinario.',
3, 'salud', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800');

-- ============================================
-- 5. TRACKING TASKS (Tareas de Seguimiento)
-- ============================================

-- Tareas pendientes para adopciones aprobadas
INSERT INTO tracking_tasks (application_id, task_type, description, due_date, status) VALUES
(4, 'bienestar', 'Visita de seguimiento de bienestar del gato Michi en su nuevo hogar', (NOW() + INTERVAL '30 days')::DATE, 'pendiente'),
(4, 'esterilizacion', 'Verificar que se completó el proceso de esterilización', (NOW() + INTERVAL '60 days')::DATE, 'pendiente');

-- Tarea completada
INSERT INTO tracking_tasks (application_id, task_type, description, due_date, status, notes) VALUES
(4, 'bienestar', 'Primera visita de seguimiento post-adopción', (NOW() - INTERVAL '5 days')::DATE, 'completada', 'El gato está adaptándose perfectamente. Familia muy comprometida.');

-- ============================================
-- RESUMEN DE DATOS CARGADOS
-- ============================================
-- 8 usuarios (1 admin, 3 rescatistas, 4 adoptantes)
-- 12 gatos (10 disponibles, 1 pendiente aprobación, 1 en proceso)
-- 6 solicitudes de adopción (variedad de estados)
-- 4 posts educativos
-- 4 tareas de seguimiento
