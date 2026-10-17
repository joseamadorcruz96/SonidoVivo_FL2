import { useLocation, Link, useNavigate } from 'react-router-dom';

export function PagoError() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recuperar datos de la orden que falló
  const orden = location.state?.orden || {
    numeroOrden: '#20240705',
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

  return (
    <div className="container py-5">
      <div className="card-resumen-compra p-4 p-md-5 mx-auto max-w-800 shadow border-danger border-opacity-50">
        {/* Banner de Error */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom border-danger border-opacity-25 pb-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-danger rounded-circle p-3 fs-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
              ✕
            </span>
            <div>
              <h1 className="h4 text-danger fw-bold m-0">
                No se pudo realizar el pago. nro {orden.numeroOrden}
              </h1>
              <p className="text-secondary small m-0">
                La pasarela de pago o el banco emisor rechazó la transacción. No se ha realizado ningún cobro a tu tarjeta.
              </p>
            </div>
          </div>
        </div>

        {/* Botón Destacado Reintentar Pago (como en el mockup figura 8) */}
        <div className="text-center my-4">
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn btn-success btn-lg px-4 py-3 fw-bold text-uppercase shadow"
          >
            Volver a realizar el pago
          </button>
        </div>

        {/* Detalle de la compra intentada */}
        <div className="mb-4">
          <h2 className="h6 text-secondary text-uppercase fw-bold mb-3">
            Detalle de compra
          </h2>
          <div className="row g-3 p-3 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-3">
            <div className="col-sm-4">
              <span className="text-secondary d-block small">Nombre:</span>
              <span className="text-light">{orden.cliente?.nombre}</span>
            </div>
            <div className="col-sm-4">
              <span className="text-secondary d-block small">Apellidos:</span>
              <span className="text-light">{orden.cliente?.apellidos}</span>
            </div>
            <div className="col-sm-4">
              <span className="text-secondary d-block small">Correo:</span>
              <span className="text-light">{orden.cliente?.email}</span>
            </div>
          </div>

          {/* Dirección */}
          <div className="p-3 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-3">
            <span className="text-secondary d-block small mb-1 fw-bold">Dirección de entrega de los productos:</span>
            <div className="text-light small">
              {orden.direccion?.calle} {orden.direccion?.departamento ? `, ${orden.direccion.departamento}` : ''} - {orden.direccion?.comuna}, {orden.direccion?.region}
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="table-responsive mb-3">
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

          {/* Total no pagado */}
          <div className="d-flex justify-content-between align-items-center p-3 rounded bg-dark border border-danger border-opacity-50">
            <span className="fs-5 text-light fw-bold">Total a pagar:</span>
            <span className="fs-3 text-gold fw-bold">{totalFormateado}</span>
          </div>
        </div>

        {/* Acciones Secundarias */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25">
          <Link to="/Carrito" className="text-secondary small text-decoration-none">
            &larr; Volver al Carrito
          </Link>
          <Link to="/Catalogo" className="btn btn-sm btn-outline-secondary">
            Ir al Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
