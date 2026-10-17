import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Producto } from '../../src/components/Producto';

const producto = {
    codigo: 'GA001',
    nombre: 'Guitarra Acústica',
    categoria: 'Guitarras',
    marca: 'Yamaha',
    modelo: 'F310',
    descripcion: 'Guitarra para comenzar a tocar.',
    precio: 129990,
    stock: 5,
    imagen: '/guitarra-prueba.jpg',
};

describe('Tarjeta de producto', () => {
    it('muestra el nombre y el precio en pesos chilenos', () => {
        render(<MemoryRouter><Producto producto={producto} /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: producto.nombre })).toBeInTheDocument();
        expect(screen.getByText('$129.990')).toBeInTheDocument();
    });

    it('enlaza al detalle del producto correcto', () => {
        render(<MemoryRouter><Producto producto={producto} /></MemoryRouter>);

        expect(screen.getByRole('link', { name: 'Ver Detalle' }))
            .toHaveAttribute('href', '/producto/GA001');
    });

    it('deshabilita añadir cuando no hay stock y no llama a la función', async () => {
        const usuario = userEvent.setup();
        const agregar = vi.fn();
        render(
            <MemoryRouter>
                <Producto producto={{ ...producto, stock: 0 }} onAgregarAlCarrito={agregar} />
            </MemoryRouter>
        );

        const boton = screen.getByRole('button', { name: 'Agotado' });
        expect(boton).toBeDisabled();
        await usuario.click(boton);
        expect(agregar).not.toHaveBeenCalled();
    });

    it('al hacer clic, comunica el producto y una unidad al carrito', async () => {
        const usuario = userEvent.setup();
        // Este mock registra las llamadas, sin utilizar el carrito real.
        const agregar = vi.fn();
        render(
            <MemoryRouter>
                <Producto producto={producto} onAgregarAlCarrito={agregar} />
            </MemoryRouter>
        );

        await usuario.click(screen.getByRole('button', { name: /Añadir/ }));

        expect(agregar).toHaveBeenCalledTimes(1);
        expect(agregar).toHaveBeenCalledWith(producto, 1);
    });
});
