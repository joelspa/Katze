// Componente principal de la aplicación
// Configura rutas y proveedores de contexto para toda la aplicación

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Importación de páginas
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CatDetailPage from './pages/CatDetailPage';
import RescuerDashboard from './pages/RescuerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TrackingDashboard from './pages/TrackingDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 2. Coloca el Navbar aquí, fuera de <Routes> */}
        <Navbar />

        <Routes>
          {/* ... (Todas tus rutas <Route> van aquí) ... */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cats/:id" element={<CatDetailPage />} />
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
        </Routes>

        {/* Aquí podrías poner un Footer */}

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;