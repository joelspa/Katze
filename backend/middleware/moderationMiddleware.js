// Middleware de moderación automática
// Detecta palabras clave problemáticas en publicaciones de gatos para prevenir ventas y promover esterilización

const config = require('../config/config');

// Lista de palabras clave que activan revisión manual
const RED_FLAG_KEYWORDS = [
    'vendo', 'venta', 'precio', 'compro', 'comprar', 'negociable',
    'raza', 'puro', 'pedigree',
    'no esterilizar', 'sin esterilizar', 'anti-esterilización',
    'regalo', 'monetario', 'costo'
];

module.exports = (req, res, next) => {
    const { name, description } = req.body;

    // Combina nombre y descripción para análisis de contenido
    const content = (name + ' ' + description).toLowerCase();

    let foundRedFlag = false;

    // Busca palabras clave problemáticas en el contenido
    for (const keyword of RED_FLAG_KEYWORDS) {
        if (content.includes(keyword)) {
            foundRedFlag = true;
            break;
        }
    }

    if (foundRedFlag) {
        // Marca la publicación para revisión manual
        req.approval_status = config.APPROVAL_STATUS.PENDIENTE;
        console.log('MODERADOR: ¡Bandera Roja! Publicación enviada a revisión manual.');
    } else {
        // Aprueba la publicación automáticamente
        req.approval_status = config.APPROVAL_STATUS.APROBADO;
        console.log('MODERADOR: Publicación benigna, aprobada automáticamente.');
    }

    next();
};