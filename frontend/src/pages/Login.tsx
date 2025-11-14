// Página de inicio de sesión
// Permite a los usuarios autenticarse en el sistema

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const API_URL = 'http://localhost:5000/api/auth/login';
            const response = await axios.post(API_URL, formData);

            console.log('Respuesta completa:', response.data);

            // El backend devuelve { success: true, data: { token, user } }
            const responseData = response.data.data || response.data;
            const { token, user } = responseData;

            console.log('¡Login exitoso!');
            console.log('Token:', token);
            console.log('Usuario:', user);

            // Valida que tengamos los datos necesarios
            if (!token || !user) {
                throw new Error('Respuesta del servidor incompleta');
            }

            // Guarda el token y usuario en el contexto y localStorage
            login(user, token);

            alert('¡Login exitoso!');

            // Redirige según el rol del usuario
            if (user.role === 'rescatista' || user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }

        } catch (error: unknown) {
            let errorMessage = 'Ocurrió un error desconocido';
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error('Error en el login:', errorMessage);
            alert('Error en el login: ' + errorMessage);
        }
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="logo-section">
                    <div className="logo-icon">K</div>
                    <h1 className="logo-text">GatoAdopta</h1>
                </div>
                
                <h2>Iniciar Sesión</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="email" className="label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="input"
                            placeholder="ejemplo@correo.com"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="formGroup">
                        <label htmlFor="password" className="label">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="input"
                            placeholder="Ingresa tu contraseña"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="forgot-password">
                        <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>
                    
                    <button type="submit" className="button">
                        Ingresar
                    </button>
                </form>
                
                <div className="register-link">
                    ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
                </div>
            </div>
        </div>
    );
};

export default Login;