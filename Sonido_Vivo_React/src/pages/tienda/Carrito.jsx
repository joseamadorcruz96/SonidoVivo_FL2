import { useCarrito } from '../../Context/CarritoContext';
import { CarritoVacio } from '../../components/carrito/CarritoVacio';
import { FilaItemCarrito } from '../../components/carrito/FilaItemCarrito';
import { ResumenPedido } from '../../components/carrito/ResumenPedido';

export function Carrito() {
  const {
    carrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
    cantidadTotal,
    totalPagar,
  } = useCarrito();

  // 1. Pantalla modular cuando no hay productos
  if (carrito.length === 0) {
    return <CarritoVacio />;
  }

  // 2. Vista con tabla y resumen modular
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge-hero-pill mb-2">Revisión de Pedido</span>
        <h1 className="display-5 fw-bold mb-2">
          Tu Carrito de <span className="text-gold">Compras</span>
        </h1>
        <p className="text-secondary">
          Tienes {cantidadTotal} {cantidadTotal === 1 ? 'artículo' : 'artículos'} en tu lista de compra
        </p>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Tabla de productos */}
        <div className="col-12 col-lg-8">
          <div className="table-responsive bg-surface rounded-3 p-3 border-subtle shadow-sm">
            <table className="table table-carrito align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Instrumento</th>
                  <th scope="col" className="text-end">Precio Unit.</th>
                  <th scope="col" className="text-center">Cantidad</th>
                  <th scope="col" className="text-end">Subtotal</th>
                  <th scope="col" className="text-center">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <FilaItemCarrito
                    key={item.codigo}
                    item={item}
                    onCambiarCantidad={cambiarCantidad}
                    onQuitar={quitarDelCarrito}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna Derecha: Resumen y pago */}
        <div className="col-12 col-lg-4">
          <ResumenPedido
            total={totalPagar}
            cantidadTotal={cantidadTotal}
            onVaciar={vaciarCarrito}
          />
        </div>
      </div>
    </div>
  );
}
