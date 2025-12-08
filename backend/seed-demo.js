// Seed de demostración completo para Katze
// Genera datos realistas para demostrar todas las funcionalidades

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'katze',
    password: 'root',
    port: 5432
});

// Datos realistas para la demostración
const nombres_gatos = [
    'Luna', 'Simba', 'Michi', 'Tigre', 'Pelusa', 'Nieve', 'Shadow', 'Muffin',
    'Cookie', 'Bella', 'Max', 'Oliver', 'Coco', 'Bolita', 'Peludo', 'Misty',
    'Whiskers', 'Oreo', 'Garfield', 'Salem', 'Felix', 'Tom', 'Mittens', 'Smokey',
    'Ginger', 'Pepper', 'Boots', 'Socks', 'Paws', 'Fluffy', 'Princess', 'Duke',
    'Leo', 'Loki', 'Thor', 'Zeus', 'Apollo', 'Athena', 'Cleo', 'Nala'
];

const razas = [
    'Mestizo', 'Siamés', 'Persa', 'Maine Coon', 'Bengalí', 
    'Ragdoll', 'Británico de Pelo Corto', 'Sphynx', 'Angora',
    'Común Europeo', 'Criollo', 'Desconocido'
];

const colores = [
    'Naranja', 'Negro', 'Blanco', 'Gris', 'Atigrado', 
    'Tricolor', 'Bicolor', 'Carey', 'Blanco con manchas',
    'Negro con blanco', 'Gris con rayas', 'Naranja con blanco'
];

const edades = ['2 meses', '3 meses', '4 meses', '6 meses', '8 meses', '1 año', '2 años', '3 años', '4 años', '5 años'];

const personalidades = [
    ['Juguetón', 'Sociable', 'Curioso'],
    ['Tranquilo', 'Cariñoso', 'Dormilón'],
    ['Energético', 'Aventurero', 'Inteligente'],
    ['Tímido', 'Observador', 'Gentil'],
    ['Independiente', 'Cazador', 'Territorial'],
    ['Cariñoso', 'Vocal', 'Demandante de atención'],
    ['Relajado', 'Amigable con niños', 'Paciente'],
    ['Activo', 'Juguetón', 'Le encanta trepar']
];

const historias_rescate = [
    'Fue encontrado abandonado en una caja cerca del mercado central. Estaba muy asustado pero después de unos días de cuidados empezó a mostrar su personalidad cariñosa.',
    'Rescatado de la calle después de un accidente menor. Con tratamiento veterinario se recuperó completamente y ahora busca un hogar definitivo.',
    'Llegó a nosotros como parte de una camada no deseada. Su madre fue esterilizada y los gatitos están listos para adopción.',
    'Encontrado en un parque, muy delgado y con necesidad de cuidados. Después de varios meses está completamente sano y lleno de energía.',
    'Rescatado de una colonia callejera que está siendo esterilizada. Es muy sociable y se adapta bien a la vida en casa.',
    'Abandonado en la puerta de una veterinaria. Es muy cariñoso y busca una familia que le dé todo el amor que merece.',
    'Salvado de una situación de maltrato. Con paciencia y cariño ha aprendido a confiar nuevamente en las personas.',
    'Encontrado como gatito bebé sin madre. Fue criado a biberón y ahora es un gato joven lleno de vida.'
];

const espacios_vivienda = ['Apartamento pequeño', 'Apartamento mediano', 'Casa con patio', 'Casa grande'];
const experiencias = ['Primera vez', 'Tengo experiencia previa', 'Tengo varios gatos', 'He criado gatitos'];
const motivaciones = [
    'Quiero compañía',
    'Me encantan los gatos',
    'Quiero salvar un gatito',
    'Tengo experiencia y quiero adoptar',
    'Mi familia quiere una mascota',
    'Busco un compañero para mi otro gato'
];

// Descripciones realistas de vivienda
const descripciones_vivienda = [
    'Departamento en segundo piso con balcón cerrado. Ambiente tranquilo y seguro.',
    'Casa con jardín vallado. Espacio amplio para que el gato explore con seguridad.',
    'Apartamento acogedor con muchas ventanas. Ambiente familiar y tranquilo.',
    'Casa de dos pisos con áreas designadas para mascotas. Familia con experiencia.',
    'Departamento moderno con espacios adaptados para gatos. Sin acceso al exterior.',
    'Casa con patio interno. Convivimos con otros gatos que están esterilizados.'
];

