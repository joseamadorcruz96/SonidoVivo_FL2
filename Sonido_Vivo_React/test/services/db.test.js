import { describe, it, expect, beforeEach } from 'vitest';
import {
    getUsuarios,
    registrarUsuario,
    loginUsuario,
    logoutUsuario,
    getUsuarioLogueado,
    usuariosDb,
} from '../../src/services/db';

// Pruebas unitarias para el servicio de persistencia y autenticación
describe('Pruebas unitarias en db.js', () => {

    beforeEach(() => {
        localStorage.clear();
        // Cada prueba recibe una copia guardada; registrar no modifica usuariosDb.
        localStorage.setItem('sv_usuarios', JSON.stringify(usuariosDb));
    });

    describe('getUsuarios', () => {
        it('Debe inicializar y retornar usuariosDb cuando localStorage está vacío', () => {
            localStorage.clear();
            const usuarios = getUsuarios();
            expect(usuarios).toHaveLength(usuariosDb.length);
            expect(localStorage.getItem('sv_usuarios')).toBeTruthy();
        });

        it('Debe retornar los usuarios guardados previamente en localStorage', () => {
            const mockUsuarios = [{ id: 99, email: 'guardado@duoc.cl', password: '123', rol: 'cliente' }];
            localStorage.setItem('sv_usuarios', JSON.stringify(mockUsuarios));

            const usuarios = getUsuarios();
            expect(usuarios).toHaveLength(1);
            expect(usuarios[0].email).toBe('guardado@duoc.cl');
        });
    });

    describe('registrarUsuario', () => {
        it('Debe registrar un nuevo usuario con ID generado y rol cliente por defecto', () => {
            const nuevo = {
                nombre: 'Carlos',
                apellidos: 'Santana',
                email: 'carlos@duoc.cl',
                password: 'guitar123',
            };

            const registrado = registrarUsuario(nuevo);

            expect(registrado.id).toBeDefined();
            expect(registrado.rol).toBe('cliente');
            expect(registrado.email).toBe('carlos@duoc.cl');

            const listaActualizada = JSON.parse(localStorage.getItem('sv_usuarios'));
            expect(listaActualizada.some((u) => u.email === 'carlos@duoc.cl')).toBe(true);
        });

        it('Debe lanzar una excepción al intentar registrar un correo ya existente', () => {
            const duplicado = {
                nombre: 'Otro Pedro',
                email: 'cliente@gmail.com',
                password: '123',
            };

            expect(() => registrarUsuario(duplicado)).toThrow(
                'Ya existe una cuenta registrada con este correo electrónico.'
            );
        });
    });

    describe('loginUsuario y logoutUsuario', () => {
        it('Debe iniciar sesión y guardar la sesión simulada si las credenciales coinciden', () => {
            const usuario = loginUsuario('admin@gmail.com', '123');

            expect(usuario).not.toBeNull();
            expect(usuario.rol).toBe('admin');
            expect(JSON.parse(localStorage.getItem('sv_sesion_activa')).email).toBe('admin@gmail.com');
        });

        it('Debe retornar null si la contraseña es incorrecta o el usuario no existe', () => {
            const passwordErroneo = loginUsuario('admin@gmail.com', 'claveIncorrecta');
            const noExiste = loginUsuario('fantasma@duoc.cl', '123');

            expect(passwordErroneo).toBeNull();
            expect(noExiste).toBeNull();
        });

        it('Debe limpiar la sesión activa al cerrar sesión', () => {
            loginUsuario('vendedor@gmail.com', '123');
            expect(getUsuarioLogueado()).not.toBeNull();

            logoutUsuario();
            expect(getUsuarioLogueado()).toBeNull();
            expect(localStorage.getItem('sv_sesion_activa')).toBeNull();
        });
    });

});
