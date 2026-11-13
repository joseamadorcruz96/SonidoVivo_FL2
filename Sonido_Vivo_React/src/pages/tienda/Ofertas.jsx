import { useState, useEffect, useMemo } from 'react';
import { Producto } from '../../components/Producto';
import { useCarrito } from '../../Context/CarritoContext';
import { listarProductos } from '../../services/productoService';

export function Ofertas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { agregarAlCarrito } = useCarrito();

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
          setError('No fue posible cargar las ofertas desde el servidor de inventario.');
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const productosEnOferta = useMemo(() => {
    const filtrados = productos.filter((p) => p.destacado || p.oferta || p.precio < 200000);
    return filtrados.length > 0 ? filtrados : productos.slice(0, 4);
  }, [productos]);

  return (
    <div className="container py-5">
      <div className="p-4 p-md-5 mb-5 rounded bg-dark border border-warning border-opacity-50 text-center position-relative overflow-hidden shadow">
        <span className="badge bg-danger px-3 py-2 text-uppercase fw-bold mb-3">
          🔥 Promociones de Temporada
        </span>
        <h1 className="display-4 fw-bold text-light mb-2">
          Zona de <span className="text-gold">Ofertas Especiales</span>
        </h1>
        <p className="lead text-secondary max-w-600 mx-auto">
          Aprovecha descuentos exclusivos en instrumentos seleccionados, amplificadores y accesorios con calibración incluida.
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <h2 className="h4 text-light m-0">
          Instrumentos con <span className="text-gold">Precio Rebajado</span>
        </h2>
        <span className="badge bg-warning text-dark fw-bold px-3 py-2">
          {productosEnOferta.length} Oportunidades activas
        </span>
      </div>

      {cargando && <p className="text-center text-secondary">Cargando ofertas...</p>}
      {!cargando && error && <div className="alert alert-warning text-center">{error}</div>}
      {!cargando && !error && productosEnOferta.length === 0 && (
        <p className="text-center text-secondary">No hay ofertas activas disponibles en este momento.</p>
      )}

      <div className="row g-4" id="galeria_ofertas">
        {productosEnOferta.map((prod) => (
          <div key={prod.codigo} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
            <Producto producto={prod} onAgregarAlCarrito={agregarAlCarrito} />
          </div>
        ))}
      </div>
    </div>
  );
}
