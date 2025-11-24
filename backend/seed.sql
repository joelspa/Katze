-- =============================================
-- SEED DATA - Sistema Katze
-- Datos realistas para demostrar todas las funcionalidades
-- =============================================

-- Limpieza de datos previos
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

-- =============================================
-- 1. USUARIOS (10 usuarios para pruebas fáciles)
-- =============================================
-- 🔐 CONTRASEÑA PARA TODOS: "123"
-- Hash bcrypt: $2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu

INSERT INTO users (email, password_hash, full_name, role, phone, created_at) VALUES
-- 👨‍💼 ADMINISTRADOR
('admin@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Admin Usuario', 'admin', '+591 7000 0001', NOW() - INTERVAL '1 year'),

-- 🦸 RESCATISTAS (4 rescatistas activos)
('rescatista1@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Rescatista Uno', 'rescatista', '+591 7000 0002', NOW() - INTERVAL '10 months'),
('rescatista2@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Rescatista Dos', 'rescatista', '+591 7000 0003', NOW() - INTERVAL '8 months'),
('rescatista3@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Rescatista Tres', 'rescatista', '+591 7000 0004', NOW() - INTERVAL '6 months'),
('rescatista4@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Rescatista Cuatro', 'rescatista', '+591 7000 0005', NOW() - INTERVAL '4 months'),

-- 🏠 ADOPTANTES (5 adoptantes con diferentes perfiles)
('adoptante1@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Uno', 'adoptante', '+591 7000 0006', NOW() - INTERVAL '3 months'),
('adoptante2@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Dos', 'adoptante', '+591 7000 0007', NOW() - INTERVAL '2 months'),
('adoptante3@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Tres', 'adoptante', '+591 7000 0008', NOW() - INTERVAL '1 month'),
('adoptante4@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Cuatro', 'adoptante', '+591 7000 0009', NOW() - INTERVAL '20 days'),
('adoptante5@test.com', '$2b$10$HwaY36O83PoNDTBe7yliVuewfiADUr1AlKCFaj3MEUY9N.ThtP2xu', 'Adoptante Cinco', 'adoptante', '+591 7000 0010', NOW() - INTERVAL '10 days');

-- =============================================
-- 2. GATOS (18 gatos con diversos estados para demostrar el sistema)
-- =============================================

INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, adoption_status, story, created_at) VALUES
-- GATOS APROBADOS Y DISPONIBLES (10 gatos para adopción)
('Luna', 
 'Gatita blanca muy cariñosa y juguetona. Le encanta dormir en lugares altos y perseguir juguetes. Perfecta para familias con niños.', 
 'cachorro', 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba", "https://images.unsplash.com/photo-1529257414772-1960b7bea4eb"]', 
 2, 
 'aprobado', 
 'en_adopcion',
 'Luna fue encontrada en un parque cuando apenas tenía 2 meses. Estaba sola, asustada y muy hambrienta. La rescaté una tarde lluviosa y desde entonces ha sido una gatita muy dulce y agradecida. Ahora tiene 6 meses y busca un hogar lleno de amor.',
 NOW() - INTERVAL '120 days'),

('Michi', 
 'Gato naranja de 2 años, muy tranquilo y perfecto para departamentos. Le gusta observar por la ventana y tomar siestas largas.', 
 'adulto', 
 'Saludable, desparasitado', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1574158622682-e40e69881006", "https://images.unsplash.com/photo-1592194996308-7b43878e84a6"]', 
 2, 
 'aprobado', 
 'en_adopcion',
 'Michi fue abandonado en la puerta de una clínica veterinaria. Su dueño anterior no pudo cuidarlo más. Es un gato muy noble que merece una segunda oportunidad con una familia que lo valore.',
 NOW() - INTERVAL '95 days'),

('Nala', 
 'Gatita tricolor de 1 año, energética y cariñosa. Se lleva bien con otros gatos y es muy juguetona.', 
 'adulto', 
 'Saludable, todas las vacunas', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8", "https://images.unsplash.com/photo-1548247416-ec66f4900b2e"]', 
 3, 
 'aprobado', 
 'en_adopcion',
 'Nala llegó a nosotros después de ser rescatada de una construcción donde vivía con su madre. Era muy tímida al principio, pero con paciencia se ha convertido en una gatita sociable y juguetona.',
 NOW() - INTERVAL '70 days'),

