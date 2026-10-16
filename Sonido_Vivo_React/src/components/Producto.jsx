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

  // 1. Formateo de precio a moneda chilena (CLP)
  const precioFormateado = `$ ${Number(precio).toLocaleString('es-CL')}`;

  // 2. Cálculo visual del semáforo de stock (idéntico a catalogo.js)
  const estaAgotado = stock <= 0;
  const esStockCritico = stock > 0 && stock <= stockCritico;

  let claseBadgeStock = 'badge bg-success';
  let textoStock = `Stock: ${stock}`;

  if (estaAgotado) {
    claseBadgeStock = 'badge bg-danger';
    textoStock = 'Agotado';
  } else if (esStockCritico) {
    claseBadgeStock = 'badge bg-warning text-dark';
    textoStock = `Últimas ${stock} un.`;
  }

  // 3. Manejador del botón agregar
  function manejarClickAgregar() {
    if (!estaAgotado && typeof onAgregarAlCarrito === 'function') {
      onAgregarAlCarrito(producto);
    }
  }

  return (
    <article className="card card-producto h-100" data-codigo={codigo}>
      {/* Imagen del producto con texto alternativo */}
      <img
        src={imagen}
        alt={nombre}
        className="card-img-top card-producto-img"
        loading="lazy"
      />

      {/* Cuerpo de la tarjeta */}
      <div className="card-body card-producto-body">
        {/* Bloque Superior: Categoría, Título, Marca/Modelo y Descripción */}
        <div>
          <span className="badge-hero-pill card-producto-categoria">
            {categoria}
          </span>

          <h3 className="card-title card-producto-titulo">
            {nombre}
          </h3>

          <p className="card-producto-subtitulo">
            {marca} · {modelo}
          </p>

          <p className="card-producto-desc">
            {descripcion}
          </p>
        </div>

        {/* Bloque Inferior: Fila de Precio/Stock y Botón de Acción */}
        <div className="card-producto-footer">
          <div className="card-producto-precio-row">
            <span className="card-producto-precio">
              {precioFormateado}
            </span>

            <span className={claseBadgeStock}>
              {textoStock}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-hero-gold w-100 btn-agregar-carrito"
            disabled={estaAgotado}
            onClick={manejarClickAgregar}
          >
            {estaAgotado ? 'Agotado' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </article>
  );
}
