-- SEED DATA - Katze System
-- Realistic data to demonstrate all functionalities including AI evaluation
-- Updated: December 2025 - Includes AI evaluations, living space, and breed

-- Clean previous data
TRUNCATE TABLE tracking_tasks CASCADE;
TRUNCATE TABLE adoption_applications CASCADE;
TRUNCATE TABLE educational_posts CASCADE;
TRUNCATE TABLE cats CASCADE;
TRUNCATE TABLE users CASCADE;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE cats_id_seq RESTART WITH 1;
ALTER SEQUENCE adoption_applications_id_seq RESTART WITH 1;
ALTER SEQUENCE tracking_tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE educational_posts_id_seq RESTART WITH 1;

-- 1. USERS (10 users for easy testing)
-- PASSWORD FOR ALL: "123"
-- Bcrypt hash: $2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu

INSERT INTO users (email, password_hash, full_name, role, phone, created_at) VALUES
-- ADMIN
('admin@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Admin Usuario', 'admin', '+591 7000 0001', NOW() - INTERVAL '1 year'),

-- RESCUERS (4 active rescuers)
('rescatista1@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Rescatista Uno', 'rescatista', '+591 7000 0002', NOW() - INTERVAL '10 months'),
('rescatista2@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Rescatista Dos', 'rescatista', '+591 7000 0003', NOW() - INTERVAL '8 months'),
('rescatista3@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Rescatista Tres', 'rescatista', '+591 7000 0004', NOW() - INTERVAL '6 months'),
('rescatista4@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Rescatista Cuatro', 'rescatista', '+591 7000 0005', NOW() - INTERVAL '4 months'),

-- ADOPTERS (15 adopters with different profiles for comprehensive testing)
('adoptante1@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Uno', 'adoptante', '+591 7000 0006', NOW() - INTERVAL '3 months'),
('adoptante2@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Dos', 'adoptante', '+591 7000 0007', NOW() - INTERVAL '2 months'),
('adoptante3@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Tres', 'adoptante', '+591 7000 0008', NOW() - INTERVAL '1 month'),
('adoptante4@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Cuatro', 'adoptante', '+591 7000 0009', NOW() - INTERVAL '20 days'),
('adoptante5@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Cinco', 'adoptante', '+591 7000 0010', NOW() - INTERVAL '10 days'),
('adoptante6@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Experiencia', 'adoptante', '+591 7000 0011', NOW() - INTERVAL '5 months'),
('adoptante7@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Primerizo', 'adoptante', '+591 7000 0012', NOW() - INTERVAL '15 days'),
('adoptante8@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante MultiMascota', 'adoptante', '+591 7000 0013', NOW() - INTERVAL '8 months'),
('adoptante9@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Activo', 'adoptante', '+591 7000 0014', NOW() - INTERVAL '25 days'),
('adoptante10@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Rechazado', 'adoptante', '+591 7000 0015', NOW() - INTERVAL '45 days'),
('adoptante11@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Problematico', 'adoptante', '+591 7000 0016', NOW() - INTERVAL '30 days'),
('adoptante12@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante SinPreparacion', 'adoptante', '+591 7000 0017', NOW() - INTERVAL '18 days'),
('adoptante13@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Ideal', 'adoptante', '+591 7000 0018', NOW() - INTERVAL '6 months'),
('adoptante14@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Estudiante', 'adoptante', '+591 7000 0019', NOW() - INTERVAL '40 days'),
('adoptante15@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Senior', 'adoptante', '+591 7000 0020', NOW() - INTERVAL '7 months');

-- 2. CATS (18 cats with various states - includes living space and breed)

INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, adoption_status, story, breed, living_space_requirement, created_at) VALUES
-- APPROVED AND AVAILABLE CATS (sorted by age to demonstrate system)
('Veterano', 
 'Gato gris senior de 8 años, muy tranquilo y cariñoso. Perfecto para personas que buscan un compañero tranquilo.', 
 8, 
 'Saludable, tratamiento crónico controlado', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1574158622682-e40e69881006", "https://images.unsplash.com/photo-1592194996308-7b43878e84a6"}', 
 2, 
 'aprobado', 
 'disponible',
 'Veterano fue abandonado después de 7 años con su familia. Es un gato noble que merece terminar sus días en un hogar amoroso.',
 'Mestizo',
 'cualquiera',
 NOW() - INTERVAL '180 days'),

-- 🟠 SEGUNDO MÁS ANTIGUO (150 días = 5 meses)
('Luna', 
 'Gatita blanca muy cariñosa y juguetona. Le encanta dormir en lugares altos y perseguir juguetes.', 
 4, 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba", "https://images.unsplash.com/photo-1529257414772-1960b7bea4eb"}', 
 2, 
 'aprobado', 
 'disponible',
 'Luna fue encontrada en un parque cuando apenas tenía 2 meses. Estaba sola, asustada y muy hambrienta.',
 'Mestizo',
 'cualquiera',
 NOW() - INTERVAL '150 days'),

-- 🟡 TERCER MÁS ANTIGUO (120 días = 4 meses)
('Michi', 
 'Gato naranja de 2 años, muy tranquilo. Perfecto para departamentos.', 
 4, 
 'Saludable, desparasitado', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1574158622682-e40e69881006", "https://images.unsplash.com/photo-1592194996308-7b43878e84a6"}', 
 2, 
 'aprobado', 
 'disponible',
 'Michi fue abandonado en una clínica veterinaria. Merece una segunda oportunidad.',
 'Mestizo',
 'departamento',
 NOW() - INTERVAL '120 days'),

-- 🟢 CUARTO MÁS ANTIGUO (90 días = 3 meses)
('Nala', 
 'Gatita tricolor de 1 año. Energética y cariñosa, se lleva bien con otros gatos.', 
 1, 
 'Saludable, todas las vacunas', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8", "https://images.unsplash.com/photo-1548247416-ec66f4900b2e"}', 
 3, 
 'aprobado', 
 'disponible',
 'Nala fue rescatada de una construcción. Busca un hogar definitivo.',
 'Calicó',
 'cualquiera',
 NOW() - INTERVAL '90 days'),

-- 🔵 QUINTO MÁS ANTIGUO (60 días = 2 meses)
('Canela', 
 'Gatita café claro de 1 año. Muy juguetona, le encantan las cajas y las plumas.', 
 1, 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1606214174585-fe31582dc6ee", "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6", "https://images.unsplash.com/photo-1511044568932-338cba0ad803"}', 
 2, 
 'aprobado', 
 'disponible',
 'Canela fue rescatada de un refugio sobrepoblado. Es una gatita llena de energía.',
 'Mestizo',
 'casa_grande',
 NOW() - INTERVAL '60 days'),

-- 🟣 SEXTO MÁS ANTIGUO (45 días = 1.5 meses)
('Princesa', 
 'Gatita siamesa de 1 año. Muy vocal y cariñosa, le gusta seguir a sus humanos.', 
 1, 
 'Saludable, esterilizada recientemente', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2", "https://images.unsplash.com/photo-1495360010541-f48722b34f7d", "https://images.unsplash.com/photo-1583795128727-6ec3642408f8"}', 
 2, 
 'aprobado', 
 'disponible',
 'Princesa fue abandonada cuando su familia se mudó. Busca un hogar permanente.',
 'Siamés',
 'cualquiera',
 NOW() - INTERVAL '45 days'),

-- 🟤 SÉPTIMO MÁS ANTIGUO (30 días = 1 mes)
('Manchas', 
 'Gato calicó de 4 años. Muy tranquilo, ideal para personas mayores.', 
 4, 
 'Tratamiento de parásitos completado', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1518791841217-8f162f1e1131", "https://images.unsplash.com/photo-1543852786-1cf6624b9987", "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13"}', 
 4, 
 'aprobado', 
 'disponible',
 'Manchas vivió en las calles por varios años. Ahora busca la tranquilidad de un hogar.',
 'Calicó',
 'departamento',
 NOW() - INTERVAL '30 days'),

-- ⚪ OCTAVO MÁS ANTIGUO (15 días = 2 semanas)
('Copito', 
 'Gatito blanco peludo de 5 meses. Muy tierno, necesita familia paciente.', 
 0, 
 'Saludable, primera vacuna', 
 'pendiente', 
 '{"https://images.unsplash.com/photo-1519052537078-e6302a4968d4", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba", "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239"}', 
 3, 
 'aprobado', 
 'disponible',
 'Copito fue rescatado de un edificio abandonado. Es un gatito dulce que necesita amor.',
 'Angora',
 'cualquiera',
 NOW() - INTERVAL '15 days'),

-- ⚫ NOVENO MÁS ANTIGUO (7 días = 1 semana)
('Tigre', 
 'Gato atigrado de 3 años. Cazador nato, perfecto para casas con jardín.', 
 4, 
 'Saludable, vacunas completas', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc", "https://images.unsplash.com/photo-1518791841217-8f162f1e1131", "https://images.unsplash.com/photo-1543852786-1cf6624b9987", "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13"}', 
 4, 
 'aprobado', 
 'disponible',
 'Tigre fue encontrado en una zona industrial. Es un gato activo que necesita espacio.',
 'Tabby',
 'casa_grande',
 NOW() - INTERVAL '7 days'),

-- 🆕 MÁS RECIENTE (3 días = RECIÉN LLEGADO) - DEBE APARECER AL FINAL
('Zorro', 
 'Gatito naranja de 6 meses. Muy juguetón y curioso, le fascina explorar.', 
 0, 
 'Saludable, vacunación en proceso', 
 'pendiente',
 '{"https://images.unsplash.com/photo-1574158622682-e40e69881006"}', 
 3, 
 'aprobado', 
 'disponible',
 'Zorro fue encontrado vagando solo. Es un gatito muy sociable y cariñoso.',
 'Mestizo',
 'cualquiera',
 NOW() - INTERVAL '3 days'),

-- NOTA: El siguiente gato NO debe aparecer porque es más reciente aún
('Nieve', 
 'Gatita persa blanca de 2 años. Pelaje largo que requiere cepillado diario. Muy calmada y elegante.', 
 4, 
 'Saludable, chequeo completo', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1495360010541-f48722b34f7d"}', 
 5, 
 'aprobado', 
 'disponible',
 'Nieve fue entregada por su dueño que se mudó al extranjero.',
 'Persa',
 'departamento',
 NOW() - INTERVAL '1 day'),

('Bolita', 
 'Gatito gris de 4 meses. Muy tierno y dormilón.', 
 0, 
 'Saludable, primera vacuna', 
 'pendiente', 
 '{"https://images.unsplash.com/photo-1543852786-1cf6624b9987"}', 
 3, 
 'aprobado', 
 'disponible',
 'Bolita fue rescatado de la calle. Es un gatito muy tierno y dormilón.',
 'Mestizo',
 'cualquiera',
 NOW()),

('Muffin', 
 '⏸️ PENDIENTE DE APROBACIÓN - NO DEBE APARECER EN CATÁLOGO PÚBLICO',
 0, 
 'Saludable, vacunas completas', 
 'pendiente', 
 '{"https://images.unsplash.com/photo-1494256997604-768d1f608cac"}', 
 2, 
 'aprobado', 
 'disponible',
 'Muffin fue encontrada en un estacionamiento con sus hermanos. Es la más cariñosa del grupo.',
 'Mestizo',
 'cualquiera',
 NOW() - INTERVAL '22 days'),

('Oliver', 
 'Gato naranja y blanco de 2 años, muy activo y juguetón. Le encanta perseguir pelotas.',
 4, 
 'Saludable, chequeo veterinario reciente', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6"}', 
 3, 
 'aprobado', 
 'disponible',
 'Oliver fue rescatado después de que su familia se mudó sin él. Es muy cariñoso a pesar de todo.',
 'Mestizo',
 'casa_grande',
 NOW() - INTERVAL '40 days'),

('Simba', 
 'Gatito naranja de 5 meses, muy curioso y aventurero. Necesita familia activa.',
 0, 
 'Saludable, primera vacuna', 
 'pendiente', 
 '{"https://images.unsplash.com/photo-1511044568932-338cba0ad803"}', 
 4, 
 'aprobado', 
 'disponible',
 'Simba fue rescatado de un terreno baldío. Es un gatito muy valiente y explorador.',
 'Mestizo',
 'cualquiera',
 NOW() - INTERVAL '35 days'),

('Shadow', 
 'Gato negro de 3 años, elegante y misterioso. Muy independiente pero leal.',
 4, 
 'Saludable, todas las vacunas', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1558788353-f76d92427f16"}', 
 5, 
 'aprobado', 
 'disponible',
 'Shadow fue abandonado por supersticiones. Es un gato maravilloso que merece una oportunidad.',
 'Bombay',
 'departamento',
 NOW() - INTERVAL '55 days'),

('Peludo', 
 'Gato persa gris de 3 años, pelaje largo y hermoso. Requiere cepillado diario.',
 4, 
 'Saludable, cuidado dental reciente', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1519052537078-e6302a4968d4"}', 
 2, 
 'aprobado', 
 'disponible',
 'Peludo fue entregado por su dueño que desarrolló alergias. Es un gato muy tranquilo.',
 'Persa',
 'departamento',
 NOW() - INTERVAL '28 days'),

('Kira', 
 'Gatita carey de 1 año, muy enérgica y juguetona. Le encanta trepar y explorar.',
 1, 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1529778873920-4da4926a72c2"}', 
 3, 
 'aprobado', 
 'disponible',
 'Kira fue rescatada de la calle donde vivía con su madre. Es muy cariñosa con humanos.',
 'Carey',
 'casa_grande',
 NOW() - INTERVAL '48 days'),

('Félix', 
 'Gato blanco y negro de 2 años, patrón de esmoquin. Muy elegante y educado.',
 4, 
 'Saludable, chequeo completo', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1569591159212-b02ea8a9f239"}', 
 4, 
 'aprobado', 
 'disponible',
 'Félix fue encontrado en un parque empresarial. Es un gato muy sociable con personas.',
 'Tuxedo',
 'departamento',
 NOW() - INTERVAL '33 days'),

