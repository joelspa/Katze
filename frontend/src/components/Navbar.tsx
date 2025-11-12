// frontend/src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Crearemos este CSS

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Limpia el contexto y localStorage
        navigate('/'); // Envía al usuario al inicio
    };

    const isLoggedIn = isAuthenticated();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Katze 🐱
                </Link>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Inicio (Gatos)
                        </Link>
                    </li>

                    {/* --- Lógica Condicional --- */}

                    {isLoggedIn ? (
                        <>
                            {/* --- Si ESTÁ logueado --- */}
                            {user?.role === 'rescatista' && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/dashboard" className="nav-link">
                                            Panel Adopciones
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/tracking" className="nav-link">
                                            Panel Seguimiento
                                        </Link>
                                    </li>
                                </>
                            )}

                            {user?.role === 'admin' && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link">
                                        Admin
                                    </Link>
                                </li>
                            )}

                            <li className="nav-item">
                                <button onClick={handleLogout} className="nav-button">
                                    Cerrar Sesión ({user?.email})
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* --- Si NO está logueado --- */}
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    Iniciar Sesión
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link nav-button-cta">
                                    Registrarse
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;