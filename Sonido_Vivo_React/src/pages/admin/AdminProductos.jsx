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
        
        // Validación de producto según pauta
        const nuevosErrores = {};
        const cod = datos.codigo.trim();
        if (!cod) {
            nuevosErrores.codigo = "El código es obligatorio";
        } else if (cod.length < 3) {
            nuevosErrores.codigo = "El código debe tener al menos 3 caracteres";
        } else if (productos.some(p => p.codigo.toUpperCase() === cod.toUpperCase())) {
            nuevosErrores.codigo = "Ya existe un producto con este código";
        }

        const nom = datos.nombre.trim();
        if (!nom) {
            nuevosErrores.nombre = "El nombre es obligatorio";
        } else if (nom.length > 100) {
            nuevosErrores.nombre = "El nombre no puede superar los 100 caracteres";
        }

        if (datos.descripcion && datos.descripcion.length > 500) {
            nuevosErrores.descripcion = "La descripción no puede superar los 500 caracteres";
        }

        if (!datos.categoria) nuevosErrores.categoria = "Selecciona una categoría";
        if (datos.precio === '' || Number(datos.precio) < 0 || isNaN(Number(datos.precio))) {
            nuevosErrores.precio = "El precio debe ser 0 o superior (0 = FREE)";
        }
        if (datos.stock === '' || Number(datos.stock) < 0) {
            nuevosErrores.stock = "El stock no puede ser negativo";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        // Formatear datos
        const nuevoProducto = {
            ...datos,
            codigo: cod.toUpperCase(),
            precio: Number(datos.precio),
            stock: Math.floor(Number(datos.stock)),
            stockCritico: Number(datos.stockCritico) || 2,
            imagen: datos.imagen.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
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
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <h2 className="fw-bold mb-0" style={{ color: 'var(--color-gold)' }}>Catálogo y Productos</h2>
                <button className="btn btn-warning fw-bold text-dark" onClick={abrirModal}>
                    + Nuevo Producto
                </button>
            </div>

            {/* Vista Móvil: Tarjetas individuales dentro de márgenes sin scroll horizontal */}
            <div className="d-block d-md-none">
                <div className="d-flex flex-column gap-3">
                    {productos.map((prod) => (
                        <div key={prod.codigo} className="bg-dark rounded p-3 border border-secondary border-opacity-50 shadow-sm">
                            <div className="d-flex align-items-start gap-3">
                                <img 
                                    src={prod.imagen} 
                                    alt={prod.nombre} 
                                    style={{ width: '56px', height: '56px', objectFit: 'cover' }} 
                                    className="rounded flex-shrink-0"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                                    }}
                                />
                                <div className="flex-grow-1 min-w-0">
                                    <div className="d-flex align-items-center justify-content-between gap-1 mb-1">
                                        <span className="badge bg-secondary" style={{ fontSize: '0.7rem' }}>{prod.codigo}</span>
                                        <span className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '0.7rem' }}>
                                            {prod.categoria}
                                        </span>
                                    </div>
                                    <strong className="d-block text-light text-truncate" title={prod.nombre}>{prod.nombre}</strong>
                                    <small className="text-secondary d-block">{prod.marca} · {prod.modelo}</small>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top border-secondary border-opacity-25">
                                <div>
                                    <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>Precio:</small>
                                    <span className="text-warning fw-bold fs-6">${Number(prod.precio).toLocaleString('es-CL')}</span>
                                </div>
                                <div>
                                    <small className="text-secondary d-block text-end mb-1" style={{ fontSize: '0.75rem' }}>Stock:</small>
                                    <BadgeStock stock={prod.stock} stockCritico={prod.stockCritico} />
                                </div>
                            </div>

                            <div className="mt-3">
                                <button 
                                    className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => eliminarProducto(prod.codigo)}
                                >
                                    <span>🗑️</span> Eliminar Producto
                                </button>
                            </div>
                        </div>
                    ))}
                    {productos.length === 0 && (
                        <p className="text-center mt-3 text-secondary">No hay productos registrados en el catálogo.</p>
                    )}
                </div>
            </div>

            {/* Vista Escritorio: Tabla completa */}
            <div className="d-none d-md-block table-responsive bg-dark rounded shadow-sm p-3">
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
                            
                            <div className="modal-body p-3 p-md-4">
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
                                            <CampoFormulario label="URL de la Imagen (Opcional)" error={errores.imagen}>
                                                <input name="imagen" className="form-control" value={datos.imagen} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg (opcional)" />
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