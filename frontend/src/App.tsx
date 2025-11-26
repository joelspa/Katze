// Componente principal de la aplicación
// Configura rutas y proveedores de contexto para toda la aplicación

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importación de páginas
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CatDetailPage from './pages/CatDetailPage';
import Catalog from './pages/Catalog';
import RescuerDashboard from './pages/RescuerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TrackingDashboard from './pages/TrackingDashboard';
import Navbar from './components/Navbar';
import PublishCat from './pages/PublishCat';
import AdminDashboard from './pages/AdminDashboard';
import Education from './pages/Education';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="page-container">
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
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;