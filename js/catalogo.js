/**
 * ============================================================================
 * SONIDO VIVO - Catálogo de Productos
 * Archivo: js/catalogo.js
 * Enfoque: Creación con document.createElement(), appendChild() y clases de catalogo.css
 * Asignatura: Desarrollo Full Stack II (DSY1104) - Criterio Semana 4
 * ============================================================================
 * 
 * Este archivo construye dinámicamente la galería de productos a partir de la capa
 * de datos (db.js). Siguiendo las mejores prácticas de separación de responsabilidades:
 *  - La estructura y los nodos DOM se generan de forma segura con createElement / appendChild.
 *  - Los estilos visuales se delegan por completo a clases CSS (css/catalogo.css y Bootstrap 5),
 *    evitando asignar estilos inline manuales en JavaScript.
 *  - Todo el flujo está documentado paso a paso con fines pedagógicos y de evaluación.
 */

// ============================================================================
// 1. FUNCIÓN PRINCIPAL: Renderizado Dinámico de Productos
// ============================================================================
function renderizarCatalogo() {
  // PASO 1: Obtener la referencia al contenedor de la galería por su ID único
  const galeria = document.getElementById("galeria_productos");

  // Cláusula de guarda: si el contenedor no existe en el DOM, detenemos la ejecución
  if (!galeria) {
    console.warn("Aviso: No se encontró el contenedor #galeria_productos en el DOM.");
    return;
  }

  // PASO 2: Limpiar el contenedor antes de renderizar
  // Permite que la vista refleje altas o bajas de productos sin duplicar elementos
  galeria.innerHTML = "";

  // PASO 3: Validar que el servicio de base de datos local (db.js) esté disponible
  if (!window.DB || !window.DB.productos) {
    // Generar mensaje de carga usando nodos nativos y clases CSS dedicadas
    const colAviso = document.createElement("div");
    colAviso.className = "col-12 catalogo-aviso-col";

    const parrafoAviso = document.createElement("p");
    parrafoAviso.className = "catalogo-aviso-texto";
    parrafoAviso.textContent = "Cargando base de datos de productos...";

    colAviso.appendChild(parrafoAviso);
    galeria.appendChild(colAviso);
    return;
  }

  // PASO 4: Obtener la colección de productos desde LocalStorage mediante db.js
  const productos = DB.productos.obtenerTodos();

  // Si no hay productos en la base de datos, mostrar mensaje informativo con clases CSS
  if (productos.length === 0) {
    const colVacio = document.createElement("div");
    colVacio.className = "col-12 catalogo-aviso-col";

    const parrafoVacio = document.createElement("p");
    parrafoVacio.className = "catalogo-aviso-texto";
    parrafoVacio.textContent = "No hay productos disponibles en el catálogo en este momento.";

    colVacio.appendChild(parrafoVacio);
    galeria.appendChild(colVacio);
    return;
  }

  // PASO 5: Iterar sobre cada producto y construir sus nodos DOM con clases CSS
  productos.forEach(function (producto) {

    // ------------------------------------------------------------------------
    // 5.1. Contenedor de Columna Responsiva (Bootstrap 5)
    // ------------------------------------------------------------------------
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    // ------------------------------------------------------------------------
    // 5.2. Tarjeta del Producto
    // Asigna la clase semántica '.card-producto' definida en css/catalogo.css
    // ------------------------------------------------------------------------
    const card = document.createElement("div");
    card.className = "card card-producto";

    // ------------------------------------------------------------------------
    // 5.3. Imagen del Producto
    // Clase '.card-producto-img' de catalogo.css controla dimensiones y object-fit
    // ------------------------------------------------------------------------
    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
    imagen.className = "card-img-top card-producto-img";
    card.appendChild(imagen);

    // ------------------------------------------------------------------------
    // 5.4. Cuerpo de la Tarjeta (.card-producto-body)
    // ------------------------------------------------------------------------
    const cardBody = document.createElement("div");
    cardBody.className = "card-body card-producto-body";

    // ------------------------------------------------------------------------
    // 5.5. Bloque Superior: Categoría, Título, Marca/Modelo y Descripción
    // ------------------------------------------------------------------------
    const bloqueSuperior = document.createElement("div");

    // Categoría musical (.badge-hero-pill y .card-producto-categoria)
    const badgeCategoria = document.createElement("span");
    badgeCategoria.className = "badge-hero-pill card-producto-categoria";
    badgeCategoria.textContent = producto.categoria;
    bloqueSuperior.appendChild(badgeCategoria);

    // Nombre / Título del instrumento (.card-producto-titulo)
    const titulo = document.createElement("h5");
    titulo.className = "card-title card-producto-titulo";
    titulo.textContent = producto.nombre;
    bloqueSuperior.appendChild(titulo);

    // Marca y Modelo (.card-producto-subtitulo)
    const marcaModelo = document.createElement("p");
    marcaModelo.className = "card-producto-subtitulo";
    marcaModelo.textContent = producto.marca + " · " + producto.modelo;
    bloqueSuperior.appendChild(marcaModelo);

    // Descripción con truncado a 2 líneas (.card-producto-desc)
    const descripcion = document.createElement("p");
    descripcion.className = "card-producto-desc";
    descripcion.textContent = producto.descripcion;
    bloqueSuperior.appendChild(descripcion);

    // Adjuntar bloque superior al cuerpo de la tarjeta
    cardBody.appendChild(bloqueSuperior);

    // ------------------------------------------------------------------------
    // 5.6. Bloque Inferior: Precios, Semáforo de Stock y Botón de Compra
    // Clase '.card-producto-footer' de catalogo.css gestiona la separación y el borde
    // ------------------------------------------------------------------------
    const bloqueInferior = document.createElement("div");
    bloqueInferior.className = "card-producto-footer";

    // Fila flex para precio y stock (.card-producto-precio-row)
    const filaPrecioStock = document.createElement("div");
    filaPrecioStock.className = "card-producto-precio-row";

    // Formato de Precio en Moneda Nacional (.card-producto-precio)
    const precio = document.createElement("span");
    precio.className = "card-producto-precio";
    precio.textContent = DB.utilidades ? DB.utilidades.formatearCLP(producto.precio) : "$ " + producto.precio;
    filaPrecioStock.appendChild(precio);

    // Indicador visual de stock (Badge Bootstrap con color contextual)
    const badgeStock = document.createElement("span");
    if (producto.stock <= 0) {
      badgeStock.className = "badge bg-danger";
      badgeStock.textContent = "Agotado";
    } else if (producto.stock <= (producto.stockCritico || 2)) {
      badgeStock.className = "badge bg-warning text-dark";
      badgeStock.textContent = "Últimas " + producto.stock + " un.";
    } else {
      badgeStock.className = "badge bg-success";
      badgeStock.textContent = "Stock: " + producto.stock;
    }
    filaPrecioStock.appendChild(badgeStock);
    bloqueInferior.appendChild(filaPrecioStock);

    // Botón de Acción "Añadir al Carrito" (.btn-hero-gold)
    const botonAgregar = document.createElement("button");
    botonAgregar.type = "button";
    botonAgregar.className = "btn btn-hero-gold w-100 btn-agregar-carrito";
    botonAgregar.dataset.codigo = producto.codigo; // Identificador SKU para el manejador de eventos

    if (producto.stock <= 0) {
      botonAgregar.disabled = true;
      botonAgregar.textContent = "Agotado";
    } else {
      botonAgregar.textContent = "Añadir al Carrito";
    }
    bloqueInferior.appendChild(botonAgregar);

    // Adjuntar bloque inferior al cuerpo de la tarjeta
    cardBody.appendChild(bloqueInferior);

    // ------------------------------------------------------------------------
    // 5.7. Ensamble de la Jerarquía de Nodos mediante appendChild()
    // cardBody -> card -> col -> galeria
    // ------------------------------------------------------------------------
    card.appendChild(cardBody);
    col.appendChild(card);
    galeria.appendChild(col);
  });
}

