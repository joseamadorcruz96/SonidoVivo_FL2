import { Link } from 'react-router-dom';
import { BadgeStock } from './BadgeStock';

export function Producto({ producto, onAgregarAlCarrito }) {
  if (!producto) return null;

  const {
    codigo,
    nombre,
    categoria,
    marca,
    modelo,
    descripcion,
    precio = 0,
    stock = 0,
    stockCritico = 2,
    imagen,
  } = producto;

  const precioFormateado = `$${Number(precio).toLocaleString('es-CL')}`;
  const estaAgotado = Number(stock) <= 0;

  function manejarClickAgregar(e) {
    e.stopPropagation();
    if (!estaAgotado && typeof onAgregarAlCarrito === 'function') {
      onAgregarAlCarrito(producto, 1);
    }
  }

  return (
    <article className="card card-producto h-100" data-codigo={codigo}>
      {/* Enlace al detalle a través de la imagen */}
      <Link to={`/producto/${codigo}`} className="text-decoration-none">
        <img
          src={imagen}
          alt={nombre}
          className="card-img-top card-producto-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </Link>

      {/* Cuerpo de la tarjeta */}
      <div className="card-body card-producto-body d-flex flex-column justify-content-between">
        <div>
          <span className="badge-hero-pill card-producto-categoria mb-2">
            {categoria}
          </span>

          {/* Enlace al detalle en el título */}
          <h3 className="card-title card-producto-titulo">
            <Link to={`/producto/${codigo}`} className="text-light text-decoration-none hover-gold">
              {nombre}
            </Link>
          </h3>

          <p className="card-producto-subtitulo">
            {marca} · {modelo}
          </p>

          <p className="card-producto-desc">
            {descripcion}
          </p>
        </div>

        {/* Bloque Inferior: Precio, semáforo modular y Botón */}
        <div className="card-producto-footer">
          <div className="card-producto-precio-row mb-2">
            <span className="card-producto-precio">
              {precioFormateado}
            </span>

            <BadgeStock stock={stock} stockCritico={stockCritico} />
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/producto/${codigo}`}
              className="btn btn-sm btn-hero-outline flex-fill"
            >
              Ver Detalle
            </Link>

            <button
              type="button"
              className="btn btn-sm btn-hero-gold flex-fill btn-agregar-carrito"
              disabled={estaAgotado}
              onClick={manejarClickAgregar}
              title={estaAgotado ? 'Producto agotado' : 'Añadir al carrito'}
            >
              {estaAgotado ? 'Agotado' : '🛒 Añadir'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
