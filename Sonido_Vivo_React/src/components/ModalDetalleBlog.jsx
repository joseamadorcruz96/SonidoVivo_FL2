export function ModalDetalleBlog({ articulo, onCerrar }) {
  if (!articulo) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content bg-dark text-light border-secondary">
          <div className="modal-header border-secondary">
            <div className="d-flex align-items-center gap-2">
              <span className="badge-blog-tag">{articulo.categoria}</span>
              <small className="text-secondary">{articulo.fecha}</small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCerrar}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body p-4">
            <img
              src={articulo.imagen}
              alt={articulo.textoAlternativo}
              className="img-fluid rounded mb-4 w-100"
              style={{ maxHeight: '350px', objectFit: 'cover' }}
            />
            <h2 className="h4 fw-bold text-gold mb-3">{articulo.titulo}</h2>
            <div className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
              {articulo.descripcionLarga || articulo.descripcion}
            </div>
          </div>

          <div className="modal-footer border-secondary justify-content-between">
            <small className="text-gold">Equipo Técnico Sonido Vivo · Viña del Mar</small>
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onCerrar}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