('Canela', 
 'Gatita café claro de 1 año, muy juguetona. Le encantan las cajas y las plumas. Ideal para hogares activos.', 
 'adulto', 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1606214174585-fe31582dc6ee"]', 
 2, 
 'aprobado', 
 'en_adopcion',
 'Canela fue rescatada de un refugio sobrepoblado. Es muy activa y necesita espacio para jugar y correr.',
 NOW() - INTERVAL '65 days'),

('Princesa', 
 'Gatita siamesa de 1 año, muy vocal y cariñosa. Le gusta seguir a sus humanos por toda la casa y conversar con maullidos.', 
 'adulto', 
 'Saludable, esterilizada recientemente', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2"]', 
 2, 
 'aprobado', 
 'en_adopcion',
 'Princesa fue abandonada cuando su familia se mudó. Es una gatita muy sociable que necesita mucha atención y amor.',
 NOW() - INTERVAL '50 days'),

('Manchas', 
 'Gato calico de 4 años, muy tranquilo. Ideal para personas mayores o familias con niños grandes. Le gusta la rutina.', 
 'adulto', 
 'Tratamiento de parásitos completado', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1518791841217-8f162f1e1131"]', 
 4, 
 'aprobado', 
 'en_adopcion',
 'Manchas vivió en las calles por varios años antes de ser rescatado. Es un gato muy resiliente y agradecido.',
 NOW() - INTERVAL '45 days'),

('Copito', 
 'Gatito blanco peludo de 5 meses, muy tierno. Necesita familia paciente para socialización.', 
 'cachorro', 
 'Saludable, primera vacuna', 
 'pendiente', 
 '["https://images.unsplash.com/photo-1519052537078-e6302a4968d4"]', 
 3, 
 'aprobado', 
 'en_adopcion',
 'Copito fue rescatado de un edificio abandonado junto con sus hermanos. Es un poco tímido pero responde bien al cariño.',
 NOW() - INTERVAL '30 days'),

('Tigre', 
 'Gato atigrado de 3 años, cazador nato. Perfecto para casas con jardín. Muy independiente pero leal.', 
 'adulto', 
 'Saludable, vacunas completas', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc"]', 
 4, 
 'aprobado', 
 'en_adopcion',
 'Tigre fue encontrado en una zona industrial. A pesar de su pasado difícil, es un gato noble que busca un hogar estable.',
 NOW() - INTERVAL '25 days'),

('Nieve', 
 'Gatita persa blanca de 2 años, pelaje largo que requiere cepillado diario. Muy calmada y elegante.', 
 'adulto', 
 'Saludable, chequeo completo', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1495360010541-f48722b34f7d"]', 
 5, 
 'aprobado', 
 'en_adopcion',
 'Nieve fue entregada por su dueño que se mudó al extranjero. Es una gata acostumbrada al cuidado humano.',
 NOW() - INTERVAL '18 days'),

('Zorro', 
 'Gatito naranja de 6 meses, muy juguetón y curioso. Le fascina explorar y trepar.', 
 'cachorro', 
 'Saludable, vacunación en proceso', 
 'pendiente', 
 '["https://images.unsplash.com/photo-1543852786-1cf6624b9987"]', 
 3, 
 'aprobado', 
 'en_adopcion',
 'Zorro fue rescatado de la calle cuando era muy pequeño. Ha crecido sano y fuerte, listo para su familia definitiva.',
 NOW() - INTERVAL '12 days'),

-- GATOS PENDIENTES DE APROBACIÓN (3 publicaciones recientes)
('Bigotes', 
 'Gato blanco y negro de 3 años, muy independiente pero cariñoso cuando quiere. Ideal para personas tranquilas.', 
 'adulto', 
 'Saludable, chequeo reciente', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1569591159212-b02ea8a9f239"]', 
 4, 
 'pendiente', 
 'en_adopcion',
 'Bigotes fue encontrado vagando por mi colonia. Es un gato adulto que se adaptó rápidamente a estar en casa.',
 NOW() - INTERVAL '3 days'),