('Cleo', 
 'Gatita egipcia de 1 año, ojos verdes impresionantes. Muy vocal y comunicativa.',
 1, 
 'Saludable, todas las vacunas', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc"}', 
 5, 
 'aprobado', 
 'disponible',
 'Cleo fue rescatada de un criadero ilegal. Es una gata muy inteligente y cariñosa.',
 'Mau Egipcio',
 'cualquiera',
 NOW() - INTERVAL '60 days'),

('Rocky', 
 'Gato atigrado marrón de 4 años, muy fuerte y saludable. Perfecto guardián del hogar.',
 4, 
 'Saludable, vacunas completas', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1518791841217-8f162f1e1131"}', 
 2, 
 'aprobado', 
 'disponible',
 'Rocky vivió en la calle por años. Es un gato resiliente que ahora busca comodidad.',
 'Tabby',
 'casa_grande',
 NOW() - INTERVAL '75 days'),

('Dulce', 
 'Gatita blanca con manchas grises de 6 meses, extremadamente dulce y tierna.',
 0, 
 'Saludable, vacunación en proceso', 
 'pendiente', 
 '{"https://images.unsplash.com/photo-1533738363-b7f9aef128ce"}', 
 3, 
 'aprobado', 
 'disponible',
 'Dulce fue rescatada de un contenedor con sus hermanos. La más cariñosa de la camada.',
 'Mestizo',
 'cualquiera',
 NOW() - INTERVAL '20 days'),

('Bruno', 
 'Gato café oscuro de 3 años, muy tranquilo. Ideal para personas mayores.',
 4, 
 'Saludable, chequeo geriátrico', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1574158622682-e40e69881006"}', 
 4, 
 'aprobado', 
 'disponible',
 'Bruno fue rescatado de un hogar de ancianos que cerró. Es extremadamente tranquilo.',
 'Mestizo',
 'departamento',
 NOW() - INTERVAL '42 days'),

('Estrella', 
 'Gatita blanca con ojos azules de 1 año, muy fotogénica y cariñosa.',
 1, 
 'Saludable, todas las vacunas', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13"}', 
 5, 
 'aprobado', 
 'disponible',
 'Estrella fue abandonada por su color de ojos. Es una gata hermosa y adorable.',
 'Angora',
 'cualquiera',
 NOW() - INTERVAL '38 days'),

('Pancho', 
 'Gato atigrado naranja de 2 años, muy juguetón. Le encanta perseguir plumas.',
 4, 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1543852786-1cf6624b9987"}', 
 2, 
 'aprobado', 
 'disponible',
 'Pancho fue rescatado de un mercado donde vivía buscando comida. Ahora está sano.',
 'Tabby',
 'casa_grande',
 NOW() - INTERVAL '52 days'),

('Minnie', 
 'Gatita pequeña gris de 7 meses, muy tímida pero cariñosa con paciencia.',
 0, 
 'Saludable, vacunas completas', 
 'pendiente', 
 '{"https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8"}', 
 3, 
 'aprobado', 
 'disponible',
 'Minnie fue rescatada de un motor de auto. Necesita familia paciente para ganar confianza.',
 'Mestizo',
 'departamento',
 NOW() - INTERVAL '15 days'),

('Zeus', 
 'Gato maine coon de 2 años, grande y majestuoso. Muy gentil a pesar de su tamaño.',
 4, 
 'Saludable, chequeo completo', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1495360010541-f48722b34f7d"}', 
 4, 
 'aprobado', 
 'disponible',
 'Zeus fue abandonado cuando creció demasiado. Es un gigante gentil que adora a los humanos.',
 'Maine Coon',
 'casa_grande',
 NOW() - INTERVAL '68 days'),

-- GATOS PENDIENTES DE APROBACIÓN (3 publicaciones recientes)
('Bigotes', 
 'Gato blanco y negro de 3 años, muy independiente pero cariñoso cuando quiere. Ideal para personas tranquilas.', 
 4, 
 'Saludable, chequeo reciente', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1569591159212-b02ea8a9f239"}', 
 4, 
 'pendiente', 
 'disponible',
 'Bigotes fue encontrado vagando por mi colonia. Es un gato Adulto que se adaptó rápidamente a estar en casa.',
 'Mestizo',
 'departamento',
 NOW() - INTERVAL '3 days'),

('Pelusa', 
 'Gatita gris persa de 8 meses, pelaje largo que requiere cepillado regular. Muy dulce y cariñosa.', 
 0, 
 'Saludable, vacunas completas', 
 'pendiente', 
 '{"https://images.unsplash.com/photo-1615789591457-74a63395c990"}', 
 5, 
 'pendiente', 
 'disponible',
 'Pelusa fue rescatada de una casa donde había demasiados gatos. Es una gatita hermosa que necesita atención especial.',
 'Persa',
 'departamento',
 NOW() - INTERVAL '2 days'),

('Chocolate', 
 'Gato café oscuro de 1 año, muy social. Le gusta recibir visitas y jugar con todos.', 
 1, 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1548247416-ec66f4900b2e"}', 
 2, 
 'pendiente', 
 'disponible',
 'Chocolate fue abandonado en un parque. Es un gato muy amigable que adora la compañía humana.',
 'Mestizo',
 'cualquiera',
 NOW() - INTERVAL '1 day'),

-- GATOS YA ADOPTADOS (5 adopciones exitosas para estadísticas)
('Romeo', 
 'Gato negro de 2 años, muy elegante y silencioso. Perfecto compañero para el hogar.', 
 4, 
 'Saludable, control veterinario regular', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1529778873920-4da4926a72c2"}', 
 3, 
 'aprobado', 
 'adoptado',
 'Romeo fue rescatado de la calle donde había sido abandonado. Es un gato muy especial que encontró el hogar perfecto.',
 'Bombay',
 'departamento',
 NOW() - INTERVAL '180 days'),

('Bella', 
 'Gatita carey de 1 año, muy juguetona y cariñosa. Le encanta dormir con sus humanos.', 
 1, 
 'Saludable, todas las vacunas', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1517331156700-3c241d2b4d83"}', 
 2, 
 'aprobado', 
 'adoptado',
 'Bella fue rescatada de un refugio y encontró una familia que la ama profundamente.',
 'Carey',
 'cualquiera',
 NOW() - INTERVAL '150 days'),

('Max', 
 'Gato gris de 3 años, tranquilo y hogareño. Perfecto para apartamentos.', 
 4, 
 'Saludable, chequeo completo', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13"}', 
 4, 
 'aprobado', 
 'adoptado',
 'Max fue abandonado por mudanza de sus dueños. Ahora tiene un hogar estable y amoroso.',
 'Azul Ruso',
 'departamento',
 NOW() - INTERVAL '90 days'),

('Mia', 
 'Gatita blanca y gris de 2 años, muy dulce. Le gusta acurrucarse en el regazo.', 
 4, 
 'Saludable, esterilizada', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1533738363-b7f9aef128ce"}', 
 3, 
 'aprobado', 
 'adoptado',
 'Mia fue rescatada de la calle y ahora vive feliz con su nueva familia.',
 'Mestizo',
 'cualquiera',
 NOW() - INTERVAL '60 days'),

('Garfield', 
 'Gato naranja grande de 4 años, muy perezoso y adorable. Come bien y duerme mejor.', 
 4, 
 'Tratamiento de sobrepeso en curso', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1583795128727-6ec3642408f8"}', 
 2, 
 'aprobado', 
 'adoptado',
 'Garfield fue encontrado en un restaurante donde lo alimentaban demasiado. Su nueva familia lo está ayudando a bajar de peso.',
 'Mestizo',
 'casa_grande',
 NOW() - INTERVAL '45 days'),

('Luna Azul', 
 'Gatita gris azulada de 1 año, pelaje sedoso y ojos dorados.',
 1, 
 'Saludable, adoptada', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"}', 
 3, 
 'aprobado', 
 'adoptado',
 'Luna Azul encontró su hogar perfecto con una familia que la adora.',
 'Azul Ruso',
 'departamento',
 NOW() - INTERVAL '145 days'),

('Trueno', 
 'Gato bengalí de 2 años, patrón leopardo hermoso. Muy activo.',
 4, 
 'Saludable, adoptado', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1517451330947-7809dead78d5"}', 
 4, 
 'aprobado', 
 'adoptado',
 'Trueno fue adoptado por una familia deportista que le da toda la actividad que necesita.',
 'Bengalí',
 'casa_grande',
 NOW() - INTERVAL '165 days'),

('Oreo', 
 'Gato blanco y negro de 3 años, patrón perfecto como la galleta.',
 4, 
 'Saludable, adoptado', 
 'esterilizado', 
 '{"https://images.unsplash.com/photo-1569591159212-b02ea8a9f239"}', 
 5, 
 'aprobado', 
 'adoptado',
 'Oreo vive ahora con dos niños que lo adoran y juegan con él todos los días.',
 'Tuxedo',
 'casa_grande',
 NOW() - INTERVAL '125 days');

-- 3. ADOPTION APPLICATIONS (30+ applications with ALL POSSIBLE states and scenarios)

INSERT INTO adoption_applications (applicant_id, cat_id, form_responses, status, created_at) VALUES
-- ============================================
-- PENDING APPLICATIONS (10 covering all profiles)
-- ============================================
(6, 1, 
 '{
   "experiencia": "He tenido 2 gatos antes, ambos vivieron más de 15 años",
   "vivienda": "Departamento propio de 80m2 con balcón cerrado",
   "tiempo": "Trabajo desde casa 4 días a la semana",
   "motivo": "Quiero darle un hogar a Luna, me identifico con su historia",
   "otros_animales": "No tengo otras mascotas actualmente",
   "gastos": "Sí, tengo presupuesto mensual de $2000 para veterinario y cuidados",
   "familia": "Vivo sola, todos en mi familia aman los gatos"
 }',
 'pendiente',
 NOW() - INTERVAL '3 days'),

(7, 2, 
 '{
   "experiencia": "Primera vez adoptando, pero he investigado mucho",
   "vivienda": "Casa con jardín pequeño",
   "tiempo": "Salgo 6 horas al día al trabajo",
   "motivo": "Michi parece perfecto para mi estilo de vida tranquilo",
   "otros_animales": "No",
   "gastos": "Sí, tengo fondo de emergencia para mascotas"
 }',
 'pendiente',
 NOW() - INTERVAL '5 days'),

(8, 3, 
 '{
   "experiencia": "Tengo una gata de 5 años muy sociable",
   "vivienda": "Casa propia, 2 plantas",
   "tiempo": "Mi esposo y yo trabajamos turnos alternados, siempre hay alguien en casa",
   "motivo": "Queremos darle una compañera a nuestra gata Mimi",
   "otros_animales": "Una gata esterilizada, muy amigable",
   "gastos": "Sí, ya tenemos veterinario de confianza"
 }',
 'pendiente',
 NOW() - INTERVAL '2 days'),

(9, 4, 
 '{
   "experiencia": "He rescatado gatos callejeros antes",
   "vivienda": "Departamento con 2 habitaciones",
   "tiempo": "Trabajo desde casa permanentemente",
   "motivo": "Canela parece muy activa, perfecto para mi",
   "otros_animales": "No",
   "gastos": "Sí, trabajo con rescatista y tengo contactos veterinarios"
 }',
 'pendiente',
 NOW() - INTERVAL '1 day'),

(10, 5, 
 '{
   "experiencia": "Crecí con gatos toda mi vida",
   "vivienda": "Casa familiar grande",
   "tiempo": "Soy estudiante, horario flexible",
   "motivo": "Princesa parece muy cariñosa, busco esa conexión",
   "otros_animales": "Tengo un perro golden retriever muy tranquilo",
   "gastos": "Mis padres apoyan económicamente"
 }',
 'pendiente',
 NOW() - INTERVAL '4 days'),

(6, 8, 
 '{
   "experiencia": "He tenido gatos machos antes",
   "vivienda": "Casa con jardín cerrado y protegido",
   "tiempo": "Medio tiempo, mucho tiempo en casa",
   "motivo": "Tigre parece perfecto para mi casa con jardín",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto establecido mensualmente"
 }',
 'pendiente',
 NOW() - INTERVAL '6 days'),

-- Perfil: Adoptante con múltiples mascotas
(11, 11, 
 '{
   "experiencia": "Tengo 2 gatos y 1 perro actualmente",
   "vivienda": "Casa grande de 200m2 con patio",
   "tiempo": "Trabajo desde casa",
   "motivo": "Oliver necesita un hogar multimascotas donde se sentirá cómodo",
   "otros_animales": "2 gatos esterilizados + 1 perro labrador entrenado",
   "gastos": "Sí, presupuesto mensual de $5000 para todas las mascotas"
 }',
 'pendiente',
 NOW() - INTERVAL '8 days'),

-- Perfil: Estudiante con apoyo familiar
(14, 12, 
 '{
   "experiencia": "Primera vez pero investigué mucho",
   "vivienda": "Casa familiar, tengo mi cuarto grande",
   "tiempo": "Clases en la mañana, tardes libres",
   "motivo": "Simba parece activo, perfecto para jugar cuando llego de clases",
   "otros_animales": "No",
   "gastos": "Mis padres apoyan económicamente"
 }',
 'pendiente',
 NOW() - INTERVAL '7 days'),

-- Perfil: Senior con experiencia
(15, 14, 
 '{
   "experiencia": "He tenido gatos toda mi vida, más de 50 años",
   "vivienda": "Departamento tranquilo de 90m2",
   "tiempo": "Jubilado, todo el tiempo disponible",
   "motivo": "Shadow parece elegante y tranquilo, perfecto para mi ritmo",
   "otros_animales": "No",
   "gastos": "Sí, tengo pensión estable y seguro médico"
 }',
 'pendiente',
 NOW() - INTERVAL '9 days'),