async function clearDatabase() {
    console.log('🗑️  Limpiando base de datos...');
    
    await pool.query('DELETE FROM tracking_tasks');
    await pool.query('DELETE FROM adoption_applications');
    await pool.query('DELETE FROM educational_posts');
    await pool.query('DELETE FROM cats');
    await pool.query('DELETE FROM users WHERE email != $1', ['admin@katze.com']);
    
    // Resetear secuencias
    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 2');
    await pool.query('ALTER SEQUENCE cats_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE adoption_applications_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE educational_posts_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE tracking_tasks_id_seq RESTART WITH 1');
    
    console.log('✅ Base de datos limpiada\n');
}

async function createUsers() {
    console.log('👥 Creando usuarios...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 10 Rescatistas
    const rescatistas = [];
    for (let i = 1; i <= 10; i++) {
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, phone, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, full_name`,
            [
                `rescatista${i}@katze.com`,
                hashedPassword,
                `Rescatista ${['García', 'Martínez', 'López', 'Rodríguez', 'Pérez', 'González', 'Sánchez', 'Ramírez', 'Torres', 'Flores'][i-1]}`,
                `+591 7${String(i).padStart(7, '0')}`,
                'rescatista'
            ]
        );
        rescatistas.push(result.rows[0]);
    }
    
    // 25 Adoptantes
    const adoptantes = [];
    const nombres_adoptantes = [
        'María Fernández', 'Juan Pérez', 'Ana Silva', 'Carlos Mendoza', 'Laura Vargas',
        'Diego Ortiz', 'Sofía Morales', 'Luis Castro', 'Valentina Rojas', 'Andrés Guzmán',
        'Camila Herrera', 'Miguel Ángel Ramos', 'Daniela Flores', 'Roberto Jiménez', 'Patricia Cruz',
        'Fernando Álvarez', 'Isabella Romero', 'Gabriel Díaz', 'Lucía Medina', 'Alejandro Soto',
        'Martina Ruiz', 'Sebastián Moreno', 'Carolina Navarro', 'Ricardo Vega', 'Paula Campos'
    ];
    
    for (let i = 1; i <= 25; i++) {
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, phone, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, full_name`,
            [
                `adoptante${i}@katze.com`,
                hashedPassword,
                nombres_adoptantes[i-1],
                `+591 6${String(i).padStart(7, '0')}`,
                'adoptante'
            ]
        );
        adoptantes.push(result.rows[0]);
    }
    
    console.log(`✅ Creados ${rescatistas.length} rescatistas y ${adoptantes.length} adoptantes\n`);
    return { rescatistas, adoptantes };
}