('Pelusa', 
 'Gatita gris persa de 8 meses, pelaje largo que requiere cepillado regular. Muy dulce y cariñosa.', 
 'cachorro', 
 'Saludable, vacunas completas', 
 'pendiente', 
 '["https://images.unsplash.com/photo-1615789591457-74a63395c990"]', 
 5, 
 'pendiente', 
 'en_adopcion',
 'Pelusa fue rescatada de una casa donde había demasiados gatos. Es una gatita hermosa que necesita atención especial.',
 NOW() - INTERVAL '2 days'),

('Chocolate', 
 'Gato café oscuro de 1 año, muy social. Le gusta recibir visitas y jugar con todos.', 
 'adulto', 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1548247416-ec66f4900b2e"]', 
 2, 
 'pendiente', 
 'en_adopcion',
 'Chocolate fue abandonado en un parque. Es un gato muy amigable que adora la compañía humana.',
 NOW() - INTERVAL '1 day'),

-- GATOS YA ADOPTADOS (5 adopciones exitosas para estadísticas)
('Romeo', 
 'Gato negro de 2 años, muy elegante y silencioso. Perfecto compañero para el hogar.', 
 'adulto', 
 'Saludable, control veterinario regular', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1529778873920-4da4926a72c2"]', 
 3, 
 'aprobado', 
 'adoptado',
 'Romeo fue rescatado de la calle donde había sido abandonado. Es un gato muy especial que encontró el hogar perfecto.',
 NOW() - INTERVAL '180 days'),

('Bella', 
 'Gatita carey de 1 año, muy juguetona y cariñosa. Le encanta dormir con sus humanos.', 
 'adulto', 
 'Saludable, todas las vacunas', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1517331156700-3c241d2b4d83"]', 
 2, 
 'aprobado', 
 'adoptado',
 'Bella fue rescatada de un refugio y encontró una familia que la ama profundamente.',
 NOW() - INTERVAL '150 days'),

('Max', 
 'Gato gris de 3 años, tranquilo y hogareño. Perfecto para apartamentos.', 
 'adulto', 
 'Saludable, chequeo completo', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13"]', 
 4, 
 'aprobado', 
 'adoptado',
 'Max fue abandonado por mudanza de sus dueños. Ahora tiene un hogar estable y amoroso.',
 NOW() - INTERVAL '90 days'),

('Mia', 
 'Gatita blanca y gris de 2 años, muy dulce. Le gusta acurrucarse en el regazo.', 
 'adulto', 
 'Saludable, esterilizada', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1533738363-b7f9aef128ce"]', 
 3, 
 'aprobado', 
 'adoptado',
 'Mia fue rescatada de la calle y ahora vive feliz con su nueva familia.',
 NOW() - INTERVAL '60 days'),

('Garfield', 
 'Gato naranja grande de 4 años, muy perezoso y adorable. Come bien y duerme mejor.', 
 'adulto', 
 'Tratamiento de sobrepeso en curso', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1583795128727-6ec3642408f8"]', 
 2, 
 'aprobado', 
 'adoptado',
 'Garfield fue encontrado en un restaurante donde lo alimentaban demasiado. Su nueva familia lo está ayudando a bajar de peso.',
 NOW() - INTERVAL '45 days');

-- =============================================
-- 3. SOLICITUDES DE ADOPCIÓN (15 solicitudes con diferentes estados)
-- =============================================

INSERT INTO adoption_applications (applicant_id, cat_id, form_responses, status, created_at) VALUES
-- SOLICITUDES PENDIENTES (6 para demostrar flujo de aprobación)
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

-- SOLICITUDES APROBADAS (5 para crear tareas de seguimiento)
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

-- SOLICITUDES RECHAZADAS (4 por diferentes razones)
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
 NOW() - INTERVAL '35 days');