-- Perfil: Familia con niños
(13, 17, 
 '{
   "experiencia": "Mi esposa tuvo gatos antes",
   "vivienda": "Casa con jardín, 3 habitaciones",
   "tiempo": "Turnos alternados, siempre alguien en casa",
   "motivo": "Kira parece juguetona, nuestros hijos (8 y 10 años) aprenderán responsabilidad",
   "otros_animales": "No",
   "gastos": "Sí, ambos trabajamos"
 }',
 'pendiente',
 NOW() - INTERVAL '5 days'),

-- ============================================
-- APPROVED APPLICATIONS (12 for comprehensive tracking scenarios)
-- ============================================
(6, 13, 
 '{
   "experiencia": "Tengo 3 gatos rescatados actualmente",
   "vivienda": "Departamento amplio adaptado para gatos",
   "tiempo": "Trabajo desde casa",
   "motivo": "Me encanta ayudar a gatos rescatados",
   "otros_animales": "3 gatos, todos esterilizados y vacunados",
   "gastos": "Sí, trabajo con veterinario de confianza desde hace años"
 }',
 'aprobada',
 NOW() - INTERVAL '50 days'),

(7, 14, 
 '{
   "experiencia": "Tuve gatos en mi infancia",
   "vivienda": "Casa propia con espacio amplio",
   "tiempo": "Jubilado, todo el tiempo disponible",
   "motivo": "Bella me robó el corazón en las fotos",
   "otros_animales": "No",
   "gastos": "Sí, tengo pensión estable"
 }',
 'aprobada',
 NOW() - INTERVAL '155 days'),

(8, 15, 
 '{
   "experiencia": "He adoptado antes",
   "vivienda": "Departamento de 70m2",
   "tiempo": "Trabajo medio tiempo",
   "motivo": "Max parece tranquilo, perfecto para mi ritmo",
   "otros_animales": "No",
   "gastos": "Sí, tengo seguro para mascotas"
 }',
 'aprobada',
 NOW() - INTERVAL '95 days'),

(9, 16, 
 '{
   "experiencia": "Primera vez, pero muy comprometida",
   "vivienda": "Casa con mi familia",
   "tiempo": "Estudiante universitaria",
   "motivo": "Mia parece muy dulce y cariñosa",
   "otros_animales": "No",
   "gastos": "Mi familia apoya los gastos"
 }',
 'aprobada',
 NOW() - INTERVAL '65 days'),

(10, 17, 
 '{
   "experiencia": "He tenido gatos antes",
   "vivienda": "Departamento grande",
   "tiempo": "Home office",
   "motivo": "Garfield me hace reír, necesito esa alegría",
   "otros_animales": "No",
   "gastos": "Sí, preparado para dieta especial si necesita"
 }',
 'aprobada',
 NOW() - INTERVAL '50 days'),

-- Adopción exitosa reciente (para seguimiento activo)
(13, 18, 
 '{
   "experiencia": "He rescatado gatos antes",
   "vivienda": "Casa con patio techado",
   "tiempo": "Medio tiempo",
   "motivo": "Luna Azul merece un hogar amoroso",
   "otros_animales": "No",
   "gastos": "Sí, trabajo con veterinario de confianza"
 }',
 'aprobada',
 NOW() - INTERVAL '150 days'),

-- Adopción con perro (caso especial seguimiento)
(8, 19, 
 '{
   "experiencia": "Tengo experiencia con perros y gatos juntos",
   "vivienda": "Casa grande de 2 pisos",
   "tiempo": "Home office",
   "motivo": "Trueno es activo, mi perro también",
   "otros_animales": "Un golden retriever de 3 años bien entrenado",
   "gastos": "Sí, presupuesto amplio"
 }',
 'aprobada',
 NOW() - INTERVAL '170 days'),

-- Familia con niños (adopción exitosa)
(11, 20, 
 '{
   "experiencia": "Primera vez, pero familia completa comprometida",
   "vivienda": "Casa familiar con jardín grande",
   "tiempo": "Padres con horarios flexibles",
   "motivo": "Oreo es perfecto para enseñar responsabilidad a los niños",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto familiar asignado"
 }',
 'aprobada',
 NOW() - INTERVAL '130 days'),

-- ============================================
-- REJECTED APPLICATIONS (12 covering ALL rejection scenarios)
-- ============================================
(10, 7, 
 '{
   "experiencia": "Nunca he tenido mascotas",
   "vivienda": "Rento cuarto compartido",
   "tiempo": "Viajo mucho por trabajo, 2-3 semanas al mes fuera",
   "motivo": "Quiero compañía cuando estoy en casa",
   "otros_animales": "No",
   "gastos": "No estoy seguro de los costos"
 }',
 'rechazada',
 NOW() - INTERVAL '40 days'),

(9, 9, 
 '{
   "experiencia": "Primera vez",
   "vivienda": "Departamento pequeño rentado",
   "tiempo": "Trabajo 10-12 horas diarias",
   "motivo": "Me gusta Nieve",
   "otros_animales": "No",
   "gastos": "Depende del costo"
 }',
 'rechazada',
 NOW() - INTERVAL '25 days'),

(7, 10, 
 '{
   "experiencia": "He tenido peces",
   "vivienda": "Departamento sin permiso para mascotas",
   "tiempo": "Salgo todo el día",
   "motivo": "Zorro se ve lindo",
   "otros_animales": "No",
   "gastos": "No lo había pensado"
 }',
 'rechazada',
 NOW() - INTERVAL '15 days'),

(8, 6, 
 '{
   "experiencia": "Alérgica a gatos pero quiero intentar",
   "vivienda": "Casa propia",
   "tiempo": "Medio tiempo",
   "motivo": "Me gustan los gatos",
   "otros_animales": "Dos perros grandes",
   "gastos": "Sí"
 }',
 'rechazada',
 NOW() - INTERVAL '35 days'),

-- Rechazo: Sin permiso de propietario
(12, 13, 
 '{
   "experiencia": "Primera vez",
   "vivienda": "Departamento rentado, el dueño no sabe",
   "tiempo": "Trabajo 8 horas",
   "motivo": "Shadow se ve bonito",
   "otros_animales": "No",
   "gastos": "Creo que sí"
 }',
 'rechazada',
 NOW() - INTERVAL '28 days'),

-- Rechazo: Situación económica inestable
(12, 15, 
 '{
   "experiencia": "Tuve un gato hace años",
   "vivienda": "Departamento pequeño",
   "tiempo": "Busco trabajo actualmente",
   "motivo": "Necesito compañía",
   "otros_animales": "No",
   "gastos": "Depende de cuánto cueste"
 }',
 'rechazada',
 NOW() - INTERVAL '22 days'),

-- Rechazo: Viajes frecuentes
(10, 16, 
 '{
   "experiencia": "He cuidado gatos de amigos",
   "vivienda": "Departamento",
   "tiempo": "Viajo 2 semanas al mes por trabajo",
   "motivo": "Garfield parece independiente",
   "otros_animales": "No",
   "gastos": "Sí"
 }',
 'rechazada',
 NOW() - INTERVAL '32 days'),

-- Rechazo: Horarios incompatibles
(12, 18, 
 '{
   "experiencia": "Primera vez",
   "vivienda": "Estudio/departamento 30m2",
   "tiempo": "Trabajo de 7am a 9pm",
   "motivo": "Luna Azul se ve linda",
   "otros_animales": "No",
   "gastos": "Limitado"
 }',
 'rechazada',
 NOW() - INTERVAL '19 days'),

-- Rechazo: Regalo (mala intención)
(11, 19, 
 '{
   "experiencia": "No tengo",
   "vivienda": "Casa de mis padres",
   "tiempo": "Variable",
   "motivo": "Quiero regalar a mi novia un gato",
   "otros_animales": "No",
   "gastos": "Es regalo, ella se hará cargo"
 }',
 'rechazada',
 NOW() - INTERVAL '26 days'),

-- Rechazo: Niños muy pequeños sin supervisión
(14, 20, 
 '{
   "experiencia": "Primera vez",
   "vivienda": "Casa",
   "tiempo": "Trabajo todo el día",
   "motivo": "Mis hijos (2 y 3 años) quieren una mascota",
   "otros_animales": "No",
   "gastos": "Sí"
 }',
 'rechazada',
 NOW() - INTERVAL '17 days'),

-- Rechazo: Mudanza próxima
(9, 1, 
 '{
   "experiencia": "He tenido gatos",
   "vivienda": "Departamento actual, pero me mudo en 2 meses a otro país",
   "tiempo": "Tiempo disponible",
   "motivo": "Me gusta Veterano",
   "otros_animales": "No",
   "gastos": "Sí por ahora"
 }',
 'rechazada',
 NOW() - INTERVAL '12 days'),

-- ============================================
-- APPLICATIONS WITH NO AI EVAL YET (5 very recent)
-- ============================================
(13, 7, 
 '{
   "experiencia": "He rescatado gatos antes",
   "vivienda": "Casa grande con jardín",
   "tiempo": "Trabajo medio tiempo desde casa",
   "motivo": "Manchas parece tranquilo, perfecto para mi hogar",
   "otros_animales": "Una gata ya esterilizada",
   "gastos": "Sí, tengo veterinario de confianza"
 }',
 'pendiente',
 NOW() - INTERVAL '1 day'),

(14, 11, 
 '{
   "experiencia": "Primera vez con gatos, tengo experiencia con perros",
   "vivienda": "Casa con patio cerrado",
   "tiempo": "Jubilado, todo el tiempo libre",
   "motivo": "Oliver parece activo pero educado",
   "otros_animales": "No",
   "gastos": "Sí, pensión estable"
 }',
 'pendiente',
 NOW() - INTERVAL '12 hours'),

(15, 16, 
 '{
   "experiencia": "Tuve gatos en mi juventud (hace 20 años)",
   "vivienda": "Departamento amplio y tranquilo",
   "tiempo": "Jubilado",
   "motivo": "Dulce parece muy tierna, perfecta para mi soledad",
   "otros_animales": "No",
   "gastos": "Sí, estable"
 }',
 'pendiente',
 NOW() - INTERVAL '6 hours'),

(6, 18, 
 '{
   "experiencia": "He tenido múltiples gatos",
   "vivienda": "Casa de 2 plantas",
   "tiempo": "Home office",
   "motivo": "Bruno parece tranquilo, ideal para trabajar",
   "otros_animales": "No actualmente",
   "gastos": "Sí, presupuesto establecido"
 }',
 'pendiente',
 NOW() - INTERVAL '3 hours'),

(7, 21, 
 '{
   "experiencia": "Primera adopción formal, he cuidado gatos de familiares",
   "vivienda": "Departamento de 65m2",
   "tiempo": "Trabajo 6 horas, tardes libres",
   "motivo": "Minnie necesita paciencia, yo la tengo",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto mensual de $1500"
 }',
 'pendiente',
 NOW() - INTERVAL '1 hour'),

-- ============================================
-- MÚLTIPLES SOLICITUDES PARA MISMOS GATOS (Competencia por adopción)
-- ============================================

-- Luna (cat_id=2) - 4 solicitudes compitiendo
(13, 2, 
 '{
   "experiencia": "Tengo 2 gatos actualmente, ambos rescatados",
   "vivienda": "Casa con patio cerrado de 150m2",
   "tiempo": "Freelancer, siempre en casa",
   "motivo": "Luna necesita un hogar multimascotas donde socializar",
   "otros_animales": "2 gatos esterilizados, muy sociables",
   "gastos": "Sí, presupuesto holgado para 3 gatos"
 }',
 'pendiente',
 NOW() - INTERVAL '2 days'),

(14, 2, 
 '{
   "experiencia": "Primera vez pero muy preparado",
   "vivienda": "Departamento amplio 85m2",
   "tiempo": "Trabajo remoto permanente",
   "motivo": "Me enamoré de Luna en las fotos, parece angelical",
   "otros_animales": "No",
   "gastos": "Sí, tengo fondo de emergencia de $10000"
 }',
 'pendiente',
 NOW() - INTERVAL '4 days'),

(15, 2, 
 '{
   "experiencia": "Tuve gatos toda mi vida",
   "vivienda": "Casa familiar",
   "tiempo": "Jubilada, todo el tiempo",
   "motivo": "Luna parece tranquila, perfecta para mi edad",
   "otros_animales": "No",
   "gastos": "Sí, pensión estable"
 }',
 'pendiente',
 NOW() - INTERVAL '1 day'),

-- Tigre (cat_id=8) - 3 solicitudes compitiendo
(11, 8, 
 '{
   "experiencia": "He tenido gatos de exterior antes",
   "vivienda": "Casa con jardín grande y seguro",
   "tiempo": "Trabajo desde casa 3 días",
   "motivo": "Tigre necesita espacio para explorar, tengo el jardín perfecto",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto amplio"
 }',
 'pendiente',
 NOW() - INTERVAL '5 days'),

(13, 8, 
 '{
   "experiencia": "Familia con experiencia en gatos activos",
   "vivienda": "Casa de 2 plantas con jardín",
   "tiempo": "Turnos alternados, siempre alguien en casa",
   "motivo": "Mis hijos quieren un gato juguetón como Tigre",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto familiar"
 }',
 'pendiente',
 NOW() - INTERVAL '3 days'),

-- Nala (cat_id=3) - 3 solicitudes compitiendo
(6, 3, 
 '{
   "experiencia": "Tengo una gata que necesita compañera",
   "vivienda": "Casa de 120m2",
   "tiempo": "Medio tiempo",
   "motivo": "Nala se llevaría bien con mi gata actual",
   "otros_animales": "Una gata de 3 años, muy sociable",
   "gastos": "Sí, ya tengo veterinario de confianza"
 }',
 'pendiente',
 NOW() - INTERVAL '6 days'),

(9, 3, 
 '{
   "experiencia": "Primera vez con gatos",
   "vivienda": "Departamento 70m2",
   "tiempo": "Trabajo 6 horas diarias",
   "motivo": "Nala parece energética, me motiva a ser más activo",
   "otros_animales": "No",
   "gastos": "Sí, investigué costos"
 }',
 'pendiente',
 NOW() - INTERVAL '4 days'),

