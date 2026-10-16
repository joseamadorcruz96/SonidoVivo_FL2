import { useState, useEffect } from 'react';
import { getUsuarios } from '../../services/db';

export function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    // 1. Cargar usuarios al montar la vista
    useEffect(() => {
        setUsuarios(getUsuarios());
    }, []);

    // 2. Cambiar el rol de un usuario
    const cambiarRol = (id, nuevoRol) => {
        const listaActualizada = usuarios.map(u => 
            u.id === id ? { ...u, rol: nuevoRol } : u
        );
        setUsuarios(listaActualizada);
        localStorage.setItem('sv_usuarios', JSON.stringify(listaActualizada));
    };

    // 3. Eliminar cuenta de usuario
    const eliminarUsuario = (id, email) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar la cuenta de ${email}?`)) {
            const listaActualizada = usuarios.filter(u => u.id !== id);
            setUsuarios(listaActualizada);
            localStorage.setItem('sv_usuarios', JSON.stringify(listaActualizada));
        }
    };

    // 4. Filtro por nombre, email o RUN
    const usuariosFiltrados = usuarios.filter(u => {
        const termino = busqueda.toLowerCase().trim();
        return (
            (u.nombre || '').toLowerCase().includes(termino) ||
            (u.email || '').toLowerCase().includes(termino) ||
            (u.run || '').toLowerCase().includes(termino)
        );
    });

    return (
        <div className="container-fluid text-light py-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                <h2 className="fw-bold mb-0" style={{ color: 'var(--color-gold)' }}>Gestión de Usuarios</h2>
                <div className="w-100" style={{ maxWidth: '320px' }}>
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="🔍 Buscar por nombre o email..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* Vista Móvil: Tarjetas individuales dentro de márgenes sin scroll horizontal */}
            <div className="d-block d-md-none">
                <div className="d-flex flex-column gap-3">
                    {usuariosFiltrados.map((user) => (
                        <div key={user.id} className="bg-dark rounded p-3 border border-secondary border-opacity-50 shadow-sm">
                            <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                                <div>
                                    <strong className="d-block text-light fs-6">{user.nombre} {user.apellidos || ''}</strong>
                                    <span className="badge bg-secondary mt-1">{user.run || 'Sin RUN'}</span>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-danger border-0 p-1 lh-1"
                                    title="Eliminar usuario"
                                    onClick={() => eliminarUsuario(user.id, user.email)}
                                >
                                    🗑️
                                </button>
                            </div>

                            <div className="text-info small text-break mb-1">
                                ✉️ {user.email}
                            </div>
                            <div className="text-secondary small mb-3">
                                📍 {user.comuna ? `${user.comuna}, ${user.region}` : 'Sin registrar'}
                            </div>

                            <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
                                <label className="small text-secondary mb-0 fw-semibold">Rol Asignado:</label>
                                <select
                                    className={`form-select form-select-sm fw-bold w-auto ${
                                        user.rol === 'admin' ? 'bg-danger text-white' : 
                                        user.rol === 'vendedor' ? 'bg-warning text-dark' : 'bg-secondary text-white'
                                    }`}
                                    value={user.rol.toLowerCase()}
                                    onChange={(e) => cambiarRol(user.id, e.target.value)}
                                    style={{ minWidth: '120px' }}
                                >
                                    <option value="cliente">Cliente</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    ))}
                    {usuariosFiltrados.length === 0 && (
                        <p className="text-center mt-3 text-secondary">No se encontraron usuarios coincidentes.</p>
                    )}
                </div>
            </div>

            {/* Vista Escritorio: Tabla completa */}
            <div className="d-none d-md-block table-responsive bg-dark rounded shadow-sm p-3">
                <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>RUN</th>
                            <th>Usuario</th>
                            <th>Correo Electrónico</th>
                            <th>Ubicación</th>
                            <th>Rol Asignado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((user) => (
                            <tr key={user.id}>
                                <td><small className="text-secondary">{user.run || 'N/A'}</small></td>
                                <td>
                                    <strong className="d-block">{user.nombre} {user.apellidos || ''}</strong>
                                </td>
                                <td className="text-info">{user.email}</td>
                                <td>
                                    <small className="text-secondary">
                                        {user.comuna ? `${user.comuna}, ${user.region}` : 'Sin registrar'}
                                    </small>
                                </td>
                                <td>
                                    <select
                                        className={`form-select form-select-sm fw-bold ${
                                            user.rol === 'admin' ? 'bg-danger text-white' : 
                                            user.rol === 'vendedor' ? 'bg-warning text-dark' : 'bg-secondary text-white'
                                        }`}
                                        value={user.rol.toLowerCase()}
                                        onChange={(e) => cambiarRol(user.id, e.target.value)}
                                        style={{ width: '130px' }}
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="vendedor">Vendedor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        title="Eliminar usuario"
                                        onClick={() => eliminarUsuario(user.id, user.email)}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {usuariosFiltrados.length === 0 && (
                    <p className="text-center mt-4 text-secondary">No se encontraron usuarios coincidentes.</p>
                )}
            </div>
        </div>
    );
}