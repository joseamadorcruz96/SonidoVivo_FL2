import { useState, useEffect, useMemo } from 'react';
import { CampoFormulario } from '../../components/CampoFormulario';
import { useForm } from '../../hooks/useForm';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoriaApi,
} from '../../services/categoriaService';
import { listarProductos } from '../../services/productoService';
import { extraerMensajeError } from '../../services/authService';

export function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaActualId, setCategoriaActualId] = useState(null);

  // Hook useForm para gestionar formulario de categoria
  const { datos, setDatos, errores, setErrores, handleChange, resetForm } = useForm({
    nombre: '',
    descripcion: '',
  });

  // Carga categorias y productos reales para contar items por familia
  useEffect(() => {
    let activo = true;
    Promise.allSettled([listarCategorias(), listarProductos()]).then(([resCat, resProd]) => {
      if (!activo) return;
      if (resCat.status === 'fulfilled') {
        setCategorias(resCat.value);
        setErrorServidor('');
      } else {
        setCategorias([]);
        setErrorServidor('No se pudieron cargar las categorias desde el servidor de inventario.');
      }
      setProductos(resProd.status === 'fulfilled' ? resProd.value : []);
      setCargando(false);
    });

    return () => {
      activo = false;
    };
  }, []);

  // Contar productos reales por categoria
  const conteoPorCategoria = useMemo(() => {
    const mapa = {};
    categorias.forEach((cat) => {
      mapa[cat.nombre] = productos.filter((p) => p.categoria === cat.nombre).length;
    });
    return mapa;
  }, [categorias, productos]);

  function limpiarFormulario() {
    setModoEdicion(false);
    setCategoriaActualId(null);
    resetForm();
  }

  function iniciarEdicion(cat) {
    setModoEdicion(true);
    setCategoriaActualId(cat.id);
    setDatos({
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
    });
    setErrores({});
    setErrorServidor('');
  }

  async function eliminarCategoria(id, nom) {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${nom}"?`)) return;
    setProcesando(true);
    setErrorServidor('');
    try {
      await eliminarCategoriaApi(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      if (categoriaActualId === id) {
        limpiarFormulario();
      }
    } catch (err) {
      setErrorServidor(extraerMensajeError(err, 'No se pudo eliminar la categoria.'));
    } finally {
      setProcesando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!datos.nombre.trim()) {
      setErrores({ nombre: 'El nombre de la categoría es obligatorio.' });
      return;
    }

    setProcesando(true);
    setErrorServidor('');
    const payload = {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
    };

    try {
      if (modoEdicion) {
        const actualizada = await actualizarCategoria(categoriaActualId, payload);
        setCategorias((prev) => prev.map((c) => (c.id === categoriaActualId ? actualizada : c)));
      } else {
        const creada = await crearCategoria(payload);
        setCategorias((prev) => [...prev, creada]);
      }
      limpiarFormulario();
    } catch (err) {
      setErrorServidor(extraerMensajeError(err, 'No se pudo guardar la categoria.'));
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div className="container-fluid text-light py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--color-gold)' }}>
            Mantenedor de Categorías
          </h2>
          <p className="text-secondary small m-0">
            Organiza las familias de instrumentos y productos para la tienda virtual.
          </p>
        </div>
      </div>

      {errorServidor && (
        <div className="alert alert-danger py-2 small" role="alert">
          {errorServidor}
        </div>
      )}

      <div className="row g-4">
        {/* Formulario Crear / Editar Categoría */}
        <div className="col-12 col-lg-4">
          <div className="card bg-dark border-secondary p-4 shadow-sm">
            <h3 className="h5 fw-bold text-light mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              {modoEdicion ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
            </h3>

            <form onSubmit={handleSubmit}>
              <CampoFormulario
                id="nombre-categoria"
                label="Nombre de la Categoría"
                obligatorio
                error={errores.nombre}
              >
                <input
                  type="text"
                  id="nombre-categoria"
                  name="nombre"
                  className={`form-control bg-dark text-light border-secondary ${errores.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: Teclados, Percusión..."
                  value={datos.nombre}
                  onChange={handleChange}
                />
              </CampoFormulario>

              <CampoFormulario
                id="desc-categoria"
                label="Descripción (opcional)"
              >
                <textarea
                  id="desc-categoria"
                  name="descripcion"
                  rows="3"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Detalles sobre los instrumentos de esta categoría..."
                  value={datos.descripcion}
                  onChange={handleChange}
                />
              </CampoFormulario>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-hero-gold flex-fill fw-bold" disabled={procesando}>
                  {procesando ? 'Guardando...' : modoEdicion ? 'Actualizar' : 'Guardar Categoría'}
                </button>
                {modoEdicion && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={limpiarFormulario}
                    disabled={procesando}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Tabla de Categorías Existentes */}
        <div className="col-12 col-lg-8">
          <div className="table-responsive bg-dark rounded shadow-sm p-3 border border-secondary border-opacity-25">
            {cargando ? (
              <p className="text-secondary small m-0">Cargando categorías desde inventario...</p>
            ) : (
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small">
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-center">Productos</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <strong className="text-light">{cat.nombre}</strong>
                    </td>
                    <td className="small text-secondary">{cat.descripcion || 'Sin descripción'}</td>
                    <td className="text-center">
                      <span className="badge bg-secondary">
                        {conteoPorCategoria[cat.nombre] || 0} ítems
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          onClick={() => iniciarEdicion(cat)}
                          title="Editar categoría"
                          disabled={procesando}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => eliminarCategoria(cat.id, cat.nombre)}
                          title="Eliminar categoría"
                          disabled={procesando}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary py-3">
                      No hay categorías registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
