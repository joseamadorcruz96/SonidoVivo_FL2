import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Categorias } from '../../src/pages/tienda/Categorias';
import { CarritoProvider } from '../../src/Context/CarritoContext';
import { productosIniciales } from '../../src/data/productosIniciales';

describe('Pruebas en la vista de Categorías', () => {

    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('sv_productos', JSON.stringify(productosIniciales));
    });

    it('Renderizado correcto: Muestra el título y todos los productos inicialmente', () => {
        render(
            <MemoryRouter>
                <CarritoProvider>
                    <Categorias />
                </CarritoProvider>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Categorías de Instrumentos/i);
        expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Guitarras Acústicas' })).toBeInTheDocument();
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

        // Hacer clic en el botón de categoría "Bajos Eléctricos"
        const botonBajos = screen.getByRole('button', { name: 'Bajos Eléctricos' });
        await usuario.click(botonBajos);

        // Debe mostrar productos de bajos y no guitarras
        expect(screen.getByText(/Bajo Eléctrico 4 Cuerdas/i)).toBeInTheDocument();
        expect(screen.queryByText(/Guitarra Acústica Folk/i)).not.toBeInTheDocument();
    });

});
