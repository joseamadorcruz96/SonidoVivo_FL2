import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../src/Context/AuthContext';
import { AdminLayout } from '../../src/layouts/AdminLayout';

function renderLayoutConRol(rol) {
    localStorage.setItem('sv_token', 'jwt-layout-test');
    localStorage.setItem(
        'sv_usuario',
        JSON.stringify({ idUsuario: 9, nombre: 'Tester', rol })
    );

    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={['/admin/productos']}>
                <Routes>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="productos" element={<div>Contenido Productos</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );
}

describe('AdminLayout — Menu lateral filtrado por rol (Anexo 1)', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('oculta Dashboard, Categorias, Usuarios, Reportes y Perfil cuando el rol es VENDEDOR', () => {
        renderLayoutConRol('VENDEDOR');

        expect(screen.getByText(/Órdenes y Boletas/i)).toBeInTheDocument();
        expect(screen.getByText(/Productos y Stock/i)).toBeInTheDocument();

        expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Categorías/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Usuarios/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Reportes/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Mi Perfil/i)).not.toBeInTheDocument();
    });

    it('muestra todos los accesos del panel cuando el rol es ADMIN', () => {
        renderLayoutConRol('ADMIN');

        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Órdenes y Boletas/i)).toBeInTheDocument();
        expect(screen.getByText(/Productos y Stock/i)).toBeInTheDocument();
        expect(screen.getByText(/Categorías/i)).toBeInTheDocument();
        expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
        expect(screen.getByText(/Reportes/i)).toBeInTheDocument();
        expect(screen.getByText(/Mi Perfil/i)).toBeInTheDocument();
    });
});
