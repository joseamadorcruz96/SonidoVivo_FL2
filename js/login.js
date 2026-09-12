/**
 * ============================================================================
 * SONIDO VIVO - Lógica de Autenticación e Inicio de Sesión
 * Archivo: js/login.js
 * Integración directa con: js/db.js (window.DB.usuarios)
 * Asignatura: Desarrollo Full Stack II (DSY1104)
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const formLogin = document.getElementById("login-form");
  const mensajeError = document.getElementById("login-error");

  if (!formLogin) return;

  function mostrarError(texto) {
    if (mensajeError) {
      mensajeError.textContent = texto;
      mensajeError.classList.remove("d-none");
    } else {
      alert(texto);
    }
  }

  function ocultarError() {
    if (mensajeError) {
      mensajeError.classList.add("d-none");
    }
  }

  // Validación de dominios de correo según reglas del Anexo 1
  function validarDominioCorreo(correo) {
    const c = correo.trim().toLowerCase();
    return (
      c.endsWith("@duoc.cl") ||
      c.endsWith("@profesor.duoc.cl") ||
      c.endsWith("@gmail.com") ||
      c.endsWith("@sonidovivo.cl")
    );
  }

  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    ocultarError();

    const inputEmail = document.getElementById("email");
    const inputPassword = document.getElementById("password");

    const email = inputEmail ? inputEmail.value.trim().toLowerCase() : "";
    const password = inputPassword ? inputPassword.value : "";

    // 1. Validaciones previas de formato (Anexo 1 - RF-26)
    if (!email) {
      mostrarError("El correo electrónico es obligatorio.");
      if (inputEmail) inputEmail.focus();
      return;
    }

    if (email.length > 100) {
      mostrarError("El correo electrónico no puede superar los 100 caracteres.");
      return;
    }

    if (!validarDominioCorreo(email)) {
      mostrarError("Solo se permiten correos @duoc.cl, @profesor.duoc.cl, @gmail.com o @sonidovivo.cl.");
      if (inputEmail) inputEmail.focus();
      return;
    }

    if (!password) {
      mostrarError("La contraseña es obligatoria.");
      if (inputPassword) inputPassword.focus();
      return;
    }

    if (password.length < 4 || password.length > 10) {
      mostrarError("La contraseña debe tener entre 4 y 10 caracteres.");
      if (inputPassword) inputPassword.focus();
      return;
    }

    // 2. Autenticación con la capa de datos oficial (db.js)
    if (!window.DB || !DB.usuarios || typeof DB.usuarios.autenticar !== "function") {
      mostrarError("Error: La base de datos local (db.js) no está disponible en este momento.");
      return;
    }

    const sesion = DB.usuarios.autenticar(email, password);

    if (sesion) {
      // Sincronizar compatibilidad con scripts legacy
      localStorage.setItem("usuarioActivo", JSON.stringify(sesion));

      // 3. Redirección basada en el rol del usuario (RBAC)
      const rol = String(sesion.rol || "").toLowerCase();

      if (rol === "administrador" || rol === "admin") {
        window.location.href = "admin/index.html";
      } else if (rol === "vendedor") {
        window.location.href = "panel_vendedor.html";
      } else {
        window.location.href = "panel_cliente.html";
      }
    } else {
      mostrarError("Credenciales incorrectas o cuenta inactiva. Verifica tu correo y contraseña.");
      if (inputPassword) inputPassword.value = "";
    }
  });
});