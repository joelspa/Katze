import type { Cat } from '../components/CatCard';

// Only verified 200-status URLs
const U = (id: string) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=85`;
const P = (id: number) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

// Verified Unsplash cat IDs (all 200)
const UNSPLASH = {
    orange_tabby: U('1514888286974-6c03e2ca1dba'), // orange tabby looking at camera
    tabby_face:   U('1533738363-b7f9aef128ce'),     // tabby close-up face
    white_fluffy: U('1592194996308-7b43878e84a6'),  // white fluffy cat
    cat_portrait: U('1548802673-380ab8ebc7b7'),     // cat portrait neutral bg
    cat_couch:    U('1561948955-570b270e7c36'),     // cat on couch
    cat_window:   U('1526336024174-e58f5cdd8e13'), // cat by window
    gray_cat:     U('1560807707-8cc77767d783'),     // gray cat looking up
    cat_outdoor:  U('1573865526739-10659fec78a5'), // cat outdoor portrait
};

// Verified Pexels cat IDs (all 200)
const PEXELS = {
    white:    P(774731),   // white cat
    looking:  P(1170986),  // cat looking curious
    kitten:   P(1543793),  // small kitten
    tabby:    P(2361952),  // tabby sitting
    sitting:  P(1472999),  // cat sitting posed
    resting:  P(320014),   // cat resting/sleeping
    gray:     P(2173872),  // gray cat
    dark:     P(1560932),  // dark-coated cat
    closeup:  P(1056251),  // tabby closeup
    face:     P(617278),   // cat face portrait
    fluffy:   P(583842),   // fluffy cat
    tabby2:   P(2071873),  // second tabby
    kitten2:  P(3777598),  // orange kitten
    cat2:     P(2287808),  // cat neutral
    cat3:     P(3265460),  // cat another angle
    cat4:     P(4588052),  // fluffy another
    calico:   P(1482491),  // calico/mixed
    bw:       P(979247),   // black and white cat
    bw2:      P(2254098),  // another b&w
    black:    P(1404819),  // dark/black cat
};

export const MOCK_CATS: Cat[] = [
    {
        id: 1,
        name: 'Milo',
        age: 'cachorro',
        breed: 'Mestizo',
        description: 'Milo es un pequeño aventurero lleno de energía. Le encanta jugar con cualquier cosa que encuentre y es muy curioso. El compañero ideal para una familia activa.',
        story: 'Lo encontramos en una caja en la puerta de la veterinaria. Tenía apenas 3 semanas. Ya está recuperado, vacunado y listo para encontrar su hogar para siempre.',
        photos_url: [UNSPLASH.orange_tabby, PEXELS.kitten2, PEXELS.face],
        sterilization_status: 'pendiente',
        health_status: 'Saludable, vacunado',
        living_space_requirement: 'cualquiera',
    },
    {
        id: 2,
        name: 'Luna',
        age: 'adulto',
        breed: 'Angora',
        description: 'Luna es una gata elegante y tranquila. Prefiere los ambientes serenos y los mimos en el sillón. Perfecta para personas que buscan compañía sin tanto alboroto.',
        story: 'Su dueño anterior la entregó por alergia. Luna está acostumbrada a vivir en interior, es muy limpia y educada.',
        photos_url: [UNSPLASH.white_fluffy, PEXELS.white, PEXELS.sitting],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, vacunada, esterilizada',
        living_space_requirement: 'departamento',
    },
    {
        id: 3,
        name: 'Simba',
        age: 'joven',
        breed: 'Bengalí',
        description: 'Simba tiene la energía de un león pero el tamaño de un gato. Es juguetón, curioso y aprende trucos con facilidad. Necesita espacio y estimulación.',
        story: 'Rescatado de un criadero ilegal junto a otros 5 gatos. Ya está socializado y le encanta interactuar con personas.',
        photos_url: [UNSPLASH.tabby_face, PEXELS.tabby, PEXELS.closeup],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, vacunado, castrado',
        living_space_requirement: 'casa_grande',
    },
    {
        id: 4,
        name: 'Nube',
        age: 'adulto',
        breed: 'Persa',
        description: 'Nube es exactamente lo que su nombre sugiere: suave, tranquila y llena de paz. Le encanta estar cerca de las personas pero sin ser invasiva.',
        story: 'La encontramos en un balcón sin comida durante una semana. Está recuperada y lista para un hogar que la quiera.',
        photos_url: [UNSPLASH.cat_portrait, PEXELS.fluffy, PEXELS.resting],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, vacunada, esterilizada',
        living_space_requirement: 'departamento',
    },
    {
        id: 5,
        name: 'Tom',
        age: 'senior',
        breed: 'Mestizo',
        description: 'Tom tiene 9 años y todo el carácter de un gato sabio. Es tranquilo, no destruye nada y sabe perfectamente cómo pedir lo que quiere.',
        story: 'Su dueña falleció y no había nadie que pudiera quedarse con él. Tom merece pasar sus últimos años con amor.',
        photos_url: [UNSPLASH.cat_outdoor, PEXELS.gray, PEXELS.cat2],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, control veterinario anual al día',
        living_space_requirement: 'cualquiera',
    },
    {
        id: 6,
        name: 'Mochi',
        age: 'cachorro',
        breed: 'Siamés',
        description: 'Mochi es una gatita siamesa muy parlanchina. Te contará todo lo que piensa y no va a parar. Si querés compañía constante, Mochi es tu gata.',
        story: 'Rescatada junto a su mamá de una situación de abandono. Ya fue desparasitada y vacunada.',
        photos_url: [PEXELS.kitten, PEXELS.looking, UNSPLASH.gray_cat],
        sterilization_status: 'pendiente',
        health_status: 'Saludable, primera vacuna aplicada',
        living_space_requirement: 'departamento',
    },
    {
        id: 7,
        name: 'Oreo',
        age: 'joven',
        breed: 'Mestizo',
        description: 'Oreo es un gato bicolor con personalidad enorme. Es juguetón, afectuoso y se lleva bien con niños mayores de 8 años.',
        story: 'Lo rescatamos de la calle con una pata lastimada. Ya se recuperó al 100% y está listo para correr y jugar.',
        photos_url: [PEXELS.bw, UNSPLASH.gray_cat, PEXELS.bw2],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, castrado, vacunado',
        living_space_requirement: 'cualquiera',
    },
    {
        id: 8,
        name: 'Canela',
        age: 'adulto',
        breed: 'Abisinio',
        description: 'Canela tiene un pelaje color miel y una personalidad dulce que coincide con su nombre. Es activa pero sabe cuándo tranquilizarse para los mimos.',
        story: 'Vivía en una pensión que tuvo que cerrar. Está muy socializada y extraña tener un hogar estable.',
        photos_url: [UNSPLASH.cat_couch, PEXELS.calico, PEXELS.cat3],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, esterilizada, vacunada',
        living_space_requirement: 'casa_grande',
    },
    {
        id: 9,
        name: 'Zeus',
        age: 'senior',
        breed: 'Ragdoll',
        description: 'Zeus pesa 6 kilos de pura suavidad. Se queda laxo cuando lo alzás (es un Ragdoll verdadero) y ronronea sin parar. Ideal para departamentos tranquilos.',
        story: 'Su familia se mudó al exterior y no pudieron llevarlo. Zeus está acostumbrado a vivir cómodo y bien cuidado.',
        photos_url: [UNSPLASH.white_fluffy, UNSPLASH.cat_portrait, PEXELS.white],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, castrado, vacunado, chip',
        living_space_requirement: 'departamento',
    },
    {
        id: 10,
        name: 'Pizca',
        age: 'cachorro',
        breed: 'Mestizo',
        description: 'Pizca es la más pequeña de la camada pero tiene la personalidad más grande. Intrépida, juguetona y muy cariñosa con las personas.',
        story: 'Rescatada con sus 4 hermanos de debajo de un auto. Sus hermanos ya tienen hogares. Solo queda Pizca.',
        photos_url: [PEXELS.kitten, PEXELS.kitten2, PEXELS.looking],
        sterilization_status: 'pendiente',
        health_status: 'Saludable, vacunada',
        living_space_requirement: 'cualquiera',
    },
    {
        id: 11,
        name: 'Gris',
        age: 'adulto',
        breed: 'Ruso Azul',
        description: 'Gris tiene los ojos verdes más bonitos que vas a ver. Es reservado al principio pero cuando te gana la confianza es el más afectuoso del mundo.',
        story: 'Encontrado en el veterinario con una nota "no podemos quedarnos con él". Llegó asustado; ahora confía en las personas.',
        photos_url: [UNSPLASH.gray_cat, PEXELS.gray, PEXELS.cat4],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, castrado, vacunado',
        living_space_requirement: 'departamento',
    },
    {
        id: 12,
        name: 'Naranja',
        age: 'joven',
        breed: 'Mestizo',
        description: 'Naranja es curioso, travieso y con energía infinita. Necesita jugar al menos una hora por día. Te va a hacer reír todos los días.',
        story: 'Vivía en la calle del barrio y la comunidad lo fue criando. Ya está listo para dar el paso a un hogar definitivo.',
        photos_url: [UNSPLASH.orange_tabby, UNSPLASH.cat_window, PEXELS.tabby],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, castrado, vacunado',
        living_space_requirement: 'casa_grande',
    },
    {
        id: 13,
        name: 'Perla',
        age: 'adulto',
        breed: 'Persa',
        description: 'Perla es una gata de mirada dulce y carácter tranquilo. No araña muebles y adora los espacios luminosos. Una joya de compañera.',
        story: 'Su dueña se mudó a una residencia para adultos mayores que no admite mascotas. Perla llegó triste pero ya está recuperando su alegría.',
        photos_url: [UNSPLASH.white_fluffy, PEXELS.fluffy, UNSPLASH.cat_portrait],
        sterilization_status: 'esterilizado',
        health_status: 'Saludable, esterilizada, vacunada, chip',
        living_space_requirement: 'departamento',
    },
    {
        id: 14,
        name: 'Bongo',
        age: 'joven',
        breed: 'Mestizo',
        description: 'Bongo es un gato tabby explorador nato. Le gusta investigar cada rincón del hogar y no se asusta con nada. Ideal para casas activas.',
        story: 'Lo rescatamos de una obra en construcción donde había quedado atrapado. Después de una semana de cuidados, ya está perfecto.',
        photos_url: [UNSPLASH.tabby_face, PEXELS.tabby2, PEXELS.closeup],
        sterilization_status: 'pendiente',
        health_status: 'Saludable, primera vacuna aplicada',
        living_space_requirement: 'casa_grande',
    },
    {
        id: 15,
        name: 'Cielo',
        age: 'cachorro',
        breed: 'Siamés',
        description: 'Cielo tiene apenas 4 meses y ya robó el corazón de todos en el refugio. Ojos azules, pelaje claro y una ternura sin límites.',
        story: 'Apareció en el jardín de una vecina una mañana lluviosa. La vecina nos lo trajo enseguida. Está perfecto y listo para su familia.',
        photos_url: [PEXELS.kitten, UNSPLASH.white_fluffy, PEXELS.sitting],
        sterilization_status: 'pendiente',
        health_status: 'Saludable, primeras vacunas aplicadas',
        living_space_requirement: 'cualquiera',
    },
];
