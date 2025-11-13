// Archivo principal del servidor Express
// Configura rutas, middlewares y controladores para la aplicación Katze

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

// Importación centralizada de rutas
const {
    authRoutes,
    catRoutes,
    applicationRoutes,
    trackingRoutes,
    educationRoutes,
    adminRoutes,
    statisticsRoutes,
    userRoutes
} = require('./routes');

const app = express();

// Configuración de middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta de verificación del estado del servidor
app.get('/api', (req, res) => {
    res.send('¡El backend de Katze está funcionando!');
});

// Configuración de rutas modulares
app.use('/api/auth', authRoutes);                    // Rutas de autenticación
app.use('/api/cats', catRoutes);                     // Rutas de gatos
app.use('/api', applicationRoutes);                  // Rutas de solicitudes de adopción
app.use('/api/applications', applicationRoutes);     // Rutas alternativas para solicitudes
app.use('/api/tracking', trackingRoutes);            // Rutas de seguimiento
app.use('/api/education', educationRoutes);          // Rutas del módulo educativo
app.use('/api/statistics', statisticsRoutes);        // Rutas de estadísticas (dashboard)
app.use('/api/admin/users', userRoutes);             // Rutas de gestión de usuarios (ANTES de /api/admin)
app.use('/api/admin', adminRoutes);                  // Rutas de administración (protegidas)

// Inicialización del servidor Express
app.listen(config.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
});