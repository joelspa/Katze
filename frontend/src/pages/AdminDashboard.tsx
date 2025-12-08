// Panel de administración
// Permite a los administradores gestionar publicaciones de gatos y artículos del blog

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import { useModal } from '../hooks/useModal';
import CustomModal from '../components/CustomModal';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
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
    event_date?: string;
    image_url?: string;
    category?: string;
}

interface User {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    role: 'adoptante' | 'rescatista' | 'admin';
    created_at: string;
}

interface TrackingTask {
    id: number;
    due_date: string;
    status: string;
    task_type: string;
    description?: string;
    cat_name: string;
    applicant_name: string;
    applicant_phone?: string;
    owner_name: string;
    sterilization_status?: string;
}

type TabType = 'cats' | 'education' | 'users' | 'tracking' | 'applications';

const AdminDashboard = () => {
    const { modalState, showAlert, showConfirm, showPrompt, closeModal } = useModal();

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [activeTab, setActiveTab] = useState<TabType>('cats');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [cats, setCats] = useState<AdminCat[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pendiente' | 'aprobado' | 'rechazado'>('pendiente');
    const [editingCat, setEditingCat] = useState<AdminCat | null>(null);
    const [photoIndexes, setPhotoIndexes] = useState<{[key: number]: number}>({});
    
    // Estados para blog
    const [posts, setPosts] = useState<EducationalPost[]>([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState<EducationalPost | null>(null);
    const [editingPostEventDate, setEditingPostEventDate] = useState<string>('');
    const [postForm, setPostForm] = useState({ title: '', content: '', eventDate: '', image_url: '', category: 'todos' });
    const [postImageFile, setPostImageFile] = useState<File | null>(null);
    const [editingPostImageFile, setEditingPostImageFile] = useState<File | null>(null);
    
    // Estados para gestión de usuarios
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [newUserForm, setNewUserForm] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'rescatista',
        phone: ''
    });

    // Estados para seguimiento
    const [trackingTasks, setTrackingTasks] = useState<TrackingTask[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TrackingTask | null>(null);
    
    // Estado para modal de detalle de post
    const [selectedPost, setSelectedPost] = useState<EducationalPost | null>(null);
    
    // Estados para solicitudes de adopción
    interface Application {
        id: number;
        cat_id: number;
        cat_name: string;
        cat_photos?: string[];
        applicant_name: string;
        applicant_email: string;
        applicant_phone?: string;
        
        // Mapped fields for UI compatibility
        application_status: string;
        ai_suitability_score?: number;
        applicant_age?: number;
        applicant_occupation?: string;
        living_situation?: string;
        has_other_pets?: boolean;
        experience_with_cats?: boolean;
        reason_for_adoption?: string;
        updated_at?: string; // mapped from ai_evaluated_at

        // Original fields
        status: string;
        form_responses: any;
        ai_score?: number;
        ai_feedback?: string;
        ai_flags?: string[];
        created_at: string;
        owner_name: string;
    }

    // Interfaz para agrupar solicitudes por gato
    interface CatApplicationGroup {
        cat_id: number;
        cat_name: string;
        cat_photos?: string[];
        applications: Application[];
        applicationCount: number;
    }

    const [applications, setApplications] = useState<Application[]>([]);
    const [groupedApplications, setGroupedApplications] = useState<CatApplicationGroup[]>([]);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [selectedCatGroup, setSelectedCatGroup] = useState<CatApplicationGroup | null>(null);
    const [applicationFilter, setApplicationFilter] = useState<string>('all');
    
    const { token } = useAuth();

    // Carga todos los artículos del blog
    const fetchPosts = async () => {
        if (!token) return;

        try {
            const API_URL = `${API_BASE_URL}/api/education`;
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
            let imageUrl = '';
            
            // Si se seleccionó una imagen, subirla a Firebase
            if (postImageFile) {
                const fileExtension = postImageFile.name.split('.').pop();
                const imageRef = ref(storage, `educational_posts/${uuidv4()}.${fileExtension}`);
                await uploadBytes(imageRef, postImageFile);
                imageUrl = await getDownloadURL(imageRef);
            }

            const API_URL = `${API_BASE_URL}/api/education`;
            await axios.post(
                API_URL,
                { 
                    title: postForm.title, 
                    content: postForm.content,
                    category: postForm.category,
                    event_date: postForm.eventDate || null,
                    image_url: imageUrl || null
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert('Charla creada con éxito');
            setPostForm({ title: '', content: '', eventDate: '', image_url: '', category: 'todos' });
            setPostImageFile(null);
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
            let imageUrl = editingPost.image_url || '';
            
            // Si se seleccionó una nueva imagen, subirla a Firebase
            if (editingPostImageFile) {
                const fileExtension = editingPostImageFile.name.split('.').pop();
                const imageRef = ref(storage, `educational_posts/${uuidv4()}.${fileExtension}`);
                await uploadBytes(imageRef, editingPostImageFile);
                imageUrl = await getDownloadURL(imageRef);
            }

            const API_URL = `${API_BASE_URL}/api/education/${editingPost.id}`;
            await axios.put(
                API_URL,
                { 
                    title: editingPost.title, 
                    content: editingPost.content,
                    category: editingPost.category || 'todos',
                    event_date: editingPostEventDate || null,
                    image_url: imageUrl || null
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert('Charla actualizada con éxito');
            setEditingPost(null);
            setEditingPostImageFile(null);
            setEditingPostEventDate('');
            fetchPosts();
        } catch (error: unknown) {
            await showAlert('Error al actualizar la charla. Por favor, inténtalo de nuevo.', 'Error');
            console.error(error);
        }
    };

    // Elimina una charla educativa
    const handleDeletePost = async (postId: number) => {
        const confirmed = await showConfirm('¿Estás seguro de que quieres eliminar esta charla? Esta acción no se puede deshacer.', 'Confirmar Eliminación');
        if (!confirmed) {
            return;
        }

        try {
            const API_URL = `${API_BASE_URL}/api/education/${postId}`;
            await axios.delete(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            await showAlert('Charla eliminada con éxito', 'Operación Exitosa');
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
            const API_URL = `${API_BASE_URL}/api/admin/users`;
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = response.data.data || response.data;
            setUsers(usersData);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            await showAlert('Error al cargar la lista de usuarios. Por favor, recarga la página.', 'Error');
        } finally {
            setLoadingUsers(false);
        }
    };

    // Carga todas las tareas de seguimiento (admin ve todas)
    const fetchTrackingTasks = async () => {
        if (!token) return;

        try {
            setLoadingTasks(true);
            const API_URL = `${API_BASE_URL}/api/tracking`;
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const tasksData = response.data.data?.tasks || response.data.tasks || response.data;
            setTrackingTasks(tasksData);
        } catch (error) {
            console.error('Error al cargar tareas de seguimiento:', error);
            await showAlert('Error al cargar tareas. Por favor, recarga la página.', 'Error');
        } finally {
            setLoadingTasks(false);
        }
    };

    // Cambia el rol de un usuario
    const handleChangeUserRole = async (userId: number, currentRole: string) => {
        const roles = ['adoptante', 'rescatista', 'admin'];
        const newRole = await showPrompt(
            `Rol actual: ${currentRole}\n\nIngresa el nuevo rol:`,
            'Roles: adoptante, rescatista, admin',
            currentRole,
            'Cambiar Rol de Usuario'
        );

        if (!newRole || !roles.includes(newRole.trim().toLowerCase())) {
            await showAlert('Rol no válido. Los roles disponibles son: adoptante, rescatista, admin', 'Error');
            return;
        }

        if (newRole === currentRole) {
            return; // Sin cambios
        }

        try {
            const API_URL = `${API_BASE_URL}/api/admin/users/${userId}/role`;
            await axios.put(
                API_URL,
                { role: newRole },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            await showAlert(`Rol actualizado exitosamente a: ${newRole}`, 'Cambio Completado');
            fetchUsers();
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                alert(error.response?.data?.message || 'Error al actualizar rol');
            }
        }
    };

    // Crea un nuevo usuario (solo admin)
    const handleCreateUser = async () => {
        if (!newUserForm.email || !newUserForm.password || !newUserForm.fullName || !newUserForm.role) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        if (newUserForm.password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const API_URL = `${API_BASE_URL}/api/admin/users`;
            await axios.post(
                API_URL,
                newUserForm,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert('Usuario creado exitosamente');
            setNewUserForm({
                email: '',
                password: '',
                fullName: '',
                role: 'rescatista',
                phone: ''
            });
            setShowCreateUserForm(false);
            fetchUsers();
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                alert(error.response?.data?.message || 'Error al crear usuario');
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
            
            // Obtener gatos
            const catsResponse = await axios.get(`${API_BASE_URL}/api/admin/cats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const catsData = catsResponse.data.data || catsResponse.data;
            setCats(catsData.cats || []);
            setSummary(catsData.summary || null);
            
            // Obtener estadísticas del dashboard (incluyendo tracking)
            try {
                const statsResponse = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = statsResponse.data.data || statsResponse.data;
                console.log('Estadísticas recibidas:', statsData);
            } catch (statsError) {
                console.error('Error al cargar estadísticas de seguimiento:', statsError);
            }
            
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

    // Función para agrupar solicitudes por gato
    const groupApplicationsByCat = (apps: Application[]): CatApplicationGroup[] => {
        const grouped = apps.reduce((acc, app) => {
            const catId = app.cat_id;
            
            if (!acc[catId]) {
                acc[catId] = {
                    cat_id: app.cat_id,
                    cat_name: app.cat_name,
                    cat_photos: app.cat_photos,
                    applications: [],
                    applicationCount: 0
                };
            }
            
            acc[catId].applications.push(app);
            acc[catId].applicationCount++;
            
            return acc;
        }, {} as Record<number, CatApplicationGroup>);

        // Convertir a array y ordenar por cantidad de solicitudes (más solicitudes primero)
        return Object.values(grouped).sort((a, b) => b.applicationCount - a.applicationCount);
    };

    // Carga todas las solicitudes de adopción (admin puede ver todas)
    const fetchApplications = async () => {
        if (!token) return;
        
        try {
            setLoadingApplications(true);
            const API_URL = `${API_BASE_URL}/api/admin/applications`;
            const response = await axios.get(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const applicationsData = response.data.data?.applications || response.data.applications || response.data;
            
            // Map backend data to frontend interface
            const mappedApplications = Array.isArray(applicationsData) ? applicationsData.map((app: any) => ({
                ...app,
                application_status: app.status,
                ai_suitability_score: app.ai_score,
                // Safely access form_responses properties
                applicant_age: app.form_responses?.age || app.form_responses?.applicant_age || 0,
                applicant_occupation: app.form_responses?.occupation || app.form_responses?.applicant_occupation || 'No especificada',
                living_situation: app.form_responses?.livingSpace || app.form_responses?.living_situation || 'No especificado',
                has_other_pets: app.form_responses?.hasOtherPets || app.form_responses?.has_other_pets || false,
                experience_with_cats: app.form_responses?.hasExperience || app.form_responses?.experience_with_cats || false,
                reason_for_adoption: app.form_responses?.whyAdopt || app.form_responses?.reason_for_adoption || 'No especificada',
                updated_at: app.ai_evaluated_at || app.created_at
            })) : [];

            setApplications(mappedApplications);
            setGroupedApplications(groupApplicationsByCat(mappedApplications));
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
            if (isAxiosError(error)) {
                setError(error.response?.data?.message || 'Error al cargar solicitudes');
            }
        } finally {
            setLoadingApplications(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'cats') {
            fetchCats();
        } else if (activeTab === 'education') {
            fetchPosts();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'tracking') {
            fetchTrackingTasks();
        } else if (activeTab === 'applications') {
            fetchApplications();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, activeTab]);

    // Actualiza el estado de aprobación de un gato
    const handleApproval = async (catId: number, status: 'aprobado' | 'rechazado') => {
        const action = status === 'aprobado' ? 'aprobar' : 'rechazar';
        const confirmed = await showConfirm(
            `¿Estás seguro de que quieres ${action} esta publicación?`,
            'Confirmar Acción'
        );
        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            const API_URL = `${API_BASE_URL}/api/admin/cats/${catId}/approval`;
            await axios.put(
                API_URL,
                { status },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // Actualizar inmediatamente el estado local antes de recargar
            setCats(prevCats => 
                prevCats.map(cat => 
                    cat.id === catId 
                        ? { ...cat, approval_status: status }
                        : cat
                )
            );

            // Recalcular el resumen
            const updatedCats = cats.map(cat => 
                cat.id === catId 
                    ? { ...cat, approval_status: status }
                    : cat
            );
            
            setSummary({
                total: updatedCats.length,
                pendientes: updatedCats.filter(c => c.approval_status === 'pendiente').length,
                aprobados: updatedCats.filter(c => c.approval_status === 'aprobado').length,
                rechazados: updatedCats.filter(c => c.approval_status === 'rechazado').length
            });

            alert(`Publicación ${status === 'aprobado' ? 'aprobada' : 'rechazada'} con éxito`);
            
            // Recargar desde el servidor para asegurar consistencia
            await fetchCats();
        } catch (error: unknown) {
            await showAlert('Error al actualizar el estado. Por favor, inténtalo de nuevo.', 'Error');
            console.error(error);
            // Recargar en caso de error para restaurar el estado correcto
            await fetchCats();
        } finally {
            setLoading(false);
        }
    };

    // Elimina un gato
    const handleDelete = async (catId: number) => {
        const confirmed = await showConfirm(
            '¿Estás seguro de que quieres ELIMINAR permanentemente esta publicación? Esta acción no se puede deshacer.',
            '¡ADVERTENCIA!'
        );
        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            const API_URL = `${API_BASE_URL}/api/admin/cats/${catId}`;
            await axios.delete(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Actualizar inmediatamente el estado local
            setCats(prevCats => prevCats.filter(cat => cat.id !== catId));
            
            // Recalcular el resumen
            const updatedCats = cats.filter(cat => cat.id !== catId);
            setSummary({
                total: updatedCats.length,
                pendientes: updatedCats.filter(c => c.approval_status === 'pendiente').length,
                aprobados: updatedCats.filter(c => c.approval_status === 'aprobado').length,
                rechazados: updatedCats.filter(c => c.approval_status === 'rechazado').length
            });

            alert('Publicación eliminada con éxito');
            
            // Recargar desde el servidor para asegurar consistencia
            await fetchCats();
        } catch (error: unknown) {
            alert('Error al eliminar la publicación');
            console.error(error);
            // Recargar en caso de error
            await fetchCats();
        } finally {
            setLoading(false);
        }
    };

    // Guarda los cambios de edición
    const handleSaveEdit = async () => {
        if (!editingCat) return;

        try {
            const API_URL = `${API_BASE_URL}/api/admin/cats/${editingCat.id}/edit`;
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
        <div className="admin-layout">
            {/* Sidebar de navegación */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h1>
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '28px', height: '28px', color: '#3b82f6'}}>
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Panel Admin</span>
                    </h1>
                </div>

                <nav className="admin-nav">
                    <button 
                        className={`nav-item ${activeTab === 'cats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cats')}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                        </svg>
                        <span>Gestión de Gatos</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'education' ? 'active' : ''}`}
                        onClick={() => setActiveTab('education')}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <span>Blog Educativo</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>Gestión de Usuarios</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tracking')}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Panel de Seguimiento</span>
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span>Solicitudes de Adopción</span>
                    </button>
                </nav>
            </aside>

            <main className="admin-main-content">
            {/* Tab de Solicitudes de Adopción */}
            {activeTab === 'applications' && (
                <>
                    {/* Filtros de solicitudes */}
                    <div className="admin-filters">
                        <div className="filter-group">
                            <label>Estado:</label>
                            <select 
                                value={applicationFilter} 
                                onChange={(e) => setApplicationFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Todas las solicitudes</option>
                                <option value="revision_pendiente">Pendiente de revisión</option>
                                <option value="procesando">En procesamiento</option>
                                <option value="aprobada">Aprobadas</option>
                                <option value="rechazada">Rechazadas</option>
                            </select>
                        </div>
                    </div>

                    {/* Resumen estadístico - Solicitudes */}
                    <div className="admin-summary">
                        <div className="summary-card">
                            <h3>{applications.length}</h3>
                            <p>Total Solicitudes</p>
                        </div>
                        <div className="summary-card">
                            <h3>{applications.filter(app => app.application_status === 'revision_pendiente').length}</h3>
                            <p>Pendientes</p>
                        </div>
                        <div className="summary-card">
                            <h3>{applications.filter(app => app.application_status === 'procesando').length}</h3>
                            <p>En Proceso</p>
                        </div>
                        <div className="summary-card">
                            <h3>{applications.filter(app => app.application_status === 'aprobada').length}</h3>
                            <p>Aprobadas</p>
                        </div>
                        <div className="summary-card">
                            <h3>{applications.filter(app => app.application_status === 'rechazada').length}</h3>
                            <p>Rechazadas</p>
                        </div>
                    </div>

                    {loadingApplications ? (
                        <div className="loading-spinner-container">
                            <div className="loading-spinner"></div>
                            <p>Cargando solicitudes...</p>
                        </div>
                    ) : (
                        <div className="applications-grid">
                            {groupedApplications
                                .filter(group => {
                                    if (applicationFilter === 'all') return true;
                                    return group.applications.some(app => app.application_status === applicationFilter);
                                })
                                .map(group => {
                                    // Check if there's a top candidate (Score >= 80)
                                    const hasTopCandidate = group.applications.some(app => (app.ai_suitability_score || 0) >= 80);
                                    
                                    return (
                                        <div 
                                            key={group.cat_id} 
                                            className="cat-summary-card"
                                            onClick={() => setSelectedCatGroup(group)}
                                        >
                                            <div className="cat-image-container">
                                                {group.cat_photos && group.cat_photos.length > 0 ? (
                                                    <img 
                                                        src={group.cat_photos[0]} 
                                                        alt={group.cat_name}
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/666?text=Sin+Foto';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="no-photo-placeholder">
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2C10.34 2 9 3.34 9 5c0 .35.07.69.18 1H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                {hasTopCandidate && (
                                                    <div className="top-match-badge-overlay">
                                                        <span>Top Match</span>
                                                    </div>
                                                )}

                                                <div className="cat-info-overlay">
                                                    <h3>{group.cat_name}</h3>
                                                    <p>ID: {group.cat_id}</p>
                                                </div>
                                            </div>

                                            <div className="cat-card-footer">
                                                <div className="request-count">
                                                    <span className="request-count-label">SOLICITUDES</span>
                                                    <span className="request-count-number">{group.applicationCount}</span>
                                                </div>

                                                <div className="view-list-link">
                                                    Ver lista
                                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px'}}>
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                            {groupedApplications.length === 0 && (
                                <div className="empty-state">
                                    <p>No hay solicitudes con el filtro seleccionado</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Modal de grupo de solicitudes por gato */}
                    {selectedCatGroup && !selectedApplication && (
                        <div className="modal-overlay" onClick={() => setSelectedCatGroup(null)}>
                            <div className="modal-content modal-cat-applications" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header-sticky">
                                    <h2>Solicitudes para {selectedCatGroup.cat_name}</h2>
                                    <button 
                                        className="modal-close-btn"
                                        onClick={() => setSelectedCatGroup(null)}
                                        style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div className="modal-scroll-body">
                                    {selectedCatGroup.applications
                                        .filter(app => applicationFilter === 'all' || app.application_status === applicationFilter)
                                        .sort((a, b) => (b.ai_suitability_score || 0) - (a.ai_suitability_score || 0))
                                        .map(application => {
                                            // Determine border color based on score
                                            let borderClass = 'border-gray';
                                            if ((application.ai_suitability_score || 0) >= 80) borderClass = 'border-green';
                                            else if ((application.ai_suitability_score || 0) >= 50) borderClass = 'border-yellow';

                                            return (
                                                <div key={application.id} className={`request-item-card ${borderClass}`}>
                                                    <div className="request-header">
                                                        <div>
                                                            <h4 className="applicant-name">{application.applicant_name}</h4>
                                                            <span className="request-time">
                                                                {new Date(application.created_at).toLocaleDateString('es-ES', {
                                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                                })}
                                                            </span>
                                                            <div style={{marginTop: '4px'}}>
                                                                <span className={`status-badge status-${application.application_status}`} style={{fontSize: '0.75rem'}}>
                                                                    {application.application_status === 'revision_pendiente' && 'Pendiente'}
                                                                    {application.application_status === 'procesando' && 'Procesando'}
                                                                    {application.application_status === 'aprobada' && 'Aprobada'}
                                                                    {application.application_status === 'rechazada' && 'Rechazada'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="score-display">
                                                            <span className="score-number">{application.ai_suitability_score || 0}</span>
                                                            <span className="score-label">IA Score</span>
                                                        </div>
                                                    </div>

                                                    {/* Tags */}
                                                    {application.ai_flags && application.ai_flags.length > 0 && (
                                                        <div className="tags-container">
                                                            {application.ai_flags.map((flag, idx) => {
                                                                let tagClass = '';
                                                                if (flag.includes('Casa') || flag.includes('Veterinario') || flag.includes('Experiencia')) tagClass = 'positive';
                                                                if (flag.includes('Calle') || flag.includes('Riesgo')) tagClass = 'warning';
                                                                
                                                                return (
                                                                    <span key={idx} className={`ai-tag ${tagClass}`}>
                                                                        {flag}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* AI Feedback Quote */}
                                                    {application.ai_feedback && (
                                                        <div className="ai-feedback-quote">
                                                            <span>"{application.ai_feedback}"</span>
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="btn-approve-sm"
                                                            onClick={() => setSelectedApplication(application)}
                                                        >
                                                            Ver Detalles Completos
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal de detalles de solicitud */}
                    {selectedApplication && (
                        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                            <div className="modal-content modal-detail-enhanced" onClick={(e) => e.stopPropagation()}>
                                <button className="modal-close" onClick={() => setSelectedApplication(null)}>
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                <div className="modal-header-enhanced">
                                    <h2>Detalles de la Solicitud</h2>
                                    <p className="subtitle">Para: <strong>{selectedApplication.cat_name}</strong></p>
                                </div>
                                
                                <div className="application-details-grid">
                                    {/* Columna Izquierda: Datos del Solicitante */}
                                    <div className="detail-column">
                                        <h4 className="column-header">DATOS DEL SOLICITANTE</h4>
                                        
                                        <div className="detail-group">
                                            <label>NOMBRE</label>
                                            <div className="detail-value">{selectedApplication.applicant_name}</div>
                                        </div>
                                        
                                        <div className="detail-group">
                                            <label>EMAIL</label>
                                            <a href={`mailto:${selectedApplication.applicant_email}`} className="detail-link">
                                                {selectedApplication.applicant_email}
                                            </a>
                                        </div>
                                        
                                        <div className="detail-group">
                                            <label>TELÉFONO</label>
                                            <div className="detail-value">{selectedApplication.applicant_phone || 'No especificado'}</div>
                                        </div>
                                        
                                        <div className="detail-group">
                                            <label>EDAD</label>
                                            <div className="detail-value">{selectedApplication.applicant_age ? `${selectedApplication.applicant_age} años` : 'No especificado'}</div>
                                        </div>
                                        
                                        <div className="detail-group">
                                            <label>OCUPACIÓN</label>
                                            <div className="detail-value">{selectedApplication.applicant_occupation || 'No especificado'}</div>
                                        </div>
                                    </div>

                                    {/* Columna Derecha: Perfil del Hogar */}
                                    <div className="detail-column">
                                        <h4 className="column-header">PERFIL DEL HOGAR</h4>
                                        
                                        <div className="detail-group">
                                            <label>VIVIENDA</label>
                                            <div className="detail-value">
                                                <span className="badge badge-blue">
                                                    {selectedApplication.living_situation || 'No especificado'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="detail-group">
                                            <label>MASCOTAS ACTUALES</label>
                                            <div className="detail-value">
                                                <span className={`badge ${selectedApplication.has_other_pets ? 'badge-neutral' : 'badge-neutral'}`}>
                                                    {selectedApplication.has_other_pets ? 'TIENE MASCOTAS' : 'NO TIENE MASCOTAS'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="detail-group">
                                            <label>EXPERIENCIA</label>
                                            <div className="detail-value">
                                                <span className={`badge ${selectedApplication.experience_with_cats ? 'badge-green' : 'badge-neutral'}`}>
                                                    {selectedApplication.experience_with_cats ? 'TIENE EXPERIENCIA' : 'SIN EXPERIENCIA'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bloque de Razón de Adopción */}
                                <div className="reason-block">
                                    <h4 className="reason-header">RAZÓN DE ADOPCIÓN</h4>
                                    <p className="reason-text">
                                        "{selectedApplication.reason_for_adoption || 'No especificado'}"
                                    </p>
                                </div>

                                {/* Evaluación IA */}
                                {selectedApplication.ai_suitability_score != null && (
                                    <div className="ai-evaluation-block">
                                        <div className="ai-header">
                                            <h4>ANÁLISIS DE IA</h4>
                                            <span className={`score-badge score-${Math.floor((selectedApplication.ai_suitability_score || 0) / 20)}`}>
                                                {selectedApplication.ai_suitability_score}/100
                                            </span>
                                        </div>
                                        
                                        {selectedApplication.ai_feedback && (
                                            <p className="ai-feedback-text">{selectedApplication.ai_feedback}</p>
                                        )}
                                        
                                        {selectedApplication.ai_flags && selectedApplication.ai_flags.length > 0 && (
                                            <div className="ai-flags-container">
                                                {selectedApplication.ai_flags.map((flag, idx) => (
                                                    <span key={idx} className="ai-flag-badge">{flag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Footer con Acciones */}
                                <div className="modal-footer-enhanced">
                                    <div className="footer-info">
                                        <span className="date-info">Solicitado el {new Date(selectedApplication.created_at).toLocaleDateString('es-ES')}</span>
                                        <span className={`status-badge status-${selectedApplication.application_status}`}>
                                            {selectedApplication.application_status}
                                        </span>
                                    </div>
                                    <div className="footer-actions">
                                        <button className="btn-secondary" onClick={() => setSelectedApplication(null)}>
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Tab de Gestión de Gatos */}
            {activeTab === 'cats' && (
                <>
                    {/* Resumen estadístico - Gatos */}
                    {summary && (
                        <div className="admin-summary">
                            <div className="summary-card">
                                <h3>{summary.total}</h3>
                                <p>Total Gatos</p>
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

            {/* Filtros y Toggle */}
            <div className="admin-filters-bar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px'}}>
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
                
                <div className="view-toggle">
                    <button 
                        className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Vista Cuadrícula"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '20px', height: '20px'}}>
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button 
                        className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="Vista Lista"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '20px', height: '20px'}}>
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Lista de gatos */}
            {filteredCats.length === 0 ? (
                <p className="no-results">No hay publicaciones {filter === 'all' ? '' : filter + 's'}.</p>
            ) : viewMode === 'grid' ? (
                <div className="admin-cats-grid">
                    {filteredCats.map((cat) => {
                        const currentPhotoIndex = photoIndexes[cat.id] || 0;
                        const photos = cat.photos_url && cat.photos_url.length > 0 
                            ? cat.photos_url 
                            : ['https://placehold.co/300x300/e0e0e0/666?text=Sin+Foto'];
                        const currentPhoto = photos[currentPhotoIndex];
                        
                        const handlePrevPhoto = (e: React.MouseEvent) => {
                            e.stopPropagation();
                            setPhotoIndexes(prev => ({
                                ...prev,
                                [cat.id]: currentPhotoIndex === 0 ? photos.length - 1 : currentPhotoIndex - 1
                            }));
                        };

                        const handleNextPhoto = (e: React.MouseEvent) => {
                            e.stopPropagation();
                            setPhotoIndexes(prev => ({
                                ...prev,
                                [cat.id]: currentPhotoIndex === photos.length - 1 ? 0 : currentPhotoIndex + 1
                            }));
                        };

                        return (
                            <div key={cat.id} className="admin-cat-card-compact">
                            <div className="cat-image-container admin-cat-image-container">
                                <img 
                                    src={currentPhoto} 
                                    alt={`${cat.name} - Foto ${currentPhotoIndex + 1}`}
                                    className="cat-thumbnail-compact"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/300x300/e0e0e0/666?text=Sin+Foto';
                                    }}
                                />
                                
                                {/* Controles de navegación si hay más de una foto */}
                                {photos.length > 1 && (
                                    <>
                                        <button 
                                            className="admin-photo-nav admin-photo-prev"
                                            onClick={handlePrevPhoto}
                                            aria-label="Foto anterior"
                                        >
                                            <svg viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button 
                                            className="admin-photo-nav admin-photo-next"
                                            onClick={handleNextPhoto}
                                            aria-label="Foto siguiente"
                                        >
                                            <svg viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                        {/* Indicadores de foto */}
                                        <div className="admin-photo-indicators">
                                            {photos.map((_, index) => (
                                                <span
                                                    key={index}
                                                    className={`admin-photo-dot ${index === currentPhotoIndex ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPhotoIndexes(prev => ({
                                                            ...prev,
                                                            [cat.id]: index
                                                        }));
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        
                                        {/* Contador de fotos */}
                                        <div className="admin-photo-counter">
                                            {currentPhotoIndex + 1} / {photos.length}
                                        </div>
                                    </>
                                )}
                                
                                <span className={`status-badge-overlay ${getStatusColor(cat.approval_status)}`}>
                                    {cat.approval_status}
                                </span>
                            </div>

                            <div className="cat-content-compact">
                                <h3 className="cat-name-compact">{cat.name}</h3>
                                
                                <div className="cat-quick-info">
                                    <span className="info-tag">{cat.age}</span>
                                    <span className="info-tag">{cat.sterilization_status}</span>
                                </div>

                                <p className="cat-description-compact">{cat.description}</p>
                                
                                <div className="cat-meta">
                                    <p className="meta-text">
                                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px', display: 'inline', marginRight: '4px'}}>
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        {cat.owner_name}
                                    </p>
                                    <p className="meta-text">
                                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px', display: 'inline', marginRight: '4px'}}>
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        {new Date(cat.created_at).toLocaleDateString('es-ES')}
                                    </p>
                                </div>

                                <div className="cat-actions-compact">
                                    {cat.approval_status === 'pendiente' && (
                                        <>
                                            <button 
                                                className="btn-compact btn-approve"
                                                onClick={() => handleApproval(cat.id, 'aprobado')}
                                                title="Aprobar"
                                            >
                                                <svg viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button 
                                                className="btn-compact btn-reject"
                                                onClick={() => handleApproval(cat.id, 'rechazado')}
                                                title="Rechazar"
                                            >
                                                <svg viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                    
                                    <button 
                                        className="btn-compact btn-edit"
                                        onClick={() => setEditingCat(cat)}
                                        title="Editar"
                                    >
                                        <svg viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    
                                    <button 
                                        className="btn-compact btn-delete"
                                        onClick={() => handleDelete(cat.id)}
                                        title="Eliminar"
                                    >
                                        <svg viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="admin-cats-list">
                    {filteredCats.map((cat) => (
                        <div key={cat.id} className="cat-list-item">
                            <img 
                                src={cat.photos_url && cat.photos_url.length > 0 ? cat.photos_url[0] : 'https://placehold.co/300x300/e0e0e0/666?text=Sin+Foto'} 
                                alt={cat.name}
                                className="cat-list-image"
                            />
                            <div className="cat-list-info">
                                <h3>{cat.name}</h3>
                                <p>{cat.description}</p>
                            </div>
                            <div className="cat-list-meta">
                                <span>{cat.age}</span>
                                <span>{cat.sterilization_status}</span>
                            </div>
                            <div className="cat-list-meta-secondary">
                                <div className="meta-text">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px', display: 'inline', marginRight: '4px'}}>
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    {cat.owner_name}
                                </div>
                                <div className="meta-text">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px', display: 'inline', marginRight: '4px'}}>
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    {new Date(cat.created_at).toLocaleDateString('es-ES')}
                                </div>
                            </div>
                            <div className="cat-list-status">
                                <span className={`status-badge-overlay ${getStatusColor(cat.approval_status)}`} style={{position: 'static', display: 'inline-block'}}>
                                    {cat.approval_status}
                                </span>
                            </div>
                            <div className="cat-list-actions">
                                <button 
                                    className="btn-compact btn-edit"
                                    onClick={() => setEditingCat(cat)}
                                    title="Editar"
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button 
                                    className="btn-compact btn-delete"
                                    onClick={() => handleDelete(cat.id)}
                                    title="Eliminar"
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
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
                            <label>Historia del gato (opcional):</label>
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

            {/* Tab de Blog Educativo */}
            {activeTab === 'education' && (
                <div className="education-section">
                    <div className="section-header">
                        <h2>
                            <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '28px', height: '28px', marginRight: '12px'}}>
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            Gestión del Blog Educativo
                        </h2>
                        <button 
                            className="btn-create-post"
                            onClick={() => setShowPostForm(!showPostForm)}
                        >
                            <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '8px'}}>
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            {showPostForm ? 'Cancelar' : 'Nuevo Artículo'}
                        </button>
                    </div>

                    {/* Formulario para crear artículo */}
                    {showPostForm && (
                        <div className="post-form-card">
                            <h3>
                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px', marginRight: '10px'}}>
                                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                                </svg>
                                Nuevo Artículo del Blog
                            </h3>
                            <div className="form-group">
                                <label htmlFor="postTitle">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    Título del artículo
                                </label>
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
                                <label htmlFor="postCategory">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    </svg>
                                    Categoría del artículo
                                </label>
                                <select
                                    id="postCategory"
                                    value={postForm.category}
                                    onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                                >
                                    <option value="todos">Todos (General)</option>
                                    <option value="salud">Salud</option>
                                    <option value="comportamiento">Comportamiento</option>
                                    <option value="nutricion">Nutrición</option>
                                    <option value="adopcion">Adopción</option>
                                    <option value="recursos">Recursos Útiles</option>
                                    <option value="esterilizacion">Esterilización</option>
                                </select>
                                <small>Selecciona la categoría más relevante para el artículo</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="postEventDate">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Fecha del evento (opcional)
                                </label>
                                <input
                                    id="postEventDate"
                                    type="datetime-local"
                                    value={postForm.eventDate}
                                    onChange={(e) => setPostForm({ ...postForm, eventDate: e.target.value })}
                                />
                                <small>Si no especificas fecha, se usará la fecha actual</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="postImage">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    Imagen destacada (opcional)
                                </label>
                                <input
                                    id="postImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setPostImageFile(file);
                                        }
                                    }}
                                />
                                {postImageFile && (
                                    <small>Archivo seleccionado: {postImageFile.name}</small>
                                )}
                                <small>Imagen que se mostrará en el artículo</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="postContent">
                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '6px'}}>
                                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                                    </svg>
                                    Contenido del artículo
                                </label>
                                <textarea
                                    id="postContent"
                                    value={postForm.content}
                                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                                    placeholder="Escribe el contenido del artículo aquí..."
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
                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '8px'}}>
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                                Publicar Artículo
                            </button>
                        </div>
                    )}

                    {/* Lista de artículos */}
                    <div className="posts-grid">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div 
                                    key={post.id} 
                                    className="post-card-compact"
                                    onClick={() => setSelectedPost(post)}
                                >
                                    {post.image_url && (
                                        <div className="post-card-image">
                                            <img src={post.image_url} alt={post.title} />
                                        </div>
                                    )}
                                    <div className="post-card-content">
                                        <h3 className="post-card-title">{post.title}</h3>
                                        <p className="post-card-excerpt">
                                            {post.content.substring(0, 100)}...
                                        </p>
                                        <div className="post-card-meta">
                                            <span className="post-card-author">
                                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px', marginRight: '4px'}}>
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                {post.author_name}
                                            </span>
                                            <span className="post-card-date">
                                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px', marginRight: '4px'}}>
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                {new Date(post.created_at).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                        
                                        {/* Botones de acción explícitos */}
                                        <div className="post-actions" style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px'}}>
                                            <button 
                                                className="btn-compact btn-edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPost(post);
                                                    setEditingPost(post);
                                                    setEditingPostEventDate(post.event_date ? post.event_date.split('T')[0] : '');
                                                }}
                                                title="Editar Artículo"
                                                style={{flex: 1, justifyContent: 'center'}}
                                            >
                                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '4px'}}>
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                                Editar
                                            </button>
                                            <button 
                                                className="btn-compact btn-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePost(post.id);
                                                }}
                                                title="Eliminar Artículo"
                                                style={{flex: 1, justifyContent: 'center'}}
                                            >
                                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px', marginRight: '4px'}}>
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-posts">
                                <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '64px', height: '64px', opacity: 0.2, marginBottom: '16px'}}>
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                <p>No hay artículos del blog publicados aún.</p>
                                <p className="empty-subtitle">Haz clic en "Nuevo Artículo" para comenzar a escribir.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de detalle de post */}
            {selectedPost && (
                <div className="post-detail-modal-overlay" onClick={() => {
                    setSelectedPost(null);
                    setEditingPost(null);
                    setEditingPostImageFile(null);
                    setEditingPostEventDate('');
                }}>
                    <div className="post-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => {
                            setSelectedPost(null);
                            setEditingPost(null);
                            setEditingPostImageFile(null);
                            setEditingPostEventDate('');
                        }}>
                            <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {editingPost?.id === selectedPost.id ? (
                            // Modo edición
                                        <div className="post-edit-form">
                                            <input
                                                type="text"
                                                value={editingPost.title}
                                                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                                className="edit-input-title"
                                            />
                                            
                                            <div className="edit-category-section" style={{ marginBottom: '16px' }}>
                                                <label htmlFor={`edit-category-${selectedPost.id}`}>Categoría</label>
                                                <select
                                                    id={`edit-category-${selectedPost.id}`}
                                                    value={editingPost.category || 'todos'}
                                                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                                                    className="edit-input"
                                                    style={{ marginTop: '8px' }}
                                                >
                                                    <option value="todos">Todos (General)</option>
                                                    <option value="salud">Salud</option>
                                                    <option value="comportamiento">Comportamiento</option>
                                                    <option value="nutricion">Nutrición</option>
                                                    <option value="adopcion">Adopción</option>
                                                    <option value="recursos">Recursos Útiles</option>
                                                    <option value="esterilizacion">Esterilización</option>
                                                </select>
                                            </div>
                                            
                                            <textarea
                                                value={editingPost.content}
                                                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                                rows={6}
                                                className="edit-textarea"
                                            />
                                            
                                            {/* Campo para fecha de evento */}
                                            <div className="edit-date-section" style={{ marginBottom: '16px' }}>
                                                <label htmlFor={`edit-date-${selectedPost.id}`}>Fecha de evento (opcional)</label>
                                                <input
                                                    id={`edit-date-${selectedPost.id}`}
                                                    type="date"
                                                    value={editingPostEventDate}
                                                    onChange={(e) => setEditingPostEventDate(e.target.value)}
                                                    className="edit-input"
                                                    style={{ marginTop: '8px' }}
                                                />
                                            </div>
                                            
                                            {/* Campo para cambiar imagen */}
                                            <div className="edit-image-section">
                                                <label htmlFor={`edit-image-${selectedPost.id}`}>Cambiar imagen (opcional)</label>
                                                {editingPost.image_url && !editingPostImageFile && (
                                                    <div className="current-image-preview">
                                                        <small>Imagen actual:</small>
                                                        <img 
                                                            src={editingPost.image_url} 
                                                            alt="Vista previa" 
                                                            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', marginTop: '8px' }}
                                                        />
                                                    </div>
                                                )}
                                                <input
                                                    id={`edit-image-${selectedPost.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setEditingPostImageFile(file);
                                                        }
                                                    }}
                                                    style={{ marginTop: '8px' }}
                                                />
                                                {editingPostImageFile && (
                                                    <small style={{ display: 'block', marginTop: '4px' }}>
                                                        Nueva imagen: {editingPostImageFile.name}
                                                    </small>
                                                )}
                                            </div>
                                            
                                            <div className="post-actions">
                                                <button 
                                                    className="btn-save-post"
                                                    onClick={handleUpdatePost}
                                                >
                                                    Guardar
                                                </button>
                                                <button 
                                                    className="btn-cancel-post"
                                                    onClick={() => {
                                                        setEditingPost(null);
                                                        setEditingPostImageFile(null);
                                                        setEditingPostEventDate('');
                                                    }}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Modo vista
                                        <div className="post-modal-view">
                                            <h2 className="post-modal-title">{selectedPost.title}</h2>
                                            
                                            {selectedPost.image_url && (
                                                <div className="post-modal-image">
                                                    <img src={selectedPost.image_url} alt={selectedPost.title} />
                                                </div>
                                            )}
                                            
                                            <div className="post-modal-meta">
                                                <span className="post-modal-author">
                                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px'}}>
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    Autor: {selectedPost.author_name}
                                                </span>
                                                <span className="post-modal-date">
                                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '6px'}}>
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                    {new Date(selectedPost.created_at).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            
                                            <div className="post-modal-content">
                                                <p>{selectedPost.content}</p>
                                            </div>
                                            
                                            <div className="post-modal-actions">
                                                <button 
                                                    className="btn-edit-post-modal"
                                                    onClick={() => {
                                                        setEditingPost(selectedPost);
                                                        setEditingPostEventDate(selectedPost.event_date ? selectedPost.event_date.split('T')[0] : '');
                                                    }}
                                                >
                                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '8px'}}>
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                    Editar Artículo
                                                </button>
                                                <button 
                                                    className="btn-delete-post-modal"
                                                    onClick={() => handleDeletePost(selectedPost.id)}
                                                >
                                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '18px', height: '18px', marginRight: '8px'}}>
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Eliminar Artículo
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                </div>
                            )}

            {/* Tab de Gestión de Usuarios */}
            {activeTab === 'users' && (
                <div className="users-section">
                    <div className="section-header">
                        <div>
                            <h2>Gestión de Usuarios</h2>
                            <p className="section-subtitle">Administra los roles de los usuarios de la plataforma</p>
                        </div>
                        <div className="section-actions">
                            <span className="stat-badge">Total: {users.length}</span>
                            <button 
                                className="btn-create-user"
                                onClick={() => setShowCreateUserForm(!showCreateUserForm)}
                            >
                                {showCreateUserForm ? 'Cancelar' : '+ Nuevo Usuario'}
                            </button>
                        </div>
                    </div>

                    {/* Formulario para crear nuevo usuario */}
                    {showCreateUserForm && (
                        <div className="create-user-form">
                            <h3>Crear Nuevo Usuario</h3>
                            <p className="form-subtitle">Los rescatistas solo pueden ser creados desde este panel</p>
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Nombre Completo *</label>
                                    <input
                                        type="text"
                                        value={newUserForm.fullName}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                                        placeholder="Ej: Juan Pérez"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={newUserForm.email}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                        placeholder="usuario@ejemplo.com"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Contraseña *</label>
                                    <input
                                        type="password"
                                        value={newUserForm.password}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Teléfono</label>
                                    <input
                                        type="tel"
                                        value={newUserForm.phone}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                                        placeholder="+591 7123 4567"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Rol *</label>
                                    <select
                                        value={newUserForm.role}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                                    >
                                        <option value="rescatista">Rescatista</option>
                                        <option value="adoptante">Adoptante</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button 
                                    className="btn-save"
                                    onClick={handleCreateUser}
                                >
                                    Crear Usuario
                                </button>
                                <button 
                                    className="btn-cancel"
                                    onClick={() => {
                                        setShowCreateUserForm(false);
                                        setNewUserForm({
                                            email: '',
                                            password: '',
                                            fullName: '',
                                            role: 'rescatista',
                                            phone: ''
                                        });
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {loadingUsers ? (
                        <div className="loading-message">
                            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                            <p>Cargando usuarios...</p>
                        </div>
                    ) : users.length > 0 ? (
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
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
                                            <td>{user.full_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || 'N/A'}</td>
                                            <td>
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role === 'adoptante' && 'Adoptante'}
                                                    {user.role === 'rescatista' && 'Rescatista'}
                                                    {user.role === 'admin' && 'Admin'}
                                                </span>
                                            </td>
                                            <td>{new Date(user.created_at).toLocaleDateString('es-ES')}</td>
                                            <td>
                                                <button 
                                                    className="btn-change-role"
                                                    onClick={() => handleChangeUserRole(user.id, user.role)}
                                                    title="Cambiar Rol"
                                                >
                                                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px'}}>
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-users">
                            <p>No se encontraron usuarios.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tab de Panel de Seguimiento */}
            {activeTab === 'tracking' && (
                <div className="tracking-tab">
                    <h2 className="tracking-title">
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px', marginRight: '12px'}}>
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Panel de Seguimiento - Todas las Tareas
                    </h2>

                    {loadingTasks ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Cargando tareas...</p>
                        </div>
                    ) : trackingTasks.length > 0 ? (
                        <div className="tracking-tasks-container">
                            <div className="tasks-summary-info">
                                <p>Total de tareas: <strong>{trackingTasks.length}</strong></p>
                                <p>
                                    <span className="status-badge-inline pendiente">
                                        Pendientes: {trackingTasks.filter(t => t.status === 'pendiente').length}
                                    </span>
                                    <span className="status-badge-inline atrasada">
                                        Atrasadas: {trackingTasks.filter(t => t.status === 'atrasada').length}
                                    </span>
                                    <span className="status-badge-inline completada">
                                        Completadas: {trackingTasks.filter(t => t.status === 'completada').length}
                                    </span>
                                </p>
                            </div>

                            <div className="tasks-table-wrapper">
                                <table className="tasks-table">
                                    <thead>
                                        <tr>
                                            <th>Tipo de Tarea</th>
                                            <th>Gato</th>
                                            <th>Adoptante</th>
                                            <th>Rescatista</th>
                                            <th>Fecha Límite</th>
                                            <th>Estado</th>
                                            <th>Descripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trackingTasks.map((task) => (
                                            <tr 
                                                key={task.id} 
                                                className={`task-row ${task.status}`}
                                                onClick={() => setSelectedTask(task)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>
                                                    <span className={`task-type-badge ${task.task_type === 'Seguimiento de Esterilización' ? 'sterilization' : 'welfare'}`}>
                                                        {task.task_type}
                                                    </span>
                                                </td>
                                                <td className="cat-name">{task.cat_name}</td>
                                                <td>
                                                    <div className="applicant-info">
                                                        <span className="applicant-name">{task.applicant_name}</span>
                                                        {task.applicant_phone && (
                                                            <span className="applicant-phone">{task.applicant_phone}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="owner-name">{task.owner_name}</td>
                                                <td className={`due-date ${task.status === 'atrasada' ? 'overdue' : ''}`}>
                                                    {new Date(task.due_date).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${task.status}`}>
                                                        {task.status === 'pendiente' && 'Pendiente'}
                                                        {task.status === 'atrasada' && 'Atrasada'}
                                                        {task.status === 'completada' && 'Completada'}
                                                    </span>
                                                </td>
                                                <td className="task-description">
                                                    {task.description || 'Sin descripción'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-tasks">
                            <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '48px', height: '48px', marginBottom: '16px', opacity: 0.3}}>
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <p>No hay tareas de seguimiento registradas.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de detalle de tarea */}
            {selectedTask && (
                <div className="task-detail-modal-overlay" onClick={() => setSelectedTask(null)}>
                    <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedTask(null)}>
                            <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '24px', height: '24px'}}>
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        <h2 className="task-modal-title">
                            <svg viewBox="0 0 20 20" fill="currentColor" style={{width: '28px', height: '28px', marginRight: '12px'}}>
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Detalle de Tarea de Seguimiento
                        </h2>

                        <div className="task-modal-content">
                            <div className="task-detail-section">
                                <h3>Información General</h3>
                                <div className="task-detail-grid">
                                    <div className="task-detail-item">
                                        <label>Tipo de Tarea:</label>
                                        <span className={`task-type-badge ${selectedTask.task_type === 'Seguimiento de Esterilización' ? 'sterilization' : 'welfare'}`}>
                                            {selectedTask.task_type}
                                        </span>
                                    </div>
                                    <div className="task-detail-item">
                                        <label>Estado:</label>
                                        <span className={`status-badge ${selectedTask.status}`}>
                                            {selectedTask.status === 'pendiente' && 'Pendiente'}
                                            {selectedTask.status === 'atrasada' && 'Atrasada'}
                                            {selectedTask.status === 'completada' && 'Completada'}
                                        </span>
                                    </div>
                                    <div className="task-detail-item">
                                        <label>Fecha Límite:</label>
                                        <span className={`due-date-text ${selectedTask.status === 'atrasada' ? 'overdue' : ''}`}>
                                            {new Date(selectedTask.due_date).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    {selectedTask.sterilization_status && (
                                        <div className="task-detail-item">
                                            <label>Estado de Esterilización:</label>
                                            <span className="sterilization-status">{selectedTask.sterilization_status}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="task-detail-section">
                                <h3>Información del Gato</h3>
                                <div className="task-detail-grid">
                                    <div className="task-detail-item">
                                        <label>Nombre del Gato:</label>
                                        <span className="cat-name-modal">{selectedTask.cat_name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="task-detail-section">
                                <h3>Información del Adoptante</h3>
                                <div className="task-detail-grid">
                                    <div className="task-detail-item">
                                        <label>Nombre:</label>
                                        <span>{selectedTask.applicant_name}</span>
                                    </div>
                                    {selectedTask.applicant_phone && (
                                        <div className="task-detail-item">
                                            <label>Teléfono:</label>
                                            <a href={`tel:${selectedTask.applicant_phone}`} className="phone-link">
                                                {selectedTask.applicant_phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="task-detail-section">
                                <h3>Rescatista Responsable</h3>
                                <div className="task-detail-grid">
                                    <div className="task-detail-item">
                                        <label>Nombre:</label>
                                        <span className="owner-name-modal">{selectedTask.owner_name}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedTask.description && (
                                <div className="task-detail-section">
                                    <h3>Descripción</h3>
                                    <p className="task-description-full">{selectedTask.description}</p>
                                </div>
                            )}
                        </div>

                        <div className="task-modal-footer">
                            <button className="btn-close-modal" onClick={() => setSelectedTask(null)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            </main>

            <CustomModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                onConfirm={modalState.onConfirm}
                inputPlaceholder={modalState.inputPlaceholder}
                inputDefaultValue={modalState.inputDefaultValue}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
            />
        </div>
    );
};

export default AdminDashboard;