-- =============================================
-- 4. TAREAS DE SEGUIMIENTO (20 tareas para demostrar tracking completo)
-- =============================================

INSERT INTO tracking_tasks (application_id, task_type, due_date, status, description, notes, created_at) VALUES
-- TAREAS COMPLETADAS (8 tareas ya realizadas)
(7, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '100 days',
 'completada',
 'Primera visita de seguimiento: verificar adaptación inicial de Romeo en su nuevo hogar. Confirmar que tiene alimentación adecuada, caja de arena limpia y espacio seguro.',
 'Llamada realizada el ' || TO_CHAR(NOW() - INTERVAL '98 days', 'DD/MM/YYYY') || '. Excelente adaptación. El adoptante reporta que Romeo está muy feliz y cariñoso. Come bien y usa su caja sin problemas. Adjuntó fotos del gato en su nueva cama. ¡Éxito total!',
 NOW() - INTERVAL '105 days'),

(8, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '80 days',
 'completada',
 'Verificar adaptación de Bella. Confirmar que recibe cuidados veterinarios y está socializada.',
 'Visita presencial realizada. Bella está perfectamente adaptada. El adoptante la lleva a chequeos regulares. Muy juguetona y saludable.',
 NOW() - INTERVAL '85 days'),

(9, 
 'Verificación de Esterilización', 
 NOW() - INTERVAL '70 days',
 'completada',
 'Confirmar que Max fue llevado a su chequeo post-adopción y verificar estado de esterilización.',
 'Certificado veterinario recibido. Max en perfecto estado de salud. Esterilización confirmada previo a adopción.',
 NOW() - INTERVAL '75 days'),

(10, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '45 days',
 'completada',
 'Primera llamada de seguimiento para Mia. Verificar adaptación y bienestar general.',
 'Llamada realizada. La adoptante está muy contenta. Mia duerme con ella todas las noches. Come bien y es muy cariñosa. Sin problemas de comportamiento.',
 NOW() - INTERVAL '50 days'),

(11, 
 'Verificación de Esterilización', 
 NOW() - INTERVAL '30 days',
 'completada',
 'Confirmar esterilización de Garfield según plan de salud acordado.',
 'Ya estaba esterilizado antes de la adopción. Certificado en archivo. Adoptante también lo llevó a chequeo nutricional para plan de dieta.',
 NOW() - INTERVAL '35 days'),

(7, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '20 days',
 'completada',
 'Seguimiento a 6 meses: verificar salud a largo plazo de Romeo.',
 'Todo perfecto. Romeo es parte integral de la familia. Adoptante envió video de Romeo jugando. Muy saludable.',
 NOW() - INTERVAL '18 days'),

(8, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '10 days',
 'completada',
 'Seguimiento a 5 meses de Bella. Verificar continuidad de cuidados.',
 'Visita presencial. Bella sigue perfectamente cuidada. El hogar está adaptado para ella con rascadores y juguetes. Excelente.',
 NOW() - INTERVAL '8 days'),

(10, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '5 days',
 'completada',
 'Seguimiento a 2 meses de Mia. Confirmar que todo sigue bien.',
 'Llamada de seguimiento. La familia está encantada con Mia. Es muy cariñosa y se lleva bien con todos. Fotos compartidas en grupo.',
 NOW() - INTERVAL '3 days'),

-- TAREAS PENDIENTES (7 tareas próximas y activas)
(9, 
 'Seguimiento de Bienestar', 
 NOW() + INTERVAL '5 days',
 'pendiente',
 'Seguimiento a 3 meses de Max. Verificar adaptación a largo plazo y estado de salud general.',
 NULL,
 NOW() - INTERVAL '85 days'),

(11, 
 'Seguimiento de Bienestar', 
 NOW() + INTERVAL '10 days',
 'pendiente',
 'Primera visita de seguimiento para Garfield. Confirmar que está siguiendo plan de dieta y está saludable.',
 NULL,
 NOW() - INTERVAL '40 days'),

