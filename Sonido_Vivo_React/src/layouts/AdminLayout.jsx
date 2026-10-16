import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';

export function AdminLayout() {
    const [sidebarAbierto, setSidebarAbierto] = useState(false);
    const cerrarSidebar = () => setSidebarAbierto(false);

    return (
        <div className="d-flex flex-column flex-md-row" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
            
            {/* Sidebar / Barra Superior en Móvil */}
            <aside 
                className="p-3 shadow-lg flex-shrink-0" 
                style={{ backgroundColor: '#111', minWidth: '260px' }}
            >
                {/* Cabecera del sidebar con toggle móvil */}
                <div className="d-flex justify-content-between align-items-center mb-md-4">
                    <h4 className="text-white fw-bold mb-0 text-center mt-md-2 flex-grow-1 flex-md-grow-0">
                        <span style={{ color: 'var(--color-gold)' }}>Admin</span> Vivo
                    </h4>
                    <button 
                        className="btn btn-outline-warning btn-sm d-md-none"
                        type="button"
                        onClick={() => setSidebarAbierto(prev => !prev)}
                        aria-label="Alternar menú de administración"
                    >
                        {sidebarAbierto ? '✕ Cerrar' : '☰ Menú'}
                    </button>
                </div>
                
                <hr className="text-secondary d-none d-md-block" />

                {/* Navegación colapsable en móvil, visible en desktop */}
                <div className={`mt-3 mt-md-0 ${sidebarAbierto ? 'd-block' : 'd-none d-md-block'}`}>
                    <ul className="nav nav-pills flex-column mb-auto gap-2">
                        <li className="nav-item">
                            <NavLink 
                                to="/admin" 
                                end 
                                onClick={cerrarSidebar}
                                className={({ isActive }) => `nav-link ${isActive ? 'bg-warning text-dark fw-bold' : 'text-light'}`}
                            >
                                📊 Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                to="/admin/productos" 
                                onClick={cerrarSidebar}
                                className={({ isActive }) => `nav-link ${isActive ? 'bg-warning text-dark fw-bold' : 'text-light'}`}
                            >
                                🎸 Catálogo y Productos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink 
                                to="/admin/usuarios" 
                                onClick={cerrarSidebar}
                                className={({ isActive }) => `nav-link ${isActive ? 'bg-warning text-dark fw-bold' : 'text-light'}`}
                            >
                                👥 Usuarios
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <Link to="/" onClick={cerrarSidebar} className="nav-link text-danger mt-md-4">
                                ⬅ Volver a la Tienda
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Contenedor Dinámico Derecho */}
            <main className="flex-grow-1 p-3 p-md-4" style={{ overflowY: 'auto' }}>
                <Outlet /> 
            </main>
        </div>
    );
}   