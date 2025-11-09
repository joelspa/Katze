// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const API_URL = 'http://localhost:5000/api/auth/login';
            const response = await axios.post(API_URL, formData);

            const { token, user } = response.data;

            // 1. Guardamos el usuario y el token en el contexto
            login(user, token);

            // 2. Lógica de Redirección Basada en Rol
            if (user.role === 'rescatista' || user.role === 'admin') {
                alert('¡Login exitoso! Serás redirigido a tu panel.');
                navigate('/dashboard');
            } else {
                alert('¡Login exitoso! Serás redirigido al inicio.');
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
        <div className="container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="email" className="label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="input"
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
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="button">
                    Ingresar
                </button>
            </form>
        </div>
    );
};

export default Login;