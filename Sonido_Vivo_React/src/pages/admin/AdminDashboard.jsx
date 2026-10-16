import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as TooltipBar, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip as TooltipPie
} from 'recharts';

// --- Datos simulados para los gráficos ---
const datosProductosMasVendidos = [
    { nombre: 'Fender Stratocaster', ventas: 45 },
    { nombre: 'Bajo Yamaha TRBX', ventas: 30 },
    { nombre: 'Teclado Casio', ventas: 25 },
    { nombre: 'Batería Pearl', ventas: 18 },
    { nombre: 'Micrófono Shure', ventas: 40 },
];

const datosVentasPorCategoria = [
    { nombre: 'Guitarras', valor: 3500000 },
    { nombre: 'Bajos', valor: 1200000 },
    { nombre: 'Audio/Micrófonos', valor: 850000 },
    { nombre: 'Accesorios', valor: 450000 },
];

// Colores dorados y oscuros para mantener la estética de Sonido Vivo
const COLORES_TORTA = ['#FFC107', '#FF9800', '#FF5722', '#795548'];

export function AdminDashboard() {
    return (
        <div className="container-fluid py-4" style={{ backgroundColor: 'var(--bg-body)', minHeight: '80vh' }}>
            <h2 className="text-light fw-bold mb-4">
                Dashboard <span style={{ color: 'var(--color-gold)' }}>Principal</span>
            </h2>
            
            {/* Tarjetas de Resumen General */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card bg-dark border-secondary shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="text-secondary">Ventas del Mes</h5>
                            <h2 className="text-success fw-bold">$6.000.000</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-dark border-secondary shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="text-secondary">Órdenes Completadas</h5>
                            <h2 className="text-light fw-bold">124</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-dark border-secondary shadow-sm">
                        <div className="card-body text-center">
                            <h5 className="text-secondary">Nuevos Clientes</h5>
                            <h2 className="text-info fw-bold">18</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Gráficos */}
            <div className="row">
                {/* Gráfico de Barras: Productos Más Vendidos */}
                <div className="col-lg-7 mb-4">
                    <div className="card bg-dark border-secondary h-100 shadow-sm p-3">
                        <h5 className="text-light mb-4">Top 5 Productos Más Vendidos (Unidades)</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={datosProductosMasVendidos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="nombre" stroke="#ccc" tick={{fontSize: 12}} />
                                    <YAxis stroke="#ccc" />
                                    <TooltipBar cursor={{fill: '#333'}} contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }} />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                                    <Bar dataKey="ventas" name="Unidades Vendidas" fill="var(--color-gold, #FFC107)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Torta: Ingresos por Categoría */}
                <div className="col-lg-5 mb-4">
                    <div className="card bg-dark border-secondary h-100 shadow-sm p-3">
                        <h5 className="text-light mb-4">Ingresos por Categoría</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={datosVentasPorCategoria}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60} // Esto lo hace ver como un anillo (Doughnut)
                                        outerRadius={100}
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