import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export function VendedorDashboard() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [vista, setVista] = useState('alertas'); // 'alertas' o 'todos'
    const { usuario, cerrarSesion: logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const guardados = localStorage.getItem('sv_productos');
        if (guardados) {
            setProductos(JSON.parse(guardados));
        }
    }, []);

    const cerrarSesion = () => {
        logout();
        navigate('/login');
    };

    const ajustarStock = (codigo, cantidadCambio) => {
        const nuevosProductos = productos.map(p => {
            if (p.codigo === codigo) {
                const nuevoStock = Math.max(0, Number(p.stock) + cantidadCambio);
                return { ...p, stock: nuevoStock };
            }
            return p;
        });
        
        setProductos(nuevosProductos);
        localStorage.setItem('sv_productos', JSON.stringify(nuevosProductos));
    };

    // Estadísticas
    const stockTotal = productos.reduce((acc, p) => acc + Number(p.stock), 0);
    const productosBajoStock = productos.filter(p => Number(p.stock) <= Number(p.stockCritico));
    const productosAgotados = productos.filter(p => Number(p.stock) === 0);

    // --- LÓGICA DE VISTA Y BÚSQUEDA ---
    const termino = busqueda.toLowerCase().trim();
    
    let productosMostrados = [];
    if (termino) {
        // Si hay texto, buscamos en todo el catálogo
        productosMostrados = productos.filter(p => 
            p.nombre.toLowerCase().includes(termino) || 
            p.codigo.toLowerCase().includes(termino) ||
            p.categoria.toLowerCase().includes(termino)
        );
    } else {
        // Si no hay texto, respetamos el filtro seleccionado
        productosMostrados = vista === 'alertas' ? productosBajoStock : productos;
    }

    // Título dinámico de la tabla
    const tituloTabla = termino 
        ? '🔍 Resultados de Búsqueda' 
        : (vista === 'alertas' ? '⚠️ Alertas de Reposición (Stock Crítico)' : '📦 Catálogo Completo');

    return (
        <div className="container-fluid text-light py-4 px-4" style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary">
                <div>
                    <h2 className="fw-bold mb-0" style={{ color: 'var(--color-gold)' }}>Panel de Vendedor</h2>
                    <p className="text-secondary mt-1 mb-0">Gestión de inventario y alertas de tienda</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="text-end d-none d-md-block">
                        <strong className="d-block">{usuario?.nombre} {usuario?.apellidos}</strong>
                        <span className="badge bg-warning text-dark">Vendedor</span>
                    </div>
                    <button className="btn btn-outline-danger" onClick={cerrarSesion}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card bg-dark border-secondary h-100">
                        <div className="card-body text-center">
                            <h5 className="text-secondary mb-3">Total en Inventario</h5>
                            <h2 className="fw-bold text-info display-5">{stockTotal}</h2>
                            <small className="text-muted">Unidades disponibles</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-dark border-warning h-100" style={{ boxShadow: productosBajoStock.length > 0 ? '0 0 15px rgba(217, 119, 6, 0.2)' : 'none' }}>
                        <div className="card-body text-center">
                            <h5 className="text-warning mb-3">Stock Crítico</h5>
                            <h2 className="fw-bold text-warning display-5">{productosBajoStock.length}</h2>
                            <small className="text-muted">Productos por reponer</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-dark border-danger h-100" style={{ boxShadow: productosAgotados.length > 0 ? '0 0 15px rgba(220, 38, 38, 0.2)' : 'none' }}>
                        <div className="card-body text-center">
                            <h5 className="text-danger mb-3">Agotados</h5>
                            <h2 className="fw-bold text-danger display-5">{productosAgotados.length}</h2>
                            <small className="text-muted">Requieren atención inmediata</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTROLES DE BÚSQUEDA Y VISTA --- */}
            <div className="row g-3 mb-4">
                <div className="col-md-8">
                    <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary p-3 h-100"
                        placeholder="🔍 Buscar en todo el inventario..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{ fontSize: '1.05rem' }}
                    />
                </div>
                <div className="col-md-4">
                    <div className="btn-group w-100 h-100" role="group">
                        <button 
                            type="button" 
                            className={`btn ${vista === 'alertas' ? 'btn-warning fw-bold text-dark' : 'btn-outline-secondary text-light'}`}
                            onClick={() => { setVista('alertas'); setBusqueda(''); }}
                        >
                            ⚠️ Alertas
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${vista === 'todos' ? 'btn-info fw-bold text-dark' : 'btn-outline-secondary text-light'}`}
                            onClick={() => { setVista('todos'); setBusqueda(''); }}
                        >
                            📦 Todo el Inventario
                        </button>
                    </div>
                </div>
            </div>

            <div className={`card bg-dark ${termino ? 'border-info' : (vista === 'alertas' ? 'border-warning' : 'border-secondary')}`}>
                <div className="card-header border-secondary bg-transparent py-3">
                    <h5 className={`mb-0 ${termino ? 'text-info' : (vista === 'alertas' ? 'text-warning' : 'text-light')}`}>
                        {tituloTabla}
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle mb-0">
                            <thead className="table-active">
                                <tr>
                                    <th className="ps-4">Código</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th className="text-center">Stock Actual</th>
                                    <th className="text-center">Límite Crítico</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosMostrados.length > 0 ? (
                                    productosMostrados.map((prod) => {
                                        let colorBadge = 'bg-success';
                                        if (Number(prod.stock) === 0) colorBadge = 'bg-danger';
                                        else if (Number(prod.stock) <= Number(prod.stockCritico)) colorBadge = 'bg-warning text-dark';

                                        return (
                                            <tr key={prod.codigo}>
                                                <td className="ps-4"><small className="text-secondary">{prod.codigo}</small></td>
                                                <td>
                                                    <strong className="d-block">{prod.nombre}</strong>
                                                </td>
                                                <td><span className="badge bg-secondary">{prod.categoria}</span></td>
                                                <td className="text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <button 
                                                            className="btn btn-sm btn-outline-secondary" 
                                                            onClick={() => ajustarStock(prod.codigo, -1)}
                                                            disabled={prod.stock <= 0}
                                                        >
                                                            -
                                                        </button>
                                                        <span className={`badge fs-6 ${colorBadge}`} style={{ width: '45px' }}>
                                                            {prod.stock}
                                                        </span>
                                                        <button 
                                                            className="btn btn-sm btn-outline-secondary" 
                                                            onClick={() => ajustarStock(prod.codigo, 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="text-center text-secondary">{prod.stockCritico}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-success">
                                            {termino 
                                                ? 'No se encontraron productos con esa búsqueda.' 
                                                : (vista === 'alertas' ? '¡Todo el inventario está en niveles óptimos!' : 'El catálogo está vacío.')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}