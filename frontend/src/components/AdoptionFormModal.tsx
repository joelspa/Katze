// Componente de modal para formulario de adopción
// Permite a los adoptantes enviar solicitudes de adopción

import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { validateMinLength, FormValidator } from '../utils/validation';
import './AdoptionFormModal.css';

interface AdoptionFormModalProps {
    catId: string;
    catName: string;
    onClose: () => void;
}

const AdoptionFormModal: React.FC<AdoptionFormModalProps> = ({ catId, catName, onClose }) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        hasExperience: false,
        hasSpace: false,
        hasTime: false,
        acceptsSterilization: false,
        acceptsFollowUp: false,
        reason: '',
        livingSpace: 'casa',
        hasOtherPets: false,
        otherPetsDetails: ''
    });
    
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validator] = useState(() => new FormValidator());
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const { token } = useAuth();

    // Valida campos requeridos del formulario sin modificar estado
    const checkFormValid = () => {
        // Validar razón (mínimo 20 caracteres)
        if (formData.reason.length < 20) {
            return false;
        }
        
        // Validar aceptación de esterilización
        if (!formData.acceptsSterilization) {
            return false;
        }
        
        // Validar aceptación de seguimiento
        if (!formData.acceptsFollowUp) {
            return false;
        }
        
        return true;
    };

    // Valida campos requeridos del formulario y actualiza errores
    const isFormValid = () => {
        validator.clearAllErrors();
        const errors: Record<string, string> = {};
        
        // Validar razón (mínimo 20 caracteres)
        const reasonResult = validateMinLength(formData.reason, 20, 'Tu motivación');
        if (!reasonResult.isValid && reasonResult.error) {
            errors.reason = reasonResult.error;
            validator.addError('reason', reasonResult.error);
        }
        
        // Validar aceptación de esterilización
        if (!formData.acceptsSterilization) {
            errors.sterilization = 'Debes aceptar el compromiso de esterilización';
            validator.addError('sterilization', errors.sterilization);
        }
        
        // Validar aceptación de seguimiento
        if (!formData.acceptsFollowUp) {
            errors.followUp = 'Debes aceptar el seguimiento post-adopción';
            validator.addError('followUp', errors.followUp);
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Envía solicitud de adopción al backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            setError('Por favor completa todos los campos requeridos:\n' + validator.getAllErrors().join('\n'));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        // Prepara el objeto de respuestas del formulario en formato JSONB
        const formResponses = {
            whyAdopt: formData.reason,
            hasExperience: formData.hasExperience,
            hasSpace: formData.hasSpace,
            hasTime: formData.hasTime,
            livingSpace: formData.livingSpace,
            hasOtherPets: formData.hasOtherPets,
            otherPetsDetails: formData.otherPetsDetails,
            acceptsSterilization: formData.acceptsSterilization,
            acceptsFollowUp: formData.acceptsFollowUp,
            submittedAt: new Date().toISOString()
        };

        try {
            const API_URL = `${API_BASE_URL}/api/cats/${catId}/apply`;

            // Envía la solicitud con el token de autenticación
            await axios.post(
                API_URL,
                { form_responses: formResponses },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Obtiene información de contacto del rescatista
            try {
                const contactResponse = await axios.get(
                    `${API_BASE_URL}/api/cats/${catId}/owner-contact`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                const contact = contactResponse.data.data.contact;
                let contactMessage = `\n\nInformación de contacto del rescatista:\n\nNombre: ${contact.full_name}\nEmail: ${contact.email}`;
                
                if (contact.phone) {
                    contactMessage += `\nTeléfono: ${contact.phone}`;
                }

                alert('¡Solicitud enviada con éxito!' + contactMessage);
            } catch {
                // Si no se puede obtener el contacto, mostrar mensaje básico
                alert('¡Solicitud enviada con éxito! El rescatista te contactará.');
            }

            onClose();

        } catch (error: unknown) {
            let errorMessage = 'Error al enviar la solicitud';
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
            }
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content adoption-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                    &times;
                </button>
                
                <div className="modal-header">
                    <h2>Solicitud para Adoptar a {catName}</h2>
                    <p className="modal-subtitle">
                        ¡Estamos muy felices por tu interés en {catName}!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="adoption-form">
                    
                    {error && (
                        <div className="error-banner">
                            <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '8px'}}>
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span style={{whiteSpace: 'pre-line'}}>{error}</span>
                        </div>
                    )}
                    
                    {/* Pregunta principal */}
                    <div className="form-section">
                        <h3 className="section-title">Cuéntanos por qué eres el hogar perfecto para {catName} *</h3>
                        
                        <div className="form-group">
                            <textarea
                                className={`form-textarea ${fieldErrors.reason ? 'input-error' : ''}`}
                                rows={6}
                                placeholder={`Describe tu hogar, tu experiencia con mascotas y qué te atrajo de ${catName}...`}
                                value={formData.reason}
                                onChange={(e) => {
                                    setFormData({...formData, reason: e.target.value});
                                    if (fieldErrors.reason) {
                                        const newErrors = { ...fieldErrors };
                                        delete newErrors.reason;
                                        setFieldErrors(newErrors);
                                    }
                                }}
                                required
                                minLength={20}
                            />
                            {fieldErrors.reason && (
                                <span className="error-message">⚠️ {fieldErrors.reason}</span>
                            )}
                            <small className="form-hint">
                                {formData.reason.length}/20 caracteres mínimo
                            </small>
                        </div>
                    </div>
                    <div className="form-section">
                        <h3 className="section-title">Tu Hogar</h3>
                        
                        <div className="form-group">
                            <label className="form-label">Tipo de vivienda:</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="livingSpace"
                                        value="casa"
                                        checked={formData.livingSpace === 'casa'}
                                        onChange={(e) => setFormData({...formData, livingSpace: e.target.value})}
                                    />
                                    <span>Casa</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="livingSpace"
                                        value="apartamento"
                                        checked={formData.livingSpace === 'apartamento'}
                                        onChange={(e) => setFormData({...formData, livingSpace: e.target.value})}
                                    />
                                    <span>Apartamento</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="livingSpace"
                                        value="otro"
                                        checked={formData.livingSpace === 'otro'}
                                        onChange={(e) => setFormData({...formData, livingSpace: e.target.value})}
                                    />
                                    <span>Otro</span>
                                </label>
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.hasSpace}
                                    onChange={(e) => setFormData({...formData, hasSpace: e.target.checked})}
                                />
                                <span>Tengo espacio suficiente para el gato</span>
                            </label>
                        </div>
                    </div>

                    {/* Sección 2: Experiencia */}
                    <div className="form-section">
                        <h3 className="section-title">Experiencia con Mascotas</h3>
                        
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.hasExperience}
                                    onChange={(e) => setFormData({...formData, hasExperience: e.target.checked})}
                                />
                                <span>He tenido o tengo experiencia cuidando gatos</span>
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.hasOtherPets}
                                    onChange={(e) => setFormData({...formData, hasOtherPets: e.target.checked})}
                                />
                                <span>Tengo otras mascotas en casa</span>
                            </label>
                        </div>

                        {formData.hasOtherPets && (
                            <div className="form-group">
                                <label className="form-label">¿Qué otras mascotas tienes?</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ej: 1 perro, 2 gatos"
                                    value={formData.otherPetsDetails}
                                    onChange={(e) => setFormData({...formData, otherPetsDetails: e.target.value})}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sección 3: Disponibilidad */}
                    <div className="form-section">
                        <h3 className="section-title">
                            <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}>
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Disponibilidad
                        </h3>
                        
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.hasTime}
                                    onChange={(e) => setFormData({...formData, hasTime: e.target.checked})}
                                />
                                <span>Tengo tiempo disponible para cuidar del gato</span>
                            </label>
                        </div>
                    </div>

                    {/* Sección 5: Compromisos (REQUERIDO) */}
                    <div className="form-section commitments-section">
                        <h3 className="section-title">Compromisos Importantes</h3>
                        
                        <div className="checkbox-group required-group">
                            <label className="checkbox-label required-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.acceptsSterilization}
                                    onChange={(e) => setFormData({...formData, acceptsSterilization: e.target.checked})}
                                    required
                                />
                                <span>
                                    <strong>Acepto esterilizar al gato</strong> si aún no lo está, 
                                    en el tiempo recomendado por el veterinario <span className="required">*</span>
                                </span>
                            </label>

                            <label className="checkbox-label required-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.acceptsFollowUp}
                                    onChange={(e) => setFormData({...formData, acceptsFollowUp: e.target.checked})}
                                    required
                                />
                                <span>
                                    <strong>Acepto seguimiento</strong> por parte del rescatista para 
                                    verificar el bienestar del gato <span className="required">*</span>
                                </span>
                            </label>
                        </div>

                        <div className="info-box">
                            <p>
                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle'}}>
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <strong>Importante:</strong> La adopción es un compromiso a largo plazo. 
                                Asegúrate de estar preparado para cuidar del gato durante toda su vida (15-20 años).
                            </p>
                        </div>
                    </div>

                    {/* Mensajes de error */}
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-outline" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={isSubmitting || !checkFormValid()}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdoptionFormModal;