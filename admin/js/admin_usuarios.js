/**
 * ============================================================================
 * SONIDO VIVO - Servicio y Controlador de Mantenedor de Usuarios
 * Archivo: admin/js/admin_usuarios.js
 * Asignatura: Desarrollo Full Stack II (DSY1104)
 * ============================================================================
 */

(function () {
  "use strict";

  let rolFiltro = "Todos";

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
   * Valida dominios de correo permitidos según Anexo 1.
   * @param {string} email 
   * @returns {boolean}
   */
  function validarEmailPermitido(email) {
    if (!email) return false;
    const e = email.trim().toLowerCase();
    return (
      e.endsWith("@duoc.cl") ||
      e.endsWith("@profesor.duoc.cl") ||
      e.endsWith("@gmail.com") ||
      e.endsWith("@sonidovivo.cl") // Dominio corporativo
    );
  }

  function renderizarTablaUsuarios() {
    const tbody = document.getElementById("tabla-usuarios-body");
    if (!tbody || !window.DB || !DB.usuarios) return;

    tbody.innerHTML = "";
    let usuarios = DB.usuarios.obtenerTodos();

    if (rolFiltro && rolFiltro !== "Todos") {
      usuarios = usuarios.filter(function (u) {
        return (u.rol || "").toLowerCase() === rolFiltro.toLowerCase();
      });
    }

    if (usuarios.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-5 text-muted">
            No se encontraron usuarios registrados para el rol seleccionado.
          </td>
        </tr>
      `;
      return;
    }

    usuarios.forEach(function (u) {
      const fila = document.createElement("tr");

      let badgeRol = "bg-secondary";
      const rolLower = (u.rol || "").toLowerCase();
      if (rolLower === "administrador" || rolLower === "admin") badgeRol = "bg-danger";
      else if (rolLower === "vendedor") badgeRol = "bg-warning text-dark";
      else if (rolLower === "cliente") badgeRol = "bg-info text-dark";

      fila.innerHTML = `
        <td class="fw-bold font-monospace text-gold">${u.run || 'No def.'}</td>
        <td>
          <div class="fw-semibold text-main">${u.nombre} ${u.apellidos || ''}</div>
          <small class="text-muted">${u.direccion || 'Sin dirección'}</small>
        </td>
        <td>${u.email}</td>
        <td><span class="badge ${badgeRol}">${u.rol}</span></td>
        <td><small class="text-muted">${u.region || 'Región no def.'}, ${u.comuna || ''}</small></td>
        <td>
          <span class="badge ${u.activo !== false ? 'bg-success' : 'bg-secondary'}">
            ${u.activo !== false ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-info btn-editar-user" data-email="${u.email}" title="Editar Usuario">
              ✏️
            </button>
            <button class="btn btn-outline-danger btn-eliminar-user" data-email="${u.email}" title="Eliminar Usuario">
              🗑️
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(fila);
    });

    const contador = document.getElementById("contador-lista-usuarios");
    if (contador) {
      contador.textContent = `${usuarios.length} usuarios`;
    }
  }

  function limpiarFormularioUsuario() {
    const form = document.getElementById("form-usuario");
    if (form) form.reset();
    document.getElementById("user-email").readOnly = false;
    document.getElementById("user-modo-edicion").value = "crear";
    document.getElementById("modalUsuarioTitulo").textContent = "Registrar Nuevo Usuario";
    const errorBox = document.getElementById("user-error-alerta");
    if (errorBox) errorBox.classList.add("d-none");

    // Conectar selectores de región y comuna
    if (window.RegionesChile) {
      window.RegionesChile.conectarSelectores(
        document.getElementById("user-region"),
        document.getElementById("user-comuna")
      );
    }
  }

  function cargarUsuarioEnFormulario(email) {
    limpiarFormularioUsuario();
    const u = DB.usuarios.obtenerPorEmail(email);
    if (!u) return;

    document.getElementById("user-modo-edicion").value = "editar";
    document.getElementById("modalUsuarioTitulo").textContent = `Editar Usuario: ${u.email}`;
    document.getElementById("user-run").value = u.run || "";
    document.getElementById("user-nombre").value = u.nombre || "";
    document.getElementById("user-apellidos").value = u.apellidos || "";
    document.getElementById("user-email").value = u.email;
    document.getElementById("user-email").readOnly = true;
    document.getElementById("user-password").value = u.password || "";
    document.getElementById("user-rol").value = u.rol || "Cliente";
    document.getElementById("user-direccion").value = u.direccion || "";
    document.getElementById("user-fecha").value = u.fechaNacimiento || "";

    if (window.RegionesChile) {
      const selectReg = document.getElementById("user-region");
      selectReg.value = u.region || "";
      window.RegionesChile.conectarSelectores(
        selectReg,
        document.getElementById("user-comuna"),
        u.comuna
      );
    }

    const modalEl = document.getElementById("modalUsuario");
    if (modalEl && window.bootstrap) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      modalInstance.show();
    }
  }

  function guardarUsuario(e) {
    e.preventDefault();
    const errorBox = document.getElementById("user-error-alerta");
    if (errorBox) errorBox.classList.add("d-none");

    const modo = document.getElementById("user-modo-edicion").value;
    const run = document.getElementById("user-run").value.trim().toUpperCase().replace(/[\.\-]/g, "");
    const nombre = document.getElementById("user-nombre").value.trim();
    const apellidos = document.getElementById("user-apellidos").value.trim();
    const email = document.getElementById("user-email").value.trim().toLowerCase();
    const password = document.getElementById("user-password").value;
    const rol = document.getElementById("user-rol").value;
    const region = document.getElementById("user-region").value;
    const comuna = document.getElementById("user-comuna").value;
    const direccion = document.getElementById("user-direccion").value.trim();
    const fechaNacimiento = document.getElementById("user-fecha").value;

    // 1. Validación de RUN chileno (Anexo 1)
    if (!validarRunChileno(run)) {
      mostrarError("El RUN ingresado no es válido. Debe contener entre 7 y 9 dígitos sin puntos ni guión (ej: 19011022K) y cumplir el dígito verificador.");
      return;
    }

    // 2. Validación de Nombre y Apellidos
    if (!nombre || nombre.length > 50) {
      mostrarError("El nombre es requerido y no puede superar los 50 caracteres.");
      return;
    }
    if (!apellidos || apellidos.length > 100) {
      mostrarError("Los apellidos son requeridos y no pueden superar los 100 caracteres.");
      return;
    }

    // 3. Validación de Correo (Dominios Anexo 1)
    if (!email || email.length > 100) {
      mostrarError("El correo es requerido y no puede superar los 100 caracteres.");
      return;
    }
    if (!validarEmailPermitido(email)) {
      mostrarError("Correo no autorizado. Solo se permiten cuentas con @duoc.cl, @profesor.duoc.cl, @gmail.com o @sonidovivo.cl.");
      return;
    }

    // 4. Verificación de existencia previa en modo creación
    if (modo === "crear") {
      const existeEmail = DB.usuarios.obtenerPorEmail(email);
      if (existeEmail) {
        mostrarError(`El correo "${email}" ya se encuentra registrado.`);
        return;
      }
      const existeRun = DB.usuarios.obtenerPorRun(run);
      if (existeRun) {
        mostrarError(`El RUN "${run}" ya se encuentra asignado a otro usuario.`);
        return;
      }
    }

    // 5. Validación de Dirección
    if (!direccion || direccion.length > 300) {
      mostrarError("La dirección es obligatoria y no puede superar los 300 caracteres.");
      return;
    }

    // 6. Validación de Contraseña
    if (!password || password.length < 4 || password.length > 10) {
      mostrarError("La contraseña es requerida y debe tener entre 4 y 10 caracteres.");
      return;
    }

    const usuarioObj = {
      run: run,
      nombre: nombre,
      apellidos: apellidos,
      email: email,
      password: password,
      rol: rol,
      region: region,
      comuna: comuna,
      direccion: direccion,
      fechaNacimiento: fechaNacimiento,
      activo: true
    };

    const guardado = DB.usuarios.guardar(usuarioObj);
    if (guardado) {
      alert(`Usuario "${usuarioObj.nombre} ${usuarioObj.apellidos}" (${usuarioObj.rol}) guardado correctamente.`);
      const modalEl = document.getElementById("modalUsuario");
      if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }
      renderizarTablaUsuarios();
    } else {
      mostrarError("No fue posible guardar el usuario en LocalStorage.");
    }
  }

  function mostrarError(mensaje) {
    const errorBox = document.getElementById("user-error-alerta");
    if (errorBox) {
      errorBox.textContent = mensaje;
      errorBox.classList.remove("d-none");
    } else {
      alert(mensaje);
    }
  }

  function eliminarUsuario(email) {
    if (confirm(`¿Estás seguro de que deseas eliminar el usuario "${email}"?`)) {
      DB.usuarios.eliminar(email);
      renderizarTablaUsuarios();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderizarTablaUsuarios();

    const filtro = document.getElementById("filtro-rol");
    if (filtro) {
      filtro.addEventListener("change", function () {
        rolFiltro = this.value;
        renderizarTablaUsuarios();
      });
    }

    const form = document.getElementById("form-usuario");
    if (form) {
      form.addEventListener("submit", guardarUsuario);
    }

    const btnNuevo = document.getElementById("btn-nuevo-usuario");
    if (btnNuevo) {
      btnNuevo.addEventListener("click", limpiarFormularioUsuario);
    }

    const tbody = document.getElementById("tabla-usuarios-body");
    if (tbody) {
      tbody.addEventListener("click", function (e) {
        const btnEdit = e.target.closest(".btn-editar-user");
        if (btnEdit) {
          cargarUsuarioEnFormulario(btnEdit.dataset.email);
          return;
        }

        const btnDel = e.target.closest(".btn-eliminar-user");
        if (btnDel) {
          eliminarUsuario(btnDel.dataset.email);
        }
      });
    }
  });
})();
