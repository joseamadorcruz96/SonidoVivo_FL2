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
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}