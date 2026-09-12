/**
 * ============================================================================
 * SONIDO VIVO - Servicio y Controlador de Mantenedor de Productos
 * Archivo: admin/js/admin_productos.js
 * Asignatura: Desarrollo Full Stack II (DSY1104)
 * ============================================================================
 */

(function () {
  "use strict";

  let categoriaFiltro = "Todos";
  let textoBusqueda = "";

  function renderizarTablaProductos() {
    const tbody = document.getElementById("tabla-productos-body");
    if (!tbody || !window.DB || !DB.productos) return;

    tbody.innerHTML = "";
    let productos = DB.productos.obtenerTodos();

    // Filtro por categoría
    if (categoriaFiltro && categoriaFiltro !== "Todos") {
      productos = productos.filter(function (p) {
        return p.categoria.toLowerCase() === categoriaFiltro.toLowerCase();
      });
    }

    // Filtro por texto de búsqueda
    if (textoBusqueda) {
      const q = textoBusqueda.toLowerCase();
      productos = productos.filter(function (p) {
        return (
          p.codigo.toLowerCase().includes(q) ||
          p.nombre.toLowerCase().includes(q) ||
          (p.marca && p.marca.toLowerCase().includes(q))
        );
      });
    }

    if (productos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-5 text-muted">
            No se encontraron productos en el inventario con los criterios seleccionados.
          </td>
        </tr>
      `;
      return;
    }

    productos.forEach(function (p) {
      const fila = document.createElement("tr");
      const esCritico = Number(p.stock) <= Number(p.stockCritico || 0);

      if (esCritico) {
        fila.className = "table-warning-custom";
      }

      const precioFmt = DB.utilidades ? DB.utilidades.formatearCLP(p.precio) : "$" + p.precio;

      fila.innerHTML = `
        <td class="fw-bold text-gold">${p.codigo}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${p.imagen || '../assets/img/logo.svg'}" alt="${p.nombre}" class="admin-table-thumb">
            <div>
              <div class="fw-semibold text-main">${p.nombre}</div>
              <small class="text-muted">${p.marca || ''} ${p.modelo || ''}</small>
            </div>
          </div>
        </td>
        <td><span class="badge bg-secondary">${p.categoria}</span></td>
        <td class="fw-bold">${precioFmt}</td>
        <td>
          <span class="badge ${p.stock <= 0 ? 'bg-danger' : esCritico ? 'bg-warning text-dark' : 'bg-success'}">
            ${p.stock} un.
          </span>
        </td>
        <td>
          <span class="badge bg-dark border border-secondary text-muted">
            ${p.stockCritico !== undefined ? p.stockCritico + ' un.' : 'No def.'}
          </span>
          ${esCritico ? '<span class="badge bg-danger ms-1">¡Alerta!</span>' : ''}
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-info btn-editar" data-codigo="${p.codigo}" title="Editar Producto">
              ✏️
            </button>
            <button class="btn btn-outline-danger btn-eliminar" data-codigo="${p.codigo}" title="Eliminar Producto">
              🗑️
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(fila);
    });

    const contadorTotal = document.getElementById("contador-lista-productos");
    if (contadorTotal) {
      contadorTotal.textContent = `${productos.length} productos`;
    }
  }

  function limpiarFormulario() {
    const form = document.getElementById("form-producto");
    if (form) form.reset();
    document.getElementById("prod-codigo").readOnly = false;
    document.getElementById("prod-modo-edicion").value = "crear";
    document.getElementById("modalProductoTitulo").textContent = "Nuevo Producto Musical";
    const errorBox = document.getElementById("prod-error-alerta");
    if (errorBox) errorBox.classList.add("d-none");
  }

  function cargarDatosEnFormulario(codigo) {
    limpiarFormulario();
    const p = DB.productos.obtenerPorCodigo(codigo);
    if (!p) return;

    document.getElementById("prod-modo-edicion").value = "editar";
    document.getElementById("modalProductoTitulo").textContent = `Editar Producto: ${p.codigo}`;
    document.getElementById("prod-codigo").value = p.codigo;
    document.getElementById("prod-codigo").readOnly = true;
    document.getElementById("prod-nombre").value = p.nombre || "";
    document.getElementById("prod-categoria").value = p.categoria || "Guitarras Acústicas";
    document.getElementById("prod-marca").value = p.marca || "";
    document.getElementById("prod-modelo").value = p.modelo || "";
    document.getElementById("prod-precio").value = p.precio || 0;
    document.getElementById("prod-stock").value = p.stock || 0;
    document.getElementById("prod-stock-critico").value = p.stockCritico !== undefined ? p.stockCritico : 2;
    document.getElementById("prod-imagen").value = p.imagen || "";
    document.getElementById("prod-descripcion").value = p.descripcion || "";

    const modalEl = document.getElementById("modalProducto");
    if (modalEl && window.bootstrap) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      modalInstance.show();
    }
  }

  function guardarProducto(e) {
    e.preventDefault();
    const errorBox = document.getElementById("prod-error-alerta");
    if (errorBox) errorBox.classList.add("d-none");

    const modo = document.getElementById("prod-modo-edicion").value;
    const codigo = document.getElementById("prod-codigo").value.trim().toUpperCase();
    const nombre = document.getElementById("prod-nombre").value.trim();
    const categoria = document.getElementById("prod-categoria").value;
    const marca = document.getElementById("prod-marca").value.trim();
    const modelo = document.getElementById("prod-modelo").value.trim();
    const precio = parseFloat(document.getElementById("prod-precio").value);
    const stock = parseInt(document.getElementById("prod-stock").value, 10);
    const stockCriticoRaw = document.getElementById("prod-stock-critico").value;
    const stockCritico = stockCriticoRaw !== "" ? parseInt(stockCriticoRaw, 10) : 0;
    const imagen = document.getElementById("prod-imagen").value.trim();
    const descripcion = document.getElementById("prod-descripcion").value.trim();

    // Validaciones Anexo 1
    if (codigo.length < 3) {
      mostrarError("El código de producto es obligatorio y debe tener al menos 3 caracteres.");
      return;
    }

    if (modo === "crear") {
      const existente = DB.productos.obtenerPorCodigo(codigo);
      if (existente) {
        mostrarError(`El código "${codigo}" ya se encuentra registrado. Utilice otro código SKU.`);
        return;
      }
    }

    if (!nombre || nombre.length > 100) {
      mostrarError("El nombre es requerido y no puede superar los 100 caracteres.");
      return;
    }

    if (isNaN(precio) || precio < 0) {
      mostrarError("El precio debe ser un número mayor o igual a 0.");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      mostrarError("El stock es obligatorio, debe ser un número entero mayor o igual a 0.");
      return;
    }

    if (isNaN(stockCritico) || stockCritico < 0) {
      mostrarError("El stock crítico debe ser un número entero mayor o igual a 0.");
      return;
    }

    if (!categoria) {
      mostrarError("Debe seleccionar una categoría para el producto.");
      return;
    }

    if (descripcion.length > 500) {
      mostrarError("La descripción no puede superar los 500 caracteres.");
      return;
    }

    const productoObj = {
      codigo: codigo,
      nombre: nombre,
      categoria: categoria,
      marca: marca || "Sonido Vivo",
      modelo: modelo || "Custom",
      precio: precio,
      stock: stock,
      stockCritico: stockCritico,
      imagen: imagen || "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80",
      descripcion: descripcion,
      destacado: false
    };

    const exito = DB.productos.guardar(productoObj);
    if (exito) {
      alert(`Producto "${productoObj.codigo} - ${productoObj.nombre}" guardado con éxito.`);
      const modalEl = document.getElementById("modalProducto");
      if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }
      renderizarTablaProductos();
    } else {
      mostrarError("Ocurrió un error al intentar guardar en LocalStorage.");
    }
  }

  function mostrarError(mensaje) {
    const errorBox = document.getElementById("prod-error-alerta");
    if (errorBox) {
      errorBox.textContent = mensaje;
      errorBox.classList.remove("d-none");
    } else {
      alert(mensaje);
    }
  }

  function eliminarProducto(codigo) {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto ${codigo}? Esta acción no se puede deshacer.`)) {
      DB.productos.eliminar(codigo);
      renderizarTablaProductos();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderizarTablaProductos();

    // Filtros
    const selectFiltroCat = document.getElementById("filtro-categoria");
    if (selectFiltroCat) {
      selectFiltroCat.addEventListener("change", function () {
        categoriaFiltro = this.value;
        renderizarTablaProductos();
      });
    }

    const inputBuscar = document.getElementById("buscar-producto");
    if (inputBuscar) {
      inputBuscar.addEventListener("input", function () {
        textoBusqueda = this.value.trim();
        renderizarTablaProductos();
      });
    }

    // Formulario
    const form = document.getElementById("form-producto");
    if (form) {
      form.addEventListener("submit", guardarProducto);
    }

    const btnNuevo = document.getElementById("btn-nuevo-producto");
    if (btnNuevo) {
      btnNuevo.addEventListener("click", limpiarFormulario);
    }

    // Delegación de eventos para botones de tabla
    const tbody = document.getElementById("tabla-productos-body");
    if (tbody) {
      tbody.addEventListener("click", function (e) {
        const btnEdit = e.target.closest(".btn-editar");
        if (btnEdit) {
          cargarDatosEnFormulario(btnEdit.dataset.codigo);
          return;
        }

        const btnDel = e.target.closest(".btn-eliminar");
        if (btnDel) {
          eliminarProducto(btnDel.dataset.codigo);
        }
      });
    }
  });
})();
