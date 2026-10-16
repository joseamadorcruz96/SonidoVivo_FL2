import { describe, it, expect } from 'vitest';
import { validarEmail, validarPassword, validarRun } from './validaciones';

describe('Pruebas unitarias en validaciones.js', () => {

    describe('validarEmail', () => {
        it('Debe retornar un mensaje de error si el email está vacío', () => {
            const error = validarEmail('');
            expect(error).toBe('El correo electrónico es obligatorio.');
        });

        it('Debe rechazar correos con dominios no permitidos (ej: @hotmail.com)', () => {
            const error = validarEmail('usuario@hotmail.com');
            expect(error).toBe('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
        });

        it('Debe aceptar correos institucionales válidos (@duoc.cl)', () => {
            const error = validarEmail('alumno@duoc.cl');
            expect(error).toBe('');
        });
    });

    describe('validarPassword', () => {
        it('Debe rechazar contraseñas con menos de 4 caracteres', () => {
            const error = validarPassword('123');
            expect(error).toBe('La contraseña debe tener entre 4 y 10 caracteres.');
        });

        it('Debe aceptar contraseñas válidas entre 4 y 10 caracteres', () => {
            const error = validarPassword('pass123');
            expect(error).toBe('');
        });
    });

    describe('validarRun', () => {
        it('Debe rechazar RUN con puntos o guión', () => {
            const error = validarRun('19.011.022-K');
            expect(error).toBe('Ingresa el RUN sin puntos ni guión (Ej: 19011022K).');
        });

        it('Debe aceptar RUN en formato correcto (sin puntos/guión)', () => {
            const error = validarRun('19011022K');
            expect(error).toBe('');
        });
    });

});