import { describe, it, expect, vi, beforeEach } from 'vitest';
import sVivoApi from '../../src/services/api';
import {
    listarUsuarios,
    obtenerUsuarioPorId,
    actualizarRolUsuario,
    eliminarUsuarioApi,
} from '../../src/services/usuarioService';

describe('usuarioService — CRUD de usuarios contra ms-usuarios-auth', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('listarUsuarios llama GET /api/v1/usuarios y normaliza cada usuario', async () => {
        const getSpy = vi.spyOn(sVivoApi, 'get').mockResolvedValue({
            data: [
                {
                    idUsuario: 1,
                    run: '19011021K',
                    nombre: 'Pedro',
                    apellido: 'Cliente',
                    correo: 'cliente@gmail.com',
                    rol: 'CLIENTE',
                },
            ],
        });

        const usuarios = await listarUsuarios();

        expect(getSpy).toHaveBeenCalledWith('/api/v1/usuarios');
        expect(usuarios).toHaveLength(1);
        expect(usuarios[0].idUsuario).toBe(1);
        expect(usuarios[0].rol).toBe('CLIENTE');
        expect(usuarios[0].email).toBe('cliente@gmail.com');
    });

    it('obtenerUsuarioPorId llama GET /api/v1/usuarios/{id}', async () => {
        const getSpy = vi.spyOn(sVivoApi, 'get').mockResolvedValue({
            data: { idUsuario: 2, nombre: 'Ana', apellido: 'Vendedora', correo: 'v@g.cl', rol: 'VENDEDOR' },
        });

        const usuario = await obtenerUsuarioPorId(2);

        expect(getSpy).toHaveBeenCalledWith('/api/v1/usuarios/2');
        expect(usuario.rol).toBe('VENDEDOR');
    });

    it('actualizarRolUsuario envia Enum Rol en mayusculas a PUT /api/v1/usuarios/{id}/rol', async () => {
        const putSpy = vi.spyOn(sVivoApi, 'put').mockResolvedValue({
            data: { idUsuario: 1, nombre: 'Pedro', apellido: 'Cliente', correo: 'p@g.cl', rol: 'VENDEDOR' },
        });

        const actualizado = await actualizarRolUsuario(1, 'vendedor');

        expect(putSpy).toHaveBeenCalledWith('/api/v1/usuarios/1/rol', { rol: 'VENDEDOR' });
        expect(actualizado.rol).toBe('VENDEDOR');
    });

    it('eliminarUsuarioApi llama DELETE /api/v1/usuarios/{id}', async () => {
        const deleteSpy = vi.spyOn(sVivoApi, 'delete').mockResolvedValue({ status: 204 });

        await eliminarUsuarioApi(5);

        expect(deleteSpy).toHaveBeenCalledWith('/api/v1/usuarios/5');
    });
});
