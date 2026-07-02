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

const px = (id: number) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

export const MOCK_EDUCATION_POSTS: MockEducationalPost[] = [
    {
        id: 1,
        title: 'Cómo preparar tu hogar antes de adoptar un gato',
        content: `Adoptar un gato es una decisión maravillosa, pero requiere preparación. Antes de que tu nuevo compañero llegue a casa, asegurate de tener todo lo necesario.

Primero, configurá un espacio seguro. Los gatos necesitan un lugar tranquilo para adaptarse en los primeros días. Una habitación pequeña con todo lo necesario —cama, comida, agua y caja de arena— es ideal para que se acostumbre a los olores y sonidos del hogar sin sentirse abrumado.

Segundo, revisá la seguridad del espacio. Los gatos son curiosos y escalan, así que asegurate de que las ventanas tengan mallas, que no haya cables expuestos y que las plantas tóxicas estén fuera de su alcance. Plantas como el lirio de la paz, el potus y el diffenbachia son peligrosas para los felinos.

Tercero, comprá el equipamiento básico: bandeja sanitaria y arena, comedero y bebedero, rascador (esencial para proteger tus muebles), juguetes variados, y una cama o manta donde pueda descansar.

Por último, acordate de tener el nombre del veterinario más cercano y planificá la primera visita para las 48-72hs de llegada. Una revisación inicial confirma el estado de salud y te da la tranquilidad de empezar con el pie derecho.`,
        author_name: 'Dra. Valentina Torres',
        created_at: '2026-05-15T10:00:00.000Z',
        image_url: px(45201),
        category: 'adopcion',
        author_id: 2,
    },
    {
        id: 2,
        title: 'Nutrición felina: lo que sí y lo que no',
        content: `La alimentación de tu gato es uno de los pilares de su salud a largo plazo. A diferencia de los perros, los gatos son carnívoros obligados —esto significa que necesitan proteína animal para sobrevivir y no pueden procesar bien los carbohidratos en exceso.

Qué debe comer tu gato: alimento húmedo de calidad (o balanceado premium sin cereal como primer ingrediente), agua fresca siempre disponible, y ocasionalmente snacks de proteína pura (pollo cocido sin condimentos, por ejemplo).

Qué NO debe comer tu gato: leche de vaca (la mayoría son intolerantes a la lactosa después del destete), cebolla y ajo (tóxicos en cualquier forma), uvas y pasas, chocolate, hueso cocido (puede astillarse), y comida con mucha sal o condimentos.

Sobre la hidratación: los gatos naturalmente beben poco agua porque en la naturaleza la obtienen de las presas. Por eso el alimento húmedo es tan importante. Si tu gato come solo seco, considerá añadir agua al alimento o invertir en una fuente de agua circulante —el movimiento los estimula a beber más.

Finalmente, los cambios de dieta deben hacerse gradualmente en un período de 7-10 días para evitar trastornos digestivos. Mezclá el alimento nuevo con el anterior en proporciones crecientes.`,
        author_name: 'Dr. Matías Álvarez',
        created_at: '2026-05-28T14:30:00.000Z',
        image_url: px(1170986),
        category: 'nutricion',
        author_id: 2,
    },
    {
        id: 3,
        title: 'Esterilización: por qué es un acto de amor, no de crueldad',
        content: `Uno de los mitos más persistentes sobre la esterilización es que "le quita algo natural" al gato. La realidad es exactamente al revés: esterilizar a tu gato es uno de los actos de cuidado más importantes que podés hacer.

Beneficios para las gatas: elimina el riesgo de cáncer de mama (si se hace antes del primer celo, la reducción del riesgo es de hasta el 91%), elimina el riesgo de infecciones uterinas (piómetra), y evita los celos repetidos que son estresantes y dolorosos.

Beneficios para los gatos machos: reduce la tendencia a escaparse y a pelear (y con ello las heridas y enfermedades como FIV), elimina el marcado de territorio con orina (que tiene un olor muy fuerte), y disminuye comportamientos agresivos ligados a las hormonas.

Beneficios para la comunidad: cada año hay millones de gatos callejeros en Argentina. Muchos nacen, viven y mueren en condiciones de sufrimiento. Cada gato esterilizado evita decenas de camadas no planificadas.

La edad ideal para esterilizar es entre los 4 y 6 meses, antes del primer celo en las hembras. La cirugía es rutinaria, con recuperación rápida (1-2 días) y los veterinarios la realizan con anestesia general de forma segura.`,
        author_name: 'Dra. Valentina Torres',
        created_at: '2026-06-03T09:00:00.000Z',
        image_url: px(1543793),
        category: 'salud',
        author_id: 2,
    },
    {
        id: 4,
        title: 'Entendiendo el comportamiento felino: señales que tu gato te manda',
        content: `Los gatos se comunican constantemente, pero en un idioma diferente al nuestro. Aprender a "leer" a tu gato mejora enormemente la relación y te ayuda a detectar problemas antes de que sean graves.

La cola: una cola levantada verticalmente es señal de saludo amistoso y confianza. Una cola inflada indica susto o agresión. Un movimiento lento de lado a lado puede indicar concentración o leve irritación; un movimiento rápido y agitado es señal de que está molesto o a punto de atacar.

Los ojos: el parpadeo lento es el "te quiero" felino. Si tu gato te mira y parpadea despacio, respondele de la misma manera —es la forma más simple de decirle que confía en vos. Las pupilas dilatadas pueden indicar excitación, miedo o enfermedad; las pupilas muy contraídas en luz baja también pueden ser señal de dolor.

Las orejas: orejas hacia adelante = alerta/interesado. Orejas achatadas hacia atrás = miedo o agresión. Una oreja para cada lado = escuchando múltiples cosas al mismo tiempo (o en modo "¿qué fue eso?").

El maullido: los gatos adultos casi no maúllan entre ellos —lo desarrollaron para comunicarse con humanos. Un maullido persistente puede indicar hambre, dolor, o en gatos no esterilizados, celo. Si tu gato maúlla de forma inusual, prestale atención.`,
        author_name: 'Lic. Carolina Ramos',
        created_at: '2026-06-10T11:00:00.000Z',
        image_url: px(2361952),
        category: 'comportamiento',
        author_id: 3,
    },
    {
        id: 5,
        title: 'Charla abierta: El proceso de adopción paso a paso',
        content: `Este sábado 5 de julio realizamos una charla abierta en el Centro Cultural del barrio para explicar cómo funciona nuestro proceso de adopción y responder todas las preguntas de la comunidad.

El proceso de adopción en Katze tiene 4 pasos:

1. Formulario online: completás un formulario con preguntas sobre tu estilo de vida, espacio disponible y experiencia previa con mascotas. Esto nos ayuda a encontrar la compatibilidad más adecuada, no a rechazar solicitantes.

2. Evaluación: nuestro equipo revisa el formulario y puede hacer preguntas adicionales. En algunos casos visitamos el hogar o pedimos referencias.

3. Encuentro con el gato: antes de la adopción definitiva, organizamos un encuentro para que el gato y su potencial familia se conozcan.

4. Seguimiento post-adopción: la adopción no termina el día que te llevás al gato. Hacemos seguimiento durante los primeros 6 meses para asegurarnos de que la adaptación vaya bien.

No cobramos por las adopciones, pero pedimos el compromiso de llevar al gato al veterinario para la revisación inicial y, si no está esterilizado, hacer el procedimiento dentro de los 60 días de adoptarlo.`,
        author_name: 'Equipo Katze',
        created_at: '2026-06-18T08:00:00.000Z',
        image_url: px(104827),
        category: 'adopcion',
        event_date: '2026-07-05T15:00:00.000Z',
        author_id: 1,
    },
    {
        id: 6,
        title: 'Primeros auxilios para gatos: qué hacer en emergencias',
        content: `Saber actuar rápido en una emergencia puede salvarle la vida a tu gato. Acá te dejamos una guía básica de primeros auxilios felinos.

Heridas y sangrado: si tu gato tiene una herida que sangra, aplicá presión con una gasa limpia. No uses alcohol ni agua oxigenada directamente en la herida. Si el sangrado no para en 5 minutos o la herida es profunda, ir al veterinario de urgencia.

Atragantamiento: si tu gato tiene dificultad para respirar, abrí su boca con cuidado y mirá si hay algo visible. Si podés verlo, retiralo con los dedos. No hagas movimientos bruscos que puedan empujar el objeto más adentro. Si no podés ver nada, ir al veterinario inmediatamente.

Intoxicación: si sospecháis que tu gato comió algo tóxico, no induzcas el vómito (a diferencia de los perros, esto puede ser peligroso en gatos). Llevalo al veterinario con toda la información posible sobre qué comió.

Caída de altura: aunque los gatos tienen el reflejo de caer parados, las caídas de menos de 3 pisos pueden ser más peligrosas que las de más altura (paradoja de los gatos). Siempre consultar al veterinario después de una caída importante.

Temperatura: un gato que no responde, tiene convulsiones o está muy frío al tacto necesita atención veterinaria inmediata. No intentes calentarlo con agua caliente.

Siempre tené a mano el número de un veterinario de guardia. La diferencia entre actuar en los primeros 30 minutos y esperar puede ser determinante.`,
        author_name: 'Dr. Matías Álvarez',
        created_at: '2026-06-25T13:00:00.000Z',
        image_url: px(1056251),
        category: 'salud',
        author_id: 2,
    },
];
