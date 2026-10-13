import { Link } from 'react-router-dom';
import { useCarrito } from '../../Context/CarritoContext';

export function Carrito() {
  const { carrito, quitarDelCarrito, vaciarCarrito, cantidadTotal } = useCarrito();

  // Calcular el total en pesos chilenos
  const total = carrito.reduce((acumulado, item) => {
    return acumulado + (item.precio || 0);
  }, 0);

  const totalFormateado = `$ ${Number(total).toLocaleString('es-CL')}`;

  // Vista 1: Carrito vacío
  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <span className="display-1 mb-3 d-block">🛒</span>
          <h2 className="h3 fw-bold mb-3">Tu carrito está vacío</h2>
          <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '500px' }}>
            Aún no has agregado instrumentos ni accesorios musicales a tu pedido.
            Visita nuestro catálogo para descubrir guitarras, bajos, baterías y más.
          </p>
          <Link to="/Catalogo" className="btn btn-hero-gold">
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Vista 2: Carrito con productos
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge-hero-pill mb-2">Revisión de Pedido</span>
        <h1 className="display-5 fw-bold mb-2">
          Tu Carrito de <span className="text-gold">Compras</span>
        </h1>
        <p className="text-secondary">
          Tienes {cantidadTotal} {cantidadTotal === 1 ? 'producto' : 'productos'} en tu lista
        </p>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Lista de productos en tabla */}
        <div className="col-12 col-lg-8">
          <div className="table-responsive bg-surface rounded-3 p-3 border-subtle shadow-sm">
            <table className="table table-carrito align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col" className="text-end">Precio</th>
                  <th scope="col" className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item, index) => (
                  <tr key={`${item.codigo}-${index}`}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                        <div>
                          <strong className="d-block text-light">{item.nombre}</strong>
                          <small className="text-secondary">
                            {item.marca} · {item.modelo}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td className="text-end text-gold fw-bold">
                      $ {Number(item.precio || 0).toLocaleString('es-CL')}
                    </td>

                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => quitarDelCarrito(item.codigo)}
                        className="btn btn-sm btn-outline-danger"
                        title="Eliminar producto"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link to="/Catalogo" className="btn btn-hero-outline btn-sm">
              &larr; Seguir comprando
            </Link>

            <button
              type="button"
              onClick={vaciarCarrito}
              className="btn btn-outline-danger btn-sm"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Resumen de Compra */}
        <div className="col-12 col-lg-4">
          <div className="card-resumen-compra p-4">
            <h3 className="h5 fw-bold mb-3 text-gold">Resumen del Pedido</h3>

            <div className="d-flex justify-content-between py-2 border-bottom-subtle">
              <span className="text-secondary">Cantidad de artículos:</span>
              <span className="fw-bold">{cantidadTotal}</span>
            </div>

            <div className="d-flex justify-content-between py-2 border-bottom-subtle">
              <span className="text-secondary">Despacho:</span>
              <span className="text-success fw-bold">Calculado al pagar</span>
            </div>

            <div className="d-flex justify-content-between py-3 fs-5">
              <strong>Total Estimado:</strong>
              <strong className="text-gold">{totalFormateado}</strong>
            </div>

            <button
              type="button"
              className="btn btn-hero-gold w-100 py-2 mt-3 fw-bold"
              onClick={() => alert('¡Gracias por tu compra! Tu pedido fue recibido en Sonido Vivo.')}
            >
              Continuar al Pago &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
