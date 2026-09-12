/**
 * ============================================================================
 * SONIDO VIVO - Capa de Servicio y Controlador del Panel de Vendedor
 * Archivo: js/vendedor_servicio.js
 * Asignatura: Desarrollo Full Stack II (DSY1104)
 * ============================================================================
 */

(function () {
  "use strict";

  // 1. Guardia de Seguridad (Solo roles Vendedor y Administrador)
  function verificarAccesoVendedor() {
    let sesion = null;
    if (window.DB && DB.usuarios && typeof DB.usuarios.obtenerSesion === "function") {
      sesion = DB.usuarios.obtenerSesion();
    }
    if (!sesion) {
      try {
        sesion = JSON.parse(localStorage.getItem("usuarioActivo"));
      } catch (e) {
        sesion = null;
      }
    }

    const rol = sesion ? String(sesion.rol || "").toLowerCase() : "";
    if (!sesion || (rol !== "vendedor" && rol !== "administrador" && rol !== "admin")) {
      alert("Acceso denegado. Debes iniciar sesión como Vendedor o Administrador.");
      window.location.href = "login.html";
      return false;
    }

    document.addEventListener("DOMContentLoaded", function () {
      const nombreEl = document.getElementById("vendedor-nombre");
      if (nombreEl) {
        nombreEl.textContent = sesion.nombre || "Vendedor";
      }
    });

    return true;
  }

  if (!verificarAccesoVendedor()) return;

  // 2. Renderizado de Catálogo de Productos para Vendedor
  function cargarProductosVendedor() {
    const tbody = document.getElementById("tabla-productos-vendedor");
    if (!tbody || !window.DB || !DB.productos) return;

    tbody.innerHTML = "";
    const productos = DB.productos.obtenerTodos();

    if (productos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No hay productos en catálogo.</td></tr>';
      return;
    }

    productos.forEach(function (p) {
      const fila = document.createElement("tr");
      const esCritico = Number(p.stock) <= Number(p.stockCritico || 0);

      const precioFmt = DB.utilidades ? DB.utilidades.formatearCLP(p.precio) : "$" + p.precio;

      fila.innerHTML = `
        <td class="fw-bold text-gold">${p.codigo}</td>
        <td>
          <div class="fw-semibold text-main">${p.nombre}</div>
          <small class="text-muted">${p.marca || ""} ${p.modelo || ""}</small>
        </td>
        <td><span class="badge bg-secondary">${p.categoria}</span></td>
        <td class="fw-bold">${precioFmt}</td>
        <td>
          <span class="badge ${p.stock <= 0 ? "bg-danger" : esCritico ? "bg-warning text-dark" : "bg-success"}">
            ${p.stock} un.
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-light btn-ver-detalle-prod" data-codigo="${p.codigo}">
            👁️ Ficha
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  }

  // 3. Renderizado de Órdenes y Pedidos
  function cargarOrdenesVendedor() {
    const tbody = document.getElementById("tabla-ordenes-vendedor");
    if (!tbody || !window.DB || !DB.ordenes) return;

    tbody.innerHTML = "";
    const ordenes = DB.ordenes.obtenerTodas();

    if (ordenes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Aún no se registran órdenes de compra.</td></tr>';
      return;
    }

    ordenes.forEach(function (ord) {
      const fila = document.createElement("tr");
      const totalFmt = DB.utilidades ? DB.utilidades.formatearCLP(ord.total) : "$" + ord.total;

      fila.innerHTML = `
        <td class="fw-bold text-gold">${ord.id}</td>
        <td>
          <div class="fw-semibold text-main">${ord.clienteNombre || "Cliente"}</div>
          <small class="text-muted">${ord.clienteEmail || ""}</small>
        </td>
        <td><small class="text-muted">${ord.fecha || ""}</small></td>
        <td class="fw-bold text-gold">${totalFmt}</td>
        <td>
          <select class="form-select form-select-sm select-panel select-estado-orden" data-id="${ord.id}">
            <option value="En preparación" ${ord.estado === "En preparación" ? "selected" : ""}>En preparación</option>
            <option value="Despachado" ${ord.estado === "Despachado" ? "selected" : ""}>Despachado</option>
            <option value="Entregado" ${ord.estado === "Entregado" ? "selected" : ""}>Entregado</option>
          </select>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-info btn-ver-detalle-orden" data-id="${ord.id}">
            📦 Ítems
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  }

  // 4. Modales de Detalle
  function verDetalleProducto(codigo) {
    const p = DB.productos.obtenerPorCodigo(codigo);
    if (!p) return;

    document.getElementById("modalProdNombre").textContent = `${p.nombre} (${p.codigo})`;
    document.getElementById("modalProdImg").src = p.imagen || "assets/img/logo.svg";
    document.getElementById("modalProdCategoria").textContent = p.categoria;
    document.getElementById("modalProdMarcaModelo").textContent = `${p.marca || ""} · ${p.modelo || ""}`;
    document.getElementById("modalProdPrecio").textContent = DB.utilidades ? DB.utilidades.formatearCLP(p.precio) : "$" + p.precio;
    document.getElementById("modalProdStock").textContent = `${p.stock} unidades en bodega`;
    document.getElementById("modalProdDesc").textContent = p.descripcion || "Sin descripción técnica detallada.";

    const modal = new bootstrap.Modal(document.getElementById("modalDetalleProducto"));
    modal.show();
  }

  function verDetalleOrden(id) {
    const ord = DB.ordenes.obtenerPorId(id);
    if (!ord) return;

    document.getElementById("modalOrdenTitulo").textContent = `Detalle de Orden: ${ord.id}`;
    document.getElementById("modalOrdenCliente").textContent = `${ord.clienteNombre} (${ord.clienteEmail})`;
    document.getElementById("modalOrdenFecha").textContent = ord.fecha;
    document.getElementById("modalOrdenTotal").textContent = DB.utilidades ? DB.utilidades.formatearCLP(ord.total) : "$" + ord.total;

    const lista = document.getElementById("modalOrdenItems");
    lista.innerHTML = "";

    if (!ord.items || ord.items.length === 0) {
      lista.innerHTML = '<li class="list-group-item panel-list-group-item text-muted text-center py-3">Sin artículos registrados.</li>';
    } else {
      ord.items.forEach(function (it) {
        const itemLi = document.createElement("li");
        itemLi.className = "list-group-item panel-list-group-item d-flex justify-content-between align-items-center";
        const sub = DB.utilidades ? DB.utilidades.formatearCLP(it.subtotal || it.precio * it.cantidad) : "$" + (it.subtotal || it.precio * it.cantidad);
        itemLi.innerHTML = `
          <div>
            <div class="fw-semibold">${it.nombre}</div>
            <small class="text-muted">SKU: ${it.codigo} · Cant: ${it.cantidad}</small>
          </div>
          <span class="fw-bold text-gold">${sub}</span>
        `;
        lista.appendChild(itemLi);
      });
    }

    const modal = new bootstrap.Modal(document.getElementById("modalDetalleOrden"));
    modal.show();
  }

  // 5. Inicialización de Eventos
  document.addEventListener("DOMContentLoaded", function () {
    cargarProductosVendedor();
    cargarOrdenesVendedor();

    // Eventos productos
    const tablaProd = document.getElementById("tabla-productos-vendedor");
    if (tablaProd) {
      tablaProd.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-ver-detalle-prod");
        if (btn) {
          verDetalleProducto(btn.dataset.codigo);
        }
      });
    }

    // Eventos órdenes
    const tablaOrd = document.getElementById("tabla-ordenes-vendedor");
    if (tablaOrd) {
      tablaOrd.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-ver-detalle-orden");
        if (btn) {
          verDetalleOrden(btn.dataset.id);
        }
      });

      tablaOrd.addEventListener("change", function (e) {
        const select = e.target.closest(".select-estado-orden");
        if (select) {
          const ordId = select.dataset.id;
          const nuevoEst = select.value;
          DB.ordenes.actualizarEstado(ordId, nuevoEst);
          alert(`Orden ${ordId} actualizada a estado "${nuevoEst}".`);
        }
      });
    }

    // Botón Salir
    const btnSalir = document.getElementById("btn-salir-vendedor");
    if (btnSalir) {
      btnSalir.addEventListener("click", function () {
        if (window.DB && DB.usuarios && typeof DB.usuarios.cerrarSesion === "function") {
          DB.usuarios.cerrarSesion();
        }
        localStorage.removeItem("usuarioActivo");
        alert("Has cerrado sesión.");
        window.location.href = "index.html";
      });
    }
  });
})();
