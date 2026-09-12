/**
 * ============================================================================
 * SONIDO VIVO - Catálogo de Productos
 * Archivo: js/catalogo.js
 * Funcionalidad: Renderizado dinámico de productos desde db.js en productos.html
 * ============================================================================
 */

// 1. Función principal para renderizar los productos en la galería
function renderizarCatalogo() {
  // Llamar al contenedor con document.getElementById según el id en productos.html
  const galeria = document.getElementById("galeria_productos");

  // Validación de existencia del contenedor
  if (!galeria) {
    console.warn("No se encontró el elemento #galeria_productos en el DOM.");
    return;
  }

  // Limpiar el contenedor antes de renderizar para evitar duplicados al agregar o eliminar
  galeria.innerHTML = "";

  // Verificar que la base de datos esté disponible
  if (!window.DB || !window.DB.productos) {
    galeria.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-secondary">Cargando base de datos de productos...</p>
      </div>
    `;
    return;
  }

  // Obtener la lista actualizada de productos desde db.js
  const productos = DB.productos.obtenerTodos();

  // Si no hay productos registrados, mostrar mensaje informativo
  if (productos.length === 0) {
    galeria.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-secondary fs-5">No hay productos disponibles en el catálogo actualmente.</p>
      </div>
    `;
    return;
  }

  // Iterar por cada producto de la base de datos y crear sus elementos en el DOM
  productos.forEach(function (producto) {
    // Crear el div contenedor de la columna responsiva (Bootstrap 5)
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    // Determinar etiqueta visual del stock
    let badgeStock = "";
    if (producto.stock <= 0) {
      badgeStock = '<span class="badge bg-danger">Agotado</span>';
    } else if (producto.stock <= (producto.stockCritico || 2)) {
      badgeStock = '<span class="badge bg-warning text-dark">Últimas ' + producto.stock + ' un.</span>';
    } else {
      badgeStock = '<span class="badge bg-success">Stock: ' + producto.stock + '</span>';
    }

    // Formatear el precio en moneda chilena usando la utilidad de db.js
    const precioFormateado = DB.utilidades ? DB.utilidades.formatearCLP(producto.precio) : "$ " + producto.precio;

    // Estructurar la tarjeta del producto usando los estilos y variables ya existentes del proyecto
    col.innerHTML = `
      <div class="card h-100 shadow-sm" style="background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden;">
        <!-- Imagen del Producto -->
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 190px; object-fit: cover;">
        
        <!-- Cuerpo de la Tarjeta -->
        <div class="card-body d-flex flex-column justify-content-between p-3">
          <div>
            <!-- Categoría -->
            <span class="badge-hero-pill mb-2" style="font-size: 0.72rem; width: fit-content;">${producto.categoria}</span>
            
            <!-- Nombre del Producto -->
            <h5 class="card-title text-light mb-1" style="font-family: var(--font-heading); font-size: 1.05rem;">
              ${producto.nombre}
            </h5>
            
            <!-- Marca y Modelo -->
            <p class="text-secondary small mb-2">${producto.marca} · ${producto.modelo}</p>
            
            <!-- Descripción Breve -->
            <p class="text-secondary small mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">
              ${producto.descripcion}
            </p>
          </div>

          <!-- Precios, Stock y Botón de Compra -->
          <div class="mt-2 pt-2 border-top-subtle">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fs-5 fw-bold text-gold">${precioFormateado}</span>
              ${badgeStock}
            </div>

            <button 
              type="button" 
              class="btn btn-hero-gold w-100 btn-agregar-carrito" 
              data-codigo="${producto.codigo}"
              ${producto.stock <= 0 ? "disabled" : ""}
            >
              ${producto.stock > 0 ? "Añadir al Carrito" : "Agotado"}
            </button>
          </div>
        </div>
      </div>
    `;

    // Agregar la columna con la tarjeta a la galería principal
    galeria.appendChild(col);
  });
}

// 2. Función auxiliar para sincronizar el contador del carrito en el navbar
function sincronizarContadorBadge() {
  const contador = document.getElementById("contador-carrito");
  if (contador && window.DB && DB.carrito) {
    contador.textContent = DB.carrito.obtenerCantidadTotal();
  }
}

// 3. Inicializar eventos interactivos del catálogo
function inicializarEventosCatalogo() {
  const galeria = document.getElementById("galeria_productos");
  if (!galeria) return;

  // Delegación de eventos para los botones de "Añadir al Carrito"
  galeria.addEventListener("click", function (evento) {
    const boton = evento.target.closest(".btn-agregar-carrito");
    if (!boton || boton.disabled) return;

    const codigo = boton.getAttribute("data-codigo");
    if (!codigo || !window.DB) return;

    // Buscar producto por código
    const producto = DB.productos.obtenerPorCodigo(codigo);
    if (producto) {
      // Agregar producto al carrito
      DB.carrito.agregar(producto, 1);

      // Actualizar el badge visual en la barra de navegación
      sincronizarContadorBadge();

      // Feedback visual rápido en el botón
      const textoOriginal = boton.textContent;
      boton.textContent = "¡Agregado! ✓";
      boton.style.backgroundColor = "var(--color-gold-hover)";
      setTimeout(function () {
        boton.textContent = textoOriginal;
        boton.style.backgroundColor = "";
      }, 900);
    }
  });
}

// 4. Exponer la función al ámbito global (window)
// Permite que formularios de creación o eliminación de productos refresquen el catálogo fácilmente: renderizarCatalogo()
window.renderizarCatalogo = renderizarCatalogo;

// 5. Ejecutar automáticamente al cargar el DOM de la página
document.addEventListener("DOMContentLoaded", function () {
  renderizarCatalogo();
  sincronizarContadorBadge();
  inicializarEventosCatalogo();
});