-- Shadow (cat_id=14) - 2 solicitudes compitiendo
(6, 14, 
 '{
   "experiencia": "He tenido gatos negros antes, son maravillosos",
   "vivienda": "Departamento tranquilo 80m2",
   "tiempo": "Home office",
   "motivo": "Quiero romper el estigma de los gatos negros, Shadow merece amor",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto establecido"
 }',
 'pendiente',
 NOW() - INTERVAL '7 days'),

-- Copito (cat_id=7) - 2 solicitudes compitiendo  
(7, 7,
 '{
   "experiencia": "He criado cachorros de gato antes",
   "vivienda": "Casa con habitación dedicada para mascotas",
   "tiempo": "Trabajo medio tiempo",
   "motivo": "Copito necesita familia paciente, tengo experiencia con cachorros",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto para cachorros (vacunas, esterilización futura)"
 }',
 'pendiente',
 NOW() - INTERVAL '8 days'),

-- Princesa (cat_id=5) - 2 solicitudes compitiendo
(8, 5,
 '{
   "experiencia": "Tuve un siamés antes, conozco la raza",
   "vivienda": "Departamento 75m2",
   "tiempo": "Trabajo desde casa",
   "motivo": "Los siameses son muy vocales, me encanta esa característica",
   "otros_animales": "No",
   "gastos": "Sí, conozco las necesidades de la raza"
 }',
 'pendiente',
 NOW() - INTERVAL '9 days'),

-- Veterano (cat_id=1) - 2 solicitudes compitiendo
(15, 1,
 '{
   "experiencia": "Especializada en gatos senior",
   "vivienda": "Casa tranquila de un piso",
   "tiempo": "Jubilada, todo el tiempo",
   "motivo": "Los gatos senior merecen amor, Veterano tendrá la mejor vejez conmigo",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto para tratamientos geriátricos"
 }',
 'pendiente',
 NOW() - INTERVAL '10 days'),

-- Simba (cat_id=12) - 2 solicitudes compitiendo
(9, 12,
 '{
   "experiencia": "Familia activa con experiencia",
   "vivienda": "Casa con jardín",
   "tiempo": "Horarios flexibles",
   "motivo": "Simba parece aventurero, perfecto para nuestra familia deportista",
   "otros_animales": "No",
   "gastos": "Sí, presupuesto familiar"
 }',
 'pendiente',
 NOW() - INTERVAL '11 days');

-- 4. AI EVALUATIONS (Update applications with AI evaluation results)
-- Demonstrates the AI evaluation system with 5 kill-switches

-- APPROVED EVALUATIONS (High scores, Sin señales de alerta)
UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 92, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Adoptante apoya la esterilización", "seguridad_hogar": "APROBADO - Ambiente hogareño seguro", "señales_peligro": "APROBADO - Sin patrones preocupantes", "compatibilidad_espacio": "APROBADO - Espacio adecuado para las necesidades del gato", "patrones_sospechosos": "APROBADO - Sin señales de alerta detectadas", "evaluacion_general": "Excelente candidato con experiencia previa con gatos y hogar adecuado"}',
    ai_evaluated_at = NOW() - INTERVAL '3 days'
WHERE id = 1;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 85, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Primera vez pero ha investigado", "seguridad_hogar": "APROBADO - Casa con jardín pequeño", "señales_peligro": "APROBADO - Sin preocupaciones", "compatibilidad_espacio": "APROBADO - Buen candidato para gato tranquilo", "patrones_sospechosos": "APROBADO - Honesto y preparado", "evaluacion_general": "Buen candidato a pesar de ser adoptante primerizo, muestra compromiso"}',
    ai_evaluated_at = NOW() - INTERVAL '5 days'
WHERE id = 2;

UPDATE adoption_applications SET 
    ai_decision = 'REVIEW', 
    ai_score = 78, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Tiene experiencia con gato esterilizado", "seguridad_hogar": "REVISAR - Tiene otro gato, necesita verificación de compatibilidad", "señales_peligro": "APROBADO - Sin señales de alerta", "compatibilidad_espacio": "APROBADO - Casa grande adecuada", "patrones_sospechosos": "APROBADO - Dueño experimentado", "evaluacion_general": "Requiere revisión humana para compatibilidad multi-gato pero calificado"}',
    ai_evaluated_at = NOW() - INTERVAL '2 days'
WHERE id = 3;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 88, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Experimentado con gatos rescatados", "seguridad_hogar": "APROBADO - Trabajo remoto permanente", "señales_peligro": "APROBADO - Sin preocupaciones", "compatibilidad_espacio": "APROBADO - Espacio adecuado para gato activo", "patrones_sospechosos": "APROBADO - Tiene contactos en red de rescate", "evaluacion_general": "Excelente candidato para gato energético, rescatista experimentado"}',
    ai_evaluated_at = NOW() - INTERVAL '1 day'
WHERE id = 4;

UPDATE adoption_applications SET 
    ai_decision = 'REVIEW', 
    ai_score = 75, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Familia apoya financieramente", "seguridad_hogar": "REVISAR - Tiene perro, necesita verificación de compatibilidad", "señales_peligro": "APROBADO - Estudiante pero apoyo familiar confirmado", "compatibilidad_espacio": "APROBADO - Casa familiar grande", "patrones_sospechosos": "APROBADO - Interés genuino", "evaluacion_general": "Requiere revisión para introducción gato-perro pero ambiente hogareño adecuado"}',
    ai_evaluated_at = NOW() - INTERVAL '4 days'
WHERE id = 5;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 90, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Tiene presupuesto para cuidado del gato", "seguridad_hogar": "APROBADO - Jardín seguro perfecto para gato activo", "señales_peligro": "APROBADO - Sin preocupaciones", "compatibilidad_espacio": "APROBADO - Casa con jardín ideal para Tigre", "patrones_sospechosos": "APROBADO - Bien preparado", "evaluacion_general": "Candidato perfecto para gato activo que ama el exterior"}',
    ai_evaluated_at = NOW() - INTERVAL '6 days'
WHERE id = 6;

-- REJECTED EVALUATIONS (Failed kill-switches)
UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 25, 
    ai_auto_reject_reason = 'Adoptante viaja 2-3 semanas por mes y carece de compromiso para cuidado a largo plazo. Gato estaría solo por períodos extendidos.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "FALLO - Incertidumbre sobre costos indica falta de preparación", "seguridad_hogar": "FALLO - Habitación compartida en renta, situación de vivienda inestable", "señales_peligro": "CRÍTICO - Horario extenso de viajes incompatible con cuidado del gato", "compatibilidad_espacio": "FALLO - Espacio compartido rentado inadecuado", "patrones_sospechosos": "FALLO - Quiere compañía solo cuando está presente, sin considerar necesidades del gato", "evaluacion_general": "RECHAZO AUTOMÁTICO - Múltiples fallas críticas en capacidad de cuidado básico"}',
    ai_evaluated_at = NOW() - INTERVAL '40 days'
WHERE id = 11;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 30, 
    ai_auto_reject_reason = 'Works 10-12 hours daily in small apartment. Cat would be isolated for most of day without proper enrichment or attention.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "FALLO - Sin planificación financiera para cuidado del gato", "seguridad_hogar": "FALLO - Renta pequeña sin espacio adecuado", "señales_peligro": "CRÍTICO - Tiempo insuficiente disponible para cuidado del gato", "compatibilidad_espacio": "FALLO - Apartamento pequeño para gato con necesidades activas", "patrones_sospechosos": "FALLO - Decisión impulsiva sin investigación", "evaluacion_general": "RECHAZO AUTOMÁTICO - Tiempo y espacio inadecuados para cuidado apropiado del gato"}',
    ai_evaluated_at = NOW() - INTERVAL '25 days'
WHERE id = 12;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 20, 
    ai_auto_reject_reason = 'Rents apartment without pet permission. This creates unstable living situation for cat and potential abandonment risk.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "FALLO - Sin ninguna preparación financiera", "seguridad_hogar": "CRÍTICO - Sin permiso para mascotas en renta, situación ilegal", "señales_peligro": "CRÍTICO - Fuera todo el día, sin plan de enriquecimiento", "compatibilidad_espacio": "FALLO - Situación de mascota no autorizada", "patrones_sospechosos": "CRÍTICO - Solo interesado por apariencia, sin investigación", "evaluacion_general": "RECHAZO AUTOMÁTICO - Situación de vivienda ilegal presenta riesgo serio de abandono"}',
    ai_evaluated_at = NOW() - INTERVAL '15 days'
WHERE id = 13;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 35, 
    ai_auto_reject_reason = 'Allergic to cats but wants to try. High risk of return/abandonment. Also has two large dogs without proper cat introduction plan.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Has budget but other issues override", "seguridad_hogar": "FALLO - Cat allergy poses health risk and abandonment probability", "señales_peligro": "CRÍTICO - Known cat allergy plus two large dogs without introduction plan", "compatibilidad_espacio": "REVISAR - House adequate but dog compatibility unknown", "patrones_sospechosos": "FALLO - Downplaying serious health concern", "evaluacion_general": "AUTOMATIC REJECTION - Medical incompatibility with high abandonment risk"}',
    ai_evaluated_at = NOW() - INTERVAL '35 days'
WHERE id = 14;

-- Additional AI evaluations for new applications
UPDATE adoption_applications SET 
    ai_decision = 'REVIEW', 
    ai_score = 72, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Has multiple pets already", "seguridad_hogar": "REVISAR - Multi-pet household needs assessment", "señales_peligro": "APROBADO - Dueño experimentado", "compatibilidad_espacio": "APROBADO - Large house adequate", "patrones_sospechosos": "APROBADO - Responsible pet owner", "evaluacion_general": "Good candidate but requires compatibility check with existing pets"}',
    ai_evaluated_at = NOW() - INTERVAL '8 days'
WHERE id = 7;

UPDATE adoption_applications SET 
    ai_decision = 'REVIEW', 
    ai_score = 68, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Family financial support confirmed", "seguridad_hogar": "REVISAR - Student lifestyle needs verification", "señales_peligro": "APROBADO - Family involvement positive", "compatibilidad_espacio": "APROBADO - Family home adequate", "patrones_sospechosos": "APROBADO - Interés genuino", "evaluacion_general": "Requires verification of long-term commitment beyond student years"}',
    ai_evaluated_at = NOW() - INTERVAL '7 days'
WHERE id = 8;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 94, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Decades of experience", "seguridad_hogar": "APROBADO - Hogar de retiro estable", "señales_peligro": "APROBADO - Excellent profile", "compatibilidad_espacio": "APROBADO - Apartamento tranquilo perfecto for Shadow", "patrones_sospechosos": "APROBADO - Adoptante senior ideal", "evaluacion_general": "Outstanding candidate with lifelong cat experience and Situación estable"}',
    ai_evaluated_at = NOW() - INTERVAL '9 days'
WHERE id = 9;

UPDATE adoption_applications SET 
    ai_decision = 'REVIEW', 
    ai_score = 76, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Dual income family", "seguridad_hogar": "REVISAR - Children ages need supervision assessment", "señales_peligro": "APROBADO - Buena estructura familiar", "compatibilidad_espacio": "APROBADO - Casa con jardín adecuada", "patrones_sospechosos": "APROBADO - Teaching responsibility is positive", "evaluacion_general": "Good family but requires guidance on cat-children interaction"}',
    ai_evaluated_at = NOW() - INTERVAL '5 days'
WHERE id = 10;

-- REJECT evaluations for problematic applications
UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 18, 
    ai_auto_reject_reason = 'Unauthorized pet in rental property. Landlord unaware. High risk of forced abandonment and eviction.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "FALLO - Uncertain financial commitment", "seguridad_hogar": "CRÍTICO - Illegal pet situation, no landlord permission", "señales_peligro": "CRÍTICO - Deceptive housing arrangement", "compatibilidad_espacio": "FALLO - Unauthorized situation", "patrones_sospechosos": "CRÍTICO - Hiding pet from property owner", "evaluacion_general": "AUTOMATIC REJECTION - Extremely high abandonment risk due to illegal housing situation"}',
    ai_evaluated_at = NOW() - INTERVAL '28 days'
WHERE id = 15;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 22, 
    ai_auto_reject_reason = 'Applicant currently unemployed with uncertain financial situation. Cannot guarantee cat care costs.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "FALLO - Financial instability", "seguridad_hogar": "FALLO - Uncertain living situation", "señales_peligro": "CRÍTICO - No stable income source", "compatibilidad_espacio": "FALLO - Small space with economic uncertainty", "patrones_sospechosos": "FALLO - Seeking emotional support without preparation", "evaluacion_general": "AUTOMATIC REJECTION - Financial instability poses serious risk to cat welfare"}',
    ai_evaluated_at = NOW() - INTERVAL '22 days'
WHERE id = 16;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 28, 
    ai_auto_reject_reason = 'Frequent travel (2 weeks monthly) leaves cat alone for extended periods. No care plan mentioned.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Has budget", "seguridad_hogar": "FALLO - Cat would be alone frequently", "señales_peligro": "CRÍTICO - Extended absences incompatible with cat care", "compatibilidad_espacio": "APROBADO - Space adequate but time commitment lacking", "patrones_sospechosos": "FALLO - Seeking independent pet despite unsuitable schedule", "evaluacion_general": "AUTOMATIC REJECTION - Travel schedule incompatible with responsible cat ownership"}',
    ai_evaluated_at = NOW() - INTERVAL '32 days'
WHERE id = 17;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 15, 
    ai_auto_reject_reason = 'Extremely long work hours (14h daily) in tiny studio. Cat would be isolated and neglected.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "FALLO - Limited budget indicated", "seguridad_hogar": "CRÍTICO - Tiny 30m2 space, absent 14 hours daily", "señales_peligro": "CRÍTICO - Severe time constraint", "compatibilidad_espacio": "FALLO - Insufficient space and time", "patrones_sospechosos": "FALLO - Impulsive decision based on appearance only", "evaluacion_general": "AUTOMATIC REJECTION - Most severe case of time/space inadequacy"}',
    ai_evaluated_at = NOW() - INTERVAL '19 days'
