import { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { CampoFormulario } from '../../components/CampoFormulario';
import { BadgeStock } from '../../components/BadgeStock';
import {
    listarProductos,
    crearProducto,
    eliminarProductoApi,
} from '../../services/productoService';
import { listarCategorias } from '../../services/categoriaService';
import { extraerMensajeError } from '../../services/authService';

const valoresInicialesForm = {
    codigo: '',
    nombre: '',
    categoriaId: '',
    marca: '',
    modelo: '',
    precio: '',
    stock: '',
    stockCritico: '',
    imagen: '',
    descripcion: '',
    destacado: false
};

export function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [errorServidor, setErrorServidor] = useState('');

    const [mostrarModal, setMostrarModal] = useState(false);
    const [soloCriticos, setSoloCriticos] = useState(false);

    // Integramos el hook useForm
    const { datos, errores, setErrores, handleChange, resetForm } = useForm(valoresInicialesForm);

    // Carga productos y categorias reales desde ms-catalogo-inventario
    useEffect(() => {
        let activo = true;
        Promise.allSettled([listarProductos(), listarCategorias()]).then(([resProd, resCat]) => {
            if (!activo) return;
            if (resProd.status === 'fulfilled') {
                setProductos(resProd.value);
                setErrorServidor('');
            } else {
                setProductos([]);
                setErrorServidor('No se pudo cargar el catalogo desde el servidor de inventario.');
            }
            setCategorias(resCat.status === 'fulfilled' ? resCat.value : []);
            setCargando(false);
        });

        return () => {
            activo = false;
        };
    }, []);

    // Elimina producto via backend
    const eliminarProducto = async (codigo) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del catálogo?')) return;
        setProcesando(true);
        setErrorServidor('');
        try {
            await eliminarProductoApi(codigo);
            setProductos((prev) => prev.filter((p) => p.codigo !== codigo));
        } catch (err) {
            setErrorServidor(extraerMensajeError(err, 'No se pudo eliminar el producto.'));
        } finally {
            setProcesando(false);
        }
    };

    // Envio del formulario para crear producto real en ms-catalogo-inventario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevosErrores = {};
        const cod = datos.codigo.trim();
        if (!cod) {
            nuevosErrores.codigo = 'El código es obligatorio';
        } else if (cod.length < 3) {
            nuevosErrores.codigo = 'El código debe tener al menos 3 caracteres';
        } else if (productos.some((p) => p.codigo.toUpperCase() === cod.toUpperCase())) {
            nuevosErrores.codigo = 'Ya existe un producto con este código';
        }

        const nom = datos.nombre.trim();
        if (!nom) {
            nuevosErrores.nombre = 'El nombre es obligatorio';
        } else if (nom.length > 100) {
            nuevosErrores.nombre = 'El nombre no puede superar los 100 caracteres';
        }

        if (!datos.marca.trim()) {
            nuevosErrores.marca = 'La marca es obligatoria';
        } else if (datos.marca.trim().length > 60) {
            nuevosErrores.marca = 'La marca no puede superar los 60 caracteres';
        }

        if (datos.descripcion && datos.descripcion.length > 500) {
            nuevosErrores.descripcion = 'La descripción no puede superar los 500 caracteres';
        }

        if (!datos.categoriaId) nuevosErrores.categoriaId = 'Selecciona una categoría';
        if (datos.precio === '' || Number(datos.precio) < 0 || Number.isNaN(Number(datos.precio))) {
            nuevosErrores.precio = 'El precio debe ser 0 o superior (0 = FREE)';
        }
        if (datos.stock === '' || Number(datos.stock) < 0 || Number.isNaN(Number(datos.stock))) {
            nuevosErrores.stock = 'El stock no puede ser negativo';
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setProcesando(true);
        setErrorServidor('');
        try {
            const creado = await crearProducto({
                codigo: cod.toUpperCase(),
                nombre: nom,
                marca: datos.marca.trim(),
                modelo: datos.modelo.trim(),
                precio: Number(datos.precio),
                stock: Math.floor(Number(datos.stock)),
                stockCritico: datos.stockCritico !== '' ? Math.floor(Number(datos.stockCritico)) : 2,
                descripcion: datos.descripcion.trim(),
                imagen: datos.imagen.trim(),
                destacado: Boolean(datos.destacado),
                categoriaId: Number(datos.categoriaId),
            });
            setProductos((prev) => [...prev, creado]);
            cerrarModal();
        } catch (err) {
            setErrorServidor(extraerMensajeError(err, 'No se pudo registrar el producto.'));
        } finally {
            setProcesando(false);
        }
    };

    const abrirModal = () => setMostrarModal(true);
    
    const cerrarModal = () => {
        setMostrarModal(false);
        resetForm();
    };

    // Filtro para listado de productos críticos (Requerimiento Figura 10)
    const productosVisibles = soloCriticos
        ? productos.filter(p => Number(p.stock) <= Number(p.stockCritico || 2))
        : productos;

    return (
        <div className="container-fluid text-light py-2 position-relative">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-0" style={{ color: 'var(--color-gold)' }}>Catálogo y Productos</h2>
                    {soloCriticos && (
                        <span className="badge bg-danger mt-1">⚠️ Mostrando solo productos con stock crítico</span>
                    )}
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button
                        type="button"
                        className={`btn ${soloCriticos ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => setSoloCriticos(prev => !prev)}
                    >
                        ⚠️ {soloCriticos ? 'Ver Todos los Productos' : 'Listado Productos Críticos'}
                    </button>
                    <button type="button" className="btn btn-warning fw-bold text-dark" onClick={abrirModal}>
                        + Nuevo Producto
                    </button>
                </div>
            </div>

            {errorServidor && (
                <div className="alert alert-danger py-2 small" role="alert">
                    {errorServidor}
                </div>
            )}

            {cargando && (
                <p className="text-secondary small">Cargando productos desde inventario...</p>
            )}

            {/* Vista Móvil: Tarjetas individuales dentro de márgenes sin scroll horizontal */}
            <div className="d-block d-md-none">
                <div className="d-flex flex-column gap-3">
                    {productosVisibles.map((prod) => (

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
                    {productosVisibles.length === 0 && (
                        <p className="text-center mt-3 text-secondary">
                            {soloCriticos ? 'No hay productos con stock crítico.' : 'No hay productos registrados en el catálogo.'}
                        </p>
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
                        {productosVisibles.map((prod) => (

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
                
                {productosVisibles.length === 0 && (
                    <p className="text-center mt-4 text-secondary">
                        {soloCriticos ? 'No hay productos con stock crítico.' : 'No hay productos registrados en el catálogo.'}
                    </p>
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
                                            <CampoFormulario label="Categoría" error={errores.categoriaId} obligatorio>
                                                <select name="categoriaId" className="form-select" value={datos.categoriaId} onChange={handleChange}>
                                                    <option value="">Selecciona...</option>
                                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                                </select>
                                            </CampoFormulario>
                                        </div>
                                        <div className="col-md-4">
                                            <CampoFormulario label="Marca" error={errores.marca} obligatorio>
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
                                <button type="button" className="btn btn-outline-light" onClick={cerrarModal} disabled={procesando}>
                                    Cancelar
                                </button>
                                <button type="submit" form="form-producto" className="btn btn-warning fw-bold text-dark" disabled={procesando}>
                                    {procesando ? 'Guardando...' : 'Guardar Producto'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}