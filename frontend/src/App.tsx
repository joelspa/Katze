// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- 1. Importa

// Importa tus páginas
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CatDetailPage from './pages/CatDetailPage';
import RescuerDashboard from './pages/RescuerDashboard'; // <-- 2. Importa la página
import ProtectedRoute from './components/ProtectedRoute';
import TrackingDashboard from './pages/TrackingDashboard'; // <-- 1. Importa

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cats/:id" element={<CatDetailPage />} />

          {/* Rutas Protegidas */}
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['rescatista', 'admin']}>
                <RescuerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tracking" // <-- 2. Añade la nueva ruta
            element={
              <ProtectedRoute allowedRoles={['rescatista', 'admin']}>
                <TrackingDashboard />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;