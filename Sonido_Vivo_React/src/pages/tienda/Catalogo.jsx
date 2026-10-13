import { useState } from 'react';
import { Producto } from '../../components/Producto';
import { productosIniciales } from '../../data/productosIniciales';
import { useCarrito } from '../../Context/CarritoContext';

// 1. Carga productos de LocalStorage. Si no hay nada, guarda y devuelve los iniciales.
export function cargarProductosDesdeLocalStorage() {
  const guardados = localStorage.getItem('sv_productos');

  if (guardados) {
    return JSON.parse(guardados);
  }

  localStorage.setItem('sv_productos', JSON.stringify(productosIniciales));
  return productosIniciales;
}

export function Catalogo({ onAgregarAlCarrito }) {
  // 2. Estado inicial: se carga directamente llamando a la función
  const [productos] = useState(cargarProductosDesdeLocalStorage);
  const { agregarAlCarrito } = useCarrito();

  // Si no se pasó una prop onAgregarAlCarrito, usa directamente la del contexto
  const funcionAgregar = onAgregarAlCarrito || agregarAlCarrito;

  // 3. Convierte cada producto del arreglo en un componente visual <Producto />
  function renderizarProductos() {
    return productos.map((producto) => (
      <div key={producto.codigo} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
        <Producto
          producto={producto}
          onAgregarAlCarrito={funcionAgregar}
        />
      </div>
    ));
  }

  // 4. Estructura visual principal
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

      <div className="row g-4" id="galeria_productos">
        {renderizarProductos()}
      </div>
    </div>
  );
}
