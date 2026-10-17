import { useState, useMemo } from 'react';
import { getOrdenes } from '../../services/db';

export function AdminOrdenes() {
  const [ordenes] = useState(getOrdenes);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  // Filtrado de órdenes
  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter((o) => {
      const coincideEstado = filtroEstado === 'todas' || o.estado === filtroEstado;
      const termino = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !termino ||
        (o.numeroOrden || '').toLowerCase().includes(termino) ||
        (o.codigoOrden || '').toLowerCase().includes(termino) ||
        (o.cliente?.nombre || '').toLowerCase().includes(termino) ||
        (o.cliente?.email || '').toLowerCase().includes(termino);
      return coincideEstado && coincideBusqueda;
    });
  }, [ordenes, filtroEstado, busqueda]);

  function imprimirBoleta() {
    window.print();
  }

  return (
    <div className="container-fluid text-light py-2">
      {/* Cabecera y controles */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--color-gold)' }}>
            Gestión de Órdenes y Boletas
          </h2>
          <p className="text-secondary small m-0">
            Monitorea los pedidos realizados por los clientes y emite comprobantes de venta.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
          <input
            type="text"
            className="form-control bg-dark text-light border-secondary"
            style={{ maxWidth: '260px' }}
            placeholder="🔍 Buscar orden o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            className="form-select bg-dark text-light border-secondary"
            style={{ width: '160px' }}
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todas">Todos los estados</option>
            <option value="completada">Completadas</option>
            <option value="fallida">Fallidas</option>
          </select>
        </div>
      </div>

      {/* Lista de Órdenes */}
      {ordenesFiltradas.length === 0 ? (
        <div className="card bg-dark border-secondary p-5 text-center">
          <span className="fs-1 mb-2">🧾</span>
          <h4 className="text-secondary">No se encontraron órdenes registradas</h4>
          <p className="text-muted small">
            Las compras realizadas desde la tienda pública se reflejarán automáticamente aquí.
          </p>
        </div>
      ) : (
        <div className="table-responsive bg-dark rounded shadow-sm p-3 border border-secondary border-opacity-25">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr className="text-secondary small">
                <th>N° Orden</th>
                <th>Código</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <strong className="text-light">{ord.numeroOrden}</strong>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{ord.codigoOrden}</span>
                  </td>
                  <td>
                    <div>{ord.cliente?.nombre} {ord.cliente?.apellidos}</div>
                    <small className="text-secondary">{ord.cliente?.email}</small>
                  </td>
                  <td className="small text-secondary">
                    {new Date(ord.fecha).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="text-gold fw-bold">
                    ${Number(ord.total || 0).toLocaleString('es-CL')}
                  </td>
                  <td>
                    {ord.estado === 'completada' ? (
                      <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                        ✓ Pagada
                      </span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50">
                        ✕ Fallida
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => setOrdenSeleccionada(ord)}
                    >
                      📄 Ver Boleta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal / Vista de Detalle de Boleta (Requerimiento Figura 10) */}
      {ordenSeleccionada && (
        <div
          className="modal d-block bg-black bg-opacity-75"
          tabIndex="-1"
          style={{ zIndex: 1050 }}
          onClick={() => setOrdenSeleccionada(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark text-light border border-secondary shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-gold">
                  Boleta Electrónica {ordenSeleccionada.numeroOrden}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setOrdenSeleccionada(null)}
                  aria-label="Cerrar"
                />
              </div>

              <div className="modal-body p-4" id="boleta-imprimible">
                {/* Cabecera de la boleta */}
                <div className="d-flex justify-content-between align-items-start border-bottom border-secondary border-opacity-50 pb-3 mb-3">
                  <div>
                    <h4 className="fw-bold m-0" style={{ color: 'var(--color-gold)' }}>
                      Sonido Vivo Instrumentos SpA
                    </h4>
                    <small className="text-secondary">RUT: 76.543.210-K · Casa Matriz V Región</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">{ordenSeleccionada.codigoOrden}</div>
                    <small className="text-secondary">
                      {new Date(ordenSeleccionada.fecha).toLocaleString('es-CL')}
                    </small>
                  </div>
                </div>

                {/* Datos del Cliente y Despacho */}
                <div className="row g-3 mb-3 small">
                  <div className="col-sm-6">
                    <strong className="text-secondary d-block">Cliente:</strong>
                    <div>{ordenSeleccionada.cliente?.nombre} {ordenSeleccionada.cliente?.apellidos}</div>
                    <div className="text-info">{ordenSeleccionada.cliente?.email}</div>
                  </div>
                  <div className="col-sm-6">
                    <strong className="text-secondary d-block">Dirección de Entrega:</strong>
                    <div>{ordenSeleccionada.direccion?.calle} {ordenSeleccionada.direccion?.departamento || ''}</div>
                    <div>{ordenSeleccionada.direccion?.comuna}, {ordenSeleccionada.direccion?.region}</div>
                  </div>
                </div>

                {/* Detalle de ítems */}
                <div className="table-responsive mb-3">
                  <table className="table table-dark table-sm border border-secondary border-opacity-25">
                    <thead>
                      <tr className="text-secondary smaller">
                        <th>Producto</th>
                        <th className="text-end">Precio</th>
                        <th className="text-center">Cant.</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenSeleccionada.items?.map((item) => (
                        <tr key={item.codigo}>
                          <td>{item.nombre}</td>
                          <td className="text-end">${Number(item.precio).toLocaleString('es-CL')}</td>
                          <td className="text-center">{item.cantidad}</td>
                          <td className="text-end text-gold">
                            ${Number(item.precio * item.cantidad).toLocaleString('es-CL')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="d-flex justify-content-between align-items-center p-3 rounded bg-black border border-warning border-opacity-50">
                  <span className="fw-bold">Total Pagado:</span>
                  <span className="fs-4 text-gold fw-bold">
                    ${Number(ordenSeleccionada.total || 0).toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <div className="modal-footer border-secondary no-print">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={imprimirBoleta}
                >
                  🖨️ Imprimir Boleta
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOrdenSeleccionada(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
