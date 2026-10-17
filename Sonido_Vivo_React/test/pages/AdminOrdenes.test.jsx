import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdminOrdenes } from '../../src/pages/admin/AdminOrdenes';

describe('Pruebas unitarias en AdminOrdenes', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    it('Renderizado condicional: Muestra aviso cuando no hay órdenes registradas', () => {
        render(
            <MemoryRouter>
                <AdminOrdenes />
            </MemoryRouter>
        );

        expect(screen.getByText('No se encontraron órdenes registradas')).toBeInTheDocument();
    });

    it('Renderizado correcto y apertura de Boleta al interactuar', async () => {
        const ordenMock = [
            {
                id: 101,
                numeroOrden: '#20240705',
                codigoOrden: 'ORDER-12345',
                fecha: new Date().toISOString(),
                cliente: { nombre: 'Pedro', apellidos: 'Hacker', email: 'pedro@gmail.com' },
                direccion: { calle: 'Av. Siempre Viva 123', comuna: 'Santiago', region: 'Metropolitana' },
                items: [{ codigo: 'GA001', nombre: 'Guitarra Folk', precio: 100000, cantidad: 1 }],
                total: 100000,
                estado: 'completada'
            }
        ];
        localStorage.setItem('sv_ordenes', JSON.stringify(ordenMock));

        const usuario = userEvent.setup();

        render(
            <MemoryRouter>
                <AdminOrdenes />
            </MemoryRouter>
        );

        expect(screen.getByText('#20240705')).toBeInTheDocument();
        expect(screen.getByText('Pedro Hacker')).toBeInTheDocument();

        // Clic en ver boleta
        const botonBoleta = screen.getByRole('button', { name: /Ver Boleta/i });
        await usuario.click(botonBoleta);

        // Debe abrir modal con la boleta electrónica
        expect(screen.getByText(/Boleta Electrónica #20240705/i)).toBeInTheDocument();
        expect(screen.getByText(/Sonido Vivo Instrumentos SpA/i)).toBeInTheDocument();
    });

});
