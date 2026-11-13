import { describe, it, expect, vi, beforeEach } from 'vitest';
import sVivoApi from '../../src/services/api';
import {
    crearBoleta,
    listarBoletas,
    listarBoletasPorUsuario,
} from '../../src/services/boletaService';

describe('boletaService — Emision y consulta de boletas contra ms-ventas-boletas', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('crearBoleta normaliza cliente, direccion e items y llama POST /api/v1/boletas', async () => {
        const postSpy = vi.spyOn(sVivoApi, 'post').mockResolvedValue({
            data: { id: 1, numeroOrden: '#20260001', total: 149990, estado: 'COMPLETADA' },
        });

        const boleta = await crearBoleta({
            usuarioId: 4,
            cliente: { nombre: ' Ana ', apellidos: ' Lopez ', email: ' ana@duoc.cl ' },
            direccion: {
                calle: ' Av. Matta 100 ',
                departamento: ' ',
                region: 'Metropolitana',
                comuna: 'Santiago',
                indicaciones: '',
            },
            items: [{ codigo: 'GA001', cantidad: '2' }],
        });

        expect(postSpy).toHaveBeenCalledWith('/api/v1/boletas', {
            usuarioId: 4,
            cliente: { nombre: 'Ana', apellidos: 'Lopez', email: 'ana@duoc.cl' },
            direccion: {
                calle: 'Av. Matta 100',
                departamento: null,
                region: 'Metropolitana',
                comuna: 'Santiago',
                indicaciones: null,
            },
            items: [{ codigo: 'GA001', cantidad: 2 }],
        });
        expect(boleta.numeroOrden).toBe('#20260001');
    });

    it('listarBoletas llama GET /api/v1/boletas', async () => {
        const getSpy = vi.spyOn(sVivoApi, 'get').mockResolvedValue({
            data: [{ id: 1, numeroOrden: '#20260001' }],
        });

        const lista = await listarBoletas();

        expect(getSpy).toHaveBeenCalledWith('/api/v1/boletas');
        expect(lista).toHaveLength(1);
    });

    it('listarBoletasPorUsuario llama GET /api/v1/boletas/usuario/{usuarioId}', async () => {
        const getSpy = vi.spyOn(sVivoApi, 'get').mockResolvedValue({
            data: [{ id: 2, numeroOrden: '#20260002' }],
        });

        const lista = await listarBoletasPorUsuario(7);

        expect(getSpy).toHaveBeenCalledWith('/api/v1/boletas/usuario/7');
        expect(lista).toHaveLength(1);
    });
});

