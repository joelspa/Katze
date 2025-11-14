// Página de registro de usuarios
// Permite a nuevos usuarios crear una cuenta como adoptante o rescatista

import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'adoptante',
        phone: '',
    });
    
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const API_URL = 'http://localhost:5000/api/auth/register';
            const response = await axios.post(API_URL, formData);
            console.log('¡Usuario registrado!', response.data);
            alert('¡Registro exitoso!');

        } catch (error: unknown) {
            // Manejo seguro de errores con verificación de tipo
            let errorMessage = 'Ocurrió un error desconocido';

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error('Error en el registro:', errorMessage);
            alert('Error en el registro: ' + errorMessage);
        }
    };

    return (
        <div className="register-page">
            <div className="container">
                <div className="logo-section">
                    <div className="logo-icon">K</div>
                    <h1 className="logo-text">AdoptaUnGato</h1>
                </div>
                
                <h2>Registro de Usuario</h2>
                <p className="subtitle">Crea una cuenta para empezar a encontrar tu nuevo amigo felino.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="fullName" className="label">Nombre Completo</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="input"
                            placeholder="Ingresa tu nombre completo"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="formGroup">
                        <label htmlFor="email" className="label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="input"
                            placeholder="Ingresa tu correo electrónico"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="formGroup">
                        <label htmlFor="password" className="label">Contraseña</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className="input"
                                placeholder="Crea una contraseña segura"
                                onChange={handleChange}
                                required
                            />
                            <button 
                                type="button"
                                className="show-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '○' : '●'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="formGroup">
                        <label htmlFor="role" className="label">Quiero registrarme como:</label>
                        <select
                            id="role"
                            name="role"
                            className="select"
                            onChange={handleChange}
                            value={formData.role}
                        >
                            <option value="adoptante">Adoptante</option>
                            <option value="rescatista">Rescatista</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="button">
                        Registrarse
                    </button>
                </form>
                
                <div className="login-link">
                    ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                </div>
            </div>
        </div>
    );
};

export default Register;