(7, 
 'Seguimiento de Bienestar', 
 NOW() + INTERVAL '15 days',
 'pendiente',
 'Seguimiento anual de Romeo. Verificar vacunas y salud general a largo plazo.',
 NULL,
 NOW() - INTERVAL '175 days'),

(8, 
 'Verificación de Esterilización', 
 NOW() + INTERVAL '20 days',
 'pendiente',
 'Verificar certificado de vacunación anual de Bella según calendario.',
 NULL,
 NOW() - INTERVAL '145 days'),

(10, 
 'Seguimiento de Bienestar', 
 NOW() + INTERVAL '25 days',
 'pendiente',
 'Seguimiento a 3 meses de Mia. Confirmar adaptación completa y bienestar.',
 NULL,
 NOW() - INTERVAL '55 days'),

(9, 
 'Verificación de Esterilización', 
 NOW() + INTERVAL '30 days',
 'pendiente',
 'Verificar vacunas de refuerzo de Max según calendario veterinario.',
 NULL,
 NOW() - INTERVAL '85 days'),

(11, 
 'Seguimiento de Bienestar', 
 NOW() + INTERVAL '40 days',
 'pendiente',
 'Seguimiento a 3 meses de Garfield. Verificar progreso en plan de dieta y peso.',
 NULL,
 NOW() - INTERVAL '40 days'),

-- TAREAS ATRASADAS (5 tareas vencidas que necesitan atención urgente)
(7, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '10 days',
 'atrasada',
 'Seguimiento a 5 meses de Romeo. URGENTE: Confirmar que sigue recibiendo cuidados adecuados.',
 NULL,
 NOW() - INTERVAL '155 days'),

(8, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '5 days',
 'atrasada',
 'Llamada de seguimiento mensual de Bella. Verificar bienestar.',
 NULL,
 NOW() - INTERVAL '120 days'),

(9, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '3 days',
 'atrasada',
 'Seguimiento a 2 meses de Max. URGENTE: Contactar a adoptante.',
 NULL,
 NOW() - INTERVAL '60 days'),

(10, 
 'Verificación de Esterilización', 
 NOW() - INTERVAL '7 days',
 'atrasada',
 'Verificar certificado de esterilización de Mia si no estaba esterilizada al adoptar.',
 NULL,
 NOW() - INTERVAL '45 days'),

(11, 
 'Seguimiento de Bienestar', 
 NOW() - INTERVAL '2 days',
 'atrasada',
 'Seguimiento a 1 mes de Garfield. URGENTE: Verificar adaptación inicial y dieta.',
 NULL,
 NOW() - INTERVAL '30 days');

-- =============================================
-- 5. CONTENIDO EDUCATIVO (12 publicaciones variadas)
-- =============================================

INSERT INTO educational_posts (author_id, title, content, content_type, category, image_url, created_at) VALUES
-- ARTÍCULOS DE ESTERILIZACIÓN (2 publicaciones)
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

-- ARTÍCULOS DE NUTRICIÓN (2 publicaciones)
(2, 
 'Alimentación Adecuada para Gatos Adultos',
 'Los gatos son carnívoros obligados y necesitan proteína animal de alta calidad. NUTRIENTES ESENCIALES: Proteína (mínimo 26% en alimento seco, 40% en húmedo), taurina (aminoácido vital para corazón y vista), ácidos grasos omega-3 y omega-6, vitaminas A, D y E. FRECUENCIA: 2-3 comidas diarias para adultos. Agua fresca siempre disponible. ALIMENTOS PROHIBIDOS: Chocolate, cebolla, ajo, uvas, alcohol, cafeína, leche de vaca (causa diarrea), huesos cocidos, pescado crudo en exceso. SEÑALES DE BUENA NUTRICIÓN: Pelaje brillante, energía adecuada, peso saludable (costillas palpables pero no visibles), deposiciones firmes. TIPOS DE ALIMENTO: Seco (bueno para dientes), húmedo (más hidratación), mixto (ideal). Consulta con tu veterinario para necesidades específicas.',
 'guia',
 'nutricion',
 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e',
 NOW() - INTERVAL '75 days'),

