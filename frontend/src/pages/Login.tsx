// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Importa el CSS

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

            // ¡Aquí está la magia!
            const { token, user } = response.data;

            console.log('¡Login exitoso!');
            console.log('Token:', token);
            console.log('Usuario:', user);

            // Guarda el token y usuario en el contexto (y localStorage)
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