// frontend/src/pages/PublishCat.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase'; // Importa el storage de Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Para nombres de archivo únicos
import './PublishCat.css'; // Crearemos este CSS

const PublishCat = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        age: '',
        health_status: '',
        sterilization_status: 'pendiente', // Valor por defecto
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // 1. FUNCIÓN PARA SUBIR LA IMAGEN A FIREBASE
    const uploadImage = async (): Promise<string> => {
        if (!imageFile) {
            throw new Error("No se ha seleccionado ninguna imagen.");
        }

        // Crea un nombre único para el archivo
        const imageRef = ref(storage, `cat_images/${uuidv4()}_${imageFile.name}`);

        // Sube el archivo
        await uploadBytes(imageRef, imageFile);

        // Obtiene la URL de descarga
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    };

    // 2. FUNCIÓN PARA ENVIAR EL FORMULARIO
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Paso A: Subir la imagen primero
            if (!imageFile) {
                throw new Error("Por favor, selecciona una foto para el gato.");
            }
            const imageUrl = await uploadImage();

            // Paso B: Preparar los datos para el backend
            const catData = {
                ...formData,
                photos_url: [imageUrl], // Envía la URL de Firebase
            };

            // Paso C: Llamar a tu API para crear el gato
            const API_URL = 'http://localhost:5000/api/cats';
            await axios.post(API_URL, catData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('¡Gato publicado con éxito! (o pendiente de revisión)');
            navigate('/'); // Redirige al inicio

        } catch (error: unknown) {
            let errorMessage = 'Error al publicar';
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
            console.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="publish-container">
            <h2>Publicar un Gato para Adopción</h2>
            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="name" className="label">Nombre del Gato</label>
                    <input type="text" id="name" name="name" className="input" onChange={handleChange} required />
                </div>

                <div className="formGroup">
                    <label htmlFor="description" className="label">Descripción e Historia</label>
                    <textarea id="description" name="description" className="input" onChange={handleChange} rows={4} required />
                </div>

                <div className="formGroup">
                    <label htmlFor="age" className="label">Edad (ej. "6 meses", "2 años")</label>
                    <input type="text" id="age" name="age" className="input" onChange={handleChange} required />
                </div>

                <div className="formGroup">
                    <label htmlFor="health_status" className="label">Estado de Salud (vacunas, etc.)</label>
                    <input type="text" id="health_status" name="health_status" className="input" onChange={handleChange} required />
                </div>

                <div className="formGroup">
                    <label htmlFor="sterilization_status" className="label">Estado de Esterilización</label>
                    <select id="sterilization_status" name="sterilization_status" className="input" onChange={handleChange} value={formData.sterilization_status}>
                        <option value="pendiente">Pendiente</option>
                        <option value="esterilizado">Ya esterilizado</option>
                        <option value="no_aplica">No aplica (ej. muy cachorro)</option>
                    </select>
                </div>

                <div className="formGroup">
                    <label htmlFor="image" className="label">Foto del Gato</label>
                    <input type="file" id="image" name="image" className="input" onChange={handleFileChange} accept="image/*" required />
                    {imageFile && <p>Archivo seleccionado: {imageFile.name}</p>}
                </div>

                {error && <p className="publish-error">{error}</p>}

                <button type="submit" className="publish-button" disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar Gato'}
                </button>
            </form>
        </div>
    );
};

export default PublishCat;