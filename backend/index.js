// backend/index.js
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/authController');
const catController = require('./controllers/catController');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = 5000; // El puerto para tu backend

// --- Middlewares ---
app.use(express.json());
app.use(cors());

// --- Rutas ---
app.get('/api', (req, res) => {
    res.send('¡El backend de Katze está funcionando!');
});

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login); // <-- Nueva ruta de login

// --- Rutas de Gatos (Protegidas) ---
app.post('/api/cats', authMiddleware, catController.createCat);

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});