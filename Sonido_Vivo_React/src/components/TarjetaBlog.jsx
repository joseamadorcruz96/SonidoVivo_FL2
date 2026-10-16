export function TarjetaBlog({
  imagen,
  textoAlternativo,
  categoria,
  fecha,
  titulo,
  descripcion,
  onLeerArticulo,
}) {
  return (
    <article className="card h-100 card-blog-custom">
      <img
        src={imagen}
        alt={textoAlternativo}
        className="card-img-top img-blog-cover"
      />

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge-blog-tag">{categoria}</span>
          <small className="text-secondary">{fecha}</small>
        </div>

        <h2 className="h5 card-title fw-bold text-light mb-2">
          {titulo}
        </h2>

        <p className="card-text text-secondary small flex-grow-1">
          {descripcion}
        </p>

        <div className="pt-3 border-top-subtle">
          <button
            type="button"
            className="btn btn-link p-0 btn-link-gold text-decoration-none"
            onClick={onLeerArticulo}
          >
            Leer artículo completo &rarr;
          </button>
        </div>
      </div>
    </article>
  );
}