// ============================================================================
// 2. FUNCIÓN AUXILIAR: Sincronización del Contador del Carrito en el Header
// ============================================================================
function sincronizarContadorBadge() {
  const contador = document.getElementById("contador-carrito");
  if (contador && window.DB && DB.carrito) {
    contador.textContent = DB.carrito.obtenerCantidadTotal();
  }
}

// ============================================================================
// 3. GESTIÓN DE EVENTOS: Delegación para Adición de Productos al Carrito
// ============================================================================
function inicializarEventosCatalogo() {
  const galeria = document.getElementById("galeria_productos");
  if (!galeria) return;

  // Escuchador de clics en la galería filtrando por la clase del botón
  galeria.addEventListener("click", function (evento) {
    const boton = evento.target.closest(".btn-agregar-carrito");
    if (!boton || boton.disabled) return;

    // Obtener código SKU desde el dataset
    const codigo = boton.dataset.codigo;
    if (!codigo || !window.DB) return;

    // Buscar producto por código en la base de datos local
    const producto = DB.productos.obtenerPorCodigo(codigo);
    if (producto) {
      // 1. Agregar producto al carrito en LocalStorage
      DB.carrito.agregar(producto, 1);

      // 2. Actualizar el contador visual del header
      sincronizarContadorBadge();

      // 3. Feedback visual interactivo en el botón (Semana 4)
      const textoOriginal = boton.textContent;
      boton.textContent = "¡Agregado! ✓";
      boton.classList.add("btn-bienvenida-mostrada");

      setTimeout(function () {
        boton.textContent = textoOriginal;
        boton.classList.remove("btn-bienvenida-mostrada");
      }, 900);
    }
  });
}

// ============================================================================
// 4. EXPOSICIÓN GLOBAL PARA REACTIVIDAD
// Permite que otras vistas o scripts refresquen el catálogo: window.renderizarCatalogo()
// ============================================================================
window.renderizarCatalogo = renderizarCatalogo;

// ============================================================================
// 5. EJECUCIÓN AUTOMÁTICA AL CARGAR EL DOM
// ============================================================================
document.addEventListener("DOMContentLoaded", function () {
  renderizarCatalogo();
  sincronizarContadorBadge();
  inicializarEventosCatalogo();
});