async function createCats(rescatistas) {
    console.log('🐱 Creando gatos...');
    
    const cats = [];
    const statuses = [
        { approval: 'aprobado', adoption: 'disponible', count: 20 },
        { approval: 'aprobado', adoption: 'en_proceso', count: 8 },
        { approval: 'aprobado', adoption: 'adoptado', count: 10 },
        { approval: 'pendiente', adoption: 'disponible', count: 5 },
        { approval: 'rechazado', adoption: 'disponible', count: 2 } // Rechazados siguen disponibles
    ];
    
    let catIndex = 0;
    
    for (const status of statuses) {
        for (let i = 0; i < status.count; i++) {
            const rescatista = rescatistas[Math.floor(Math.random() * rescatistas.length)];
            const nombre = nombres_gatos[catIndex % nombres_gatos.length];
            const edadStr = edades[Math.floor(Math.random() * edades.length)];
            // Convertir edad a número (meses)
            let edadNumero;
            if (edadStr.includes('meses')) {
                edadNumero = parseInt(edadStr);
            } else if (edadStr.includes('año')) {
                edadNumero = parseInt(edadStr) * 12;
            } else {
                edadNumero = 12; // Default 1 año
            }
            
            const raza = razas[Math.floor(Math.random() * razas.length)];
            const color = colores[Math.floor(Math.random() * colores.length)];
            const sexo = Math.random() > 0.5 ? 'Macho' : 'Hembra';
            const personalidad = personalidades[Math.floor(Math.random() * personalidades.length)];
            const historia = historias_rescate[Math.floor(Math.random() * historias_rescate.length)];
            
            // Status de salud variado
            const healthStatuses = ['Saludable', 'Excelente salud', 'Tratamiento completado', 'Sano y activo'];
            const sterilizationStatuses = ['esterilizado', 'pendiente', 'no_aplica'];
            
            // Distribución realista de esterilización
            let sterilizationStatus;
            if (status.adoption === 'adoptado') {
                sterilizationStatus = 'esterilizado'; // Adoptados siempre esterilizados
            } else if (edadNumero < 6) {
                sterilizationStatus = 'pendiente'; // Muy jóvenes
            } else {
                // Para disponibles: más probabilidad de no esterilizados (no_aplica)
                sterilizationStatus = Math.random() > 0.4 ? 'no_aplica' : 'esterilizado';
            }
            
            const description = `${sexo} ${color.toLowerCase()} de ${edadStr}. Raza: ${raza}. Personalidad: ${personalidad.join(', ')}. ${historia}`;
            
            const livingSpace = ['casa_grande', 'departamento', 'cualquiera'][Math.floor(Math.random() * 3)];
            
            const result = await pool.query(
                `INSERT INTO cats (name, age, description, health_status, sterilization_status, 
                                   approval_status, adoption_status, owner_id, story, photos_url, breed, living_space_requirement)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                 RETURNING id, name, approval_status, adoption_status, owner_id, sterilization_status`,
                [
                    `${nombre}${catIndex > nombres_gatos.length ? ' ' + Math.floor(catIndex / nombres_gatos.length) : ''}`,
                    edadNumero,
                    description,
                    healthStatuses[Math.floor(Math.random() * healthStatuses.length)],
                    sterilizationStatus,
                    status.approval,
                    status.adoption,
                    rescatista.id,
                    historia,
                    JSON.stringify([`https://placekitten.com/400/${300 + catIndex}`, `https://placekitten.com/400/${301 + catIndex}`]),
                    raza,
                    livingSpace
                ]
            );
            
            cats.push(result.rows[0]);
            catIndex++;
        }
    }
    
    console.log(`✅ Creados ${cats.length} gatos\n`);
    return cats;
}

