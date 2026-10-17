import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CompraExitosa } from '../../src/pages/tienda/CompraExitosa';
import { PagoError } from '../../src/pages/tienda/PagoError';

describe('Pruebas unitarias en Confirmaciones de Pago', () => {

    it('CompraExitosa: Renderiza datos de orden confirmada y botón de imprimir boleta', () => {
        render(
            <MemoryRouter>
                <CompraExitosa />
            </MemoryRouter>
        );

        expect(screen.getByText(/Se ha realizado la compra/i)).toBeInTheDocument();
        expect(screen.getByText(/Información del Cliente/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Imprimir boleta en PDF/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Volver a la tienda/i })).toHaveAttribute('href', '/Catalogo');
    });

    it('PagoError: Renderiza aviso de transacción rechazada y botón de reintento', () => {
        render(
            <MemoryRouter>
                <PagoError />
            </MemoryRouter>
        );

        expect(screen.getByText(/No se pudo realizar el pago/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Volver a realizar el pago/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Volver al Carrito/i })).toHaveAttribute('href', '/Carrito');
    });

});
