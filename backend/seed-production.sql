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
-- Hash: $2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC

-- Admin (ID: 1)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'María Rodríguez', '0999123456', 'admin');

-- Rescatistas (IDs: 2, 3, 4)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('ana.garcia@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Ana García', '0998765432', 'rescatista'),
('carlos.lopez@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Carlos López', '0987654321', 'rescatista'),
('lucia.martinez@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Lucía Martínez', '0976543210', 'rescatista');

-- Adoptantes (IDs: 5-11)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('juan.perez@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Juan Pérez', '0965432109', 'adoptante'),
('sofia.ramirez@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Sofía Ramírez', '0954321098', 'adoptante'),
('miguel.torres@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Miguel Torres', '0943210987', 'adoptante'),
('valentina.castro@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Valentina Castro', '0932109876', 'adoptante'),
('diego.morales@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Diego Morales', '0921098765', 'adoptante'),
('daniela.vega@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Daniela Vega', '0910987654', 'adoptante'),
('andres.silva@katze.com', '$2b$10$JIXTltHsg5hsHKRVT.SdiupVTh.v1tWVQgg96uSh3J/R58DfjshbC', 'Andrés Silva', '0909876543', 'adoptante');

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
-- Aprobadas (IDs: 1-3) - Excelentes solicitudes con razones sólidas
(5, 1, '{"message": "Hola, soy veterinario y siempre he soñado con adoptar un gato cachorro. Luna me robó el corazón. Tengo una casa con jardín amplio y cerrado, donde podrá explorar de manera segura. Mi esposa también ama a los gatos, tuvimos 2 antes que vivieron más de 15 años. Trabajamos desde casa, por lo que Luna nunca estará sola. Ya tenemos todo preparado: juguetes, rascadores, comederos automáticos y hemos instalado redes en las ventanas. Estamos comprometidos con su salud, vacunación y esterilización cuando llegue el momento. ¿Cuándo podríamos conocerla en persona?", "housing_type": "casa", "has_experience": true, "reason": "Veterinario profesional con experiencia, hogar preparado y compromiso a largo plazo"}'::jsonb, 
 'aprobada', NOW() - INTERVAL '5 days', 85, 'Adoptante con experiencia profesional, espacio adecuado y preparación excepcional'),

(6, 2, '{"message": "Buenas tardes. Trabajo desde casa como diseñadora gráfica y vivo sola en un departamento tranquilo de 65m². Busco compañía constante y Mishi parece perfecto para mi estilo de vida. Aunque no he tenido gatos antes, he investigado mucho sobre cuidados felinos y he hablado con mi veterinaria de confianza. Mi departamento tiene balcón cerrado con redes de seguridad. Estoy dispuesta a seguir todas las recomendaciones y asistir a consultas de seguimiento. Tengo estabilidad económica para cubrir gastos veterinarios y alimentación premium. Mi horario flexible me permite dedicarle tiempo de calidad todos los días.", "housing_type": "departamento", "has_experience": false, "reason": "Trabajo remoto, investigación previa, compromiso demostrado y espacio adecuado"}'::jsonb, 
 'aprobada', NOW() - INTERVAL '3 days', 75, 'Buen ambiente, compromiso sólido aunque falta experiencia. Requiere seguimiento inicial'),

(7, 3, '{"message": "Somos una familia de 4 (padre, madre, hija de 12 y hijo de 15). Tuvimos un gato persa durante 14 años que falleció hace 6 meses y toda la familia está lista para abrir nuestro hogar nuevamente. Conocemos perfectamente las necesidades de los persas: cepillado diario, limpieza ocular, alimentación específica y chequeos regulares. Nuestra casa tiene 3 pisos con múltiples espacios tranquilos. Los niños son responsables y respetuosos con los animales. Pelusa encajaría perfectamente con nosotros. Adjunto referencias de nuestro veterinario anterior que puede confirmar el excelente cuidado que le dimos a nuestro gato anterior.", "housing_type": "casa", "has_experience": true, "reason": "Familia con experiencia específica en gatos persas, historial comprobado y hogar ideal"}'::jsonb, 
 'aprobada', NOW() - INTERVAL '7 days', 90, 'Excelente compatibilidad: experiencia específica con persas, familia comprometida y referencias verificables'),

