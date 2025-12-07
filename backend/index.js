// Archivo principal del servidor Express
// Configura rutas, middlewares y controladores para la aplicación Katze

// Cargar variables de entorno desde .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
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
app.use(cors({
    origin: true, // Permitir cualquier origen (refleja el origen de la solicitud)
    credentials: true
}));
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
app.use('/api/statistics', statisticsRoutes);        // Rutas de estadísticas (dashboard)
app.use('/api/users', userRoutes);                   // Rutas de usuarios y perfil
app.use('/api/admin', adminRoutes);                  // Rutas de administración (protegidas)

// Inicialización del servidor Express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});