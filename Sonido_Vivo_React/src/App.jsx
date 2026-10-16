import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Context Providers ---
import { AuthProvider } from './Context/AuthContext';
import { CarritoProvider } from './Context/CarritoContext';

// --- Layouts y Guardias ---
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './Context/ProtectedRoute';

// --- Páginas Públicas ---
import { Inicio } from './pages/tienda/Inicio';
import { Nosotros } from './pages/tienda/Nosotros';
import { Catalogo } from './pages/tienda/Catalogo';
import { Carrito } from './pages/tienda/Carrito';
import { Blogs } from './pages/tienda/Blogs';
import { Contacto } from './pages/tienda/Contacto';
import { DetalleProducto } from './pages/tienda/DetalleProducto';
import { Login } from './pages/Login';
import { Registro } from './pages/tienda/Registro';
import { NotFound } from './pages/NotFound';

// --- Páginas Protegidas por Rol ---
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductos } from './pages/admin/AdminProductos';
import { VendedorDashboard } from './pages/admin/VendedorDashboard';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. RUTAS PÚBLICAS (Dentro de MainLayout) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Inicio />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="Catalogo" element={<Catalogo />} />
              <Route path="producto/:codigo" element={<DetalleProducto />} />
              <Route path="Carrito" element={<Carrito />} />
              <Route path="Blogs" element={<Blogs />} />
              <Route path="Contacto" element={<Contacto />} />
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Registro />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* 2. RUTAS PROTEGIDAS (FUERA de MainLayout) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute rolPermitido="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
            </Route>

            <Route
              path="/vendedor"
              element={
                <ProtectedRoute rolPermitido="vendedor">
                  <VendedorDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}
