import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbarr';

export function MainLayout() {
    return (
        <div>
            {/* 1. Menú persistente superior */}
            <Navbar />

            {/* 2. El hueco donde entrarán Home, About o Products según la URL */}
            <main>
                <Outlet />
            </main>

            {/* 3. Pie de página persistente */}
            <footer>
                © Guía Práctica de React Router
            </footer>
        </div>
    );
}