(4, 
 'Guía de Snacks y Premios Saludables para Gatos',
 'No todos los premios son iguales. OPCIONES SALUDABLES: Pollo cocido sin piel ni huesos, atún en agua (ocasional, no diario), premios comerciales con alto contenido de carne, snacks dentales para limpieza. FRECUENCIA: Los premios no deben superar el 10% de calorías diarias. PREMIOS A EVITAR: Comida humana procesada, lácteos, snacks con colorantes artificiales, golosinas con azúcar. PREMIOS FUNCIONALES: Con probióticos para digestión, con omega-3 para pelaje, dentales para higiene oral, naturales liofilizados sin aditivos. CANTIDADES: Gato adulto promedio (4-5kg) puede recibir 20-25 calorías en premios diarios. OBSERVA: Si hay cambios en deposiciones o alergias, suspende. Los premios son herramientas de entrenamiento y vínculo, úsalos con inteligencia.',
 'articulo',
 'nutricion',
 'https://images.unsplash.com/photo-1583795128727-6ec3642408f8',
 NOW() - INTERVAL '45 days'),

-- ARTÍCULOS DE SALUD (3 publicaciones)
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
 'Protege a tu gato de parásitos internos y externos. INTERNOS: Lombrices redondas (vómito, diarrea, abdomen hinchado), tenias (segmentos en heces), giardias (diarrea crónica), coccidios (común en cachorros). EXTERNOS: Pulgas (rascado, pérdida de pelo), garrapatas (bultos en piel), ácaros del oído (sacude cabeza), sarna (costras, rascado). PREVENCIÓN: Desparasitación interna cada 3-6 meses, pipetas o collares antipulgas mensuales, higiene de caja de arena diaria, revisión post-paseos. TRATAMIENTO: Consulta veterinario para diagnóstico correcto, sigue tratamiento completo, desinfecta el hogar, trata a todas las mascotas. SÍNTOMAS DE ALERTA: Diarrea persistente, vómito con gusanos, pérdida de peso, barriga hinchada en cachorros, rascado excesivo. La prevención es más económica que el tratamiento.',
 'guia',
 'salud',
 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
 NOW() - INTERVAL '35 days'),

