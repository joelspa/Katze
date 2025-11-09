// backend/index.js
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/authController');
const catController = require('./controllers/catController');
const applicationController = require('./controllers/applicationController');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = 5000;

// --- Middlewares ---
app.use(express.json());
app.use(cors());

// --- Rutas ---
app.get('/api', (req, res) => {
    res.send('¡El backend de Katze está funcionando!');
});

// --- Rutas de Autenticación (Públicas) ---
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login); // <-- Nueva ruta de login

// --- Rutas de Gatos (Públicas y Protegidas) ---
app.post('/api/cats', authMiddleware, catController.createCat); // Protegida
app.get('/api/cats', catController.getAllCats);                 // Pública
app.get('/api/cats/:id', catController.getCatById);             // Pública

// --- Rutas de Solicitudes de Adopción (Protegidas) ---
app.post('/api/cats/:id/adopt', authMiddleware, applicationController.applyForCat);
app.post('/api/cats/:id/apply', authMiddleware, applicationController.applyForCat);

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});