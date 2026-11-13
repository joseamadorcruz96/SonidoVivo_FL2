import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../src/Context/AuthContext';
import { AdminUsuarios } from '../../src/pages/admin/AdminUsuarios';
import * as usuarioService from '../../src/services/usuarioService';

describe('AdminUsuarios — Gestion real contra ms-usuarios-auth', () => {
    const usuariosMock = [
        {
            idUsuario: 1,
            id: 1,
            run: '19011021K',
            nombre: 'Pedro',
            apellido: 'Cliente',
            apellidos: 'Cliente',
            correo: 'cliente@gmail.com',
            email: 'cliente@gmail.com',
            region: 'Metropolitana',
            comuna: 'Santiago',
            rol: 'CLIENTE',
        },
        {
            idUsuario: 3,
            id: 3,
            run: '172223334',
            nombre: 'Admin',
            apellido: 'Master',
            apellidos: 'Master',
            correo: 'admin@gmail.com',
            email: 'admin@gmail.com',
            region: 'Metropolitana',
            comuna: 'Las Condes',
            rol: 'ADMIN',
        },
    ];

    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        localStorage.setItem('sv_token', 'jwt-admin-test');
        localStorage.setItem('sv_usuario', JSON.stringify(usuariosMock[1]));
    });

    it('carga y filtra usuarios desde listarUsuarios()', async () => {
        vi.spyOn(usuarioService, 'listarUsuarios').mockResolvedValue(usuariosMock);
        const user = userEvent.setup();

        render(
            <AuthProvider>
                <AdminUsuarios />
            </AuthProvider>
        );

        expect(await screen.findByText('cliente@gmail.com')).toBeInTheDocument();

        const buscador = screen.getByPlaceholderText(/Buscar por nombre/i);
        await user.type(buscador, 'Pedro');

        expect(screen.queryByText('admin@gmail.com')).not.toBeInTheDocument();
        expect(screen.getByText('cliente@gmail.com')).toBeInTheDocument();
    });

    it('permite cambiar el rol de un usuario llamando PUT /rol', async () => {
        vi.spyOn(usuarioService, 'listarUsuarios').mockResolvedValue(usuariosMock);
        const actualizarSpy = vi.spyOn(usuarioService, 'actualizarRolUsuario').mockResolvedValue({
            ...usuariosMock[0],
            rol: 'VENDEDOR',
        });
        const user = userEvent.setup();

        render(
            <AuthProvider>
                <AdminUsuarios />
            </AuthProvider>
        );

        const selectRol = await screen.findByLabelText('Rol escritorio de cliente@gmail.com');
        await user.selectOptions(selectRol, 'VENDEDOR');

        await waitFor(() => {
            expect(actualizarSpy).toHaveBeenCalledWith(1, 'VENDEDOR');
        });
        expect(screen.getByText(/actualizado a VENDEDOR/i)).toBeInTheDocument();
    });

    it('permite eliminar un usuario externo y bloquea eliminar la cuenta propia', async () => {
        vi.spyOn(usuarioService, 'listarUsuarios').mockResolvedValue(usuariosMock);
        const eliminarSpy = vi.spyOn(usuarioService, 'eliminarUsuarioApi').mockResolvedValue();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        const user = userEvent.setup();

        render(
            <AuthProvider>
                <AdminUsuarios />
            </AuthProvider>
        );

        await screen.findByText('cliente@gmail.com');
        const botonesEliminar = screen.getAllByRole('button', { name: /Eliminar/i });

        // El admin conectado (ultimo registro) no puede borrarse a si mismo
        const botonPropio = botonesEliminar.find((btn) => btn.disabled);
        expect(botonPropio).toBeTruthy();

        const botonCliente = botonesEliminar.find((btn) => !btn.disabled);
        await user.click(botonCliente);

        await waitFor(() => {
            expect(eliminarSpy).toHaveBeenCalledWith(1);
        });
        expect(screen.queryByText('cliente@gmail.com')).not.toBeInTheDocument();
    });
});
