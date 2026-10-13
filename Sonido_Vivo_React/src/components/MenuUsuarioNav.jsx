import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export function MenuUsuarioNav() {
  const { usuario, cerrarSesion } = useAuth();

  // Caso 1: Visitante no autenticado
  if (!usuario) {
    return (
      <div id="menu-sesion" className="d-flex align-items-center gap-2">
        <Link to="/Login" className="btn-nav-login">
          Ingresar
        </Link>
      </div>
    );
  }

  // Caso 2: Usuario con sesión activa
  const esPersonal = usuario.rol === 'Administrador' || usuario.rol === 'Vendedor';

  return (
    <div id="menu-sesion" className="d-flex align-items-center gap-2">
      <span className="small text-light me-1 d-none d-sm-inline">
        Hola, <strong>{usuario.nombre}</strong>{' '}
        <span className="text-gold">({usuario.rol})</span>
      </span>

      {esPersonal && (
        <Link to="/admin" className="btn btn-sm btn-outline-gold">
          Panel
        </Link>
      )}

      <button
        type="button"
        onClick={cerrarSesion}
        className="btn btn-sm btn-outline-danger"
        title="Cerrar sesión"
      >
        Salir
      </button>
    </div>
  );
}
