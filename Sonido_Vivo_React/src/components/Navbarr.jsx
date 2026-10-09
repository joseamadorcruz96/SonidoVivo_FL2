import { NavLink } from 'react-router-dom';

export function Navbar() {
    return (
        <header>
            <nav
                className="navbar navbar-expand-lg navbar-sonido-vivo"
                aria-label="Navegación principal"
            >
                <div className="container">
                    {/* Logotipo Oficial Sonido Vivo */}
                    <div className="navbar-brand">
                        <img
                            src="assets/logo.svg"
                            alt="Sonido Vivo - Instrumentos & Audio"
                        />
                    </div>

                    {/* Enlaces de Navegación del Sitio */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) =>
                                `nav-link ${isActive ? 'active' : ''}`
                            }
                            >Inicio</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/Catalogo"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Catálogo
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/Nosotros"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Nosotros
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}