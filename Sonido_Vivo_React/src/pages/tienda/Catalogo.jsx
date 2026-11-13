import { useState, useEffect } from 'react';
import { Producto } from '../../components/Producto';
import { useCarrito } from '../../Context/CarritoContext';
import { listarProductos } from '../../services/productoService';

export function Catalogo({ onAgregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { agregarAlCarrito } = useCarrito();

  const funcionAgregar = onAgregarAlCarrito || agregarAlCarrito;

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
          setError('No fue posible cargar el catálogo desde el servidor de inventario.');
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-light mb-2">
          Catálogo de <span className="text-gold">Instrumentos</span>
        </h1>
        <p className="text-secondary">
          Explora nuestra selección de guitarras, bajos, baterías y accesorios calibrados.
        </p>
      </div>

      {cargando && <p className="text-center text-secondary">Cargando catálogo...</p>}
      {!cargando && error && <div className="alert alert-warning text-center">{error}</div>}
      {!cargando && !error && productos.length === 0 && (
        <p className="text-center text-secondary">No hay productos disponibles en el catálogo.</p>
      )}

      <div className="row g-4" id="galeria_productos">
        {productos.map((producto) => (
          <div key={producto.codigo} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
            <Producto producto={producto} onAgregarAlCarrito={funcionAgregar} />
          </div>
        ))}
      </div>
    </div>
  );
}
