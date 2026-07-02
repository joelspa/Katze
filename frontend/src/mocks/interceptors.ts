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

const MOCK_DELAY_MS = 350;
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

function ok(data: unknown, config: InternalAxiosRequestConfig): AxiosResponse {
    return { data, status: 200, statusText: 'OK', headers: {}, config };
}

function mockError(message: string, status: number, config: InternalAxiosRequestConfig): never {
    const err = Object.assign(new Error(message), {
        isAxiosError: true,
        config,
        response: { data: { message }, status, statusText: String(status), headers: {}, config },
    });
    throw err;
}

function extractPath(url: string): string {
    try { return new URL(url).pathname; }
    catch { return url.replace(/^https?:\/\/[^/]+/, '').split('?')[0]; }
}

function extractQuery(url: string): URLSearchParams {
    try { return new URL(url).searchParams; }
    catch { const i = url.indexOf('?'); return new URLSearchParams(i >= 0 ? url.slice(i + 1) : ''); }
}

function parseBody(config: InternalAxiosRequestConfig): Record<string, unknown> {
    if (!config.data) return {};
    if (typeof config.data === 'string') {
        try { return JSON.parse(config.data); } catch { return {}; }
    }
    if (config.data instanceof FormData) return {};
    return config.data as Record<string, unknown>;
}

// Mutable in-memory stores so CRUD operations work within the session
let postsStore    = [...MOCK_EDUCATION_POSTS];
let usersStore    = [...MOCK_USERS];
let catsStore     = [...MOCK_ADMIN_CATS];
let appsStore     = [...MOCK_APPLICATIONS];
let trackingStore = [...MOCK_TRACKING_TASKS];

const usersByEmail: Record<string, typeof MOCK_USERS[0]> = {};
MOCK_USERS.forEach(u => { usersByEmail[u.email] = u; });

// ─── MOCK ADAPTER ────────────────────────────────────────────────────────────

