import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCarrito } from '../../Context/CarritoContext';
import { BadgeStock } from '../../components/BadgeStock';
import { productosIniciales } from '../../data/productosIniciales';

export function DetalleProducto() {
  const { codigo } = useParams();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensajeExito, setMensajeExito] = useState(false);

  // 1. Cargar el producto desde LocalStorage (o datos iniciales de respaldo)
  useEffect(() => {
    const guardados = localStorage.getItem('sv_productos');
    const lista = guardados ? JSON.parse(guardados) : productosIniciales;
    const encontrado = lista.find(
      (p) => String(p.codigo).toUpperCase() === String(codigo).toUpperCase()
    );

    setProducto(encontrado || null);
    setCantidad(1);
    setMensajeExito(false);
  }, [codigo]);

  // Si el código no existe en el catálogo
  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <span className="display-1 d-block mb-3">🔍</span>
          <h2 className="h3 fw-bold text-light mb-3">Instrumento no encontrado</h2>
          <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '450px' }}>
            No pudimos localizar un producto con el código <code className="text-gold">{codigo}</code>.
            Revisa nuestro catálogo completo.
          </p>
          <Link to="/Catalogo" className="btn btn-hero-gold px-4 py-2 fw-bold">
            &larr; Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const stockDisponible = Number(producto.stock) || 0;
  const estaAgotado = stockDisponible <= 0;
  const precioFormateado = `$${Number(producto.precio || 0).toLocaleString('es-CL')}`;

  function incrementarCantidad() {
    if (cantidad < stockDisponible) {
      setCantidad((prev) => prev + 1);
    }
  }

  function decrementarCantidad() {
    if (cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  }

  function handleAgregar() {
    if (!estaAgotado) {
      agregarAlCarrito(producto, cantidad);
      setMensajeExito(true);

      // Ocultar mensaje tras 3 segundos
      setTimeout(() => setMensajeExito(false), 3000);
    }
  }

  return (
    <div className="container py-5">
      {/* Miga de pan / Navegación rápida */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-secondary text-decoration-none">
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/Catalogo" className="text-secondary text-decoration-none">
              Catálogo
            </Link>
          </li>
          <li className="breadcrumb-item active text-gold" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="row g-5 align-items-center">
        {/* Columna Izquierda: Imagen del Instrumento */}
        <div className="col-12 col-lg-6 text-center">
          <div className="bg-surface p-3 rounded-4 border-subtle shadow-lg">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded-3"
              style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>

        {/* Columna Derecha: Información, Precio y Compra */}
        <div className="col-12 col-lg-6">
          <span className="badge-hero-pill mb-2">{producto.categoria}</span>

          <h1 className="display-6 fw-bold text-light mb-2">{producto.nombre}</h1>

          <p className="text-secondary fs-5 mb-3">
            Marca: <strong className="text-light">{producto.marca}</strong> · Modelo: <strong className="text-light">{producto.modelo}</strong>
          </p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="display-6 fw-bold text-gold">{precioFormateado}</span>
            <BadgeStock stock={producto.stock} stockCritico={producto.stockCritico} />
          </div>

          <div className="border-top-subtle border-bottom-subtle py-3 mb-4">
            <h2 className="h6 text-gold fw-bold text-uppercase mb-2">Descripción Técnica</h2>
            <p className="text-secondary mb-0 leading-relaxed">{producto.descripcion}</p>
          </div>

          {/* Bloque de Compra / Selector de Cantidad */}
          <div className="bg-surface p-4 rounded-3 border-subtle shadow-sm mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-sm-5">
                <label className="form-label text-secondary small mb-1">
                  Cantidad a comprar:
                </label>
                <div className="input-group">
                  <button
                    type="button"
                    className="btn btn-outline-secondary text-light fw-bold px-3"
                    onClick={decrementarCantidad}
                    disabled={cantidad <= 1 || estaAgotado}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control text-center fw-bold bg-dark text-gold border-secondary"
                    value={cantidad}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary text-light fw-bold px-3"
                    onClick={incrementarCantidad}
                    disabled={cantidad >= stockDisponible || estaAgotado}
                  >
                    +
                  </button>
                </div>
                <small className="text-secondary d-block mt-1">
                  Máximo disponible: {stockDisponible} un.
                </small>
              </div>

              <div className="col-12 col-sm-7 pt-sm-4">
                <button
                  type="button"
                  className="btn btn-hero-gold w-100 py-2 fw-bold"
                  disabled={estaAgotado}
                  onClick={handleAgregar}
                >
                  {estaAgotado ? 'Instrumento Agotado' : '🛒 Añadir al Carrito'}
                </button>
              </div>
            </div>

            {/* Alerta de confirmación rápida */}
            {mensajeExito && (
              <div className="alert alert-success mt-3 py-2 text-center small fade show" role="alert">
                ✓ Se añadieron <strong>{cantidad}</strong> {cantidad === 1 ? 'unidad' : 'unidades'} al carrito.{' '}
                <Link to="/Carrito" className="fw-bold text-success text-decoration-underline ms-1">
                  Ir al Carrito &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Enlaces inferiores */}
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/Catalogo" className="btn btn-outline-secondary btn-sm">
              &larr; Volver al Catálogo
            </Link>

            <Link to="/Carrito" className="btn btn-outline-warning btn-sm">
              Ver Mi Carrito 🛍️
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
