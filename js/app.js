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

// Inicializar contador al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  sincronizarContadorCarrito();
});