async function createApplications(cats, adoptantes) {
    console.log('📋 Creando solicitudes de adopción...');
    
    const applications = [];
    
    // Filtrar solo gatos aprobados para solicitudes
    const approvedCats = cats.filter(c => c.approval_status === 'aprobado');
    
    // Priorizar gatos adopt ados y en proceso - deben tener solicitudes aprobadas
    const adoptedCats = approvedCats.filter(c => c.adoption_status === 'adoptado' || c.adoption_status === 'en_proceso');
    const availableCats = approvedCats.filter(c => c.adoption_status === 'disponible').slice(0, 10);
    
    // Combinar: todos los adoptados/en proceso + algunos disponibles
    const catsToProcess = [...adoptedCats, ...availableCats];
    
    for (const cat of catsToProcess) {
        const numApplications = Math.floor(Math.random() * 4) + 2; // 2-5 solicitudes
        
        for (let i = 0; i < numApplications; i++) {
            const adoptante = adoptantes[Math.floor(Math.random() * adoptantes.length)];
            
            // Evitar duplicados (mismo adoptante, mismo gato)
            const exists = applications.some(a => a.cat_id === cat.id && a.applicant_id === adoptante.id);
            if (exists) continue;
            
            // Distribuir estados de solicitud
            let applicationStatus;
            let aiScore = Math.floor(Math.random() * 40) + 60; // 60-100
            
            if (cat.adoption_status === 'adoptado') {
                // Gatos adoptados: primera solicitud aprobada, resto rechazadas
                applicationStatus = i === 0 ? 'aprobada' : 'rechazada';
                if (applicationStatus === 'aprobada') aiScore = Math.floor(Math.random() * 15) + 85; // 85-100
            } else if (cat.adoption_status === 'en_proceso') {
                // Gatos en proceso: algunas aprobadas, otras pendientes
                applicationStatus = i === 0 ? 'aprobada' : (Math.random() > 0.6 ? 'pendiente' : 'rechazada');
                if (applicationStatus === 'aprobada') aiScore = Math.floor(Math.random() * 20) + 75; // 75-95
            } else {
                // Gatos disponibles: mayormente pendientes
                applicationStatus = Math.random() > 0.8 ? 'rechazada' : 'pendiente';
            }
            
            // Generar respuestas realistas
            const experiencia = experiencias[Math.floor(Math.random() * experiencias.length)];
            const espacio = espacios_vivienda[Math.floor(Math.random() * espacios_vivienda.length)];
            const motivacion = motivaciones[Math.floor(Math.random() * motivaciones.length)];
            const descripcion = descripciones_vivienda[Math.floor(Math.random() * descripciones_vivienda.length)];
            
            const answers = {
                experiencia: experiencia,
                espacio_vivienda: espacio,
                otras_mascotas: Math.random() > 0.6 ? 'Sí, tengo otros gatos' : 'No tengo otras mascotas',
                motivo_adopcion: motivacion,
                descripcion_vivienda: descripcion,
                compromiso_veterinario: 'Sí, me comprometo a llevarlo regularmente',
                tiempo_disponible: Math.random() > 0.5 ? 'Trabajo desde casa' : 'Salgo pero tengo familia en casa'
            };
            
            // AI evaluation realista
            const aiTags = [];
            if (aiScore >= 85) {
                aiTags.push('Candidato ideal', 'Alta responsabilidad', 'Experiencia comprobada');
            } else if (aiScore >= 70) {
                aiTags.push('Buen candidato', 'Comprometido');
            } else {
                aiTags.push('Revisar experiencia', 'Necesita seguimiento');
            }
            
            const aiFeedback = aiScore >= 85 
                ? 'Excelente candidato. Muestra gran compromiso y experiencia con gatos.'
                : aiScore >= 70
                ? 'Candidato prometedor. Tiene las condiciones básicas para adoptar.'
                : 'Candidato aceptable. Se recomienda entrevista adicional.';
            
            const createdDaysAgo = Math.floor(Math.random() * 30);
            
            const result = await pool.query(
                `INSERT INTO adoption_applications 
                 (cat_id, applicant_id, form_responses, status, ai_score, ai_flags, ai_feedback, ai_evaluated_at, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '${createdDaysAgo} days', NOW() - INTERVAL '${createdDaysAgo} days')
                 RETURNING id, cat_id, applicant_id, status`,
                [
                    cat.id,
                    adoptante.id,
                    JSON.stringify(answers),
                    applicationStatus,
                    aiScore,
                    aiTags,
                    aiFeedback
                ]
            );
            
            applications.push(result.rows[0]);
        }
    }
    
    // Count by status for debugging
    const statusCount = {};
    applications.forEach(app => {
        statusCount[app.status] = (statusCount[app.status] || 0) + 1;
    });
    
    console.log(`✅ Creadas ${applications.length} solicitudes de adopción`);
    console.log(`   Estados: ${JSON.stringify(statusCount)}\n`);
    return applications;
}

