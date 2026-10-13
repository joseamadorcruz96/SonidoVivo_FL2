import { Link } from 'react-router-dom';
import { useCarrito } from '../Context/CarritoContext';

export function BotonCarritoNav() {
  const { cantidadTotal } = useCarrito();

  return (
    <Link
      to="/Carrito"
      className="btn-carrito-nav"
      id="boton-carrito-nav"
      title="Ver carrito de compras"
    >
      <span>🛒 Carrito</span>
      <span id="contador-carrito" className="badge-carrito">
        {cantidadTotal}
      </span>
    </Link>
  );
}
