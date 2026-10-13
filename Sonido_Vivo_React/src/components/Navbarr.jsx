import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'; 
import { getUsuarioLogueado, logoutUsuario } from '../services/db';
import { BotonCarritoNav } from './BotonCarritoNav';

export function Navbar() {
    const navigate = useNavigate();
    const usuario = getUsuarioLogueado();

    const handleLogout = () => {
    logoutUsuario();
    navigate('/login'); // Usamos el navigate que declaraste arriba
};

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-sonido-vivo" aria-label="Navegación principal">
                <div className="container">
                    <div className="navbar-brand">
                        <img src={logo} alt="Sonido Vivo" />
                    </div>

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Inicio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/Catalogo" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Catálogo</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/nosotros" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Nosotros</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/Blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Blogs</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/Contacto" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contacto</NavLink>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        {/* Botón del Carrito de tu amigo */}
                        <BotonCarritoNav />

                        {/* Tu lógica de Login dinámica */}
                        {usuario ? (
                            <>
                                <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                                    Hola, <span style={{ color: 'var(--color-gold)' }}>{usuario.nombre}</span>
                                </span>
                                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm fw-bold">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" className="btn btn-hero-gold btn-sm fw-bold text-dark">
                                Iniciar Sesión
                            </NavLink>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}