async function createTrackingTasks(applications, cats) {
    console.log('📅 Creando tareas de seguimiento...');
    
    const tasks = [];
    
    // Solo crear tareas para solicitudes aprobadas
    const approvedApps = applications.filter(a => a.status === 'aprobada');
    
    console.log(`   Encontradas ${approvedApps.length} solicitudes aprobadas para seguimiento`);
    
    for (const app of approvedApps) {
        const cat = cats.find(c => c.id === app.cat_id);
        if (!cat) continue;
        
        // Tarea de esterilización si el gato no está esterilizado
        if (cat.sterilization_status === 'no_esterilizado' || cat.sterilization_status === 'pendiente') {
            const dueDays = Math.floor(Math.random() * 90); // 0-90 días
            let status = 'pendiente';
            
            if (dueDays < 20) {
                status = 'pendiente';
            } else if (dueDays < 50) {
                status = Math.random() > 0.5 ? 'completada' : 'pendiente';
            } else {
                status = 'atrasada';
            }
            
            const result = await pool.query(
                `INSERT INTO tracking_tasks (application_id, task_type, due_date, status, description)
                 VALUES ($1, $2, NOW() + INTERVAL '${dueDays} days', $3, $4)
                 RETURNING id`,
                [
                    app.id,
                    'Seguimiento de Esterilización',
                    status,
                    `Verificar que ${cat.name} haya sido esterilizado y solicitar certificado veterinario.`
                ]
            );
            tasks.push(result.rows[0]);
            
            // Si está completada, actualizar el gato
            if (status === 'completada') {
                await pool.query(
                    'UPDATE cats SET sterilization_status = $1 WHERE id = $2',
                    ['esterilizado', cat.id]
                );
            }
        }
        
        // Tareas de bienestar (1-3 por adopción)
        const numWelfareTasks = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numWelfareTasks; i++) {
            const monthsAhead = (i + 1) * 3; // 3, 6, 9 meses
            const dueDays = monthsAhead * 30;
            
            let status = 'pendiente';
            const randomValue = Math.random();
            
            if (i === 0) {
                // Primera tarea - más probabilidad de estar completada
                status = randomValue > 0.6 ? 'completada' : randomValue > 0.3 ? 'pendiente' : 'atrasada';
            } else if (i === 1) {
                status = randomValue > 0.7 ? 'pendiente' : 'atrasada';
            } else {
                status = 'pendiente';
            }
            
            const descriptions = [
                `Visita de seguimiento de bienestar para ${cat.name}. Verificar adaptación y estado general.`,
                `Seguimiento ${monthsAhead} meses post-adopción. Confirmar que ${cat.name} está recibiendo cuidados adecuados.`,
                `Verificar condiciones de vida y estado de salud de ${cat.name} en su nuevo hogar.`
            ];
            
            const result = await pool.query(
                `INSERT INTO tracking_tasks (application_id, task_type, due_date, status, description)
                 VALUES ($1, $2, NOW() + INTERVAL '${dueDays} days', $3, $4)
                 RETURNING id`,
                [
                    app.id,
                    'Seguimiento de Bienestar',
                    status,
                    descriptions[i % descriptions.length]
                ]
            );
            tasks.push(result.rows[0]);
        }
    }
    
    console.log(`✅ Creadas ${tasks.length} tareas de seguimiento\n`);
    return tasks;
}

