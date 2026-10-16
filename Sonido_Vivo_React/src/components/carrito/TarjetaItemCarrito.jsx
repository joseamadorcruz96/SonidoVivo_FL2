import { Link } from 'react-router-dom';
import { BadgeStock } from '../BadgeStock';

// Tarjeta móvil compacta para productos del carrito sin scroll horizontal
export function TarjetaItemCarrito({ item, onCambiarCantidad, onQuitar }) {
  const cantidad = Number(item.cantidad) || 1;
  const precioUnitario = Number(item.precio) || 0;
  const subtotal = precioUnitario * cantidad;
  const limiteStock = item.stock || 999;

  return (
    <div className="bg-surface rounded-3 p-3 border-subtle shadow-sm mb-3">
      {/* Fila superior con thumbnail, detalles y botón eliminar */}
      <div className="d-flex align-items-start gap-3">
        <Link to={`/producto/${item.codigo}`} className="flex-shrink-0">
          <img
            src={item.imagen}
            alt={item.nombre}
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </Link>

        <div className="flex-grow-1 min-w-0 pe-2">
          <Link
            to={`/producto/${item.codigo}`}
            className="text-light fw-bold text-decoration-none d-block text-truncate"
            title={item.nombre}
          >
            {item.nombre}
          </Link>
          <div className="text-secondary small mt-0 mb-1">
            {item.marca} · {item.modelo}
          </div>
          {Number(item.stock) <= Number(item.stockCritico || 2) && (
            <BadgeStock stock={item.stock} stockCritico={item.stockCritico} />
          )}
        </div>

        <button
          type="button"
          onClick={() => onQuitar(item.codigo)}
          className="btn btn-sm btn-outline-danger border-0 p-1 lh-1 flex-shrink-0"
          title="Eliminar producto"
          style={{ fontSize: '1.1rem' }}
        >
          🗑️
        </button>
      </div>

      {/* Fila inferior con controles de cantidad y subtotal */}
      <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top border-secondary border-opacity-25">
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

        <div className="text-end">
          <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>
            ${precioUnitario.toLocaleString('es-CL')} c/u
          </small>
          <span className="text-gold fw-bold fs-6">
            ${subtotal.toLocaleString('es-CL')}
          </span>
        </div>
      </div>
    </div>
  );
}
