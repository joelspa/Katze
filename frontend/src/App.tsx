// Componente principal de la aplicación
// Configura rutas y proveedores de contexto para toda la aplicación

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Componentes que se cargan inmediatamente (críticos)
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading de páginas para mejorar performance
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const CatDetailPage = lazy(() => import('./pages/CatDetailPage'));
const Catalog = lazy(() => import('./pages/Catalog'));
const RescuerDashboard = lazy(() => import('./pages/RescuerDashboard'));
const TrackingDashboard = lazy(() => import('./pages/TrackingDashboard'));
const PublishCat = lazy(() => import('./pages/PublishCat'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Education = lazy(() => import('./pages/Education'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component reutilizable
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh',
    color: 'var(--color-primary)'
  }}>
    <div style={{ fontSize: '1.2rem' }}>Cargando...</div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main className="page-container">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cats/:id" element={<CatDetailPage />} />
                <Route path="/catalogo" element={<Catalog />} />
                <Route path="/education" element={<Education />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['rescatista', 'admin']}>
                      <RescuerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tracking"
                  element={
                    <ProtectedRoute allowedRoles={['rescatista', 'admin']}>
                      <TrackingDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/publish"
                  element={
                    <ProtectedRoute allowedRoles={['rescatista']}>
                      <PublishCat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['adoptante', 'rescatista', 'admin']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                {/* Ruta 404 - debe ir al final */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;