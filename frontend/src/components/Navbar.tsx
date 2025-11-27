import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Limpia el contexto y localStorage
        navigate('/'); // Envía al usuario al inicio
    };

    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.location.pathname === '/') {
            // Si ya estamos en home, hacer scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Si estamos en otra página, navegar a home
            navigate('/');
        }
    };

    const handleCatalogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.location.pathname === '/catalogo') {
            // Si ya estamos en catálogo, hacer scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Si estamos en otra página, navegar a catálogo
            navigate('/catalogo');
        }
    };

    const handleBlogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (window.location.pathname === '/education') {
            // Si ya estamos en blog, hacer scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Si estamos en otra página, navegar a blog
            navigate('/education');
        }
    };

    const isLoggedIn = isAuthenticated();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo" onClick={handleHomeClick}>
                    Katze
                </Link>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={handleHomeClick}>
                            Inicio
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/catalogo" className="nav-link" onClick={handleCatalogClick}>
                            Catálogo
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/education" className="nav-link" onClick={handleBlogClick}>
                            Blog
                        </Link>
                    </li>

                    {isLoggedIn ? (
                        <>
                            {user?.role === 'rescatista' && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/publish" className="nav-link nav-button-cta">
                                            Publicar Gato
                                        </Link>
                                    </li>
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
                                <>
                                    <li className="nav-item">
                                        <Link to="/admin" className="nav-link">
                                            Admin
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">
                                    Mi Perfil
                                </Link>
                            </li>

                            <li className="nav-item">
                                <button onClick={handleLogout} className="nav-button">
                                    Cerrar Sesión ({user?.email})
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
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