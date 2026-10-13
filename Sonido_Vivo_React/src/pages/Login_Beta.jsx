import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  function manejarEnvio(e) {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Validación simulada de credenciales según los roles del proyecto
    if (email === 'admin@sonidovivo.cl' && password === 'admin123') {
      iniciarSesion({ nombre: 'Hernán', email, rol: 'Administrador' });
      navigate('/admin');
    } else if (email === 'vendedor@sonidovivo.cl' && password === 'ventas123') {
      iniciarSesion({ nombre: 'Rodrigo', email, rol: 'Vendedor' });
      navigate('/admin');
    } else {
      // Cliente genérico
      iniciarSesion({ nombre: 'Cliente Sonido Vivo', email, rol: 'Cliente' });
      navigate('/');
    }
  }

  // Atajos rápidos para facilitar las pruebas del estudiante durante el desarrollo
  function loginRapido(rol) {
    if (rol === 'Administrador') {
      iniciarSesion({ nombre: 'Hernán (Admin)', email: 'admin@sonidovivo.cl', rol: 'Administrador' });
      navigate('/admin');
    } else if (rol === 'Vendedor') {
      iniciarSesion({ nombre: 'Rodrigo (Vendedor)', email: 'vendedor@sonidovivo.cl', rol: 'Vendedor' });
      navigate('/admin');
    } else {
      iniciarSesion({ nombre: 'Matías (Cliente)', email: 'cliente@gmail.com', rol: 'Cliente' });
      navigate('/');
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="bg-surface p-4 p-md-5 rounded-3 border-subtle shadow-lg">
            <div className="text-center mb-4">
              <span className="badge-hero-pill mb-2">Acceso a Usuarios</span>
              <h1 className="h3 fw-bold text-light mb-1">
                Iniciar <span className="text-gold">Sesión</span>
              </h1>
              <p className="text-secondary small">
                Ingresa con tus credenciales de Sonido Vivo
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={manejarEnvio}>
              <div className="mb-3">
                <label className="form-label text-light small fw-medium">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-light small fw-medium">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-hero-gold w-100 fw-bold py-2">
                Ingresar al Sitio
              </button>
            </form>

            {/* Accesos rápidos didácticos */}
            <div className="mt-4 pt-3 border-top-subtle text-center">
              <p className="small text-secondary mb-2">
                ⚡ Accesos rápidos para probar roles:
              </p>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <button
                  type="button"
                  onClick={() => loginRapido('Administrador')}
                  className="btn btn-sm btn-outline-gold"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => loginRapido('Vendedor')}
                  className="btn btn-sm btn-outline-info"
                >
                  Vendedor
                </button>
                <button
                  type="button"
                  onClick={() => loginRapido('Cliente')}
                  className="btn btn-sm btn-outline-light"
                >
                  Cliente
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link to="/" className="text-secondary small">
                &larr; Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