-- Procesando (IDs: 4-6) - Esperando evaluación de IA
(8, 4, '{"message": "Hola, me llamo Valentina. He tenido gatos mestizos toda mi vida pero siempre me fascinaron los bengalíes por su energía. Tengo una casa de 2 plantas con jardín vallado de 200m² donde Tigre podría correr y explorar. Trabajo medio tiempo (mañanas) y las tardes las paso en casa. He leído extensamente sobre las necesidades de ejercicio y estimulación mental de los bengalíes. Planeo instalar repisas en las paredes, comprar juguetes interactivos tipo puzzle, y dedicar al menos 2 horas diarias de juego activo. También tengo un veterinario especializado en felinos. ¿Tigre está acostumbrado a salir con arnés? Estaría dispuesta a entrenarlo para paseos supervisados.", "housing_type": "casa", "has_experience": true, "reason": "Conocimiento específico de la raza, espacio amplio y plan detallado de cuidados"}'::jsonb, 
 'procesando', NULL, NULL, NULL),

(9, 5, '{"message": "Buenos días. Soy jubilado de 67 años, vivo solo desde que enviudé hace 3 años. Mi último gato era una gata senior que adopté y cuidé hasta sus 16 años, incluyendo administración de medicación para hipertiroidismo y artritis. Nieve me recordó mucho a ella. Tengo todo el tiempo del mundo para dedicarle, estoy en casa 24/7. Mi casa tiene una sola planta (sin escaleras) lo cual es ideal para un gato senior con artritis. Cuento con seguro veterinario y estabilidad económica para afrontar cualquier tratamiento médico. Busco compañía tranquila y estoy preparado para los cuidados especiales que Nieve requiere. ¿Qué medicación toma actualmente? Tengo experiencia administrando pastillas y también jarabes.", "housing_type": "casa", "has_experience": true, "reason": "Experiencia específica con gatos senior, disponibilidad total y recursos para cuidados médicos"}'::jsonb, 
 'procesando', NULL, NULL, NULL),

(10, 6, '{"message": "Hola, somos una familia con dos niños de 8 y 10 años. Queremos adoptar a Garfield para enseñarles responsabilidad y empatía hacia los animales. Aunque no hemos tenido gatos antes, hemos investigado mucho como familia. Los niños han leído libros sobre cuidado de gatos y han hecho un calendario de responsabilidades (alimentación, limpieza de arenero, juego). Tenemos una casa grande con jardín, y entendemos que Garfield necesita control de peso, así que ya hablamos con un veterinario sobre dieta y ejercicio. Estamos comprometidos como familia y los niños prometen tratarlo con respeto. ¿Podríamos hacer una visita previa para que Garfield conozca a los niños?", "housing_type": "casa", "has_experience": false, "reason": "Familia motivada, investigación previa, plan educativo para niños y compromiso colectivo"}'::jsonb, 
 'procesando', NULL, NULL, NULL),

