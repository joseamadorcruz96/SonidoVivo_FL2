import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export function CompraExitosa() {
  const location = useLocation();
  const [alertaEmail, setAlertaEmail] = useState(false);

  // Recuperar orden enviada por el estado de navegación
  const orden = location.state?.orden || {
    numeroOrden: '#20240705',
    codigoOrden: 'ORDER-12345',
    fecha: new Date().toISOString(),
    cliente: {
      nombre: 'Pedro',
      apellidos: 'Hacker',
      email: 'pedro.hacker20@example.com',
    },
    direccion: {
      calle: 'Los Crisantemos, Edificio Norte',
      departamento: 'Depto 603',
      region: 'Metropolitana de Santiago',
      comuna: 'Cerrillos',
      indicaciones: 'El martes no estaremos en el depto, pero puede dejárselo con el conserje.',
    },
    items: [
      {
        codigo: 'GA001',
        nombre: 'Guitarra Acústica Folk',
        precio: 129990,
        cantidad: 1,
        imagen: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
      },
    ],
    total: 129990,
  };

  const totalFormateado = `$${Number(orden.total || 0).toLocaleString('es-CL')}`;

  function enviarPorEmail() {
    setAlertaEmail(true);
    setTimeout(() => setAlertaEmail(false), 4000);
  }

  function imprimirBoleta() {
    window.print();
  }

  return (
    <div className="container py-5">
      <div className="card-resumen-compra p-4 p-md-5 mx-auto max-w-800 shadow" id="boleta-imprimible">
        {/* Banner de Éxito */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom border-secondary border-opacity-25 pb-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-success rounded-circle p-3 fs-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
              ✓
            </span>
            <div>
              <h1 className="h4 text-success fw-bold m-0">
                Se ha realizado la compra. nro {orden.numeroOrden}
              </h1>
              <p className="text-secondary small m-0">
                ¡Gracias por confiar en Sonido Vivo! Tu pedido está siendo preparado para despacho.
              </p>
            </div>
          </div>
          <div className="text-sm-end mt-2 mt-sm-0">
            <span className="badge bg-dark border border-secondary text-secondary px-3 py-2">
              Código: {orden.codigoOrden}
            </span>
          </div>
        </div>

        {/* Notificación de Email */}
        {alertaEmail && (
          <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
            <span>✉</span>
            <div>
              Boleta enviada exitosamente al correo <strong>{orden.cliente?.email}</strong>.
            </div>
          </div>
        )}

        {/* Datos del Cliente */}
        <div className="mb-4">
          <h2 className="h6 text-gold text-uppercase fw-bold mb-3">
            Información del Cliente
          </h2>
          <div className="row g-3 p-3 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25">
            <div className="col-sm-4">
              <span className="text-secondary d-block small">Nombre:</span>
              <strong className="text-light">{orden.cliente?.nombre}</strong>
            </div>
            <div className="col-sm-4">
              <span className="text-secondary d-block small">Apellidos:</span>
              <strong className="text-light">{orden.cliente?.apellidos}</strong>
            </div>
            <div className="col-sm-4">
              <span className="text-secondary d-block small">Correo:</span>
              <strong className="text-light">{orden.cliente?.email}</strong>
            </div>
          </div>
        </div>

        {/* Dirección de Entrega */}
        <div className="mb-4">
          <h2 className="h6 text-gold text-uppercase fw-bold mb-3">
            Dirección de Entrega
          </h2>
          <div className="p-3 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25">
            <div className="row g-2 mb-2">
              <div className="col-sm-8">
                <span className="text-secondary d-block small">Calle y Número:</span>
                <span className="text-light">{orden.direccion?.calle}</span>
              </div>
              <div className="col-sm-4">
                <span className="text-secondary d-block small">Departamento:</span>
                <span className="text-light">{orden.direccion?.departamento || 'No especificado'}</span>
              </div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col-sm-6">
                <span className="text-secondary d-block small">Región:</span>
                <span className="text-light">{orden.direccion?.region}</span>
              </div>
              <div className="col-sm-6">
                <span className="text-secondary d-block small">Comuna:</span>
                <span className="text-light">{orden.direccion?.comuna}</span>
              </div>
            </div>
            {orden.direccion?.indicaciones && (
              <div className="mt-2 pt-2 border-top border-secondary border-opacity-25">
                <span className="text-secondary d-block small">Indicaciones de entrega:</span>
                <span className="text-light fst-italic">{orden.direccion?.indicaciones}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="mb-4">
          <h2 className="h6 text-gold text-uppercase fw-bold mb-3">
            Detalle de Productos Comprados
          </h2>
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle border border-secondary border-opacity-25 m-0">
              <thead>
                <tr className="text-secondary small">
                  <th scope="col" style={{ width: '60px' }}>Imagen</th>
                  <th scope="col">Nombre</th>
                  <th scope="col" className="text-end">Precio</th>
                  <th scope="col" className="text-center">Cantidad</th>
                  <th scope="col" className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orden.items?.map((item) => (
                  <tr key={item.codigo}>
                    <td>
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                        className="rounded"
                      />
                    </td>
                    <td className="text-light fw-semibold">{item.nombre}</td>
                    <td className="text-end text-light">${Number(item.precio).toLocaleString('es-CL')}</td>
                    <td className="text-center text-light">{item.cantidad}</td>
                    <td className="text-end text-gold fw-bold">
                      ${Number(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Pagado */}
        <div className="d-flex justify-content-between align-items-center p-3 rounded bg-dark border border-success border-opacity-50 mb-4">
          <span className="fs-5 text-light fw-bold">Total pagado:</span>
          <span className="fs-3 text-gold fw-bold">{totalFormateado}</span>
        </div>

        {/* Botones de Acción (ocultos en impresión) */}
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center no-print pt-3 border-top border-secondary border-opacity-25">
          <div className="d-flex gap-2">
            <button
              type="button"
              onClick={imprimirBoleta}
              className="btn btn-outline-light"
            >
              🖨️ Imprimir boleta en PDF
            </button>
            <button
              type="button"
              onClick={enviarPorEmail}
              className="btn btn-outline-info"
            >
              ✉️ Enviar boleta por email
            </button>
          </div>

          <Link to="/Catalogo" className="btn btn-hero-gold px-4">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
