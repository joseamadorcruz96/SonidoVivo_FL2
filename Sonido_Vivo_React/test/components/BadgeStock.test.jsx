import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BadgeStock } from '../../src/components/BadgeStock';

// Pruebas unitarias para el componente de alertas de inventario BadgeStock
describe('Pruebas unitarias en BadgeStock', () => {

    it('Debe renderizar "Agotado" con estilo bg-danger cuando el stock es 0', () => {
        const { container } = render(<BadgeStock stock={0} />);

        expect(screen.getByText('Agotado')).toBeDefined();
        const badge = container.querySelector('.badge');
        expect(badge.className).toContain('bg-danger');
    });

    it('Debe mostrar Agotado cuando el stock es negativo', () => {
        render(<BadgeStock stock={-1} />);

        expect(screen.getByText('Agotado')).toHaveClass('bg-danger');
    });

    it('Debe renderizar "Stock Crítico" con estilo bg-warning cuando stock <= stockCritico', () => {
        const { container } = render(<BadgeStock stock={2} stockCritico={2} />);

        expect(screen.getByText('⚠️ Stock Crítico (2 un.)')).toBeDefined();
        const badge = container.querySelector('.badge');
        expect(badge.className).toContain('bg-warning');
        expect(badge.getAttribute('title')).toBe('Últimas unidades en inventario');
    });

    it('Debe renderizar "Stock: X un." con estilo bg-success cuando hay disponibilidad normal', () => {
        const { container } = render(<BadgeStock stock={10} stockCritico={2} />);

        expect(screen.getByText('Stock: 10 un.')).toBeDefined();
        const badge = container.querySelector('.badge');
        expect(badge.className).toContain('bg-success');
    });

    it('Debe renderizar solo el número cuando la prop compacto es true', () => {
        render(<BadgeStock stock={3} stockCritico={1} compacto={true} />);

        expect(screen.getByText('3')).toBeDefined();
    });

    it('Debe convertir correctamente strings numéricos pasados como stock', () => {
        render(<BadgeStock stock="5" stockCritico="2" />);

        expect(screen.getByText('Stock: 5 un.')).toBeDefined();
    });

});
