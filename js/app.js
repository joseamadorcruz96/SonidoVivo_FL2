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
});

