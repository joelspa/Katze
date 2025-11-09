// backend/middleware/moderationMiddleware.js

// Lista de palabras clave que activan la "Bandera Roja" 
// Esto es para cumplir con la meta anti-venta y pro-esterilización [cite: 8]
const RED_FLAG_KEYWORDS = [
    'vendo', 'venta', 'precio', 'compro', 'comprar', 'negociable',
    'raza', 'puro', 'pedigree',
    'no esterilizar', 'sin esterilizar', 'anti-esterilización',
    'regalo', 'monetario', 'costo'
];

module.exports = (req, res, next) => {
    const { name, description } = req.body;

    // Combinamos el texto para revisarlo todo de una vez
    const content = (name + ' ' + description).toLowerCase();

    let foundRedFlag = false;

    for (const keyword of RED_FLAG_KEYWORDS) {
        if (content.includes(keyword)) {
            foundRedFlag = true;
            break; // Encontramos una, no es necesario seguir
        }
    }

    if (foundRedFlag) {
        // ¡Bandera Roja!  La publicación va a revisión manual.
        // Añadimos el estado al 'req' para que el controlador lo use.
        req.approval_status = 'pendiente';
        console.log('MODERADOR: ¡Bandera Roja! Publicación enviada a revisión manual.');
    } else {
        // El texto es benigno, se aprueba automáticamente [cite: 22]
        req.approval_status = 'aprobado';
        console.log('MODERADOR: Publicación benigna, aprobada automáticamente.');
    }

    next(); // Pasa al siguiente middleware (el controlador)
};