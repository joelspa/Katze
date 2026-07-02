import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isLoggedIn = isAuthenticated();
    const userInitial = user?.email ? user.email[0].toUpperCase() : '?';

    const getLinkClass = (path: string) =>
        `nav-link${location.pathname === path ? ' active' : ''}`;

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        closeMenu();
    };

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) closeMenu();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const menuLinks = (
        <>
            <li><Link to="/" className={getLinkClass('/')} onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/catalogo" className={getLinkClass('/catalogo')} onClick={closeMenu}>Catálogo</Link></li>
            <li><Link to="/education" className={getLinkClass('/education')} onClick={closeMenu}>Blog</Link></li>
            {isLoggedIn ? (
                <>
                    {user?.role === 'rescatista' && (
                        <li><Link to="/dashboard" className={getLinkClass('/dashboard')} onClick={closeMenu}>Panel</Link></li>
                    )}
                    {user?.role === 'admin' && (
                        <li><Link to="/admin" className={getLinkClass('/admin')} onClick={closeMenu}>Admin</Link></li>
                    )}
                    <li><Link to="/profile" className={getLinkClass('/profile')} onClick={closeMenu}>Mi Perfil</Link></li>
                    <li>
                        <button onClick={handleLogout} className="nav-button nav-logout-btn">
                            <span className="user-avatar" aria-hidden="true">{userInitial}</span>
                            Salir
                        </button>
                    </li>
                </>
            ) : (
                <>
                    <li><Link to="/login" className={getLinkClass('/login')} onClick={closeMenu}>Iniciar Sesión</Link></li>
                    <li><Link to="/register" className="nav-link nav-button-cta" onClick={closeMenu}>Registrarse</Link></li>
                </>
            )}
        </>
    );

    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo" onClick={closeMenu}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="nav-logo-icon" aria-hidden="true">
                            <path d="M12 3C8.13 3 5 6.13 5 10c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm1 13h-2v-1h2v1zm0-3h-2c-.55 0-1-.45-1-1V8h4v4c0 .55-.45 1-1 1z"/>
                        </svg>
                        Katze
                    </Link>

                    <ul className="nav-menu">
                        {menuLinks}
                    </ul>

                    <button
                        className={`hamburger${isMenuOpen ? ' open' : ''}`}
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={isMenuOpen}
                        aria-controls="nav-mobile-menu"
                    >
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="nav-mobile-overlay" onClick={closeMenu} aria-hidden="true" />
            )}
            <div
                id="nav-mobile-menu"
                className={`nav-mobile-menu${isMenuOpen ? ' open' : ''}`}
                aria-hidden={!isMenuOpen}
            >
                <ul className="nav-mobile-list">
                    {menuLinks}
                </ul>
            </div>
        </>
    );
};

export default Navbar;
