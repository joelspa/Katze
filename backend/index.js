// backend/index.js
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/authController');

const app = express();
const PORT = 5000; // El puerto para tu backend

// --- Middlewares ---
// Para poder recibir JSONs desde el frontend
app.use(express.json());
// Para permitir que React (que corre en otro puerto) hable con tu backend
app.use(cors());

// --- Rutas ---
app.get('/api', (req, res) => {
    res.send('¡El backend de Katze está funcionando!');
});

// Esta es tu primera ruta de API
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login); // <-- Nueva ruta de login

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});