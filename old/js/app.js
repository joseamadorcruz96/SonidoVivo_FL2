// ==========================================================================
// SONIDO VIVO - JavaScript Principal
// Asignatura: Desarrollo Full Stack II (DSY1104)
// Referencia pedagógica: Semana 4 (Manipulación elemental del DOM)
// ==========================================================================

console.log("Sonido Vivo - Frontend iniciado correctamente");

// --------------------------------------------------------------------------
// RF-02: Contador Dinámico de Carrito en la Barra de Navegación
// --------------------------------------------------------------------------
function sincronizarContadorCarrito() {
  if (window.Carrito && typeof Carrito.sincronizarBadge === "function") {
    Carrito.sincronizarBadge();
    return;
  }

  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  if (window.DB && DB.carrito && typeof DB.carrito.obtenerCantidadTotal === "function") {
    contador.textContent = DB.carrito.obtenerCantidadTotal();
    return;
  }

  const carrito = JSON.parse(localStorage.getItem("sv_carrito") || localStorage.getItem("carrito") || "[]");
  let totalArticulos = 0;
  carrito.forEach(function (item) {
    totalArticulos = totalArticulos + (item.cantidad || 1);
  });
  contador.textContent = totalArticulos;
}

// --------------------------------------------------------------------------
// RF-04: Bienvenida Interactiva en la Sección Hero (Semana 4)
// --------------------------------------------------------------------------
function inicializarBienvenidaHero() {
  const botonBienvenida = document.getElementById("boton-bienvenida");
  const mensajeBienvenida = document.getElementById("mensaje-bienvenida");

  if (!botonBienvenida || !mensajeBienvenida) return;

  botonBienvenida.addEventListener("click", function () {
    mensajeBienvenida.textContent =
      "¡Bienvenidos a Sonido Vivo! Más de 11 años siendo el punto de encuentro de músicos en Viña del Mar. Ofrecemos instrumentos de alta calidad, amplificación profesional y servicio integral de luthería y calibración. ¡Esperamos que disfrutes tu visita!";
    mensajeBienvenida.className = "alert alert-bienvenida text-start";
    botonBienvenida.textContent = "Bienvenida mostrada";
    botonBienvenida.classList.add("btn-bienvenida-mostrada");
  });
}

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// Dinamización de Enlace Activo en el Menú de Navegación
// --------------------------------------------------------------------------
function actualizarNavegacionActiva() {
  const enlacesNav = document.querySelectorAll(".navbar-nav .nav-link");
  if (!enlacesNav || enlacesNav.length === 0) return;

  // Obtener el nombre del archivo actual desde la URL
  let paginaActual = window.location.pathname.split("/").pop();
  if (!paginaActual || paginaActual === "") {
    paginaActual = "index.html";
  }

  enlacesNav.forEach(function (enlace) {
    const href = enlace.getAttribute("href");
    if (!href) return;

    // Normalizar href para comparar solo el nombre del archivo
    const archivoHref = href.split("/").pop();

    if (archivoHref === paginaActual) {
      enlace.classList.add("active");
      enlace.setAttribute("aria-current", "page");
    } else {
      enlace.classList.remove("active");
      enlace.removeAttribute("aria-current");
    }
  });
}

// --------------------------------------------------------------------------
// Gestión Dinámica del Menú de Sesión
// --------------------------------------------------------------------------
function actualizarMenuSesion() {
  const menuSesion = document.getElementById("menu-sesion");
  if (!menuSesion) return; // Si no encuentra el contenedor, no hace nada

  // Compatibilidad: verificar sesión en db.js o en usuarioActivo
  const sesionActiva =
    (window.DB && DB.usuarios && typeof DB.usuarios.obtenerSesion === "function"
      ? DB.usuarios.obtenerSesion()
      : null) || JSON.parse(localStorage.getItem("usuarioActivo"));

  if (sesionActiva) {
    // Si hay sesión iniciada, mostramos panel y salir
    const rol = (sesionActiva.rol || "").toLowerCase();
    let rutaPanel = "panel_cliente.html";
    if (rol === "vendedor") {
      rutaPanel = "panel_vendedor.html";
    } else if (rol === "administrador" || rol === "admin") {
      rutaPanel = "admin/index.html";
    }

    const nombreUsuario = (sesionActiva.nombre || "Usuario").split(" ")[0];

    menuSesion.innerHTML = `
      <a href="${rutaPanel}" class="btn btn-outline-light btn-sm d-flex align-items-center" style="border-color: var(--color-gold); color: var(--color-gold);">
        Mi Panel (${nombreUsuario})
      </a>
      <button onclick="cerrarSesion()" class="btn btn-danger btn-sm">Salir</button>
    `;
  } else {
    // Si no hay sesión, mostramos el botón Ingresar
    menuSesion.innerHTML = `
      <a href="login.html" class="btn-nav-login">
        Ingresar
      </a>
    `;
  }
}

