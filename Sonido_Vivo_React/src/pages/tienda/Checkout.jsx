import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCarrito } from '../../Context/CarritoContext';
import { useAuth } from '../../Context/AuthContext';
import { CampoFormulario } from '../../components/CampoFormulario';
import { regionesYComunas } from '../../data/regionesComunas';
import { guardarOrden } from '../../services/db';

export function Checkout() {
  const navigate = useNavigate();
  const { carrito, totalPagar, vaciarCarrito } = useCarrito();
  const { usuario } = useAuth();

  // Estados del Formulario (inicializados con datos de usuario si hay sesión activa)
  const [formData, setFormData] = useState(() => ({
    nombre: usuario?.nombre || '',
    apellidos: usuario?.apellidos || '',
    email: usuario?.email || usuario?.correo || '',
    calle: usuario?.direccion || '',
    departamento: '',
    region: usuario?.region || '',
    comuna: usuario?.comuna || '',
    indicaciones: '',
  }));

  const [errores, setErrores] = useState({});
  const [simularFallo, setSimularFallo] = useState(false);


  // Obtener comunas correspondientes a la región seleccionada
  const comunasDisponibles = regionesYComunas.find(
    (item) => item.region === formData.region
  )?.comunas || [];

  function manejarCambio(e) {
    const { name, value } = e.target;
    setFormData((prev) => {
      const actual = { ...prev, [name]: value };
      // Si cambia de región, reiniciar la comuna seleccionada
      if (name === 'region') {
        actual.comuna = '';
      }
      return actual;
    });

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!formData.apellidos.trim()) nuevosErrores.apellidos = 'Los apellidos son obligatorios.';
    
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formData.calle.trim()) nuevosErrores.calle = 'La dirección (calle y número) es obligatoria.';
    if (!formData.region) nuevosErrores.region = 'Debes seleccionar una región de entrega.';
    if (!formData.comuna) nuevosErrores.comuna = 'Debes seleccionar una comuna de entrega.';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function manejarSubmit(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    const datosOrden = {
      cliente: {
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.trim(),
      },
      direccion: {
        calle: formData.calle.trim(),
        departamento: formData.departamento.trim(),
        region: formData.region,
        comuna: formData.comuna,
        indicaciones: formData.indicaciones.trim(),
      },
      items: carrito,
      total: totalPagar,
    };

    if (simularFallo) {
      // Simular transacción rechazada para evaluación
      const ordenFallida = {
        ...datosOrden,
        numeroOrden: `#${Math.floor(10000000 + Math.random() * 90000000)}`,
        fecha: new Date().toISOString(),
        estado: 'fallida',
      };
      navigate('/pago-error', { state: { orden: ordenFallida } });
    } else {
      // Registrar orden exitosa en base de datos simulada y vaciar carrito
      const ordenGuardada = guardarOrden({
        ...datosOrden,
        estado: 'completada',
      });
      vaciarCarrito();
      navigate('/compra-exitosa', { state: { orden: ordenGuardada } });
    }
  }

  // Si no hay productos en el carrito
  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card-resumen-compra p-5 mx-auto max-w-600">
          <span className="fs-1 mb-3 d-block">🛒</span>
          <h2 className="text-light mb-3">Tu carrito está vacío</h2>
          <p className="text-secondary mb-4">
            No tienes productos para procesar la compra. Agrega instrumentos desde nuestro catálogo.
          </p>
          <Link to="/Catalogo" className="btn btn-hero-gold px-4 py-2">
            Ver Catálogo de Instrumentos
          </Link>
        </div>
      </div>
    );
  }

  const totalFormateado = `$${Number(totalPagar).toLocaleString('es-CL')}`;

  return (
    <div className="container py-5">
      {/* Encabezado */}
      <div className="text-center mb-5">
        <span className="badge-hero-pill mb-2">Finalizar Pedido</span>
        <h1 className="display-5 fw-bold text-light mb-2">
          Paso de <span className="text-gold">Pago & Despacho</span>
        </h1>
        <p className="text-secondary">
          {usuario ? (
            <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-1">
              ✓ Datos precargados desde tu cuenta activa ({usuario.nombre})
            </span>
          ) : (
            'Introduce la dirección de envío y tus datos de contacto para completar la compra.'
          )}
        </p>
      </div>

      <form onSubmit={manejarSubmit}>
        <div className="row g-4">
          {/* Columna Izquierda: Formulario de Despacho y Contacto */}
          <div className="col-12 col-lg-7">
            <div className="card-resumen-compra p-4 mb-4">
              <h2 className="h5 fw-bold text-gold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                1. Información del Cliente
              </h2>

              <div className="row g-2">
                <div className="col-md-6">
                  <CampoFormulario
                    id="nombre"
                    label="Nombre"
                    obligatorio
                    error={errores.nombre}
                  >
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                      placeholder="Ej: Pedro"
                      value={formData.nombre}
                      onChange={manejarCambio}
                    />
                  </CampoFormulario>
                </div>

                <div className="col-md-6">
                  <CampoFormulario
                    id="apellidos"
                    label="Apellidos"
                    obligatorio
                    error={errores.apellidos}
                  >
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
                      placeholder="Ej: Morales"
                      value={formData.apellidos}
                      onChange={manejarCambio}
                    />
                  </CampoFormulario>
                </div>
              </div>

              <CampoFormulario
                id="email"
                label="Correo Electrónico"
                obligatorio
                error={errores.email}
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={manejarCambio}
                />
              </CampoFormulario>
            </div>

            <div className="card-resumen-compra p-4">
              <h2 className="h5 fw-bold text-gold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                2. Dirección de Entrega de los Productos
              </h2>

              <div className="row g-2">
                <div className="col-md-8">
                  <CampoFormulario
                    id="calle"
                    label="Calle y Número"
                    obligatorio
                    error={errores.calle}
                  >
                    <input
                      type="text"
                      id="calle"
                      name="calle"
                      className={`form-control ${errores.calle ? 'is-invalid' : ''}`}
                      placeholder="Ej: Av. Libertad 1234, Edificio Norte"
                      value={formData.calle}
                      onChange={manejarCambio}
                    />
                  </CampoFormulario>
                </div>

                <div className="col-md-4">
                  <CampoFormulario
                    id="departamento"
                    label="Departamento (opcional)"
                  >
                    <input
                      type="text"
                      id="departamento"
                      name="departamento"
                      className="form-control"
                      placeholder="Ej: Depto 502"
                      value={formData.departamento}
                      onChange={manejarCambio}
                    />
                  </CampoFormulario>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <CampoFormulario
                    id="region"
                    label="Región"
                    obligatorio
                    error={errores.region}
                  >
                    <select
                      id="region"
                      name="region"
                      className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                      value={formData.region}
                      onChange={manejarCambio}
                    >
                      <option value="">Selecciona una región</option>
                      {regionesYComunas.map((reg) => (
                        <option key={reg.region} value={reg.region}>
                          {reg.region}
                        </option>
                      ))}
                    </select>
                  </CampoFormulario>
                </div>

                <div className="col-md-6">
                  <CampoFormulario
                    id="comuna"
                    label="Comuna"
                    obligatorio
                    error={errores.comuna}
                  >
                    <select
                      id="comuna"
                      name="comuna"
                      disabled={!formData.region}
                      className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                      value={formData.comuna}
                      onChange={manejarCambio}
                    >
                      <option value="">
                        {formData.region ? 'Selecciona una comuna' : 'Primero elige una región'}
                      </option>
                      {comunasDisponibles.map((com) => (
                        <option key={com} value={com}>
                          {com}
                        </option>
                      ))}
                    </select>
                  </CampoFormulario>
                </div>
              </div>

              <CampoFormulario
                id="indicaciones"
                label="Indicaciones para la entrega (opcional)"
              >
                <textarea
                  id="indicaciones"
                  name="indicaciones"
                  rows="2"
                  className="form-control"
                  placeholder="Ej: Dejar con conserje, portón color verde..."
                  value={formData.indicaciones}
                  onChange={manejarCambio}
                />
              </CampoFormulario>
            </div>
          </div>

          {/* Columna Derecha: Resumen del Pedido y Botón de Pago */}
          <div className="col-12 col-lg-5">
            <div className="card-resumen-compra p-4 position-sticky" style={{ top: '90px' }}>
              <h2 className="h5 fw-bold text-gold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                Resumen de Compra
              </h2>

              {/* Lista compacta de productos */}
              <div className="d-flex flex-column gap-2 mb-3 max-h-300 overflow-auto pe-1">
                {carrito.map((item) => (
                  <div
                    key={item.codigo}
                    className="d-flex align-items-center justify-content-between p-2 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                        className="rounded"
                      />
                      <div>
                        <div className="text-light small fw-bold text-truncate" style={{ maxWidth: '180px' }}>
                          {item.nombre}
                        </div>
                        <div className="text-secondary smaller">
                          Cant: {item.cantidad} x ${Number(item.precio).toLocaleString('es-CL')}
                        </div>
                      </div>
                    </div>
                    <span className="text-gold fw-bold small">
                      ${Number(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totalizador */}
              <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded bg-dark border border-warning border-opacity-50">
                <span className="text-light fw-bold">Total a Pagar:</span>
                <span className="text-gold fs-4 fw-bold">{totalFormateado}</span>
              </div>

              {/* Simulación para Evaluación */}
              <div className="form-check form-switch p-3 mb-3 rounded bg-secondary bg-opacity-10 border border-secondary border-opacity-25">
                <input
                  className="form-check-input ms-0 me-2"
                  type="checkbox"
                  role="switch"
                  id="simularFallo"
                  checked={simularFallo}
                  onChange={(e) => setSimularFallo(e.target.checked)}
                />
                <label className="form-check-label text-warning small" htmlFor="simularFallo">
                  Simular error de pago (modo prueba docente)
                </label>
              </div>

              {/* Botón Pagar ahora */}
              <button
                type="submit"
                className="btn btn-hero-gold w-100 py-3 fw-bold fs-5 shadow"
              >
                Pagar ahora {totalFormateado}
              </button>

              <div className="text-center mt-3">
                <Link to="/Carrito" className="text-secondary small text-decoration-none">
                  &larr; Volver a modificar carrito
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
