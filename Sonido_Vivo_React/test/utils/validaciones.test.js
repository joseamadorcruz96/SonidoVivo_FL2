import { describe, it, expect } from 'vitest';
import { validarEmail, validarPassword, validarRun, validarTexto } from '../../src/utils/validaciones';

// Pruebas unitarias para utilidades de validación de formularios
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

        it('Debe aceptar correos con dominio @profesor.duoc.cl y @gmail.com', () => {
            expect(validarEmail('docente@profesor.duoc.cl')).toBe('');
            expect(validarEmail('cliente@gmail.com')).toBe('');
        });

        it('Debe procesar correos ingresados en mayúsculas', () => {
            const error = validarEmail('ESTUDIANTE@DUOC.CL');
            expect(error).toBe('');
        });

        it('Debe rechazar correos con más de 100 caracteres', () => {
            const correoLargo = `${'a'.repeat(95)}@duoc.cl`;
            const error = validarEmail(correoLargo);
            expect(error).toBe('El correo no puede superar los 100 caracteres.');
        });
    });

    describe('validarPassword', () => {
        it('Debe rechazar contraseñas vacías', () => {
            const error = validarPassword('');
            expect(error).toBe('La contraseña es obligatoria.');
        });

        it('Debe rechazar contraseñas con menos de 4 caracteres', () => {
            const error = validarPassword('123');
            expect(error).toBe('La contraseña debe tener entre 4 y 10 caracteres.');
        });

        it('Debe rechazar contraseñas con más de 10 caracteres', () => {
            const error = validarPassword('passwordMuyLargo123');
            expect(error).toBe('La contraseña debe tener entre 4 y 10 caracteres.');
        });

        it('Debe aceptar contraseñas válidas entre 4 y 10 caracteres', () => {
            expect(validarPassword('pass123')).toBe('');
            expect(validarPassword('1234')).toBe('');
            expect(validarPassword('1234567890')).toBe('');
        });
    });

    describe('validarRun', () => {
        it('Debe rechazar RUN vacío', () => {
            const error = validarRun('');
            expect(error).toBe('El RUN es obligatorio.');
        });

        it('Debe rechazar RUN con puntos o guión', () => {
            const error = validarRun('19.011.022-K');
            expect(error).toBe('Ingresa el RUN sin puntos ni guión (Ej: 19011022K).');
        });

        it('Debe rechazar RUN con longitud fuera del rango de 7 a 9 caracteres', () => {
            expect(validarRun('12345')).toBe('El RUN debe tener entre 7 y 9 caracteres.');
            expect(validarRun('12345678901')).toBe('El RUN debe tener entre 7 y 9 caracteres.');
        });

        it('Debe rechazar RUN con caracteres alfanuméricos inválidos', () => {
            const error = validarRun('19A11022K');
            expect(error).toBe('Formato de RUN inválido (solo dígitos y K final).');
        });

        it('Debe aceptar RUN en formato correcto (sin puntos/guión) con dígito o K', () => {
            expect(validarRun('19011022K')).toBe('');
            expect(validarRun('185554443')).toBe('');
        });
    });

    describe('validarTexto', () => {
        it('Debe rechazar texto vacío cuando es obligatorio', () => {
            const error = validarTexto('', 'El nombre', 50, 2);
            expect(error).toBe('El nombre es obligatorio.');
        });

        it('Debe rechazar texto con longitud menor a la mínima', () => {
            const error = validarTexto('A', 'El nombre', 50, 2);
            expect(error).toBe('El nombre debe tener al menos 2 caracteres.');
        });

        it('Debe rechazar texto que supere el largo máximo', () => {
            const error = validarTexto('Texto muy extenso'.repeat(5), 'La descripción', 20, 1);
            expect(error).toBe('La descripción no puede superar los 20 caracteres.');
        });

        it('Debe aceptar texto válido dentro del rango establecido', () => {
            const error = validarTexto('Fender Telecaster', 'El nombre', 50, 2);
            expect(error).toBe('');
        });
    });

});
