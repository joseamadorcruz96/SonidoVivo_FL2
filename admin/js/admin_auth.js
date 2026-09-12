/**
 * ============================================================================
 * SONIDO VIVO - Guardia de Seguridad y Sesión para Administrador
 * Archivo: admin/js/admin_auth.js
 * Asignatura: Desarrollo Full Stack II (DSY1104)
 * ============================================================================
 */

(function () {
  "use strict";

  /**
   * Obtiene la sesión activa comprobando DB.usuarios o el almacenamiento local.
   * @returns {Object|null}
   */
  function obtenerSesionActual() {
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
    return sesion;
  }

  /**
   * Verifica los permisos de acceso al módulo de administración.
   */
  function verificarAccesoAdmin() {
    const sesion = obtenerSesionActual();
    const rol = sesion ? String(sesion.rol || "").toLowerCase() : "";

    // Si no está autenticado o su rol no es administrador, expulsar a login
    if (!sesion || (rol !== "administrador" && rol !== "admin")) {
      alert("Acceso denegado. Esta sección requiere permisos de Administrador.");
      window.location.href = "../login.html";
      return false;
    }

    // Si tiene acceso, actualizar nombre en la barra del admin
    document.addEventListener("DOMContentLoaded", function () {
      const nombreEl = document.getElementById("admin-nombre-usuario");
      if (nombreEl) {
        nombreEl.textContent = sesion.nombre || "Administrador";
      }
    });

    return true;
  }

  /**
   * Cierra la sesión activa y redirige a la página pública de inicio.
   */
  function cerrarSesionAdmin() {
    if (window.DB && DB.usuarios && typeof DB.usuarios.cerrarSesion === "function") {
      DB.usuarios.cerrarSesion();
    }
    localStorage.removeItem("usuarioActivo");
    alert("Has cerrado tu sesión de administrador.");
    window.location.href = "../index.html";
  }

  // Ejecutar verificación de seguridad inmediatamente
  verificarAccesoAdmin();

  // Exponer al ámbito global
  window.AdminAuth = {
    obtenerSesion: obtenerSesionActual,
    cerrarSesion: cerrarSesionAdmin
  };
})();
