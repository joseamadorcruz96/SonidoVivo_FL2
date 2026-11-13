import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Ofertas } from '../../src/pages/tienda/Ofertas';
import { CarritoProvider } from '../../src/Context/CarritoContext';
import * as productoService from '../../src/services/productoService';

const PRODUCTOS_OFERTA_MOCK = [
    {
        codigo: 'PE001',
        nombre: 'Pedal Overdrive Clasico',
        categoria: 'Pedales de Efectos',
        marca: 'Boss',
        precio: 89990,
        stock: 6,
        stockCritico: 2,
        destacado: true,
        imagen: 'https://example.com/pedal.jpg',
    },
];

describe('Pruebas unitarias en la vista de Ofertas', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        vi.spyOn(productoService, 'listarProductos').mockResolvedValue(PRODUCTOS_OFERTA_MOCK);
    });

    it('Renderizado correcto: Muestra el banner y los productos con precio promocional', async () => {
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
        expect(await screen.findByText(/Pedal Overdrive Clasico/i)).toBeInTheDocument();
    });
});
