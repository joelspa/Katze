// frontend/src/components/AdoptionFormModal.tsx
import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdoptionFormModal.css'; // Crearemos este CSS

interface AdoptionFormModalProps {
    catId: string;
    catName: string;
    onClose: () => void; // Función para cerrar el modal
}

const AdoptionFormModal: React.FC<AdoptionFormModalProps> = ({ catId, catName, onClose }) => {
    const [reason, setReason] = useState(''); // Respuesta del formulario
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { token } = useAuth(); // ¡Obtenemos el token del usuario logueado!

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Preparamos el JSONB para el backend
        const formResponses = {
            whyAdopt: reason,
            sterilizationPolicy: "Acepto la política de esterilización (leído en el formulario)",
        };

        try {
            const API_URL = `http://localhost:5000/api/cats/${catId}/apply`;

            // ¡Enviamos el token en la cabecera!
            await axios.post(
                API_URL,
                { form_responses: formResponses }, // El body de la petición
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Así te autoriza el backend
                    }
                }
            );

            alert('¡Solicitud enviada con éxito! El rescatista te contactará.');
            onClose(); // Cierra el modal

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
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>Solicitud para adoptar a {catName}</h2>
                <p>Tu solicitud será enviada al rescatista. Por favor, responde con seriedad.</p>

                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="reason" className="label">
                            ¿Por qué quieres adoptar a {catName}? (Habla de tu hogar, tu experiencia, etc.)
                        </label>
                        <textarea
                            id="reason"
                            className="modal-textarea"
                            rows={5}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="modal-error">{error}</p>}

                    <button type="submit" className="modal-submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdoptionFormModal;