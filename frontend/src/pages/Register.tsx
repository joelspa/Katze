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
        <div className="container">
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="fullName" className="label">Nombre Completo</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="input"
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
                <div className="formGroup">
                    <label htmlFor="phone" className="label">Teléfono (opcional)</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="input"
                        onChange={handleChange}
                        placeholder="Ej: +569 1234 5678"
                    />
                    <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                        Tu teléfono será visible solo cuando tengas solicitudes de adopción
                    </small>
                </div>
                <div className="formGroup">
                    <label htmlFor="role" className="label">Quiero registrarme como:</label>
                    <select
                        id="role"
                        name="role"
                        className="input"
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
        </div>
    );
};

export default Register;