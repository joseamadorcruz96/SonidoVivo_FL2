import { useState, useMemo } from 'react';
import { Producto } from '../../components/Producto';
import { cargarProductosDesdeLocalStorage } from './Catalogo';
import { useCarrito } from '../../Context/CarritoContext';

export function Ofertas() {
  const [productos] = useState(cargarProductosDesdeLocalStorage);
  const { agregarAlCarrito } = useCarrito();

  // Filtrar productos marcados como destacados o en oferta especial
  const productosEnOferta = useMemo(() => {
    // Si algún producto tiene propiedad oferta o destacado, o seleccionamos los productos con ofertas especiales
    const filtrados = productos.filter((p) => p.destacado || p.oferta || p.precio < 200000);
    // Si no hay ninguno con esa condición, mostramos los primeros 4 como destacados en oferta
    return filtrados.length > 0 ? filtrados : productos.slice(0, 4);
  }, [productos]);

  return (
    <div className="container py-5">
      {/* Banner de Ofertas */}
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

      {/* Contador de Ofertas */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <h2 className="h4 text-light m-0">
          Instrumentos con <span className="text-gold">Precio Rebajado</span>
        </h2>
        <span className="badge bg-warning text-dark fw-bold px-3 py-2">
          {productosEnOferta.length} Oportunidades activas
        </span>
      </div>

      {/* Grilla de Productos */}
      <div className="row g-4" id="galeria_ofertas">
        {productosEnOferta.map((prod) => (
          <div key={prod.codigo} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
            <Producto
              producto={prod}
              onAgregarAlCarrito={agregarAlCarrito}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
