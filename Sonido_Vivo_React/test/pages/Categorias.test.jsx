import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Categorias } from '../../src/pages/tienda/Categorias';
import { CarritoProvider } from '../../src/Context/CarritoContext';
import * as productoService from '../../src/services/productoService';

const PRODUCTOS_MOCK = [
    {
        codigo: 'GA001',
        nombre: 'Guitarra Acústica Folk',
        categoria: 'Guitarras Acústicas',
        marca: 'Yamaha',
        precio: 149990,
        stock: 5,
        stockCritico: 2,
        imagen: 'https://example.com/ga.jpg',
        descripcion: 'Guitarra acustica de estudio',
    },
    {
        codigo: 'BE001',
        nombre: 'Bajo Eléctrico 4 Cuerdas',
        categoria: 'Bajos Eléctricos',
        marca: 'Squier',
        precio: 249990,
        stock: 3,
        stockCritico: 1,
        imagen: 'https://example.com/be.jpg',
        descripcion: 'Bajo jazz de 4 cuerdas',
    },
];

describe('Pruebas en la vista de Categorías', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        vi.spyOn(productoService, 'listarProductos').mockResolvedValue(PRODUCTOS_MOCK);
    });

    it('Renderizado correcto: Muestra el título y todos los productos inicialmente', async () => {
        render(
            <MemoryRouter>
                <CarritoProvider>
                    <Categorias />
                </CarritoProvider>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Categorías de Instrumentos/i);
        expect(await screen.findByRole('button', { name: 'Guitarras Acústicas' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument();
        expect(screen.getByText(/Guitarra Acústica Folk/i)).toBeInTheDocument();
    });

    it('Filtra los productos al hacer clic en una categoría específica', async () => {
        const usuario = userEvent.setup();
        render(
            <MemoryRouter>
                <CarritoProvider>
                    <Categorias />
                </CarritoProvider>
            </MemoryRouter>
        );

        const botonBajos = await screen.findByRole('button', { name: 'Bajos Eléctricos' });
        await usuario.click(botonBajos);

        expect(screen.getByText(/Bajo Eléctrico 4 Cuerdas/i)).toBeInTheDocument();
        expect(screen.queryByText(/Guitarra Acústica Folk/i)).not.toBeInTheDocument();
    });
});
