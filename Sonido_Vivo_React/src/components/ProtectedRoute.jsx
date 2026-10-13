import { Navigate } from 'react-router-dom';
import { getUsuarioLogueado } from '../services/db';

export function ProtectedRoute({ children, rolPermitido }) {
    const usuario = getUsuarioLogueado();

    // Si no hay usuario logueado, lo mandamos al login
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    // Si la ruta exige un rol específico y el usuario no lo tiene, lo mandamos al inicio
    if (rolPermitido && usuario.rol !== rolPermitido) {
        return <Navigate to="/" replace />;
    }

    // Si todo está bien, mostramos la página solicitada
    return children;
}