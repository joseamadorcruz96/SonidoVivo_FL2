import { useState, useMemo } from 'react';
import { CampoFormulario } from '../../components/CampoFormulario';
import { useForm } from '../../hooks/useForm';

const categoriasIniciales = [
  { id: 1, nombre: 'Guitarras Acústicas', descripcion: 'Guitarras clásicas, electroacústicas y folk.' },
  { id: 2, nombre: 'Guitarras Eléctricas', descripcion: 'Modelos Stratocaster, Les Paul, Telecaster y más.' },
  { id: 3, nombre: 'Bajos Eléctricos', descripcion: 'Bajos de 4 y 5 cuerdas para todo estilo musical.' },
  { id: 4, nombre: 'Baterías', descripcion: 'Baterías acústicas, electrónicas y percusión variada.' },
  { id: 5, nombre: 'Teclados y Pianos', descripcion: 'Sintetizadores, pianos digitales y controladores MIDI.' },
  { id: 6, nombre: 'Amplificadores', descripcion: 'Cabezales, cajas y combos para guitarra y bajo.' },
  { id: 7, nombre: 'Pedales de Efectos', descripcion: 'Distorsiones, delays, reverbs y pedaleras multiefecto.' },
  { id: 8, nombre: 'Accesorios', descripcion: 'Cuerdas, cables, afinadores, correas y fundas.' },
];

export function AdminCategorias() {
  const [categorias, setCategorias] = useState(() => {
    const guardadas = localStorage.getItem('sv_categorias');
    if (guardadas) {
      try {
        return JSON.parse(guardadas);
      } catch (e) {
        console.warn('Error al leer categorías', e);
      }
    }
    localStorage.setItem('sv_categorias', JSON.stringify(categoriasIniciales));
    return categoriasIniciales;
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaActualId, setCategoriaActualId] = useState(null);

  // Hook useForm para gestionar formulario de categoría
  const { datos, setDatos, errores, setErrores, handleChange, resetForm } = useForm({
    nombre: '',
    descripcion: '',
  });

  // Contar productos por categoría desde LocalStorage
  const conteoPorCategoria = useMemo(() => {
    const guardados = localStorage.getItem('sv_productos');
    const productos = guardados ? JSON.parse(guardados) : [];
    const mapa = {};
    categorias.forEach((cat) => {
      mapa[cat.nombre] = productos.filter((p) => p.categoria === cat.nombre).length;
    });
    return mapa;
  }, [categorias]);


  function guardarCategoriasEnStorage(lista) {
    setCategorias(lista);
    localStorage.setItem('sv_categorias', JSON.stringify(lista));
  }

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
  }

  function eliminarCategoria(id, nom) {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${nom}"?`)) {
      const actualizadas = categorias.filter((c) => c.id !== id);
      guardarCategoriasEnStorage(actualizadas);
      if (categoriaActualId === id) {
        limpiarFormulario();
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!datos.nombre.trim()) {
      setErrores({ nombre: 'El nombre de la categoría es obligatorio.' });
      return;
    }

    if (modoEdicion) {
      const actualizadas = categorias.map((c) =>
        c.id === categoriaActualId ? { ...c, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() } : c
      );
      guardarCategoriasEnStorage(actualizadas);
    } else {
      const nueva = {
        id: Date.now(),
        nombre: datos.nombre.trim(),
        descripcion: datos.descripcion.trim(),
      };
      guardarCategoriasEnStorage([...categorias, nueva]);
    }

    limpiarFormulario();
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
                <button type="submit" className="btn btn-hero-gold flex-fill fw-bold">
                  {modoEdicion ? 'Actualizar' : 'Guardar Categoría'}
                </button>
                {modoEdicion && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={limpiarFormulario}
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
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => eliminarCategoria(cat.id, cat.nombre)}
                          title="Eliminar categoría"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
