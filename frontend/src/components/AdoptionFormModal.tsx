// Componente de modal para formulario de adopción
// Permite a los adoptantes enviar solicitudes de adopción

import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
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

    const { token } = useAuth();

    // Valida que todos los campos requeridos estén completos
    const isFormValid = () => {
        return formData.acceptsSterilization && 
               formData.acceptsFollowUp && 
               formData.reason.trim().length >= 20;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            setError('Por favor completa todos los campos requeridos');
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
            const API_URL = `http://localhost:5000/api/cats/${catId}/apply`;

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
                    `http://localhost:5000/api/cats/${catId}/owner-contact`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                const contact = contactResponse.data.data.contact;
                let contactMessage = `\n\n📞 Información de contacto del rescatista:\n\nNombre: ${contact.full_name}\nEmail: ${contact.email}`;
                
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
            console.error(errorMessage);
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
                    <h2>Solicitud de Adopción</h2>
                    <p className="modal-subtitle">
                        🐱 Quiero adoptar a <strong>{catName}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="adoption-form">
                    
                    {/* Sección 1: Información del Hogar */}
                    <div className="form-section">
                        <h3 className="section-title">📍 Tu Hogar</h3>
                        
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
                                    <span>🏠 Casa</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="livingSpace"
                                        value="apartamento"
                                        checked={formData.livingSpace === 'apartamento'}
                                        onChange={(e) => setFormData({...formData, livingSpace: e.target.value})}
                                    />
                                    <span>🏢 Apartamento</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="livingSpace"
                                        value="otro"
                                        checked={formData.livingSpace === 'otro'}
                                        onChange={(e) => setFormData({...formData, livingSpace: e.target.value})}
                                    />
                                    <span>🏘️ Otro</span>
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
                                <span>✅ Tengo espacio suficiente para el gato</span>
                            </label>
                        </div>
                    </div>

                    {/* Sección 2: Experiencia */}
                    <div className="form-section">
                        <h3 className="section-title">🎓 Experiencia con Mascotas</h3>
                        
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
                        <h3 className="section-title">⏰ Disponibilidad</h3>
                        
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.hasTime}
                                    onChange={(e) => setFormData({...formData, hasTime: e.target.checked})}
                                />
                                <span>✅ Tengo tiempo disponible para cuidar del gato</span>
                            </label>
                        </div>
                    </div>

                    {/* Sección 4: Motivación */}
                    <div className="form-section">
                        <h3 className="section-title">💭 ¿Por qué quieres adoptar?</h3>
                        
                        <div className="form-group">
                            <label className="form-label">
                                Cuéntanos sobre ti y por qué {catName} sería perfecto para tu familia 
                                <span className="required">*</span>
                            </label>
                            <textarea
                                className="form-textarea"
                                rows={4}
                                placeholder="Háblanos sobre tu hogar, tu estilo de vida, experiencia con gatos, y por qué quieres adoptar..."
                                value={formData.reason}
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                required
                                minLength={20}
                            />
                            <small className="form-hint">
                                {formData.reason.length}/20 caracteres mínimo
                            </small>
                        </div>
                    </div>

                    {/* Sección 5: Compromisos (REQUERIDO) */}
                    <div className="form-section commitments-section">
                        <h3 className="section-title">📋 Compromisos Importantes</h3>
                        
                        <div className="checkbox-group required-group">
                            <label className="checkbox-label required-checkbox">
                                <input
                                    type="checkbox"
                                    checked={formData.acceptsSterilization}
                                    onChange={(e) => setFormData({...formData, acceptsSterilization: e.target.checked})}
                                    required
                                />
                                <span>
                                    <strong>✓ Acepto esterilizar al gato</strong> si aún no lo está, 
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
                                    <strong>✓ Acepto seguimiento</strong> por parte del rescatista para 
                                    verificar el bienestar del gato <span className="required">*</span>
                                </span>
                            </label>
                        </div>

                        <div className="info-box">
                            <p>
                                ℹ️ <strong>Importante:</strong> La adopción es un compromiso a largo plazo. 
                                Asegúrate de estar preparado para cuidar del gato durante toda su vida (15-20 años).
                            </p>
                        </div>
                    </div>

                    {/* Mensajes de error */}
                    {error && (
                        <div className="alert alert-error">
                            ⚠️ {error}
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
                            disabled={isSubmitting || !isFormValid()}
                        >
                            {isSubmitting ? '📤 Enviando...' : '💌 Enviar Solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdoptionFormModal;