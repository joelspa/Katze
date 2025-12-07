// Página de registro de usuarios
// Permite a nuevos usuarios crear una cuenta como adoptante o rescatista

import React, { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import API_BASE_URL from '../config/api';
import { useModal } from '../hooks/useModal';
import CustomModal from '../components/CustomModal';
import Footer from '../components/Footer';
import './Register.css';

const Register = () => {
    const { modalState, showAlert, closeModal } = useModal();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'adoptante',
        phone: '',
    });
    
    const [showPassword, setShowPassword] = useState(false);

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const API_URL = `${API_BASE_URL}/api/auth/register`;
            await axios.post(API_URL, formData);
            await showAlert('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.', 'Registro Completado');

        } catch (error: unknown) {
            // Manejo seguro de errores con verificación de tipo
            let errorMessage = 'Ocurrió un error desconocido';

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error('Error en el registro:', errorMessage);
            await showAlert('Error en el registro: ' + errorMessage, 'Error de Registro');
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
                
                <div className="info-box">
                    <strong>
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle'}}>
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Nota importante:
                    </strong>
                    <p>El registro público es solo para adoptantes. Si deseas ser rescatista, contacta a un administrador para que te registre en el sistema.</p>
                </div>
                
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
                    
                    {/* El rol siempre será adoptante en registro público */}
                    <input type="hidden" name="role" value="adoptante" />
                    
                    <button type="submit" className="button">
                        Registrarse
                    </button>
                </form>
                
                <div className="login-link">
                    ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                </div>
            </div>

            <CustomModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                onConfirm={modalState.onConfirm}
                onCancel={modalState.onCancel}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
            />

            <Footer />
        </div>
    );
};

export default Register;