WHERE id = 18;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 12, 
    ai_auto_reject_reason = 'Wants cat as gift for girlfriend. Cat is not a gift. Recipient not involved in decision.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "FALLO - No ownership responsibility", "seguridad_hogar": "CRÍTICO - Living with parents, no autonomy", "señales_peligro": "CRÍTICO - Cat as surprise gift, unethical", "compatibilidad_espacio": "FALLO - Not his residence", "patrones_sospechosos": "CRÍTICO - Treating living being as object, no research", "evaluacion_general": "AUTOMATIC REJECTION - Pets are not gifts. Extremely high abandonment risk"}',
    ai_evaluated_at = NOW() - INTERVAL '26 days'
WHERE id = 19;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 24, 
    ai_auto_reject_reason = 'Very young children (2-3 years) without adequate supervision. Parent works full time.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Has budget", "seguridad_hogar": "CRÍTICO - Toddlers need constant supervision with pets", "señales_peligro": "CRÍTICO - Parent absent all day, children too young", "compatibilidad_espacio": "APROBADO - House adequate but supervision lacking", "patrones_sospechosos": "FALLO - Seeking pet for children without understanding care needs", "evaluacion_general": "AUTOMATIC REJECTION - Children too young, inadequate supervision creates danger for both cat and children"}',
    ai_evaluated_at = NOW() - INTERVAL '17 days'
WHERE id = 20;

UPDATE adoption_applications SET 
    ai_decision = 'REJECT', 
    ai_score = 31, 
    ai_auto_reject_reason = 'Se muda a otro país en 2 meses. Sin posibilidad de compromiso a largo plazo.',
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Has experience", "seguridad_hogar": "CRÍTICO - Mudanza internacional inminente", "señales_peligro": "CRÍTICO - Sin estabilidad a largo plazo", "compatibilidad_espacio": "FALLO - Solo situación temporal", "patrones_sospechosos": "FALLO - Pensamiento a corto plazo, gato necesita hogar permanente", "evaluacion_general": "RECHAZO AUTOMÁTICO - Reubicación internacional próxima conocida hace la adopción imposible"}',
    ai_evaluated_at = NOW() - INTERVAL '12 days'
WHERE id = 21;

-- AI evaluations for competing applications
-- Luna (cat_id=2) - Multiple applicants
UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 89, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Dueño experimentado multi-gato", "seguridad_hogar": "APROBADO - Casa grande adecuada", "señales_peligro": "APROBADO - Situación estable", "compatibilidad_espacio": "APROBADO - Experiencia con socialización de gatos", "patrones_sospechosos": "APROBADO - Excellent candidate", "evaluacion_general": "Excelente candidato para hogar multi-gato, Luna prosperaría"}',
    ai_evaluated_at = NOW() - INTERVAL '2 days'
WHERE id = 22;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 87, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Bien investigado", "seguridad_hogar": "APROBADO - Trabajo remoto provee disponibilidad", "señales_peligro": "APROBADO - Primera vez pero muy preparado", "compatibilidad_espacio": "APROBADO - Tamaño de apartamento adecuado", "patrones_sospechosos": "APROBADO - Interés genuino and preparation", "evaluacion_general": "Adoptante primerizo fuerte con excelente preparación"}',
    ai_evaluated_at = NOW() - INTERVAL '4 days'
WHERE id = 23;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 93, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Experiencia de toda la vida", "seguridad_hogar": "APROBADO - Hogar de retiro estable", "señales_peligro": "APROBADO - Perfil perfecto", "compatibilidad_espacio": "APROBADO - Ambiente tranquilo ideal para Luna", "patrones_sospechosos": "APROBADO - Adoptante senior ideal", "evaluacion_general": "Outstanding candidate, lifetime cat experience with Situación estable"}',
    ai_evaluated_at = NOW() - INTERVAL '1 day'
WHERE id = 24;

-- Tigre (cat_id=8) - Active cat needs active home
UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 91, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Experimentado con gatos de exterior", "seguridad_hogar": "APROBADO - Jardín seguro perfecto para Tigre", "señales_peligro": "APROBADO - Oficina en casa provee supervisión", "compatibilidad_espacio": "APROBADO - Jardín grande ideal para gato activo", "patrones_sospechosos": "APROBADO - Candidato perfecto", "evaluacion_general": "Ambiente perfecto para Tigre, espacio exterior seguro con supervisión"}',
    ai_evaluated_at = NOW() - INTERVAL '5 days'
WHERE id = 25;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 86, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Compromiso familiar", "seguridad_hogar": "APROBADO - Large house with garden", "señales_peligro": "APROBADO - Buena estructura familiar", "compatibilidad_espacio": "APROBADO - Casa con jardín adecuada", "patrones_sospechosos": "APROBADO - Buena familia para gato activo", "evaluacion_general": "Buen ambiente familiar, niños proveen actividad que Tigre necesita"}',
    ai_evaluated_at = NOW() - INTERVAL '3 days'
WHERE id = 26;

-- Nala (cat_id=3) - Energetic young cat
UPDATE adoption_applications SET 
    ai_decision = 'REVIEW', 
    ai_score = 74, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Tiene gato existente", "seguridad_hogar": "REVISAR - Introducción multi-gato necesita evaluación", "señales_peligro": "APROBADO - Dueño experimentado", "compatibilidad_espacio": "APROBADO - Adequate house size", "patrones_sospechosos": "APROBADO - Dueño responsable", "evaluacion_general": "Requiere evaluación de compatibilidad entre Nala y gato existente"}',
    ai_evaluated_at = NOW() - INTERVAL '6 days'
WHERE id = 27;

UPDATE adoption_applications SET 
    ai_decision = 'REVIEW', 
    ai_score = 71, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Investigó costos", "seguridad_hogar": "REVISAR - Primera vez con gato energético", "señales_peligro": "APROBADO - Adoptante motivado", "compatibilidad_espacio": "APROBADO - Apartamento adecuado", "patrones_sospechosos": "APROBADO - Honest preparation", "evaluacion_general": "Adoptante primerizo con gato energético requiere orientación"}',
    ai_evaluated_at = NOW() - INTERVAL '4 days'
WHERE id = 28;

-- Shadow (cat_id=14) - Black cat
UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 90, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Experimentado con gatos negros", "seguridad_hogar": "APROBADO - Oficina en casa provee compañía", "señales_peligro": "APROBADO - Combatir estigma es admirable", "compatibilidad_espacio": "APROBADO - Apartamento tranquilo perfecto", "patrones_sospechosos": "APROBADO - Excelentes motivaciones", "evaluacion_general": "Excelente candidato combatiendo estigma de gatos negros, muy admirable"}',
    ai_evaluated_at = NOW() - INTERVAL '7 days'
WHERE id = 29;

-- Copito (cat_id=7) - Kitten needs patient family
UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 88, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Entiende necesidades de gatito incluyendo futura esterilización", "seguridad_hogar": "APROBADO - Habitación dedicada a mascota muestra compromiso", "señales_peligro": "APROBADO - Experiencia con gatitos", "compatibilidad_espacio": "APROBADO - Casa con espacio dedicado", "patrones_sospechosos": "APROBADO - Experimentado con gatitos", "evaluacion_general": "Great candidate with Experiencia con gatitos and dedicated space"}',
    ai_evaluated_at = NOW() - INTERVAL '8 days'
WHERE id = 30;

-- Princesa (cat_id=5) - Siamese Conocimiento de raza
UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 92, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Conocimiento de raza", "seguridad_hogar": "APROBADO - Oficina en casa para raza vocal", "señales_peligro": "APROBADO - Entiende características de raza", "compatibilidad_espacio": "APROBADO - Adecuado para raza vocal", "patrones_sospechosos": "APROBADO - Conocimiento específico de raza excelente", "evaluacion_general": "Candidato perfecto - understands and appreciates Siamese vocal nature"}',
    ai_evaluated_at = NOW() - INTERVAL '9 days'
WHERE id = 31;

-- Veterano (cat_id=1) - Especialista en gatos senior
UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 95, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Especialista en gatos senior", "seguridad_hogar": "APROBADO - Ambiente tranquilo perfecto", "señales_peligro": "APROBADO - Conocimiento de cuidado geriátrico", "compatibilidad_espacio": "APROBADO - Piso único ideal para senior", "patrones_sospechosos": "APROBADO - Dedicación excepcional a seniors", "evaluacion_general": "Excepcional - especializado en gatos senior, Veterano tendrá el mejor cuidado"}',
    ai_evaluated_at = NOW() - INTERVAL '10 days'
WHERE id = 32;

-- Simba (cat_id=12) - Active family
UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 84, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Experiencia familiar", "seguridad_hogar": "APROBADO - Familia activa coincide con energía de gatito", "señales_peligro": "APROBADO - Buena estructura familiar", "compatibilidad_espacio": "APROBADO - House with garden", "patrones_sospechosos": "APROBADO - Estilo de vida activo bueno para gatito", "evaluacion_general": "Buen candidato - familia activa provee ejercicio que Simba necesita"}',
    ai_evaluated_at = NOW() - INTERVAL '11 days'
WHERE id = 33;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 88, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Compromiso con esterilización", "seguridad_hogar": "APROBADO - Casa segura con experiencia", "señales_peligro": "APROBADO - Adoptante responsable", "compatibilidad_espacio": "APROBADO - Espacio adecuado", "patrones_sospechosos": "APROBADO - Historial positivo", "evaluacion_general": "Excelente candidato con experiencia y compromiso"}',
    ai_evaluated_at = NOW() - INTERVAL '10 days'
WHERE id = 34;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 83, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Primera vez pero informado", "seguridad_hogar": "APROBADO - Hogar preparado", "señales_peligro": "APROBADO - Motivación genuina", "compatibilidad_espacio": "APROBADO - Departamento adecuado", "patrones_sospechosos": "APROBADO - Adoptante serio", "evaluacion_general": "Buen candidato aunque primerizo, muestra preparación"}',
    ai_evaluated_at = NOW() - INTERVAL '9 days'
WHERE id = 35;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 91, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Experiencia con esterilización", "seguridad_hogar": "APROBADO - Casa amplia y segura", "señales_peligro": "APROBADO - Ambiente multimascotas estable", "compatibilidad_espacio": "APROBADO - Espacio excelente", "patrones_sospechosos": "APROBADO - Cuidador experimentado", "evaluacion_general": "Excelente candidato con historial probado de cuidado múltiple"}',
    ai_evaluated_at = NOW() - INTERVAL '8 days'
WHERE id = 36;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 86, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Compromiso con salud animal", "seguridad_hogar": "APROBADO - Ambiente familiar seguro", "señales_peligro": "APROBADO - Sin señales de alerta", "compatibilidad_espacio": "APROBADO - Casa con jardín", "patrones_sospechosos": "APROBADO - Familia responsable", "evaluacion_general": "Muy buen candidato con apoyo familiar y recursos"}',
    ai_evaluated_at = NOW() - INTERVAL '7 days'
WHERE id = 37;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 89, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Conocimiento previo", "seguridad_hogar": "APROBADO - Hogar multimascotas probado", "señales_peligro": "APROBADO - Experiencia demostrada", "compatibilidad_espacio": "APROBADO - Casa grande", "patrones_sospechosos": "APROBADO - Cuidador dedicado", "evaluacion_general": "Excelente candidato con experiencia multimascotas y compromiso"}',
    ai_evaluated_at = NOW() - INTERVAL '6 days'
WHERE id = 38;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 87, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Informado sobre procedimiento", "seguridad_hogar": "APROBADO - Hogar tranquilo adecuado", "señales_peligro": "APROBADO - Motivación apropiada", "compatibilidad_espacio": "APROBADO - Espacio suficiente", "patrones_sospechosos": "APROBADO - Adoptante preparado", "evaluacion_general": "Buen candidato con estilo de vida compatible"}',
    ai_evaluated_at = NOW() - INTERVAL '5 days'
WHERE id = 39;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 84, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Acuerdo con procedimiento", "seguridad_hogar": "APROBADO - Casa con jardín cerrado", "señales_peligro": "APROBADO - Sin preocupaciones", "compatibilidad_espacio": "APROBADO - Buen espacio exterior", "patrones_sospechosos": "APROBADO - Adoptante confiable", "evaluacion_general": "Buen candidato con facilidades adecuadas para gato"}',
    ai_evaluated_at = NOW() - INTERVAL '4 days'
WHERE id = 40;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 90, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Gatos previos esterilizados", "seguridad_hogar": "APROBADO - Casa familiar segura", "señales_peligro": "APROBADO - Experiencia positiva", "compatibilidad_espacio": "APROBADO - Casa amplia", "patrones_sospechosos": "APROBADO - Historial excelente", "evaluacion_general": "Excelente candidato con experiencia familiar y recursos"}',
    ai_evaluated_at = NOW() - INTERVAL '3 days'
WHERE id = 41;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 82, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Dispuesto a proceder", "seguridad_hogar": "APROBADO - Departamento adecuado", "señales_peligro": "APROBADO - Motivación clara", "compatibilidad_espacio": "APROBADO - Espacio suficiente", "patrones_sospechosos": "APROBADO - Adoptante responsable", "evaluacion_general": "Buen candidato con horario flexible y compromiso"}',
    ai_evaluated_at = NOW() - INTERVAL '2 days'
WHERE id = 42;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 93, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Experiencia con esterilización", "seguridad_hogar": "APROBADO - Hogar muy seguro", "señales_peligro": "APROBADO - Adoptante ideal", "compatibilidad_espacio": "APROBADO - Espacio excelente", "patrones_sospechosos": "APROBADO - Cuidador experimentado", "evaluacion_general": "Candidato excepcional con todas las características ideales"}',
    ai_evaluated_at = NOW() - INTERVAL '1 day'
WHERE id = 43;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 85, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Compromiso confirmado", "seguridad_hogar": "APROBADO - Casa con jardín seguro", "señales_peligro": "APROBADO - Sin problemas detectados", "compatibilidad_espacio": "APROBADO - Espacio amplio", "patrones_sospechosos": "APROBADO - Adoptante confiable", "evaluacion_general": "Muy buen candidato con facilidades apropiadas"}',
    ai_evaluated_at = NOW() - INTERVAL '12 hours'
