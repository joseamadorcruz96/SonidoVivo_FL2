import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ResumenPedido } from '../../src/components/carrito/ResumenPedido';

describe('Pruebas unitarias en ResumenPedido', () => {

    it('Prop testing: Renderiza correctamente las cantidades y montos pasados por props', () => {
        render(
            <MemoryRouter>
                <ResumenPedido total={150000} cantidadTotal={3} />
            </MemoryRouter>
        );

        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('$150.000')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Continuar al Pago/i })).toHaveAttribute('href', '/checkout');
    });

    it('Renderizado condicional de botón vaciar carrito según prop onVaciar', () => {
        const { rerender } = render(
            <MemoryRouter>
                <ResumenPedido total={50000} cantidadTotal={1} />
            </MemoryRouter>
        );

        // Sin onVaciar, no debe mostrarse el botón
        expect(screen.queryByRole('button', { name: /Vaciar Carrito/i })).not.toBeInTheDocument();

        // Con onVaciar, sí debe renderizarse
        rerender(
            <MemoryRouter>
                <ResumenPedido total={50000} cantidadTotal={1} onVaciar={() => {}} />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /Vaciar Carrito/i })).toBeInTheDocument();
    });

});
