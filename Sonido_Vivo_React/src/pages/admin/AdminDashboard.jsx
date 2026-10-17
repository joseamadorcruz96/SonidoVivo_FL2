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
import { getOrdenes, getUsuarios } from '../../services/db';

const COLORES_TORTA = ['#FFC107', '#FF9800', '#FF5722', '#795548', '#00BCD4'];

export function AdminDashboard() {
  const ordenes = getOrdenes();
  const usuarios = getUsuarios();

  const metricas = useMemo(() => {
    const ordenesCompletadas = ordenes.filter((o) => o.estado === 'completada');
    const totalVentas = ordenesCompletadas.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    const guardadosProductos = localStorage.getItem('sv_productos');
    const productos = guardadosProductos ? JSON.parse(guardadosProductos) : [];
    const stockTotal = productos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

    return {
      totalVentas,
      cantidadOrdenes: ordenes.length,
      totalProductos: productos.length,
      stockTotal,
      totalUsuarios: usuarios.length,
    };
  }, [ordenes, usuarios]);

  // Datos simulados para los gráficos de ventas
  const datosProductosMasVendidos = [
    { nombre: 'Stratocaster', ventas: 45 },
    { nombre: 'Bajo Jazz', ventas: 30 },
    { nombre: 'Teclado Yamaha', ventas: 25 },
    { nombre: 'Batería Pearl', ventas: 18 },
    { nombre: 'Pedal Boss', ventas: 40 },
  ];

  const datosVentasPorCategoria = [
    { nombre: 'Guitarras', valor: 3500000 },
    { nombre: 'Bajos', valor: 1200000 },
    { nombre: 'Teclados', valor: 950000 },
    { nombre: 'Baterías', valor: 850000 },
    { nombre: 'Accesorios', valor: 450000 },
  ];

  return (
    <div className="container-fluid text-light py-2" style={{ minWidth: 0 }}>
      {/* Cabecera Principal (Figura 9) */}
      <div className="mb-4">
        <h2 className="text-light fw-bold m-0">
          Dashboard <span style={{ color: 'var(--color-gold)' }}>Principal</span>
        </h2>
        <p className="text-secondary small m-0">Resumen de las actividades y operaciones del sistema</p>
      </div>

      {/* Tarjetas Superiores de Métricas (Figura 9: Compras, Productos, Usuarios) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4" style={{ minWidth: 0 }}>
          <div className="card bg-primary bg-opacity-75 text-white border-0 shadow-sm h-100 p-3">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <div className="min-w-0 flex-grow-1">
                <span className="small text-white-50 text-uppercase fw-bold d-block text-truncate">Compras / Órdenes</span>
                <h3 className="fw-bold my-1 text-truncate">
                  {metricas.cantidadOrdenes > 0 ? metricas.cantidadOrdenes : '1,234'}
                </h3>
                <small className="text-white-50 d-block text-truncate">
                  Total facturado: ${metricas.totalVentas.toLocaleString('es-CL')}
                </small>
              </div>
              <span className="fs-1 opacity-50 flex-shrink-0">🛒</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4" style={{ minWidth: 0 }}>
          <div className="card bg-success bg-opacity-75 text-white border-0 shadow-sm h-100 p-3">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <div className="min-w-0 flex-grow-1">
                <span className="small text-white-50 text-uppercase fw-bold d-block text-truncate">Productos</span>
                <h3 className="fw-bold my-1 text-truncate">{metricas.totalProductos}</h3>
                <small className="text-white-50 d-block text-truncate">Inventario disponible: {metricas.stockTotal} un.</small>
              </div>
              <span className="fs-1 opacity-50 flex-shrink-0">📦</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-12 col-xl-4" style={{ minWidth: 0 }}>
          <div className="card bg-warning bg-opacity-75 text-dark border-0 shadow-sm h-100 p-3">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <div className="min-w-0 flex-grow-1">
                <span className="small text-black-50 text-uppercase fw-bold d-block text-truncate">Usuarios</span>
                <h3 className="fw-bold my-1 text-truncate">{metricas.totalUsuarios}</h3>
                <small className="text-black-50 d-block text-truncate">Cuentas registradas en plataforma</small>
              </div>
              <span className="fs-1 opacity-50 flex-shrink-0">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Gráficos Recharts */}
      <div className="row g-4">
        {/* Gráfico de Barras: Productos Más Vendidos */}
        <div className="col-12 col-xl-7" style={{ minWidth: 0 }}>
          <div className="card bg-dark border-secondary h-100 shadow-sm p-3" style={{ minWidth: 0 }}>
            <h5 className="text-light mb-3 fs-6 fw-bold">Top 5 Productos Más Vendidos (Unidades)</h5>
            <div style={{ width: '100%', height: 320, minWidth: 0, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={datosProductosMasVendidos} margin={{ top: 10, right: 10, left: -15, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="nombre" stroke="#ccc" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} height={55} />
                  <YAxis stroke="#ccc" tick={{ fontSize: 11 }} />
                  <TooltipBar cursor={{ fill: '#333' }} contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }} />
                  <Legend wrapperStyle={{ paddingTop: '5px' }} />
                  <Bar dataKey="ventas" name="Unidades Vendidas" fill="var(--color-gold, #FFC107)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfico de Torta: Ingresos por Categoría */}
        <div className="col-12 col-xl-5" style={{ minWidth: 0 }}>
          <div className="card bg-dark border-secondary h-100 shadow-sm p-3" style={{ minWidth: 0 }}>
            <h5 className="text-light mb-3 fs-6 fw-bold">Ingresos por Categoría</h5>
            <div style={{ width: '100%', height: 320, minWidth: 0, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={datosVentasPorCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="valor"
                    nameKey="nombre"
                  >
                    {datosVentasPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES_TORTA[index % COLORES_TORTA.length]} />
                    ))}
                  </Pie>
                  <TooltipPie
                    formatter={(value) => `$${value.toLocaleString('es-CL')}`}
                    contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}