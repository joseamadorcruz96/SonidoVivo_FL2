import { useCarrito } from '../../Context/CarritoContext';
import { CarritoVacio } from '../../components/carrito/CarritoVacio';
import { TarjetaItemCarrito } from '../../components/carrito/TarjetaItemCarrito';
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

  // Pantalla modular cuando no hay productos
  if (carrito.length === 0) {
    return <CarritoVacio />;
  }

  // Vista con lista de tarjetas responsivas y panel de resumen
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
        {/* Columna Izquierda: Lista de tarjetas individualizadas */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            {carrito.map((item) => (
              <TarjetaItemCarrito
                key={item.codigo}
                item={item}
                onCambiarCantidad={cambiarCantidad}
                onQuitar={quitarDelCarrito}
              />
            ))}
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
