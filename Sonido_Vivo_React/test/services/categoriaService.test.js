import { describe, it, expect, vi, beforeEach } from 'vitest';
import sVivoApi from '../../src/services/api';
import {
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoriaApi,
} from '../../src/services/categoriaService';

describe('categoriaService — CRUD de categorias contra ms-catalogo-inventario', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('listarCategorias llama GET /api/v1/categorias y devuelve arreglo', async () => {
        const getSpy = vi.spyOn(sVivoApi, 'get').mockResolvedValue({
            data: [{ id: 1, nombre: 'Guitarras', descripcion: 'Cuerdas pulsadas' }],
        });

        const categorias = await listarCategorias();

        expect(getSpy).toHaveBeenCalledWith('/api/v1/categorias');
        expect(categorias).toHaveLength(1);
        expect(categorias[0].nombre).toBe('Guitarras');
    });

    it('crearCategoria recorta espacios y llama POST /api/v1/categorias', async () => {
        const postSpy = vi.spyOn(sVivoApi, 'post').mockResolvedValue({
            data: { id: 2, nombre: 'Teclados', descripcion: 'Sintetizadores' },
        });

        const creada = await crearCategoria({ nombre: ' Teclados ', descripcion: ' Sintetizadores ' });

        expect(postSpy).toHaveBeenCalledWith('/api/v1/categorias', {
            nombre: 'Teclados',
            descripcion: 'Sintetizadores',
        });
        expect(creada.id).toBe(2);
    });

    it('actualizarCategoria llama PUT /api/v1/categorias/{id}', async () => {
        const putSpy = vi.spyOn(sVivoApi, 'put').mockResolvedValue({
            data: { id: 2, nombre: 'Pianos', descripcion: 'Digitales' },
        });

        const actualizada = await actualizarCategoria(2, { nombre: 'Pianos', descripcion: 'Digitales' });

        expect(putSpy).toHaveBeenCalledWith('/api/v1/categorias/2', {
            nombre: 'Pianos',
            descripcion: 'Digitales',
        });
        expect(actualizada.nombre).toBe('Pianos');
    });

    it('eliminarCategoriaApi llama DELETE /api/v1/categorias/{id}', async () => {
        const deleteSpy = vi.spyOn(sVivoApi, 'delete').mockResolvedValue({ status: 204 });

        await eliminarCategoriaApi(3);

        expect(deleteSpy).toHaveBeenCalledWith('/api/v1/categorias/3');
    });
});

