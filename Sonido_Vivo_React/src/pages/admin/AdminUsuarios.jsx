import { useState, useEffect } from 'react';
import { getOrdenes } from '../../services/db';
import { useAuth } from '../../Context/AuthContext';
import { ROLES, extraerMensajeError } from '../../services/authService';
import {
    listarUsuarios,
    actualizarRolUsuario,
    eliminarUsuarioApi,
} from '../../services/usuarioService';

// Devuelve la clase Bootstrap segun el Enum Rol
function obtenerClaseBadgeRol(rol) {
    if (rol === ROLES.ADMIN) return 'bg-danger text-white';
    if (rol === ROLES.VENDEDOR) return 'bg-warning text-dark';
    return 'bg-secondary text-white';
}

export function AdminUsuarios() {
    const { usuario: usuarioActivo } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [usuarioHistorial, setUsuarioHistorial] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [recarga, setRecarga] = useState(0);
    const [procesandoId, setProcesandoId] = useState(null);
    const [errorGeneral, setErrorGeneral] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Carga inicial y recargas desde GET /api/v1/usuarios con JWT Bearer
    useEffect(() => {
        let activo = true;
        listarUsuarios()
            .then((lista) => {
                if (activo) setUsuarios(lista);
            })
            .catch((error) => {
                if (activo) {
                    setErrorGeneral(
                        extraerMensajeError(error, 'No se pudo cargar la lista de usuarios.')
                    );
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });
        return () => {
            activo = false;
        };
    }, [recarga]);

    const recargarUsuarios = () => {
        setCargando(true);
        setErrorGeneral('');
        setRecarga((prev) => prev + 1);
    };

    // Cambia el rol contra PUT /api/v1/usuarios/{id}/rol
    const cambiarRol = async (idUsuario, nuevoRol) => {
        setErrorGeneral('');
        setMensajeExito('');
        setProcesandoId(idUsuario);
        try {
            const actualizado = await actualizarRolUsuario(idUsuario, nuevoRol);
            setUsuarios((prev) =>
                prev.map((u) => (u.idUsuario === idUsuario ? actualizado : u))
            );
            setMensajeExito(`Rol de ${actualizado.correo} actualizado a ${actualizado.rol}.`);
        } catch (error) {
            setErrorGeneral(
                extraerMensajeError(error, 'No se pudo actualizar el rol del usuario.')
            );
        } finally {
            setProcesandoId(null);
        }
    };

    // Elimina la cuenta contra DELETE /api/v1/usuarios/{id}
    const eliminarUsuario = async (idUsuario, correo) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar la cuenta de ${correo}?`)) {
            return;
        }

        setErrorGeneral('');
        setMensajeExito('');
        setProcesandoId(idUsuario);
        try {
            await eliminarUsuarioApi(idUsuario);
            setUsuarios((prev) => prev.filter((u) => u.idUsuario !== idUsuario));
            setMensajeExito(`Cuenta ${correo} eliminada correctamente.`);
        } catch (error) {
            setErrorGeneral(
                extraerMensajeError(error, 'No se pudo eliminar la cuenta del usuario.')
            );
        } finally {
            setProcesandoId(null);
        }
    };

    // Filtro en cliente por nombre, apellido, correo o RUN
    const usuariosFiltrados = usuarios.filter((u) => {
        const termino = busqueda.toLowerCase().trim();
        return (
            (u.nombre || '').toLowerCase().includes(termino) ||
            (u.apellido || '').toLowerCase().includes(termino) ||
            (u.correo || '').toLowerCase().includes(termino) ||
            (u.run || '').toLowerCase().includes(termino)
        );
    });

    return (
        <div className="container-fluid text-light py-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-0" style={{ color: 'var(--color-gold)' }}>
                        Gestión de Usuarios
                    </h2>
                    <small className="text-secondary">
                        Conectado en tiempo real a ms-usuarios-auth (JWT ADMIN)
                    </small>
                </div>
                <div className="d-flex gap-2 w-100" style={{ maxWidth: '420px' }}>
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        placeholder="🔍 Buscar por nombre, correo o RUN..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-warning flex-shrink-0"
                        onClick={recargarUsuarios}
                        disabled={cargando}
                    >
                        ↻
                    </button>
                </div>
            </div>

            {errorGeneral && (
                <div className="alert alert-danger py-2 small" role="alert">
                    {errorGeneral}
                </div>
            )}

            {mensajeExito && (
                <div className="alert alert-success py-2 small" role="status">
                    {mensajeExito}
                </div>
            )}

            {cargando ? (
                <div className="text-center py-5 text-secondary">
                    Cargando usuarios desde el servidor...
                </div>
            ) : (
                <>
                    {/* Vista Movil */}
                    <div className="d-block d-md-none">
                        <div className="d-flex flex-column gap-3">
                            {usuariosFiltrados.map((user) => {
                                const esCuentaPropia = usuarioActivo?.idUsuario === user.idUsuario;
                                const ocupado = procesandoId === user.idUsuario;

                                return (
                                    <div key={user.idUsuario} className="bg-dark rounded p-3 border border-secondary border-opacity-50 shadow-sm">
                                        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                                            <div>
                                                <strong className="d-block text-light fs-6">
                                                    {user.nombre} {user.apellido || ''}
                                                </strong>
                                                <span className="badge bg-secondary mt-1">{user.run || 'Sin RUN'}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger border-0 p-1 lh-1"
                                                title={esCuentaPropia ? 'No puedes eliminar tu propia sesión' : 'Eliminar usuario'}
                                                disabled={ocupado || esCuentaPropia}
                                                onClick={() => eliminarUsuario(user.idUsuario, user.correo)}
                                            >
                                                🗑️
                                            </button>
                                        </div>

                                        <div className="text-info small text-break mb-1">
                                            ✉️ {user.correo}
                                        </div>
                                        <div className="text-secondary small mb-3">
                                            📍 {user.comuna ? `${user.comuna}, ${user.region}` : 'Sin registrar'}
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
                                            <label className="small text-secondary mb-0 fw-semibold">Rol Asignado:</label>
                                            <select
                                                aria-label={`Rol de ${user.correo}`}
                                                className={`form-select form-select-sm fw-bold w-auto ${obtenerClaseBadgeRol(user.rol)}`}
                                                value={user.rol}
                                                disabled={ocupado}
                                                onChange={(e) => cambiarRol(user.idUsuario, e.target.value)}
                                                style={{ minWidth: '120px' }}
                                            >
                                                <option value={ROLES.CLIENTE}>CLIENTE</option>
                                                <option value={ROLES.VENDEDOR}>VENDEDOR</option>
                                                <option value={ROLES.ADMIN}>ADMIN</option>
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}
                            {usuariosFiltrados.length === 0 && (
                                <p className="text-center mt-3 text-secondary">No se encontraron usuarios coincidentes.</p>
                            )}
                        </div>
                    </div>

                    {/* Vista Escritorio */}
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
                                {usuariosFiltrados.map((user) => {
                                    const esCuentaPropia = usuarioActivo?.idUsuario === user.idUsuario;
                                    const ocupado = procesandoId === user.idUsuario;

                                    return (
                                        <tr key={user.idUsuario}>
                                            <td><small className="text-secondary">{user.run || 'N/A'}</small></td>
                                            <td>
                                                <strong className="d-block">{user.nombre} {user.apellido || ''}</strong>
                                            </td>
                                            <td className="text-info">{user.correo}</td>
                                            <td>
                                                <small className="text-secondary">
                                                    {user.comuna ? `${user.comuna}, ${user.region}` : 'Sin registrar'}
                                                </small>
                                            </td>
                                            <td>
                                                <select
                                                    aria-label={`Rol escritorio de ${user.correo}`}
                                                    className={`form-select form-select-sm fw-bold ${obtenerClaseBadgeRol(user.rol)}`}
                                                    value={user.rol}
                                                    disabled={ocupado}
                                                    onChange={(e) => cambiarRol(user.idUsuario, e.target.value)}
                                                    style={{ width: '130px' }}
                                                >
                                                    <option value={ROLES.CLIENTE}>CLIENTE</option>
                                                    <option value={ROLES.VENDEDOR}>VENDEDOR</option>
                                                    <option value={ROLES.ADMIN}>ADMIN</option>
                                                </select>
                                            </td>
                                            <td className="text-center">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-info"
                                                        title="Ver historial de compras"
                                                        onClick={() => setUsuarioHistorial(user)}
                                                    >
                                                        📜 Compras
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        title={esCuentaPropia ? 'No puedes eliminar tu propia sesión' : 'Eliminar usuario'}
                                                        disabled={ocupado || esCuentaPropia}
                                                        onClick={() => eliminarUsuario(user.idUsuario, user.correo)}
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {usuariosFiltrados.length === 0 && (
                            <p className="text-center mt-4 text-secondary">No se encontraron usuarios coincidentes.</p>
                        )}
                    </div>
                </>
            )}

            {/* Modal de Historial de Compras (ordenes locales hasta integrar ms-ventas-boletas) */}
            {usuarioHistorial && (
                <div
                    className="modal d-block bg-black bg-opacity-75"
                    tabIndex="-1"
                    style={{ zIndex: 1050 }}
                    onClick={() => setUsuarioHistorial(null)}
                >
                    <div
                        className="modal-dialog modal-lg modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content bg-dark text-light border border-secondary shadow-lg">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title fw-bold text-gold">
                                    Historial de Compras: {usuarioHistorial.nombre} {usuarioHistorial.apellido || ''}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setUsuarioHistorial(null)}
                                    aria-label="Cerrar"
                                />
                            </div>
                            <div className="modal-body p-4">
                                <p className="text-secondary small mb-3">
                                    Órdenes registradas para la cuenta <strong>{usuarioHistorial.correo}</strong>:
                                </p>

                                {(() => {
                                    const ordenesUsuario = getOrdenes().filter(
                                        (o) => (o.cliente?.email || o.cliente?.correo || '').toLowerCase() === usuarioHistorial.correo?.toLowerCase()
                                    );

                                    if (ordenesUsuario.length === 0) {
                                        return (
                                            <div className="p-4 text-center text-muted bg-black bg-opacity-50 rounded border border-secondary border-opacity-25">
                                                Este usuario no tiene compras registradas en el sistema.
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="table-responsive">
                                            <table className="table table-dark table-sm align-middle mb-0">
                                                <thead>
                                                    <tr className="text-secondary smaller">
                                                        <th>N° Orden</th>
                                                        <th>Código</th>
                                                        <th>Fecha</th>
                                                        <th>Total</th>
                                                        <th>Estado</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ordenesUsuario.map((ord) => (
                                                        <tr key={ord.id}>
                                                            <td><strong className="text-light">{ord.numeroOrden}</strong></td>
                                                            <td><span className="badge bg-secondary">{ord.codigoOrden}</span></td>
                                                            <td className="small text-secondary">{new Date(ord.fecha).toLocaleDateString('es-CL')}</td>
                                                            <td className="text-gold fw-bold">${Number(ord.total || 0).toLocaleString('es-CL')}</td>
                                                            <td>
                                                                <span className={`badge ${ord.estado === 'completada' ? 'bg-success' : 'bg-danger'}`}>
                                                                    {ord.estado}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="modal-footer border-secondary">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setUsuarioHistorial(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
