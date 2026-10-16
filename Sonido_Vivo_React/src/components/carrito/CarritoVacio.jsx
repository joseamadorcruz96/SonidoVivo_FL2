import { Link } from 'react-router-dom';

export function CarritoVacio() {
  return (
    <div className="container py-5 text-center">
      <div className="py-5">
        <span className="display-1 mb-3 d-block" role="img" aria-label="Carrito vacío">
          🛒
        </span>
        <h2 className="h3 fw-bold mb-3 text-light">Tu carrito está vacío</h2>
        <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '500px' }}>
          Aún no has agregado instrumentos ni accesorios a tu pedido.
          Visita nuestro catálogo para descubrir guitarras, amplificadores y servicio de luthería.
        </p>
        <Link to="/Catalogo" className="btn btn-hero-gold px-4 py-2 fw-bold">
          🎸 Explorar Catálogo
        </Link>
      </div>
    </div>
  );
}