async function handleRequest(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    await delay(MOCK_DELAY_MS);

    const url    = config.url ?? '';
    const method = (config.method ?? 'get').toLowerCase();
    const path   = extractPath(url);
    const query  = extractQuery(url);
    const body   = parseBody(config);

    // ── AUTH ────────────────────────────────────────────────────────────────

    if (path === '/api/auth/login' && method === 'post') {
        const user = usersByEmail[String(body.email ?? '')];
        if (!user || body.password !== 'demo1234') {
            mockError('Email o contraseña incorrectos', 401, config);
        }
        return ok({ data: { token: 'mock-jwt-demo', user: { id: user.id, email: user.email, role: user.role } } }, config);
    }

    if (path === '/api/auth/register' && method === 'post') {
        return ok({ message: 'Usuario registrado exitosamente' }, config);
    }

    // ── PROFILE ─────────────────────────────────────────────────────────────

    if (path === '/api/users/profile' && method === 'get') {
        return ok({ data: { user: MOCK_PROFILE } }, config);
    }

    if (path === '/api/users/profile' && method === 'put') {
        Object.assign(MOCK_PROFILE, body);
        return ok({ data: { user: MOCK_PROFILE } }, config);
    }

    // ── CATS (public) ───────────────────────────────────────────────────────

    if (path === '/api/cats' && method === 'get') {
        let cats = [...MOCK_CATS];
        const s = query.get('sterilization_status');
        const a = query.get('age');
        const l = query.get('living_space');
        if (s) cats = cats.filter(c => c.sterilization_status === s);
        if (a) cats = cats.filter(c => String(c.age).toLowerCase().includes(a.toLowerCase()));
        if (l) cats = cats.filter(c => c.living_space_requirement === l);
        return ok({ data: { cats }, cats }, config);
    }

    if (path === '/api/cats' && method === 'post') {
        return ok({ message: 'Gato publicado exitosamente. Pendiente de aprobación.' }, config);
    }

    const catDetailMatch = path.match(/^\/api\/cats\/(\d+)$/);
    if (catDetailMatch && method === 'get') {
        const cat = MOCK_CATS.find(c => c.id === Number(catDetailMatch[1]));
        if (!cat) mockError('Gato no encontrado', 404, config);
        return ok({ data: { cat } }, config);
    }

    // ── EDUCATION ───────────────────────────────────────────────────────────

    if (path === '/api/education' && method === 'get') {
        return ok({ data: { posts: postsStore }, posts: postsStore }, config);
    }

    if (path === '/api/education' && method === 'post') {
        const newPost = {
            id: Date.now(),
            author_name: 'Admin Demo',
            author_id: 1,
            created_at: new Date().toISOString(),
            ...body,
        };
        postsStore = [newPost as typeof postsStore[0], ...postsStore];
        return ok({ data: { post: newPost } }, config);
    }

    const educationMatch = path.match(/^\/api\/education\/(\d+)$/);
    if (educationMatch) {
        const postId = Number(educationMatch[1]);
        if (method === 'put') {
            postsStore = postsStore.map(p => p.id === postId ? { ...p, ...body } as typeof p : p);
            return ok({ message: 'Actualizado' }, config);
        }
        if (method === 'delete') {
            postsStore = postsStore.filter(p => p.id !== postId);
            return ok({ message: 'Eliminado' }, config);
        }
    }

    // ── TRACKING ────────────────────────────────────────────────────────────

    if (path === '/api/tracking' && method === 'get') {
        return ok({ data: { tasks: trackingStore }, tasks: trackingStore }, config);
    }

    if (path === '/api/tracking/all' && method === 'get') {
        return ok({ data: { tasks: trackingStore }, tasks: trackingStore }, config);
    }

    const trackingCompleteMatch = path.match(/^\/api\/tracking\/(\d+)\/complete$/);
    if (trackingCompleteMatch && method === 'put') {
        const taskId = Number(trackingCompleteMatch[1]);
        trackingStore = trackingStore.map(t => t.id === taskId ? { ...t, status: 'completado' } : t);
        return ok({ message: 'Tarea completada' }, config);
    }

    // ── APPLICATIONS ────────────────────────────────────────────────────────

    if (path === '/api/applications/received' && method === 'get') {
        return ok(appsStore, config);
    }

    if (path === '/api/admin/applications' && method === 'get') {
        const catIds = [...new Set(appsStore.map(a => a.cat_id))];
        const grouped = catIds.map(catId => {
            const catApps = appsStore.filter(a => a.cat_id === catId);
            const first   = catApps[0];
            return {
                cat_id: catId,
                cat_name: first.cat_name,
                cat_photos: first.cat_photos,
                applications: catApps,
                applicationCount: catApps.length,
            };
        });
        return ok({ data: { applications: grouped }, applications: grouped }, config);
    }

    const appStatusMatch = path.match(/^\/api\/applications\/(\d+)\/status$/);
    if (appStatusMatch && method === 'put') {
        const appId = Number(appStatusMatch[1]);
        appsStore = appsStore.map(a => a.id === appId ? { ...a, status: String(body.status ?? a.status) } : a);
        return ok({ message: 'Estado actualizado' }, config);
    }

    // ── STATISTICS ──────────────────────────────────────────────────────────

    if (path === '/api/statistics' && method === 'get') {
        return ok({ data: MOCK_STATISTICS }, config);
    }

    // ── ADMIN — CATS ────────────────────────────────────────────────────────

    if (path === '/api/admin/cats' && method === 'get') {
        return ok(catsStore, config);
    }

    if (path === '/api/admin/dashboard/stats' && method === 'get') {
        return ok(MOCK_ADMIN_STATS, config);
    }

    const adminCatApprovalMatch = path.match(/^\/api\/admin\/cats\/(\d+)\/approval$/);
    if (adminCatApprovalMatch && method === 'put') {
        const catId = Number(adminCatApprovalMatch[1]);
        catsStore = catsStore.map(c => c.id === catId ? { ...c, approval_status: String(body.approval_status ?? c.approval_status) as 'pendiente' | 'aprobado' | 'rechazado' } : c);
        return ok({ message: 'Estado de aprobación actualizado' }, config);
    }

    const adminCatEditMatch = path.match(/^\/api\/admin\/cats\/(\d+)\/edit$/);
    if (adminCatEditMatch && method === 'put') {
        const catId = Number(adminCatEditMatch[1]);
        catsStore = catsStore.map(c => c.id === catId ? { ...c, ...body } as typeof c : c);
        return ok({ message: 'Gato actualizado' }, config);
    }

    const adminCatDeleteMatch = path.match(/^\/api\/admin\/cats\/(\d+)$/);
    if (adminCatDeleteMatch && method === 'delete') {
        const catId = Number(adminCatDeleteMatch[1]);
        catsStore = catsStore.filter(c => c.id !== catId);
        return ok({ message: 'Gato eliminado' }, config);
    }

    // ── ADMIN — USERS ───────────────────────────────────────────────────────

    if (path === '/api/admin/users' && method === 'get') {
        return ok(usersStore, config);
    }

    if (path === '/api/admin/users' && method === 'post') {
        const newUser = { id: Date.now(), created_at: new Date().toISOString(), ...body };
        usersStore = [...usersStore, newUser as typeof usersStore[0]];
        return ok({ message: 'Usuario creado' }, config);
    }

    const adminUserRoleMatch = path.match(/^\/api\/admin\/users\/(\d+)\/role$/);
    if (adminUserRoleMatch && method === 'put') {
        const userId = Number(adminUserRoleMatch[1]);
        usersStore = usersStore.map(u => u.id === userId ? { ...u, role: (body.role ?? u.role) as typeof u.role } : u);
        return ok({ message: 'Rol actualizado' }, config);
    }

    const adminUserDeleteMatch = path.match(/^\/api\/admin\/users\/(\d+)$/);
    if (adminUserDeleteMatch && method === 'delete') {
        const userId = Number(adminUserDeleteMatch[1]);
        usersStore = usersStore.filter(u => u.id !== userId);
        return ok({ message: 'Usuario eliminado' }, config);
    }

    // ── ADMIN — DATASETS ────────────────────────────────────────────────────

    if (path === '/api/admin/datasets/regenerate' && method === 'post') {
        return ok({ message: 'Datos regenerados correctamente' }, config);
    }

    // ── NO MATCH → generic success so the app doesn't crash ─────────────────
    console.warn('[MOCK] No handler for:', method.toUpperCase(), path);
    return ok({ message: 'OK', data: [] }, config);
}

// ─── SETUP ───────────────────────────────────────────────────────────────────

export function setupMockInterceptors() {
    axios.interceptors.request.use((config) => {
        const url = config.url ?? '';
        if (!url.includes('/api/')) return config;

        // Replace the adapter for this specific request with our mock handler
        config.adapter = (c: InternalAxiosRequestConfig) => handleRequest(c);
        return config;
    });

    console.info('[MOCK] Active — all /api/* calls use demo data.');
    console.info('[MOCK] Credentials: admin@katze.com | rescatista@katze.com | adoptante@katze.com — password: demo1234');
}
