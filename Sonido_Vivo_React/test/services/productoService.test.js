import { describe, it, expect, vi, beforeEach } from 'vitest';
import sVivoApi from '../../src/services/api';
import {
    listarProductos,
    obtenerProductoPorCodigo,
    crearProducto,
    ajustarStockProducto,
    eliminarProductoApi,
} from '../../src/services/productoService';

describe('productoService — Catalogo e inventario contra ms-catalogo-inventario', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('listarProductos llama GET /api/v1/productos', async () => {
        const getSpy = vi.spyOn(sVivoApi, 'get').mockResolvedValue({
            data: [{ id: 1, codigo: 'GE001', nombre: 'Stratocaster', precio: 450000, stock: 4 }],
        });

        const productos = await listarProductos();

        expect(getSpy).toHaveBeenCalledWith('/api/v1/productos');
        expect(productos).toHaveLength(1);
        expect(productos[0].codigo).toBe('GE001');
    });

    it('obtenerProductoPorCodigo codifica el SKU y llama GET /api/v1/productos/codigo/{codigo}', async () => {
        const getSpy = vi.spyOn(sVivoApi, 'get').mockResolvedValue({
            data: { id: 1, codigo: 'GE/01', nombre: 'Stratocaster' },
        });

        const prod = await obtenerProductoPorCodigo('GE/01');

        expect(getSpy).toHaveBeenCalledWith('/api/v1/productos/codigo/GE%2F01');
        expect(prod.nombre).toBe('Stratocaster');
    });

    it('crearProducto normaliza tipos numericos y SKU en mayusculas', async () => {
        const postSpy = vi.spyOn(sVivoApi, 'post').mockResolvedValue({
            data: { id: 10, codigo: 'GE002', nombre: 'Telecaster' },
        });

        const creado = await crearProducto({
            codigo: ' ge002 ',
            nombre: ' Telecaster ',
            marca: ' Fender ',
            modelo: ' Player ',
            precio: '599990',
            stock: '5',
            stockCritico: '',
            descripcion: 'Guitarra electrica',
            imagen: '',
            destacado: true,
            categoriaId: '2',
        });

        expect(postSpy).toHaveBeenCalledWith('/api/v1/productos', {
            codigo: 'GE002',
            nombre: 'Telecaster',
            marca: 'Fender',
            modelo: 'Player',
            precio: 599990,
            stock: 5,
            stockCritico: 2,
            descripcion: 'Guitarra electrica',
            imagen: '',
            destacado: true,
            categoriaId: 2,
        });
        expect(creado.id).toBe(10);
    });

    it('ajustarStockProducto llama PUT /api/v1/productos/{codigo}/stock', async () => {
        const putSpy = vi.spyOn(sVivoApi, 'put').mockResolvedValue({
            data: { codigo: 'GE001', stock: 3 },
        });

        const actualizado = await ajustarStockProducto('GE001', -1);

        expect(putSpy).toHaveBeenCalledWith('/api/v1/productos/GE001/stock', { cantidadCambio: -1 });
        expect(actualizado.stock).toBe(3);
    });

    it('eliminarProductoApi llama DELETE /api/v1/productos/{codigo}', async () => {
        const deleteSpy = vi.spyOn(sVivoApi, 'delete').mockResolvedValue({ status: 204 });

        await eliminarProductoApi('GE001');

        expect(deleteSpy).toHaveBeenCalledWith('/api/v1/productos/GE001');
    });
});

