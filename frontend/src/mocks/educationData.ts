export interface MockEducationalPost {
    id: number;
    title: string;
    content: string;
    author_name: string;
    created_at: string;
    image_url?: string;
    category?: string;
    event_date?: string;
    author_id: number;
}

// Verified Pexels IDs (all 200) — cat-related, suitable for each article topic
const P = (id: number) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;
const U = (id: string) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=85`;

export const MOCK_EDUCATION_POSTS: MockEducationalPost[] = [
    {
        id: 1,
        title: 'Cómo preparar tu hogar antes de adoptar un gato',
        content: `Adoptar un gato es una decisión maravillosa, pero requiere preparación. Antes de que tu nuevo compañero llegue a casa, asegurate de tener todo lo necesario.

Primero, configurá un espacio seguro. Los gatos necesitan un lugar tranquilo para adaptarse en los primeros días. Una habitación pequeña con todo lo necesario —cama, comida, agua y caja de arena— es ideal para que se acostumbre sin sentirse abrumado.

Segundo, revisá la seguridad del espacio. Los gatos son curiosos y escalan. Asegurate de que las ventanas tengan mallas, que no haya cables expuestos y que las plantas tóxicas estén fuera de su alcance.

Tercero, comprá el equipamiento básico: bandeja sanitaria y arena, comedero y bebedero, rascador (esencial para proteger tus muebles), juguetes variados y una cama donde descansar.

Por último, tené el contacto de tu veterinario y planificá la primera visita para las 48-72hs del llegada. Una revisación inicial confirma el estado de salud y te da la tranquilidad de empezar bien.`,
        author_name: 'Dra. Valentina Torres',
        created_at: '2026-04-10T10:00:00.000Z',
        image_url: P(617278),
        category: 'adopcion',
        author_id: 2,
    },
    {
        id: 2,
        title: 'Nutrición felina: lo que sí y lo que no',
        content: `La alimentación de tu gato es uno de los pilares de su salud a largo plazo. A diferencia de los perros, los gatos son carnívoros obligados —necesitan proteína animal para sobrevivir.

Qué debe comer: alimento húmedo de calidad o balanceado premium sin cereal como primer ingrediente, agua fresca siempre disponible, y ocasionalmente snacks de proteína pura (pollo cocido sin condimentos).

Qué NO debe comer: leche de vaca (la mayoría son intolerantes a la lactosa), cebolla y ajo (tóxicos), uvas y pasas, chocolate, hueso cocido, comida con mucha sal.

Sobre la hidratación: los gatos naturalmente beben poco agua porque en la naturaleza la obtienen de las presas. El alimento húmedo es clave. Si come solo seco, añadí agua al alimento o invertí en una fuente de agua circulante.

Los cambios de dieta deben hacerse gradualmente en 7-10 días para evitar trastornos digestivos.`,
        author_name: 'Dr. Matías Álvarez',
        created_at: '2026-04-22T14:30:00.000Z',
        image_url: P(1170986),
        category: 'nutricion',
        author_id: 2,
    },
    {
        id: 3,
        title: 'Esterilización: por qué es un acto de amor, no de crueldad',
        content: `Uno de los mitos más persistentes es que "le quita algo natural" al gato. La realidad es exactamente al revés: esterilizar a tu gato es uno de los actos de cuidado más importantes que podés hacer.

Beneficios para las gatas: elimina el riesgo de cáncer de mama (si se hace antes del primer celo, la reducción del riesgo es del 91%), elimina el riesgo de piómetra y evita los celos repetidos que son estresantes.

Beneficios para los machos: reduce la tendencia a escaparse y pelear, elimina el marcado de territorio con orina, y disminuye comportamientos agresivos.

Beneficios para la comunidad: cada año hay millones de gatos callejeros en Argentina que nacen, viven y mueren sufriendo. Cada gato esterilizado evita decenas de camadas no planificadas.