WHERE id = 44;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 88, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Apoyo veterinario confirmado", "seguridad_hogar": "APROBADO - Hogar preparado", "señales_peligro": "APROBADO - Experiencia demostrada", "compatibilidad_espacio": "APROBADO - Casa con espacio", "patrones_sospechosos": "APROBADO - Cuidador comprometido", "evaluacion_general": "Excelente candidato con red de apoyo veterinario"}',
    ai_evaluated_at = NOW() - INTERVAL '6 hours'
WHERE id = 45;

UPDATE adoption_applications SET 
    ai_decision = 'APPROVE', 
    ai_score = 91, 
    ai_auto_reject_reason = NULL,
    ai_risk_analysis = '{"verificacion_esterilizacion": "APROBADO - Conocimiento sobre procedimiento", "seguridad_hogar": "APROBADO - Casa familiar muy segura", "señales_peligro": "APROBADO - Familia comprometida", "compatibilidad_espacio": "APROBADO - Casa grande", "patrones_sospechosos": "APROBADO - Familia activa ideal", "evaluacion_general": "Excelente candidato familiar con energía para gatito activo"}',
    ai_evaluated_at = NOW() - INTERVAL '2 hours'
WHERE id = 46;

-- 5. TRACKING TASKS (20 tasks for complete tracking demonstration)

INSERT INTO tracking_tasks (application_id, task_type, due_date, status, description, notes, created_at) VALUES
-- TAREAS COMPLETADAS (8 tareas ya realizadas)
(7, 
 'bienestar', 
 NOW() - INTERVAL '100 days',
 'completada',
 'Primera visita de seguimiento: verificar adaptación inicial de Romeo en su nuevo hogar. Confirmar que tiene alimentación adecuada, caja de arena limpia y espacio seguro.',
 'Llamada realizada el ' || TO_CHAR(NOW() - INTERVAL '98 days', 'DD/MM/YYYY') || '. Excelente adaptación. El adoptante reporta que Romeo está muy feliz y cariñoso. Come bien y usa su caja sin problemas. Adjuntó fotos del gato en su nueva cama. ¡Éxito total!',
 NOW() - INTERVAL '105 days'),

(8, 
 'bienestar', 
 NOW() - INTERVAL '80 days',
 'completada',
 'Verificar adaptación de Bella. Confirmar que recibe cuidados veterinarios y está socializada.',
 'Visita presencial realizada. Bella está perfectamente adaptada. El adoptante la lleva a chequeos regulares. Muy juguetona y saludable.',
 NOW() - INTERVAL '85 days'),

(9, 
 'esterilizacion', 
 NOW() - INTERVAL '70 days',
 'completada',
 'Confirmar que Max fue llevado a su chequeo post-adopción y verificar estado de esterilización.',
 'Certificado veterinario recibido. Max en perfecto estado de salud. Esterilización confirmada previo a adopción.',
 NOW() - INTERVAL '75 days'),

(10, 
 'bienestar', 
 NOW() - INTERVAL '45 days',
 'completada',
 'Primera llamada de seguimiento para Mia. Verificar adaptación y bienestar general.',
 'Llamada realizada. La adoptante está muy contenta. Mia duerme con ella todas las noches. Come bien y es muy cariñosa. Sin problemas de comportamiento.',
 NOW() - INTERVAL '50 days'),

(11, 
 'esterilizacion', 
 NOW() - INTERVAL '30 days',
 'completada',
 'Confirmar esterilización de Garfield según plan de salud acordado.',
 'Ya estaba esterilizado antes de la adopción. Certificado en archivo. Adoptante también lo llevó a chequeo nutricional para plan de dieta.',
 NOW() - INTERVAL '35 days'),

(7, 
 'bienestar', 
 NOW() - INTERVAL '20 days',
 'completada',
 'Seguimiento a 6 meses: verificar salud a largo plazo de Romeo.',
 'Todo perfecto. Romeo es parte integral de la familia. Adoptante envió video de Romeo jugando. Muy saludable.',
 NOW() - INTERVAL '18 days'),

(8, 
 'bienestar', 
 NOW() - INTERVAL '10 days',
 'completada',
 'Seguimiento a 5 meses de Bella. Verificar continuidad de cuidados.',
 'Visita presencial. Bella sigue perfectamente cuidada. El hogar está adaptado para ella con rascadores y juguetes. Excelente.',
 NOW() - INTERVAL '8 days'),

(10, 
 'bienestar', 
 NOW() - INTERVAL '5 days',
 'completada',
 'Seguimiento a 2 meses de Mia. Confirmar que todo sigue bien.',
 'Llamada de seguimiento. La familia está encantada con Mia. Es muy cariñosa y se lleva bien con todos. Fotos compartidas en grupo.',
 NOW() - INTERVAL '3 days'),

-- TAREAS PENDIENTES (7 tareas próximas y activas)
(9, 
 'bienestar', 
 NOW() + INTERVAL '5 days',
 'pendiente',
 'Seguimiento a 3 meses de Max. Verificar adaptación a largo plazo y estado de salud general.',
 NULL,
 NOW() - INTERVAL '85 days'),

(11, 
 'bienestar', 
 NOW() + INTERVAL '10 days',
 'pendiente',
 'Primera visita de seguimiento para Garfield. Confirmar que está siguiendo plan de dieta y está saludable.',
 NULL,
 NOW() - INTERVAL '40 days'),

(7, 
 'bienestar', 
 NOW() + INTERVAL '15 days',
 'pendiente',
 'Seguimiento anual de Romeo. Verificar vacunas y salud general a largo plazo.',
 NULL,
 NOW() - INTERVAL '175 days'),

(8, 
 'esterilizacion', 
 NOW() + INTERVAL '20 days',
 'pendiente',
 'Verificar certificado de vacunación anual de Bella según calendario.',
 NULL,
 NOW() - INTERVAL '145 days'),

(10, 
 'bienestar', 
 NOW() + INTERVAL '25 days',
 'pendiente',
 'Seguimiento a 3 meses de Mia. Confirmar adaptación completa y bienestar.',
 NULL,
 NOW() - INTERVAL '55 days'),

(9, 
 'esterilizacion', 
 NOW() + INTERVAL '30 days',
 'pendiente',
 'Verificar vacunas de refuerzo de Max según calendario veterinario.',
 NULL,
 NOW() - INTERVAL '85 days'),

(11, 
 'bienestar', 
 NOW() + INTERVAL '40 days',
 'pendiente',
 'Seguimiento a 3 meses de Garfield. Verificar progreso en plan de dieta y peso.',
 NULL,
 NOW() - INTERVAL '40 days'),

-- TAREAS ATRASADAS (5 tareas vencidas que necesitan atención urgente)
(7, 
 'bienestar', 
 NOW() - INTERVAL '10 days',
 'atrasada',
 'Seguimiento a 5 meses de Romeo. URGENTE: Confirmar que sigue recibiendo cuidados adecuados.',
 NULL,
 NOW() - INTERVAL '155 days'),

(8, 
 'bienestar', 
 NOW() - INTERVAL '5 days',
 'atrasada',
 'Llamada de seguimiento mensual de Bella. Verificar bienestar.',
 NULL,
 NOW() - INTERVAL '120 days'),

(9, 
 'bienestar', 
 NOW() - INTERVAL '3 days',
 'atrasada',
 'Seguimiento a 2 meses de Max. URGENTE: Contactar a adoptante.',
 NULL,
 NOW() - INTERVAL '60 days'),

(10, 
 'esterilizacion', 
 NOW() - INTERVAL '7 days',
 'atrasada',
 'Verificar certificado de esterilización de Mia si no estaba esterilizada al adoptar.',
 NULL,
 NOW() - INTERVAL '45 days'),

(11, 
 'bienestar', 
 NOW() - INTERVAL '2 days',
 'atrasada',
 'Seguimiento a 1 mes de Garfield. URGENTE: Verificar adaptación inicial y dieta.',
 NULL,
 NOW() - INTERVAL '30 days'),

-- TAREAS PENDIENTES (10 próximas tareas programadas)
(12, 
 'bienestar', 
 NOW() + INTERVAL '5 days',
 'pendiente',
 'Primera llamada de seguimiento para Luna Azul. Verificar adaptación a su nuevo hogar, alimentación adecuada y comportamiento general.',
 NULL,
 NOW() - INTERVAL '145 days'),

(13, 
 'esterilizacion', 
 NOW() + INTERVAL '10 days',
 'pendiente',
 'Confirmar que Trueno asistió a su cita de esterilización programada. Solicitar certificado veterinario.',
 NULL,
 NOW() - INTERVAL '160 days'),

(14, 
 'bienestar', 
 NOW() + INTERVAL '3 days',
 'pendiente',
 'Seguimiento a 3 meses de Oreo con familia con niños. Verificar que la interacción sea positiva y supervisada.',
 NULL,
 NOW() - INTERVAL '100 days'),

(12, 
 'bienestar', 
 NOW() + INTERVAL '15 days',
 'pendiente',
 'Segundo seguimiento de Luna Azul. Verificar vacunas y chequeo veterinario de los 6 meses.',
 NULL,
 NOW() - INTERVAL '120 days'),

(13, 
 'bienestar', 
 NOW() + INTERVAL '7 days',
 'pendiente',
 'Verificar convivencia de Trueno con el perro de la familia. Confirmar que no hay problemas de territorialidad.',
 NULL,
 NOW() - INTERVAL '140 days'),

(7, 
 'bienestar', 
 NOW() + INTERVAL '20 days',
 'pendiente',
 'Seguimiento a 6 meses de Romeo. Verificar chequeo médico semestral y estado general.',
 NULL,
 NOW() - INTERVAL '150 days'),

(11, 
 'esterilizacion', 
 NOW() + INTERVAL '12 days',
 'pendiente',
 'Confirmar esterilización de Garfield si aún no estaba esterilizado al momento de adopción.',
 NULL,
 NOW() - INTERVAL '35 days'),

(14, 
 'bienestar', 
 NOW() + INTERVAL '25 days',
 'pendiente',
 'Visita domiciliaria programada para Oreo. Verificar condiciones del hogar y bienestar del gato con la familia.',
 NULL,
 NOW() - INTERVAL '90 days'),

(8, 
 'bienestar', 
 NOW() + INTERVAL '8 days',
 'pendiente',
 'Seguimiento especial de Bella. Verificar que continúa recibiendo atención veterinaria regular.',
 NULL,
 NOW() - INTERVAL '130 days'),

(10, 
 'bienestar', 
 NOW() + INTERVAL '18 days',
 'pendiente',
 'Llamada de seguimiento para Mia. Confirmar que está bien adaptada y socializada en su hogar.',
 NULL,
 NOW() - INTERVAL '50 days'),

-- TAREAS MÁS ATRASADAS (5 tareas urgentes que necesitan atención inmediata)
(9, 
 'bienestar', 
 NOW() - INTERVAL '10 days',
 'atrasada',
 'Seguimiento a Max. URGENTE: Se intentó contactar sin éxito. Requiere intervención inmediata.',
 NULL,
 NOW() - INTERVAL '80 days'),

(7, 
 'esterilizacion', 
 NOW() - INTERVAL '15 days',
 'atrasada',
 'Solicitar certificado de esterilización actualizado para Romeo. ATRASADO: No se ha recibido documentación.',
 NULL,
 NOW() - INTERVAL '160 days'),

(12, 
 'bienestar', 
 NOW() - INTERVAL '8 days',
 'atrasada',
 'Visita domiciliaria a Luna Azul ATRASADA. Reprogramar con urgencia.',
 NULL,
 NOW() - INTERVAL '140 days'),

(13, 
 'bienestar', 
 NOW() - INTERVAL '12 days',
 'atrasada',
 'Seguimiento de Trueno en hogar con perro. URGENTE: Adoptante reportó conflictos. Requiere asesoría inmediata.',
 NULL,
 NOW() - INTERVAL '155 days'),

(14, 
 'bienestar', 
 NOW() - INTERVAL '5 days',
 'atrasada',
 'Asesoría a familia de Oreo sobre manejo con niños. ATRASADO: Familia requiere orientación.',
 NULL,
 NOW() - INTERVAL '115 days');

-- 6. EDUCATIONAL CONTENT (12 varied publications)

INSERT INTO educational_posts (author_id, title, content, content_type, category, image_url, created_at) VALUES
-- STERILIZATION ARTICLES (2 publications)
(1, 
 'Importancia de la Esterilización en Gatos',
 'La esterilización es un procedimiento quirúrgico que previene la reproducción en gatos y es fundamental para controlar la sobrepoblación felina. BENEFICIOS: Reduce el riesgo de cáncer reproductivo en un 90%, elimina el celo en hembras (que puede ser estresante), disminuye comportamientos agresivos en machos como peleas y marcaje, previene camadas no deseadas y aumenta la esperanza de vida en 3-5 años. EDAD RECOMENDADA: Entre 5-6 meses de edad, antes del primer celo. RECUPERACIÓN: 7-10 días con collar isabelino y antibióticos. MITOS: No causa obesidad (la sobrealimentación sí), no cambia su personalidad (la mejora), no es costoso (muchas organizaciones ofrecen ayuda). IMPORTANTE: Consulta con tu veterinario para el mejor momento según el caso de tu gato.',
 'articulo',
 'esterilizacion',
 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee',
 NOW() - INTERVAL '90 days'),

(2, 
 'Mitos y Realidades sobre la Esterilización Felina',
 'Desmintiendo los mitos más comunes. MITO 1: "Mi gato engordará" - REALIDAD: La esterilización no causa obesidad, la falta de ejercicio y sobrealimentación sí. MITO 2: "Perderá su personalidad" - REALIDAD: Solo reduce comportamientos relacionados con hormonas (agresividad, marcaje). MITO 3: "Es mejor que tengan una camada primero" - REALIDAD: No hay beneficio médico, aumenta riesgos. MITO 4: "Es muy caro" - REALIDAD: Existen programas de bajo costo y el gasto de criar una camada es mayor. MITO 5: "Es peligroso" - REALIDAD: Es una cirugía rutinaria con mínimos riesgos. BENEFICIOS COMPROBADOS: Menos cáncer, menos infecciones, menos estrés, más longevidad. ¡Esterilizar es un acto de amor!',
 'guia',
 'esterilizacion',
 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83',
 NOW() - INTERVAL '60 days'),

