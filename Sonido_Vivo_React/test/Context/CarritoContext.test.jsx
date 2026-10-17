import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CarritoProvider, useCarrito } from '../../src/Context/CarritoContext';

// Pruebas unitarias para la lógica del CarritoContext
describe('Pruebas unitarias en CarritoContext', () => {

    const wrapper = ({ children }) => <CarritoProvider>{children}</CarritoProvider>;

    beforeEach(() => {
        localStorage.clear();
    });

    it('Debe inicializar con el carrito vacío y totales en cero', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        expect(result.current.carrito).toEqual([]);
        expect(result.current.cantidadTotal).toBe(0);
        expect(result.current.totalPagar).toBe(0);
    });

    it('Debe agregar un producto nuevo al carrito y calcular totales', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        const producto = { codigo: 'GA001', nombre: 'Guitarra Acústica', precio: 100000, stock: 5 };

        act(() => {
            result.current.agregarAlCarrito(producto, 2);
        });

        expect(result.current.carrito).toHaveLength(1);
        expect(result.current.carrito[0].cantidad).toBe(2);
        expect(result.current.cantidadTotal).toBe(2);
        expect(result.current.totalPagar).toBe(200000);
    });

    it('Debe incrementar la cantidad sin duplicar el producto si ya existe', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        const producto = { codigo: 'GE001', nombre: 'Guitarra Eléctrica', precio: 150000, stock: 10 };

        act(() => {
            result.current.agregarAlCarrito(producto, 1);
            result.current.agregarAlCarrito(producto, 2);
        });

        expect(result.current.carrito).toHaveLength(1);
        expect(result.current.carrito[0].cantidad).toBe(3);
        expect(result.current.totalPagar).toBe(450000);
    });

    it('No debe permitir sobrepasar el stock máximo disponible del producto', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        const producto = { codigo: 'BA001', nombre: 'Batería', precio: 300000, stock: 3 };

        act(() => {
            result.current.agregarAlCarrito(producto, 5);
        });

        expect(result.current.carrito[0].cantidad).toBe(3);
    });

    it('Debe eliminar el producto si la nueva cantidad es 0', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        const producto = { codigo: 'AMP01', nombre: 'Amplificador', precio: 80000, stock: 5 };

        act(() => {
            result.current.agregarAlCarrito(producto, 2);
        });

        act(() => {
            result.current.cambiarCantidad('AMP01', 0);
        });

        expect(result.current.carrito).toHaveLength(0);
        expect(result.current.totalPagar).toBe(0);
    });

    it('Debe eliminar un producto específico con quitarDelCarrito', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        const p1 = { codigo: 'P1', nombre: 'Púa', precio: 1000, stock: 10 };
        const p2 = { codigo: 'P2', nombre: 'Correa', precio: 5000, stock: 5 };

        act(() => {
            result.current.agregarAlCarrito(p1, 1);
            result.current.agregarAlCarrito(p2, 1);
        });

        act(() => {
            result.current.quitarDelCarrito('P1');
        });

        expect(result.current.carrito).toHaveLength(1);
        expect(result.current.carrito[0].codigo).toBe('P2');
        expect(result.current.totalPagar).toBe(5000);
    });

    it('Debe vaciar todo el carrito correctamente', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });

        act(() => {
            result.current.agregarAlCarrito({ codigo: 'X', precio: 10000, stock: 5 }, 3);
            result.current.vaciarCarrito();
        });

        expect(result.current.carrito).toEqual([]);
        expect(result.current.cantidadTotal).toBe(0);
        expect(result.current.totalPagar).toBe(0);
        expect(JSON.parse(localStorage.getItem('sv_carrito'))).toEqual([]);
    });

    it('actualiza la cantidad positiva y recalcula ambos totales', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });
        act(() => result.current.agregarAlCarrito({ codigo: 'P1', precio: 1000, stock: 5 }));
        act(() => result.current.cambiarCantidad('P1', 3));

        expect(result.current.carrito[0].cantidad).toBe(3);
        expect(result.current.cantidadTotal).toBe(3);
        expect(result.current.totalPagar).toBe(3000);
    });

    it('limita al stock al incrementar un producto existente o cambiar su cantidad', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });
        const producto = { codigo: 'P1', precio: 1000, stock: 3 };
        act(() => result.current.agregarAlCarrito(producto, 2));
        act(() => result.current.agregarAlCarrito(producto, 5));
        expect(result.current.carrito[0].cantidad).toBe(3);

        act(() => result.current.cambiarCantidad('P1', 8));
        expect(result.current.cantidadTotal).toBe(3);
        expect(result.current.totalPagar).toBe(3000);
    });

    it('guarda los artículos y cantidades en localStorage al añadir', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });
        act(() => result.current.agregarAlCarrito({ codigo: 'P1', precio: 1000, stock: 5 }, 2));

        const guardados = JSON.parse(localStorage.getItem('sv_carrito'));
        expect(guardados).toHaveLength(1);
        expect(guardados[0]).toMatchObject({ codigo: 'P1', cantidad: 2 });
    });

    it('recupera el carrito guardado y sus totales al iniciar', () => {
        localStorage.setItem('sv_carrito', JSON.stringify([
            { codigo: 'P1', precio: 1000, stock: 5, cantidad: 2 },
        ]));
        const { result } = renderHook(() => useCarrito(), { wrapper });

        expect(result.current.carrito[0].cantidad).toBe(2);
        expect(result.current.cantidadTotal).toBe(2);
        expect(result.current.totalPagar).toBe(2000);
    });

    it('no incorpora un producto nuevo sin stock', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });
        act(() => result.current.agregarAlCarrito({ codigo: 'P1', precio: 1000, stock: 0 }));

        expect(result.current.carrito).toEqual([]);
        expect(result.current.cantidadTotal).toBe(0);
        expect(result.current.totalPagar).toBe(0);
    });

    it('no incrementa un producto existente si llega sin stock', () => {
        const { result } = renderHook(() => useCarrito(), { wrapper });
        const producto = { codigo: 'P1', precio: 1000, stock: 2 };
        act(() => result.current.agregarAlCarrito(producto));
        act(() => result.current.agregarAlCarrito({ ...producto, stock: 0 }));

        expect(result.current.cantidadTotal).toBe(1);
        expect(result.current.totalPagar).toBe(1000);
    });

    it('no permite aumentar un artículo guardado cuyo stock es cero', () => {
        localStorage.setItem('sv_carrito', JSON.stringify([
            { codigo: 'P1', precio: 1000, stock: 0, cantidad: 0 },
        ]));
        const { result } = renderHook(() => useCarrito(), { wrapper });
        act(() => result.current.cambiarCantidad('P1', 2));

        expect(result.current.carrito).toEqual([]);
        expect(result.current.totalPagar).toBe(0);
    });

    it('no cuenta como una unidad una cantidad cero guardada previamente', () => {
        localStorage.setItem('sv_carrito', JSON.stringify([
            { codigo: 'P1', precio: 1000, stock: 0, cantidad: 0 },
        ]));
        const { result } = renderHook(() => useCarrito(), { wrapper });

        expect(result.current.cantidadTotal).toBe(0);
        expect(result.current.totalPagar).toBe(0);
    });

});
