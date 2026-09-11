// ==========================================================================
// SONIDO VIVO - JavaScript Principal
// Asignatura: Desarrollo Full Stack II (DSY1104)
// Referencia pedagógica: Semana 4 (Manipulación elemental del DOM)
// ==========================================================================

console.log("Sonido Vivo - Frontend iniciado correctamente");

// --------------------------------------------------------------------------
// RF-02: Contador Dinámico de Carrito en la Barra de Navegación
// --------------------------------------------------------------------------
const contadorCarrito = document.getElementById("contador-carrito");

function sincronizarContadorCarrito() {
  if (!contadorCarrito) return;

  // Rescatar datos de carrito en LocalStorage o arreglo vacío por defecto
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Calcular la suma de artículos
  let totalArticulos = 0;
  carrito.forEach(function (item) {
    totalArticulos = totalArticulos + (item.cantidad || 1);
  });

  // Actualizar el contenido del badge en el DOM
  contadorCarrito.textContent = totalArticulos;
}

// --------------------------------------------------------------------------
// RF-04: Bienvenida Interactiva en la Sección Hero (Semana 4)
// --------------------------------------------------------------------------
function inicializarBienvenidaHero() {
  const botonBienvenida = document.getElementById("boton-bienvenida");
  const mensajeBienvenida = document.getElementById("mensaje-bienvenida");

  if (!botonBienvenida || !mensajeBienvenida) return;

  botonBienvenida.addEventListener("click", function () {
    // 1. Asignar el texto del mensaje destacando la historia de la tienda
    mensajeBienvenida.textContent =
      "¡Bienvenidos a Sonido Vivo! Más de 11 años siendo el punto de encuentro de músicos en Viña del Mar. Ofrecemos instrumentos de alta calidad, amplificación profesional y servicio integral de luthería y calibración. ¡Esperamos que disfrutes tu visita!";

    // 2. Aplicar clases de estilo y visibilidad (remover d-none y agregar alert-bienvenida)
    mensajeBienvenida.className = "alert alert-bienvenida text-start";

    // 3. Modificar texto y estilo del botón (patrón pedagógico Semana 4)
    botonBienvenida.textContent = "Bienvenida mostrada";
    botonBienvenida.classList.add("btn-bienvenida-mostrada");
  });
}

// Inicializar funciones al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  sincronizarContadorCarrito();
  inicializarBienvenidaHero();
  inicializarLogin();
});

// --------------------------------------------------------------------------
// Lógica de Inicio de Sesión (Simulación para Prototipo)
// --------------------------------------------------------------------------
function inicializarLogin() {
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que la página se recargue

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Ocultar mensaje de error si estaba visible
    loginError.classList.add("d-none");

    // Simulación de Roles (Según documento de requerimientos)
    if (email === "admin@sonidovivo.cl" && password === "admin123") {
      alert("Autenticación exitosa. Bienvenido Administrador.");
      window.location.href = "admin/index.html"; //SIN NADA DE MOMENTO

    } else if (email === "vendedor@sonidovivo.cl" && password === "ventas123") {
      alert("Autenticación exitosa. Bienvenido Vendedor.");
      window.location.href = "index.html"; //CAMBIARLO A UN PROXIMO PANEL DE VENTAS

    } else if (email === "cliente@gmail.com" && password === "cliente123") {
      alert("Autenticación exitosa. Bienvenido Cliente.");
      window.location.href = "index.html"; 

    } else {
      // Mostrar error si no coincide ninguna
      loginError.classList.remove("d-none");
    }
  });
}

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
