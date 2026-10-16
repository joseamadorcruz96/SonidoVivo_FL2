import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Context Providers ---
import { AuthProvider } from './Context/AuthContext';
import { CarritoProvider } from './Context/CarritoContext';

// --- Layouts y Guardias ---
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// --- Páginas Públicas ---
import { Inicio } from './pages/Inicio';
import { Nosotros } from './pages/Nosotros';
import { Catalogo } from './pages/tienda/Catalogo';
import { Carrito } from './pages/tienda/Carrito';
import { Blogs } from './pages/Blogs';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

// --- Páginas Protegidas por Rol ---
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProductos } from './pages/AdminProductos';
import { VendedorDashboard } from './pages/VendedorDashboard';

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
              <Route path="Carrito" element={<Carrito />} />
              <Route path="Blogs" element={<Blogs />} />
              <Route path="Contacto" element={<Contacto />} />
              <Route path="login" element={<Login />} />
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
