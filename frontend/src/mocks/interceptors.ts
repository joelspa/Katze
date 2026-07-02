import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { MOCK_CATS } from './catData';
import { MOCK_EDUCATION_POSTS } from './educationData';
import {
    MOCK_USERS,
    MOCK_PROFILE,
    MOCK_TRACKING_TASKS,
    MOCK_APPLICATIONS,
    MOCK_STATISTICS,
    MOCK_ADMIN_STATS,
    MOCK_ADMIN_CATS,
} from './userData';

const MOCK_DELAY_MS = 400;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function ok(data: unknown, config: InternalAxiosRequestConfig): AxiosResponse {
    return { data, status: 200, statusText: 'OK', headers: {}, config };
}

function extractPath(url: string): string {
    try {
        return new URL(url).pathname;
    } catch {
        const match = url.match(/https?:\/\/[^/]+(\/.*)/);
        return match ? match[1] : url;
    }
}

function extractQuery(url: string): URLSearchParams {
    try {
        return new URL(url).searchParams;
    } catch {
        const idx = url.indexOf('?');
        return new URLSearchParams(idx >= 0 ? url.slice(idx + 1) : '');
    }
}

type MockAdapter = (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>;

let mockToken = 'mock-jwt-token-demo-12345';
let mockUsersByEmail: Record<string, typeof MOCK_USERS[0]> = {};
let mockPostsStore = [...MOCK_EDUCATION_POSTS];
let mockUsersStore = [...MOCK_USERS];
let mockCatsStore = [...MOCK_ADMIN_CATS];
let mockApplicationsStore = [...MOCK_APPLICATIONS];
let mockTrackingStore = [...MOCK_TRACKING_TASKS];

// Initialize lookup after stores are ready
MOCK_USERS.forEach(u => { mockUsersByEmail[u.email] = u; });

function buildMockAdapter(originalAdapter: MockAdapter): MockAdapter {
    return async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
        const url = config.url ?? '';
        const method = (config.method ?? 'get').toLowerCase();
        const path = extractPath(url);
        const query = extractQuery(url);

        await delay(MOCK_DELAY_MS);

        // ─── AUTH ────────────────────────────────────────────────────────────

        if (path === '/api/auth/login' && method === 'post') {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
            const user = mockUsersByEmail[body.email];
            if (!user || body.password !== 'demo1234') {
                const err = Object.assign(new Error('Credenciales inválidas'), {
                    response: { data: { message: 'Email o contraseña incorrectos' }, status: 401, statusText: 'Unauthorized', headers: {}, config },
                    isAxiosError: true,
                });
                return Promise.reject(err);
            }
            return ok({ data: { token: mockToken, user: { id: user.id, email: user.email, role: user.role } } }, config);
        }

        if (path === '/api/auth/register' && method === 'post') {
            return ok({ message: 'Usuario registrado exitosamente' }, config);
        }

        // ─── USERS / PROFILE ─────────────────────────────────────────────────

        if (path === '/api/users/profile' && method === 'get') {
            return ok({ data: { user: MOCK_PROFILE } }, config);
        }

        if (path === '/api/users/profile' && method === 'put') {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
            Object.assign(MOCK_PROFILE, body);
            return ok({ data: { user: MOCK_PROFILE } }, config);
        }

        // ─── CATS (public) ───────────────────────────────────────────────────

        if (path === '/api/cats' && method === 'get') {
            let cats = [...MOCK_CATS];
            const sterilization = query.get('sterilization_status');
            const age = query.get('age');
            const living = query.get('living_space');
            if (sterilization) cats = cats.filter(c => c.sterilization_status === sterilization);
            if (age) cats = cats.filter(c => String(c.age).includes(age));
            if (living) cats = cats.filter(c => c.living_space_requirement === living);
            return ok({ data: { cats }, cats }, config);
        }

        if (path === '/api/cats' && method === 'post') {
            return ok({ message: 'Gato publicado exitosamente. Pendiente de aprobación.' }, config);
        }

        const catDetailMatch = path.match(/^\/api\/cats\/(\d+)$/);
        if (catDetailMatch && method === 'get') {
            const cat = MOCK_CATS.find(c => c.id === Number(catDetailMatch[1]));
            if (!cat) {
                const err = Object.assign(new Error('Not found'), {
                    response: { data: { message: 'Gato no encontrado' }, status: 404, statusText: 'Not Found', headers: {}, config },
                    isAxiosError: true,
                });
                return Promise.reject(err);
            }
            return ok({ data: { cat } }, config);
        }

        // ─── EDUCATION ───────────────────────────────────────────────────────

        if (path === '/api/education' && method === 'get') {
            return ok({ data: { posts: mockPostsStore }, posts: mockPostsStore }, config);
        }

        if (path === '/api/education' && method === 'post') {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
            const newPost = { ...body, id: Date.now(), author_name: 'Admin Demo', author_id: 1, created_at: new Date().toISOString() };
            mockPostsStore = [newPost, ...mockPostsStore];
            return ok({ data: { post: newPost } }, config);
        }

        const educationMatch = path.match(/^\/api\/education\/(\d+)$/);
        if (educationMatch) {
            const postId = Number(educationMatch[1]);
            if (method === 'put') {
                const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
                mockPostsStore = mockPostsStore.map(p => p.id === postId ? { ...p, ...body } : p);
                return ok({ message: 'Actualizado' }, config);
            }
            if (method === 'delete') {
                mockPostsStore = mockPostsStore.filter(p => p.id !== postId);
                return ok({ message: 'Eliminado' }, config);
            }
        }

        // ─── TRACKING ────────────────────────────────────────────────────────

        if (path === '/api/tracking' && method === 'get') {
            return ok({ data: { tasks: mockTrackingStore }, tasks: mockTrackingStore }, config);
        }

        if (path === '/api/tracking/all' && method === 'get') {
            return ok({ data: { tasks: mockTrackingStore }, tasks: mockTrackingStore }, config);
        }

        const trackingCompleteMatch = path.match(/^\/api\/tracking\/(\d+)\/complete$/);
        if (trackingCompleteMatch && method === 'put') {
            const taskId = Number(trackingCompleteMatch[1]);
            mockTrackingStore = mockTrackingStore.map(t =>
                t.id === taskId ? { ...t, status: 'completado' } : t
            );
            return ok({ message: 'Tarea completada' }, config);
        }

        // ─── APPLICATIONS ────────────────────────────────────────────────────

        if (path === '/api/applications/received' && method === 'get') {
            return ok(mockApplicationsStore, config);
        }

        if (path === '/api/admin/applications' && method === 'get') {
            const grouped = MOCK_CATS.slice(0, 3).map(cat => ({
                cat_id: cat.id,
                cat_name: cat.name,
                cat_photos: cat.photos_url,
                applications: mockApplicationsStore.filter(a => a.cat_id === cat.id),
                applicationCount: mockApplicationsStore.filter(a => a.cat_id === cat.id).length,
            })).filter(g => g.applicationCount > 0);
            return ok({ data: { applications: grouped }, applications: grouped }, config);
        }

        const appStatusMatch = path.match(/^\/api\/applications\/(\d+)\/status$/);
        if (appStatusMatch && method === 'put') {
            const appId = Number(appStatusMatch[1]);
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
            mockApplicationsStore = mockApplicationsStore.map(a =>
                a.id === appId ? { ...a, status: body.status ?? a.status } : a
            );
            return ok({ message: 'Estado actualizado' }, config);
        }

        // ─── STATISTICS ──────────────────────────────────────────────────────

        if (path === '/api/statistics' && method === 'get') {
            return ok({ data: MOCK_STATISTICS }, config);
        }

        // ─── ADMIN — CATS ────────────────────────────────────────────────────

        if (path === '/api/admin/cats' && method === 'get') {
            return ok(mockCatsStore, config);
        }

        if (path === '/api/admin/dashboard/stats' && method === 'get') {
            return ok(MOCK_ADMIN_STATS, config);
        }

        const adminCatApprovalMatch = path.match(/^\/api\/admin\/cats\/(\d+)\/approval$/);
        if (adminCatApprovalMatch && method === 'put') {
            const catId = Number(adminCatApprovalMatch[1]);
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
            mockCatsStore = mockCatsStore.map(c =>
                c.id === catId ? { ...c, approval_status: body.approval_status ?? c.approval_status } : c
            );
            return ok({ message: 'Estado de aprobación actualizado' }, config);
        }

        const adminCatEditMatch = path.match(/^\/api\/admin\/cats\/(\d+)\/edit$/);
        if (adminCatEditMatch && method === 'put') {
            const catId = Number(adminCatEditMatch[1]);
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
            mockCatsStore = mockCatsStore.map(c => c.id === catId ? { ...c, ...body } : c);
            return ok({ message: 'Gato actualizado' }, config);
        }

        const adminCatDeleteMatch = path.match(/^\/api\/admin\/cats\/(\d+)$/);
        if (adminCatDeleteMatch && method === 'delete') {
            const catId = Number(adminCatDeleteMatch[1]);
            mockCatsStore = mockCatsStore.filter(c => c.id !== catId);
            return ok({ message: 'Gato eliminado' }, config);
        }

        // ─── ADMIN — USERS ───────────────────────────────────────────────────

        if (path === '/api/admin/users' && method === 'get') {
            return ok(mockUsersStore, config);
        }

        if (path === '/api/admin/users' && method === 'post') {
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
            const newUser = { id: Date.now(), created_at: new Date().toISOString(), ...body };
            mockUsersStore = [...mockUsersStore, newUser];
            mockUsersByEmail[newUser.email] = newUser;
            return ok({ message: 'Usuario creado' }, config);
        }

        const adminUserRoleMatch = path.match(/^\/api\/admin\/users\/(\d+)\/role$/);
        if (adminUserRoleMatch && method === 'put') {
            const userId = Number(adminUserRoleMatch[1]);
            const body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {});
            mockUsersStore = mockUsersStore.map(u => u.id === userId ? { ...u, role: body.role ?? u.role } : u);
            return ok({ message: 'Rol actualizado' }, config);
        }

        const adminUserDeleteMatch = path.match(/^\/api\/admin\/users\/(\d+)$/);
        if (adminUserDeleteMatch && method === 'delete') {
            const userId = Number(adminUserDeleteMatch[1]);
            mockUsersStore = mockUsersStore.filter(u => u.id !== userId);
            return ok({ message: 'Usuario eliminado' }, config);
        }

        // ─── ADMIN — DATASETS ────────────────────────────────────────────────

        if (path === '/api/admin/datasets/regenerate' && method === 'post') {
            return ok({ message: 'Datos regenerados correctamente' }, config);
        }

        // ─── FALLTHROUGH — use real adapter ──────────────────────────────────
        return originalAdapter(config);
    };
}

export function setupMockInterceptors() {
    const originalAdapter = axios.defaults.adapter as MockAdapter;
    axios.defaults.adapter = buildMockAdapter(originalAdapter);
    console.info('[MOCK] Mock data layer activo — todas las llamadas a /api/* usan datos de demo.');
    console.info('[MOCK] Credenciales de prueba: email = admin@katze.com / rescatista@katze.com / adoptante@katze.com — contraseña = demo1234');
}