La edad ideal es entre los 4 y 6 meses. La cirugía es rutinaria, con recuperación de 1-2 días.`,
        author_name: 'Dra. Valentina Torres',
        created_at: '2026-05-03T09:00:00.000Z',
        image_url: P(1543793),
        category: 'salud',
        author_id: 2,
    },
    {
        id: 4,
        title: 'Entendiendo el comportamiento felino: señales que tu gato te manda',
        content: `Los gatos se comunican constantemente, pero en un idioma diferente al nuestro. Aprender a "leer" a tu gato mejora enormemente la relación.

La cola: una cola levantada verticalmente es señal de saludo amistoso. Una cola inflada indica susto o agresión. Movimiento rápido y agitado indica molestia.

Los ojos: el parpadeo lento es el "te quiero" felino. Si tu gato te mira y parpadea despacio, respondele igual. Las pupilas muy dilatadas en luz normal pueden indicar miedo o dolor.

Las orejas: orejas hacia adelante significa alerta o interés. Orejas achatadas hacia atrás indica miedo o agresión.

El maullido: los gatos adultos casi no maúllan entre ellos —lo desarrollaron para comunicarse con humanos. Un maullido persistente puede indicar hambre, dolor o celo.

El ronroneo: no siempre es felicidad. Los gatos también ronronean cuando están asustados o en dolor. El contexto es clave.`,
        author_name: 'Lic. Carolina Ramos',
        created_at: '2026-05-15T11:00:00.000Z',
        image_url: P(2361952),
        category: 'comportamiento',
        author_id: 3,
    },
    {
        id: 5,
        title: 'Charla abierta: El proceso de adopción de Katze paso a paso',
        content: `Realizamos una charla abierta para explicar cómo funciona nuestro proceso de adopción y responder todas las preguntas de la comunidad.

El proceso de adopción en Katze tiene 4 pasos:

1. Formulario online: completás un formulario con preguntas sobre tu estilo de vida, espacio disponible y experiencia previa. Esto nos ayuda a encontrar la compatibilidad adecuada.

2. Evaluación: nuestro equipo revisa el formulario y puede hacer preguntas adicionales.

3. Encuentro con el gato: antes de la adopción definitiva, organizamos un encuentro para que el gato y su potencial familia se conozcan.

4. Seguimiento post-adopción: hacemos seguimiento durante los primeros 6 meses para asegurarnos de que la adaptación vaya bien.

No cobramos por las adopciones, pero pedimos el compromiso de llevar al gato al veterinario y, si no está esterilizado, hacer el procedimiento dentro de los 60 días.`,
        author_name: 'Equipo Katze',
        created_at: '2026-05-28T08:00:00.000Z',
        image_url: U('1548802673-380ab8ebc7b7'),
        category: 'adopcion',
        event_date: '2026-06-14T15:00:00.000Z',
        author_id: 1,
    },
    {
        id: 6,
        title: 'Primeros auxilios para gatos: qué hacer en emergencias',
        content: `Saber actuar rápido en una emergencia puede salvarle la vida a tu gato. Acá te dejamos una guía básica.

Heridas y sangrado: aplicá presión con una gasa limpia. No uses alcohol ni agua oxigenada directamente. Si el sangrado no para en 5 minutos, ir al veterinario de urgencia.

Atragantamiento: si tu gato tiene dificultad para respirar, abrí su boca con cuidado y mirá si hay algo visible. Si no podés verlo, ir al veterinario inmediatamente.

Intoxicación: si sospecháis que comió algo tóxico, no induzcas el vómito. Llevalo al veterinario con toda la información posible.

Caída de altura: aunque los gatos tienen el reflejo de caer parados, siempre consultar al veterinario después de una caída importante.

Siempre tené el número de un veterinario de guardia. Actuar en los primeros 30 minutos puede ser determinante.`,
        author_name: 'Dr. Matías Álvarez',
        created_at: '2026-06-05T13:00:00.000Z',
        image_url: P(1056251),
        category: 'salud',
        author_id: 2,
    },
    {
        id: 7,
        title: 'Juego y enriquecimiento ambiental: cómo estimular a tu gato en casa',
        content: `Un gato aburrido es un gato problemático. El juego y el enriquecimiento son fundamentales para el bienestar físico y mental de los felinos en interior.

