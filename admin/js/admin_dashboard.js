/**
 * ============================================================================
 * SONIDO VIVO - Controlador Dashboard del Administrador
 * Archivo: admin/js/admin_dashboard.js
 * Asignatura: Desarrollo Full Stack II (DSY1104)
 * ============================================================================
 */

(function () {
  "use strict";

  function cargarMetricas() {
    if (!window.DB) return;

    const productos = DB.productos ? DB.productos.obtenerTodos() : [];
    const criticos = DB.productos ? DB.productos.obtenerCriticos() : [];
    const usuarios = DB.usuarios ? DB.usuarios.obtenerTodos() : [];
    const ordenes = DB.ordenes ? DB.ordenes.obtenerTodas() : [];

    const kpiProd = document.getElementById("kpi-productos");
    const kpiCrit = document.getElementById("kpi-criticos");
    const kpiUser = document.getElementById("kpi-usuarios");
    const kpiOrd = document.getElementById("kpi-ordenes");

    if (kpiProd) kpiProd.textContent = productos.length;
    if (kpiCrit) kpiCrit.textContent = criticos.length;
    if (kpiUser) kpiUser.textContent = usuarios.length;
    if (kpiOrd) kpiOrd.textContent = ordenes.length;

    renderizarTablaCriticos(criticos);
  }

  function renderizarTablaCriticos(criticos) {
    const tbody = document.getElementById("tabla-stock-critico");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (criticos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            <span class="text-success fw-bold">✓ Todo en orden.</span> No hay productos en nivel crítico actualmente.
          </td>
        </tr>
      `;
      return;
    }

    criticos.forEach(function (prod) {
      const fila = document.createElement("tr");
      fila.className = "table-warning-custom";

      const precioFormateado = DB.utilidades
        ? DB.utilidades.formatearCLP(prod.precio)
        : "$" + prod.precio;

      fila.innerHTML = `
        <td class="fw-bold text-gold">${prod.codigo}</td>
        <td>${prod.nombre}</td>
        <td><span class="badge bg-secondary">${prod.categoria}</span></td>
        <td>${precioFormateado}</td>
        <td>
          <span class="badge ${prod.stock <= 0 ? "bg-danger" : "bg-warning text-dark"} fw-bold">
            ${prod.stock <= 0 ? "Agotado (0 un.)" : prod.stock + " unidades"}
          </span>
        </td>
        <td>
          <span class="badge bg-dark border border-secondary text-muted">Mín: ${prod.stockCritico || 0}</span>
        </td>
      `;
      tbody.appendChild(fila);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cargarMetricas();
  });

  window.AdminDashboard = {
    recargar: cargarMetricas
  };
})();
