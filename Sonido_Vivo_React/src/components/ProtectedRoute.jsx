import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { getUsuarioLogueado } from '../services/db';

export function ProtectedRoute({ children, rolPermitido }) {
    const auth = useAuth();
    const usuario = auth?.usuario || getUsuarioLogueado();

    // Si no hay usuario logueado, lo mandamos al login
    if (!usuario) {
        return <Navigate to="/Login" replace />;
    }

    // Si la ruta exige un rol específico, validamos permitiendo variaciones ("admin" vs "Administrador")
    if (rolPermitido) {
        const rolActual = (usuario.rol || '').toLowerCase();
        const rolReq = rolPermitido.toLowerCase();
        const tienePermiso =
            rolActual === rolReq ||
            (rolReq === 'admin' && rolActual === 'administrador') ||
            (rolReq === 'administrador' && rolActual === 'admin');

        if (!tienePermiso) {
            return <Navigate to="/" replace />;
        }
    }

    // Si todo está bien, mostramos la página solicitada
    return children;
}