// Función global para cerrar sesión (puede llamarse desde el HTML)
window.cerrarSesion = function () {
  localStorage.removeItem("usuarioActivo");
  if (window.DB && DB.usuarios && typeof DB.usuarios.cerrarSesion === "function") {
    DB.usuarios.cerrarSesion();
  }
  alert("Has cerrado sesión correctamente.");
  window.location.href = "index.html";
};



// --------------------------------------------------------------------------
// Lógica Exclusiva para la vista Nosotros (Mapa Leaflet y Contadores)
// --------------------------------------------------------------------------

// 1. Inicialización del Mapa Interactivo (Leaflet.js)
function inicializarMapaTienda() {
  const contenedorMapa = document.getElementById("mapa-tienda");
  if (!contenedorMapa) return;

  // Coordenadas aproximadas de Av. Libertad #1024, Viña del Mar
  const lat = -33.0153;
  const lng = -71.5505;

  // Instanciar mapa centrado en Viña del Mar
  const mapa = L.map("mapa-tienda").setView([lat, lng], 15);

  // Capa de mapa (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
  }).addTo(mapa);

  // Marcador oficial de Sonido Vivo
  const marcador = L.marker([lat, lng]).addTo(mapa);
  marcador.bindPopup("<b>Sonido Vivo</b><br>Av. Libertad #1024, Viña del Mar<br><i>Tienda & Luthería</i>").openPopup();
}

// 2. Animación Incremental de Estadísticas en Cifras
function inicializarContadoresNosotros() {
  const elAnios = document.getElementById("stat-anios");
  if (!elAnios) return; // Si no está en esta página, interrumpe la ejecución

  const objetivos = [
    { id: "stat-anios", valor: 11, sufijo: "+" },
    { id: "stat-productos", valor: 340, sufijo: "+" },
    { id: "stat-calibraciones", valor: 1500, sufijo: "+" },
    { id: "stat-envios", valor: 100, sufijo: "%" }
  ];

  objetivos.forEach(function (item) {
    const el = document.getElementById(item.id);
    if (!el) return;

    let contadorActual = 0;
    const incremento = Math.ceil(item.valor / 40);
    const intervalo = setInterval(function () {
      contadorActual += incremento;
      if (contadorActual >= item.valor) {
        el.textContent = item.valor + item.sufijo;
        clearInterval(intervalo);
      } else {
        el.textContent = contadorActual + item.sufijo;
      }
    }, 30);
  });
}

// --------------------------------------------------------------------------
// Asegurar que DOMContentLoaded ejecute las nuevas funciones de Nosotros
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  sincronizarContadorCarrito();
  inicializarBienvenidaHero();
  inicializarLogin();
  
  // Módulos de la página Nosotros
  inicializarMapaTienda();
  inicializarContadoresNosotros();
});

// --------------------------------------------------------------------------
// Lógica Exclusiva para la vista Blogs (Filtros, Búsqueda y Modal)
// --------------------------------------------------------------------------

function inicializarBlogs() {
  const contenedor = document.getElementById("contenedor-articulos-blog");
  if (!contenedor) return; // Cláusula de guardia si no estamos en blogs.html

  const tarjetas = document.querySelectorAll(".tarjeta-blog-item");
  const botonesFiltro = document.querySelectorAll(".btn-filtro-blog");
  const inputBuscar = document.getElementById("input-buscar-blog");
  const alertaSinResultados = document.getElementById("mensaje-sin-resultados");

  let categoriaActual = "todos";
  let textoBusqueda = "";

  // Función principal para filtrar los artículos
  function aplicarFiltros() {
    let visibles = 0;

    tarjetas.forEach(function (tarjeta) {
      const categoriaTarjeta = tarjeta.getAttribute("data-categoria");
      const titulo = tarjeta.querySelector(".card-title").textContent.toLowerCase();
      const descripcion = tarjeta.querySelector(".card-text").textContent.toLowerCase();

      const coincideCategoria = (categoriaActual === "todos" || categoriaTarjeta === categoriaActual);
      const coincideTexto = titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);

      if (coincideCategoria && coincideTexto) {
        tarjeta.classList.remove("d-none");
        visibles++;
      } else {
        tarjeta.classList.add("d-none");
      }
    });

    // Mostrar u ocultar mensaje de "Sin resultados"
    if (visibles === 0) {
      alertaSinResultados.classList.remove("d-none");
    } else {
      alertaSinResultados.classList.add("d-none");
    }
  }

  // Evento para botones de categoría
  botonesFiltro.forEach(function (btn) {
    btn.addEventListener("click", function () {
      botonesFiltro.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      categoriaActual = this.getAttribute("data-categoria");
      aplicarFiltros();
    });
  });

  // Evento para entrada de texto en tiempo real
  if (inputBuscar) {
    inputBuscar.addEventListener("input", function (e) {
      textoBusqueda = e.target.value.toLowerCase().trim();
      aplicarFiltros();
    });
  }

  // Evento para abrir Modal de Lectura
  const botonesLeer = document.querySelectorAll(".btn-leer-articulo");
  const modalElem = document.getElementById("modalLecturaBlog");

  if (botonesLeer.length > 0 && modalElem) {
    const modalBootstrap = new bootstrap.Modal(modalElem);

    botonesLeer.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const titulo = this.getAttribute("data-titulo");
        const autor = this.getAttribute("data-autor");
        const fecha = this.getAttribute("data-fecha");
        const contenido = this.getAttribute("data-contenido");

        document.getElementById("modalLecturaBlogLabel").textContent = titulo;
        document.getElementById("modalBlogMeta").textContent = `Por ${autor} | ${fecha}`;
        document.getElementById("modalBlogCuerpo").textContent = contenido;

        modalBootstrap.show();
      });
    });
  }
}



