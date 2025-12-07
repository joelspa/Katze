// Página de perfil de usuario
// Permite ver y editar la información del perfil del usuario autenticado

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
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

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Cargar perfil al montar el componente
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('No estás autenticado. Por favor inicia sesión.');
                setLoading(false);
                return;
            }
            
            const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const profileData = response.data.data?.user || response.data.user || response.data.data;
            
            if (!profileData) {
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
                `${API_BASE_URL}/api/users/profile`,
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
                        <div className="header-content">
                            <h1>
                                <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Mi Perfil
                            </h1>
                            <p className="header-subtitle">Gestiona tu información personal</p>
                        </div>
                        {!isEditing && (
                            <button 
                                className="btn-edit"
                                onClick={() => setIsEditing(true)}
                            >
                                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar Perfil
                            </button>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="profile-view">
                            <div className="profile-card">
                                {/* Avatar Section */}
                                <div className="profile-avatar-section">
                                    <div className="avatar-circle">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    <div className="avatar-info">
                                        <h2>{profile?.full_name}</h2>
                                        <span className="role-badge">{getRoleName(profile?.role || '')}</span>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="profile-grid">
                                    <div className="profile-field">
                                        <div className="field-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="field-content">
                                            <label>Nombre Completo</label>
                                            <p>{profile?.full_name}</p>
                                        </div>
                                    </div>

                                    <div className="profile-field">
                                        <div className="field-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="field-content">
                                            <label>Email</label>
                                            <p>{profile?.email}</p>
                                        </div>
                                    </div>

                                    <div className="profile-field">
                                        <div className="field-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div className="field-content">
                                            <label>Teléfono</label>
                                            <p>{profile?.phone || 'No especificado'}</p>
                                        </div>
                                    </div>

                                    <div className="profile-field">
                                        <div className="field-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="field-content">
                                            <label>Miembro desde</label>
                                            <p>{new Date(profile?.created_at || '').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-edit">
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-header">
                                    <h2>
                                        <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar Información
                                    </h2>
                                    <p>Actualiza tus datos personales</p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="full_name">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingresa tu nombre completo"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+57 300 123 4567"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-save">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
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
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
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
