import sVivoApi from './api';

// Emite una boleta real en ms-ventas-boletas y descuenta stock en inventario via OpenFeign
export async function crearBoleta(payload) {
    const { data } = await sVivoApi.post('/api/v1/boletas', {
        usuarioId: payload.usuarioId ?? null,
        cliente: {
            nombre: payload.cliente.nombre.trim(),
            apellidos: payload.cliente.apellidos.trim(),
            email: payload.cliente.email.trim(),
        },
        direccion: {
            calle: payload.direccion.calle.trim(),
            departamento: payload.direccion.departamento?.trim() || null,
            region: payload.direccion.region,
            comuna: payload.direccion.comuna,
            indicaciones: payload.direccion.indicaciones?.trim() || null,
        },
        items: payload.items.map((item) => ({
            codigo: item.codigo,
            cantidad: Number(item.cantidad),
        })),
    });
    return data;
}

// Lista todas las boletas registradas (ADMIN o VENDEDOR)
export async function listarBoletas() {
    const { data } = await sVivoApi.get('/api/v1/boletas');
    return Array.isArray(data) ? data : [];
}

// Obtiene el historial de boletas de un usuario especifico (ADMIN o propio CLIENTE)
export async function listarBoletasPorUsuario(usuarioId) {
    const { data } = await sVivoApi.get(`/api/v1/boletas/usuario/${usuarioId}`);
    return Array.isArray(data) ? data : [];
}

