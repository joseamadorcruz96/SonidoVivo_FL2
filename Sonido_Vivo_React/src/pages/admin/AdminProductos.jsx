import { useState, useEffect } from 'react';
import { productosIniciales } from '../../data/productosIniciales';
import { useForm } from '../../hooks/useForm';
import { CampoFormulario } from '../../components/CampoFormulario';
import { BadgeStock } from '../../components/BadgeStock';

const valoresInicialesForm = {
    codigo: '',
    nombre: '',
    categoria: '',
    marca: '',
    modelo: '',
    precio: '',
    stock: '',
    stockCritico: '',
    imagen: '',
    descripcion: '',
    destacado: false
};

const categoriasDisponibles = [
    "Guitarras Acústicas", "Guitarras Eléctricas", "Bajos Eléctricos", 
    "Baterías", "Teclados y Pianos", "Amplificadores", "Pedales de Efectos", "Accesorios"
];

export function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Integramos el hook useForm
    const { datos, setDatos, errores, setErrores, handleChange, resetForm } = useForm(valoresInicialesForm);

    // 1. Cargar productos desde LocalStorage al iniciar
    useEffect(() => {
        const guardados = localStorage.getItem('sv_productos');
        if (guardados) {
            setProductos(JSON.parse(guardados));
        } else {
            localStorage.setItem('sv_productos', JSON.stringify(productosIniciales));
            setProductos(productosIniciales);
        }
    }, []);

    // 2. Eliminar producto
    const eliminarProducto = (codigo) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto del catálogo?")) {
            const nuevaLista = productos.filter(p => p.codigo !== codigo);
            setProductos(nuevaLista);
            localStorage.setItem('sv_productos', JSON.stringify(nuevaLista));
        }
    };

    // 3. Manejar el envío del formulario (Crear Producto)
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validación básica
        const nuevosErrores = {};
        if (!datos.codigo.trim()) nuevosErrores.codigo = "El código es obligatorio";
        if (productos.some(p => p.codigo.toUpperCase() === datos.codigo.trim().toUpperCase())) {
            nuevosErrores.codigo = "Ya existe un producto con este código";
        }
        if (!datos.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
        if (!datos.categoria) nuevosErrores.categoria = "Selecciona una categoría";
        if (Number(datos.precio) <= 0) nuevosErrores.precio = "El precio debe ser mayor a 0";
        if (Number(datos.stock) < 0) nuevosErrores.stock = "El stock no puede ser negativo";
        if (!datos.imagen.trim()) nuevosErrores.imagen = "Ingresa la URL de la imagen";

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        // Formatear datos
        const nuevoProducto = {
            ...datos,
            codigo: datos.codigo.trim().toUpperCase(),
            precio: Number(datos.precio),
            stock: Number(datos.stock),
            stockCritico: Number(datos.stockCritico) || 2,
        };

        // Actualizar estado y LocalStorage
        const nuevaLista = [...productos, nuevoProducto];
        setProductos(nuevaLista);
        localStorage.setItem('sv_productos', JSON.stringify(nuevaLista));
        
        // Cerrar modal y limpiar formulario
        cerrarModal();
    };

    const abrirModal = () => setMostrarModal(true);
    
    const cerrarModal = () => {
        setMostrarModal(false);
        resetForm();
    };

    return (
        <div className="container-fluid text-light py-2 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: 'var(--color-gold)' }}>Catálogo y Productos</h2>
                <button className="btn btn-warning fw-bold text-dark" onClick={abrirModal}>
                    + Nuevo Producto
                </button>
            </div>

            {/* Tabla de Productos */}
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
                                    <BadgeStock stock={prod.stock} stockCritico={prod.stockCritico} />
                                </td>
                                <td className="text-center">
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

            {/* Modal de Nuevo Producto */}
            {mostrarModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content bg-dark text-light border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-gold fw-bold">Agregar Nuevo Producto</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={cerrarModal}></button>
                            </div>
                            
                            <div className="modal-body p-4">
                                <form id="form-producto" onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <CampoFormulario label="Código SKU" error={errores.codigo} obligatorio>
                                                <input name="codigo" className="form-control" value={datos.codigo} onChange={handleChange} placeholder="Ej: GE003" />
                                            </CampoFormulario>
                                        </div>
                                        <div className="col-md-8">
                                            <CampoFormulario label="Nombre del Instrumento" error={errores.nombre} obligatorio>
                                                <input name="nombre" className="form-control" value={datos.nombre} onChange={handleChange} placeholder="Ej: Guitarra Eléctrica Telecaster" />
                                            </CampoFormulario>
                                        </div>

                                        <div className="col-md-4">
                                            <CampoFormulario label="Categoría" error={errores.categoria} obligatorio>
                                                <select name="categoria" className="form-select" value={datos.categoria} onChange={handleChange}>
                                                    <option value="">Selecciona...</option>
                                                    {categoriasDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </CampoFormulario>
                                        </div>
                                        <div className="col-md-4">
                                            <CampoFormulario label="Marca">
                                                <input name="marca" className="form-control" value={datos.marca} onChange={handleChange} placeholder="Ej: Fender" />
                                            </CampoFormulario>
                                        </div>
                                        <div className="col-md-4">
                                            <CampoFormulario label="Modelo">
                                                <input name="modelo" className="form-control" value={datos.modelo} onChange={handleChange} placeholder="Ej: Player Series" />
                                            </CampoFormulario>
                                        </div>

                                        <div className="col-md-4">
                                            <CampoFormulario label="Precio (CLP)" error={errores.precio} obligatorio>
                                                <input name="precio" type="number" className="form-control" value={datos.precio} onChange={handleChange} placeholder="0" min="0" />
                                            </CampoFormulario>
                                        </div>
                                        <div className="col-md-4">
                                            <CampoFormulario label="Stock Inicial" error={errores.stock} obligatorio>
                                                <input name="stock" type="number" className="form-control" value={datos.stock} onChange={handleChange} placeholder="0" min="0" />
                                            </CampoFormulario>
                                        </div>
                                        <div className="col-md-4">
                                            <CampoFormulario label="Stock Crítico">
                                                <input name="stockCritico" type="number" className="form-control" value={datos.stockCritico} onChange={handleChange} placeholder="2" min="0" />
                                            </CampoFormulario>
                                        </div>

                                        <div className="col-12">
                                            <CampoFormulario label="URL de la Imagen" error={errores.imagen} obligatorio>
                                                <input name="imagen" className="form-control" value={datos.imagen} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" />
                                            </CampoFormulario>
                                        </div>

                                        <div className="col-12">
                                            <CampoFormulario label="Descripción Breve">
                                                <textarea name="descripcion" rows="2" className="form-control" value={datos.descripcion} onChange={handleChange} placeholder="Características principales del producto..." />
                                            </CampoFormulario>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-check">
                                                <input name="destacado" type="checkbox" className="form-check-input" id="checkDestacado" checked={datos.destacado} onChange={handleChange} />
                                                <label className="form-check-label text-warning" htmlFor="checkDestacado">
                                                    ⭐ Marcar como producto destacado
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-outline-light" onClick={cerrarModal}>
                                    Cancelar
                                </button>
                                <button type="submit" form="form-producto" className="btn btn-warning fw-bold text-dark">
                                    Guardar Producto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}