import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { BotonCarritoNav } from './BotonCarritoNav';
import { MenuUsuarioNav } from './MenuUsuarioNav';

export function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark navbar-sonido-vivo"
            aria-label="Navegación principal"
        >
            <div className="container">
                {/* Logotipo Oficial Sonido Vivo */}
                <Link to="/" className="navbar-brand me-2" onClick={cerrarMenu}>
                    <img
                        src={logo}
                        alt="Sonido Vivo - Instrumentos & Audio"
                    />
                </Link>

                {/* Acceso rápido a carrito en móvil */}
                <div className="d-flex align-items-center gap-2 d-lg-none ms-auto me-2">
                    <BotonCarritoNav />
                </div>

                {/* Botón hamburguesa responsive */}
                <button
                    className="navbar-toggler border-secondary"
                    type="button"
                    onClick={() => setMenuAbierto(prev => !prev)}
                    aria-controls="menu-navegacion-principal"
                    aria-expanded={menuAbierto}
                    aria-label="Alternar menú de navegación"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menú colapsable */}
                <div
                    className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}
                    id="menu-navegacion-principal"
                >
                    {/* Enlaces de Navegación del Sitio */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <NavLink to="/" onClick={cerrarMenu} className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }>
                                Inicio
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/Catalogo"
                                onClick={cerrarMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Catálogo
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/categorias"
                                onClick={cerrarMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Categorías
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/ofertas"
                                onClick={cerrarMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Ofertas
                            </NavLink>
                        </li>


                        <li className="nav-item">
                            <NavLink
                                to="/Nosotros"
                                onClick={cerrarMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Nosotros
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/Blogs"
                                onClick={cerrarMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Blogs
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/Contacto"
                                onClick={cerrarMenu}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Contacto
                            </NavLink>
                        </li>
                    </ul>

                    {/* Carrito en desktop y Menú de Usuario */}
                    <div className="d-flex align-items-center gap-3 pt-3 pt-lg-0 border-top border-secondary border-opacity-25 border-lg-0">
                        <div className="d-none d-lg-block">
                            <BotonCarritoNav />
                        </div>
                        <MenuUsuarioNav />
                    </div>
                </div>
            </div>
        </nav>
    );
}