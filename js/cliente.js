// 1. Proteger la ruta (Solo clientes)
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

if (!usuarioActivo || usuarioActivo.rol !== 'cliente') {
    alert("Acceso denegado. Debes iniciar sesión como cliente.");
    window.location.href = "login.html";
}

// 2. Cargar Carrito
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const lista = document.getElementById('lista-carrito');
    let total = 0;
    
    lista.innerHTML = '';
    
    if (carrito.length === 0) {
        lista.innerHTML = '<li class="list-group-item">Tu carrito está vacío.</li>';
    } else {
        carrito.forEach(prod => {
            lista.innerHTML += `<li class="list-group-item d-flex justify-content-between">
                <span>${prod.nombre}</span>
                <strong>$${prod.precio.toLocaleString('es-CL')}</strong>
            </li>`;
            total += prod.precio;
        });
    }
    
    document.getElementById('total-carrito').innerText = total.toLocaleString('es-CL');
}

// 3. Realizar Pedido
function realizarPedido() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert("No hay productos en tu carrito.");
        return;
    }

    let pedidos = JSON.parse(localStorage.getItem('pedidosSistema')) || [];
    let total = carrito.reduce((sum, item) => sum + item.precio, 0);
    
    // Crear el nuevo pedido vinculado al cliente activo
    const nuevoPedido = {
        id: Date.now(), // ID único
        cliente: usuarioActivo.nombre,
        total: total,
        estado: "Pendiente"
    };

    pedidos.push(nuevoPedido);
    localStorage.setItem('pedidosSistema', JSON.stringify(pedidos));
    
    // Vaciar carrito
    localStorage.removeItem('carrito');
    alert("¡Pedido realizado con éxito!");
    
    cargarCarrito();
    cargarHistorial();
}

// 4. Cargar Historial (Filtrado)
function cargarHistorial() {
    const pedidos = JSON.parse(localStorage.getItem('pedidosSistema')) || [];
    const tbody = document.getElementById('tabla-historial');
    tbody.innerHTML = '';
    
    // El secreto: Filtramos para que solo coincida con el nombre del usuario activo
    const misPedidos = pedidos.filter(p => p.cliente === usuarioActivo.nombre);

    if (misPedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Aún no tienes pedidos.</td></tr>';
        return;
    }

    misPedidos.forEach(pedido => {
        tbody.innerHTML += `
            <tr>
                <td>#${pedido.id}</td>
                <td>$${pedido.total.toLocaleString('es-CL')}</td>
                <td><span class="badge bg-secondary">${pedido.estado}</span></td>
            </tr>
        `;
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    cargarHistorial();
});