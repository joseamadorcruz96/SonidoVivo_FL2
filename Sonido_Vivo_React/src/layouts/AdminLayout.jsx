import { NavLink, Outlet } from 'react-router-dom';

export function AdminLayout() {
    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
            
            {/* Sidebar / Menú Lateral */}
            <aside className="p-3 shadow-lg" style={{ width: '280px', backgroundColor: '#111' }}>
                <h4 className="text-white fw-bold mb-4 text-center mt-2">
                    <span style={{ color: 'var(--color-gold)' }}>Admin</span> Vivo
                </h4>
                
                <hr className="text-secondary" />

                <ul className="nav nav-pills flex-column mb-auto gap-2">
                    <li className="nav-item">
                        <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'bg-warning text-dark fw-bold' : 'text-light'}`}>
                            📊 Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/productos" className={({ isActive }) => `nav-link ${isActive ? 'bg-warning text-dark fw-bold' : 'text-light'}`}>
                            🎸 Catálogo y Productos
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/usuarios" className={({ isActive }) => `nav-link ${isActive ? 'bg-warning text-dark fw-bold' : 'text-light'}`}>
                            👥 Usuarios
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link text-danger mt-4">
                            ⬅ Volver a la Tienda
                        </NavLink>
                    </li>
                </ul>
            </aside>

            {/* Contenedor Dinámico Derecho */}
            <main className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                {/* El componente Outlet renderiza lo que sea que esté en la ruta hija (ej: AdminDashboard) */}
                <Outlet /> 
            </main>
        </div>
    );
}   