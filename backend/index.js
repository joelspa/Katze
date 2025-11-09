// backend/index.js
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/authController');
const catController = require('./controllers/catController');
const applicationController = require('./controllers/applicationController');
const trackingController = require('./controllers/trackingController');
const authMiddleware = require('./middleware/authMiddleware');
const moderationMiddleware = require('./middleware/moderationMiddleware');

const app = express();
const PORT = 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Rutas ---
app.get('/api', (req, res) => {
    res.send('¡El backend de Katze está funcionando!');
});

// --- Rutas de Autenticación (Públicas) ---
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login); // <-- Nueva ruta de login

// --- Rutas de Gatos (Públicas y Protegidas) ---
app.post('/api/cats', authMiddleware, moderationMiddleware, catController.createCat);   // Protegida
app.get('/api/cats', catController.getAllCats);                                         // Pública
app.get('/api/cats/:id', catController.getCatById);                                     // Pública

// --- Rutas de Solicitudes de Adopción (Protegidas) ---
app.post('/api/cats/:id/adopt', authMiddleware, applicationController.applyForCat);
app.post('/api/cats/:id/apply', authMiddleware, applicationController.applyForCat);

// (NUEVA) Ver solicitudes recibidas (para rescatistas)
app.get('/api/applications/received', authMiddleware, applicationController.getReceivedApplications);
// (NUEVA) Actualizar estado de una solicitud (para rescatistas/admin)
app.put('/api/applications/:id/status', authMiddleware, applicationController.updateApplicationStatus);

// --- Rutas de Seguimiento (Protegidas) ---
// (NUEVA) Ver todas las tareas de seguimiento pendientes
app.get('/api/tracking', authMiddleware, trackingController.getPendingTasks);
// (NUEVA) Completar una tarea de seguimiento
app.put('/api/tracking/:id/complete', authMiddleware, trackingController.completeTask);

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});