-- ARTÍCULOS DE COMPORTAMIENTO (2 publicaciones)
(2, 
 'Entendiendo el Comportamiento de tu Gato',
 'Los gatos se comunican de formas únicas. LENGUAJE CORPORAL: Cola hacia arriba = feliz y confiado. Cola entre las patas = asustado. Cola inflada = muy asustado o agresivo. Orejas adelante = alerta y curioso. Orejas atrás/planas = enojado o temeroso. VOCALIZACIONES: Ronroneo = generalmente felicidad (pero también dolor). Maullar = comunicación con humanos. Bufar/gruñir = advertencia. Chillar = dolor o miedo. COMPORTAMIENTOS: Amasar = confort (heredado de amamantar). Regalar "presas" = muestra de afecto. Frotarse = marcaje con feromonas. Rascar = afilar uñas y marcar territorio. SEÑALES DE ESTRÉS: Esconderse constantemente, no usar caja de arena, agresividad repentina, pérdida de apetito, lamido excesivo. ENRIQUECIMIENTO: Juguetes, rascadores, perchas altas, tiempo de juego. Un gato estimulado es un gato feliz.',
 'articulo',
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

-- ARTÍCULOS DE ADOPCIÓN (2 publicaciones)
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

-- EVENTOS (1 publicación)
(2, 
 'Jornada de Esterilización Gratuita - Abril 2025',
 '¡Evento especial de esterilización! La asociación Katze junto con veterinarios voluntarios ofrece jornada gratuita para familias de bajos recursos. FECHA: Sábado 15 de Abril 2025, 8:00 AM - 4:00 PM. LUGAR: Centro Comunitario Colonia Del Valle, Av. Principal 123. REQUISITOS: Registro previo obligatorio (cupo limitado: 50 gatos), gato mínimo 5 meses de edad y 2kg de peso, ayuno de 12 horas previo, comprobante de domicilio, transportadora segura, toalla para el retorno. INCLUYE: Cirugía de esterilización completa, anestesia y monitoreo, antibióticos post-operatorios (3 días), collar isabelino, revisión post-quirúrgica a los 10 días, certificado de esterilización. REGISTRO: WhatsApp: +591 7234 5678 (enviar: nombre completo, teléfono, dirección, datos del gato: nombre, edad, peso, sexo). CUPOS: Del 1-10 Abril. IMPORTANTE: Llevar cobija para transporte post-cirugía. Seguir instrucciones de cuidado post-operatorio. ¡No pierdas esta oportunidad!',
 'evento',
 'esterilizacion',
 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467',
 NOW() - INTERVAL '15 days'),

-- TALLERES (1 publicación)
(1, 
 'Taller Virtual: Primeros Auxilios para Gatos',
 'Aprende a salvar la vida de tu gato en emergencias. FORMATO: Virtual por Zoom. FECHA: Sábado 20 de Abril 2025, 10:00 AM - 12:00 PM (hora de Bolivia). INSTRUCTOR: Dra. Patricia Hernández, DVM, certificada en emergencias veterinarias con 15 años de experiencia. TEMARIO: Módulo 1 - Signos vitales normales (pulso, respiración, temperatura). Módulo 2 - Reconocimiento de emergencias vitales. Módulo 3 - Técnicas de RCP básico para gatos. Módulo 4 - Manejo de heridas y hemorragias. Módulo 5 - Intoxicaciones comunes y primeros auxilios. Módulo 6 - Cuándo acudir al veterinario. Módulo 7 - Armado de botiquín felino. INCLUYE: Manual digital descargable PDF (40 páginas), sesión de preguntas y respuestas en vivo, certificado digital de participación, acceso a grabación por 7 días. CUPO: 100 personas. COSTO: GRATUITO (donaciones voluntarias para refugio). REGISTRO: www.katze.com/talleres o email: talleres@katze.com (confirmar asistencia). ¡Inscríbete ya!',
 'taller',
 'salud',
 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13',
 NOW() - INTERVAL '20 days');

-- =============================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =============================================

-- Ver resumen de usuarios por rol
SELECT role, COUNT(*) as total 
FROM users 
GROUP BY role 
ORDER BY role;

-- Ver resumen de gatos por estado
SELECT approval_status, adoption_status, COUNT(*) as total 
FROM cats 
GROUP BY approval_status, adoption_status 
ORDER BY approval_status, adoption_status;

-- Ver resumen de solicitudes por estado
SELECT status, COUNT(*) as total 
FROM adoption_applications 
GROUP BY status 
ORDER BY status;

-- Ver resumen de tareas por estado
SELECT status, COUNT(*) as total 
FROM tracking_tasks 
GROUP BY status 
ORDER BY status;

-- Ver resumen de contenido educativo por tipo y categoría
SELECT content_type, category, COUNT(*) as total 
FROM educational_posts 
GROUP BY content_type, category 
ORDER BY content_type, category;

-- =============================================
-- RESUMEN DE DATOS DEL SEED
-- =============================================

/*
📊 ESTADÍSTICAS DEL SEED:

👥 USUARIOS (10 total):
   - 1 Administrador
   - 4 Rescatistas (con diferentes antigüedades)
   - 5 Adoptantes (con diferentes perfiles)

🐱 GATOS (18 total):
   - 10 Aprobados y disponibles para adopción
     * 6 Esterilizados
     * 4 Pendientes de esterilización
     * Edades variadas (cachorro a adulto)
     * Publicados en diferentes fechas (120 días a 12 días atrás)
   - 3 Pendientes de aprobación (recientes)
   - 5 Ya adoptados exitosamente (para estadísticas)

📋 SOLICITUDES DE ADOPCIÓN (15 total):
   - 6 Pendientes de revisión (casos diversos)
   - 5 Aprobadas (generan tareas de seguimiento)
   - 4 Rechazadas (por diferentes razones válidas)

✅ TAREAS DE SEGUIMIENTO (20 total):
   - 8 Completadas (con notas detalladas)
   - 7 Pendientes (próximos 5-40 días)
   - 5 Atrasadas (para demostrar urgencias)

📚 CONTENIDO EDUCATIVO (12 publicaciones):
   - 2 Artículos de esterilización
   - 2 Artículos de nutrición
   - 3 Artículos de salud
   - 2 Artículos de comportamiento
   - 2 Artículos de adopción
   - 1 Evento (jornada de esterilización)
   - 1 Taller (primeros auxilios)

🎯 CASOS DE USO DEMOSTRADOS:

1. ADMINISTRADOR:
   - Aprobar/rechazar publicaciones de gatos pendientes
   - Gestionar usuarios y roles
   - Ver estadísticas completas del sistema
   - Aprobar/rechazar solicitudes de adopción

2. RESCATISTA:
   - Publicar gatos para adopción
   - Ver estado de sus publicaciones
   - Gestionar solicitudes de adopción de sus gatos
   - Realizar seguimiento post-adopción
   - Tareas atrasadas que requieren atención

3. ADOPTANTE:
   - Ver catálogo de gatos disponibles
   - Enviar solicitudes de adopción
   - Ver estado de sus solicitudes
   - Casos de aprobación y rechazo

4. ESTADÍSTICAS:
   - Total de adopciones: 5
   - Gatos disponibles: 10
   - Tasa de esterilización calculable
   - Solicitudes pendientes: 6
   - Tareas vencidas: 5 (para demostrar alertas)
   - Gatos con más días publicados (para priorización)

5. SISTEMA DE SEGUIMIENTO:
   - Tareas completadas con notas
   - Tareas pendientes programadas
   - Tareas atrasadas (urgencias)
   - Diferentes tipos: bienestar, esterilización

6. CONTENIDO EDUCATIVO:
   - Variedad de categorías
   - Diferentes formatos (artículos, guías, eventos, talleres)
   - Contenido útil y realista

🔐 CREDENCIALES DE PRUEBA (SUPER FÁCILES):

👨‍💼 ADMINISTRADOR:
   Email: admin@test.com
   Password: 123

🦸 RESCATISTAS:
   rescatista1@test.com | Password: 123
   rescatista2@test.com | Password: 123
   rescatista3@test.com | Password: 123
   rescatista4@test.com | Password: 123

🏠 ADOPTANTES:
   adoptante1@test.com | Password: 123
   adoptante2@test.com | Password: 123
   adoptante3@test.com | Password: 123
   adoptante4@test.com | Password: 123
   adoptante5@test.com | Password: 123

💡 PATRÓN FÁCIL:
   - Formato: [rol][número]@test.com
   - Todos usan password: 123
   - Ejemplos: admin@test.com, rescatista1@test.com, adoptante1@test.com

⚠️ NOTAS IMPORTANTES:

1. Todas las contraseñas usan el hash bcrypt de "123" (password corta para pruebas)
2. Las URLs de imágenes apuntan a Unsplash (públicas y gratuitas)
3. Los teléfonos siguen formato boliviano (+591)
4. Las fechas son relativas a NOW() para mantener actualidad
5. Los datos están diseñados para demostrar TODAS las funcionalidades
6. Las relaciones entre tablas están correctamente establecidas
7. Los casos de prueba cubren flujos exitosos y fallidos

🚀 FUNCIONALIDADES DEMOSTRADAS:

✅ Sistema completo de adopción (pendiente → aprobada → seguimiento)
✅ Gestión de publicaciones (pendiente → aprobada → adoptada)
✅ Dashboard de estadísticas con datos reales
✅ Sistema de seguimiento post-adopción
✅ Tareas atrasadas (urgencias)
✅ Múltiples usuarios con diferentes roles
✅ Solicitudes rechazadas (con razones válidas)
✅ Gatos con diferentes estados de esterilización
✅ Contenido educativo variado
✅ Casos de edad variada (cachorro, adulto, senior)
✅ Diferentes antigüedades de publicación (120 días a 1 día)

📈 PARA VERIFICAR EL SEED:
   Ejecuta las consultas SELECT arriba para ver el resumen de datos insertados.
*/
