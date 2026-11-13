import { describe, it, expect, beforeEach } from 'vitest';
import { getOrdenes, guardarOrden } from '../../src/services/db';

describe('Pruebas unitarias en db.js (ordenes temporales)', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('Debe retornar un arreglo vacío cuando no hay órdenes en localStorage', () => {
        expect(getOrdenes()).toEqual([]);
    });

    it('Debe guardar una nueva orden asignando ID, número y código de orden', () => {
        const nueva = {
            cliente: { nombre: 'Juan', email: 'juan@gmail.com' },
            total: 150000,
            items: [{ codigo: 'GA001', cantidad: 1 }],
        };

        const guardada = guardarOrden(nueva);

        expect(guardada.id).toBeDefined();
        expect(guardada.numeroOrden).toMatch(/^#/);
        expect(guardada.codigoOrden).toMatch(/^ORDER-/);
        expect(guardada.cliente.nombre).toBe('Juan');

        const ordenesEnStorage = getOrdenes();
        expect(ordenesEnStorage).toHaveLength(1);
        expect(ordenesEnStorage[0].id).toBe(guardada.id);
    });
});
