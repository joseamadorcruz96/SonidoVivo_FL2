import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <section>
            <h2>404 - Página no encontrada</h2>
            <Link to="/">Volver al Inicio</Link>
        </section>
    );
}