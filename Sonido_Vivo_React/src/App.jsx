import { BrowserRouter, Routes, Route } from 'react-router-dom';
// --- Componentes y Páginas Activas (Implementadas) ---
import { MainLayout } from './layouts/MainLayout';
import { Inicio } from './pages/Inicio';
import { Nosotros } from './pages/Nosotros';
import { Catalogo } from './pages/tienda/Catalogo';
import { Carrito } from './pages/tienda/Carrito';
import { Blogs } from './pages/Blogs';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/Login_Beta';
import { NotFound } from './pages/NotFound';
import { AuthProvider } from './Context/AuthContext';
import { CarritoProvider } from './Context/CarritoContext';

// --- Páginas de Tienda pendientes (Descomentar al crearlas en src/pages/) ---
// import { DetalleProducto } from './pages/DetalleProducto';
// import { DetalleBlog } from './pages/DetalleBlog';
// import { Registro } from './pages/Registro';

// --- Layouts y Seguridad de Administración pendientes (Descomentar al crearlos) ---
// import { RutaProtegida } from './components/RutaProtegida';
// import { AdminLayout } from './layouts/AdminLayout';
// import { AdminDashboard } from './pages/AdminDashboard';
// import { ListadoProductos } from './pages/ListadoProductos';
// import { FormProducto } from './pages/FormProducto';
// import { ListadoOrdenes } from './pages/ListadoOrdenes';
// import { ListadoUsuarios } from './pages/ListadoUsuarios';
// import { FormUsuario } from './pages/FormUsuario';

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Inicio />} />
              <Route path="Nosotros" element={<Nosotros />} />
              <Route path="Catalogo" element={<Catalogo />} />
              {/* <Route path="Catalogo/:id" element={<DetalleProducto />} /> */}
              <Route path="Carrito" element={<Carrito />} />
              <Route path="Blogs" element={<Blogs />} />
              {/* <Route path="blogs/:id" element={<DetalleBlog />} /> */}
              <Route path="Contacto" element={<Contacto />} />
              <Route path="Login" element={<Login />} />
              {/* <Route path="Registro" element={<Registro />} /> */}
            </Route>

            {/* ========================================================================= */}
            {/* Rutas de administración protegidas (Descomentar al crear los componentes) */}
            {/* ========================================================================= */}
            {/*
            <Route
              element={
                <RutaProtegida
                  rolesPermitidos={['Administrador', 'Vendedor']}
                />
              }
            >
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="productos" element={<ListadoProductos />} />
                <Route path="productos/nuevo" element={<FormProducto />} />
                <Route path="productos/editar/:id" element={<FormProducto />} />
                <Route path="ordenes" element={<ListadoOrdenes />} />

                <Route
                  element={
                    <RutaProtegida
                      rolesPermitidos={['Administrador']}
                    />
                  }
                >
                  <Route path="usuarios" element={<ListadoUsuarios />} />
                  <Route path="usuarios/nuevo" element={<FormUsuario />} />
                  <Route path="usuarios/editar/:id" element={<FormUsuario />} />
                </Route>
              </Route>
            </Route>
            */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}