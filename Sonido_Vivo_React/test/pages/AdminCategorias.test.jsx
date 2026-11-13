import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdminCategorias } from '../../src/pages/admin/AdminCategorias';
import * as categoriaService from '../../src/services/categoriaService';
import * as productoService from '../../src/services/productoService';

const CATEGORIAS_MOCK = [
    { id: 1, nombre: 'Guitarras Acústicas', descripcion: 'Acústicas y folk' },
    { id: 2, nombre: 'Bajos Eléctricos', descripcion: 'Bajos 4 y 5 cuerdas' },
];

describe('Pruebas unitarias en AdminCategorias', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
        vi.spyOn(categoriaService, 'listarCategorias').mockResolvedValue(CATEGORIAS_MOCK);
        vi.spyOn(productoService, 'listarProductos').mockResolvedValue([]);
    });

    it('Renderizado correcto: Muestra título, formulario y lista de categorías del servidor', async () => {
        render(
            <MemoryRouter>
                <AdminCategorias />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: /Mantenedor de Categorías/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Nueva Categoría/i })).toBeInTheDocument();
        expect(await screen.findByText('Guitarras Acústicas')).toBeInTheDocument();
        expect(screen.getByText('Bajos Eléctricos')).toBeInTheDocument();
    });

    it('Gestión de estado y eventos: Permite agregar una nueva categoría y la muestra en la tabla', async () => {
        vi.spyOn(categoriaService, 'crearCategoria').mockResolvedValue({
            id: 3,
            nombre: 'Instrumentos de Viento',
            descripcion: '',
        });

        const usuario = userEvent.setup();
        render(
            <MemoryRouter>
                <AdminCategorias />
            </MemoryRouter>
        );

        expect(await screen.findByText('Guitarras Acústicas')).toBeInTheDocument();

        const inputNombre = screen.getByPlaceholderText(/Ej: Teclados, Percusión.../i);
        const botonGuardar = screen.getByRole('button', { name: 'Guardar Categoría' });

        await usuario.type(inputNombre, 'Instrumentos de Viento');
        await usuario.click(botonGuardar);

        expect(await screen.findByText('Instrumentos de Viento')).toBeInTheDocument();
    });
});
