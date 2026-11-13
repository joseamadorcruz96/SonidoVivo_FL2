import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../src/Context/AuthContext';
import { ProtectedRoute } from '../../src/Context/ProtectedRoute';
import { ROLES } from '../../src/services/authService';

function renderConRouter(rutaInicial, usuarioMock = null) {
    if (usuarioMock) {
        localStorage.setItem('sv_token', 'jwt-test-rbac');
        localStorage.setItem('sv_usuario', JSON.stringify(usuarioMock));
    }

    return render(
        <AuthProvider>
            <MemoryRouter initialEntries={[rutaInicial]}>
                <Routes>
                    <Route path="/" element={<div>Tienda Publica</div>} />
                    <Route path="/login" element={<div>Pantalla Login</div>} />
                    <Route
                        path="/admin"
                        element={<ProtectedRoute rolesPermitidos={[ROLES.ADMIN, ROLES.VENDEDOR]} />}
                    >
                        <Route path="productos" element={<div>Vista Productos</div>} />
                        <Route path="ordenes" element={<div>Vista Ordenes</div>} />
                        <Route element={<ProtectedRoute rolesPermitidos={[ROLES.ADMIN]} />}>
                            <Route index element={<div>Dashboard Admin</div>} />
                            <Route path="usuarios" element={<div>Vista Usuarios</div>} />
                        </Route>
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthProvider>
    );
}

describe('ProtectedRoute — Control RBAC directo en el router', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('redirige a /login cuando no hay sesion activa', () => {
        renderConRouter('/admin/productos');
        expect(screen.getByText('Pantalla Login')).toBeInTheDocument();
    });

    it('redirige a tienda publica cuando un CLIENTE intenta entrar a /admin/productos', () => {
        renderConRouter('/admin/productos', { idUsuario: 1, rol: 'CLIENTE' });
        expect(screen.getByText('Tienda Publica')).toBeInTheDocument();
    });

    it('permite a VENDEDOR ver productos y ordenes pero lo bloquea en rutas exclusivas de ADMIN', () => {
        renderConRouter('/admin/ordenes', { idUsuario: 2, rol: 'VENDEDOR' });
        expect(screen.getByText('Vista Ordenes')).toBeInTheDocument();

        localStorage.clear();
        renderConRouter('/admin/usuarios', { idUsuario: 2, rol: 'VENDEDOR' });
        expect(screen.getByText('Vista Productos')).toBeInTheDocument();
    });

    it('permite a ADMIN acceder a rutas exclusivas como /admin/usuarios', () => {
        renderConRouter('/admin/usuarios', { idUsuario: 3, rol: 'ADMIN' });
        expect(screen.getByText('Vista Usuarios')).toBeInTheDocument();
    });
});

