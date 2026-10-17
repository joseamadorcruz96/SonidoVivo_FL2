import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as TooltipBar,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as TooltipPie,
} from 'recharts';
import { getOrdenes } from '../../services/db';

const COLORES = ['#FFC107', '#FF9800', '#FF5722', '#00BCD4', '#4CAF50', '#9C27B0', '#E91E63', '#607D8B'];

export function AdminReportes() {
  const ordenes = getOrdenes();

  // Calcular métricas clave
  const metricas = useMemo(() => {
    const completadas = ordenes.filter((o) => o.estado === 'completada');
    const totalVentas = completadas.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const ticketPromedio = completadas.length > 0 ? Math.round(totalVentas / completadas.length) : 0;

    const guardadosProductos = localStorage.getItem('sv_productos');
    const productos = guardadosProductos ? JSON.parse(guardadosProductos) : [];
    const criticos = productos.filter((p) => Number(p.stock) <= Number(p.stockCritico || 2));

    return {
      totalVentas,
      cantidadOrdenes: completadas.length,
      ticketPromedio,
      totalProductos: productos.length,
      productosCriticos: criticos.length,
      listaCriticos: criticos,
    };
  }, [ordenes]);

  // Datos para gráfico de categorías (derivado de productos)
  const datosPorCategoria = useMemo(() => {
    const guardadosProductos = localStorage.getItem('sv_productos');
    const productos = guardadosProductos ? JSON.parse(guardadosProductos) : [];
    const conteo = {};
    productos.forEach((p) => {
      conteo[p.categoria] = (conteo[p.categoria] || 0) + 1;
    });

    return Object.entries(conteo).map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
    }));
  }, []);

  // Datos para gráfico de productos con mayor inventario vs stock crítico
  const datosStockProductos = useMemo(() => {
    const guardadosProductos = localStorage.getItem('sv_productos');
    const productos = guardadosProductos ? JSON.parse(guardadosProductos) : [];
    return productos.slice(0, 6).map((p) => ({
      nombre: p.nombre.length > 15 ? p.nombre.slice(0, 15) + '...' : p.nombre,
      stock: Number(p.stock || 0),
      critico: Number(p.stockCritico || 2),
    }));
  }, []);

  return (
    <div className="container-fluid text-light py-2">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--color-gold)' }}>
          Reportes y Estadísticas del Sistema
        </h2>
        <p className="text-secondary small m-0">
          Métricas de desempeño comercial, inventario crítico y comportamiento de ventas.
        </p>
      </div>

      {/* Tarjetas de Métricas Clave */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-secondary p-3 shadow-sm h-100">
            <span className="text-secondary small">Ventas Totales Registradas</span>
            <h3 className="text-success fw-bold m-0 mt-2">
              ${metricas.totalVentas.toLocaleString('es-CL')}
            </h3>
            <span className="text-muted smaller mt-1">Órdenes pagadas con éxito</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-secondary p-3 shadow-sm h-100">
            <span className="text-secondary small">Órdenes Procesadas</span>
            <h3 className="text-light fw-bold m-0 mt-2">
              {metricas.cantidadOrdenes}
            </h3>
            <span className="text-info smaller mt-1">Ticket promedio: ${metricas.ticketPromedio.toLocaleString('es-CL')}</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-secondary p-3 shadow-sm h-100">
            <span className="text-secondary small">Catálogo Activo</span>
            <h3 className="text-warning fw-bold m-0 mt-2">
              {metricas.totalProductos}
            </h3>
            <span className="text-muted smaller mt-1">Instrumentos y accesorios</span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card bg-dark border-danger border-opacity-50 p-3 shadow-sm h-100">
            <span className="text-danger small fw-semibold">Alertas de Stock Crítico</span>
            <h3 className="text-danger fw-bold m-0 mt-2">
              {metricas.productosCriticos}
            </h3>
            <span className="text-muted smaller mt-1">Productos con reposición urgente</span>
          </div>
        </div>
      </div>

      {/* Gráficos Recharts */}
      <div className="row g-4 mb-4">
        {/* Gráfico de Barras: Niveles de Stock */}
        <div className="col-12 col-lg-7" style={{ minWidth: 0 }}>
          <div className="card bg-dark border-secondary p-4 h-100 shadow-sm">
            <h4 className="h6 fw-bold text-light mb-3">
              Nivel de Stock vs. Umbral Crítico (Muestra de Productos)
            </h4>
            <div style={{ width: '100%', height: 280, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosStockProductos} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="nombre" stroke="#ccc" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                  <YAxis stroke="#ccc" tick={{ fontSize: 11 }} />
                  <TooltipBar contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="stock" name="Stock Actual" fill="var(--color-gold, #FFC107)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="critico" name="Stock Crítico" fill="#dc3545" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfico de Torta: Distribución por Categoría */}
        <div className="col-12 col-lg-5" style={{ minWidth: 0 }}>
          <div className="card bg-dark border-secondary p-4 h-100 shadow-sm">
            <h4 className="h6 fw-bold text-light mb-3">
              Distribución de Catálogo por Categorías
            </h4>
            <div style={{ width: '100%', height: 280, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosPorCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="cantidad"
                    nameKey="nombre"
                  >
                    {datosPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                    ))}
                  </Pie>
                  <TooltipPie contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', maxHeight: '70px', overflowY: 'auto' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Productos con Stock Crítico (Requerimiento Figura 10) */}
      <div className="card bg-dark border-danger border-opacity-50 p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="h6 fw-bold text-danger m-0">
            ⚠️ Listado de Productos en Nivel Crítico (Reposición Inmediata)
          </h4>
          <span className="badge bg-danger">{metricas.productosCriticos} ítems</span>
        </div>

        {metricas.listaCriticos.length === 0 ? (
          <p className="text-secondary small m-0">
            Excelente: Todos los productos se encuentran actualmente por encima de su umbral crítico.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-sm table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary smaller">
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th className="text-center">Stock Actual</th>
                  <th className="text-center">Stock Crítico</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {metricas.listaCriticos.map((prod) => (
                  <tr key={prod.codigo}>
                    <td><small className="text-secondary">{prod.codigo}</small></td>
                    <td className="text-light fw-bold">{prod.nombre}</td>
                    <td><span className="badge bg-secondary">{prod.categoria}</span></td>
                    <td className="text-center fw-bold text-danger">{prod.stock} un.</td>
                    <td className="text-center text-secondary">{prod.stockCritico} un.</td>
                    <td>
                      {Number(prod.stock) === 0 ? (
                        <span className="badge bg-danger">Agotado</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Bajo Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