async function createEducationalPosts(rescatistas) {
    console.log('📚 Creando posts educativos...');
    
    const posts = [];
    
    const educationalContent = [
        {
            title: 'Importancia de la Esterilización Felina',
            content: `La esterilización es fundamental para el control poblacional de gatos. Beneficios principales:
            
• Previene enfermedades reproductivas
• Reduce comportamientos territoriales
• Disminuye el riesgo de cáncer
• Ayuda a controlar la sobrepoblación

En Katze, promovemos la esterilización responsable de todos los gatos adoptados. Es un compromiso con el bienestar animal.`,
            category: 'esterilizacion',
            content_type: 'articulo',
            event_date: null
        },
        {
            title: 'Cómo Preparar tu Casa para un Gato Nuevo',
            content: `Antes de adoptar, prepara estos elementos esenciales:

1. Arenero en lugar tranquilo
2. Platos para comida y agua
3. Rascadores y juguetes
4. Cama cómoda
5. Transportadora
6. Escondites seguros

Dale tiempo para adaptarse. Los primeros días son cruciales para crear un vínculo positivo.`,
            category: 'adopcion',
            content_type: 'guia',
            event_date: null
        },
        {
            title: 'Jornada de Adopción - Enero 2026',
            content: `¡Gran jornada de adopción este 15 de enero!

📍 Lugar: Plaza Principal
⏰ Horario: 9:00 - 18:00
🐱 Más de 20 gatitos buscando hogar

Habrá veterinarios disponibles para consultas gratuitas. ¡Te esperamos!`,
            category: 'adopcion',
            content_type: 'evento',
            event_date: '2026-01-15'
        },
        {
            title: 'Nutrición Felina: Guía Básica',
            content: `Una alimentación adecuada es clave para la salud de tu gato:

• Proteína de calidad (carne)
• Agua fresca siempre disponible
• Evitar comida humana condimentada
• Porciones según edad y peso
• Alimento balanceado comercial

Consulta con tu veterinario sobre la mejor dieta para tu gato específicamente.`,
            category: 'nutricion',
            content_type: 'guia',
            event_date: null
        },
        {
            title: 'Entendiendo el Comportamiento Felino',
            content: `Los gatos se comunican de formas únicas:

🐾 Ronroneo: Satisfacción o auto-calma
🐾 Maullido: Comunicación con humanos
🐾 Cola alta: Confianza y felicidad
🐾 Orejas hacia atrás: Miedo o molestia
🐾 Amasar: Confort extremo

Aprende a leer estas señales para fortalecer tu vínculo.`,
            category: 'comportamiento',
            content_type: 'articulo',
            event_date: null
        },
        {
            title: 'Campaña de Vacunación Gratuita',
            content: `En colaboración con veterinarias locales, ofrecemos:

💉 Vacuna Triple Felina
💉 Vacuna Antirrábica
💉 Desparasitación

Fechas: 20-25 de Enero
Requisito: Gato adoptado a través de Katze

¡Cuida la salud de tu compañero felino!`,
            category: 'salud',
            content_type: 'evento',
            event_date: '2026-01-20'
        },
        {
            title: 'Juegos y Enriquecimiento Ambiental',
            content: `Mantén a tu gato activo y feliz:

Juguetes recomendados:
• Cañas con plumas
• Ratones de juguete
• Pelotas con cascabeles
• Cajas de cartón
• Torres con niveles

El juego diario previene obesidad y aburrimiento. ¡15 minutos al día hacen la diferencia!`,
            category: 'general',
            content_type: 'guia',
            event_date: null
        },
        {
            title: 'Primeros Auxilios para Gatos',
            content: `Conoce estos básicos de emergencia:

⚠️ Envenenamiento: Contactar veterinario inmediatamente
⚠️ Heridas: Limpiar y aplicar presión
⚠️ Dificultad respiratoria: Urgencia veterinaria
⚠️ Convulsiones: Lugar seguro, sin manipular

Siempre ten a mano el número de tu veterinario y una clínica de emergencias 24h.`,
            category: 'salud',
            content_type: 'guia',
            event_date: null
        },
        {
            title: 'Taller: Introducción de Gatos en Casa con Mascotas',
            content: `Aprende a introducir un nuevo gato cuando ya tienes mascotas:

📆 Fecha: 30 de Enero, 16:00
📍 Centro Comunitario
👥 Cupos limitados: 20 personas

Temas: Técnicas de introducción gradual, lenguaje corporal, prevención de conflictos.

Inscripciones: info@katze.com`,
            category: 'comportamiento',
            content_type: 'taller',
            event_date: '2026-01-30'
        },
        {
            title: 'Desparasitación: Calendario y Productos',
            content: `Mantén a tu gato libre de parásitos:

📅 Calendario:
• Gatitos: Cada 2 semanas hasta 3 meses
• Adultos: Cada 3-6 meses
• Gatos con acceso exterior: Mensual

Consulta con tu veterinario sobre el antiparasitario más adecuado para tu gato.`,
            category: 'salud',
            content_type: 'articulo',
            event_date: null
        }
    ];
    
    // Usar el primer rescatista como autor de los posts
    const authorId = rescatistas[0].id;
    
    for (let i = 0; i < educationalContent.length; i++) {
        const post = educationalContent[i];
        const daysAgo = Math.floor(Math.random() * 60);
        
        const result = await pool.query(
            `INSERT INTO educational_posts (title, content, author_id, category, content_type, event_date, created_at, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '${daysAgo} days', $7)
             RETURNING id`,
            [
                post.title,
                post.content,
                authorId,
                post.category,
                post.content_type,
                post.event_date,
                `https://picsum.photos/seed/${i}/800/400`
            ]
        );
        posts.push(result.rows[0]);
    }
    
    console.log(`✅ Creados ${posts.length} posts educativos\n`);
    return posts;
}

