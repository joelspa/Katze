// Página de registro de usuarios
// Permite a nuevos usuarios crear una cuenta como adoptante o rescatista

import React, { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import API_BASE_URL from '../config/api';
import { useModal } from '../hooks/useModal';
import CustomModal from '../components/CustomModal';
import Footer from '../components/Footer';
import { 
    validateEmail, 
    validatePassword, 
    validatePhone, 
    validateFullName,
    FormValidator
} from '../utils/validation';
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
    const [validator] = useState(() => new FormValidator());
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Limpiar error del campo cuando el usuario empieza a escribir
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
        
        // Validar nombre completo
        const nameResult = validateFullName(formData.fullName);
        if (!nameResult.isValid && nameResult.error) {
            errors.fullName = nameResult.error;
            validator.addError('fullName', nameResult.error);
        }
        
        // Validar email
        const emailResult = validateEmail(formData.email);
        if (!emailResult.isValid && emailResult.error) {
            errors.email = emailResult.error;
            validator.addError('email', emailResult.error);
        }
        
        // Validar teléfono
        const phoneResult = validatePhone(formData.phone);
        if (!phoneResult.isValid && phoneResult.error) {
            errors.phone = phoneResult.error;
            validator.addError('phone', phoneResult.error);
        }
        
        // Validar contraseña
        const passwordResult = validatePassword(formData.password);
        if (!passwordResult.isValid && passwordResult.error) {
            errors.password = passwordResult.error;
            validator.addError('password', passwordResult.error);
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar formulario antes de enviar
        if (!validateForm()) {
            await showAlert(
                'Por favor corrige los errores en el formulario:\n\n' + 
                validator.getAllErrors().join('\n'), 
                'Errores de Validación'
            );
            return;
        }
        
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
                        <label htmlFor="fullName" className="label">Nombre Completo *</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className={`input ${fieldErrors.fullName ? 'input-error' : ''}`}
                            placeholder="Ingresa tu nombre y apellido"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        {fieldErrors.fullName && (
                            <span className="error-message">⚠️ {fieldErrors.fullName}</span>
                        )}
                    </div>
                    
                    <div className="formGroup">
                        <label htmlFor="email" className="label">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                            placeholder="usuario@ejemplo.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {fieldErrors.email && (
                            <span className="error-message">⚠️ {fieldErrors.email}</span>
                        )}
                    </div>

                    <div className="formGroup">
                        <label htmlFor="phone" className="label">Teléfono *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className={`input ${fieldErrors.phone ? 'input-error' : ''}`}
                            placeholder="Solo números (ej: 3121234567)"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        {fieldErrors.phone && (
                            <span className="error-message">⚠️ {fieldErrors.phone}</span>
                        )}
                        <small style={{color: '#666', fontSize: '0.85em', marginTop: '4px', display: 'block'}}>
                            Ingresa solo números, entre 7 y 15 dígitos
                        </small>
                    </div>
                    
                    <div className="formGroup">
                        <label htmlFor="password" className="label">Contraseña *</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className={`input ${fieldErrors.password ? 'input-error' : ''}`}
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
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
                        {fieldErrors.password && (
                            <span className="error-message">⚠️ {fieldErrors.password}</span>
                        )}
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