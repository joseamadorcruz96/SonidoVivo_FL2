import { Link } from 'react-router-dom';

export function FilaItemCarrito({ item, onCambiarCantidad, onQuitar }) {
  const cantidad = Number(item.cantidad) || 1;
  const precioUnitario = Number(item.precio) || 0;
  const subtotal = precioUnitario * cantidad;
  const limiteStock = item.stock || 999;

  return (
    <tr>
      {/* 1. Imagen y datos del instrumento */}
      <td>
        <div className="d-flex align-items-center gap-3">
          <Link to={`/producto/${item.codigo}`}>
            <img
              src={item.imagen}
              alt={item.nombre}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </Link>
          <div>
            <Link
              to={`/producto/${item.codigo}`}
              className="d-block text-light fw-bold text-decoration-none"
            >
              {item.nombre}
            </Link>
            <small className="text-secondary">
              {item.marca} · {item.modelo}
            </small>
          </div>
        </div>
      </td>

      {/* 2. Precio unitario */}
      <td className="text-end text-secondary">
        ${precioUnitario.toLocaleString('es-CL')}
      </td>

      {/* 3. Selector interactivo de cantidad */}
      <td className="text-center">
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
      </td>

      {/* 4. Subtotal */}
      <td className="text-end text-gold fw-bold">
        ${subtotal.toLocaleString('es-CL')}
      </td>

      {/* 5. Botón eliminar */}
      <td className="text-center">
        <button
          type="button"
          onClick={() => onQuitar(item.codigo)}
          className="btn btn-sm btn-outline-danger"
          title="Eliminar producto"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