async function displaySummary(users, cats, applications, tasks, posts) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           📊 RESUMEN DE DATOS DE DEMOSTRACIÓN             ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    // Usuarios
    console.log('👥 USUARIOS:');
    console.log(`   • Rescatistas: ${users.rescatistas.length}`);
    console.log(`   • Adoptantes: ${users.adoptantes.length}`);
    console.log(`   • Admin: 1 (admin@katze.com / admin123)`);
    console.log(`   • Total: ${users.rescatistas.length + users.adoptantes.length + 1}\n`);
    
    // Gatos
    const catsByApproval = {};
    const catsByAdoption = {};
    const catsBySterilization = {};
    
    cats.forEach(cat => {
        catsByApproval[cat.approval_status] = (catsByApproval[cat.approval_status] || 0) + 1;
        catsByAdoption[cat.adoption_status] = (catsByAdoption[cat.adoption_status] || 0) + 1;
        catsBySterilization[cat.sterilization_status] = (catsBySterilization[cat.sterilization_status] || 0) + 1;
    });
    
    console.log('🐱 GATOS:');
    console.log(`   Total: ${cats.length}`);
    console.log('   Por estado de aprobación:');
    Object.entries(catsByApproval).forEach(([status, count]) => {
        console.log(`     - ${status}: ${count}`);
    });
    console.log('   Por estado de adopción:');
    Object.entries(catsByAdoption).forEach(([status, count]) => {
        console.log(`     - ${status}: ${count}`);
    });
    console.log('   Por esterilización:');
    Object.entries(catsBySterilization).forEach(([status, count]) => {
        console.log(`     - ${status}: ${count}`);
    });
    console.log();
    
    // Solicitudes
    const appsByStatus = {};
    applications.forEach(app => {
        appsByStatus[app.status] = (appsByStatus[app.status] || 0) + 1;
    });
    
    console.log('📋 SOLICITUDES DE ADOPCIÓN:');
    console.log(`   Total: ${applications.length}`);
    Object.entries(appsByStatus).forEach(([status, count]) => {
        console.log(`     - ${status}: ${count}`);
    });
    console.log();
    
    // Tareas
    const taskResult = await pool.query(`
        SELECT 
            task_type,
            status,
            COUNT(*) as count
        FROM tracking_tasks
        GROUP BY task_type, status
        ORDER BY task_type, status
    `);
    
    console.log('📅 TAREAS DE SEGUIMIENTO:');
    console.log(`   Total: ${tasks.length}`);
    
    const tasksByType = {};
    taskResult.rows.forEach(row => {
        if (!tasksByType[row.task_type]) {
            tasksByType[row.task_type] = {};
        }
        tasksByType[row.task_type][row.status] = parseInt(row.count);
    });
    
    Object.entries(tasksByType).forEach(([type, statuses]) => {
        console.log(`   ${type}:`);
        Object.entries(statuses).forEach(([status, count]) => {
            console.log(`     - ${status}: ${count}`);
        });
    });
    console.log();
    
    // Posts
    console.log('📚 POSTS EDUCATIVOS:');
    console.log(`   Total: ${posts.length}`);
    
    const postsByCategory = await pool.query(`
        SELECT category, COUNT(*) as count
        FROM educational_posts
        GROUP BY category
        ORDER BY count DESC
    `);
    
    postsByCategory.rows.forEach(row => {
        console.log(`     - ${row.category}: ${row.count}`);
    });
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ SEED COMPLETADO EXITOSAMENTE              ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log('🔐 CREDENCIALES DE PRUEBA:\n');
    console.log('   Admin:');
    console.log('   • Email: admin@katze.com');
    console.log('   • Password: admin123\n');
    console.log('   Rescatistas:');
    console.log('   • Email: rescatista1@katze.com - rescatista10@katze.com');
    console.log('   • Password: password123\n');
    console.log('   Adoptantes:');
    console.log('   • Email: adoptante1@katze.com - adoptante25@katze.com');
    console.log('   • Password: password123\n');
    
    console.log('🚀 LISTO PARA DEMO! Inicia el servidor y explora todas las funcionalidades.\n');
}

async function main() {
    try {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║        🎭 SEED DE DEMOSTRACIÓN COMPLETO - KATZE           ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
        
        await clearDatabase();
        
        const users = await createUsers();
        const cats = await createCats(users.rescatistas);
        const applications = await createApplications(cats, users.adoptantes);
        const tasks = await createTrackingTasks(applications, cats);
        const posts = await createEducationalPosts(users.rescatistas);
        
        await displaySummary(users, cats, applications, tasks, posts);
        
    } catch (error) {
        console.error('\n❌ Error durante el seed:', error);
    } finally {
        await pool.end();
    }
}

main();
