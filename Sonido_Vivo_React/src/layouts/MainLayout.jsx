import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbarr';
import { PiePagina } from '../components/PiePagina';

export function MainLayout() {
    return (
        <div>
            {/* 1. Menú persistente superior */}
            <header className="encabezado-tienda">
                <Navbar />
            </header>

            {/* 2. El hueco donde entrarán Home, About o Products según la URL */}
            <main>
                <Outlet />
            </main>

            {/* 3. Pie de página persistente */}
            <PiePagina />
        </div>
    );
}
