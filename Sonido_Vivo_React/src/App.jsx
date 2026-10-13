import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- Contextos (Traídos por tu amigo) ---
import { AuthProvider } from './Context/AuthContext';
import { CarritoProvider } from './Context/CarritoContext';

// --- Layout y Páginas Públicas ---
import { MainLayout } from './layouts/MainLayout';
import { Inicio } from './pages/Inicio';
import { Nosotros } from './pages/Nosotros';
import { Catalogo } from './pages/tienda/Catalogo';
import { Carrito } from './pages/tienda/Carrito';
import { Blogs } from './pages/Blogs';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

// --- Componentes de Seguridad y Paneles (Tu trabajo) ---
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './pages/AdminDashboard';
import { VendedorDashboard } from './pages/VendedorDashboard';

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              
              {/* Rutas Públicas */}
              <Route index element={<Inicio />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="Catalogo" element={<Catalogo />} />
              <Route path="Carrito" element={<Carrito />} />
              <Route path="Blogs" element={<Blogs />} />
              <Route path="Contacto" element={<Contacto />} />
              <Route path="login" element={<Login />} />

              {/* Rutas Protegidas por Rol */}
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute rolPermitido="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="vendedor" 
                element={
                  <ProtectedRoute rolPermitido="vendedor">
                    <VendedorDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Ruta 404 (No encontrada) */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}