-- NUTRITION ARTICLES (2 publications)
(2, 
 'Alimentación Adecuada para Gatos Adultos',
 'Los gatos son carnívoros obligados y necesitan proteína animal de alta calidad. NUTRIENTES ESENCIALES: Proteína (mínimo 26% en alimento seco, 40% en húmedo), taurina (aminoácido vital para corazón y vista), ácidos grasos omega-3 y omega-6, vitaminas A, D y E. FRECUENCIA: 2-3 comidas diarias para Adultos. Agua fresca siempre disponible. ALIMENTOS PROHIBIDOS: Chocolate, cebolla, ajo, uvas, alcohol, cafeína, leche de vaca (causa diarrea), huesos cocidos, pescado crudo en exceso. SEÑALES DE BUENA NUTRICIÓN: Pelaje brillante, energía adecuada, peso saludable (costillas palpables pero no visibles), deposiciones firmes. TIPOS DE ALIMENTO: Seco (bueno para dientes), húmedo (más hidratación), mixto (ideal). Consulta con tu veterinario para necesidades específicas.',
 'guia',
 'nutricion',
 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e',
 NOW() - INTERVAL '75 days'),

(4, 
 'Guía de Snacks y Premios Saludables para Gatos',
 'No todos los premios son iguales. OPCIONES SALUDABLES: Pollo cocido sin piel ni huesos, atún en agua (ocasional, no diario), premios comerciales con alto contenido de carne, snacks dentales para limpieza. FRECUENCIA: Los premios no deben superar el 10% de calorías diarias. PREMIOS A EVITAR: Comida humana procesada, lácteos, snacks con colorantes artificiales, golosinas con azúcar. PREMIOS FUNCIONALES: Con probióticos para digestión, con omega-3 para pelaje, dentales para higiene oral, naturales liofilizados sin aditivos. CANTIDADES: Gato Adulto promedio (4-5kg) puede recibir 20-25 calorías en premios diarios. OBSERVA: Si hay cambios en deposiciones o alergias, suspende. Los premios son herramientas de entrenamiento y vínculo, úsalos con inteligencia.',
 'articulo',
 'nutricion',
 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8',
 NOW() - INTERVAL '45 days'),

-- HEALTH ARTICLES (3 publications)
(1, 
 'Vacunas Esenciales para Gatos',
 'Mantener vacunas actualizadas protege a tu gato de enfermedades mortales. VACUNAS BÁSICAS: Triple Felina (panleucopenia, rinotraqueítis, calicivirus) - primera dosis a las 8 semanas, refuerzos cada 3-4 semanas hasta las 16 semanas, revacunación anual. Rabia - obligatoria por ley en muchas regiones, primera dosis a los 3-4 meses, refuerzo anual. VACUNAS OPCIONALES: Leucemia Felina (recomendada para gatos que salen), Clamidia (en hogares múltiples), Bordetella (refugios). CALENDARIO: 8 semanas: Primera triple. 12 semanas: Segunda triple + FeLV. 16 semanas: Tercera triple + Rabia. Anualmente: Refuerzos. EFECTOS: Leve letargo y dolor local son normales 24-48h. IMPORTANTE: No vacunar si está enfermo. Consulta tu veterinario para plan personalizado.',
 'guia',
 'salud',
 'https://images.unsplash.com/photo-1574158622682-e40e69881006',
 NOW() - INTERVAL '80 days'),

(3, 
 'Señales de Emergencia Veterinaria en Gatos',
 'Aprende a reconocer cuándo tu gato necesita atención URGENTE. EMERGENCIAS INMEDIATAS: Dificultad respiratoria (boca abierta, jadeo), no puede orinar (especialmente machos), trauma grave (caídas, atropellamiento), convulsiones, sangrado que no para en 5 min, colapso o inconsciencia, intoxicación conocida, temperatura >40°C o <37°C. URGENTE (4-6 horas): Vómito persistente (más de 3 veces), diarrea con sangre, dolor abdominal severo, cojera severa, ojo rojo o cerrado, llanto constante al orinar. CONSULTA PRONTO (24h): Pérdida de apetito >24h, letargo severo, estornudos constantes, ojos/nariz con secreción. QUÉ HACER: Mantén la calma, llama al veterinario, transporta en caja segura, no des medicamentos humanos. PREVENCIÓN: Chequeos anuales detectan problemas temprano. ¡La prevención salva vidas!',
 'articulo',
 'salud',
 'https://images.unsplash.com/photo-1543852786-1cf6624b9987',
 NOW() - INTERVAL '50 days'),

(1, 
 'Parásitos Comunes en Gatos: Prevención y Tratamiento',
 'Protege a tu gato de parásitos internos y externos. INTERNOS: Lombrices redondas (vómito, diarrea, abdomen hinchado), tenias (segmentos en heces), giardias (diarrea crónica), coccidios (común en Cachorros). EXTERNOS: Pulgas (rascado, pérdida de pelo), garrapatas (bultos en piel), ácaros del oído (sacude cabeza), sarna (costras, rascado). PREVENCIÓN: Desparasitación interna cada 3-6 meses, pipetas o collares antipulgas mensuales, higiene de caja de arena diaria, revisión post-paseos. TRATAMIENTO: Consulta veterinario para diagnóstico correcto, sigue tratamiento completo, desinfecta el hogar, trata a todas las mascotas. SÍNTOMAS DE ALERTA: Diarrea persistente, vómito con gusanos, pérdida de peso, barriga hinchada en Cachorros, rascado excesivo. La prevención es más económica que el tratamiento.',
 'guia',
 'salud',
 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
 NOW() - INTERVAL '35 days'),

-- BEHAVIOR ARTICLES (2 publications)
(2, 
 'Entendiendo el Comportamiento de tu Gato',
 'Los gatos se comunican de formas únicas. LENGUAJE CORPORAL: Cola hacia arriba = feliz y confiado. Cola entre las patas = asustado. Cola inflada = muy asustado o agresivo. Orejas adelante = alerta y curioso. Orejas atrás/planas = enojado o temeroso. VOCALIZACIONES: Ronroneo = generalmente felicidad (pero también dolor). Maullar = comunicación con humanos. Bufar/gruñir = advertencia. Chillar = dolor o miedo. COMPORTAMIENTOS: Amasar = confort (heredado de amamantar). Regalar "presas" = muestra de afecto. Frotarse = marcaje con feromonas. Rascar = afilar uñas y marcar territorio. SEÑALES DE ESTRÉS: Esconderse constantemente, no usar caja de arena, agresividad repentina, pérdida de apetito, lamido excesivo. ENRIQUECIMIENTO: Juguetes, rascadores, perchas altas, tiempo de juego. Un gato estimulado es un gato feliz.',
 'articulo',
 'comportamiento',
 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2',
 NOW() - INTERVAL '65 days'),

(4, 
 'Cómo Preparar tu Hogar para un Gato Nuevo',
 'La llegada de un gato requiere preparación. ANTES DE LA LLEGADA: Zona segura inicial (habitación tranquila), caja de arena en lugar accesible pero privado, tazones para agua y comida (cerámica o acero), rascador vertical y horizontal, cama o manta suave, juguetes variados, escondites y perchas. SEGURIDAD: Asegurar ventanas y balcones, guardar cables eléctricos, eliminar plantas tóxicas (lirios, azaleas, potos), asegurar productos de limpieza, cerrar electrodomésticos antes de usar. PRIMEROS DÍAS: Dejar explorar a su ritmo, no forzar interacción, mantener rutina de alimentación, ubicación fija de caja de arena, paciencia con adaptación (puede tomar 2-4 semanas). PRESENTACIONES: Con otros gatos (gradual, a través de puerta), con perros (supervisión estricta, separación inicial), con niños (enseñar respeto y cuidado). SIGNOS DE BUENA ADAPTACIÓN: Come con apetito, usa caja de arena, juega y explora, busca interacción. La paciencia es clave para una transición exitosa.',
 'guia',
 'adopcion',
 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee',
 NOW() - INTERVAL '55 days'),

-- CARE ARTICLES (2 publications)
(3, 
 'Higiene y Cuidado del Pelaje Felino',
 'El cuidado del pelaje mantiene a tu gato saludable. CEPILLADO: Pelo corto 1-2 veces/semana, pelo largo diario. Beneficios: reduce bolas de pelo, detecta parásitos temprano, fortalece vínculo. HERRAMIENTAS: Cepillo de cerdas suaves (pelo corto), peine metálico (pelo largo), guante de goma (pelos muertos), cortaúñas específico para gatos. BAÑO: Generalmente innecesario (gatos se limpian solos), solo si muy sucio o prescrito por veterinario, usar shampoo específico para gatos, temperatura tibia, secar bien. CUIDADO DE UÑAS: Cortar cada 2-3 semanas, solo la punta translúcida (evitar zona rosada), tener rascadores disponibles. OÍDOS: Revisar semanalmente, limpiar solo parte visible con gasa húmeda, nunca hisopos en canal auditivo, consultar si hay mal olor o secreción. OJOS: Limpiar legañas con gasa húmeda, consultar si hay enrojecimiento o secreción excesiva. DIENTES: Idealmente cepillado semanal, alimento seco ayuda, snacks dentales, limpieza profesional anual. El cuidado preventivo evita problemas mayores.',
 'guia',
 'salud',
 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4',
 NOW() - INTERVAL '42 days'),

(1, 
 'La Caja de Arena: Guía Completa de Manejo',
 'La caja de arena adecuada es fundamental para el bienestar felino. CANTIDAD: Mínimo N+1 (número de gatos + 1). UBICACIÓN: Lugar tranquilo y accesible, lejos de comida y agua, evitar rincones trampa, privada pero no aislada, una por piso en casas de varios niveles. TIPO: Abierta vs cerrada (preferencia individual), tamaño adecuado (1.5 veces largo del gato), entrada baja para gatos senior. ARENA: Aglomerante o no aglomerante, sin perfumes fuertes, profundidad 5-7cm, preferencias individuales varían. LIMPIEZA: Recoger deposiciones diariamente, cambio completo semanal, lavar con agua y jabón neutro (no lejía), secar completamente. PROBLEMAS COMUNES: No usar = revisar salud primero, puede ser médico (infección, cálculos), estrés o cambios, suciedad de caja, ubicación inadecuada, otra mascota intimidante. SOLUCIONES: Más cajas en diferentes ubicaciones, diferentes tipos de arena, limpieza más frecuente, reducir estrés ambiental. Si el problema persiste, consulta veterinario para descartar causas médicas. Una caja adecuada previene problemas de comportamiento.',
 'guia',
 'general',
 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e',
 NOW() - INTERVAL '38 days'),

-- ADOPTION ARTICLES (2 publications)
(2, 
 '¿Estás Listo para Adoptar un Gato? Checklist Completo',
 'Adoptar un gato es una decisión de 15-20 años. COMPROMISO: Tiempo diario (juego, cuidados, socialización), gastos mensuales ($1000-3000), gastos veterinarios anuales ($3000-5000), emergencias médicas (tener fondo), vacaciones (cuidador o pensión). ESTILO DE VIDA: Horarios compatibles (no ausencias prolongadas), vivienda estable (permitida mascotas), mudanzas futuras consideradas, otros habitantes de acuerdo. CONOCIMIENTO: Necesidades básicas (alimentación, higiene, salud), comportamiento felino normal, señales de enfermedad, compromiso de esterilización. RECURSOS: Presupuesto mensual establecido, veterinario de confianza identificado, tiempo para socialización, espacio adecuado en hogar. RAZONES INCORRECTAS: Regalo sorpresa, capricho temporal, enseñar responsabilidad a niños pequeños, solucionar plagas, moda o estética. SEÑALES DE QUE ESTÁS LISTO: Investigaste a fondo, tienes presupuesto establecido, familia completa está de acuerdo, entiendes compromiso a largo plazo, hogar preparado y seguro. La adopción responsable comienza con autoevaluación honesta. ¿Estás listo realmente?',
 'guia',
 'comportamiento',
 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8',
 NOW() - INTERVAL '55 days'),

(4, 
 'Cómo Solucionar Problemas de Comportamiento en Gatos',
 'Problemas comunes y soluciones prácticas. PROBLEMA 1 - Orina fuera de la caja: CAUSAS: Caja sucia, problemas médicos, estrés, caja muy pequeña. SOLUCIÓN: Limpiar diario, visita veterinaria, una caja por gato + 1 extra, ubicación tranquila. PROBLEMA 2 - Rasca muebles: CAUSAS: Necesidad natural de afilar uñas. SOLUCIÓN: Rascadores estratégicos, atraer con catnip, premiar uso correcto, cubiertas temporales en muebles. PROBLEMA 3 - Agresividad: CAUSAS: Miedo, dolor, juego inadecuado, sobre-estimulación. SOLUCIÓN: Identificar trigger, no castigar, juego con juguetes (no manos), respetar su espacio. PROBLEMA 4 - Maullar excesivo: CAUSAS: Atención, hambre, enfermedad, senilidad. SOLUCIÓN: Descartar problemas médicos, rutinas consistentes, no reforzar maullidos. IMPORTANTE: Nunca castigues físicamente. La paciencia y comprensión son clave.',
 'guia',
 'comportamiento',
 'https://images.unsplash.com/photo-1569591159212-b02ea8a9f239',
 NOW() - INTERVAL '40 days'),

