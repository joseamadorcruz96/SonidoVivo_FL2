import { useState, useEffect } from 'react';
// Importamos la lista inicial por si el localStorage está vacío (igual que en Catalogo.jsx)
import { productosIniciales } from '../data/productosIniciales';

export function AdminProductos() {
    const [productos, setProductos] = useState([]);

    // 1. Cargar productos desde LocalStorage al iniciar
    useEffect(() => {
        const guardados = localStorage.getItem('sv_productos');
        if (guardados) {
            setProductos(JSON.parse(guardados));
        } else {
            // Si no hay nada, guardamos los iniciales como respaldo
            localStorage.setItem('sv_productos', JSON.stringify(productosIniciales));
            setProductos(productosIniciales);
        }
    }, []);

    // 2. Función para eliminar un producto
    const eliminarProducto = (codigo) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto del catálogo?");
        
        if (confirmar) {
            // Filtramos el arreglo para quitar el producto seleccionado
            const nuevaLista = productos.filter(p => p.codigo !== codigo);
            
            // Actualizamos el estado visual de React
            setProductos(nuevaLista);
            
            // Actualizamos la "base de datos" del navegador para que la tienda pública se entere
            localStorage.setItem('sv_productos', JSON.stringify(nuevaLista));
        }
    };

    return (
        <div className="container-fluid text-light py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: 'var(--color-gold)' }}>Catálogo y Productos</h2>
                <button className="btn btn-warning fw-bold text-dark">
                    + Nuevo Producto
                </button>
            </div>

            <div className="table-responsive bg-dark rounded shadow-sm p-3">
                <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Código</th>
                            <th>Instrumento</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((prod) => (
                            <tr key={prod.codigo}>
                                <td>
                                    <img 
                                        src={prod.imagen} 
                                        alt={prod.nombre} 
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                        className="rounded"
                                    />
                                </td>
                                <td><small className="text-secondary">{prod.codigo}</small></td>
                                <td>
                                    <strong className="d-block">{prod.nombre}</strong>
                                    <small className="text-secondary">{prod.marca} · {prod.modelo}</small>
                                </td>
                                <td><span className="badge bg-secondary">{prod.categoria}</span></td>
                                <td className="text-warning fw-bold">
                                    ${Number(prod.precio).toLocaleString('es-CL')}
                                </td>
                                <td>
                                    <span className={`badge ${prod.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                        {prod.stock > 0 ? prod.stock : 'Agotado'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-outline-info me-2" title="Editar">
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        title="Eliminar"
                                        onClick={() => eliminarProducto(prod.codigo)}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {productos.length === 0 && (
                    <p className="text-center mt-4 text-secondary">No hay productos registrados en el catálogo.</p>
                )}
            </div>
        </div>
    );
}