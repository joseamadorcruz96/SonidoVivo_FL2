import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Inicio } from './pages/Inicio';
import { Nosotros } from './pages/Nosotros';
import { Catalogo } from './pages/Catalogo';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';

// Importamos el guardia y las nuevas vistas
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './pages/AdminDashboard';
import { VendedorDashboard } from './pages/VendedorDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Inicio />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="Catalogo" element={<Catalogo />} />
          <Route path="login" element={<Login />} />

          {/* RUTAS PROTEGIDAS POR ROL */}
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

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}