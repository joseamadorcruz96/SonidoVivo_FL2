// 1. Proteger la ruta (Solo clientes)
const usuarioActivo = (window.DB && DB.usuarios && typeof DB.usuarios.obtenerSesion === "function" ? DB.usuarios.obtenerSesion() : null)
    || JSON.parse(localStorage.getItem('usuarioActivo') || "null");

if (!usuarioActivo || (usuarioActivo.rol !== 'cliente' && usuarioActivo.rol !== 'Cliente')) {
    alert("Acceso denegado. Debes iniciar sesión como cliente.");
    window.location.href = "login.html";
}

// 2. Cargar Carrito
function cargarCarrito() {
    const carrito = (window.Carrito && typeof Carrito.obtener === "function")
        ? Carrito.obtener()
        : (window.DB && DB.carrito ? DB.carrito.obtener() : (JSON.parse(localStorage.getItem('carrito') || "[]")));
        
    const lista = document.getElementById('lista-carrito');
    if (!lista) return;

    let total = 0;
    lista.innerHTML = '';
    
    if (carrito.length === 0) {
        lista.innerHTML = '<li class="list-group-item bg-body text-secondary border-secondary">Tu carrito está vacío.</li>';
    } else {
        carrito.forEach(prod => {
            const cant = prod.cantidad || 1;
            const subtotal = prod.subtotal || (prod.precio * cant);
            total += subtotal;
            lista.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center bg-body text-light border-secondary">
                <div>
                    <h6 class="my-0">${prod.nombre}</h6>
                    <small class="text-secondary">Cant: ${cant}</small>
                </div>
                <strong>$${subtotal.toLocaleString('es-CL')}</strong>
            </li>`;
        });
    }
    
    const totalEl = document.getElementById('total-carrito');
    if (totalEl) totalEl.innerText = total.toLocaleString('es-CL');
}

// 3. Realizar Pedido
function realizarPedido() {
    if (window.Carrito && typeof Carrito.finalizarCompra === "function") {
        Carrito.finalizarCompra();
        cargarCarrito();
        cargarHistorial();
        return;
    }

    let carrito = (window.DB && DB.carrito) ? DB.carrito.obtener() : (JSON.parse(localStorage.getItem('carrito') || "[]"));
    if (carrito.length === 0) {
        alert("No hay productos en tu carrito.");
        return;
    }

    if (window.DB && DB.ordenes) {
        DB.ordenes.crear({
            clienteNombre: usuarioActivo.nombre,
            clienteEmail: usuarioActivo.email || "cliente@sonidovivo.cl",
            items: carrito,
            total: (window.DB && DB.carrito) ? DB.carrito.obtenerTotal() : 0
        });
    }

    alert("¡Pedido realizado con éxito!");
    cargarCarrito();
    cargarHistorial();
}

// 4. Cargar Historial (Filtrado)
function cargarHistorial() {
    const tbody = document.getElementById('tabla-historial');
    if (!tbody) return;

    let misPedidos = [];

    // Priorizar ordenes de DB si existen
    if (window.DB && DB.ordenes && typeof DB.ordenes.obtenerTodas === "function") {
        const ordenesDB = DB.ordenes.obtenerTodas();
        misPedidos = ordenesDB.filter(p => 
            (p.clienteEmail && usuarioActivo.email && p.clienteEmail.toLowerCase() === usuarioActivo.email.toLowerCase()) ||
            (p.clienteNombre && p.clienteNombre.toLowerCase().includes(usuarioActivo.nombre.toLowerCase()))
        );
    }

    // Fallback con pedidosSistema
    if (misPedidos.length === 0) {
        const pedidos = JSON.parse(localStorage.getItem('pedidosSistema') || "[]");
        misPedidos = pedidos.filter(p => p.cliente === usuarioActivo.nombre);
    }

    tbody.innerHTML = '';

    if (misPedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-secondary">Aún no tienes pedidos registrados.</td></tr>';
        return;
    }

    misPedidos.forEach(pedido => {
        tbody.innerHTML += `
            <tr>
                <td><strong>#${pedido.id}</strong></td>
                <td class="text-gold">$${Number(pedido.total).toLocaleString('es-CL')}</td>
                <td><span class="badge bg-success">${pedido.estado || 'En preparación'}</span></td>
            </tr>
        `;
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    cargarHistorial();
});