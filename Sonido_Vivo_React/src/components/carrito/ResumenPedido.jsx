import { Link } from 'react-router-dom';

// Resumen del pedido con métricas y totales individualizados
export function ResumenPedido({ total, cantidadTotal, onVaciar }) {
  const totalFormateado = `$${Number(total || 0).toLocaleString('es-CL')}`;

  return (
    <div className="card-resumen-compra p-4">
      <h3 className="h5 fw-bold mb-3 text-gold">Resumen del Pedido</h3>

      {/* Métricas individualizadas con cápsulas contrastadas */}
      <div className="d-flex justify-content-between align-items-center p-3 mb-2 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25">
        <span className="text-secondary">Artículos en total:</span>
        <span className="badge bg-secondary fs-6 px-3 py-1">{cantidadTotal}</span>
      </div>

      <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25">
        <span className="text-secondary">Despacho:</span>
        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-2 py-1">
          Gratis (V Región)
        </span>
      </div>

      {/* Total a pagar destacado */}
      <div className="d-flex justify-content-between align-items-center p-3 mb-3 rounded bg-dark border border-warning border-opacity-50 shadow-sm">
        <strong className="text-light fs-6">Total a Pagar:</strong>
        <strong className="text-gold fs-4">{totalFormateado}</strong>
      </div>

      <button
        type="button"
        className="btn btn-hero-gold w-100 py-2 fw-bold shadow-sm"
        onClick={() => alert(`¡Gracias por tu compra en Sonido Vivo!\nTotal procesado: ${totalFormateado}`)}
      >
        Continuar al Pago &rarr;
      </button>

      {/* Enlaces y acciones secundarias */}
      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-25">
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
