import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Inicio } from './pages/Inicio';
import { Nosotros } from './pages/Nosotros';
import { Catalogo } from './pages/Catalogo';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta padre que envuelve la estructura con MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* 'index' indica que es la página mostrada en la raíz "/" */}
          <Route index element={<Inicio />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="Catalogo" element={<Catalogo />} />

          {/* '*' captura cualquier otra URL no registrada y muestra el error 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}