Juguete de la varita: es el favorito porque imita a la presa. Al menos 15-20 minutos de juego activo por día reducen el estrés y mantienen el peso saludable.

Rascadores y perchas: los gatos necesitan rascar —es instintivo. Un buen rascador alto también les permite estirarse. Las perchas junto a ventanas les dan estimulación visual.

Juguetes interactivos: los puzzles de comida hacen que el gato "cace" su alimento y lo mantienen ocupado.

Escondites y cajas: los gatos adoran los espacios confinados donde sentirse seguros. Una caja de cartón puede ser más valiosa que el juguete más caro.

Rotá los juguetes cada pocos días para mantener el interés.`,
        author_name: 'Lic. Carolina Ramos',
        created_at: '2026-06-12T10:30:00.000Z',
        image_url: P(1472999),
        category: 'comportamiento',
        author_id: 3,
    },
    {
        id: 8,
        title: 'Taller presencial: Cuidados básicos para nuevos adoptantes',
        content: `Organizamos un taller presencial gratuito pensado para personas que adoptaron recientemente o están por hacerlo. El taller cubre todo lo que necesitás saber para los primeros meses.

Temario del taller:

- Alimentación según edad y condición (cachorro, adulto, senior)
- Caja de arena: tipos, ubicación y frecuencia de limpieza
- Primeras señales de enfermedad que no debés ignorar
- Vacunación y desparasitación: calendarios
- Cómo presentar el gato a otros animales de la casa
- Adaptación en los primeros 30 días: qué es normal y qué no

El taller es gratuito y abierto a toda la comunidad. Cupos limitados a 20 personas.`,
        author_name: 'Equipo Katze',
        created_at: '2026-06-18T09:00:00.000Z',
        image_url: P(3265460),
        category: 'recursos',
        event_date: '2026-07-12T14:00:00.000Z',
        author_id: 1,
    },
    {
        id: 9,
        title: 'Gatos senior: cómo cuidar a un gato mayor',
        content: `Los gatos mayores de 7 años tienen necesidades específicas que, bien atendidas, les permiten tener una vejez muy confortable. Adoptar un gato senior es además uno de los actos más nobles.

Salud: los gatos senior necesitan controles veterinarios dos veces al año. La detección temprana de enfermedades renales, hipertiroidismo y diabetes marca la diferencia.

Alimentación: los alimentos específicos para senior tienen menos fósforo (protege los riñones) y están adaptados a su digestión más lenta.

Movilidad: si tienen artritis, asegurate de que puedan acceder sin esfuerzo a la caja de arena y sus lugares favoritos. Las rampas pueden ayudar.

Temperatura: los gatos senior sienten más el frío. Asegurate de que tengan lugares cálidos donde descansar.

Mental: siguen necesitando juego y estimulación, aunque a menor intensidad.`,
        author_name: 'Dra. Valentina Torres',
        created_at: '2026-06-24T11:00:00.000Z',
        image_url: P(2173872),
        category: 'salud',
        author_id: 2,
    },
    {
        id: 10,
        title: 'Presentación de nuevos rescates: julio 2026',
        content: `Este mes incorporamos nuevos gatos al refugio, listos para comenzar su proceso de adopción. Acá les presentamos brevemente a los recién llegados.

Mochi (4 meses, Siamés): parlanchina y llena de energía. Llegó con su mamá que ya fue adoptada.

Bongo (1 año, Mestizo Tabby): tabby explorador rescatado de una obra en construcción. En perfectas condiciones.

Cielo (4 meses, Siamés): apareció en un jardín una mañana lluviosa. Ojos azules, carácter dulce.

Todos los gatos nuevos llegan desparasitados y con al menos su primera vacuna. Los que tienen la edad adecuada están castrados o esterilizados.

Para solicitar una adopción, completá el formulario en nuestra web. ¡Gracias a toda la comunidad que hace posible este trabajo!`,
        author_name: 'Equipo Katze',
        created_at: '2026-07-01T08:00:00.000Z',
        image_url: P(1560932),
        category: 'adopcion',
        author_id: 1,
    },
];
