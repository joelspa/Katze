// Página de perfil de usuario
// Permite ver y editar la información del perfil del usuario autenticado

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

interface UserProfile {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    role: string;
    created_at: string;
}

const Profile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
    });

    // Cargar perfil al montar el componente
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error('No hay token de autenticación');
                alert('No estás autenticado. Por favor inicia sesión.');
                setLoading(false);
                return;
            }

            console.log('Cargando perfil con token:', token.substring(0, 20) + '...');
            
            const response = await axios.get('http://localhost:5000/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Respuesta del servidor:', response.data);

            const profileData = response.data.data?.user || response.data.user || response.data.data;
            
            if (!profileData) {
                console.error('No se encontró información del usuario en la respuesta');
                alert('Error: No se pudo obtener la información del perfil');
                setLoading(false);
                return;
            }

            setProfile(profileData);
            setFormData({
                full_name: profileData.full_name || '',
                email: profileData.email || '',
                phone: profileData.phone || '',
            });
            setLoading(false);
        } catch (error: any) {
            console.error('Error al cargar perfil:', error);
            console.error('Detalles del error:', error.response?.data);
            alert(`Error al cargar perfil: ${error.response?.data?.message || error.message || 'Error desconocido'}`);
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:5000/api/users/profile',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setProfile(response.data.data.user);
            setIsEditing(false);
            alert('Perfil actualizado exitosamente');
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error);
            alert(error.response?.data?.message || 'Error al actualizar perfil');
        }
    };

    const getRoleName = (role: string) => {
        const roles: { [key: string]: string } = {
            'adoptante': 'Adoptante',
            'rescatista': 'Rescatista',
            'admin': 'Administrador'
        };
        return roles[role] || role;
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="container">
                    <p>Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
                <div className="container">
                    <div className="profile-header">
                        <h1>Mi Perfil</h1>
                        {!isEditing && (
                            <button 
                                className="btn-edit"
                                onClick={() => setIsEditing(true)}
                            >
                                Editar Perfil
                            </button>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="profile-view">
                            <div className="profile-card">
                                <div className="profile-field">
                                    <label>Nombre Completo</label>
                                    <p>{profile?.full_name}</p>
                                </div>

                                <div className="profile-field">
                                    <label>Email</label>
                                    <p>{profile?.email}</p>
                                </div>

                                <div className="profile-field">
                                    <label>Teléfono</label>
                                    <p>{profile?.phone || 'No especificado'}</p>
                                </div>

                                <div className="profile-field">
                                    <label>Rol</label>
                                    <p className="role-badge">{getRoleName(profile?.role || '')}</p>
                                </div>

                                <div className="profile-field">
                                    <label>Miembro desde</label>
                                    <p>{new Date(profile?.created_at || '').toLocaleDateString('es-ES')}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-edit">
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="full_name">Nombre Completo</label>
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Teléfono</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Ej: +57 300 123 4567"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-save">
                                        Guardar Cambios
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-cancel"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                full_name: profile?.full_name || '',
                                                email: profile?.email || '',
                                                phone: profile?.phone || '',
                                            });
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
    );
};

export default Profile;
