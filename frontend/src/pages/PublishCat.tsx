// frontend/src/pages/PublishCat.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase'; // Importa el storage de Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Para nombres de archivo únicos
import './PublishCat.css'; // Crearemos este CSS
import { API_BASE_URL } from '../config/api';

const PublishCat = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        age: 'adulto',
        health_status: '',
        sterilization_status: 'pendiente',
        breed: 'Mestizo',
        living_space_requirement: 'cualquiera'
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { token } = useAuth();
    const navigate = useNavigate();

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const combinedFiles = [...imageFiles, ...newFiles];
            
            // Limitar a máximo 5 fotos
            if (combinedFiles.length > 5) {
                setError('Máximo 5 fotos permitidas');
                return;
            }
            
            setImageFiles(combinedFiles);
            
            // Crear previsualizaciones
            const newPreviews: string[] = [];
            combinedFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    if (newPreviews.length === combinedFiles.length) {
                        setImagePreviews(newPreviews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    // 1. FUNCIÓN PARA SUBIR UNA IMAGEN A FIREBASE (PATRÓN SIMPLIFICADO)
    const handleUpload = async (file: File): Promise<string> => {
        // 1. Subir la imagen
        const storageRef = ref(storage, `gatos/${uuidv4()}_${file.name}`);
        await uploadBytes(storageRef, file);
        
        // 2. Obtener la URL PÚBLICA (Esta es la que vale oro)
        const urlPublica = await getDownloadURL(storageRef);
        
        return urlPublica; // Esta string la guardaremos para enviarla al backend
    };

    // 2. FUNCIÓN PARA SUBIR MÚLTIPLES IMÁGENES
    const uploadImages = async (): Promise<string[]> => {
        if (imageFiles.length === 0) {
            throw new Error("No se han seleccionado imágenes.");
        }

        const uploadPromises = imageFiles.map(async (file) => {
            return await handleUpload(file);
        });

        return await Promise.all(uploadPromises);
    };

    // 3. FUNCIÓN PARA ENVIAR EL FORMULARIO
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Paso A: Subir las imágenes primero
            if (imageFiles.length === 0) {
                throw new Error("Por favor, selecciona al menos una foto para el gato.");
            }
            const imageUrls = await uploadImages();

            // Convertir la categoría de edad a un número aproximado
            const ageMap: { [key: string]: number } = {
                'cachorro': 0,
                'joven': 1,
                'adulto': 4,
                'senior': 9
            };

            // Paso B: Preparar los datos para el backend
            const catData = {
                name: formData.name,
                description: formData.description,
                age: ageMap[formData.age] || 4, // Convertir edad categórica a número
                health_status: formData.health_status,
                sterilization_status: formData.sterilization_status === 'no_aplica' ? 'pendiente' : formData.sterilization_status,
                breed: formData.breed,
                living_space_requirement: formData.living_space_requirement,
                story: formData.description, // Usar la descripción como historia
                photos_url: imageUrls, // Envía las URLs de Firebase
            };

            // Paso C: Llamar a tu API para crear el gato
            const API_URL = `${API_BASE_URL}/api/cats`;
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
        <div className="publish-page">
            <div className="publish-container">
                <div className="publish-header">
                    <h2>Publicar un Gato para Adopción</h2>
                    <p className="publish-subtitle">Completa el formulario para encontrarle un nuevo hogar.</p>
                </div>

                <form onSubmit={handleSubmit} className="publish-form">
                    <div className="form-grid">
                        <div className="formGroup">
                            <label htmlFor="name" className="label">Nombre</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                className="input" 
                                placeholder="Introduce el nombre del gato"
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="age" className="label">
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', display: 'inline-block', verticalAlign: 'middle'}}>
                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                </svg>
                                Categoría de Edad
                            </label>
                            <select 
                                id="age" 
                                name="age" 
                                className="select" 
                                onChange={handleChange} 
                                value={formData.age}
                                required
                            >
                                <option value="cachorro"> Cachorro (0-11 meses)</option>
                                <option value="joven"> Joven (1 año)</option>
                                <option value="adulto"> Adulto (2-7 años)</option>
                                <option value="senior"> Senior (8+ años)</option>
                            </select>
                            <small className="field-help">
                                Selecciona la categoría que mejor describe la edad del gato
                            </small>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="health_status" className="label">
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', display: 'inline-block', verticalAlign: 'middle'}}>
                                    <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5 0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5c0-1.93 1.57-3.5 3.5-3.5zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                                </svg>
                                Estado de Salud
                            </label>
                            <input 
                                type="text" 
                                id="health_status" 
                                name="health_status" 
                                className="input" 
                                placeholder="Ej: Vacunado, desparasitado, sin problemas de salud"
                                onChange={handleChange} 
                                required 
                            />
                            <small className="field-help">
                                Describe el estado de salud actual del gato
                            </small>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="sterilization_status" className="label">
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', display: 'inline-block', verticalAlign: 'middle'}}>
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Estado de Esterilización
                            </label>
                            <select 
                                id="sterilization_status" 
                                name="sterilization_status" 
                                className="select" 
                                onChange={handleChange} 
                                value={formData.sterilization_status}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="esterilizado">Esterilizado</option>
                                <option value="no_aplica">No aplica</option>
                            </select>
                            <small className="field-help">
                                Indica si el gato está esterilizado o está programado para hacerlo
                            </small>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="breed" className="label">
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', display: 'inline-block', verticalAlign: 'middle'}}>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                                Raza
                            </label>
                            <select 
                                id="breed" 
                                name="breed" 
                                className="select" 
                                onChange={handleChange} 
                                value={formData.breed}
                            >
                                <option value="Mestizo">Mestizo</option>
                                <option value="Siamés">Siamés</option>
                                <option value="Persa">Persa</option>
                                <option value="Angora">Angora</option>
                                <option value="Común Europeo">Común Europeo</option>
                                <option value="Maine Coon">Maine Coon</option>
                                <option value="Bengalí">Bengalí</option>
                                <option value="Ragdoll">Ragdoll</option>
                                <option value="Abisinio">Abisinio</option>
                                <option value="Sphynx">Sphynx</option>
                                <option value="Británico de Pelo Corto">Británico de Pelo Corto</option>
                                <option value="Scottish Fold">Scottish Fold</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="living_space_requirement" className="label">
                                <svg viewBox="0 0 24 24" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px', display: 'inline-block', verticalAlign: 'middle'}}>
                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                </svg>
                                Tipo de Vivienda Recomendada
                            </label>
                            <select 
                                id="living_space_requirement" 
                                name="living_space_requirement" 
                                className="select" 
                                onChange={handleChange} 
                                value={formData.living_space_requirement}
                            >
                                <option value="cualquiera">Cualquier espacio</option>
                                <option value="casa_grande">Casa Grande</option>
                                <option value="departamento">Departamento</option>
                            </select>
                        </div>

                        <div className="formGroup form-grid-full">
                            <label htmlFor="description" className="label">Descripción</label>
                            <textarea 
                                id="description" 
                                name="description" 
                                className="textarea" 
                                placeholder="Describe su personalidad, historia, y qué tipo de hogar necesita..."
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="formGroup form-grid-full">
                            <label className="label">Fotografías del gato (hasta 5 fotos)</label>
                            <div className="file-upload">
                                <label htmlFor="image" className="file-upload-label">
                                    <div className="file-upload-icon">IMG</div>
                                    <div className="file-upload-text">
                                        <strong>Sube fotos</strong> o arrástralas aquí
                                        <br />
                                        <small>PNG, JPG, GIF hasta 10MB cada una - Máximo 5 fotos</small>
                                    </div>
                                    <input 
                                        type="file" 
                                        id="image" 
                                        name="image" 
                                        onChange={handleFileChange} 
                                        accept="image/*"
                                        multiple 
                                        required={imageFiles.length === 0}
                                    />
                                </label>
                                
                                {imagePreviews.length > 0 && (
                                    <div className="image-previews">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="image-preview-item">
                                                <img src={preview} alt={`Preview ${index + 1}`} />
                                                <button 
                                                    type="button" 
                                                    className="remove-image-btn"
                                                    onClick={() => removeImage(index)}
                                                    title="Eliminar foto"
                                                >
                                                    ×
                                                </button>
                                                <div className="image-preview-number">{index + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {imageFiles.length > 0 && (
                                    <div className="file-selected">
                                        {imageFiles.length} foto{imageFiles.length !== 1 ? 's' : ''} seleccionada{imageFiles.length !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && <p className="publish-error">{error}</p>}

                    <button type="submit" className="publish-button" disabled={loading}>
                        {loading ? 'Publicando...' : 'Publicar Gato'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PublishCat;