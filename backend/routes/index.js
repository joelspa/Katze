// Archivo centralizador de rutas
// Exporta todas las rutas para facilitar la importación en index.js

const authRoutes = require('./authRoutes');
const catRoutes = require('./catRoutes');
const applicationRoutes = require('./applicationRoutes');
const trackingRoutes = require('./trackingRoutes');
const educationRoutes = require('./educationRoutes');

module.exports = {
    authRoutes,
    catRoutes,
    applicationRoutes,
    trackingRoutes,
    educationRoutes
};
