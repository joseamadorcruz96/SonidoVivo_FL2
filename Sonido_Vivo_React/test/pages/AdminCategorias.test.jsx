import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdminCategorias } from '../../src/pages/admin/AdminCategorias';

describe('Pruebas unitarias en AdminCategorias', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    it('Renderizado correcto: Muestra título, formulario y lista de categorías predeterminadas', () => {
        render(
            <MemoryRouter>
                <AdminCategorias />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: /Mantenedor de Categorías/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Nueva Categoría/i })).toBeInTheDocument();
        expect(screen.getByText('Guitarras Acústicas')).toBeInTheDocument();
        expect(screen.getByText('Bajos Eléctricos')).toBeInTheDocument();
    });

    it('Gestión de estado y eventos: Permite agregar una nueva categoría y la muestra en la tabla', async () => {
        const usuario = userEvent.setup();
        render(
            <MemoryRouter>
                <AdminCategorias />
            </MemoryRouter>
        );

        const inputNombre = screen.getByPlaceholderText(/Ej: Teclados, Percusión.../i);
        const botonGuardar = screen.getByRole('button', { name: 'Guardar Categoría' });

        await usuario.type(inputNombre, 'Instrumentos de Viento');
        await usuario.click(botonGuardar);

        expect(screen.getByText('Instrumentos de Viento')).toBeInTheDocument();
    });

});
