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

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let totalArticulos = 0;
  carrito.forEach(function (item) {
    totalArticulos = totalArticulos + (item.cantidad || 1);
  });
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
    mensajeBienvenida.textContent =
      "¡Bienvenidos a Sonido Vivo! Más de 11 años siendo el punto de encuentro de músicos en Viña del Mar. Ofrecemos instrumentos de alta calidad, amplificación profesional y servicio integral de luthería y calibración. ¡Esperamos que disfrutes tu visita!";
    mensajeBienvenida.className = "alert alert-bienvenida text-start";
    botonBienvenida.textContent = "Bienvenida mostrada";
    botonBienvenida.classList.add("btn-bienvenida-mostrada");
  });
}

// --------------------------------------------------------------------------
// Gestión Dinámica del Menú de Sesión
// --------------------------------------------------------------------------
function actualizarMenuSesion() {
    const menuSesion = document.getElementById('menu-sesion');
    if (!menuSesion) return; // Si no encuentra el contenedor, no hace nada

    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (usuarioActivo) {
        // Si hay sesión iniciada, mostramos panel y salir
        const rutaPanel = usuarioActivo.rol === 'vendedor' ? 'panel_vendedor.html' : 'panel_cliente.html';
        
        menuSesion.innerHTML = `
            <a href="${rutaPanel}" class="btn btn-outline-light btn-sm d-flex align-items-center" style="border-color: var(--color-gold); color: var(--color-gold);">
                Mi Panel (${usuarioActivo.nombre.split(' ')[0]})
            </a>
            <button onclick="cerrarSesion()" class="btn btn-danger btn-sm">Salir</button>
        `;
    } else {
        // Si no hay sesión, mostramos el botón Ingresar
        menuSesion.innerHTML = `
            <a href="login.html" class="btn-nav-login" style="background-color: var(--color-gold); color: #000; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                Ingresar
            </a>
        `;
    }
}

// Función global para cerrar sesión (puede llamarse desde el HTML)
window.cerrarSesion = function() {
    localStorage.removeItem('usuarioActivo');
    alert("Has cerrado sesión correctamente.");
    window.location.href = "index.html";
};

// --------------------------------------------------------------------------
// INICIALIZACIÓN GENERAL (Se llama a TODO aquí)
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  sincronizarContadorCarrito();
  inicializarBienvenidaHero();
  actualizarMenuSesion(); 
});