-- ADOPTION ARTICLES (2 publications)
(1, 
 'Preparando tu Hogar para un Gato Adoptado',
 'Lista completa para una adopción exitosa. ELEMENTOS ESENCIALES: Caja de arena (una por gato + 1), arena sin perfume (clumping es mejor), comedero y bebedero (cerámica o acero), alimento de calidad (según edad), rascador vertical y horizontal, escondites/cuevas, juguetes variados, transportadora resistente, cepillo (según pelaje). PREPARACIÓN DEL ESPACIO: Comienza con una habitación segura y pequeña. Elimina peligros: cables, plantas tóxicas (lirios, anturios), ventanas sin red, químicos. Proporciona altura: repisas o torres. PRIMEROS DÍAS: Dale tiempo para explorar a su ritmo. No lo fuerces a socializar. Establece rutinas de comida y juego. Agenda cita veterinaria primera semana. ADAPTACIÓN: 2-4 semanas es normal. Algunos gatos tardan más. Paciencia y amor son esenciales. SEÑALES POSITIVAS: Come, usa caja de arena, explora, se acicala. ¡Bienvenido a la familia!',
 'guia',
 'adopcion',
 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb',
 NOW() - INTERVAL '70 days'),

(3, 
 'Consejos para Adoptar tu Primer Gato',
 'Guía para adoptantes primerizos. ANTES DE ADOPTAR: Evalúa tu estilo de vida (horarios, espacio, presupuesto). Compromiso de 15-20 años. Presupuesto mensual: $1000-2000 (alimento, arena, veterinario). ELIGIENDO TU GATO: Cachorro = más energía y entrenamiento. Adulto = personalidad establecida, menos trabajo. Senior = tranquilo, merece amor. Considera: nivel de actividad, necesidades especiales, compatibilidad. PROCESO DE ADOPCIÓN: Llena solicitud honestamente. Visita al gato varias veces. Pregunta sobre salud e historia. Prepara tu casa antes de traerlo. PRIMEROS DÍAS: Habitación segura inicial. Rutina consistente desde día 1. Paciencia con la adaptación. Juega 2-3 veces al día. ERRORES COMUNES: Esperar que sea como un perro. Forzar interacción. No proporcionar enriquecimiento. Ignorar señales de estrés. RECUERDA: Cada gato es único. El amor y paciencia conquistan todo. ¡Adoptar salva vidas!',
 'articulo',
 'adopcion',
 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d',
 NOW() - INTERVAL '30 days'),

-- EVENTS AND WORKSHOPS (2 publications)
(2, 
 'Campaña de Esterilización Gratuita - Enero 2025',
 'ANUNCIO IMPORTANTE: Campaña de esterilización gratuita para gatos rescatados. FECHAS: 15-20 de Enero 2025. UBICACIÓN: Clínica Veterinaria "Amigos Felinos", Av. Principal #123. REQUISITOS: Gato rescatado o adoptado, certificado de rescate o adopción, cita previa (cupos limitados). INCLUYE: Cirugía completa, anestesia, antibióticos post-operatorios, collar isabelino, seguimiento telefónico. CÓMO REGISTRARSE: Llamar al 7000-0000, WhatsApp 7000-0001, email: esterilizacion@katze.com. CUPOS: 50 gatos (llenar formulario en línea). IMPORTANTE: El gato debe tener mínimo 5 meses, ayuno de 12 horas previo, transportadora obligatoria. DONACIONES: Aceptamos donaciones de alimento, mantas y juguetes para refugios. OBJETIVO: Contribuir al control ético de población felina. ¡Juntos podemos hacer la diferencia! #EsterilizarEsAmar',
 'evento',
 'esterilizacion',
 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467',
 NOW() - INTERVAL '20 days'),

(4, 
 'Taller: Primeros Auxilios para Gatos - Inscripciones Abiertas',
 'Aprende a responder en emergencias felinas. FECHA: Sábado 15 de Enero, 10:00-14:00hrs. LUGAR: Centro Comunitario "El Refugio", Sala B. DIRIGIDO A: Dueños de gatos, rescatistas, adoptantes, personal de refugios. TEMARIO: RCP básico en gatos, heridas y sangrados, intoxicaciones comunes, atragantamiento, golpe de calor, convulsiones, transporte de emergencia, kit de primeros auxilios. INCLUYE: Material didáctico, certificado de asistencia, práctica con maniquíes, kit básico de primeros auxilios de regalo. INVERSIÓN: $200 (incluye materiales). Descuento 50% para rescatistas. INSCRIPCIÓN: Formulario en web, pago anticipado, cupos limitados a 30 personas. INSTRUCTOR: Dr. Carlos Mendoza, veterinario con 15 años de experiencia en emergencias. IMPORTANTE: El taller NO reemplaza atención veterinaria profesional. Es conocimiento para actuar mientras llegas al veterinario. ¡Salva vidas aprendiendo! Inscríbete ya.',
 'taller',
 'salud',
 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7',
 NOW() - INTERVAL '12 days'),

-- EVENTS (1 publication)
(2, 
 'Jornada de Esterilización Gratuita - Abril 2025',
 '¡Evento especial de esterilización! La asociación Katze junto con veterinarios voluntarios ofrece jornada gratuita para familias de bajos recursos. FECHA: Sábado 15 de Abril 2025, 8:00 AM - 4:00 PM. LUGAR: Centro Comunitario Colonia Del Valle, Av. Principal 123. REQUISITOS: Registro previo obligatorio (cupo limitado: 50 gatos), gato mínimo 5 meses de edad y 2kg de peso, ayuno de 12 horas previo, comprobante de domicilio, transportadora segura, toalla para el retorno. INCLUYE: Cirugía de esterilización completa, anestesia y monitoreo, antibióticos post-operatorios (3 días), collar isabelino, revisión post-quirúrgica a los 10 días, certificado de esterilización. REGISTRO: WhatsApp: +591 7234 5678 (enviar: nombre completo, teléfono, dirección, datos del gato: nombre, edad, peso, sexo). CUPOS: Del 1-10 Abril. IMPORTANTE: Llevar cobija para transporte post-cirugía. Seguir instrucciones de cuidado post-operatorio. ¡No pierdas esta oportunidad!',
 'evento',
 'esterilizacion',
 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467',
 NOW() - INTERVAL '15 days'),

-- WORKSHOPS (1 publication)
(1, 
 'Taller Virtual: Primeros Auxilios para Gatos',
 'Aprende a salvar la vida de tu gato en emergencias. FORMATO: Virtual por Zoom. FECHA: Sábado 20 de Abril 2025, 10:00 AM - 12:00 PM (hora de Bolivia). INSTRUCTOR: Dra. Patricia Hernández, DVM, certificada en emergencias veterinarias con 15 años de experiencia. TEMARIO: Módulo 1 - Signos vitales normales (pulso, respiración, temperatura). Módulo 2 - Reconocimiento de emergencias vitales. Módulo 3 - Técnicas de RCP básico para gatos. Módulo 4 - Manejo de heridas y hemorragias. Módulo 5 - Intoxicaciones comunes y primeros auxilios. Módulo 6 - Cuándo acudir al veterinario. Módulo 7 - Armado de botiquín felino. INCLUYE: Manual digital descargable PDF (40 páginas), sesión de preguntas y respuestas en vivo, certificado digital de participación, acceso a grabación por 7 días. CUPO: 100 personas. COSTO: GRATUITO (donaciones voluntarias para refugio). REGISTRO: www.katze.com/talleres o email: talleres@katze.com (confirmar asistencia). ¡Inscríbete ya!',
 'taller',
 'salud',
 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13',
 NOW() - INTERVAL '20 days');

-- DATA VERIFICATION QUERIES

-- Users by role
SELECT role, COUNT(*) as total 
FROM users 
GROUP BY role 
ORDER BY role;

-- Cats by status
SELECT approval_status, adoption_status, COUNT(*) as total 
FROM cats 
GROUP BY approval_status, adoption_status 
ORDER BY approval_status, adoption_status;

-- Applications by status
SELECT status, COUNT(*) as total 
FROM adoption_applications 
GROUP BY status 
ORDER BY status;

-- AI evaluations by decision
SELECT ai_decision, COUNT(*) as total, ROUND(AVG(ai_score), 2) as avg_score
FROM adoption_applications 
WHERE ai_decision IS NOT NULL
GROUP BY ai_decision 
ORDER BY ai_decision;

-- Tracking tasks by status
SELECT status, COUNT(*) as total 
FROM tracking_tasks 
GROUP BY status 
ORDER BY status;

-- Educational content by type and category
SELECT content_type, category, COUNT(*) as total 
FROM educational_posts 
GROUP BY content_type, category 
ORDER BY content_type, category;

-- SEED DATA SUMMARY

/*
SEED STATISTICS:

USERS (10 total):
   - 1 Admin
   - 4 Rescuers (different seniority levels)
   - 5 Adopters (different profiles)

CATS (18 total):
   - 10 Approved and available for adoption
     * All with breed and living_space_requirement
     * 6 Sterilized
     * 4 Pending sterilization
     * Various ages (kitten to senior)
     * Published on different dates (180 to 3 days ago)
   - 3 Pending approval (recent)
   - 5 Already adopted (for statistics)

ADOPTION APPLICATIONS (15 total):
   - 6 Pending review (diverse cases)
   - 5 Approved (generate tracking tasks)
   - 4 Rejected (for different valid reasons)

AI EVALUATIONS (10 total):
   - 6 APPROVE decisions (scores 75-92)
   - 2 REVIEW decisions (scores 75-78, need human review)
   - 4 REJECT decisions (scores 20-35, failed kill-switches)
   - Demonstrates 5 kill-switches:
     1. Sterilization commitment
     2. Home safety
     3. Danger signs (time, stability, health)
     4. Living space compatibility
     5. Suspicious patterns

TRACKING TASKS (20 total):
   - 8 Completed (with detailed notes)
   - 7 Pending (next 5-40 days)
   - 5 Overdue (to demonstrate urgencies)

EDUCATIONAL CONTENT (12 publications):
   - 2 Sterilization articles
   - 2 Nutrition articles
   - 3 Health articles
   - 2 Behavior articles
   - 2 Adoption articles
   - 1 Event (sterilization campaign)
   - 1 Workshop (first aid)

USE CASES DEMONSTRATED:

1. ADMIN:
   - Approve/reject pending cat publications
   - Manage users and roles
   - View complete system statistics
   - Review AI evaluations and override decisions

2. RESCUER:
   - Publish cats for adoption (with breed and living space)
   - View status of publications
   - Manage adoption applications for their cats
   - Perform post-adoption tracking
   - Handle overdue tasks

3. ADOPTER:
   - View catalog of available cats (filtered by living space)
   - Submit adoption applications
   - Receive AI evaluation (instant feedback)
   - View application status
   - Experience approval and rejection cases

4. AI EVALUATION SYSTEM:
   - Automatic evaluation of all applications
   - 5 kill-switches demonstrated:
     * Sterilization commitment check
     * Home safety assessment
     * Danger signs detection (time, stability)
     * Living space compatibility verification
     * Suspicious pattern detection
   - Decisions: APPROVE (high score), REVIEW (needs human), REJECT (auto-reject)
   - Score range: 20-92 points
   - Auto-reject reasons provided for transparency

5. STATISTICS:
   - Total adoptions: 5
   - Available cats: 10 (with breed and space requirements)
   - Sterilization rate: Calculable
   - Pending applications: 6
   - Overdue tasks: 5 (for alerts)
   - Oldest published cats (prioritization)
   - AI evaluation metrics (approval rate, average score)

6. TRACKING SYSTEM:
   - Completed tasks with notes
   - Scheduled pending tasks
   - Overdue tasks (urgencies)
   - Task types: wellness, sterilization verification

7. EDUCATIONAL CONTENT:
   - Multiple categories
   - Various formats (articles, guides, events, workshops)
   - Useful and realistic content

8. FIREBASE INTEGRATION:
   - All applications saved to Firestore (spreadsheet format)
   - Datasets auto-generated in Firebase Storage:
     * users.json
     * applications.json
     * cats.json
     * evaluations.json

TEST CREDENTIALS (EASY TO REMEMBER):

ADMIN:
   Email: admin@test.com
   Password: 123

RESCUERS:
   rescatista1@test.com | Password: 123
   rescatista2@test.com | Password: 123
   rescatista3@test.com | Password: 123
   rescatista4@test.com | Password: 123

ADOPTERS:
   adoptante1@test.com | Password: 123
   adoptante2@test.com | Password: 123
   adoptante3@test.com | Password: 123
   adoptante4@test.com | Password: 123
   adoptante5@test.com | Password: 123

EASY PATTERN:
   - Format: [role][number]@test.com
   - All use password: 123
   - Examples: admin@test.com, rescatista1@test.com, adoptante1@test.com

IMPORTANT NOTES:

1. All passwords use bcrypt hash of "123" (short for testing)
2. Image URLs point to Unsplash (public and free)
3. Phone numbers follow Bolivian format (+591)
4. Dates are relative to NOW() to maintain relevance
5. Data designed to demonstrate ALL functionalities
6. Table relationships properly established
7. Test cases cover successful and failed flows
8. AI evaluations include all kill-switch scenarios
9. Living space requirements: casa_grande, departamento, cualquiera
10. Breed field populated for all cats

FEATURES DEMONSTRATED:

Complete adoption system (pending → approved → tracking)
Publication management (pending → approved → adopted)
Statistics dashboard with real data
Post-adoption tracking system
Overdue tasks (urgencies)
Multiple users with different roles
Rejected applications (with valid reasons)
Cats with different sterilization statuses
Varied educational content
Age variety (kitten, adult, senior)
Different publication ages (180 days to 1 day)
AI evaluation system with 5 kill-switches:
   - Sterilization commitment
   - Home safety
   - Danger signs
   - Living space compatibility
   - Suspicious patterns
Auto-reject with transparent reasons
APPROVE/REVIEW/REJECT decisions
Score-based evaluation (20-92 points)
Living space filtering (new feature)
Breed information (new feature)
Firebase Firestore integration (spreadsheet format)
Firebase Storage datasets (auto-generated JSON files)

TO VERIFY SEED:
   Run the SELECT queries above to see inserted data summary.
*/
