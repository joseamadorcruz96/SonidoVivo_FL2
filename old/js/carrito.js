/**
 * SONIDO VIVO - Servicio de Carrito de Compras
 * Manejo de persistencia con db.js, soporte multiusuario e inyección dinámica.
 */

(function () {
  "use strict";

  // Objeto principal del servicio
  const Carrito = {
    // Obtiene el usuario o cliente con sesión activa
    obtenerUsuario: function () {
      if (window.DB && DB.usuarios && typeof DB.usuarios.obtenerSesion === "function") {
        const sesion = DB.usuarios.obtenerSesion();
        if (sesion) return sesion;
      }
      try {
        return JSON.parse(localStorage.getItem("usuarioActivo") || "null");
      } catch (e) {
        return null;
      }
    },

    // Retorna los productos del carrito actual
    obtener: function () {
      if (window.DB && DB.carrito) {
        return DB.carrito.obtener();
      }
      return JSON.parse(localStorage.getItem("sv_carrito") || "[]");
    },

    // Agrega un producto y actualiza la interfaz
    agregar: function (producto, cantidad) {
      const cant = Number(cantidad) > 0 ? Number(cantidad) : 1;
      let resultado = [];
      if (window.DB && DB.carrito) {
        resultado = DB.carrito.agregar(producto, cant);
      }
      this.actualizarUI();
      this.mostrarNotificacion("¡" + producto.nombre + " agregado al carrito!");
      return resultado;
    },

    // Modifica la cantidad de un producto (+1 o -1)
    cambiarCantidad: function (codigo, delta) {
      const items = this.obtener();
      const item = items.find(function (it) {
        return it.codigo.toUpperCase() === String(codigo).toUpperCase();
      });
      if (!item) return;

      const nuevaCantidad = item.cantidad + delta;
      if (nuevaCantidad <= 0) {
        this.eliminar(codigo);
      } else {
        if (window.DB && DB.carrito) {
          DB.carrito.actualizarCantidad(codigo, nuevaCantidad);
        }
        this.actualizarUI();
      }
    },

    // Elimina un producto por su código
    eliminar: function (codigo) {
      if (window.DB && DB.carrito) {
        DB.carrito.eliminar(codigo);
      }
      this.actualizarUI();
    },

    // Vacía todos los productos del carrito
    vaciar: function () {
      if (confirm("¿Estás seguro de que deseas vaciar tu carrito?")) {
        if (window.DB && DB.carrito) {
          DB.carrito.vaciar();
        }
        this.actualizarUI();
      }
    },

    // Retorna el total en pesos chilenos
    obtenerTotal: function () {
      if (window.DB && DB.carrito) {
        return DB.carrito.obtenerTotal();
      }
      return 0;
    },

    // Retorna la cantidad total de artículos para el badge
    obtenerCantidadTotal: function () {
      if (window.DB && DB.carrito) {
        return DB.carrito.obtenerCantidadTotal();
      }
      return 0;
    },

    // Finaliza la compra generando una orden asociada al usuario
    finalizarCompra: function () {
      const items = this.obtener();
      if (!items || items.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de comprar.");
        return;
      }

      const usuario = this.obtenerUsuario();
      const total = this.obtenerTotal();

      if (window.DB && DB.ordenes) {
        const orden = DB.ordenes.crear({
          clienteNombre: usuario ? (usuario.nombre + (usuario.apellidos ? " " + usuario.apellidos : "")) : "Invitado",
          clienteEmail: usuario ? usuario.email : "invitado@sonidovivo.cl",
          items: items,
          total: total
        });

        alert("¡Felicitaciones! Tu compra #" + orden.id + " fue procesada con éxito por " + (window.DB.utilidades ? DB.utilidades.formatearCLP(total) : "$" + total) + ".");
      } else {
        alert("¡Compra procesada con éxito!");
        this.vaciar();
      }

      this.actualizarUI();

      // Cerrar offcanvas si está abierto
      const elOffcanvas = document.getElementById("offcanvasCarrito");
      if (elOffcanvas && window.bootstrap && bootstrap.Offcanvas) {
        const instancia = bootstrap.Offcanvas.getInstance(elOffcanvas);
        if (instancia) instancia.hide();
      }
    },

    // Actualiza badge y render del drawer o vista dedicada
    actualizarUI: function () {
      this.sincronizarBadge();
      this.renderizarDrawer();
      if (typeof window.renderizarPaginaCarrito === "function") {
        window.renderizarPaginaCarrito();
      }
    },

    // Sincroniza el badge numérico en el header
    sincronizarBadge: function () {
      const contador = document.getElementById("contador-carrito");
      if (contador) {
        const total = this.obtenerCantidadTotal();
        contador.textContent = total;
        contador.classList.add("anim-badge-pulse");
        setTimeout(function () {
          contador.classList.remove("anim-badge-pulse");
        }, 300);
      }
    },

    // Muestra un toast breve y no intrusivo
    mostrarNotificacion: function (mensaje) {
      let toast = document.getElementById("sv-toast-carrito");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "sv-toast-carrito";
        toast.className = "sv-toast-carrito";
        document.body.appendChild(toast);
      }
      toast.textContent = mensaje;
      toast.classList.add("mostrar");
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(function () {
        toast.classList.remove("mostrar");
      }, 2500);
    },

    // Renderiza la lista de productos dentro del Drawer Offcanvas
    renderizarDrawer: function () {
      const contenedor = document.getElementById("carrito-drawer-items");
      const subtotalEl = document.getElementById("carrito-drawer-subtotal");
      const badgeUsuarioEl = document.getElementById("carrito-drawer-usuario");
      if (!contenedor) return;

      const items = this.obtener();
      const usuario = this.obtenerUsuario();

      // Mostrar estado de usuario o cliente
      if (badgeUsuarioEl) {
        if (usuario) {
          badgeUsuarioEl.innerHTML = '<span class="badge bg-gold-subtle text-warning border border-warning">👤 ' + (usuario.nombre || "Cliente") + ' (' + (usuario.rol || "Cliente") + ')</span>';
        } else {
          badgeUsuarioEl.innerHTML = '<span class="badge bg-secondary">👤 Modo Invitado</span>';
        }
      }

      if (items.length === 0) {
        contenedor.innerHTML = `
          <div class="text-center py-5 text-secondary">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛒</div>
            <p class="mb-3">Tu carrito está vacío.</p>
            <a href="productos.html" class="btn btn-sm btn-hero-outline">Explorar Catálogo</a>
          </div>
        `;
        if (subtotalEl) subtotalEl.textContent = "$ 0";
        return;
      }

      let html = '<div class="d-flex flex-column gap-3">';
      items.forEach(function (item) {
        const formatear = window.DB && DB.utilidades ? DB.utilidades.formatearCLP : function (v) { return "$ " + v; };
        html += `
          <div class="card-carrito-drawer d-flex align-items-center gap-3 p-2 rounded">
            <img src="${item.imagen || 'assets/img/logo.svg'}" alt="${item.nombre}" class="carrito-img-mini rounded">
            <div class="flex-grow-1 min-w-0">
              <h6 class="mb-1 text-truncate text-light small fw-bold">${item.nombre}</h6>
              <div class="text-gold small">${formatear(item.precio)}</div>
              <div class="d-flex align-items-center gap-2 mt-2">
                <button type="button" class="btn btn-sm btn-cantidad" onclick="Carrito.cambiarCantidad('${item.codigo}', -1)">−</button>
                <span class="small fw-bold px-1">${item.cantidad}</span>
                <button type="button" class="btn btn-sm btn-cantidad" onclick="Carrito.cambiarCantidad('${item.codigo}', 1)">+</button>
              </div>
            </div>
            <div class="text-end">
              <div class="small fw-bold text-light mb-2">${formatear(item.subtotal || item.precio * item.cantidad)}</div>
              <button type="button" class="btn btn-sm btn-eliminar-item text-danger p-0" title="Eliminar" onclick="Carrito.eliminar('${item.codigo}')">🗑️</button>
            </div>
          </div>
        `;
      });
      html += '</div>';

      contenedor.innerHTML = html;
      if (subtotalEl) {
        const formatear = window.DB && DB.utilidades ? DB.utilidades.formatearCLP : function (v) { return "$ " + v; };
        subtotalEl.textContent = formatear(this.obtenerTotal());
      }
    }
  };

  // Evalúa e inyecta el botón del carrito en el header de cualquier página
  function evaluarInyeccionHeader() {
    let boton = document.getElementById("boton-carrito-nav");

    // Si el botón no existe en el header, inyectarlo dinámicamente
    if (!boton) {
      const contenedorAcciones = document.querySelector(".navbar-collapse .d-flex.align-items-center")
        || document.querySelector(".navbar .container")
        || document.querySelector("header nav");

      if (contenedorAcciones) {
        boton = document.createElement("a");
        boton.href = "carrito.html";
        boton.className = "btn-carrito-nav";
        boton.id = "boton-carrito-nav";
        boton.title = "Ver carrito de compras";
        boton.innerHTML = `
          <span>🛒 Carrito</span>
          <span id="contador-carrito" class="badge-carrito">0</span>
        `;
        contenedorAcciones.prepend(boton);
      }
    }

    // Configurar clic para abrir el Offcanvas sin recargar la página
    if (boton) {
      boton.addEventListener("click", function (e) {
        // Si estamos en carrito.html permitimos navegar normalmente
        const paginaActual = window.location.pathname.split("/").pop();
        if (paginaActual === "carrito.html") return;

        e.preventDefault();
        abrirDrawerCarrito();
      });
    }

    Carrito.sincronizarBadge();
  }

  // Abre el Offcanvas lateral del carrito con Bootstrap 5
  function abrirDrawerCarrito() {
    const el = document.getElementById("offcanvasCarrito");
    if (!el || !window.bootstrap || !bootstrap.Offcanvas) return;
    const instancia = bootstrap.Offcanvas.getOrCreateInstance(el);
    Carrito.renderizarDrawer();
    instancia.show();
  }

  // Inyecta el contenedor HTML del Offcanvas Drawer en el body
  function inyectarDrawerCarrito() {
    if (document.getElementById("offcanvasCarrito")) return;

    const drawer = document.createElement("div");
    drawer.className = "offcanvas offcanvas-end text-bg-dark drawer-carrito-sv";
    drawer.id = "offcanvasCarrito";
    drawer.tabIndex = -1;
    drawer.setAttribute("aria-labelledby", "offcanvasCarritoLabel");

    drawer.innerHTML = `
      <div class="offcanvas-header border-bottom border-secondary">
        <div>
          <h5 class="offcanvas-title text-gold fw-bold" id="offcanvasCarritoLabel">🛒 Tu Carrito</h5>
          <div id="carrito-drawer-usuario" class="mt-1"></div>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
      <div class="offcanvas-body" id="carrito-drawer-items">
        <!-- Ítems inyectados dinámicamente -->
      </div>
      <div class="offcanvas-footer p-3 border-top border-secondary">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-secondary fw-semibold">Total:</span>
          <span class="fs-5 fw-bold text-gold" id="carrito-drawer-subtotal">$ 0</span>
        </div>
        <div class="d-grid gap-2">
          <button type="button" class="btn btn-hero-gold fw-bold py-2" onclick="Carrito.finalizarCompra()">
            Finalizar Compra
          </button>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-danger btn-sm w-50" onclick="Carrito.vaciar()">
              Vaciar
            </button>
            <a href="carrito.html" class="btn btn-hero-outline btn-sm w-50 text-center">
              Ver Completo
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(drawer);
  }

  // Exposición global
  window.Carrito = Carrito;
  window.abrirDrawerCarrito = abrirDrawerCarrito;

  // Inicialización automática cuando el DOM está listo
  document.addEventListener("DOMContentLoaded", function () {
    inyectarDrawerCarrito();
    evaluarInyeccionHeader();
    Carrito.actualizarUI();
  });
})();
