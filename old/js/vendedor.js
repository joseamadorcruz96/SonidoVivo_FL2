// 1. Proteger la ruta (Solo vendedores)
const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

if (!usuarioActivo || usuarioActivo.rol !== 'vendedor') {
    alert("Acceso denegado. Debes iniciar sesión como vendedor.");
    window.location.href = "login.html"; // Expulsa a quien no sea vendedor
}

// 2. Datos simulados (Por si tu compañero aún no los sube al localStorage)
let pedidos = JSON.parse(localStorage.getItem('pedidosSistema')) || [
    { id: 101, cliente: "María Pérez", total: 129990, estado: "Pendiente" },
    { id: 102, cliente: "Carlos Gómez", total: 249990, estado: "Enviado" }
];

let inventario = JSON.parse(localStorage.getItem('inventarioSistema')) || [
    { codigo: "GA001", nombre: "Guitarra Acústica Folk Yamaha", stock: 8 },
    { codigo: "GE001", nombre: "Guitarra Eléctrica Squier", stock: 5 }
];

// 3. Renderizar Pedidos
function cargarPedidos() {
    const tbody = document.getElementById('tabla-pedidos');
    tbody.innerHTML = '';
    
    pedidos.forEach((pedido, index) => {
        tbody.innerHTML += `
            <tr>
                <td>#${pedido.id}</td>
                <td>${pedido.cliente}</td>
                <td>$${pedido.total.toLocaleString('es-CL')}</td>
                <td>
                    <select class="form-select" onchange="actualizarEstadoPedido(${index}, this.value)">
                        <option value="Pendiente" ${pedido.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Enviado" ${pedido.estado === 'Enviado' ? 'selected' : ''}>Enviado</option>
                        <option value="Entregado" ${pedido.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                    </select>
                </td>
                <td><button class="btn btn-success btn-sm">Guardar</button></td>
            </tr>
        `;
    });
}

// 4. Renderizar Stock
function cargarStock() {
    const tbody = document.getElementById('tabla-stock');
    tbody.innerHTML = '';
    
    inventario.forEach((prod, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${prod.codigo}</td>
                <td>${prod.nombre}</td>
                <td>${prod.stock}</td>
                <td>
                    <div class="input-group">
                        <input type="number" class="form-control" id="stock-${index}" value="${prod.stock}" min="0">
                        <button class="btn btn-primary" onclick="actualizarStock(${index})">Actualizar</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// 5. Funciones de actualización (Guardan en localStorage)
function actualizarEstadoPedido(index, nuevoEstado) {
    pedidos[index].estado = nuevoEstado;
    localStorage.setItem('pedidosSistema', JSON.stringify(pedidos));
    alert("Estado del pedido actualizado.");
}

function actualizarStock(index) {
    const nuevoStock = document.getElementById(`stock-${index}`).value;
    inventario[index].stock = parseInt(nuevoStock);
    localStorage.setItem('inventarioSistema', JSON.stringify(inventario));
    alert("Stock actualizado correctamente.");
    cargarStock(); // Recarga la tabla para mostrar el nuevo valor
}

// Ejecutar al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarPedidos();
    cargarStock();
});