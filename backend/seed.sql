-- =============================================
-- SEED DATA - Sistema Katze
-- Datos de ejemplo para poblar la base de datos
-- =============================================

-- Limpieza de datos previos (CUIDADO: esto elimina todos los datos)
-- Descomenta solo si quieres limpiar la BD
-- TRUNCATE TABLE tracking_tasks CASCADE;
-- TRUNCATE TABLE adoption_applications CASCADE;
-- TRUNCATE TABLE educational_posts CASCADE;
-- TRUNCATE TABLE cats CASCADE;
-- TRUNCATE TABLE users CASCADE;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
-- ALTER SEQUENCE cats_id_seq RESTART WITH 1;
-- ALTER SEQUENCE adoption_applications_id_seq RESTART WITH 1;
-- ALTER SEQUENCE tracking_tasks_id_seq RESTART WITH 1;
-- ALTER SEQUENCE educational_posts_id_seq RESTART WITH 1;

-- =============================================
-- 1. USUARIOS
-- =============================================
-- Nota: Todas las contraseñas están hasheadas con bcrypt
-- Contraseña para todos: "password123"
-- Hash bcrypt (10 rounds): $2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m

INSERT INTO users (email, password_hash, full_name, role, phone) VALUES
-- Administradores
('admin@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'María Administradora', 'admin', '+52 55 1234 5678'),

-- Rescatistas
('rescatista1@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'Carlos Rescatista', 'rescatista', '+52 55 2345 6789'),
('rescatista2@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'Ana López', 'rescatista', '+52 55 3456 7890'),
('rescatista3@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'Jorge Ramírez', 'rescatista', '+52 55 4567 8901'),

-- Adoptantes
('adoptante1@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'Laura Martínez', 'adoptante', '+52 55 5678 9012'),
('adoptante2@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'Pedro Sánchez', 'adoptante', '+52 55 6789 0123'),
('adoptante3@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'Carmen Hernández', 'adoptante', '+52 55 7890 1234'),
('adoptante4@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'Roberto García', 'adoptante', '+52 55 8901 2345'),
('adoptante5@katze.com', '$2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m', 'Isabel Rodríguez', 'adoptante', '+52 55 9012 3456');

-- =============================================
-- 2. GATOS (PUBLICACIONES)
-- =============================================

INSERT INTO cats (name, description, age, health_status, sterilization_status, photos_url, owner_id, approval_status, adoption_status, story) VALUES
-- Gatos aprobados y disponibles (owner_id: 2 = rescatista1)
('Luna', 
 'Gatita blanca muy cariñosa y juguetona. Le encanta dormir en lugares altos y perseguir juguetes.', 
 'cachorro', 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba", "https://images.unsplash.com/photo-1529257414772-1960b7bea4eb"]', 
 2, 
 'aprobado', 
 'disponible',
 'Luna fue encontrada en un parque cuando apenas tenía 2 meses. Estaba sola, asustada y muy hambrienta. La rescaté una tarde lluviosa y desde entonces ha sido una gatita muy dulce y agradecida. Ahora tiene 6 meses y busca un hogar lleno de amor.'),

('Michi', 
 'Gato naranja de 2 años, muy tranquilo y perfecto para departamentos. Le gusta observar por la ventana.', 
 'adulto', 
 'Saludable, desparasitado', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1574158622682-e40e69881006", "https://images.unsplash.com/photo-1592194996308-7b43878e84a6"]', 
 2, 
 'aprobado', 
 'disponible',
 'Michi fue abandonado en la puerta de una clínica veterinaria. Su dueño anterior no pudo cuidarlo más. Es un gato muy noble que merece una segunda oportunidad con una familia que lo valore.'),

('Nala', 
 'Gatita tricolor de 1 año, energética y cariñosa. Se lleva bien con otros gatos.', 
 'adulto', 
 'Saludable, todas las vacunas', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8", "https://images.unsplash.com/photo-1548247416-ec66f4900b2e"]', 
 3, 
 'aprobado', 
 'disponible',
 'Nala llegó a nosotros después de ser rescatada de una construcción donde vivía con su madre. Era muy tímida al principio, pero con paciencia se ha convertido en una gatita sociable y juguetona.'),

-- Gatos pendientes de esterilización (owner_id: 3 = rescatista2)
('Simba', 
 'Gatito atigrado de 4 meses, muy activo y curioso. Necesita familia con experiencia en cachorros.', 
 'cachorro', 
 'Saludable, primera vacuna aplicada', 
 'pendiente', 
 '["https://images.unsplash.com/photo-1543852786-1cf6624b9987"]', 
 3, 
 'aprobado', 
 'disponible',
 'Simba fue encontrado solo en la calle cuando tenía apenas 6 semanas. Es muy juguetón y le encanta explorar. Será esterilizado cuando alcance el peso adecuado.'),

('Pelusa', 
 'Gatita gris persa de 8 meses, pelaje largo que requiere cepillado regular. Muy dulce.', 
 'cachorro', 
 'Saludable, vacunas completas', 
 'pendiente', 
 '["https://images.unsplash.com/photo-1615789591457-74a63395c990"]', 
 4, 
 'aprobado', 
 'disponible',
 'Pelusa fue rescatada de una casa donde había demasiados gatos. Su anterior dueño no podía cuidar de tantos. Es una gatita hermosa que necesita un hogar donde reciba la atención que merece.'),

-- Gatos pendientes de aprobación (owner_id: 4 = rescatista3)
('Bigotes', 
 'Gato blanco y negro de 3 años, muy independiente pero cariñoso cuando quiere. Ideal para personas tranquilas.', 
 'adulto', 
 'Saludable, chequeo reciente', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1569591159212-b02ea8a9f239"]', 
 4, 
 'pendiente', 
 'disponible',
 'Bigotes fue encontrado vagando por mi colonia. Es un gato adulto que se adaptó rápidamente a estar en casa, aunque mantiene su personalidad independiente.'),

-- Gatos en proceso de adopción
('Canela', 
 'Gatita café claro de 1 año, muy juguetona. Le encantan las cajas y las plumas.', 
 'adulto', 
 'Saludable, vacunas al día', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1606214174585-fe31582dc6ee"]', 
 2, 
 'aprobado', 
 'en_proceso',
 'Canela fue rescatada de un refugio sobrepoblado. Es muy activa y necesita espacio para jugar y correr.'),

-- Gatos ya adoptados
('Romeo', 
 'Gato negro de 2 años, muy elegante y silencioso. Perfecto compañero.', 
 'adulto', 
 'Saludable, control veterinario regular', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1529778873920-4da4926a72c2"]', 
 3, 
 'aprobado', 
 'adoptado',
 'Romeo fue rescatado de la calle donde había sido abandonado. Es un gato muy especial que encontró el hogar perfecto.'),

-- Más gatos disponibles
('Princesa', 
 'Gatita siamesa de 1 año, muy vocal y cariñosa. Le gusta seguir a sus humanos por toda la casa.', 
 'adulto', 
 'Saludable, esterilizada recientemente', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2"]', 
 2, 
 'aprobado', 
 'disponible',
 'Princesa fue abandonada cuando su familia se mudó. Es una gatita muy sociable que necesita mucha atención y amor.'),

('Manchas', 
 'Gato calico de 4 años, muy tranquilo. Ideal para personas mayores o familias con niños grandes.', 
 'adulto', 
 'Tratamiento de parásitos completado', 
 'esterilizado', 
 '["https://images.unsplash.com/photo-1518791841217-8f162f1e1131"]', 
 4, 
 'aprobado', 
 'disponible',
 'Manchas vivió en las calles por varios años antes de ser rescatado. Es un gato muy resiliente y agradecido.');

-- =============================================
-- 3. SOLICITUDES DE ADOPCIÓN
-- =============================================

INSERT INTO adoption_applications (applicant_id, cat_id, form_responses, status, created_at, updated_at) VALUES
-- Solicitudes pendientes (applicant_id: 5,6,7 = adoptantes 1,2,3)
(5, 1, 
 '{
   "experiencia": "He tenido gatos antes",
   "vivienda": "Departamento propio",
   "tiempo": "Trabajo desde casa",
   "motivo": "Quiero darle un hogar a un gatito que lo necesite",
   "otros_animales": "No tengo otras mascotas",
   "gastos": "Sí, estoy preparada para los gastos veterinarios"
 }',
 'pendiente',
 NOW() - INTERVAL '2 days',
 NOW() - INTERVAL '2 days'),

(6, 3, 
 '{
   "experiencia": "Primera vez con gatos",
   "vivienda": "Casa con jardín",
   "tiempo": "Salgo 6 horas al día",
   "motivo": "Mi hija siempre ha querido un gato",
   "otros_animales": "Tengo un perro pequeño",
   "gastos": "Sí, tengo presupuesto mensual para mascotas"
 }',
 'pendiente',
 NOW() - INTERVAL '1 day',
 NOW() - INTERVAL '1 day'),

-- Solicitudes aprobadas (para crear tareas de seguimiento)
(7, 7, 
 '{
   "experiencia": "Tengo 3 gatos rescatados",
   "vivienda": "Departamento amplio",
   "tiempo": "Trabajo medio tiempo",
   "motivo": "Me encanta ayudar a gatos rescatados",
   "otros_animales": "3 gatos en casa",
   "gastos": "Sí, trabajo con veterinario de confianza"
 }',
 'aprobada',
 NOW() - INTERVAL '5 days',
 NOW() - INTERVAL '4 days'),

-- Solicitud rechazada
(8, 4, 
 '{
   "experiencia": "Nunca he tenido mascotas",
   "vivienda": "Rento cuarto compartido",
   "tiempo": "Viajo mucho por trabajo",
   "motivo": "Quiero compañía",
   "otros_animales": "No",
   "gastos": "No estoy seguro"
 }',
 'rechazada',
 NOW() - INTERVAL '7 days',
 NOW() - INTERVAL '6 days'),

-- Más solicitudes pendientes
(9, 2, 
 '{
   "experiencia": "He cuidado gatos de amigos",
   "vivienda": "Departamento con balcón",
   "tiempo": "Home office permanente",
   "motivo": "Busco un compañero tranquilo",
   "otros_animales": "No",
   "gastos": "Sí, tengo seguro para mascotas"
 }',
 'pendiente',
 NOW() - INTERVAL '3 hours',
 NOW() - INTERVAL '3 hours');

-- =============================================
-- 4. TAREAS DE SEGUIMIENTO
-- =============================================
-- Nota: Las tareas se crean automáticamente cuando se aprueba una solicitud
-- Aquí agregamos algunas manualmente para demostración

INSERT INTO tracking_tasks (application_id, task_type, due_date, status, description, completed_at, certificate_url) VALUES
-- Tarea completada (application_id: 3)
(3, 
 'Seguimiento de Bienestar', 
 CURRENT_DATE + INTERVAL '1 month',
 'completada',
 'Verificar que el gato Canela se haya adaptado bien al nuevo hogar. Comprobar que tiene una alimentación adecuada, un lugar seguro para dormir y está recibiendo atención veterinaria regular.',
 NOW() - INTERVAL '2 days',
 '/uploads/certificates/task-1-certificate.pdf'),

-- Tarea pendiente próxima a vencer
(3, 
 'Seguimiento de Esterilización', 
 CURRENT_DATE + INTERVAL '3 days',
 'pendiente',
 'Verificar que el adoptante haya completado la esterilización del gato según lo acordado. Solicitar comprobante del procedimiento.',
 NULL,
 NULL),

-- Tarea vencida
(3, 
 'Seguimiento de Bienestar', 
 CURRENT_DATE - INTERVAL '5 days',
 'vencida',
 'Segunda visita de seguimiento para verificar el bienestar continuo del gato.',
 NULL,
 NULL);

-- =============================================
-- 5. CONTENIDO EDUCATIVO
-- =============================================

INSERT INTO educational_posts (author_id, title, content, content_type, category, image_url) VALUES
-- Artículos de esterilización (author_id: 1 = admin, 2 = rescatista1)
(1, 
 'Importancia de la Esterilización en Gatos',
 'La esterilización es un procedimiento quirúrgico que previene la reproducción en gatos. Es fundamental para controlar la sobrepoblación felina y mejorar la salud de tu mascota.

**Beneficios principales:**
- Reduce el riesgo de cáncer reproductivo
- Elimina el celo en hembras
- Disminuye comportamientos agresivos en machos
- Previene camadas no deseadas
- Aumenta la esperanza de vida

**Edad recomendada:** Entre 5-6 meses de edad, antes del primer celo.

**Recuperación:** El proceso de recuperación toma entre 7-10 días. Durante este tiempo, el gato debe usar collar isabelino y evitar saltos excesivos.',
 'articulo',
 'esterilizacion',
 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee'),

-- Artículos de nutrición
(2, 
 'Alimentación Adecuada para Gatos Adultos',
 'Una nutrición balanceada es esencial para la salud de tu gato adulto. Aquí te explicamos los conceptos básicos.

**Proteínas:** Los gatos son carnívoros obligados. Necesitan proteína animal de alta calidad como base de su dieta.

**Frecuencia de alimentación:**
- 2-3 veces al día para adultos
- Agua fresca siempre disponible

**Alimentos a EVITAR:**
- Chocolate
- Cebolla y ajo
- Leche de vaca (muchos gatos son intolerantes a la lactosa)
- Huesos cocidos
- Pescado crudo en exceso

**Porciones:** Consulta las indicaciones del empaque de alimento y ajusta según el peso y actividad de tu gato.

**Señales de buena alimentación:**
- Pelaje brillante
- Energía adecuada
- Peso saludable
- Deposiciones normales',
 'guia',
 'nutricion',
 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e'),

-- Artículos de salud
(1, 
 'Vacunas Esenciales para Gatos',
 'Mantener el esquema de vacunación actualizado protege a tu gato de enfermedades graves.

**Vacunas básicas (core):**
1. **Triple Felina** - Protege contra:
   - Panleucopenia (moquillo felino)
   - Rinotraqueítis
   - Calicivirus
   
   Calendario: Primera dosis a las 8 semanas, refuerzos cada 3-4 semanas hasta las 16 semanas. Revacunación anual.

2. **Rabia** - Obligatoria por ley
   Primera dosis a los 3-4 meses
   Refuerzo anual o trienal según la vacuna

**Vacunas opcionales:**
- Leucemia Felina (FeLV)
- Clamidia
- Bordetella

**Importante:** Consulta con tu veterinario para un plan personalizado según el estilo de vida de tu gato (interior vs exterior).',
 'guia',
 'salud',
 'https://images.unsplash.com/photo-1574158622682-e40e69881006'),

-- Artículos de comportamiento
(2, 
 'Entendiendo el Comportamiento de tu Gato',
 'Los gatos se comunican de formas únicas. Aprender a interpretar su lenguaje corporal mejorará tu relación con ellos.

**Lenguaje corporal:**

🐱 **Cola hacia arriba:** Feliz y confiado
🐱 **Cola erizada:** Asustado o agresivo
🐱 **Orejas hacia adelante:** Alerta y curioso
🐱 **Orejas hacia atrás:** Enojado o temeroso
🐱 **Ronroneo:** Generalmente feliz (pero también puede indicar malestar)
🐱 **Amasar:** Comportamiento de bienestar heredado de cachorros

**Comportamientos comunes:**

- **Rascar:** Necesidad natural. Proporciona rascadores.
- **Enterrar desechos:** Instinto de higiene. Mantén la caja limpia.
- **Cazar:** Instinto natural. Juega con ellos usando juguetes.
- **Dormir mucho:** Los gatos duermen 12-16 horas al día. Es normal.

**Señales de estrés:**
- Esconderse constantemente
- No usar la caja de arena
- Agresividad repentina
- Pérdida de apetito

Si observas estos comportamientos de forma prolongada, consulta a un veterinario.',
 'articulo',
 'comportamiento',
 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8'),

-- Artículos de adopción
(1, 
 'Preparando tu Hogar para un Gato Adoptado',
 'Adoptar un gato es emocionante, pero requiere preparación. Aquí una guía completa para recibir a tu nuevo compañero.

**Elementos esenciales:**

✅ **Caja de arena** - Una por gato más una extra
✅ **Arena** - Sin perfume para gatos sensibles
✅ **Comedero y bebedero** - Preferiblemente de cerámica o acero inoxidable
✅ **Alimento** - De buena calidad apropiado para su edad
✅ **Rascador** - Vertical u horizontal según preferencia del gato
✅ **Escondites** - Cajas, cuevas, espacios seguros
✅ **Juguetes** - Variedad para estimulación mental
✅ **Transportadora** - Para visitas al veterinario

**Preparación del espacio:**

1. **Habitación de adaptación:** Comienza con una habitación pequeña y segura
2. **Elimina peligros:** Cables eléctricos, plantas tóxicas, ventanas sin red
3. **Altura:** Los gatos aman las alturas. Proporciona estantes o torres
4. **Temperatura:** Espacio cálido, especialmente en invierno

**Primeros días:**
- Dale tiempo y espacio
- No lo fuerces a socializar
- Establece rutinas desde el inicio
- Agenda cita veterinaria

**Tiempo de adaptación esperado:** 2-4 semanas, a veces más en gatos tímidos.',
 'guia',
 'adopcion',
 'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb'),

-- Eventos
(2, 
 'Jornada de Esterilización Gratuita - Abril 2025',
 '📅 **Fecha:** 15 de Abril, 2025
📍 **Lugar:** Centro Comunitario Col. Del Valle
⏰ **Horario:** 8:00 AM - 4:00 PM

La asociación Katze en conjunto con veterinarios voluntarios ofrece jornada de esterilización gratuita para gatos de familias de bajos recursos.

**Requisitos:**
- Registro previo (cupo limitado a 50 gatos)
- Gato debe tener mínimo 5 meses de edad
- Ayuno de 12 horas previo
- Presentar INE y comprobante de domicilio
- Transportadora adecuada

**Incluye:**
- Cirugía de esterilización
- Anestesia
- Antibióticos post-operatorios
- Collar isabelino
- Revisión post-quirúrgica

**Registro:** Enviar mensaje WhatsApp al +52 55 1234 5678 con:
- Nombre completo
- Teléfono
- Datos del gato (nombre, edad, sexo)

¡Ayúdanos a controlar la sobrepoblación felina!',
 'evento',
 'esterilizacion',
 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467'),

-- Talleres
(1, 
 'Taller Virtual: Primeros Auxilios para Gatos',
 '💻 **Modalidad:** Virtual (Zoom)
📅 **Fecha:** Sábado 20 de Abril, 2025
⏰ **Horario:** 10:00 AM - 12:00 PM
💰 **Costo:** Gratuito con registro previo

**Temario:**
1. Signos vitales normales en gatos
2. Reconocimiento de emergencias
3. Técnicas de RCP básico
4. Manejo de heridas y hemorragias
5. Intoxicaciones comunes
6. Cuándo acudir al veterinario
7. Armado de botiquín de primeros auxilios

**Imparte:** Dra. Patricia Hernández, veterinaria certificada con 15 años de experiencia.

**Incluye:**
- Manual digital descargable
- Sesión de preguntas y respuestas
- Certificado de participación

**Registro:** Formulario en www.katze.com/talleres o enviar correo a talleres@katze.com

**Cupo:** 100 personas

Este taller puede salvar la vida de tu gato. ¡No te lo pierdas!',
 'taller',
 'salud',
 'https://images.unsplash.com/photo-1543852786-1cf6624b9987'),

-- Más artículos de rescate
(2, 
 'Cómo Rescatar un Gato Callejero de Forma Segura',
 'Rescatar un gato callejero requiere paciencia, preparación y precaución. Aquí te explicamos el proceso paso a paso.

**Evaluación inicial:**
- ¿El gato está herido o enfermo?
- ¿Parece tener dueño (collar, bien alimentado)?
- ¿Es amigable o feral?

**Equipo necesario:**
1. Transportadora resistente
2. Guantes gruesos
3. Toalla o manta
4. Alimento húmedo
5. Trampa humanitaria (para gatos ferales)

**Proceso de rescate:**

**Para gatos socializados:**
1. Acércate lentamente y con calma
2. Ofrece comida a distancia
3. Habla con voz suave
4. NO lo persigas si huye
5. Visitas regulares para ganar confianza
6. Cuando permita contacto, usa transportadora

**Para gatos ferales:**
1. Coloca trampa humanitaria con comida
2. Cubre la trampa con manta oscura
3. Revisa la trampa cada 30 minutos
4. Nunca intentes sacar al gato manualmente

**Después del rescate:**
- Llévalo INMEDIATAMENTE al veterinario
- Mantenlo aislado de otras mascotas
- Programa pruebas de FIV/FeLV
- Vacunas y desparasitación
- Periodo de cuarentena de 2 semanas

**Importante:** Si el gato es feral adulto y no se socializa, considera programa TNR (Trap-Neuter-Return).

**Seguridad:** Si el gato te muerde o araña, lava la herida y consulta a un médico. Las infecciones por mordedura de gato pueden ser graves.',
 'guia',
 'rescate',
 'https://images.unsplash.com/photo-1569591159212-b02ea8a9f239');

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
-- NOTAS IMPORTANTES
-- =============================================

/*
1. CONTRASEÑAS:
   - Todas las cuentas usan la contraseña: "password123"
   - Hash bcrypt: $2b$10$rQYJZq8qNk4YfxV3qFI7ZedJ/bKX.0nQk7gV3gJ9xKj.CqFrOKk0m
   
2. USUARIOS DE PRUEBA:
   - Admin: admin@katze.com
   - Rescatista: rescatista1@katze.com
   - Adoptante: adoptante1@katze.com
   
3. DATOS REALISTAS:
   - URLs de imágenes apuntan a Unsplash
   - Teléfonos siguen formato mexicano
   - Fechas y tiempos son relativos a NOW()
   
4. RELACIONES:
   - Los IDs pueden variar si ya hay datos en tu BD
   - Ajusta los FOREIGN KEYS si es necesario
   
5. PARA GENERAR MÁS HASHES:
   En Node.js con bcrypt:
   ```javascript
   const bcrypt = require('bcrypt');
   const hash = await bcrypt.hash('password123', 10);
   console.log(hash);
   ```

6. IMÁGENES:
   - Las URLs de Unsplash son públicas y gratuitas
   - Puedes reemplazarlas con tus propias imágenes
   
7. EXTENSIÓN:
   - Este seed crea una base funcional
   - Puedes duplicar y modificar los INSERT para más datos
*/
