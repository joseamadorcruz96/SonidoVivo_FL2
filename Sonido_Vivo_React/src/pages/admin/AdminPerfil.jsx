import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { CampoFormulario } from '../../components/CampoFormulario';
import { getUsuarios } from '../../services/db';

export function AdminPerfil() {
  const { usuario, iniciarSesion } = useAuth();

  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [apellidos, setApellidos] = useState(usuario?.apellidos || '');
  const [password, setPassword] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!usuario) return;

    // Actualizar usuario en sesión
    const usuarioActualizado = {
      ...usuario,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      ...(password.trim() ? { password: password.trim() } : {}),
    };

    iniciarSesion(usuarioActualizado);

    // Actualizar también en sv_usuarios
    const listaUsuarios = getUsuarios();
    const nuevaLista = listaUsuarios.map((u) =>
      u.email?.toLowerCase() === usuario.email?.toLowerCase() ? { ...u, ...usuarioActualizado } : u
    );
    localStorage.setItem('sv_usuarios', JSON.stringify(nuevaLista));

    setMensajeExito(true);
    setPassword('');
    setTimeout(() => setMensajeExito(false), 4000);
  }

  return (
    <div className="container-fluid text-light py-2">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--color-gold)' }}>
          Perfil de Administrador
        </h2>
        <p className="text-secondary small m-0">
          Visualiza y actualiza la información de tu cuenta administrativa.
        </p>
      </div>

      <div className="row g-4">
        {/* Tarjeta de Resumen de Cuenta */}
        <div className="col-12 col-md-4">
          <div className="card bg-dark border-secondary p-4 text-center shadow-sm h-100">
            <div
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-warning text-dark fw-bold fs-1"
              style={{ width: '90px', height: '90px' }}
            >
              {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'A'}
            </div>

            <h4 className="fw-bold text-light m-0">
              {usuario?.nombre} {usuario?.apellidos}
            </h4>
            <span className="text-info small">{usuario?.email}</span>

            <div className="mt-3 pt-3 border-top border-secondary border-opacity-25 text-start small">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Rol del sistema:</span>
                <span className="badge bg-danger text-uppercase">{usuario?.rol || 'Administrador'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">RUN:</span>
                <span className="text-light">{usuario?.run || '172223334'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Estado:</span>
                <span className="text-success fw-bold">✓ Activo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Modificación */}
        <div className="col-12 col-md-8">
          <div className="card bg-dark border-secondary p-4 shadow-sm">
            <h3 className="h5 fw-bold text-light mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              Modificar Información Personal
            </h3>

            {mensajeExito && (
              <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                <span>✓</span>
                <div>Datos de perfil actualizados exitosamente.</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <CampoFormulario id="perfil-nombre" label="Nombre" obligatorio>
                    <input
                      type="text"
                      id="perfil-nombre"
                      className="form-control bg-dark text-light border-secondary"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </CampoFormulario>
                </div>

                <div className="col-md-6">
                  <CampoFormulario id="perfil-apellidos" label="Apellidos" obligatorio>
                    <input
                      type="text"
                      id="perfil-apellidos"
                      className="form-control bg-dark text-light border-secondary"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                    />
                  </CampoFormulario>
                </div>
              </div>

              <CampoFormulario id="perfil-email" label="Correo Electrónico (No modificable)">
                <input
                  type="email"
                  id="perfil-email"
                  className="form-control bg-dark text-secondary border-secondary"
                  value={usuario?.email || ''}
                  disabled
                />
              </CampoFormulario>

              <CampoFormulario
                id="perfil-password"
                label="Nueva Contraseña (dejar en blanco para mantener la actual)"
              >
                <input
                  type="password"
                  id="perfil-password"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </CampoFormulario>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-hero-gold px-4 py-2 fw-bold">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
