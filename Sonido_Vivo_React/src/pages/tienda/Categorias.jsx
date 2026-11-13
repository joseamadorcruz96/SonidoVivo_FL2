import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Producto } from '../../components/Producto';
import { useCarrito } from '../../Context/CarritoContext';
import { listarProductos } from '../../services/productoService';

export function Categorias() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { agregarAlCarrito } = useCarrito();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let activo = true;
    listarProductos()
      .then((lista) => {
        if (activo) {
          setProductos(lista);
          setError('');
        }
      })
      .catch(() => {
        if (activo) {
          setProductos([]);
          setError('No fue posible cargar categorías y productos desde el servidor.');
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const categoriaSeleccionada = searchParams.get('cat') || 'Todas';

  const listaCategorias = useMemo(() => {
    const categoriasUnicas = Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean)));
    return ['Todas', ...categoriasUnicas];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    if (categoriaSeleccionada === 'Todas') return productos;
    return productos.filter(
      (p) => (p.categoria || '').toLowerCase() === categoriaSeleccionada.toLowerCase()
    );
  }, [productos, categoriaSeleccionada]);

  function cambiarCategoria(cat) {
    if (cat === 'Todas') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat });
    }
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge-hero-pill mb-2">Explora por Familia</span>
        <h1 className="display-5 fw-bold text-light mb-2">
          Categorías de <span className="text-gold">Instrumentos</span>
        </h1>
        <p className="text-secondary max-w-600 mx-auto">
          Filtra fácilmente nuestro catálogo especializado según la sección de tu preferencia.
        </p>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {listaCategorias.map((cat) => {
          const esActiva = categoriaSeleccionada.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => cambiarCategoria(cat)}
              className={`btn px-3 py-2 fw-semibold transition-all ${
                esActiva ? 'btn-hero-gold shadow-sm' : 'btn-outline-secondary text-light'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <h2 className="h4 text-light m-0">
          Mostrando: <span className="text-gold">{categoriaSeleccionada}</span>
        </h2>
        <span className="text-secondary small">
          {productosFiltrados.length}{' '}
          {productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </span>
      </div>

      {cargando && <p className="text-center text-secondary py-4">Cargando categorías...</p>}
      {!cargando && error && <div className="alert alert-warning text-center">{error}</div>}

      {!cargando && !error && productosFiltrados.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-secondary fs-5">No hay productos disponibles en esta categoría.</p>
          <button
            type="button"
            className="btn btn-hero-gold mt-2"
            onClick={() => cambiarCategoria('Todas')}
          >
            Ver todas las categorías
          </button>
        </div>
      ) : (
        <div className="row g-4" id="galeria_categorias">
          {productosFiltrados.map((prod) => (
            <div key={prod.codigo} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
              <Producto producto={prod} onAgregarAlCarrito={agregarAlCarrito} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
