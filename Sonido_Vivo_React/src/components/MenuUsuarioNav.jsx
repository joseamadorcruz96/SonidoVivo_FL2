import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { logoutUsuario } from '../services/db';

export function MenuUsuarioNav() {
  const { usuario, cerrarSesion } = useAuth();

  const handleCerrarSesion = () => {
    logoutUsuario();
    cerrarSesion();
  };

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
  const rol = (usuario.rol || '').toLowerCase();
  const esPersonal = rol === 'administrador' || rol === 'admin' || rol === 'vendedor';
  const rutaPanel = rol === 'vendedor' ? '/vendedor' : '/admin';

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
