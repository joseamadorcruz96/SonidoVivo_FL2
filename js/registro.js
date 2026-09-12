/**
 * ============================================================================
 * SONIDO VIVO - Lógica de Registro de Nuevos Clientes
 * Archivo: js/registro.js
 * Integración directa con: js/db.js (window.DB.usuarios)
 * Asignatura: Desarrollo Full Stack II (DSY1104)
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const formRegistro = document.getElementById("form-registro");
  const alertaError = document.getElementById("registro-error");
  const alertaExito = document.getElementById("registro-exito");

  // Conectar selectores dependientes de Región y Comuna si está disponible el catálogo
  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");
  if (selectRegion && selectComuna && window.RegionesChile) {
    window.RegionesChile.conectarSelectores(selectRegion, selectComuna);
  }

  if (!formRegistro) return;

  function mostrarError(texto) {
    if (alertaExito) alertaExito.classList.add("d-none");
    if (alertaError) {
      alertaError.textContent = texto;
      alertaError.classList.remove("d-none");
    } else {
      alert(texto);
    }
  }

  function mostrarExito(texto) {
    if (alertaError) alertaError.classList.add("d-none");
    if (alertaExito) {
      alertaExito.textContent = texto;
      alertaExito.classList.remove("d-none");
    } else {
      alert(texto);
    }
  }

  function ocultarAlertas() {
    if (alertaError) alertaError.classList.add("d-none");
    if (alertaExito) alertaExito.classList.add("d-none");
  }

  /**
   * Valida un RUN chileno sin puntos ni guión (ej: 19011022K) mediante Módulo 11.
   * @param {string} run
   * @returns {boolean}
   */
  function validarRunChileno(run) {
    if (!run) return false;
    const limpio = run.trim().toUpperCase().replace(/[\.\-]/g, "");
    if (limpio.length < 7 || limpio.length > 9) return false;

    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado = "0";
    if (resto === 11) dvEsperado = "0";
    else if (resto === 10) dvEsperado = "K";
    else dvEsperado = String(resto);

    return dvIngresado === dvEsperado;
  }

  /**
   * Valida que el correo pertenezca a los dominios estipulados en el Anexo 1.
   * @param {string} correo
   * @returns {boolean}
   */
  function validarDominioCorreo(correo) {
    const c = correo.trim().toLowerCase();
    return (
      c.endsWith("@duoc.cl") ||
      c.endsWith("@profesor.duoc.cl") ||
      c.endsWith("@gmail.com")
    );
  }

  formRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    ocultarAlertas();

    // Captura de campos
    const inputRun = document.getElementById("run");
    const inputNombre = document.getElementById("nombre");
    const inputApellidos = document.getElementById("apellidos");
    const inputEmail = document.getElementById("email");
    const inputPassword = document.getElementById("password");
    const inputConfirmar = document.getElementById("confirmar-password");
    const inputRegion = document.getElementById("region");
    const inputComuna = document.getElementById("comuna");
    const inputDireccion = document.getElementById("direccion");

    const run = inputRun ? inputRun.value.trim().toUpperCase().replace(/[\.\-]/g, "") : "";
    const nombre = inputNombre ? inputNombre.value.trim() : "";
    const apellidos = inputApellidos ? inputApellidos.value.trim() : "";
    const email = inputEmail ? inputEmail.value.trim().toLowerCase() : "";
    const password = inputPassword ? inputPassword.value : "";
    const confirmarPassword = inputConfirmar ? inputConfirmar.value : "";
    const region = inputRegion ? inputRegion.value : "Valparaíso";
    const comuna = inputComuna ? inputComuna.value : "Viña del Mar";
    const direccion = inputDireccion ? inputDireccion.value.trim() : "";

    // 1. Validación de RUN chileno (Anexo 1 - RF-23)
    if (inputRun && !validarRunChileno(run)) {
      mostrarError("El RUN ingresado no es válido. Debe tener entre 7 y 9 caracteres sin puntos ni guión (ej: 19011022K) y cumplir el dígito verificador.");
      inputRun.focus();
      return;
    }

    // 2. Validación de Nombre y Apellidos (Anexo 1 - RF-24)
    if (!nombre) {
      mostrarError("El nombre es obligatorio.");
      if (inputNombre) inputNombre.focus();
      return;
    }
    if (nombre.length > 50) {
      mostrarError("El nombre no puede superar los 50 caracteres.");
      return;
    }

    if (inputApellidos && (!apellidos || apellidos.length > 100)) {
      mostrarError("Los apellidos son obligatorios y no pueden superar los 100 caracteres.");
      inputApellidos.focus();
      return;
    }

    // 3. Validación de Correo Electrónico (Anexo 1 - RF-24)
    if (!email || email.length > 100) {
      mostrarError("El correo es obligatorio y no puede superar los 100 caracteres.");
      if (inputEmail) inputEmail.focus();
      return;
    }

    if (!validarDominioCorreo(email)) {
      mostrarError("Correo no autorizado. Solo se permiten cuentas con @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      if (inputEmail) inputEmail.focus();
      return;
    }

    // 4. Validación de Contraseña (Anexo 1: 4 a 10 caracteres)
    if (!password || password.length < 4 || password.length > 10) {
      mostrarError("La contraseña es obligatoria y debe tener entre 4 y 10 caracteres.");
      if (inputPassword) inputPassword.focus();
      return;
    }

    if (password !== confirmarPassword) {
      mostrarError("Las contraseñas no coinciden. Por favor verifícalas.");
      if (inputConfirmar) inputConfirmar.focus();
      return;
    }

    // 5. Validación de Dirección y Región/Comuna (Anexo 1 - RF-24 y RF-25)
    if (inputRegion && !region) {
      mostrarError("Debe seleccionar una región de residencia.");
      inputRegion.focus();
      return;
    }

    if (inputComuna && !comuna) {
      mostrarError("Debe seleccionar una comuna de residencia.");
      inputComuna.focus();
      return;
    }

    if (inputDireccion && (!direccion || direccion.length > 300)) {
      mostrarError("La dirección de despacho es obligatoria y no puede superar los 300 caracteres.");
      inputDireccion.focus();
      return;
    }

    // 6. Validación de Unicidad en la Base de Datos Local (db.js)
    if (!window.DB || !DB.usuarios) {
      mostrarError("Error: La base de datos local (db.js) no está cargada.");
      return;
    }

    const usuarioExistente = DB.usuarios.obtenerPorEmail(email);
    if (usuarioExistente) {
      mostrarError(`El correo "${email}" ya se encuentra registrado.`);
      if (inputEmail) inputEmail.focus();
      return;
    }

    if (run) {
      const runExistente = DB.usuarios.obtenerPorRun(run);
      if (runExistente) {
        mostrarError(`El RUN "${run}" ya se encuentra registrado en el sistema.`);
        if (inputRun) inputRun.focus();
        return;
      }
    }

    // 7. Estructuración del Objeto de Usuario (Rol Cliente por defecto)
    const nuevoUsuario = {
      run: run || "19011022K",
      nombre: nombre,
      apellidos: apellidos || "",
      email: email,
      password: password,
      rol: "Cliente",
      region: region,
      comuna: comuna,
      direccion: direccion || "Sin dirección especificada",
      fechaNacimiento: "",
      activo: true
    };

    // 8. Guardar en db.js
    const guardadoExitoso = DB.usuarios.guardar(nuevoUsuario);

    if (guardadoExitoso) {
      // Sincronizar compatibilidad con usuariosSistema si existía
      try {
        let usuariosCompat = JSON.parse(localStorage.getItem("usuariosSistema")) || [];
        usuariosCompat.push({
          nombre: `${nuevoUsuario.nombre} ${nuevoUsuario.apellidos}`.trim(),
          email: nuevoUsuario.email,
          password: nuevoUsuario.password,
          rol: "cliente"
        });
        localStorage.setItem("usuariosSistema", JSON.stringify(usuariosCompat));
      } catch (e) {
        // Ignorar si falla compatibilidad
      }

      mostrarExito("¡Registro exitoso! Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...");
      formRegistro.reset();

      setTimeout(function () {
        window.location.href = "login.html";
      }, 1500);
    } else {
      mostrarError("Ocurrió un error al guardar los datos en LocalStorage.");
    }
  });
});