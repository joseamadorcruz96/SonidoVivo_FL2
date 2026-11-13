import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ROLES, normalizarRol } from '../services/authService';

// Configuracion declarativa del menu segun permisos del Anexo 1
const ITEMS_SIDEBAR = [
    { to: '/admin', label: '📊 Dashboard', end: true, roles: [ROLES.ADMIN] },
    { to: '/admin/ordenes', label: '🧾 Órdenes y Boletas', roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
    { to: '/admin/productos', label: '🎸 Productos y Stock', roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
    { to: '/admin/categorias', label: '📁 Categorías', roles: [ROLES.ADMIN] },
    { to: '/admin/usuarios', label: '👥 Usuarios', roles: [ROLES.ADMIN] },
    { to: '/admin/reportes', label: '📈 Reportes', roles: [ROLES.ADMIN] },
    { to: '/admin/perfil', label: '👤 Mi Perfil', roles: [ROLES.ADMIN] },
];

export function AdminLayout() {
    const [sidebarAbierto, setSidebarAbierto] = useState(false);
    const cerrarSidebar = () => setSidebarAbierto(false);
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const rolActual = normalizarRol(usuario?.rol);
    const itemsVisibles = ITEMS_SIDEBAR.filter((item) => item.roles.includes(rolActual));
    const esVendedor = rolActual === ROLES.VENDEDOR;

    function manejarLogout() {
        cerrarSesion();
        navigate('/login');
    }

    return (
        <div className="d-flex flex-column flex-md-row w-100" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>

            {/* Sidebar / Barra Superior en Movil */}
            <aside
                className="p-3 shadow-lg flex-shrink-0"
                style={{ backgroundColor: 'var(--bg-surface-alt)', minWidth: '260px', borderRight: '1px solid var(--border-subtle)' }}
            >
                <div className="d-flex justify-content-between align-items-center mb-md-2">
                    <div className="text-center flex-grow-1 flex-md-grow-0">
                        <h4 className="text-white fw-bold mb-0 mt-md-2">
                            <span style={{ color: 'var(--color-gold)' }}>
                                {esVendedor ? 'Panel' : 'Admin'}
                            </span>{' '}
                            {esVendedor ? 'Vendedor' : 'Vivo'}
                        </h4>
                        {usuario?.nombre && (
                            <small className="text-secondary d-block mt-1">
                                {usuario.nombre} · <span className="text-warning">{rolActual}</span>
                            </small>
                        )}
                    </div>
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

                <div className={`mt-3 mt-md-0 ${sidebarAbierto ? 'd-block' : 'd-none d-md-block'}`}>
                    <ul className="nav nav-pills flex-column mb-auto gap-2">
                        {itemsVisibles.map((item) => (
                            <li className="nav-item" key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.end}
                                    onClick={cerrarSidebar}
                                    className={({ isActive }) => `nav-link ${isActive ? 'bg-warning text-dark fw-bold' : 'text-light'}`}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                        <li className="nav-item mt-3 pt-3 border-top border-secondary border-opacity-25">
                            <Link to="/" onClick={cerrarSidebar} className="nav-link text-info">
                                🛍️ Volver a la Tienda
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button
                                type="button"
                                onClick={manejarLogout}
                                className="nav-link text-danger w-100 text-start border-0 bg-transparent"
                            >
                                🚪 Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Contenedor Dinamico Derecho */}
            <main className="flex-grow-1 p-3 p-md-4 min-w-0" style={{ minWidth: 0, overflowX: 'hidden', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
