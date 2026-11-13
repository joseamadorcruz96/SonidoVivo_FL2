import sVivoApi from './api';

// Lista el catalogo completo desde ms-catalogo-inventario
export async function listarProductos() {
    const { data } = await sVivoApi.get('/api/v1/productos');
    return Array.isArray(data) ? data : [];
}

// Obtiene el detalle de un producto por su SKU
export async function obtenerProductoPorCodigo(codigo) {
    const { data } = await sVivoApi.get(`/api/v1/productos/codigo/${encodeURIComponent(codigo)}`);
    return data;
}

// Crea un nuevo producto (ADMIN)
export async function crearProducto(payload) {
    const { data } = await sVivoApi.post('/api/v1/productos', {
        codigo: payload.codigo.trim().toUpperCase(),
        nombre: payload.nombre.trim(),
        marca: (payload.marca || '').trim(),
        modelo: (payload.modelo || '').trim(),
        precio: Number(payload.precio),
        stock: Math.floor(Number(payload.stock)),
        stockCritico: Number(payload.stockCritico) || 2,
        descripcion: (payload.descripcion || '').trim(),
        imagen: (payload.imagen || '').trim(),
        destacado: Boolean(payload.destacado),
        categoriaId: Number(payload.categoriaId),
    });
    return data;
}

// Ajusta el stock en delta positivo o negativo (ADMIN o VENDEDOR)
export async function ajustarStockProducto(codigo, cantidadCambio) {
    const { data } = await sVivoApi.put(`/api/v1/productos/${encodeURIComponent(codigo)}/stock`, {
        cantidadCambio: Number(cantidadCambio),
    });
    return data;
}

// Elimina un producto con stock en cero (ADMIN)
export async function eliminarProductoApi(codigo) {
    await sVivoApi.delete(`/api/v1/productos/${encodeURIComponent(codigo)}`);
}

