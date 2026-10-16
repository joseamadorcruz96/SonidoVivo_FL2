import { Link } from 'react-router-dom';
import { BadgeStock } from '../BadgeStock';

// Tarjeta responsiva universal para items del carrito en móvil y escritorio
export function TarjetaItemCarrito({ item, onCambiarCantidad, onQuitar }) {
  const cantidad = Number(item.cantidad) || 1;
  const precioUnitario = Number(item.precio) || 0;
  const subtotal = precioUnitario * cantidad;
  const limiteStock = item.stock || 999;

  return (
    <div className="card-item-carrito p-3 rounded-3 mb-3">
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3">
        {/* Bloque Izquierdo: Imagen, información y botón móvil */}
        <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
          <Link to={`/producto/${item.codigo}`} className="flex-shrink-0">
            <img
              src={item.imagen}
              alt={item.nombre}
              className="rounded-2 border border-secondary border-opacity-25"
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </Link>

          <div className="min-w-0 flex-grow-1">
            <Link
              to={`/producto/${item.codigo}`}
              className="text-light fw-bold text-decoration-none d-block text-truncate fs-6"
              title={item.nombre}
            >
              {item.nombre}
            </Link>
            <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
              <small className="text-secondary">
                {item.marca} · {item.modelo}
              </small>
              {Number(item.stock) <= Number(item.stockCritico || 2) && (
                <BadgeStock stock={item.stock} stockCritico={item.stockCritico} />
              )}
            </div>
          </div>

          {/* Botón eliminar visible en móvil */}
          <button
            type="button"
            onClick={() => onQuitar(item.codigo)}
            className="btn btn-sm btn-outline-danger border-0 p-1 lh-1 flex-shrink-0 d-md-none"
            title="Eliminar producto"
            style={{ fontSize: '1.1rem' }}
          >
            🗑️
          </button>
        </div>

        {/* Bloque Derecho: Controles de cantidad, precios y botón escritorio */}
        <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3 gap-md-4 pt-2 pt-md-0 border-top border-top-md-0 border-secondary border-opacity-25">
          {/* Stepper de cantidad */}
          <div className="d-inline-flex align-items-center gap-1 bg-dark px-2 py-1 rounded border border-secondary">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary py-0 px-2 text-light"
              onClick={() => onCambiarCantidad(item.codigo, cantidad - 1)}
              disabled={cantidad <= 1}
              title="Disminuir cantidad"
            >
              -
            </button>

            <span className="fw-bold px-2 text-gold">{cantidad}</span>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary py-0 px-2 text-light"
              onClick={() => onCambiarCantidad(item.codigo, cantidad + 1)}
              disabled={cantidad >= limiteStock}
              title={cantidad >= limiteStock ? 'Alcanzaste el stock disponible' : 'Aumentar cantidad'}
            >
              +
            </button>
          </div>

          {/* Precios con detalle unitario y total */}
          <div className="text-end" style={{ minWidth: '110px' }}>
            <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>
              ${precioUnitario.toLocaleString('es-CL')} c/u
            </small>
            <span className="text-gold fw-bold fs-6">
              ${subtotal.toLocaleString('es-CL')}
            </span>
          </div>

          {/* Botón eliminar visible en escritorio */}
          <button
            type="button"
            onClick={() => onQuitar(item.codigo)}
            className="btn btn-sm btn-outline-danger d-none d-md-inline-flex align-items-center justify-content-center p-2 rounded-2"
            title="Eliminar producto"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
