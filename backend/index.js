// Archivo principal del servidor Express
// Configura rutas, middlewares y controladores para la aplicación Katze

const express = require('express');
const cors = require('cors');
const config = require('./config/config');

// Importación centralizada de rutas
const {
    authRoutes,
    catRoutes,
    applicationRoutes,
    trackingRoutes,
    educationRoutes
} = require('./routes');

const app = express();

// Configuración de middlewares globales
app.use(cors());
app.use(express.json());

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

// Inicialización del servidor Express
app.listen(config.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
});