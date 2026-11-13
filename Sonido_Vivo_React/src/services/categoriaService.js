import sVivoApi from './api';

// Lista todas las categorias del catalogo
export async function listarCategorias() {
    const { data } = await sVivoApi.get('/api/v1/categorias');
    return Array.isArray(data) ? data : [];
}

// Crea una nueva categoria (ADMIN)
export async function crearCategoria(payload) {
    const { data } = await sVivoApi.post('/api/v1/categorias', {
        nombre: payload.nombre.trim(),
        descripcion: (payload.descripcion || '').trim(),
    });
    return data;
}

// Actualiza una categoria existente (ADMIN)
export async function actualizarCategoria(id, payload) {
    const { data } = await sVivoApi.put(`/api/v1/categorias/${id}`, {
        nombre: payload.nombre.trim(),
        descripcion: (payload.descripcion || '').trim(),
    });
    return data;
}

// Elimina una categoria sin productos asociados (ADMIN)
export async function eliminarCategoriaApi(id) {
    await sVivoApi.delete(`/api/v1/categorias/${id}`);
}

