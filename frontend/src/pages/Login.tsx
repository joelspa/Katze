// Página de inicio de sesión
// Permite a los usuarios autenticarse en el sistema

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../hooks/useModal';
import CustomModal from '../components/CustomModal';
import Footer from '../components/Footer';
import { validateEmail, validateRequired, FormValidator } from '../utils/validation';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const { modalState, showAlert, closeModal } = useModal();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [validator] = useState(() => new FormValidator());
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Limpiar error cuando el usuario escribe
        if (fieldErrors[name]) {
            const newErrors = { ...fieldErrors };
            delete newErrors[name];
            setFieldErrors(newErrors);
            validator.clearError(name);
        }
    };
    
    const validateForm = (): boolean => {
        validator.clearAllErrors();
        const errors: Record<string, string> = {};
        
        const emailResult = validateEmail(formData.email);
        if (!emailResult.isValid && emailResult.error) {
            errors.email = emailResult.error;
            validator.addError('email', emailResult.error);
        }
        
        const passwordResult = validateRequired(formData.password, 'Contraseña');
        if (!passwordResult.isValid && passwordResult.error) {
            errors.password = passwordResult.error;
            validator.addError('password', passwordResult.error);
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            await showAlert(
                'Por favor corrige los errores en el formulario:\n\n' + 
                validator.getAllErrors().join('\n'),
                'Errores de Validación'
            );
            return;
        }
        
        setLoading(true);
        
        try {
            const API_URL = `${API_BASE_URL}/api/auth/login`;
            const response = await axios.post(API_URL, formData);

            const responseData = response.data.data || response.data;
            const { token, user } = responseData;

            if (!token || !user) {
                setLoading(false);
                throw new Error('Respuesta del servidor incompleta');
            }

            login(user, token);

            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'rescatista') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }

        } catch (error: unknown) {
            setLoading(false);
            
            let errorMessage = 'Ocurrió un error desconocido';
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Credenciales inválidas';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            await showAlert(errorMessage, 'Error de Autenticación');
        }
    };

    return (
        <div className="login-page">
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Iniciando sesión...</p>
                    </div>
                </div>
            )}
            <div className="container">
                <div className="logo-section">
                    <div className="logo-icon">K</div>
                    <h1 className="logo-text">GatoAdopta</h1>
                </div>
                
                <h2>Iniciar Sesión</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="email" className="label">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                            placeholder="ejemplo@correo.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {fieldErrors.email && (
                            <span className="error-message">⚠️ {fieldErrors.email}</span>
                        )}
                    </div>
                    
                    <div className="formGroup">
                        <label htmlFor="password" className="label">Contraseña *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`input ${fieldErrors.password ? 'input-error' : ''}`}
                            placeholder="Ingresa tu contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {fieldErrors.password && (
                            <span className="error-message">⚠️ {fieldErrors.password}</span>
                        )}
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

export default Login;