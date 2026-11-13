import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { ROLES } from '../services/authService';

export function MenuUsuarioNav() {
  const { usuario, cerrarSesion } = useAuth();

  const handleCerrarSesion = () => {
    cerrarSesion();
  };

  // Caso 1: Visitante no autenticado
  if (!usuario) {
    return (
      <div id="menu-sesion" className="d-flex align-items-center gap-2">
        <Link to="/login" className="btn-nav-login">
          Ingresar
        </Link>
      </div>
    );
  }

  // Caso 2: Usuario con sesion activa
  const rol = (usuario.rol || '').toUpperCase();
  const esPersonal = rol === ROLES.ADMIN || rol === ROLES.VENDEDOR;
  const rutaPanel = rol === ROLES.VENDEDOR ? '/admin/productos' : '/admin';

  return (
    <div id="menu-sesion" className="d-flex align-items-center gap-2">
      <span className="small text-light me-1 d-none d-sm-inline">
        Hola, <strong>{usuario.nombre}</strong>{' '}
        <span className="text-gold">({usuario.rol})</span>
      </span>

      {esPersonal && (
        <Link to={rutaPanel} className="btn btn-sm btn-outline-gold">
          Panel
        </Link>
      )}

      <button
        type="button"
        onClick={handleCerrarSesion}
        className="btn btn-sm btn-outline-danger"
        title="Cerrar sesión"
      >
        Salir
      </button>
    </div>
  );
}
