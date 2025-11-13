// Archivo centralizador de rutas
// Exporta todas las rutas para facilitar la importación en index.js

const authRoutes = require('./authRoutes');
const catRoutes = require('./catRoutes');
const applicationRoutes = require('./applicationRoutes');
const trackingRoutes = require('./trackingRoutes');
const educationRoutes = require('./educationRoutes');
const adminRoutes = require('./adminRoutes');
const storyRoutes = require('./storyRoutes');

module.exports = {
    authRoutes,
    catRoutes,
    applicationRoutes,
    trackingRoutes,
    educationRoutes,
    adminRoutes,
    storyRoutes
};
