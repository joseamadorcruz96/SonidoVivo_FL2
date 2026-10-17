import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Ofertas } from '../../src/pages/tienda/Ofertas';
import { CarritoProvider } from '../../src/Context/CarritoContext';
import { productosIniciales } from '../../src/data/productosIniciales';

describe('Pruebas unitarias en la vista de Ofertas', () => {

    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('sv_productos', JSON.stringify(productosIniciales));
    });

    it('Renderizado correcto: Muestra el banner y los productos con precio promocional', () => {
        render(
            <MemoryRouter>
                <CarritoProvider>
                    <Ofertas />
                </CarritoProvider>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Zona de Ofertas Especiales/i);
        expect(screen.getByText(/Promociones de Temporada/i)).toBeInTheDocument();
        expect(screen.getByText(/Oportunidades activas/i)).toBeInTheDocument();
    });

});
