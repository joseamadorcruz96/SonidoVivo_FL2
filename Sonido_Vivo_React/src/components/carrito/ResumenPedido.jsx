import { Link } from 'react-router-dom';

export function ResumenPedido({ total, cantidadTotal, onVaciar }) {
  const totalFormateado = `$${Number(total || 0).toLocaleString('es-CL')}`;

  return (
    <div className="card-resumen-compra p-4">
      <h3 className="h5 fw-bold mb-3 text-gold">Resumen del Pedido</h3>

      <div className="d-flex justify-content-between py-2 border-bottom-subtle">
        <span className="text-secondary">Artículos en total:</span>
        <span className="fw-bold text-light">{cantidadTotal}</span>
      </div>

      <div className="d-flex justify-content-between py-2 border-bottom-subtle">
        <span className="text-secondary">Despacho:</span>
        <span className="text-success fw-bold">Gratis (Viña / Valparaíso)</span>
      </div>

      <div className="d-flex justify-content-between py-3 fs-5">
        <strong className="text-light">Total a Pagar:</strong>
        <strong className="text-gold">{totalFormateado}</strong>
      </div>

      <button
        type="button"
        className="btn btn-hero-gold w-100 py-2 mt-3 fw-bold"
        onClick={() => alert(`¡Gracias por tu compra en Sonido Vivo!\nTotal procesado: ${totalFormateado}`)}
      >
        Continuar al Pago &rarr;
      </button>

      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top-subtle">
        <Link to="/Catalogo" className="btn btn-sm btn-outline-secondary">
          &larr; Seguir explorando
        </Link>

        {onVaciar && (
          <button
            type="button"
            onClick={onVaciar}
            className="btn btn-sm btn-outline-danger"
          >
            Vaciar Carrito
          </button>
        )}
      </div>
    </div>
  );
}
