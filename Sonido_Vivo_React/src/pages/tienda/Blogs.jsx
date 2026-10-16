import { useState } from 'react';
import { TarjetaBlog } from '../../components/TarjetaBlog';
import { articulosBlog } from '../../data/articulosBlog';

const categorias = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'lutheria', nombre: 'Luthería & Mantenimiento' },
  { id: 'guitarras', nombre: 'Guitarras & Bajos' },
  { id: 'audio', nombre: 'Audio & Grabación' },
];

export function Blogs() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState('todos');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  const textoBusqueda = busqueda.toLowerCase().trim();

  const articulosFiltrados = articulosBlog.filter((articulo) => {
    const coincideCategoria =
      categoriaActual === 'todos' ||
      articulo.categoriaId === categoriaActual;

    const coincideTexto =
      articulo.titulo.toLowerCase().includes(textoBusqueda) ||
      articulo.descripcion.toLowerCase().includes(textoBusqueda);

    return coincideCategoria && coincideTexto;
  });

  return (
    <div id="blogs-main">
      <section className="hero-blogs text-center py-5">
        <div className="container py-3">
          <span className="badge-hero-pill mb-3">
            Noticias &amp; Consejos Técnicos
          </span>

          <h1 className="display-4 fw-bold hero-titulo mb-3">
            El Blog de <span className="text-gold">Sonido Vivo</span>
          </h1>

          <p
            className="lead text-secondary mx-auto mb-0"
            style={{ maxWidth: '700px' }}
          >
            Guías de luthería, consejos de mantenimiento, novedades del
            mundo de la música y tutoriales redactados por nuestro equipo
            técnico en Viña del Mar.
          </p>
        </div>
      </section>

      <section className="py-4 border-bottom-subtle">
        <div className="container">
          <div className="row g-3 align-items-center justify-content-between">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-surface border-subtle text-gold">
                  🔍
                </span>

                <input
                  type="text"
                  className="form-control input-blog-search"
                  placeholder="Buscar artículos por título o palabra clave..."
                  aria-label="Buscar artículos"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-7 text-md-end">
              <div
                className="btn-group flex-wrap gap-1"
                role="group"
                aria-label="Filtro de categorías de blog"
              >
                {categorias.map((categoria) => (
                  <button
                    key={categoria.id}
                    type="button"
                    className={`btn btn-outline-gold btn-filtro-blog ${
                      categoriaActual === categoria.id ? 'active' : ''
                    }`}
                    aria-pressed={categoriaActual === categoria.id}
                    onClick={() => setCategoriaActual(categoria.id)}
                  >
                    {categoria.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {articulosFiltrados.length === 0 && (
            <div
              className="alert alert-warning text-center my-4"
              role="status"
            >
              No se encontraron artículos que coincidan con tu búsqueda.
            </div>
          )}

          <div className="row g-4">
            {articulosFiltrados.map((articulo) => (
              <div
                key={articulo.id}
                className="col-12 col-md-6 col-lg-4 tarjeta-blog-item"
              >
                <TarjetaBlog
                  imagen={articulo.imagen}
                  textoAlternativo={articulo.textoAlternativo}
                  categoria={articulo.categoria}
                  fecha={articulo.fecha}
                  titulo={articulo.titulo}
                  descripcion={articulo.descripcion}
                  onLeerArticulo={() => setArticuloSeleccionado(articulo)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Lectura Extendida del Artículo (Detalle Blogs) */}
      {articuloSeleccionado && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark text-light border-secondary">
              <div className="modal-header border-secondary">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge-blog-tag">{articuloSeleccionado.categoria}</span>
                  <small className="text-secondary">{articuloSeleccionado.fecha}</small>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setArticuloSeleccionado(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <img
                  src={articuloSeleccionado.imagen}
                  alt={articuloSeleccionado.textoAlternativo}
                  className="img-fluid rounded mb-4 w-100"
                  style={{ maxHeight: '350px', objectFit: 'cover' }}
                />
                <h2 className="h4 fw-bold text-gold mb-3">{articuloSeleccionado.titulo}</h2>
                <div className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                  {articuloSeleccionado.descripcionLarga || articuloSeleccionado.descripcion}
                </div>
              </div>

              <div className="modal-footer border-secondary justify-content-between">
                <small className="text-gold">Equipo Técnico Sonido Vivo · Viña del Mar</small>
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setArticuloSeleccionado(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}