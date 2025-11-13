// Panel de administración
// Permite a los administradores gestionar publicaciones de gatos y charlas educativas

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

// Interfaz que define la estructura de un gato en el admin
interface AdminCat {
    id: number;
    name: string;
    description: string;
    age: string;
    health_status: string;
    sterilization_status: string;
    approval_status: 'pendiente' | 'aprobado' | 'rechazado';
    adoption_status: string;
    owner_id: number;
    owner_name: string;
    owner_email: string;
    photos_url: string[];
    created_at: string;
    story?: string;
}

interface Summary {
    total: number;
    pendientes: number;
    aprobados: number;
    rechazados: number;
}

interface EducationalPost {
    id: number;
    title: string;
    content: string;
    author_id: number;
    author_name: string;
    created_at: string;
}

interface User {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    role: 'adoptante' | 'rescatista' | 'admin';
    created_at: string;
}

type TabType = 'cats' | 'education' | 'users';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<TabType>('cats');
    const [cats, setCats] = useState<AdminCat[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pendiente' | 'aprobado' | 'rechazado'>('pendiente');
    const [editingCat, setEditingCat] = useState<AdminCat | null>(null);
    
    // Estados para charlas educativas
    const [posts, setPosts] = useState<EducationalPost[]>([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState<EducationalPost | null>(null);
    const [postForm, setPostForm] = useState({ title: '', content: '', eventDate: '' });
    
    // Estados para gestión de usuarios
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    
    const { token } = useAuth();

    // Carga todas las charlas educativas
    const fetchPosts = async () => {
        if (!token) return;

        try {
            const API_URL = 'http://localhost:5000/api/education';
            const response = await axios.get(API_URL);
            const postsData = response.data.data?.posts || response.data.posts || response.data;
            setPosts(postsData);
        } catch (error) {
            console.error('Error al cargar charlas:', error);
        }
    };

    // Crea una nueva charla educativa
    const handleCreatePost = async () => {
        if (!postForm.title.trim() || !postForm.content.trim()) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            const API_URL = 'http://localhost:5000/api/education';
            await axios.post(
                API_URL,
                { 
                    title: postForm.title, 
                    content: postForm.content,
                    event_date: postForm.eventDate || null
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert('Charla creada con éxito');
            setPostForm({ title: '', content: '', eventDate: '' });
            setShowPostForm(false);
            fetchPosts();
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                alert(error.response?.data?.message || 'Error al crear la charla');
            }
        }
    };

    // Actualiza una charla educativa
    const handleUpdatePost = async () => {
        if (!editingPost) return;

        try {
            const API_URL = `http://localhost:5000/api/education/${editingPost.id}`;
            await axios.put(
                API_URL,
                { title: editingPost.title, content: editingPost.content },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert('Charla actualizada con éxito');
            setEditingPost(null);
            fetchPosts();
        } catch (error: unknown) {
            alert('Error al actualizar la charla');
        }
    };

    // Elimina una charla educativa
    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta charla?')) {
            return;
        }

        try {
            const API_URL = `http://localhost:5000/api/education/${postId}`;
            await axios.delete(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Charla eliminada con éxito');
            fetchPosts();
        } catch (error: unknown) {
            alert('Error al eliminar la charla');
        }
    };

    // ================ FUNCIONES PARA USUARIOS ================

    // Carga todos los usuarios
    const fetchUsers = async () => {
        if (!token) return;

        try {
            setLoadingUsers(true);
            const API_URL = 'http://localhost:5000/api/admin/users';
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = response.data.data || response.data;
            setUsers(usersData);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar usuarios');
        } finally {
            setLoadingUsers(false);
        }
    };

    // Cambia el rol de un usuario
    const handleChangeUserRole = async (userId: number, currentRole: string) => {
        const roles = ['adoptante', 'rescatista', 'admin'];
        const newRole = window.prompt(
            `Cambiar rol del usuario (actual: ${currentRole})\nRoles disponibles: adoptante, rescatista, admin`,
            currentRole
        );

        if (!newRole || !roles.includes(newRole)) {
            alert('Rol no válido');
            return;
        }

        if (newRole === currentRole) {
            return; // Sin cambios
        }

        try {
            const API_URL = `http://localhost:5000/api/admin/users/${userId}/role`;
            await axios.put(
                API_URL,
                { role: newRole },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert(`Rol actualizado a: ${newRole}`);
            fetchUsers();
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                alert(error.response?.data?.message || 'Error al actualizar rol');
            }
        }
    };

    // ================ FUNCIONES PARA GATOS ================

    // Carga todas las publicaciones
    const fetchCats = async () => {
        if (!token) {
            setError('No se encontró el token de autenticación');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const API_URL = 'http://localhost:5000/api/admin/cats';
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const responseData = response.data.data || response.data;
            setCats(responseData.cats || []);
            setSummary(responseData.summary || null);
            setError(null);
        } catch (error: unknown) {
            let errorMessage = 'Error al cargar las publicaciones';
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || 'Error del servidor';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCats();
        fetchPosts();
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [token, activeTab]);

    // Actualiza el estado de aprobación de un gato
    const handleApproval = async (catId: number, status: 'aprobado' | 'rechazado') => {
        const action = status === 'aprobado' ? 'aprobar' : 'rechazar';
        if (!window.confirm(`¿Estás seguro de que quieres ${action} esta publicación?`)) {
            return;
        }

        try {
            const API_URL = `http://localhost:5000/api/admin/cats/${catId}/approval`;
            await axios.put(
                API_URL,
                { status },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert(`Publicación ${status === 'aprobado' ? 'aprobada' : 'rechazada'} con éxito`);
            fetchCats();
        } catch (error: unknown) {
            alert('Error al actualizar el estado');
            console.error(error);
        }
    };

    // Elimina un gato
    const handleDelete = async (catId: number) => {
        if (!window.confirm('⚠️ ¿Estás seguro de que quieres ELIMINAR permanentemente esta publicación?')) {
            return;
        }

        try {
            const API_URL = `http://localhost:5000/api/admin/cats/${catId}`;
            await axios.delete(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Publicación eliminada con éxito');
            fetchCats();
        } catch (error: unknown) {
            alert('Error al eliminar la publicación');
            console.error(error);
        }
    };

    // Guarda los cambios de edición
    const handleSaveEdit = async () => {
        if (!editingCat) return;

        try {
            const API_URL = `http://localhost:5000/api/admin/cats/${editingCat.id}/edit`;
            await axios.put(
                API_URL,
                {
                    name: editingCat.name,
                    description: editingCat.description,
                    age: editingCat.age,
                    health_status: editingCat.health_status,
                    sterilization_status: editingCat.sterilization_status,
                    story: editingCat.story
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert('Gato actualizado con éxito');
            setEditingCat(null);
            fetchCats();
        } catch (error: unknown) {
            alert('Error al actualizar el gato');
            console.error(error);
        }
    };

    // Filtra los gatos según el filtro seleccionado
    const filteredCats = filter === 'all' 
        ? cats 
        : cats.filter(cat => cat.approval_status === filter);

    // Obtiene el color de badge según el estado
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente': return 'status-pending';
            case 'aprobado': return 'status-approved';
            case 'rechazado': return 'status-rejected';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="admin-container">
                <p className="loading-message">Cargando panel de administración...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <h1>Panel de Administración</h1>

            {/* Pestañas de navegación */}
            <div className="admin-tabs">
                <button 
                    className={`tab-button ${activeTab === 'cats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cats')}
                >
                    🐱 Gestión de Gatos
                </button>
                <button 
                    className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
                    onClick={() => setActiveTab('education')}
                >
                    📚 Charlas Educativas
                </button>
                <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Gestión de Usuarios
                </button>
            </div>

            {/* Tab de Gestión de Gatos */}
            {activeTab === 'cats' && (
                <>
                    {/* Resumen estadístico */}
            {summary && (
                <div className="admin-summary">
                    <div className="summary-card">
                        <h3>{summary.total}</h3>
                        <p>Total</p>
                    </div>
                    <div className="summary-card pending">
                        <h3>{summary.pendientes}</h3>
                        <p>Pendientes</p>
                    </div>
                    <div className="summary-card approved">
                        <h3>{summary.aprobados}</h3>
                        <p>Aprobados</p>
                    </div>
                    <div className="summary-card rejected">
                        <h3>{summary.rechazados}</h3>
                        <p>Rechazados</p>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="admin-filters">
                <button 
                    className={filter === 'pendiente' ? 'filter-active' : ''}
                    onClick={() => setFilter('pendiente')}
                >
                    Pendientes ({summary?.pendientes || 0})
                </button>
                <button 
                    className={filter === 'aprobado' ? 'filter-active' : ''}
                    onClick={() => setFilter('aprobado')}
                >
                    Aprobados ({summary?.aprobados || 0})
                </button>
                <button 
                    className={filter === 'rechazado' ? 'filter-active' : ''}
                    onClick={() => setFilter('rechazado')}
                >
                    Rechazados ({summary?.rechazados || 0})
                </button>
                <button 
                    className={filter === 'all' ? 'filter-active' : ''}
                    onClick={() => setFilter('all')}
                >
                    Todos ({summary?.total || 0})
                </button>
            </div>

            {/* Lista de gatos */}
            {filteredCats.length === 0 ? (
                <p className="no-results">No hay publicaciones {filter === 'all' ? '' : filter + 's'}.</p>
            ) : (
                <div className="admin-cats-list">
                    {filteredCats.map((cat) => (
                        <div key={cat.id} className="admin-cat-card">
                            <div className="cat-header">
                                <h3>{cat.name}</h3>
                                <span className={`status-badge ${getStatusColor(cat.approval_status)}`}>
                                    {cat.approval_status}
                                </span>
                            </div>

                            {cat.photos_url && cat.photos_url.length > 0 && (
                                <img 
                                    src={cat.photos_url[0]} 
                                    alt={cat.name}
                                    className="cat-thumbnail"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/200x150/e0e0e0/666?text=Sin+Foto';
                                    }}
                                />
                            )}

                            <div className="cat-info">
                                <p><strong>Descripción:</strong> {cat.description}</p>
                                <p><strong>Edad:</strong> {cat.age}</p>
                                <p><strong>Salud:</strong> {cat.health_status}</p>
                                <p><strong>Esterilización:</strong> {cat.sterilization_status}</p>
                                <p><strong>Publicado por:</strong> {cat.owner_name} ({cat.owner_email})</p>
                                <p><strong>Fecha:</strong> {new Date(cat.created_at).toLocaleDateString('es-ES')}</p>
                            </div>

                            <div className="cat-actions">
                                {cat.approval_status === 'pendiente' && (
                                    <>
                                        <button 
                                            className="btn-approve"
                                            onClick={() => handleApproval(cat.id, 'aprobado')}
                                        >
                                            ✓ Aprobar
                                        </button>
                                        <button 
                                            className="btn-reject"
                                            onClick={() => handleApproval(cat.id, 'rechazado')}
                                        >
                                            ✗ Rechazar
                                        </button>
                                    </>
                                )}
                                
                                <button 
                                    className="btn-edit"
                                    onClick={() => setEditingCat(cat)}
                                >
                                    ✎ Editar
                                </button>
                                
                                <button 
                                    className="btn-delete"
                                    onClick={() => handleDelete(cat.id)}
                                >
                                    🗑 Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de edición */}
            {editingCat && (
                <div className="modal-overlay" onClick={() => setEditingCat(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setEditingCat(null)}>&times;</button>
                        <h2>Editar Publicación</h2>
                        
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input 
                                type="text"
                                value={editingCat.name}
                                onChange={(e) => setEditingCat({...editingCat, name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Descripción:</label>
                            <textarea 
                                value={editingCat.description}
                                onChange={(e) => setEditingCat({...editingCat, description: e.target.value})}
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label>Edad:</label>
                            <input 
                                type="text"
                                value={editingCat.age}
                                onChange={(e) => setEditingCat({...editingCat, age: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Estado de salud:</label>
                            <input 
                                type="text"
                                value={editingCat.health_status}
                                onChange={(e) => setEditingCat({...editingCat, health_status: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Esterilización:</label>
                            <select 
                                value={editingCat.sterilization_status}
                                onChange={(e) => setEditingCat({...editingCat, sterilization_status: e.target.value})}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="esterilizado">Esterilizado</option>
                                <option value="no_aplica">No aplica</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>💕 Historia del gato (opcional):</label>
                            <textarea 
                                value={editingCat.story || ''}
                                onChange={(e) => setEditingCat({...editingCat, story: e.target.value})}
                                rows={6}
                                placeholder="Comparte la historia de rescate o adopción de este gatito para generar empatía..."
                                maxLength={2000}
                            />
                            <small style={{color: '#666'}}>{(editingCat.story || '').length}/2000 caracteres</small>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-save" onClick={handleSaveEdit}>
                                Guardar Cambios
                            </button>
                            <button className="btn-cancel" onClick={() => setEditingCat(null)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
                </>
            )}

            {/* Tab de Charlas Educativas */}
            {activeTab === 'education' && (
                <div className="education-section">
                    <div className="section-header">
                        <h2>Gestión de Charlas Educativas</h2>
                        <button 
                            className="btn-create-post"
                            onClick={() => setShowPostForm(!showPostForm)}
                        >
                            {showPostForm ? '✕ Cancelar' : '➕ Nueva Charla'}
                        </button>
                    </div>

                    {/* Formulario para crear charla */}
                    {showPostForm && (
                        <div className="post-form-card">
                            <h3>✏️ Nueva Charla Educativa</h3>
                            <div className="form-group">
                                <label htmlFor="postTitle">Título de la charla</label>
                                <input
                                    id="postTitle"
                                    type="text"
                                    value={postForm.title}
                                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                    placeholder="Ej: Cuidados básicos para gatitos recién adoptados"
                                    maxLength={200}
                                />
                                <small>{postForm.title.length}/200 caracteres</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="postEventDate">📅 Fecha del evento (opcional)</label>
                                <input
                                    id="postEventDate"
                                    type="datetime-local"
                                    value={postForm.eventDate}
                                    onChange={(e) => setPostForm({ ...postForm, eventDate: e.target.value })}
                                />
                                <small>Si no especificas fecha, se usará la fecha actual</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="postContent">Contenido</label>
                                <textarea
                                    id="postContent"
                                    value={postForm.content}
                                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                                    placeholder="Describe el contenido de la charla..."
                                    rows={8}
                                    maxLength={2000}
                                />
                                <small>{postForm.content.length}/2000 caracteres</small>
                            </div>
                            <button 
                                className="btn-submit-post"
                                onClick={handleCreatePost}
                                disabled={!postForm.title.trim() || !postForm.content.trim()}
                            >
                                Publicar Charla
                            </button>
                        </div>
                    )}

                    {/* Lista de charlas */}
                    <div className="posts-list">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.id} className="post-card">
                                    {editingPost?.id === post.id ? (
                                        // Modo edición
                                        <div className="post-edit-form">
                                            <input
                                                type="text"
                                                value={editingPost.title}
                                                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                                className="edit-input-title"
                                            />
                                            <textarea
                                                value={editingPost.content}
                                                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                                rows={6}
                                                className="edit-textarea"
                                            />
                                            <div className="post-actions">
                                                <button 
                                                    className="btn-save-post"
                                                    onClick={handleUpdatePost}
                                                >
                                                    ✓ Guardar
                                                </button>
                                                <button 
                                                    className="btn-cancel-edit"
                                                    onClick={() => setEditingPost(null)}
                                                >
                                                    ✕ Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Modo vista
                                        <>
                                            <div className="post-header">
                                                <h3>{post.title}</h3>
                                                <span className="post-date">
                                                    {new Date(post.created_at).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                            <p className="post-content">{post.content}</p>
                                            <div className="post-meta">
                                                <span className="post-author">Autor: {post.author_name}</span>
                                            </div>
                                            <div className="post-actions">
                                                <button 
                                                    className="btn-edit-post"
                                                    onClick={() => setEditingPost(post)}
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button 
                                                    className="btn-delete-post"
                                                    onClick={() => handleDeletePost(post.id)}
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-posts">
                                <p>📖 No hay charlas educativas publicadas aún.</p>
                                <p className="empty-subtitle">Haz clic en "Nueva Charla" para agregar una.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tab de Gestión de Usuarios */}
            {activeTab === 'users' && (
                <div className="users-section">
                    <div className="section-header">
                        <h2>👥 Gestión de Usuarios</h2>
                        <p className="section-subtitle">Administra los roles de los usuarios de la plataforma</p>
                    </div>

                    {loadingUsers ? (
                        <p className="loading-message">Cargando usuarios...</p>
                    ) : users.length > 0 ? (
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Rol Actual</th>
                                        <th>Fecha de Registro</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.full_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || 'N/A'}</td>
                                            <td>
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role === 'adoptante' && '👤 Adoptante'}
                                                    {user.role === 'rescatista' && '🦸 Rescatista'}
                                                    {user.role === 'admin' && '⭐ Admin'}
                                                </span>
                                            </td>
                                            <td>{new Date(user.created_at).toLocaleDateString('es-ES')}</td>
                                            <td>
                                                <button 
                                                    className="btn-change-role"
                                                    onClick={() => handleChangeUserRole(user.id, user.role)}
                                                >
                                                    🔄 Cambiar Rol
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-users">
                            <p>👥 No se encontraron usuarios.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
