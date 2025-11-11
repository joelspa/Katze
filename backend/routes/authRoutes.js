// Rutas de autenticación
// Gestiona endpoints públicos de registro y login

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro de nuevo usuario
router.post('/register', authController.register);

// Inicio de sesión
router.post('/login', authController.login);

module.exports = router;
