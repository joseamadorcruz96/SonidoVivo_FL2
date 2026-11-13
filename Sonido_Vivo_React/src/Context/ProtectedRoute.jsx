import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROLES, normalizarRol } from '../services/authService';

// Ruta segura por defecto cuando un usuario autenticado intenta acceder sin permiso
function obtenerRutaSeguraPorRol(rolUsuario) {
    if (rolUsuario === ROLES.VENDEDOR) return '/admin/productos';
    if (rolUsuario === ROLES.ADMIN) return '/admin';
    return '/';
}

export function ProtectedRoute({ children, rolesPermitidos, rolPermitido }) {
    const { usuario, estaAutenticado } = useAuth();

    // Sin sesion JWT activa redirige al login
    if (!estaAutenticado || !usuario) {
        return <Navigate to="/login" replace />;
    }

    // Normaliza la lista de roles requeridos (soporta array o string unico)
    const filtroRoles = rolesPermitidos ?? rolPermitido;
    if (filtroRoles) {
        const permitidos = (Array.isArray(filtroRoles) ? filtroRoles : [filtroRoles])
            .map(normalizarRol);
        const rolActual = normalizarRol(usuario.rol);

        if (!permitidos.includes(rolActual)) {
            return <Navigate to={obtenerRutaSeguraPorRol(rolActual)} replace />;
        }
    }

    // Soporta wrapper directo o Layout Route anidado con Outlet
    return children || <Outlet />;
}