// --------------------------------------------------------------------------
// Lógica Exclusiva para la vista Contacto (Validación de Formulario)
// --------------------------------------------------------------------------

function inicializarFormularioContacto() {
  const form = document.getElementById("formulario-contacto");
  if (!form) return; // Cláusula de guardia si no estamos en contacto.html

  const inputNombre = document.getElementById("contacto-nombre");
  const inputEmail = document.getElementById("contacto-email");
  const inputTelefono = document.getElementById("contacto-telefono");
  const selectMotivo = document.getElementById("contacto-motivo");
  const inputMensaje = document.getElementById("contacto-mensaje");
  const checkTerminos = document.getElementById("contacto-terminos");
  const alerta = document.getElementById("alerta-contacto");

  // Regex para validación de Email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Regex opcional para teléfono chileno (ej: +56912345678 o 912345678)
  const regexTelefono = /^(\+?56)?(\s?)(9)(\s?)[0-9]{8}$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let esValido = true;

    // 1. Validar Nombre
    if (inputNombre.value.trim().length < 3) {
      marcarInvalido(inputNombre);
      esValido = false;
    } else {
      marcarValido(inputNombre);
    }

    // 2. Validar Email
    if (!regexEmail.test(inputEmail.value.trim())) {
      marcarInvalido(inputEmail);
      esValido = false;
    } else {
      marcarValido(inputEmail);
    }

    // 3. Validar Teléfono (Opcional, pero si se escribe debe ser válido)
    if (inputTelefono.value.trim() !== "" && !regexTelefono.test(inputTelefono.value.trim())) {
      marcarInvalido(inputTelefono);
      esValido = false;
    } else if (inputTelefono.value.trim() !== "") {
      marcarValido(inputTelefono);
    } else {
      limpiarEstado(inputTelefono);
    }

    // 4. Validar Motivo
    if (selectMotivo.value === "") {
      marcarInvalido(selectMotivo);
      esValido = false;
    } else {
      marcarValido(selectMotivo);
    }

    // 5. Validar Mensaje
    if (inputMensaje.value.trim().length < 10) {
      marcarInvalido(inputMensaje);
      esValido = false;
    } else {
      marcarValido(inputMensaje);
    }

    // 6. Validar Términos
    if (!checkTerminos.checked) {
      marcarInvalido(checkTerminos);
      esValido = false;
    } else {
      marcarValido(checkTerminos);
    }

    // Procesar Resultado
    if (esValido) {
      alerta.className = "alert alert-success mt-3 d-block";
      alerta.innerHTML = "<strong>¡Mensaje enviado con éxito!</strong> Tu consulta fue recibida por nuestro equipo técnico. Te responderemos a la brevedad.";
      form.reset();
      
      // Limpiar clases visuales de validación
      [inputNombre, inputEmail, inputTelefono, selectMotivo, inputMensaje, checkTerminos].forEach(limpiarEstado);

      // Ocultar alerta después de 6 segundos
      setTimeout(() => {
        alerta.className = "alert d-none";
      }, 6000);
    } else {
      alerta.className = "alert alert-danger mt-3 d-block";
      alerta.innerHTML = "<strong>Por favor corrige los campos indicados en rojo</strong> antes de enviar el formulario.";
    }
  });

  // Funciones auxiliares de marcado
  function marcarInvalido(elemento) {
    elemento.classList.add("is-invalid");
    elemento.classList.remove("is-valid");
  }

  function marcarValido(elemento) {
    elemento.classList.remove("is-invalid");
    elemento.classList.add("is-valid");
  }

  function limpiarEstado(elemento) {
    elemento.classList.remove("is-invalid", "is-valid");
  }
}

// --------------------------------------------------------------------------
// INICIALIZACIÓN GENERAL UNIFICADA (Ciclo de Vida Central)
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // 1. Componentes globales de navegación y cabecera
  actualizarNavegacionActiva();
  actualizarMenuSesion();
  sincronizarContadorCarrito();

  // 2. Módulos específicos por vista con guardas seguras
  if (typeof inicializarBienvenidaHero === "function") inicializarBienvenidaHero();
  if (typeof inicializarLogin === "function") inicializarLogin();
  if (typeof inicializarMapaTienda === "function") inicializarMapaTienda();
  if (typeof inicializarContadoresNosotros === "function") inicializarContadoresNosotros();
  if (typeof inicializarBlogs === "function") inicializarBlogs();
  if (typeof inicializarFormularioContacto === "function") inicializarFormularioContacto();
});