-- Revisión pendiente - Scores EXCELENTES (92-88) que requieren confirmación final
(11, 7, '{"message": "Trabajo como guardia de seguridad en turno nocturno (10pm-6am) así que estoy en casa todo el día. Shadow sería mi compañero perfecto durante mis horas de descanso. Vivo en un departamento de 55m² tranquilo. He tenido 3 gatos negros anteriormente, el último vivió 17 años conmigo. Entiendo que muchos tienen prejuicios con gatos negros pero yo los adoro. Mi departamento tiene ventanales amplios con luz natural y he instalado estantes tipo árbol para gatos. Como trabajo de noche, puedo llevar a Shadow al veterinario durante el día sin problemas. Tengo referencias de mi casero anterior sobre el excelente cuidado de mis mascotas previas.", "housing_type": "departamento", "has_experience": true, "reason": "Horario compatible, experiencia con gatos negros, espacio adaptado y referencias disponibles"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '2 days', 68, 'Horario poco convencional pero compatible. Espacio limitado. Requiere verificación de referencias'),

(5, 4, '{"message": "¡Hola! Soy entrenador de animales certificado y he tenido dos gatos bengalíes anteriormente. Conozco perfectamente sus necesidades de actividad física y mental. Mi casa tiene un catio (patio cerrado para gatos) de 30m² con estructuras de escalada, además del jardín principal vallado. Trabajo desde casa entrenando perros con citas programadas, así que tengo flexibilidad horaria. He construido un cuarto especial para mis gatos con repisas a diferentes alturas, ruedas de ejercicio y juguetes interactivos. Alimentación: solo premium sin granos. Tigre tendría un ambiente super estimulante y nunca se aburriría. Adjunto fotos de mis instalaciones y certificado de entrenador felino.", "housing_type": "casa", "has_experience": true, "reason": "Profesional certificado, experiencia específica con bengalíes, instalaciones excepcionales"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '1 day', 92, 'MATCH PERFECTO: Entrenador certificado con experiencia específica en bengalíes e instalaciones profesionales. Requiere solo verificación de documentos'),

(6, 5, '{"message": "Buenos días, soy enfermera geriátrica y trabajo desde casa haciendo consultas por telemedicina. Toda mi carrera ha sido cuidar ancianos, así que entiendo perfectamente las necesidades especiales de Nieve. He adoptado 2 gatos senior anteriormente, ambos con condiciones médicas (uno con diabetes, otro con insuficiencia renal). Estoy muy cómoda administrando medicamentos, inyecciones subcutáneas si fuera necesario, y monitoreando síntomas. Mi departamento es tranquilo, sin escaleras que subir, con camas ortopédicas para gatos. Ya hablé con mi veterinaria sobre el protocolo para artritis de Nieve. Tengo recursos para cualquier emergencia médica y mucha paciencia. Los gatos senior merecen un hogar amoroso en sus años dorados.", "housing_type": "departamento", "has_experience": true, "reason": "Enfermera con experiencia en cuidados geriátricos, historial con gatos senior enfermos"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '3 days', 88, 'EXCELENTE: Profesional de salud con experiencia específica en gatos senior y cuidados médicos. Solo requiere confirmación de espacio'),

(7, 6, '{"message": "Somos una familia que perdió a nuestro gato de 16 años hace un año por diabetes. Aprendimos mucho sobre control de peso y alimentación. Vemos que Garfield necesita perder algunos kilos y estamos 100% preparados. Ya tenemos: básculas para pesar comida, comederos automáticos con porciones medidas, juguetes interactivos tipo láser para ejercicio, y un veterinario especialista en nutrición felina. Nuestros 3 hijos (7, 10 y 13 años) entienden que no deben darle comida extra. Tenemos casa grande con jardín y espacio para que Garfield se mueva. Queremos darle una vida larga y saludable con una dieta estricta pero amorosa.", "housing_type": "casa", "has_experience": true, "reason": "Familia con experiencia en manejo de sobrepeso felino, plan nutricional establecido"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '1 day', 80, 'Familia bien preparada, experiencia previa con control de peso. Requiere confirmar compromiso de niños con restricciones alimentarias'),

-- Revisión pendiente - Scores BUENOS (78-65) con algunos puntos a verificar
(11, 8, '{"message": "Es mi primera vez adoptando un gato pero llevo meses preparándome. He leído 5 libros sobre cuidados de gatitos, he visto tutoriales de veterinarios en YouTube sobre socialización, juego y entrenamiento de arenero. Canela siendo cachorra requiere mucha atención y estoy listo. Trabajo 8-5pm pero vengo a almorzar a casa (está a 10 minutos). Tengo una casa con jardín cerrado. Ya compré: arenero, rascadores, transportadora, juguetes de diferentes tipos, y comederos. Mi hermana que vive cerca tiene 2 gatos y me va a asesorar los primeros meses. Estoy muy emocionado y comprometido aunque soy primerizo.", "housing_type": "casa", "has_experience": false, "reason": "Primerizo muy preparado, investigación exhaustiva, apoyo familiar cercano"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '2 days', 65, 'Sin experiencia pero excelente preparación teórica y red de apoyo. Requiere seguimiento cercano inicial'),

(5, 7, '{"message": "Vivo en un departamento pequeño de 40m² pero está en un piso alto con ventanas grandes y mucha luz. He leído que Shadow es tranquilo y se adapta bien a interiores. Nunca he tenido gatos pero mi mejor amiga es rescatista y me ha estado enseñando. Ya instalé redes de seguridad en todas las ventanas. Trabajo desde casa 4 días a la semana. Mi departamento es simple pero acogedor, con un rincón dedicado para el gato con rascador y cama. Entiendo que es un espacio pequeño pero le daría todo mi cariño y atención. ¿Shadow podría adaptarse a un espacio reducido si tiene entretenimiento y compañía constante?", "housing_type": "departamento", "has_experience": false, "reason": "Espacio limitado pero mentoría de rescatista, trabajo remoto y medidas de seguridad"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '4 days', 55, 'Espacio muy limitado (40m²) aunque con buenas intenciones. Sin experiencia previa. Requiere visita domiciliaria antes de aprobar'),

(6, 4, '{"message": "Hola, vi a Tigre y me pareció hermoso aunque sé que los bengalíes necesitan mucha atención. Trabajo medio tiempo (mañanas, 8am-1pm) así que las tardes estoy libre. Vivo sola en un departamento de 60m². Nunca he tenido gatos bengalíes pero tuve un gato común hace años. Estoy un poco preocupada si podré darle suficiente estimulación porque leo que son muy activos. Pero estoy dispuesta a intentarlo y aprender. Tengo balcón cerrado donde podría tomar sol. ¿Qué tan demandantes son realmente los bengalíes? ¿Crees que podría funcionar o sería injusto para Tigre en un departamento?", "housing_type": "departamento", "has_experience": false, "reason": "Dudas evidentes sobre capacidad de atender necesidades de la raza, espacio limitado"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '2 days', 45, 'SCORE BAJO: Dudas propias sobre tiempo/espacio, departamento inadecuado para bengalí activo. Requiere evaluación psicológica del compromiso real'),

(9, 6, '{"message": "Familia con 2 niños de 4 y 6 años. Queremos un gato para que los niños aprendan responsabilidad. Garfield parece perfecto porque es grande y pachoncito, a los niños les encanta. Tenemos casa con jardín. He tenido gatos cuando era niño hace 30 años. Mis hijos son muy cariñosos aunque a veces algo bruscos en sus juegos, pero aprenderán a ser gentiles. ¿Garfield es tolerante con niños pequeños? Esperamos que sea paciente porque los niños querrán cargarlo y jugar con él todo el tiempo. También nos comprometeríamos con su dieta para que pierda peso.", "housing_type": "casa", "has_experience": true, "reason": "Familia con niños pequeños, experiencia desactualizada, posible manejo inadecuado"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '3 days', 78, 'Experiencia antigua, niños muy pequeños que pueden ser bruscos. Requiere sesión educativa sobre manejo apropiado y supervisión'),

(10, 3, '{"message": "¡Hola! Pelusa es preciosa. Tenemos una casa grande con jardín y experiencia con gatos de pelo semi-largo (tuvimos un angora). Sabemos que los persas necesitan cepillado diario por su pelaje. Somos pareja joven (ambos 28 años) que trabajamos de lunes a viernes pero tenemos fines de semana libres. Nuestra casa tiene muchos espacios soleados que a Pelusa le encantarían. Estamos dispuestos al cepillado diario, limpieza de ojos, y cualquier cuidado especial. Ya tenemos peine especial para pelo largo. Nuestro gato anterior vivió 12 años feliz con nosotros hasta que falleció por edad avanzada.", "housing_type": "casa", "has_experience": true, "reason": "Experiencia con pelo largo, hogar espacioso, compromiso con mantenimiento"}'::jsonb, 
 'revision_pendiente', NOW() - INTERVAL '1 day', 82, 'Buena experiencia y espacio. Requiere confirmar disponibilidad de tiempo para cepillado diario durante semana laboral'),

-- Rechazadas automáticamente - Scores MALOS (30-20) por problemas críticos
(8, 8, '{"message": "Quiero un gato. Es para mi hijo.", "housing_type": "departamento", "has_experience": false, "reason": "Regalo sin análisis de responsabilidad"}'::jsonb, 
 'rechazada_automaticamente', NOW() - INTERVAL '1 day', 25, 'CRÍTICO: Mensaje extremadamente breve sin información. Intención de regalo (red flag). Sin experiencia ni detalles de hogar'),

(10, 1, '{"message": "Luna es linda. Viajo mucho por trabajo, estoy fuera 2-3 semanas al mes pero quiero un gato esperándome cuando regrese. Mi departamento está solo pero tengo vecina que podría darle comida.", "housing_type": "departamento", "has_experience": false, "reason": "Ausencias prolongadas sin plan de cuidado adecuado"}'::jsonb, 
 'rechazada_automaticamente', NOW() - INTERVAL '2 days', 30, 'CRÍTICO: Ausencias de semanas enteras, dependencia de vecina (no es plan sustentable). Gato estaría solo la mayoría del tiempo'),

(11, 5, '{"message": "Vi que Nieve es un gato senior. Los gatos viejos no requieren mucho cuidado, verdad? Solo comen y duermen. Tengo un departamento estudio. Primera vez con gatos.", "housing_type": "departamento", "has_experience": false, "reason": "Desconocimiento grave de necesidades de gato senior con artritis"}'::jsonb, 
 'rechazada_automaticamente', NOW() - INTERVAL '1 day', 28, 'CRÍTICO: Desinformación grave sobre gatos senior. Desconoce que requieren MÁS cuidados médicos. Espacio inadecuado (estudio). Sin experiencia'),

(8, 2, '{"message": "El siamés está bonito, me gustan los gatos elegantes. Cuánto cuesta? Lo quiero ya para este fin de semana.", "housing_type": "departamento", "has_experience": false, "reason": "Actitud consumista, trata adopción como compra impulsiva"}'::jsonb, 
 'rechazada_automaticamente', NOW() - INTERVAL '3 days', 20, 'CRÍTICO: Actitud totalmente inadecuada. Trata la adopción como compra de objeto. Pregunta por precio. Prisa sin análisis. SIN experiencia ni información de hogar'),

(9, 4, '{"message": "Tigre se ve muy cool para Instagram, mis seguidores amarían fotos de él. Tengo departamento chico pero no importa, no? Los gatos se adaptan.", "housing_type": "departamento", "has_experience": false, "reason": "Motivación superficial (redes sociales), ignora necesidades específicas de bengalí"}'::jsonb, 
 'rechazada_automaticamente', NOW() - INTERVAL '2 days', 22, 'CRÍTICO: Motivación inadecuada (contenido para redes sociales). Desconocimiento total de necesidades de bengalí activo. Departamento pequeño. Sin experiencia'),

-- Rechazadas manualmente - Scores REGULARES (60-58) pero banderas rojas al revisar a fondo
(9, 2, '{"message": "Hola, tengo un departamento de 35m² pero es acogedor. Nunca he tenido gatos pero siempre quise uno. Trabajo 10 horas al día fuera de casa pero los fines de semana estoy libre. Mishi parece tranquilo así que supongo que estaría bien solo en el día. No tengo mucho presupuesto pero haría lo posible. Mi casero no sabe que quiero mascota pero creo que no dirá nada si el gato es silencioso. ¿Los siameses son ruidosos?", "housing_type": "departamento", "has_experience": false, "reason": "Espacio muy pequeño, largas horas solo, permiso de arrendamiento dudoso, presupuesto limitado"}'::jsonb, 
 'rechazada', NOW() - INTERVAL '4 days', 60, 'RECHAZADA: Múltiples banderas rojas - espacio insuficiente (35m²), no tiene permiso claro del casero, presupuesto limitado, gato solo 10+ horas diarias'),

(10, 7, '{"message": "Shadow es hermoso. Trabajo 12-14 horas al día como gerente de restaurante pero mi novio que vive conmigo está en casa algunas tardes. Bueno, no siempre porque tiene horarios rotativos pero entre los dos algo hacemos. El departamento es de 50m². Nunca he tenido gatos pero mi novio tuvo uno hace años. No estoy 100% segura si tengo tiempo pero realmente me gustan los gatos negros porque son discriminados y quiero ayudar.", "housing_type": "departamento", "has_experience": false, "reason": "Horarios incompatibles de ambos, poca certeza de compromiso, dependencia de pareja"}'::jsonb, 
 'rechazada', NOW() - INTERVAL '3 days', 58, 'RECHAZADA: Solicitante principal sin tiempo (12-14hrs trabajo), dependencia excesiva de tercero con horario inestable. Dudas propias sobre capacidad. Espacio limitado');

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
