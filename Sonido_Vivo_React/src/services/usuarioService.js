import sVivoApi from './api';
import { normalizarRol, normalizarUsuario } from './authService';

// Lista todos los usuarios desde Spring Boot (requiere rol ADMIN)
export async function listarUsuarios() {
    const { data } = await sVivoApi.get('/api/v1/usuarios');
    return Array.isArray(data) ? data.map(normalizarUsuario) : [];
}

// Obtiene el detalle de un usuario por ID
export async function obtenerUsuarioPorId(idUsuario) {
    const { data } = await sVivoApi.get(`/api/v1/usuarios/${idUsuario}`);
    return normalizarUsuario(data);
}

// Actualiza el rol enviando exactamente el Enum Rol en mayusculas ({ rol })
export async function actualizarRolUsuario(idUsuario, nuevoRol) {
    const rolNormalizado = normalizarRol(nuevoRol);
    const { data } = await sVivoApi.put(`/api/v1/usuarios/${idUsuario}/rol`, {
        rol: rolNormalizado,
    });
    return normalizarUsuario(data);
}

// Elimina un usuario por ID (responde 204 No Content)
export async function eliminarUsuarioApi(idUsuario) {
    await sVivoApi.delete(`/api/v1/usuarios/${idUsuario}`);
}
